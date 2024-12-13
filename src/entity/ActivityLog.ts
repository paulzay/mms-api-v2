import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm"

import { User } from './User';

@Entity()
export class ActivityLog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  status: string;

  @Column()
  type: string;

  @Column()
  description: string;

  @ManyToOne(() => User)
  user: User;
}