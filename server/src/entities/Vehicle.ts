import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity("vehicles")
export class Vehicle {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "varchar", length: 100 })
  brand: string;

  @Column({ type: "varchar", length: 100 })
  model: string;

  @Column({ type: "varchar", length: 10 })
  year: string;

  @Column({ type: "decimal", precision: 12, scale: 2 })
  price: string;

  @Column({ type: "varchar", length: 50 })
  mileage: string;

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
