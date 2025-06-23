import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    private jwtService: JwtService
  ) {}

  //Register user
  async register(data: any) {
    //Check for existing user
    const existingUser = await this.userRepo.findOne({ where: { email: data.email } });
    if (existingUser) throw new BadRequestException('User email is already registered');

    const hashed = await bcrypt.hash(data.password, 10);

    //Check if user is tied to any college
    const college = await this.userRepo.manager.findOne('College', {
    where: { id: data.collegeId },
    });
    if (!college) throw new BadRequestException('Invalid collegeId');

    //Create user
    const user = this.userRepo.create({
      name: data.name,
      email: data.email,
      password: hashed,
      role: data.role,
      college: college,
   });

   await this.userRepo.save(user);
   return { message: 'User registered successfully' };
}

  //Login user
  async login(data: any) {
    //Check if user is registered
    const user = await this.userRepo.findOne({
    where: { email: data.email },
    relations: ['college'],
   });
    if (!user) throw new BadRequestException('User not present');

    //Password check
    const isMatch = await bcrypt.compare(data.password, user.password);
    if (!isMatch) throw new BadRequestException('Incorrect Password');

    //JWT token for authorization
    const token = this.jwtService.sign({
      id: user.id,
      role: user.role,
      email: user.email,
      college: user.college,
    });

    return { token };
  }
}
