import { Injectable } from '@nestjs/common';
import { spawn } from 'child_process';
import { IndexTable } from './IndexTable.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { console } from 'inspector';
import { type fuzzySearchFinalRes } from './search.controller';
import { medinfo } from '../medinfo/medinfo.entity';
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

  // 考虑 redis 缓存!
  async fuzzySearch(query: string) {
    try {
      let queryWords: string[] = [];

      // 调用 Python 脚本获取聚类簇中的单词列表
      const result = await this.getClusterWords(query);

      if ('error' in result) {
        // 找不到聚类簇,直接返回,置空处理给前端
        return result as fuzzySearchClusterErrorRes;
      } else {
        queryWords = (result as fuzzySearchClusterSuccessRes).words;
        let index = queryWords.indexOf(query);
        queryWords.splice(index, 1);
        queryWords.unshift(query);
        let results: IndexTable[] = [];
        //获取words对应的词条的indexvalue索引
        // PREF: 搜索结果的indexValue去重降低QOS!
        for (let word of queryWords) {
          results.push(...(await this.getWordRecordIndexByQuery(word)));
        }
        results.sort((a, b) => {
          // 先比较 indexValue
          if (a.indexValue !== b.indexValue) {
            return a.indexValue - b.indexValue;
          }
          // 如果 indexValue 相同，比较 word 是否等于 query
          return a.word === query ? -1 : b.word === query ? 1 : 0;
        }); // 按indexValue排序,indexValue越小越靠前,且query在最前面!
        let results_with_only_index: IndexTable[] = [];

        //得到去重后的indexValue数组,即去重后的词条索引!
        for (let i = 1; i < results.length; i++) {
          if (results[i].indexValue === results[i - 1].indexValue) {
            continue;
          } else {
            results_with_only_index.push(results[i]);
          }
        }
        //const records = await this.getWordRecordByQuery(queryWords[0]);
        let finalRes: fuzzySearchFinalRes[] = [];

        for (let res of results_with_only_index.splice(0, 10)) {
          // WARN: 暂时只返回前10个结果,后续可以考虑优化此处逻辑收窄模糊搜索范围!!!
          const record: medinfo | null = await this.getMedInfoByIndex(
            res.indexValue,
          );
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
        return finalRes;
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

  //
  async getWordRecordIndexByQuery(query: string) {
    return await this.indexTableRepository.find({ where: { word: query } });
  }

  async getMedInfoByIndex(index: number) {
    return await this.medinfoRepository.findOneBy({ id: index }); // 通过indexValue获取药材信息
  }
}
