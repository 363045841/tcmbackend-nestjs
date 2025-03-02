import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Index("idx_prescription_ingredients_ngram", ["prescriptionIngredients"], {})
@Entity("gu_ji_fang_ji", { schema: "tcm" })
export class GuJiFangJi {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("varchar", { name: "recipe_name", length: 255 })
  recipeName: string;

  @Column("varchar", { name: "dosage_form", nullable: true, length: 50 })
  dosageForm: string | null;

  @Column("text", { name: "prescription_ingredients", nullable: true })
  prescriptionIngredients: string | null;

  @Column("text", { name: "source", nullable: true })
  source: string | null;
}
