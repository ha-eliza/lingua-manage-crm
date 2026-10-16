import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CurrentUser, Student, Teacher, UserRole } from "../types";
import { USERS } from '../data/users';

export interface AuthState {
  currentUser: CurrentUser;
  userRole: UserRole | null;
  setCurrentUser: (user: CurrentUser) => void;
  logoutUser: () => void;
  findUser: (login: string, password: string) => Student | Teacher | null
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

      findUser: (login, password) => {
        return (
          USERS.find((user) => {
            if (user.role === 'teacher') {
              return user.email === login && user.password === password
            }
            return user.login.login === login && user.login.password === password
          }) || null
        )
      }
    }),
    {
      name: 'lingua-auth-storage', // Ключ для сессии в сессии браузера
    }
  )
);

