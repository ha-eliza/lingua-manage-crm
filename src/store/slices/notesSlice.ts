import type { StateCreator } from "zustand";
import type { Note } from "../../types";
import type { AppState } from "../useAppStore";
import dayjs from "dayjs";
import { addDoc, collection, deleteDoc, doc, getDocs, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";

export interface NotesSlice {
  notes: Note[];
  fetchNotes: () => Promise<void>;
  addNote: (
    noteData: Omit<Note, "id" | "completed" | "createdAt" | "completedAt">,
  ) => void;
  deleteNote: (id: string) => void;
  toggleNoteComplete: (id: string) => void;
  updatedNote: (id: string, newDeadline: string) => void;
}

export const createNotesSlice: StateCreator<AppState, [["zustand/persist", unknown]], [], NotesSlice> = (set) => ({
  notes: [],

  fetchNotes: async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "notes"));
      const firebaseNotes = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Note[];

      set({ notes: firebaseNotes });
    } catch (error) {
      console.error("Ошибка Firebase:", error);
    }
  },

  addNote: async (noteData) => {
    const newFields = {
      ...noteData,
      completed: false,
      createdAt: dayjs().format("DD.MM.YYYY"),
    };

    try {
      const docRef = await addDoc(collection(db, "notes"), newFields);

      set((state) => {
        const newNote: Note = {
          id: docRef.id,
          ...newFields,
        };
        return { notes: [...state.notes, newNote] };
      });
    } catch (error) {
      console.error("Ошибка добавления в Firebase:", error);
    }
  },

  toggleNoteComplete: async (id) => {
    const completedAtDate = dayjs().format("DD.MM.YYYY");

    try {
      // Обновляем статус в самой базе данных Firebase
      await updateDoc(doc(db, "notes", id), {
        completed: true,
        completedAt: completedAtDate,
      });

      set((state) => ({
        notes: state.notes.map((note) => {
          if (note.id === id) {
            return {
              ...note,
              completed: true,
              completedAt: completedAtDate,
            };
          }
          return note;
        }),
      }));
    } catch (error) {
      console.error("Ошибка обновления статуса:", error);
    }
  },

  deleteNote: async (id) => {
    try {
      // 1. Удаляем из базы данных Firebase
      await deleteDoc(doc(db, "notes", id));

      set((state) => ({
        notes: state.notes.filter((note) => note.id !== id),
      }));
    } catch (error) {
      console.error("Ошибка удаления:", error);
    }
  },

  updatedNote: async (id, newDeadline) => {
    try {
      // 1. Обновляем дедлайн в базе данных Firebase
      await updateDoc(doc(db, "notes", id), {
        deadline: newDeadline,
      });

      set((state) => ({
        notes: state.notes.map((note) => {
          if (note.id === id) {
            return {
              ...note,
              deadline: newDeadline,
            };
          }
          return note;
        }),
      }));
    } catch (error) {
      console.error("Ошибка изменения дедлайна:", error);
    }
  },
});
