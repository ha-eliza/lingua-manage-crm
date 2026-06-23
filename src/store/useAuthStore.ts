import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CurrentUser, UserRole } from "../types";

export interface AuthState {
  currentUser: CurrentUser;
  userRole: UserRole | null;
  setCurrentUser: (user: CurrentUser) => void;
  logoutUser: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      currentUser: null,
      userRole: null,

      setCurrentUser: (user) => set({
        currentUser: user,
        userRole: user ? user.role : null
      }),

      logoutUser: () => set({ currentUser: null, userRole: null }),
    }),
    {
      name: 'lingua-auth-storage', // Ключ для сессии в сессии браузера
    }
  )
);

