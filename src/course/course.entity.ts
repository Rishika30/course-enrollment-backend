import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { College } from '../college/college.entity';
import { Timetable } from '../timetable/timetable.entity';

@Entity()
export class Course {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @ManyToOne(() => College, college => college.courses)
  college: College;

  @OneToMany(() => Timetable, tt => tt.course, { cascade: true })
  timetable: Timetable[];
}