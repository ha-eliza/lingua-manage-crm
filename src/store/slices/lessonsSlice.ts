import type { StateCreator } from 'zustand';
import type { Lesson } from '../../types';
import { mockLessons } from '../../types/mockData';
import type { AppState } from '../useAppStore';

export interface LessonsSlice {
  lessons: Lesson[];
}

export const createLessonsSlice: StateCreator<AppState, [['zustand/persist', unknown]], [], LessonsSlice> = () => ({
  lessons: mockLessons
});
