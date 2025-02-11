import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Index(
  "idx_fulltext_all",
  [
    "tcmName",
    "alias",
    "enName",
    "source",
    "shape",
    "distribution",
    "process",
    "description",
    "effect",
    "class",
    "application",
    "component",
    "research",
    "note",
    "prescription",
  ],
  { fulltext: true }
)
@Entity("data_with_header_final", { schema: "tcm" })
export class medinfo {
  @Column("varchar", { name: "tcmName", nullable: true, length: 30 })
  tcmName: string | null;

  @Column("varchar", { name: "alias", nullable: true, length: 203 })
  alias: string | null;

  @Column("varchar", { name: "enName", nullable: true, length: 90 })
  enName: string | null;

  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("text", { name: "pic", nullable: true })
  pic: string | null;

  @Column("text", { name: "source", nullable: true })
  source: string | null;

  @Column("text", { name: "shape", nullable: true })
  shape: string | null;

  @Column("text", { name: "distribution", nullable: true })
  distribution: string | null;

  @Column("text", { name: "process", nullable: true })
  process: string | null;

  @Column("text", { name: "description", nullable: true })
  description: string | null;

  @Column("text", { name: "effect", nullable: true })
  effect: string | null;

  @Column("text", { name: "class", nullable: true })
  class: string | null;

  @Column("text", { name: "application", nullable: true })
  application: string | null;

  @Column("text", { name: "component", nullable: true })
  component: string | null;

  @Column("text", { name: "research", nullable: true })
  research: string | null;

  @Column("text", { name: "note", nullable: true })
  note: string | null;

  @Column("text", { name: "prescription", nullable: true })
  prescription: string | null;
}
