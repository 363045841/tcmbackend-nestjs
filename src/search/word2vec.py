import sys
import pandas as pd
import json

# 读取 CSV 文件（假设 CSV 文件名为 clusters.csv）
""" df = pd.read_csv("src\\search\\kmeans_clusters_v31.csv")  # x, y, word, cluster """
from pathlib import Path
import pandas as pd

# 获取当前 Python 文件所在目录
base_dir = Path(__file__).parent

# 拼接路径（跨平台适用）
csv_path = base_dir / "kmeans_clusters_v31.csv"

# 读取 CSV 文件
df = pd.read_csv(csv_path)


def get_cluster_words(query_word):
    # 查找 query_word 所属的 cluster
    cluster_row = df[df["word"] == query_word]

    if cluster_row.empty:
        return {"error": "word not found"}

    cluster_id = cluster_row["cluster"].values[0]

    # 获取同一 cluster 的所有词
    words_in_cluster = df[df["cluster"] == cluster_id]["word"].tolist()

    return {"cluster": int(cluster_id), "words": words_in_cluster}

if __name__ == "__main__":
    query = sys.argv[1]  # 获取命令行参数
    result = get_cluster_words(query)
    print(json.dumps(result))  # 以 JSON 形式返回
