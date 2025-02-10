import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { WordIndex } from "./WordIndex.entity";

@Index("word_word_uindex", ["word"], { unique: true })
@Entity("word", { schema: "tcm" })
export class Word {
  @Column("varchar", { name: "word", unique: true, length: 255 })
  word: string;

  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @OneToMany(() => WordIndex, (wordIndex) => wordIndex.word)
  wordIndices: WordIndex[];
}
