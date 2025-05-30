import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { medinfo } from '../medinfo/medinfo.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ShowAllService {
  constructor(
    @InjectRepository(medinfo)
    private readonly medinfoRepository: Repository<medinfo>,
  ) {}

  async getMedinfoData(begin: number, end: number) {
    // 使用TypeORM的find方法结合skip和take实现分页查询
    // skip表示跳过的记录数，即(begin-1)，因为通常行号从1开始而skip从0开始计数
    // take表示要获取的记录数，即(end-begin+1)
    type ReturnedType = { tcmName: string; pic: string; id: number };

    let results = await this.medinfoRepository.find({
      skip: begin - 1, // 调整以匹配通常从1开始的行号
      take: end - begin + 1,
      select: ['tcmName', 'id'], // 假设medinfo实体中有tcmName和pic字段，对应表中的列
    });

    if (!results) {
      throw new Error('No data found');
    }

    const mappedResults: ReturnedType[] = results
      .filter((item) => item.tcmName !== null) // 过滤掉 tcmName 为 null 的记录
      .map((item) => ({
        tcmName: item.tcmName!, // 使用非空断言操作符，确保 tcmName 不为 null
        id: item.id,
        pic: `https://${process.env.SERVER_IP}/api/v1/oss/get-image?filePath=zyysjk/downloaded_images/${item.id}.jpg`,
      }));

    return mappedResults;
  }
}
