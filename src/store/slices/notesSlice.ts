import type { StateCreator } from "zustand";
import type { Note } from "../../types";
import type { AppState } from "../useAppStore";
import dayjs from "dayjs";
import { NOTES } from "../../data/notes";

export interface NotesSlice {
  notes: Note[];
  addNote: (
    noteData: Omit<Note, "id" | "completed" | "createdAt" | "completedAt">,
  ) => void;
  deleteNote: (id: string) => void;
  toggleNoteComplete: (id: string) => void;
  updatedNote: (id: string, newDeadline: string) => void;
}

export const createNotesSlice: StateCreator<
  AppState,
  [["zustand/persist", unknown]],
  [],
  NotesSlice
> = (set) => ({
  notes: NOTES,

  addNote: (noteData) => {
    const newFields = {
      ...noteData,
      completed: false,
      createdAt: dayjs().format("DD.MM.YYYY"),
    };

    const newNote: Note = {
      id: `n_${Date.now()}`,
      ...newFields,
    };

    set((state) => ({
      notes: [...state.notes, newNote],
    }));
  },

  toggleNoteComplete: async (id) => {
    const completedAtDate = dayjs().format("DD.MM.YYYY");

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
  },

  deleteNote: (id) => {
    set((state) => ({
      notes: state.notes.filter((note) => note.id !== id),
    }));
  },

  updatedNote: (id, newDeadline) => {
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
  },
});
