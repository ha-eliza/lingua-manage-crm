import React from "react";
import { useParams, useNavigate } from "react-router";
import {
  Card,
  Tag,
  Button,
  Space,
  Descriptions,
  Divider,
  Empty,
  Select,
  message,
} from "antd";
import {
  ArrowLeftOutlined,
  CalendarOutlined,
  KeyOutlined,
  SettingOutlined,
  TrophyOutlined,
} from "@ant-design/icons";
import { useAppStore } from "../store/useAppStore";
import type { EnglishLevel, Lesson, StudentStatus } from "../types";

export const StudentProfilePage: React.FC = () => {
  // 1. Вытаскиваем :id из URL
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const updateStudentStatus = useAppStore((state) => state.updateStudentStatus);
  const updateStudentLevel = useAppStore((state) => state.updateStudentLevel);

  // 2. Достаем массив студентов из Zustand
  const students = useAppStore((state) => state.students);
  const lessons = useAppStore((state) => state.lessons || []); // достаем массив уроков чтобы посчитать кол-во

  // 3. Ищем конкретного студента по его ID
  const student = students.find((s) => s.id === id);

  // Если студент с таким ID не найден, показываем заглушку
  if (!student) {
    return (
      <Card className="text-center">
        <Empty description="Студент не найден" />
        <Button
          type="primary"
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate("/students")}
          style={{
            marginTop: "20px",
            background: "var(--color-brand-primary)",
          }}
        >
          Вернуться к списку
        </Button>
      </Card>
    );
  }

  // Настройка цвета тега уровня английского
  let levelColor = "blue";
  if (student.level.startsWith("A")) levelColor = "green";
  if (student.level.startsWith("C")) levelColor = "purple";

  // Всего уроков
  const totalLessons = lessons.filter(
    (lesson: Lesson) => lesson.studentId === student.id,
  ).length;

  // Изменение уровня (A1-C2)
  const handleLevelChange = (newLevel: EnglishLevel) => {
    updateStudentLevel(student.id, newLevel);
    message.success(
      `Уровень студента успешно изменен на ${newLevel}!`,
    );
  };

  // Изменение статуса (активно/завершено)
  const handleStatusChange = (newStatus: StudentStatus) => {
    updateStudentStatus(student.id, newStatus);
    message.success(`Статус студента обновлен!`);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* Кнопка Назад */}
      <div>
        <Button
          type="text"
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate("/students")}
          style={{ fontWeight: "500", color: "#64748B" }}
        >
          Назад к списку студентов
        </Button>
      </div>

      {/* ГЛАВНАЯ КАРТОЧКА ПРОФИЛЯ */}
      <div className="flex items-center justify-between flex-wrap gap-5">
        {/* Левый блок: Аватар */}
        <div className="flex items-center gap-5">
          <div
            style={{
              width: "72px",
              height: "72px",
              borderRadius: "50%",
              backgroundColor: student.avatarColor,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              fontWeight: "700",
              fontSize: "28px",
            }}
          >
            {student.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[var(--color-brand-text)]">
              {student.name}
            </h1>
            <p className="text-sm text-gray-500">{student.email}</p>
          </div>
        </div>

        {/* Правый блок: теги статуса и уровня */}
        <Space size="middle" style={{ marginLeft: "auto" }}>
          <Tag
            color={levelColor}
            style={{
              fontWeight: "600",
              padding: "4px 10px",
              fontSize: "14px",
              borderRadius: "6px",
            }}
          >
            <TrophyOutlined /> Уровень: {student.level}
          </Tag>
          <Tag
            color={student.status === "active" ? "green" : "default"}
            style={{
              fontWeight: "600",
              padding: "4px 10px",
              fontSize: "14px",
              borderRadius: "6px",
            }}
          >
            <>
              <SettingOutlined className="mr-2" />
              {student.status === "active" ? "Активен" : "Завершен"}
            </>
          </Tag>
        </Space>
      </div>

      <Divider />

      {/* ДЕТАЛЬНАЯ ИНФОРМАЦИЯ И УПРАВЛЕНИЕ */}
      <Descriptions
        title="Данные обучения и управление"
        layout="vertical"
        bordered
        column={{ xs: 1, sm: 2, md: 3 }}
      >
        <Descriptions.Item
          label={
            <>
              <CalendarOutlined /> Всего занятий в расписании
            </>
          }
        >
          <Tag color="blue" className="font-bold text-base! px-2!">
            {totalLessons} уроков
          </Tag>
        </Descriptions.Item>

        <Descriptions.Item
          label={
            <>
              <TrophyOutlined /> Изменить уровень CEFR
            </>
          }
        >
          <Select
            value={student.level}
            onChange={handleLevelChange}
            style={{ width: "100%" }}
            options={[
              { value: "A1", label: "A1 — Beginner" },
              { value: "A2", label: "A2 — Elementary" },
              { value: "B1", label: "B1 — Intermediate" },
              { value: "B2", label: "B2 — Upper-Intermediate" },
              { value: "C1", label: "C1 — Advanced" },
              { value: "C2", label: "C2 — Proficiency" },
            ]}
          />
        </Descriptions.Item>

        <Descriptions.Item
          label={
            <>
              <SettingOutlined /> Текущий статус
            </>
          }
        >
          <Select
            value={student.status}
            onChange={handleStatusChange}
            style={{ width: "100%" }}
            options={[
              { value: "active", label: "Активен" },
              { value: "completed", label: "Завершен" },
            ]}
          />
        </Descriptions.Item>
      </Descriptions>

      <Divider />

      {/* КАРТОЧКА С ДОСТУПАМИ ДЛЯ ВХОДА */}
      <div className="bg-[#EFF6FF] border border-[#BFDBFE] p-5 rounded-xl">
        <h3 className="mb-3 flex items-center gap-2 text-[var(--color-brand-text)] font-semibold">
          <KeyOutlined /> Учетные данные для входа студента
        </h3>
        <p className="text-[var(--color-brand-text)] text-[13px] mb-2">
          Передайте эти данные студенту, чтобы он мог авторизоваться в своем
          личном кабинете со своего устройства.
        </p>
        <div className="flex gap-10 flex-wrap">
          <div>
            <span className="block text-[12px] text-[#60A5FA]">
              ЛОГИН
            </span>
            <strong className="font-mono text-[15px] text-[var(--color-brand-text)]">
              {student.login.login}
            </strong>
          </div>
          <div>
            <span className="block text-[12px] text-[#60A5FA]">
              ПАРОЛЬ
            </span>
            <strong className="font-mono text-[15px] text-[var(--color-brand-text)]">
              {student.login.password}
            </strong>
          </div>
        </div>
      </div>
    </div>
  );
};
