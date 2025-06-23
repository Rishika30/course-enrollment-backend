import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Course } from './course.entity';
import { Timetable } from '../timetable/timetable.entity';
import { User } from '../auth/user.entity';
import { CourseController } from './course.controller';
import { CourseService } from './course.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Course, Timetable])],
  controllers: [CourseController],
  providers: [CourseService],
})
export class CourseModule {}
