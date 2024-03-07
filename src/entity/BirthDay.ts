import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity()
export class BirthDay {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "varchar", length: 45, nullable: false })
  name: string;

  @Column({ type: "integer", nullable: false })
  day: number;

  @Column({ type: "integer", nullable: false })
  month: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
