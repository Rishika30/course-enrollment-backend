import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { College } from './college.entity';

@Injectable()
export class CollegeService {
  constructor(
    @InjectRepository(College)
    private collegeRepo: Repository<College>,
  ) {}

  async createCollege(name: string) {
    const college = this.collegeRepo.create({ name });
    return this.collegeRepo.save(college);
  }
}