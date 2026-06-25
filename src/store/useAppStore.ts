import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { createStudentsSlice, type StudentsSlice } from './slices/studentsSlice';
import { createLessonsSlice, type LessonsSlice } from './slices/lessonsSlice';
import { createNotesSlice, type NotesSlice } from './slices/notesSlice';

export type AppState = StudentsSlice & LessonsSlice & NotesSlice;

export const useAppStore = create<AppState>()(
  persist(
    (...a) => ({
      ...createStudentsSlice(...a),
      ...createLessonsSlice(...a),
      ...createNotesSlice(...a)
    }),
    {
      name: 'lingua-crm-storage', // Ключ в LocalStorage
    }
  )
);

