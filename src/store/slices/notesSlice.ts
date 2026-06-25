import type { StateCreator } from "zustand";
import type { Note } from "../../types";
import { mockNotes } from "../../types/mockData";
import type { AppState } from "../useAppStore";

export interface NotesSlice {
  notes: Note[]
}

export const createNotesSlice: StateCreator<AppState, [["zustand/persist", unknown]], [], NotesSlice> = () => ({
  notes: mockNotes
});
