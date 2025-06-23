import { Controller, Get, UseGuards, Req, Post, Body, Put, Param, Delete } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CourseService } from './course.service';

@UseGuards(JwtAuthGuard)
@Controller('courses')
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  @Get('my-college')
  getCourses(@Req() req: any) {
    const user = req.user;
    return this.courseService.getCoursesForCollege(user.college.id);
  }

  @Post()
  createCourse(@Req() req: any, @Body() body: any) {
    return this.courseService.createCourse(req.user, body);
  }

  @Put(':id')
  updateCourse(@Param('id') id: string, @Body() body: any, @Req() req: any) {
    return this.courseService.updateCourse(+id, body, req.user);
  }

  @Delete(':id')
  deleteCourse(@Param('id') id: string, @Req() req: any) {
    return this.courseService.deleteCourse(+id, req.user);
  }
}
