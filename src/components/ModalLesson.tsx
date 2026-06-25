import React from "react";
import {
  Modal,
  Form,
  Select,
  TimePicker,
  DatePicker,
  Button,
  Input,
  type FormInstance,
} from "antd";
import dayjs, { Dayjs } from "dayjs";
import { DeleteOutlined } from "@ant-design/icons";
import { type Lesson, type Student } from "../types/index";

interface ModalFormProps {
  isOpen: boolean;
  onClose: () => void;
  editingLesson: Lesson | null;
  selectedDate: Dayjs | null;
  setSelectedDate: (date: Dayjs | null) => void;
  students: Student[];
  onSave: (values: Omit<Lesson, "id">) => void;
  onDelete: () => void;
  form: FormInstance;
}

export const ModalLesson: React.FC<ModalFormProps> = ({
  isOpen,
  onClose,
  editingLesson,
  selectedDate,
  setSelectedDate,
  students,
  onSave,
  onDelete,
  form,
}) => {
  return (
    <Modal
      open={isOpen}
      onCancel={onClose}
      footer={null}
      centered
      destroyOnClose
      className="rounded-2xl"
      title={
        <span className="text-xl font-bold text-gray-800">
          {editingLesson ? "Информация о занятии" : "Назначить новый урок"}
        </span>
      }
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={onSave}
        size="large"
        initialValues={{
          date: editingLesson
            ? dayjs(editingLesson.date)
            : selectedDate
              ? dayjs(selectedDate)
              : dayjs(),
        }}
      >
        {/* Дата */}
        <Form.Item
          name="date"
          rules={[{ required: true, message: "Выберите дату!" }]}
        >
          <div className="flex items-center gap-2 p-4 bg-slate-50 text-slate-600 font-medium rounded-2xl border border-slate-100 shadow-sm transition-all hover:border-blue-200">
            <span className="whitespace-nowrap">Дата занятия:</span>
            <DatePicker
              format="DD.MM.YYYY"
              placeholder="Выбрать дату"
              allowClear={false}
              variant="none"
              value={selectedDate}
              className="p-0! font-extrabold text-blue-600! cursor-pointer w-full"
              onChange={(date) => {
                if (date) {
                  setSelectedDate(date);
                  form.setFieldsValue({ date });
                }
              }}
            />
          </div>
        </Form.Item>

        {/* Выбор студента */}
        <Form.Item
          name="studentId"
          label="Выберите студента"
          rules={[{ required: true, message: "Пожалуйста, выберите ученика!" }]}
        >
          <Select placeholder="Поиск студента...">
            {students
              .filter((student) => student.status === "active")
              .map((student) => (
                <Select.Option key={student.id}>{student.name}</Select.Option>
              ))}
          </Select>
        </Form.Item>

        {/* Время */}
        <Form.Item
          name="time"
          label="Время начала"
          rules={[{ required: true, message: "Укажите время!" }]}
        >
          <TimePicker
            format="HH:mm"
            className="w-full"
            placeholder="Выбрать время"
            hideDisabledOptions
          />
        </Form.Item>

        {/* Тема */}
        <Form.Item
          name="topic"
          label="Тема урока"
          rules={[{ required: true, message: "Введите тему!" }]}
        >
          <Input placeholder="Грамматика Present Perfect" />
        </Form.Item>
        {/* Домашнее задание */}
        <Form.Item name="homework" label="Домашнее задание">
          <Input.TextArea
            rows={3}
            placeholder="Введите текст задания для студента..."
          />
        </Form.Item>

        {/* Кнопки управления */}
        <Form.Item>
          <div className="flex justify-between items-center w-full">
            {editingLesson ? (
              <Button
                danger
                type="text"
                icon={<DeleteOutlined />}
                onClick={onDelete}
              >
                Удалить занятие
              </Button>
            ) : (
              <div />
            )}

            <div className="flex gap-2">
              <Button onClick={onClose}>Отмена</Button>
              <Button type="primary" htmlType="submit">
                {editingLesson ? "Сохранить изменения" : "Создать"}
              </Button>
            </div>
          </div>
        </Form.Item>
      </Form>
    </Modal>
  );
};
