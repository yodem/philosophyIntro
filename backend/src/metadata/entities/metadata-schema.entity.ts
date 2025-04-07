import { ContentType } from '../../content/entities/content.entity'; // Changed from '@/content/entities/content.entity'
import { Entity, PrimaryGeneratedColumn, Column, Index } from 'typeorm';

export type DataType = 'string' | 'number' | 'date' | 'text';

@Entity()
export class MetadataSchema {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: ContentType,
  })
  @Index()
  contentType: ContentType;

  @Column()
  @Index()
  key: string;

  @Column()
  displayName: string;

  @Column({
    type: 'enum',
    enum: ['string', 'number', 'date', 'text'],
    default: 'string',
  })
  dataType: DataType;

  @Column({ default: false })
  isRequired: boolean;

  @Column({ nullable: true })
  description?: string;

  @Column({ default: 0 })
  displayOrder: number;
}
