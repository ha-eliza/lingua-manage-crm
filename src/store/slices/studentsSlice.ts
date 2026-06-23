import type { StateCreator } from 'zustand';
import type { Student, StudentStatus } from '../../types';
import { mockStudents } from '../../types/mockData';
import type { AppState } from '../useAppStore';

export interface StudentsSlice {
  students: Student[];
  addStudent: (studentData: Omit<Student, 'id' | 'role' | 'avatarColor' | 'login'>) => void;
  deleteStudent: (id: string) => void;
  updateStudentStatus: (id: string, status: StudentStatus) => void;
}

const getRandomColor = () => {
  const colors = ['#0284C7', '#4F46E5', '#0891B2', '#0D9488', '#7C3AED', '#DB2777'];
  return colors[Math.floor(Math.random() * colors.length)];
};

export const createStudentsSlice: StateCreator<AppState, [['zustand/persist', unknown]], [], StudentsSlice> = (set) => ({
  students: mockStudents,

  // Функция добавления
  addStudent: (studentData) =>
    set((state) => {
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

      return { students: [...state.students, newStudent] };
  }),

  // Функция удаления
  deleteStudent: (id) =>
    set((state) => ({
      students: state.students.filter((student) => student.id !== id),
    })),

  // Функция обновления
  updateStudentStatus: (id, status) =>
    set((state) => ({
      students: state.students.map((student) =>
        student.id === id ? { ...student, status } : student
      ),
    })),

});
