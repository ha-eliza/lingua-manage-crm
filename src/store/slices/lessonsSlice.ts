import type { StateCreator } from "zustand";
import type { Lesson, LessonStatus } from "../../types";
import type { AppState } from "../useAppStore";
import dayjs from "dayjs";
import { LESSONS } from "../../data/lessons";

export interface LessonsSlice {
  lessons: Lesson[];
  addLesson: (lessonData: Omit<Lesson, "id" | "status">) => void;
  editLesson: (id: string, updatedData: Omit<Lesson, "id">) => void;
  deleteLesson: (id: string) => void;
}

export const createLessonsSlice: StateCreator<AppState, [["zustand/persist", unknown]], [], LessonsSlice> = (set) => ({
  lessons: LESSONS,

  // Функция добавления
  addLesson: (lessonData) => {
      const newId = `l_${Date.now()}`;

      // Объединяем дату и время
      const lessonDateTime = dayjs(`${lessonData.date} ${lessonData.time}`, "YYYY-MM-DD HH:mm");

      // Проверяем, наступил ли этот момент раньше, чем "прямо сейчас"
      const newStatus: LessonStatus = lessonDateTime.isBefore(dayjs())
        ? "completed"
        : "scheduled";

      const newLesson: Lesson = {
        ...lessonData,
        id: newId,
        status: newStatus,
      };

      set((state) => ({
        lessons: [...state.lessons, newLesson]
      }))
    },

  // Функция редактирования
  editLesson: (id, updatedData) => {
    set((state) => ({
      lessons: state.lessons.map((lesson) =>
        lesson.id === id ? { ...lesson, ...updatedData } : lesson
      )
    }))
  },

  // Функция удаления
  deleteLesson: (id) => {
    set((state) => ({
      lessons: state.lessons.filter((lesson) => lesson.id !== id)
    }))
  }
});
