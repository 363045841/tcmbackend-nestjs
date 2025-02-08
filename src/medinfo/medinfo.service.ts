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
    return await this.medinfoRepository.findOne({ where: { id } });
  }
  async getMedinfoTableLength() {
    return await this.medinfoRepository.count();
  }
}
