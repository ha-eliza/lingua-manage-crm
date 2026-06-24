import { Button } from "antd";
import { useAppStore } from "../store/useAppStore";
import { LeftOutlined, PlusOutlined, RightOutlined } from "@ant-design/icons";
import { useState } from "react";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import "dayjs/locale/ru";

// Переводим даты на русский
dayjs.locale("ru");

export const CalendarPage = () => {
  // 1. Забираем данные из Zustand
  const lessons = useAppStore((state) => state.lessons);
  const students = useAppStore((state) => state.students)

  // 2. Настраиваем недели
  const [currentWeekStart, setCurrentWeekStart] = useState<Dayjs>(
    dayjs().startOf("week"),
  );
  const weekDays = Array.from({ length: 7 }).map((_, i) =>
    currentWeekStart.add(i, "day"),
  );

  return (
    <div className="h-full flex flex-col gap-4 overflow-hidden">
      {/* Шапка */}
      <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
        <div className="flex items-center gap-3">
          <Button
            icon={<LeftOutlined />}
            onClick={() =>
              setCurrentWeekStart(currentWeekStart.subtract(1, "week")) // предыдущая неделя
            }
          />
          <h2 className="text-lg font-bold text-gray-800 capitalize">
            {currentWeekStart.format("MMMM YYYY")}
          </h2>
          <Button
            icon={<RightOutlined />}
            onClick={() => setCurrentWeekStart(currentWeekStart.add(1, "week"))} // следущая неделя
          />
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
        >
          Добавить занятие
        </Button>
      </div>

      {/* Сетка на 7 колонок */}
      <div className="grid grid-cols-7 gap-3 flex-1">
        {weekDays.map((day) => {
          const dateStr = day.format("YYYY-MM-DD");
          const dayLessons = lessons.filter((l) => l.date === dateStr);
          const isToday = day.isSame(dayjs(), "day");

          return (
            <div
              key={dateStr}
              className={`flex flex-col h-full bg-white rounded-xl border overflow-hidden ${isToday ? "border-blue-500 ring-2 ring-blue-100" : "border-gray-100"}`}
            >
              <div
                className={`p-3 text-center border-b border-gray-50 ${isToday ? "bg-blue-50" : "bg-slate-50/50"}`}
              >
                <div className="text-xs font-bold uppercase text-gray-400">
                  {day.format("dd")}
                </div>
                <div className="text-xl font-extrabold text-gray-800">
                  {day.format("D")}
                </div>
              </div>

              <div className="p-2 flex-1 flex flex-col gap-2 overflow-y-auto min-h-0 custom-scrollbar">
                {dayLessons.map((lesson) => {
                  const student = students.find(
                    (s) => s.id === lesson.studentId,
                  );
                  return (
                    <div
                      key={lesson.id}
                      className="bg-linear-to-r from-blue-50 to-indigo-50/30 border-l-4 border-blue-500 p-2 rounded-lg text-xs cursor-pointer"
                    >
                      <span className="font-bold text-blue-700 block">
                        {lesson.time}
                      </span>
                      <span className="text-gray-800 font-semibold block truncate">
                        {student?.name || "Удаленный студент"}
                      </span>
                      <span className="text-gray-400 block truncate italic">
                        {lesson.topic}
                      </span>
                    </div>
                  );
                })}
              </div>

              <button className="m-2 p-1.5 border border-dashed border-gray-200 rounded-lg text-xs text-gray-400 cursor-pointer">
                + Назначить
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
