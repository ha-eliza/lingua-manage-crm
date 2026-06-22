export type UserRole = 'teacher' | 'student'
export type EnglishLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2'
export type StudentStatus = 'active' | 'completed'
export type LessonStatus = 'scheduled' | 'completed'
export type NoteLevel = 'high' | 'medium' | 'low'
export type MaterialType = 'book' | 'sb' | 'wb' | 'video' | 'film' | 'audio' | 'test'

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarColor: string;
}
export interface Student extends User {
  role: 'student';
  level: EnglishLevel;
  status: StudentStatus;
  login: {
    login: string;
    password: string;
  }
}
export interface Teacher extends User {
  role: 'teacher';
  password: string;
}

export type CurrentUser = Teacher | Student | null

export interface Lesson {
  id: string;
  studentId: string;
  date: string;
  time: string;
  topic: string;
  homework?: string;
  status: LessonStatus;
}

export interface Note {
  id: string;
  text: string;
  priority: NoteLevel;
  completed: boolean;
  createdAt: string;
  deadline?: string;
  completedAt?: string;
}

export interface Material {
  id: string;
  title: string;
  description: string;
  level: EnglishLevel;
  type: MaterialType;
  link: string; // Ссылка на внешний ресурс
}
