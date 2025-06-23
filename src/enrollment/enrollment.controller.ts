import { Controller, Get, Post, Param, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { EnrollmentService } from './enrollment.service';

@UseGuards(JwtAuthGuard)
@Controller('enrollments')
export class EnrollmentController {
  constructor(private readonly enrollmentService: EnrollmentService) {}

  @Post(':courseId')
  enroll(@Param('courseId') courseId: number, @Req() req: any) {
    return this.enrollmentService.enroll(courseId, req.user);
  }

  @Get('my-courses')
  getMyCourses(@Req() req: any) {
    return this.enrollmentService.getMyCourses(req.user);
  }
}