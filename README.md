# 🎓 Student Course Enrollment System

This is a backend API built with **NestJS** and **PostgreSQL** to manage multiple colleges, courses, student enrollments, and schedules.

## 📦 Features

- Multiple colleges and admins
- Admins can:
  - Create, update, and delete courses with schedules
- Students can:
  - View available courses in their college
  - Enroll in non-conflicting courses
  - View their enrolled courses
- JWT-based authentication

---

## 🚀 Setup Instructions

### 1. Clone the Repo and install dependencies with npm i
### 2. Create a .env file in the root with: 

- DB_HOST=localhost
- DB_PORT=5432
- DB_USERNAME=postgres
- DB_PASSWORD=your_postgres_password
- DB_DATABASE=course_enrollment

- JWT_SECRET=supersecret
- JWT_EXPIRES_IN=1h

  ###3. Ensure PostgreSQL is running locally and a database named course_enrollment exists.
  ###4. Run the Server with npm run start

  # 📌 API Endpoints - http://localhost:3000/

---

## 🔐 Auth

### POST `/auth/register`  
Register a new user (admin or student)  
**Body:**
```json
{
  "name": "Alice",
  "email": "alice@example.com",
  "password": "secret123",
  "role": "admin", // or "student"
  "collegeId": 1
}
```

---

### POST `/auth/login`  
Login and receive JWT token  
**Body:**
```json
{
  "email": "alice@example.com",
  "password": "secret123"
}
```

---

## 🎓 Colleges (Admin Only)

### POST `/colleges`  
Create a new college  
**Header:** `Authorization: Bearer <JWT>`  
**Body:**
```json
{
  "name": "ABC College"
}
```

---

## 📚 Courses (Admin Only)

### GET `/courses/my-college`  
Get all courses from the admin’s own college  
**Header:** `Authorization: Bearer <JWT>`

---

### POST `/courses`  
Create a course with timetable  
**Header:** `Authorization: Bearer <JWT>`  
**Body:**
```json
{
  "title": "Math 101",
  "timetable": [
    { "day": "Mon", "startTime": "09:00", "endTime": "10:00" },
    { "day": "Wed", "startTime": "11:00", "endTime": "12:00" }
  ]
}
```

---

### PATCH `/courses/:id`  
Update a course title or timetable  
**Header:** `Authorization: Bearer <JWT>`  
**Body:**
```json
{
  "title": "Advanced Math",
  "timetable": [
    { "day": "Tue", "startTime": "10:00", "endTime": "11:00" }
  ]
}
```

---

### DELETE `/courses/:id`  
Delete a course from admin’s college  
**Header:** `Authorization: Bearer <JWT>`

---

## 👩‍🎓 Student Actions

### GET `/enrollments/courses`  
View all available courses from student’s college  
**Header:** `Authorization: Bearer <JWT>`

---

### POST `/enrollments/:courseId`  
Enroll in a course (only if no time conflict)  
**Header:** `Authorization: Bearer <JWT>`

---

### GET `/enrollments/my`  
View all enrolled courses  
**Header:** `Authorization: Bearer <JWT>`

---

