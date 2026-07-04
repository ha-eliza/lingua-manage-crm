import type { StateCreator } from 'zustand';
import type { EnglishLevel, Student, StudentStatus } from '../../types';
import type { AppState } from '../useAppStore';
import { collection, deleteDoc, doc, getDocs, setDoc } from 'firebase/firestore';
import { db } from '../../firebase';

export interface StudentsSlice {
  students: Student[];
  fetchStudents: () => Promise<void>;
  addStudent: (studentData: Omit<Student, 'id' | 'role' | 'avatarColor' | 'login'>) => void;
  deleteStudent: (id: string) => void;
  updateStudentStatus: (id: string, status: StudentStatus) => void;
  updateStudentLevel: (id: string, level: EnglishLevel) => void;
}

const getRandomColor = () => {
  const colors = ['#0284C7', '#4F46E5', '#0891B2', '#0D9488', '#7C3AED', '#DB2777'];
  return colors[Math.floor(Math.random() * colors.length)];
};

export const createStudentsSlice: StateCreator<AppState, [['zustand/persist', unknown]], [], StudentsSlice> = (set, get) => ({
  students: [],

  fetchStudents: async () => {
    const querySnapshot = await getDocs(collection(db, "students"));
    const list = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Student[];
    set({ students: list });
  },

  // Функция добавления
  addStudent: async (studentData) => {
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
      await setDoc(doc(db, "students", newId), newStudent); // Запись в Firebase
      const current = get().students || [];
      set({ students: [...current, newStudent] });
  },

  // Функция удаления
  deleteStudent: async (id) => {
    await deleteDoc(doc(db, "students", id)); // Удаление из Firebase
    const current = get().students || [];
    set({ students: current.filter((s) => s.id !== id) });
  },

  // Функция обновления статуса
  updateStudentStatus: async (id, status) => {
    const current = get().students || [];
    const updatedList = current.map((s) => s.id === id ? { ...s, status } : s);
    const updatedStudent = updatedList.find(s => s.id === id);

    if (updatedStudent) {
      await setDoc(doc(db, "students", id), updatedStudent, { merge: true }); // Обновление в Firebase
      set({ students: updatedList }); // Обновление в Zustand
    }
  },

  // Функция обновления уровня
  updateStudentLevel: async (id, level) => {
    const current = get().students || [];
    const updatedList = current.map((s) => s.id === id ? { ...s, level } : s);
    const updatedStudent = updatedList.find(s => s.id === id);

    if (updatedStudent) {
      await setDoc(doc(db, "students", id), updatedStudent, { merge: true }); // Обновление в Firebase
      set({ students: updatedList }); // Обновление в Zustand
    }
  },

});
