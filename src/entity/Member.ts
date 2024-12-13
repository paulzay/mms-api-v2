import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Member {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  last_name: string;

  @Column({ unique: true })
  phone: string;

  @Column()
  address: string;

  @Column()
  date_of_birth: Date;

  @Column({ default: () => "CURRENT_DATE" })
  join_date: Date;

  @Column()
  created_by: number;

  @Column({ nullable: true })
  updated_by: number;

  @Column({ default: true })
  is_active: boolean;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  created_at: Date;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  updated_at: Date;
}