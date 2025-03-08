import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Comprehensiveherbinfo } from '../entity/etcm.entity';
import { GuJiFangJi } from '../entity/gujifangji.entity';
import { Fangjixiangxi } from '../entity/fangjixiangxi.entity';

export interface CountInfo {
  recipe_name: string | null;
  prescription_ingredients: string | null;
}

export interface tasteRes {
  taste: string;
}

export interface NatureCountResult {
  name: string; // 对应查询结果中的 name 字段
  count: number; // 确保 count 是数字类型
}

@Injectable()
export class DataMiningService {
  constructor(
    @InjectRepository(Comprehensiveherbinfo)
    private readonly comprehensiveherbinfoRepository: Repository<Comprehensiveherbinfo>,
    @InjectRepository(GuJiFangJi)
    private readonly gujifangjiRepository: Repository<GuJiFangJi>,
    @InjectRepository(Fangjixiangxi)
    private readonly fangjixiangxiRepository: Repository<Fangjixiangxi>,
  ) {}

  async getCount(name: string): Promise<CountInfo[]> {
    // TODO 后期直接从fangjixiangxi表中查询完整数据
    const keyword = name;
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

    // 手动转换为 CountInfo[] 类型
    return result.map((item) => ({
      recipe_name: item.recipe_name,
      prescription_ingredients: item.prescription_ingredients,
    }));
  }

  getMedicineCount(list: CountInfo[], limit: number = 3) {
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
    });
    // 删除出现次数小于 limit 的药材
    for (let [name, count] of medicineCount) {
      if (count < limit) {
        medicineCount.delete(name);
      }
    }

    const result = Array.from(medicineCount.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
    return result;
  }

  async getNatureCount(herbNameList: string[]): Promise<NatureCountResult[]> {
    const res = await this.comprehensiveherbinfoRepository
      .createQueryBuilder('herb')
      .select('herb.nature', 'name') // 使用别名，将 nature 字段命名为 name
      .addSelect('COUNT(*)', 'count') // 统计数量
      .where('herb.herb_name IN (:...herbNameList)', { herbNameList }) // 传入 herbNameList
      .groupBy('herb.nature') // 按 nature 分组
      .getRawMany(); // 获取原始数据

    // 将 count 转换为数字类型
    const result = res.map((item) => ({
      name: item.name,
      count: Number(item.count), // 确保 count 是数字类型
    }));

    console.log(result); // 打印结果以供调试
    return result; // 返回最终结果
  }

  async getTasteCount(herbNameList: string[]) {
    const res: tasteRes[] = await this.comprehensiveherbinfoRepository
      .createQueryBuilder('herb')
      .select('herb.taste', 'taste') // 选择 taste 字段
      .where('herb.herb_name IN (:...herbNameList)', { herbNameList }) // 传入 herbNameList
      .getRawMany(); // 获取原始数据
    let tasteCount: Map<string, number> = new Map();
    res.map((item) => {
      let temp = item.taste.split(',');
      temp.map((taste) => {
        if (tasteCount.has(taste)) {
          let count = tasteCount.get(taste) || 0;
          count += 1;
          tasteCount.set(taste, count);
        } else {
          tasteCount.set(taste, 1);
        }
      });
    });
    const result = Array.from(tasteCount.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
    console.log(result);
    return result;
  }

  async getFunctionCount(herbNameList: string[], limit: number = 1) {
    const res = await this.comprehensiveherbinfoRepository
      .createQueryBuilder('herb')
      .select('herb.efficacy', 'efficacy') // 选择 efficacy 字段
      .where('herb.herb_name IN (:...herbNameList)', { herbNameList }) // 传入 herbNameList
      .getRawMany(); // 获取原始数据

    let efficacyCount: Map<string, number> = new Map();
    res.map((item) => {
      let temp = item.efficacy.split('、');
      temp.map((taste) => {
        if (efficacyCount.has(taste)) {
          let count = efficacyCount.get(taste) || 0;
          count += 1;
          efficacyCount.set(taste, count);
        } else {
          efficacyCount.set(taste, 1);
        }
      });
    });
    // 删除value<=limit的键值对
    for (let [key, value] of efficacyCount) {
      if (value <= limit) {
        efficacyCount.delete(key);
      }
    }

    const result = Array.from(efficacyCount.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);

    console.log(result);
    return result;
  }
}
