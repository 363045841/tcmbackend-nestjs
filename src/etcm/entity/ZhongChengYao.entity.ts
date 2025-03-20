import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("zhong_cheng_yao", { schema: "tcm" })
export class ZhongChengYao {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("varchar", { name: "name", length: 255 })
  name: string;

  @Column("varchar", { name: "DosageForm", length: 50 })
  dosageForm: string;

  @Column("text", { name: "component" })
  component: string;

  @Column("text", { name: "functions" })
  functions: string;

  @Column("varchar", { name: "type", length: 50 })
  type: string;
}
