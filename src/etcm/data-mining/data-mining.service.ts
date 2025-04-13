import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Comprehensiveherbinfo } from '../entity/etcm.entity';
import { GuJiFangJi } from '../entity/gujifangji.entity';
import { Fangjixiangxi } from '../entity/fangjixiangxi.entity';
import { spawn } from 'child_process';
import * as path from 'path';
import { RabbitMQService } from '../../rabbitmq/rabbitmq.service';
import { ZhongChengYao } from '../entity/ZhongChengYao.entity';

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

interface symptopsCountRes {
  symptoms: string;
  count: number;
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
    @InjectRepository(ZhongChengYao)
    private readonly zhongChengYaoRepository: Repository<ZhongChengYao>,

    private readonly rabbitMQService: RabbitMQService,
  ) {}

  async getGuji(name: string) {
    const result = await this.fangjixiangxiRepository.findOne({
      where: { name },
    });
    return result;
  }

  async getModern(name: string) {
    const res = await this.zhongChengYaoRepository.findOne({ where: { name } });
    return res;
  }

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
    return result;
  }

  async getSymptopsCount(FangjiList: string[], limit: number = 3) {
    // 获取方剂治疗疾病统计信息
    const res = await this.fangjixiangxiRepository
      .createQueryBuilder('f') // 创建查询构建器，别名为 'f'
      .select('DISTINCT f.symptoms', 'symptoms') // 选择 DISTINCT symptoms
      .where('f.name IN (:...names)', { names: FangjiList })
      .getRawMany(); // 获取原始结果
    let countMap = new Map<string, number>();
    res.map((item) => {
      let temp: string[] = item.symptoms?.split('、') || []; // 确保 symptoms 是字符串，如果不是则默认为空数组
      temp = temp.map((item) => item.trim()); // 去除字符串中的空格

      temp.map((taste) => {
        if (countMap.has(taste)) {
          let count = countMap.get(taste) || 0;
          count += 1;
          countMap.set(taste, count);
        } else {
          countMap.set(taste, 1);
        }
      });
    });
    // 删除value<=limit的键值对
    for (let [key, value] of countMap) {
      if (value <= limit) {
        countMap.delete(key);
      }
    }
    countMap.get('') && countMap.delete('');
    const result = Array.from(countMap.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
    return result;
  }

  async getDataMineRule(
    name: string,
    support: number = 0.1,
    confidence: number = 0.3,
  ) {
    try {
      const RuleRes = (await this.getCount(name)).map(
        (item) => item.prescription_ingredients,
      );

      // 创建子进程，执行 Python 脚本
      path.join(__dirname, 'apriori.py');
      const pythonProcess = spawn(
        /* 'python', */
        process.env.NODE_ENV === 'development' ? 'python' : 'python3.8',
        [
          path.join(__dirname, 'apriori.py'),
          '--support',
          support.toString(), // 支持度参数
          '--confidence',
          confidence.toString(), // 置信度参数
        ],
        {
          stdio: ['pipe', 'pipe', 'pipe'], // 配置 stdin, stdout, stderr 为管道
          env: { ...process.env, PYTHONIOENCODING: 'utf-8' }, // 设置 Python 的 IO 编码为 UTF-8
        },
      );

      // 收集 Python 脚本的标准输出和错误输出
      let output = '';
      let errorOutput = '';

      pythonProcess.stdout.on('data', (data) => {
        output += data.toString('utf-8'); // 显式指定 UTF-8 编码
      });

      pythonProcess.stderr.on('data', (data) => {
        errorOutput += data.toString('utf-8'); // 显式指定 UTF-8 编码
      });

      // 将数据通过 stdin 传递给 Python 脚本
      try {
        pythonProcess.stdin.write(RuleRes.join('\n')); // 每个方剂一行
        pythonProcess.stdin.end(); // 结束输入流
      } catch (err) {
        console.error(`Error writing to stdin: ${err.message}`);
        throw new Error('Failed to write data to Python script.');
      }

      // 等待子进程结束
      await new Promise<void>((resolve, reject) => {
        pythonProcess.on('close', (code) => {
          if (code !== 0) {
            console.error(
              `Python script exited with code ${code}: ${errorOutput}`,
            );
            reject(new Error(`Python script failed: ${errorOutput}`));
          } else {
            resolve();
          }
        });

        // 处理子进程错误事件
        pythonProcess.on('error', (err) => {
          console.error(`Python process error: ${err.message}`);
          reject(err);
        });
      });

      // 返回 Python 脚本的输出结果,注意分别处理windows和linux下的output换行符
      let temp = output
        .split(process.env.NODE_ENV === 'development' ? '\r' : '\n')
        .map((item) => {
          return item !== '' ? item.replace('\n', '') : '';
        })
        .filter(Boolean);
      // temp.forEach((item) => console.log(item));

      /* .map((item) => item.replace('\n', '')); */
      const ruleLen = RuleRes.length;
      return temp.map((item) => {
        let splitArray = item.split(',');

        return {
          ruleBefore: splitArray[0] ?? '',
          ruleAfter: splitArray[1] ?? '',
          support:
            ((Number(splitArray[4]) * 100) / ruleLen).toFixed(2) + '%' || '',
          confidence: splitArray[2] ?? '',
          lift: splitArray[3] ?? '',
          count: splitArray[4] ?? '',
        };
      });
    } catch (error) {
      console.error(`Error in dataMineRule: ${error.message}`);
      throw new Error('Failed to execute data mining rule.');
    }
  }

  async getDataMineRuleByRabbitMQ(
    name: string,
    support: number = 0.1,
    confidence: number = 0.3,
  ) {
    try {
      // 获取规则数据
      const RuleRes = (await this.getCount(name)).map(
        (item) => item.prescription_ingredients,
      );
      console.log('RuleRes:', RuleRes);
      if (RuleRes.length === 0) {
        return [
          {
            ruleBefore: 'error',
            ruleAfter: 'error',
            support: 'error',
            confidence: 'error',
            lift: 'error',
            count: 'error',
          },
        ];
      }

      // 构造任务消息
      const task = {
        name,
        support,
        confidence,
        data: RuleRes.join('\n'), // 将数据拼接为字符串
      };

      console.log('发布参数', task.name, task.support, task.confidence);

      interface RuleResult {

        pattern: string[];
        data: Array<{
          antecedents: string[];
          consequents: string[];
          confidence: number;
          lift: number;
          occurrence_count: number;
        }>;
      }

      // 发布任务到 RabbitMQ 并等待响应
      const result: RuleResult =
        await this.rabbitMQService.publishFP_GrowthTask(task);
      let res = result.data.map((item) => {
        return {
          ruleBefore: item.antecedents.join('、'),
          ruleAfter: item.consequents.join('、'),
          support:
            ((item.occurrence_count * 100) / RuleRes.length).toFixed(2) + '%',
          confidence: String(item.confidence),
          lift: String(item.lift),
          count: String(item.occurrence_count),
        };
      });

      // console.log('Received result from RabbitMQ:', result);

      // 返回结果
      return res;
    } catch (error) {
      console.error(`Error in dataMineRule: ${error.message}`);
      throw new Error('Failed to submit or retrieve data mining task.');
    }
  }
}
