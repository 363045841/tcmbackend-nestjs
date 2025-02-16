import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RelatedTcm } from './relatetcm.entity';
import { medinfo } from '../medinfo/medinfo.entity';

export interface RelatedInfoFinalRes {
  related_tcm_id: number;
  tcmName: string;
}

@Injectable()
export class ItemPageService {
  constructor(
    @InjectRepository(RelatedTcm)
    private readonly relatedTcmRepository: Repository<RelatedTcm>,
    @InjectRepository(medinfo)
    private readonly dataWithHeaderFinalRepository: Repository<medinfo>,
  ) {}

  async getRelatedTcm(tcmId: number): Promise<RelatedInfoFinalRes[]> {
    const temp = this.relatedTcmRepository
      .createQueryBuilder('r')
      .innerJoin('data_with_header_final', 'd', 'r.related_tcm_id = d.id')
      .select(['r.related_tcm_id', 'd.tcmName'])
      .where('r.tcm_id = :tcmId', { tcmId })
      .getRawMany();
    return temp;
  }
}
