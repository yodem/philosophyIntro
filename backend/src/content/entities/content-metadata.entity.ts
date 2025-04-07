import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  Index,
} from 'typeorm';
import { Content } from './content.entity';

@Entity()
export class ContentMetadata {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @Index()
  key: string;

  @Column('text')
  @Index()
  value: string;

  @ManyToOne(() => Content, (content) => content.metadataEntries, {
    onDelete: 'CASCADE',
  })
  content: Content;
}
