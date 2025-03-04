import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("chinese_medicinal_herbs", { schema: "tcm" })
export class ChineseMedicinalHerbs {
  @PrimaryGeneratedColumn({ type: "int", name: "id", comment: "自增ID" })
  id: number;

  @Column("varchar", { name: "name", comment: "中药材名称", length: 100 })
  name: string;

  @Column("varchar", {
    name: "latin_name",
    nullable: true,
    comment: "中药材拉丁名",
    length: 255,
  })
  latinName: string | null;

  @Column("varchar", {
    name: "nature",
    nullable: true,
    comment: "性（寒, 凉, 平, 温, 热）",
    length: 10,
  })
  nature: string | null;

  @Column("varchar", {
    name: "taste",
    nullable: true,
    comment: "味，多个味道用逗号分隔",
    length: 50,
  })
  taste: string | null;

  @Column("varchar", {
    name: "meridian",
    nullable: true,
    comment: "归经，多个经络用逗号分隔",
    length: 100,
  })
  meridian: string | null;

  @Column("timestamp", {
    name: "created_at",
    nullable: true,
    comment: "创建时间",
    default: () => "CURRENT_TIMESTAMP",
  })
  createdAt: Date | null;

  @Column("timestamp", {
    name: "updated_at",
    nullable: true,
    comment: "更新时间",
    default: () => "CURRENT_TIMESTAMP",
  })
  updatedAt: Date | null;
}
