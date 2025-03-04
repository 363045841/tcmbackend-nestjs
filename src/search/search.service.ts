import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { medinfo } from '../medinfo/medinfo.entity';
import { Repository } from 'typeorm';
import { ETCMGuJiFangJiRes, SearchFinalRes } from './search.controller';
import { GuJiFangJi } from '../etcm/entity/gujifangji.entity';
import { ChineseMedicinalHerbs } from 'src/etcm/entity/zhongyaocai.entity';

@Injectable()
export class AccurateSearchService {
  constructor(
    @InjectRepository(medinfo)
    private readonly medinfoRepository: Repository<medinfo>,
    @InjectRepository(GuJiFangJi)
    private readonly gujifangjiRepository: Repository<GuJiFangJi>,
    @InjectRepository(ChineseMedicinalHerbs)
    private readonly chineseMedicinalHerbs: Repository<ChineseMedicinalHerbs>,
  ) {}

  /**
   * @deprecated 此方法已弃用，请使用 findMedinfoInAllFields 替代
   */
  async findMedinfoByName(name: string): Promise<SearchFinalRes[]> {
    //- console.time(`精准搜索: ${name}`);
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
      //- console.timeEnd(`精准搜索: ${name}`);
      return finalRes;
    }
  }

  async findMedinfoInAllFields(query: string): Promise<SearchFinalRes[]> {
    //- console.time(`精准搜索全文: ${query}`);
    /* let records = await this.medinfoRepository.query(
      `SELECT * FROM data_with_header_final 
       WHERE MATCH (prescription) AGAINST ('${query}' IN NATURAL LANGUAGE MODE);`,
    ); */

    const records = await this.medinfoRepository.query(
      `SELECT pic, tcmName, id, description, 
              MATCH (tcmName, alias, enName, source, shape, distribution, 
                     process, description, effect, class, application, 
                     component, research, note, prescription) 
              AGAINST (? IN BOOLEAN MODE) AS relevance_score
       FROM data_with_header_final 
       WHERE MATCH (tcmName, alias, enName, source, shape, distribution, 
                    process, description, effect, class, application, 
                    component, research, note, prescription) 
       AGAINST (? IN BOOLEAN MODE)
       ORDER BY relevance_score DESC
       LIMIT 15;`,
      [`+${query}`, `+${query}`], // 使用 + 强制匹配查询词
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
      //- console.timeEnd(`精准搜索全文: ${query}`);
      return finalRes;
    }
  }

  async getFromGujifangji(query: string) {
    let finalRes: ETCMGuJiFangJiRes[] = [];
    const result = await this.gujifangjiRepository
      .createQueryBuilder('gu')
      .select(['gu.recipeName', 'gu.prescriptionIngredients'])
      .where('gu.recipeName LIKE :searchTerm', {
        searchTerm: `%${query}%`,
      })
      .limit(5)
      .getMany();
    return result as unknown as ETCMGuJiFangJiRes[];
  }

  // TODO 重构这一块的interface
  async getFromECTMChineseHerbs(query: string) {
    let finalRes: ETCMGuJiFangJiRes[] = [];
    const result = await this.chineseMedicinalHerbs
      .createQueryBuilder('gu')
      .select(['gu.name','gu.nature'])
      .where('gu.name LIKE :searchTerm', {
        searchTerm: `%${query}%`,
      })
      .limit(5)
      .getMany();
    return result as unknown as ETCMGuJiFangJiRes[];// TODO 重构这个难绷的类型转换
  }
}
