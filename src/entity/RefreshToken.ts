import {
  Column,
  Entity,
  Index,
  JoinColumn,
  OneToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from "typeorm";
import User from "./User";

@Entity()
export default class RefreshToken {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({ type: "varchar", length: 75 })
  refreshToken: string;

  @Index()
  @OneToOne(() => User)
  @JoinColumn()
  user: User;
}
