import type { StateCreator } from "zustand";
import type { Note } from "../../types";
import { mockNotes } from "../../types/mockData";
import type { AppState } from "../useAppStore";
import dayjs from "dayjs";

export interface NotesSlice {
  notes: Note[],
  addNote: (noteData: Omit<Note, "id" | "completed" | "createdAt" | "completedAt">) => void;
  deleteNote: (id: string) => void;
  toggleNoteComplete: (id: string) => void;
  updatedNote: (id: string, newDeadline: string) => void;
}

export const createNotesSlice: StateCreator<AppState, [["zustand/persist", unknown]], [], NotesSlice> = (set) => ({
  notes: mockNotes,

  addNote: (noteData) =>
    set((state) => {
      const newId = `n_${Date.now()}`;

      const newNote: Note = {
        ...noteData,
        id: newId,
        completed: false,
        createdAt: dayjs().format("DD.MM.YYYY"),
      };

    return { notes: [ ...state.notes, newNote] };
  }),

  toggleNoteComplete: (id) =>
    set((state) => ({
      notes: state.notes.map((note) => { // ищем конкретную заметку
        if (note.id === id) { // если id = id то
          return {
            ...note, // остальные данные
            completed: true, // статус completed = true
            // Дата выполнения при клике
            completedAt: dayjs().format("DD.MM.YYYY"),
          };
        }
        return note; // Остальные заметки возвращаем без изменений
      }),
    })),

  deleteNote: (id) =>
    set((state) => ({
      notes: state.notes.filter((note) => note.id !== id)
    })),

  updatedNote: (id, newDeadline) =>
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
    }))
})
