import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Index("word", ["word"], { fulltext: true })
@Entity("index_table", { schema: "tcm" })
export class IndexTable {
  @PrimaryGeneratedColumn({ type: "int", name: "ID" })
  id: number;

  @Column("text", { name: "word" })
  word: string;

  @Column("int", { name: "index_value" })
  indexValue: number;
}
