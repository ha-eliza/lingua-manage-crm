import type { StateCreator } from "zustand";
import type { Lesson, LessonStatus } from "../../types";
import type { AppState } from "../useAppStore";
import dayjs from "dayjs";
import { collection, deleteDoc, doc, getDocs, setDoc } from "firebase/firestore";
import { db } from "../../firebase";

export interface LessonsSlice {
  lessons: Lesson[];
  fetchLessons: () => Promise<void>;
  addLesson: (lessonData: Omit<Lesson, "id" | "status">) => void;
  editLesson: (id: string, updatedData: Omit<Lesson, "id">) => void;
  deleteLesson: (id: string) => void;
}

export const createLessonsSlice: StateCreator<AppState, [["zustand/persist", unknown]], [], LessonsSlice> = (set) => ({
  lessons: [],

  fetchLessons: async () => {
    try {
      // 1. Скачиваем документы из коллекции "lessons"
      const querySnapshot = await getDocs(collection(db, "lessons"));

      // 2. Превращаем их в обычный массив объектов с ID
      const firebaseLessons = querySnapshot.docs.map((document) => ({
        id: document.id,
        ...document.data(),
      })) as Lesson[];

      // 3. Записываем данные в Zustand
      set({ lessons: firebaseLessons });
    } catch (error) {
      console.error("Ошибка при получении уроков из Firebase:", error);
    }
  },

  // Функция добавления
  addLesson: async (lessonData) => {
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

      try {
      // Записываем в базу данных Firebase
        await setDoc(doc(db, "lessons", newId), newLesson);

      // Записываем в Zustand
        set((state) => ({
          lessons: [...state.lessons, newLesson]
        }));
      } catch (error) {
        console.error("Ошибка добавления урока в Firebase:", error);
      }
    },

  // Функция редактирования
  editLesson: async (id, updatedData) => {

    try {
      // Обновляем данные в Firebase Firestore
      await setDoc(doc(db, "lessons", id), { ...updatedData }, { merge: true });

      // Обновляем данные локально в Zustand
      set((state) => ({
        lessons: state.lessons.map((lesson) =>
          lesson.id === id
            ? { ...lesson, ...updatedData }
            : lesson,
        ),
      }));
    } catch (error) {
      console.error("Ошибка редактирования урока в Firebase:", error);
    }
  },

  // Функция удаления
  deleteLesson: async (id) => {
    try {
      // Удаляем документ из Firebase
      await deleteDoc(doc(db, "lessons", id));

      // Удаляем из локального стейта Zustand
      set((state) => ({
        lessons: state.lessons.filter((lesson) => lesson.id !== id),
      }));
    } catch (error) {
      console.error("Ошибка удаления урока из Firebase:", error);
    }
  }
});
