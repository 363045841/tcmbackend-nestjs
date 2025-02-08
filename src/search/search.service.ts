import { Injectable } from '@nestjs/common';
import { spawn } from 'child_process';
import { IndexTable } from './IndexTable.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import {
  type fuzzySearchClusterErrorRes,
  type fuzzySearchClusterSuccessRes,
} from './search.controller';
import { console } from 'inspector';

@Injectable()
export class SearchService {
  constructor(
    @InjectRepository(IndexTable)
    private readonly indexTableRepository: Repository<IndexTable>,
  ) {}

  private readonly pythonPath = 'python'; // 确保 Python 3 可用

  // 考虑 redis 缓存!
  async fuzzySearch(query: string) {
    try {
      let queryWords: string[] = [];
      const result = await this.getClusterWords(query);

      if ('error' in result) {
        // 找不到聚类簇,直接返回,置空处理给前端
        return (result as fuzzySearchClusterErrorRes).error;
      } else {
        queryWords = (result as fuzzySearchClusterSuccessRes).words;
        const records = await this.getWordRecordByQuery(queryWords[0]);
        console.log(records);
        return records;
      }

      
    } catch (error) {
      console.error('Error during fuzzy search:', error);
      // 这里可以根据需要返回一个错误响应，例如：
      return { error: 'An error occurred while performing the search.' };
    }
  }
  

  getClusterWords(
    query: string,
  ): Promise<fuzzySearchClusterErrorRes | fuzzySearchClusterSuccessRes> {
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

  async getWordRecordByQuery(query: string) {
    return await this.indexTableRepository.find({ where: { word: query } });
  }
}
