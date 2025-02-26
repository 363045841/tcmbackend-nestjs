import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Conversations } from "./conversations.entity";

@Index("conversation_id", ["conversationId"], {})
@Entity("messages", { schema: "tcm" })
export class Messages {
  @PrimaryGeneratedColumn({ type: "bigint", name: "id" })
  id: string;

  @Column("varchar", { name: "conversation_id", length: 255 })
  conversationId: string;

  @Column("enum", { name: "sender", enum: ["user", "assistant"] })
  sender: "user" | "assistant";

  @Column("text", { name: "content" })
  content: string;

  @Column("timestamp", {
    name: "created_at",
    nullable: true,
    default: () => "CURRENT_TIMESTAMP",
  })
  createdAt: Date | null;

  @ManyToOne(() => Conversations, (conversations) => conversations.messages, {
    onDelete: "CASCADE",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([
    { name: "conversation_id", referencedColumnName: "conversationId" },
  ])
  conversation: Conversations;
}
