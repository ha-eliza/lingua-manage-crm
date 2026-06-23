import React, { useState } from "react";
import { Table, Button, Modal, Form, Input, Select, message } from "antd";
import { PlusOutlined, SearchOutlined, UserOutlined } from "@ant-design/icons";
import { useAppStore } from "../store/useAppStore";
import { getStudentsColumns } from "../components/getStudentsColumns";
import type { EnglishLevel } from "../types";

export const StudentsPage: React.FC = () => {
  // 1. Забираем данные из Zustand
  const students = useAppStore((state) => state.students);
  const addStudent = useAppStore((state) => state.addStudent);
  const deleteStudent = useAppStore((state) => state.deleteStudent);

  // Стейты для модального окна
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [form] = Form.useForm();

  // 2. Колонки таблицы
  const columns = getStudentsColumns({ deleteStudent });

  // 3. Обработка создания студента из формы
  const handleFormSubmit = (values: {name: string; email: string; level: EnglishLevel}) => {
    addStudent({
      name: values.name,
      email: values.email,
      level: values.level,
      status: "active", // Новый студент всегда активен по умолчанию
    });

    setIsModalOpen(false);
    form.resetFields();
    message.success("Новый студент успешно добавлен в базу!");
  };

  // Общее количество студентов в базе
  const totalStudents = students.length;

  // Считаем сколько студентов с уровнем B (B1 + B2)
  const bLevelStudents = students.filter(
    (student) => student.level === "B1" || student.level === "B2",
  ).length;

  // Считаем сколько студентов с уровнем C (C1 + C2)
  const cLevelStudents = students.filter(
    (student) => student.level === "C1" || student.level === "C2",
  ).length;

  // Поиск
  const filteredStudents = students.filter(
    (student) =>
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.email.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-5 w-full mb-3">
        {/* Карточка 1: Всего студентов */}
        <div className="flex-1 border border-gray-200 rounded-2xl p-4">
          <div className="text-gray-600">Всего студентов</div>
          <div className="text-right text-5xl font-bold">{totalStudents}</div>
        </div>

        {/* Карточка 2: Уровень B */}
        <div className="flex-1 border border-gray-200 rounded-2xl p-4">
          <div className="text-gray-600">Уровень B (B1-B2)</div>
          <div className="text-right text-5xl font-bold">{bLevelStudents}</div>
        </div>

        {/* Карточка 3: Уровень C */}
        <div className="flex-1 border border-gray-200 rounded-2xl p-4">
          <div className="text-gray-600">Уровень C (C1-C2)</div>
          <div className="text-right text-5xl font-bold">{cLevelStudents}</div>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <Input
          placeholder="Поиск студента"
          allowClear
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          prefix={
            <SearchOutlined style={{ color: "#94A3B8", marginRight: "4px" }} />
          }
          style={{ maxWidth: "320px", height: "35px" }}
        />
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setIsModalOpen(true)}
          style={{
            borderRadius: "12px",
            height: "42px",
            background: "var(--color-brand-primary)",
          }}
        >
          Добавить студента
        </Button>
      </div>

      {/* Таблица */}
      <Table
        dataSource={filteredStudents}
        columns={columns}
        rowKey="id"
        pagination={{ pageSize: 5 }}
      />

      {/* Модальное окно */}
      <Modal
        title="Добавить нового студента"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleFormSubmit}
          className="pt-5!"
        >
          <Form.Item
            name="name"
            label="ФИО Студента"
            rules={[{ required: true, message: "Введите имя и фамилию" }]}
          >
            <Input
              placeholder="Александр Петров"
              size="large"
              prefix={<UserOutlined style={{ color: "#94A3B8" }} />}
            />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: "Введите Email" },
              { type: "email", message: "Введите корректный адрес почты" },
            ]}
          >
            <Input placeholder="alex.petrov@mail.ru" size="large" />
          </Form.Item>

          <Form.Item
            name="level"
            label="Текущий уровень английского"
            rules={[{ required: true, message: "Выберите уровень" }]}
          >
            <Select placeholder="Выберите уровень CEFR" size="large">
              <Select.Option value="A1">A1 — Beginner</Select.Option>
              <Select.Option value="A2">A2 — Elementary</Select.Option>
              <Select.Option value="B1">B1 — Intermediate</Select.Option>
              <Select.Option value="B2">B2 — Upper-Intermediate</Select.Option>
              <Select.Option value="C1">C1 — Advanced</Select.Option>
              <Select.Option value="C2">C2 — Proficiency</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item className="block text-right">
            <Button
              size="large"
              onClick={() => setIsModalOpen(false)}
              style={{ marginRight: "8px" }}
            >
              Отмена
            </Button>
            <Button
              size="large"
              type="primary"
              htmlType="submit"
              style={{
                background: "var(--color-brand-primary)",
              }}
            >
              Создать учетную запись
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};
