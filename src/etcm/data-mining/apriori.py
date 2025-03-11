import sys
import argparse
from mlxtend.frequent_patterns import apriori, association_rules
import pandas as pd

# 解析命令行参数
def parse_args():
    parser = argparse.ArgumentParser(description="Apriori Algorithm for Association Rules")
    parser.add_argument('--support', type=float, required=True, help="Minimum support threshold")
    parser.add_argument('--confidence', type=float, required=True, help="Minimum confidence threshold")
    return parser.parse_args()

# 从标准输入读取数据
def read_input_data():
    lines = sys.stdin.read().strip().split('\n')
    data = [line.split(',') for line in lines]
    return data

# 将数据转换为适合 Apriori 算法的格式
def convert_to_one_hot(data):
    all_items = set(item for transaction in data for item in transaction)
    encoded_data = []
    for transaction in data:
        row = {item: (item in transaction) for item in all_items}
        encoded_data.append(row)
    return pd.DataFrame(encoded_data)

# 主函数
def main():
    try:
        # 解析命令行参数
        args = parse_args()
        min_support = args.support
        min_confidence = args.confidence

        # 读取输入数据
        raw_data = read_input_data()

        # 数据预处理：转换为 one-hot 编码
        df = convert_to_one_hot(raw_data)

        # 使用 Apriori 算法找出频繁项集
        frequent_itemsets = apriori(df, min_support=min_support, use_colnames=True)

        # 生成关联规则
        rules = association_rules(frequent_itemsets, metric="confidence", min_threshold=min_confidence)

        # 按提升度排序
        rules = rules.sort_values(by='lift', ascending=False)

        # 格式化输出结果
        for _, rule in rules.iterrows():
            antecedents = list(rule['antecedents'])
            consequents = list(rule['consequents'])
            confidence = rule['confidence']
            lift = rule['lift']

            # 输出规则为 CSV 格式，方便 NestJS 解析
            print(f"{'、'.join(antecedents)},{'、'.join(consequents)},{confidence:.2f},{lift:.2f}")
    except Exception as e:
        print(f"Error: {str(e)}", file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    main()