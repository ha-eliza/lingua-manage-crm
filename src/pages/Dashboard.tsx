import React from "react";
import { useAppStore } from "../store/useAppStore";
import { useAuthStore } from "../store/useAuthStore";
import dayjs from "dayjs";
import { KeyOutlined } from "@ant-design/icons";
import type { Student, Teacher } from "../types";

export const DashboardPage: React.FC = () => {
  // 1. Забираем данные и функции загрузки из сторов
  const notes = useAppStore((state) => state.notes);
  const lessons = useAppStore((state) => state.lessons);

  // 2. Данные пользователя и его роль
  const currentUser = useAuthStore((state) => state.currentUser);
  const userRole = useAuthStore((state) => state.userRole);

  const isTeacher = userRole === "teacher";

  const currentUserId = currentUser?.id || "";

  // Горящие заметки (невыполненные заметки)
  const burningNotes = notes.filter(
    (note) =>
      note.userId === currentUserId &&
      !note.completed &&
      note.priority === "high",
  );

  // Ближайшие занятия (первые 3 запланированных урока для текущего юзера)
  const upcomingLessons = lessons
    .filter((lesson) => {
      // Преподаватель видит все запланированные, студент — только свои
      const isMyLesson =
        userRole === "teacher" || lesson.studentId === currentUserId;
      return isMyLesson && lesson.status === "scheduled";
    })
    .sort((a, b) => a.id.localeCompare(b.id)) // Сортировка по ID
    .slice(0, 3); // Берём строго первые 3

  // Сколько прошло занятий (для студента — его личные, для учителя — вообще все проведенные)
  const completedLessonsCount = lessons.filter((lesson) => {
    const isMyLesson =
      userRole === "teacher" || lesson.studentId === currentUserId;
    return isMyLesson && lesson.status === "completed";
  }).length;

  return (
    <div className="h-full custom-scrollbar">
      <div className="bg-white border border-gray-100 rounded-2xl p-6 mb-8 flex flex-col sm:flex-row justify-between items-center gap-6 shadow-sm">
        {/* Левая часть: Приветствие */}
        <div className="flex items-center gap-4">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center text-xl font-bold text-white shadow-xs"
            style={{ backgroundColor: currentUser?.avatarColor || "#4F46E5" }}
          >
            {(currentUser?.name || "П")[0]}
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <h1 className="text-xl font-bold text-gray-800">
                Добро пожаловать, {currentUser?.name || "Пользователь"}!
              </h1>
              <span
                className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                  userRole === "teacher"
                    ? "bg-purple-50 text-purple-700 border border-purple-100"
                    : "bg-pink-50 text-pink-700 border border-pink-100"
                }`}
              >
                {userRole === "teacher" ? "Преподаватель" : "Студент"}
              </span>
            </div>
            <p className="text-gray-400 text-xs">
              Обзор вашей активности в CRM-системе Lingua
            </p>
          </div>
        </div>

        {/* Правая часть */}
        <div className="bg-slate-50/60 border border-slate-100 px-5 py-3 rounded-xl flex items-center gap-4 min-w-50 justify-between">
          <div>
            <span className="text-gray-400 text-[10px] font-bold uppercase tracking-wider block mb-0.5">
              Проведено занятий
            </span>
            <span className="text-gray-400 text-xs block">
              {userRole === "teacher" ? "всего в системе" : "за всё обучение"}
            </span>
          </div>
          <span className="text-3xl font-black text-indigo-600 bg-white w-12 h-12 rounded-lg flex items-center justify-center border border-slate-100 shadow-xs">
            {completedLessonsCount}
          </span>
        </div>
      </div>

      {/* Основной контент */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* БЛОК: Горящие заметки */}
        <div className="bg-white p-6 rounded-xl shadow-xs border border-gray-100">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                Горящие задачи
              </h2>
              <span className="bg-red-100 text-red-700 text-xs px-2 py-0.5 rounded-full font-semibold">
                {burningNotes.length}
              </span>
            </div>
            <a href="#" className="text-red-700 text-[14px]">
              К заметкам &rarr;
            </a>
          </div>

          <div>
            {burningNotes.length === 0 ? (
              <p className="text-gray-400 text-sm italic py-4">
                Нет активных горящих задач.
              </p>
            ) : (
              burningNotes.map((note) => (
                <div
                  key={note.id}
                  className={`p-3 mb-2  rounded-lg border-l-4 border-[#f87171] bg-red-50/50 flex justify-between items-start gap-4`}
                >
                  <div>
                    <p className="text-sm text-gray-800 font-medium">
                      {note.text}
                    </p>
                  </div>
                  {note.deadline && (
                    <span className="text-xs bg-white px-2 py-1 rounded-md border border-[#f87171] text-[#f87171] whitespace-nowrap font-medium">
                      до {dayjs(note.deadline).format("DD.MM")}
                    </span>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* БЛОК: Ближайшие уроки */}
        <div className="bg-white p-6 rounded-xl shadow-xs border border-gray-100">
          <div className="flex justify-between">
            <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              Ближайшие уроки
            </h2>
            <a href="" className="text-indigo-600 text-[14px]">
              В календарь &rarr;
            </a>
          </div>

          <div>
            {upcomingLessons.length === 0 ? (
              <p className="text-gray-400 text-sm italic py-4">
                Новых занятий пока не запланировано.
              </p>
            ) : (
              upcomingLessons.map((lesson) => (
                <div
                  key={lesson.id}
                  className="p-3 mb-2 rounded-lg border border-slate-100 bg-linear-to-r from-blue-50/50 to-indigo-50/10 flex justify-between items-center"
                >
                  <div className="truncate pr-4">
                    <span className="text-xs font-bold text-indigo-600 block mb-0.5">
                      {lesson.time}
                    </span>
                    <span className="text-sm font-semibold text-gray-800 block truncate">
                      {lesson.topic}
                    </span>
                  </div>
                  <div className="text-right whitespace-nowrap">
                    <span className="text-xs bg-indigo-100 text-indigo-700 font-semibold px-2 py-1 rounded-md">
                      {dayjs(lesson.date).format("DD.MM.YYYY")}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
        {/* КАРТОЧКА С ДОСТУПАМИ ДЛЯ ВХОДА */}
        <div className="bg-[#EFF6FF] border border-[#BFDBFE] p-5 rounded-xl">
          <h3 className="mb-3 flex items-center gap-2 text-brand-text font-semibold">
            <KeyOutlined /> Мои учетные данные для входа
          </h3>
          <div className="flex gap-10 flex-wrap">
            <div>
              <span className="block text-[12px] text-[#60A5FA]">ЛОГИН</span>
              <strong className="font-mono text-[15px] text-brand-text">
                {isTeacher
                  ? (currentUser as Teacher)?.email
                  : (currentUser as Student)?.login.login}
              </strong>
            </div>
            <div>
              <span className="block text-[12px] text-[#60A5FA]">ПАРОЛЬ</span>
              <strong className="font-mono text-[15px] text-brand-text">
                {isTeacher
                  ? (currentUser as Teacher)?.password
                  : (currentUser as Student)?.login.password}
              </strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
