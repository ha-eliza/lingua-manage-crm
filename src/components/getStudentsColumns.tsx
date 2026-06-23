import { DeleteOutlined, RightCircleOutlined } from "@ant-design/icons";
import {
  Button,
  message,
  Popconfirm,
  Tag,
  type TableColumnsType,
} from "antd";
import type { Student, EnglishLevel, StudentStatus } from "../types";

interface ColumnsProps {
  deleteStudent: (id: string) => void;
}

export const getStudentsColumns = ({
  deleteStudent,
}: ColumnsProps): TableColumnsType<Student> => [
  {
    title: "Студент",
    dataIndex: "name",
    key: "name",
    render: (text: string, record: Student) => (
      <div className="flex gap-4 items-center">
        <div
          style={{
            width: "36px",
            height: "36px",
            borderRadius: "50%",
            backgroundColor: record.avatarColor,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#fff",
            fontWeight: "700",
            fontSize: "14px",
          }}
        >
          {text.charAt(0).toUpperCase()}
        </div>
        <span style={{ fontWeight: "600" }}>{text}</span>
      </div>
    ),
  },
  {
    title: "Email",
    dataIndex: "email",
    key: "email",
  },
  {
    title: "Уровень",
    dataIndex: "level",
    key: "level",
    render: (level: EnglishLevel) => {
      let color = "blue";
      if (level.startsWith("A")) color = "green";
      if (level.startsWith("C")) color = "purple";
      return (
        <Tag color={color} style={{ fontWeight: "600" }}>
          {level}
        </Tag>
      );
    },
  },
  {
    title: "Статус",
    dataIndex: "status",
    key: "status",
    render: (status: StudentStatus) => {
      let color
      if (status === "active") {
        color = "green";
      }
      return <Tag color={color} style={{ fontWeight: "600" }}>{status}</Tag>;
    },
  },
  {
    title: "Доступы для входа",
    key: "login",
    render: (_: unknown, record: Student) => (
      <div
        style={{ fontSize: "12px", color: "#64748B", fontFamily: "monospace" }}
      >
        <div>Логин: {record.login.login}</div>
        <div>Пароль: {record.login.password}</div>
      </div>
    ),
  },
  {
    title: "Действия",
    key: "actions",
    render: (_: unknown, record: Student) => (
      <div className="flex gap-2">
        <Popconfirm
          title="Удалить студента?"
          description="Это действие полностью удалит студента из базы."
          onConfirm={() => {
            deleteStudent(record.id);
            message.warning("Студент удален из системы");
          }}
          okText="Да"
          cancelText="Отмена"
        >
          <Button type="text" danger icon={<DeleteOutlined />} />
        </Popconfirm>
        <RightCircleOutlined />
      </div>
    ),
  },
];
