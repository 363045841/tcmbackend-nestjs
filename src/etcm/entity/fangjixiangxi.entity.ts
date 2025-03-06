import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("fangjixiangxi", { schema: "tcm" })
export class Fangjixiangxi {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("varchar", { name: "name", length: 255 })
  name: string;

  @Column("varchar", { name: "dosage_form", length: 255 })
  dosageForm: string;

  @Column("varchar", { name: "symptoms", nullable: true, length: 255 })
  symptoms: string | null;

  @Column("varchar", { name: "source", nullable: true, length: 255 })
  source: string | null;

  @Column("text", { name: "composition", nullable: true })
  composition: string | null;

  @Column("text", { name: "functions", nullable: true })
  functions: string | null;

  @Column("text", { name: "functions_notes", nullable: true })
  functionsNotes: string | null;

  @Column("text", { name: "herbs", nullable: true })
  herbs: string | null;

  @Column("text", { name: "herbal_medicines", nullable: true })
  herbalMedicines: string | null;

  @Column("text", { name: "chemical_profiles", nullable: true })
  chemicalProfiles: string | null;

  @Column("text", { name: "target_profiles", nullable: true })
  targetProfiles: string | null;
}
