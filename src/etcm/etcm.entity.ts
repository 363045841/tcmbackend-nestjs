import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("comprehensiveherbinfo", { schema: "tcm" })
export class Comprehensiveherbinfo {
  @PrimaryGeneratedColumn({ type: "int", name: "herb_id" })
  herbId: number;

  @Column("varchar", { name: "herb_name", length: 255 })
  herbName: string;

  @Column("varchar", { name: "latin_name", nullable: true, length: 255 })
  latinName: string | null;

  @Column("varchar", { name: "english_name", nullable: true, length: 255 })
  englishName: string | null;

  @Column("varchar", { name: "family", nullable: true, length: 255 })
  family: string | null;

  @Column("varchar", { name: "origin", nullable: true, length: 255 })
  origin: string | null;

  @Column("varchar", { name: "collection_time", nullable: true, length: 255 })
  collectionTime: string | null;

  @Column("varchar", { name: "used_part", nullable: true, length: 255 })
  usedPart: string | null;

  @Column("varchar", { name: "category", nullable: true, length: 255 })
  category: string | null;

  @Column("varchar", { name: "nature", nullable: true, length: 255 })
  nature: string | null;

  @Column("varchar", { name: "taste", nullable: true, length: 255 })
  taste: string | null;

  @Column("varchar", { name: "meridian", nullable: true, length: 255 })
  meridian: string | null;

  @Column("text", { name: "efficacy", nullable: true })
  efficacy: string | null;

  @Column("text", { name: "appearance", nullable: true })
  appearance: string | null;

  @Column("varchar", { name: "specification", nullable: true, length: 255 })
  specification: string | null;

  @Column("varchar", { name: "db_cross_ref", nullable: true, length: 255 })
  dbCrossRef: string | null;

  @Column("varchar", { name: "component", nullable: true, length: 255 })
  component: string | null;

  @Column("float", { name: "upper_limit", nullable: true, precision: 12 })
  upperLimit: number | null;

  @Column("float", { name: "lower_limit", nullable: true, precision: 12 })
  lowerLimit: number | null;

  @Column("varchar", { name: "unit", nullable: true, length: 50 })
  unit: string | null;

  @Column("text", { name: "similar_herb", nullable: true })
  similarHerb: string | null;

  @Column("text", { name: "similar_herb_number", nullable: true })
  similarHerbNumber: string | null;

  @Column("text", { name: "similar_gene", nullable: true })
  similarGene: string | null;

  @Column("text", { name: "similar_gene_number", nullable: true })
  similarGeneNumber: string | null;
}
