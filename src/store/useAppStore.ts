import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { createStudentsSlice, type StudentsSlice } from './slices/studentsSlice';

export type AppState = StudentsSlice;

export const useAppStore = create<AppState>()(
  persist(
    (...a) => ({
      ...createStudentsSlice(...a),
    }),
    {
      name: 'lingua-crm-storage', // Ключ в LocalStorage
    }
  )
);

