import type { StateCreator } from 'zustand';
import type { EnglishLevel, Student, StudentStatus } from '../../types';
import type { AppState } from '../useAppStore';
import { USERS } from '../../data/users';

export interface StudentsSlice {
  students: Student[];
  addStudent: (studentData: Omit<Student, 'id' | 'role' | 'avatarColor' | 'login'>) => void;
  deleteStudent: (id: string) => void;
  updateStudentStatus: (id: string, status: StudentStatus) => void;
  updateStudentLevel: (id: string, level: EnglishLevel) => void;
}

const getRandomColor = () => {
  const colors = ['#0284C7', '#4F46E5', '#0891B2', '#0D9488', '#7C3AED', '#DB2777'];
  return colors[Math.floor(Math.random() * colors.length)];
};

const STUDENTS = USERS.filter((user): user is Student => user.role === 'student')

export const createStudentsSlice: StateCreator<AppState, [['zustand/persist', unknown]], [], StudentsSlice> = (set, get) => ({
  students: STUDENTS,

  // Функция добавления
  addStudent: (studentData) => {
      const newId = `s_${Date.now()}`;
      const generatedLogin = `student_${newId.slice(-4)}`;
      const generatedPassword = Math.random().toString(36).slice(-6);

      const newStudent: Student = {
        ...studentData,
        id: newId,
        role: 'student',
        avatarColor: getRandomColor(),
        login: { login: generatedLogin, password: generatedPassword },
      };

      const current = get().students || [];
      set({ students: [...current, newStudent] });
  },

  // Функция удаления
  deleteStudent: (id) => {
    const current = get().students || [];
    set({ students: current.filter((s) => s.id !== id) });
  },

  // Функция обновления статуса
  updateStudentStatus: (id, status) => {
    const current = get().students || [];

    set({
      students: current.map((student) => (student.id === id ? { ...student, status } : student))
    })
  },

  // Функция обновления уровня
  updateStudentLevel: (id, level) => {
    const current = get().students || [];

    set({
      students: current.map((student) => (student.id === id ? { ...student, level } : student))
    })
  },

});
