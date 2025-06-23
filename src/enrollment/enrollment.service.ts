import {
  Injectable,
  ConflictException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Enrollment } from './enrollment.entity';
import { Course } from '../course/course.entity';
import { User } from '../auth/user.entity';

@Injectable()
export class EnrollmentService {
  constructor(
    @InjectRepository(Enrollment) private enrollRepo: Repository<Enrollment>,
    @InjectRepository(Course) private courseRepo: Repository<Course>,
    @InjectRepository(User) private userRepo: Repository<User>
  ) {}

  async enroll(courseId: number, user: User) {
    if (user.role !== 'student') throw new ForbiddenException();

    //check if course exists
    const course = await this.courseRepo.findOne({
      where: { id: courseId },
      relations: ['college', 'timetable'],
    });

    if (!course) throw new NotFoundException('Course not found');

    //only student of the same college can enroll in the college's courses
    if (course.college.id !== user.college.id)
      throw new ForbiddenException('You can only enroll in your own college courses');

    const studentEnrollments = await this.enrollRepo.find({
      where: { student: { id: user.id } },
      relations: ['course', 'course.timetable'],
    });

    // Check for timetable clash
    for (const e of studentEnrollments) {
      for (const slot of e.course.timetable) {
        for (const newSlot of course.timetable) {
          if (
            slot.day === newSlot.day &&
            !(newSlot.endTime <= slot.startTime || newSlot.startTime >= slot.endTime)
          ) {
            throw new ConflictException('Course timing conflicts with existing enrollment');
          }
        }
      }
    }

    const enrollment = this.enrollRepo.create({ student: user, course });
    return this.enrollRepo.save(enrollment);
  }

  async getMyCourses(user: User) {
    return this.enrollRepo.find({
      where: { student: { id: user.id } },
      relations: ['course', 'course.timetable'],
    });
  }
}