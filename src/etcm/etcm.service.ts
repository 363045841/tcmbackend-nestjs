import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Comprehensiveherbinfo } from './entity/etcm.entity';
import { Repository } from 'typeorm';

@Injectable()
export class EtcmService {
  constructor(
    @InjectRepository(Comprehensiveherbinfo)
    private readonly comprehensiveherbinfoRepository: Repository<Comprehensiveherbinfo>,
  ) {}

  async getByName(name: string) {
    return await this.comprehensiveherbinfoRepository.findOne({ where: { herbName: name } });
  }
}
