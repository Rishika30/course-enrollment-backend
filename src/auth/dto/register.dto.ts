export class RegisterDto {
  name: string;
  email: string;
  password: string;
  role: 'student' | 'admin';
}