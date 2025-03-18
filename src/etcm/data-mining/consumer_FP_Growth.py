import sys
import argparse
import pika
import json
from mlxtend.frequent_patterns import fpgrowth, association_rules
import pandas as pd
from collections import Counter

# 解析命令行参数
def parse_args():
    parser = argparse.ArgumentParser(description="FP-Growth Algorithm for Association Rules")
    parser.add_argument('--queue', type=str, required=True, help="RabbitMQ queue name to consume tasks from")
    parser.add_argument('--result-queue', type=str, required=True, help="RabbitMQ queue name to publish results to")
    return parser.parse_args()

# 从 RabbitMQ 消息中解析数据
def read_input_data(message):
    try:
        # 确保 message 是字典类型
        if not isinstance(message, dict):
            raise ValueError("Message is not a dictionary.")

        # 提取 data 字段
        data = message.get('data')
        if not data or not isinstance(data, str) or not data.strip():
            raise ValueError("Missing or empty 'data' field in task.")

        # 解析数据
        return [line.split(',') for line in data.split('\n') if line.strip()]
    except Exception as e:
        print(f"Error parsing input data: {str(e)}", file=sys.stderr)
        return []

# 主函数
def main():
    try:
        # 解析命令行参数
        args = parse_args()
        queue_name = args.queue
        result_queue_name = args.result_queue

        # 连接到 RabbitMQ 服务器
        connection = pika.BlockingConnection(pika.ConnectionParameters('localhost'))
        channel = connection.channel()

        # 声明队列
        channel.queue_declare(queue=queue_name, durable=True)
        channel.queue_declare(queue=result_queue_name, durable=True)

        print(f"Waiting for tasks in queue: {queue_name}. To exit press CTRL+C")

        # 定义回调函数处理任务
        def callback(ch, method, properties, body):
            try:
                # 打印原始消息内容
                raw_message = body.decode('utf-8')
                print(f"Received raw message: {raw_message}")

                # 解析任务消息
                message = json.loads(raw_message)

                # 提取嵌套的任务数据
                task = message.get('data')
                if not task or not isinstance(task, dict):
                    raise ValueError("Invalid task format: expected 'data' field to be a dictionary.")

                support = task.get('support', 0.1)
                confidence = task.get('confidence', 0.3)
                raw_data = read_input_data(task)

                if not raw_data:
                    print("No valid data found in the task.")
                    ch.basic_ack(delivery_tag=method.delivery_tag)
                    return

                # 过滤低频项目
                raw_data = filter_low_frequency_items(raw_data, min_frequency=5)

                # 数据预处理：转换为 one-hot 编码
                df = convert_to_one_hot(raw_data)

                # 使用 FP-Growth 算法找出频繁项集
                frequent_itemsets = fpgrowth(df, min_support=support, use_colnames=True)

                # 生成关联规则
                rules = association_rules(frequent_itemsets, metric="confidence", min_threshold=confidence)

                # 按提升度排序
                rules = rules.sort_values(by='lift', ascending=False)

                # 统计符合规则的输入出现次数
                rule_counts = count_rule_occurrences(rules, raw_data)

                # 格式化输出结果
                results = []
                for _, rule in rules.iterrows():
                    antecedents = set(rule['antecedents'])
                    consequents = set(rule['consequents'])
                    confidence = rule['confidence']
                    lift = rule['lift']

                    # 获取该规则的出现次数
                    rule_key = (frozenset(antecedents), frozenset(consequents))
                    occurrence_count = rule_counts.get(rule_key, 0)

                    # 格式化为 CSV 格式
                    results.append({
                        "antecedents": '、'.join(antecedents),
                        "consequents": '、'.join(consequents),
                        "confidence": round(confidence, 2),
                        "lift": round(lift, 2),
                        "occurrence_count": occurrence_count,
                    })

                # 发送结果到结果队列
                channel.basic_publish(
                    exchange='',
                    routing_key=result_queue_name,
                    body=json.dumps(results),
                    properties=pika.BasicProperties(delivery_mode=2),  # 持久化消息
                )

                print("Task completed and result sent back.")

            except Exception as e:
                print(f"Error processing task: {str(e)}", file=sys.stderr)
            finally:
                # 确保任务被确认，避免重复确认
                try:
                    ch.basic_ack(delivery_tag=method.delivery_tag)
                except Exception as ack_error:
                    print(f"Error acknowledging task: {str(ack_error)}", file=sys.stderr)

        # 设置消费者
        channel.basic_consume(queue=queue_name, on_message_callback=callback)

        # 开始消费
        channel.start_consuming()

    except KeyboardInterrupt:
        print("Stopping consumer...")
        connection.close()
    except Exception as e:
        print(f"Error: {str(e)}", file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    main()