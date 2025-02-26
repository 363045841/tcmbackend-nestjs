import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Messages } from "./messages.entity";

@Index("conversation_id", ["conversationId"], { unique: true })
@Entity("conversations", { schema: "tcm" })
export class Conversations {
  @PrimaryGeneratedColumn({ type: "bigint", name: "id" })
  id: string;

  @Column("varchar", { name: "conversation_id", unique: true, length: 255 })
  conversationId: string;

  @Column("varchar", { name: "user_id", length: 255 })
  userId: string;

  @Column("timestamp", {
    name: "created_at",
    nullable: true,
    default: () => "CURRENT_TIMESTAMP",
  })
  createdAt: Date | null;

  @Column("timestamp", {
    name: "last_active",
    nullable: true,
    default: () => "CURRENT_TIMESTAMP",
  })
  lastActive: Date | null;

  @OneToMany(() => Messages, (messages) => messages.conversation)
  messages: Messages[];
}
