import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Word } from "./Word.entity";

@Index("word_id", ["wordId"], {})
@Entity("word_index", { schema: "tcm" })
export class WordIndex {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("int", { name: "word_id", nullable: true })
  wordId: number | null;

  @Column("int", { name: "index_value", nullable: true })
  indexValue: number | null;

  @ManyToOne(() => Word, (word) => word.wordIndices, {
    onDelete: "CASCADE",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "word_id", referencedColumnName: "id" }])
  word: Word;
}
