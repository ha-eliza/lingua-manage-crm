import type { StateCreator } from 'zustand';
import type { Student } from '../../types';
import { mockStudents } from '../../types/mockData';
import type { AppState } from '../useAppStore';

export interface StudentsSlice {
  students: Student[];
}

export const createStudentsSlice: StateCreator<AppState, [['zustand/persist', unknown]], [], StudentsSlice> = () => ({
  students: mockStudents
});
