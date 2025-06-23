import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { College } from '../college/college.entity';
import { ManyToOne } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  role: 'student' | 'admin';

  @ManyToOne(() => College)
  college: College;
}
