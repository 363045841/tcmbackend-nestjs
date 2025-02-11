import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { medinfo } from '../medinfo/medinfo.entity';
import { Repository } from 'typeorm';
import { SearchFinalRes } from './search.controller';
@Injectable()
export class AccurateSearchService {
  constructor(
    @InjectRepository(medinfo)
    private readonly medinfoRepository: Repository<medinfo>,
  ) {}

  /**
   * @deprecated 此方法已弃用，请使用 findMedinfoInAllFields 替代
   */
  async findMedinfoByName(name: string): Promise<SearchFinalRes[]> {
    console.time(`精准搜索: ${name}`);
    let records = await this.medinfoRepository.query(
      `SELECT pic, tcmName, id, description FROM data_with_header_final WHERE tcmName = ?`,
      [`${name}%`], // 在 name 前加上 % 用于模糊匹配
    );
    if (records.length === 0) {
      return [];
    } else {
      let finalRes: SearchFinalRes[] = [];
      for (let res of records) {
        finalRes.push({
          id: res.id,
          word: name,
          indexValue: 100,
          title: res.tcmName,
          description: res.description,
          picUrl: res.pic,
          isFuzzy: false,
        });
      }
      console.timeEnd(`精准搜索: ${name}`);
      return finalRes;
    }
  }

  async findMedinfoInAllFields(query: string): Promise<SearchFinalRes[]> {
    console.time(`精准搜索全文: ${query}`);
    /* let records = await this.medinfoRepository.query(
      `SELECT * FROM data_with_header_final 
       WHERE MATCH (prescription) AGAINST ('${query}' IN NATURAL LANGUAGE MODE);`,
    ); */

    const records = await this.medinfoRepository.query(
      `SELECT pic, tcmName, id, description 
       FROM data_with_header_final 
       WHERE MATCH (tcmName, alias, enName, source, shape, distribution, 
                    process, description, effect, class, application, 
                    component, research, note, prescription) 
       AGAINST (? IN NATURAL LANGUAGE MODE);`,
      [query],
    );

    if (records.length === 0) {
      return [];
    } else {
      let finalRes: SearchFinalRes[] = [];
      for (let res of records) {
        finalRes.push({
          id: res.id,
          word: query,
          indexValue: 100,
          title: res.tcmName ?? '未知药材',
          description: res.description ?? '未知药材描述',
          picUrl: res.pic ?? '未知药材图片链接',
          isFuzzy: false,
        });
      }
      console.timeEnd(`精准搜索全文: ${query}`);
      return finalRes;
    }
  }
}
