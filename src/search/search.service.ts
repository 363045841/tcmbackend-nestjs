import { Injectable } from '@nestjs/common';
import { spawn } from 'child_process';
import { IndexTable } from './IndexTable.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { medinfo } from '../medinfo/medinfo.entity';
import { fuzzySearchFinalRes } from './search.controller';

export interface fuzzySearchClusterErrorRes {
  error: string;
}

export interface fuzzySearchClusterSuccessRes {
  cluster: number;
  words: string[];
}

@Injectable()
export class SearchService {
  constructor(
    @InjectRepository(IndexTable)
    private readonly indexTableRepository: Repository<IndexTable>,
    @InjectRepository(medinfo)
    private readonly medinfoRepository: Repository<medinfo>,
  ) {}

  private readonly pythonPath = 'python'; // 确保 Python 3 可用

  async fuzzySearch(query: string) {
    try {
      let queryWords: string[] = [];

      const result = await this.getClusterWords(query);
      if ('error' in result) {
        return result as fuzzySearchClusterErrorRes;
      } else {
        queryWords = (result as fuzzySearchClusterSuccessRes).words;
        let index = queryWords.indexOf(query);
        queryWords.splice(index, 1);
        queryWords.unshift(query);
        let results: IndexTable[] = [];

        // 插桩：获取词条索引的性能监控
        console.time('getWordRecordIndexByQuery');
        for (let word of queryWords) {
          results.push(...(await this.getWordRecordIndexByQuery(word)));
        }
        console.timeEnd('getWordRecordIndexByQuery');

        results.sort((a, b) => {
          if (a.indexValue !== b.indexValue) {
            return a.indexValue - b.indexValue;
          }
          return a.word === query ? -1 : b.word === query ? 1 : 0;
        });

        let results_with_only_index: IndexTable[] = [];
        for (let i = 1; i < results.length; i++) {
          if (results[i].indexValue === results[i - 1].indexValue) {
            continue;
          } else {
            results_with_only_index.push(results[i]);
          }
        }

        let finalRes: fuzzySearchFinalRes[] = [];

        // 插桩：获取药材信息的性能监控
        console.time('getMedInfoByIndex');
        for (let res of results_with_only_index.splice(0, 10)) {
          const record: medinfo | null = await this.getMedInfoByIndex(res.indexValue);
          if (record === null) {
            return { error: '找不到对应的药材信息' };
          } else {
            finalRes.push({
              id: res.id,
              word: res.word,
              indexValue: res.indexValue,
              title: record.tcmName ?? '未知药材',
              description: record.description ?? '暂无描述',
              picUrl: record.pic ?? '',
            });
          }
        }
        console.timeEnd('getMedInfoByIndex');
        return finalRes;
      }
    } catch (error) {
      console.error('Error during fuzzy search:', error);
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

  // 插桩：获取索引的性能监控
  async getWordRecordIndexByQuery(query: string) {
    console.time(`搜索索引: ${query}`);
    const result = await this.indexTableRepository.find({ where: { word: query } });
    console.timeEnd(`搜索索引: ${query}`);
    return result;
  }

  // 插桩：获取药材信息的性能监控
  async getMedInfoByIndex(index: number) {
    console.time(`获取页面数据: ${index}`);
    const result = await this.medinfoRepository.findOneBy({ id: index });
    console.timeEnd(`获取页面数据: ${index}`);
    return result;
  }
}
