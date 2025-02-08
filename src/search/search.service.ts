import { Injectable } from '@nestjs/common';
import { spawn } from 'child_process';

@Injectable()
export class SearchService {
  private readonly pythonPath = 'python'; // 确保 Python 3 可用

  // 考虑 redis 缓存!
  async fuzzySearch(query: string) {
    this.getClusterWords(query)
      .then((res) => {
        console.log(res);
        return res;
      })
      .catch((err) => {
        console.log(err);
      });
  }

  async getClusterWords(query: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const process = spawn('python', ['src\\search\\word2vec.py', query]);

      let output = '';

      process.stdout.on('data', (data) => {
        output += data.toString();
      });

      process.stderr.on('data', (data) => {
        console.error(`Error: ${data}`);
      });

      process.on('close', (code) => {
        if (code === 0) {
          resolve(JSON.parse(output.trim())); // 解析 Python 返回的 JSON 数据
        } else {
          reject('Python script execution failed.');
        }
      });
    });
  }
}
