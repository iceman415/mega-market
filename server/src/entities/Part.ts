import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity("parts")
export class Part {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "varchar", length: 200 })
  name: string;

  @Column({ type: "varchar", length: 100 })
  partNumber: string;

  @Column({ type: "varchar", length: 200 })
  compatibility: string;

  @Column({ type: "decimal", precision: 12, scale: 2 })
  price: string;

  @Column({ type: "text" })
  description: string;

  @Column({ type: "varchar", length: 100 })
  location: string;

  @Column({ type: "boolean", default: false })
  sold: boolean;

  @Column("simple-json")
  images: string[];

  @Column({ type: "varchar", length: 255, nullable: true })
  youtubeUrl: string | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
