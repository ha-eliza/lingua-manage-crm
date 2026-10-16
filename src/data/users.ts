import type { Student, Teacher } from "../types";

export const USERS: (Student | Teacher)[] = [
  {
    id: "t1",
    name: "Мария Смирнова",
    email: "maria.eng@tutor.ru",
    role: "teacher",
    avatarColor: "#8B00FF",
    password: "hashed_password_123",
  },
  {
    id: "s1",
    name: "Александр Петров",
    email: "alex.petrov@mail.ru",
    role: "student",
    avatarColor: "#FF66B9",
    level: "B2",
    status: "active",
    login: {
      login: "alex_eng",
      password: "password1",
    },
  },
  {
    id: "s2",
    name: "Елена Иванова",
    email: "elena.ivanova@yandex.ru",
    role: "student",
    avatarColor: "#66B9FF",
    level: "A2",
    status: "active",
    login: {
      login: "elena_lingua",
      password: "password2",
    },
  },
];
