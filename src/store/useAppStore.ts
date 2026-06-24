import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { createStudentsSlice, type StudentsSlice } from './slices/studentsSlice';
import { createLessonsSlice, type LessonsSlice } from './slices/lessonsSlice';

export type AppState = StudentsSlice & LessonsSlice;

export const useAppStore = create<AppState>()(
  persist(
    (...a) => ({
      ...createStudentsSlice(...a),
      ...createLessonsSlice(...a),
    }),
    {
      name: 'lingua-crm-storage', // Ключ в LocalStorage
    }
  )
);

