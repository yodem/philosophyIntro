import { Philosopher } from '@/philosopher/entities/philosopher.entity';
import { Question } from '@/question/entities/question.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string; // Store hashed passwords

  @Column({ default: 'user' })
  role: string; // Roles: 'user', 'moderator', 'admin'

  @Column({ type: 'json', nullable: true })
  profileSettings: Record<string, any>; // Store user-specific settings as JSON

  @ManyToMany(() => Philosopher, (philosopher) => philosopher)
  @JoinTable()
  favoritePhilosophers: Philosopher[]; // Optional: Users can mark favorite philosophers

  @ManyToMany(() => Question, (question) => question)
  @JoinTable()
  favoriteQuestions: Question[]; // Optional: Users can mark favorite questions

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
