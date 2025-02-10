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

  async findMedinfoByName(name: string): Promise<SearchFinalRes[]> {
    console.time(`精准搜索: ${name}`);
    let records = await this.medinfoRepository.query(
      `SELECT pic, tcmName, id, description FROM data_with_header_final WHERE tcmName LIKE ?`,
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
}
