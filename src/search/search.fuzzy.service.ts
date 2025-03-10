import { Injectable } from '@nestjs/common';
import { spawn } from 'child_process';
import { IndexTable } from './IndexTable.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { medinfo } from '../medinfo/medinfo.entity';
import { SearchFinalRes } from './search.controller';
import { Word } from './Word.entity';
import { WordIndex } from './WordIndex.entity';
import * as path from 'path';

export interface fuzzySearchClusterErrorRes {
  error: string;
}

export interface fuzzySearchClusterSuccessRes {
  words: string[];
}

interface fuzzySearchAnsPre {
  pic: string;
  tcmName: string;
  id: number;
  description: string;
}

@Injectable()
export class FuzzySearchService {
  constructor(
    @InjectRepository(IndexTable)
    private readonly indexTableRepository: Repository<IndexTable>,
    @InjectRepository(medinfo)
    private readonly medinfoRepository: Repository<medinfo>,
    @InjectRepository(Word)
    private readonly wordRepository: Repository<Word>,
    @InjectRepository(WordIndex)
    private readonly wordIndexRepository: Repository<WordIndex>,
  ) {}

  private readonly pythonPath = 'python'; // 确保 Python 3 可用

  async fuzzySearch(query: string): Promise<fuzzySearchClusterSuccessRes | fuzzySearchClusterErrorRes> {
    try {
      let queryWords: fuzzySearchClusterSuccessRes = { words: [] };

      const result = await this.getClusterWords(query);
      console.log(result);
      if ('error' in result) {
        return result as fuzzySearchClusterErrorRes;
      } else {
        queryWords.words = (result as fuzzySearchClusterSuccessRes).words;
        let index = queryWords.words.indexOf(query);
        queryWords.words.splice(index, 1);
        return queryWords;
        /* let index = queryWords.indexOf(query);
        queryWords.splice(index, 1);
        queryWords.unshift(query);
        let results: IndexTable[] = [];

        // 插桩：获取词条索引的性能监控
        //- console.time('getWordRecordIndexByQuery');
        results = (
          await Promise.all(
            queryWords.map((word) => this.getWordRecordIndexByQuery(word)),
          )
        ).flat();

        //- console.timeEnd('getWordRecordIndexByQuery');

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

        let finalRes: SearchFinalRes[] = [];

        // 插桩：获取药材信息的性能监控
        //- console.time('getMedInfoByIndex');
        const records: (fuzzySearchAnsPre | null)[] = await Promise.all(
          results_with_only_index.splice(0, 10).map((res) => {
            return this.getMedInfoByIndex(res.indexValue);
          }),
        );
        for (let record of records) {
          if (record === null || record.tcmName.startsWith(query)) {
            continue;
          } else {
            finalRes.push({
              id: record.id,
              word: query ?? '未知药材',
              indexValue: record.id,
              title: record.tcmName ?? '未知药材',
              description: record.description ?? '暂无描述',
              picUrl: record.pic ?? '',
              isFuzzy: true,
            });
          }
        }

        //- console.timeEnd('getMedInfoByIndex');
        return finalRes; */
      }
    } catch (error) {
      //- console.error('Error during fuzzy search:', error);
      return { error: 'An error occurred while performing the search.' };
    }
  }

  getClusterWords(
    query: string,
  ): Promise<fuzzySearchClusterErrorRes | fuzzySearchClusterSuccessRes> {
    return new Promise((resolve, reject) => {
      //- console.log(__dirname);
      const process = spawn('python', [
        path.join(__dirname, './word2vec.py'),
        query,
      ]);

      let output = '';

      process.stdout.on('data', (data) => {
        output += data.toString();
      });

      process.stderr.on('data', (data) => {
        //- console.error(`Error: ${data}`);
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
  async getWordRecordIndexByQuery(query: string): Promise<IndexTable[]> {
    interface result_prefer_pre {
      indexValue: number;
    }
    //- console.time(`优化索引: ${query}`);
    const result_prefer: result_prefer_pre[] =
      await this.wordIndexRepository.query(
        `SELECT word_index.index_value AS indexValue
       FROM word_index
       INNER JOIN word ON word.id = word_index.word_id
       WHERE word.word = ?`,
        [query],
      );
    const result_prefer_final: IndexTable[] = result_prefer.map(
      (item) => ({ ...item, word: query, id: 1 }), // 重构记着把id去掉,Omit派生数据库接口类型!
    );
    //- console.timeEnd(`优化索引: ${query}`);
    return result_prefer_final;
  }

  // 插桩：获取药材信息的性能监控
  async getMedInfoByIndex(index: number) {
    //- console.time(`获取页面数据: ${index}`);

    const result: fuzzySearchAnsPre[] = await this.medinfoRepository.query(
      `SELECT pic, tcmName, id, description FROM data_with_header_final WHERE id = ?`,
      [index],
    );
    //- console.timeEnd(`获取页面数据: ${index}`);
    return result[0] ?? null; // 取数组第一项，避免 undefined
  }
}
