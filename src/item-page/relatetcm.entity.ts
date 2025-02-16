import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { medinfo as DataWithHeaderFinal } from '../medinfo/medinfo.entity';

@Index('tcm_id', ['tcmId'], {})
@Index('related_tcm_id', ['relatedTcmId'], {})
@Entity('related_tcm', { schema: 'tcm' })
export class RelatedTcm {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('int', { name: 'tcm_id' })
  tcmId: number;

  @Column('int', { name: 'related_tcm_id' })
  relatedTcmId: number;

  @ManyToOne(
    () => DataWithHeaderFinal,
    (dataWithHeaderFinal) => dataWithHeaderFinal.relatedTcms,
    { onDelete: 'NO ACTION', onUpdate: 'NO ACTION' },
  )
  @JoinColumn([{ name: 'tcm_id', referencedColumnName: 'id' }])
  tcm: DataWithHeaderFinal;

  @ManyToOne(
    () => DataWithHeaderFinal,
    (dataWithHeaderFinal) => dataWithHeaderFinal.relatedTcms2,
    { onDelete: 'NO ACTION', onUpdate: 'NO ACTION' },
  )
  @JoinColumn([{ name: 'related_tcm_id', referencedColumnName: 'id' }])
  relatedTcm: DataWithHeaderFinal;
}
