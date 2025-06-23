import { Body, Controller, Post } from '@nestjs/common';
import { CollegeService } from './college.service';

@Controller('colleges')
export class CollegeController {
  constructor(private readonly collegeService: CollegeService) {}

  @Post()
  create(@Body() body: { name: string }) {
    return this.collegeService.createCollege(body.name);
  }
}