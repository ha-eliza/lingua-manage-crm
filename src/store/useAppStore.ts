import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { createStudentsSlice, type StudentsSlice } from './slices/studentsSlice';
import { createLessonsSlice, type LessonsSlice } from './slices/lessonsSlice';
import { createNotesSlice, type NotesSlice } from './slices/notesSlice';
import { createMaterialsSlice, type MaterialsSlice } from './slices/materialsSlice';

export type AppState = StudentsSlice & LessonsSlice & NotesSlice & MaterialsSlice;

export const useAppStore = create<AppState>()(
  persist(
    (...a) => ({
      ...createStudentsSlice(...a),
      ...createLessonsSlice(...a),
      ...createNotesSlice(...a),
      ...createMaterialsSlice(...a)
    }),
    {
      name: 'lingua-crm-storage', // Ключ в LocalStorage
    }
  )
);

