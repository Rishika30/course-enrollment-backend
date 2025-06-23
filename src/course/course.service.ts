import {
  Injectable,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Course } from './course.entity';
import { Timetable } from '../timetable/timetable.entity';
import { User } from '../auth/user.entity';

@Injectable()
export class CourseService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
    @InjectRepository(Course)
    private courseRepo: Repository<Course>,
    @InjectRepository(Timetable)
    private timetableRepo: Repository<Timetable>,
  ) {}

  async getCoursesForCollege(collegeId: number) {
    return this.courseRepo.find({
      where: { college: { id: collegeId } },
      relations: ['timetable'],
    });
  }

  async createCourse(user: User, data: any) {
    //Only admin is authorized
    if (user.role !== 'admin') throw new ForbiddenException();

    //check if admin is present
    const findUser = await this.userRepo.findOne({
        where: { id: user.id },
        relations: ['college'],
    });

    if (!findUser || !findUser.college) {
        throw new NotFoundException('User or college not found');
    }

    const course = this.courseRepo.create({
        title: data.title,
        college: findUser.college,
    });

    const savedCourse = await this.courseRepo.save(course);


    // Save timetable slots
    if (data.timetable && Array.isArray(data.timetable)) {
      const slots = data.timetable.map((slot) =>
        this.timetableRepo.create({ ...slot, course: savedCourse })
      );
      await this.timetableRepo.save(slots);
    }

    return this.courseRepo.findOne({
      where: { id: savedCourse.id },
      relations: ['timetable'],
    });
  }

  async updateCourse(courseId: number, data: any, user: User) {
    if (user.role !== 'admin') throw new ForbiddenException();

    const course = await this.courseRepo.findOne({
      where: { id: courseId },
      relations: ['college', 'timetable'],
    });

    if (!course) throw new NotFoundException('Course not found');
    if (course.college.id !== user.college.id)
      throw new ForbiddenException('Cannot edit courses from other colleges');

    //update the course
    course.title = data.title || course.title;
    await this.courseRepo.save(course);

    //if timetable to be updated as well
    if (data.timetable) {
      await this.timetableRepo.delete({ course: { id: courseId } });
      const newSlots = data.timetable.map((slot) =>
        this.timetableRepo.create({ ...slot, course })
      );
      await this.timetableRepo.save(newSlots);
    }

    return this.courseRepo.findOne({
      where: { id: courseId },
      relations: ['timetable'],
    });
  }

  async deleteCourse(courseId: number, user: User) {
    if (user.role !== 'admin') throw new ForbiddenException();

    const course = await this.courseRepo.findOne({
      where: { id: courseId },
      relations: ['college'],
    });

    if (!course) throw new NotFoundException('Course not found');
    if (course.college.id !== user.college.id)
      throw new ForbiddenException('Cannot delete courses from other colleges');

    await this.timetableRepo.delete({ course: { id: courseId } });
    await this.courseRepo.delete({ id: courseId });
    return { message: 'Course deleted successfully' };
  }
}