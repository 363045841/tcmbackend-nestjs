import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comprehensiveherbinfo } from '../entity/etcm.entity';
import { GuJiFangJi } from '../entity/gujifangji.entity';

export interface CountInfo {
  recipe_name: string | null;
  prescription_ingredients: string | null;
}

@Injectable()
export class DataMiningService {
  constructor(
    @InjectRepository(Comprehensiveherbinfo)
    private readonly comprehensiveherbinfoRepository: Repository<Comprehensiveherbinfo>,
    @InjectRepository(GuJiFangJi)
    private readonly gujifangjiRepository: Repository<GuJiFangJi>,
  ) {}

  async getCount(name: string): Promise<CountInfo[]> {
    const keyword = name; // 你的查询参数
    const sql = `
    SELECT recipe_name, prescription_ingredients
    FROM gu_ji_fang_ji
    WHERE prescription_ingredients LIKE ? 
       OR prescription_ingredients LIKE ? 
       OR prescription_ingredients LIKE ?;
`;

    const result = await this.gujifangjiRepository.query(sql, [
      `%,${keyword},%`,
      `${keyword},%`,
      `%,${keyword}`,
    ]);

    console.log(result.map((item) => item.prescription_ingredients))

    // 手动转换为 CountInfo[] 类型
    return result.map((item) => ({
      recipe_name: item.recipe_name,
      prescription_ingredients: item.prescription_ingredients,
    }));
  }


  getMedicineCount(list: CountInfo[]) {
    let medicineCount: Map<string, number> = new Map();
    list.map((item) => {
      let split: string[] = item.prescription_ingredients?.split(',') || [];
      split.map((medicine) => {
        if (medicineCount.has(medicine)) {
          let count = medicineCount.get(medicine) || 0;
          count += 1;
          medicineCount.set(medicine, count);
        } else {
          medicineCount.set(medicine, 1);
        }
      });
    })
    console.log(Array.from(medicineCount).sort((a, b) => b[1] - a[1]))
    return Array.from(medicineCount).sort((a, b) => b[1] - a[1]);
  }
}
