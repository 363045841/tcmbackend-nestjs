import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { medinfo } from './medinfo.entity';
import { Repository } from 'typeorm';

@Injectable()
export class MedinfoService {
  constructor(
    @InjectRepository(medinfo)
    private readonly medinfoRepository: Repository<medinfo>,
  ) {}
  async getPage(id: number) {
    let ans = await this.medinfoRepository.findOne({ where: { id } });
    if(ans !== null) {
      for(let key in ans){
        if(ans[key] === null) ans[key] = "无";
      }
      return ans;
    }
    else return null;
  }
  async getPageIDByName(name: string): Promise<number> {
    let res = await this.medinfoRepository.findOne({
      select: ['tcmName', 'id'],
      where: { tcmName: name },
    });
    console.log(res?.id);
    return res?.id || -1;
  }
  async getMedinfoTableLength() {
    return await this.medinfoRepository.count();
  }
}
