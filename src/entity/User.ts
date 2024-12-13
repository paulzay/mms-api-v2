import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm"
import { Role } from './Role';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  email: string;

  @Column()
  dob: Date;

  @Column()
  password: string;

  @Column({ nullable: true })
  avatar: string;

  @OneToMany(() => Role, role => role.users)
  role: Role;
  
}

