import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  DeleteOutlined,
  FireOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import {
  Button,
  DatePicker,
  Form,
  Input,
  message,
  Modal,
  Popconfirm,
  Radio,
} from "antd";
import dayjs from "dayjs";
import { useAppStore } from "../store/useAppStore";
import styles from "./Notes.module.css";
import type { Note } from "../types";
import { useState } from "react";

export const NotesPage = () => {
  const notes = useAppStore((state) => state.notes);
  const addNote = useAppStore((state) => state.addNote);
  const deleteNote = useAppStore((state) => state.deleteNote);
  const toggleNoteComplete = useAppStore((state) => state.toggleNoteComplete);
  const updatedNote = useAppStore((state) => state.updatedNote);

  const [form] = Form.useForm();
  const [isOpenModal, setIsOpenModal] = useState<string | null>(null); // хранит строку с идентификатором задачи
  const [newDeadline, setNewDeadline] = useState<dayjs.Dayjs | null>(null); // хранит ту дату, которую выбрал пользователь

  const handleFormSubmit = (values: any) => {

    const noteData: Omit<Note, "id" | "completed" | "createdAt" | "completedAt"> = {
      text: values.text,
      priority: values.priority,
      deadline: values.deadline
        ? values.deadline.format("YYYY-MM-DD")
        : undefined,
    };

    addNote(noteData);
    message.success("Заметка добавлена!");

    form.resetFields();
  };

  const handleUpdatedNote = () => {
    if (isOpenModal && newDeadline) {
      // Передаем в стор ID задачи и отформатированную дату в виде строки
      updatedNote(isOpenModal, newDeadline.format("YYYY-MM-DD"));
      message.success("Срок выполнения успешно изменен!");

      // Закрываем модальное окно и сбрасываем стейты
      setIsOpenModal(null);
      setNewDeadline(null);
    } else {
      message.warning("Пожалуйста, выберите дату!");
    }
  };

  return (
    <div className="h-full flex flex-col gap-6 overflow-hidden">
      {/* Форма создания */}
      <div className="bg-slate-50/50 p-5 rounded-2xl border border-slate-100 shadow-sm/5">
        <Form
          form={form}
          layout="inline"
          initialValues={{ priority: "medium" }}
          className="flex justify-between"
          size="large"
          onFinish={handleFormSubmit}
        >
          <div className="flex">
            <Form.Item
              name="text"
              rules={[{ required: true, message: "Напишите текст!" }]}
            >
              <Input placeholder="Задача" allowClear />
            </Form.Item>

            <Form.Item name="deadline">
              <DatePicker format="DD.MM.YYYY" placeholder="Срок (дедлайн)" />
            </Form.Item>

            <Form.Item name="priority">
              <Radio.Group buttonStyle="solid">
                <Radio.Button value="high">Срочно</Radio.Button>
                <Radio.Button value="medium">Важно</Radio.Button>
                <Radio.Button value="low">Обычное</Radio.Button>
              </Radio.Group>
            </Form.Item>
          </div>
          <Form.Item>
            <Button type="primary" htmlType="submit" icon={<PlusOutlined />}>
              Добавить
            </Button>
          </Form.Item>
        </Form>
      </div>

      {/* Сетка заметок */}
      <div className="flex-1 overflow-y-auto pr-1 custom-scrollbar">
        <div className="grid grid-cols-3 gap-4">
          {[0, 1, 2].map((columnIndex) => (
            <div key={columnIndex} className="flex flex-col gap-4">
              {notes
                .filter((_, index) => index % 3 === columnIndex)
                .map((note) => {
                  // Определяем ключ приоритета (по умолчанию 'low')
                  let priorityKey = "low";

                  if (note.priority === "high") {
                    priorityKey = "high";
                  } else if (note.priority === "medium") {
                    priorityKey = "medium";
                  }

                  // Достаем готовые классы из CSS-модуля
                  const cardPriorityClass = styles[`priority_${priorityKey}`];
                  const tagPriorityClass = styles[`tag_${priorityKey}`];

                  // Проверяем, задан ли вообще дедлайн (!! превращает дату или null в true/false)
                  const hasDeadline = !!note.deadline;

                  // Считаем, сколько дней осталось до конца срока
                  const daysLeft = hasDeadline
                    ? dayjs(note.deadline).diff(dayjs(), "day") // Если дедлайн есть: вычитаем из даты дедлайна сегодняшнюю дату и получаем дни
                    : null;

                  // Проверяем, горит ли срок (флаг станет true, только если выполняются ВСЕ условия ниже)
                  const isUrgentDeadline =
                    daysLeft !== null && // Дни успешно посчитались И
                    daysLeft <= 2 && // До завершения осталось 2 дня или меньше И
                    !note.completed; // Задача ещё НЕ выполнена

                  return (
                    <div
                      key={note.id}
                      className={`${styles.card} ${cardPriorityClass} ${note.completed ? styles.completed : ""}`}
                    >
                      {/* Шапка карточки */}
                      <div className={styles.header}>
                        <div className={styles.metaInfo}>
                          {note.completed ? (
                            <CheckCircleOutlined />
                          ) : (
                            <ClockCircleOutlined />
                          )}
                          <span className={styles.dateLabel}>
                            Создано: {note.createdAt}
                          </span>
                        </div>

                        {/* Безопасное удаление Popconfirm */}
                        <Popconfirm
                          title="Удалить заметку?"
                          description="Вы уверены, что хотите стереть напоминание?"
                          okText="Да, удалить"
                          onConfirm={() => deleteNote(note.id)}
                          cancelText="Отмена"
                        >
                          <button className={styles.deleteBtn}>
                            <DeleteOutlined />
                          </button>
                        </Popconfirm>
                      </div>

                      {/* Текст заметки */}
                      <p
                        className={`${styles.text} ${note.completed ? styles.textCompleted : ""}`}
                      >
                        {note.text}
                      </p>

                      {/* Дедлайн */}
                      {hasDeadline && !note.completed && (
                        <div
                          className={`${styles.deadline} ${isUrgentDeadline ? styles.urgent : ""}`}
                        >
                          <FireOutlined
                            className={
                              isUrgentDeadline
                                ? "text-red-500"
                                : "text-slate-400"
                            }
                          />
                          <span>
                            {isUrgentDeadline
                              ? `Горит срок! Выполнить до: ${dayjs(note.deadline).format("DD.MM")}`
                              : `Срок выполнения: ${dayjs(note.deadline).format("DD.MM")}`}
                          </span>
                        </div>
                      )}

                      {/* Нижняя панель с кнопками */}
                      <div className={styles.footer}>
                        {!note.completed ? (
                          <span className={`${styles.tag} ${tagPriorityClass}`}>
                            {note.priority === "high"
                              ? "Срочно"
                              : note.priority === "medium"
                                ? "Важно"
                                : "Обычное"}
                          </span>
                        ) : (
                          <div className={styles.completedGroup}>
                            <span
                              className={`${styles.tag} bg-gray-100 text-gray-400`}
                            >
                              Выполнено
                            </span>
                            {note.completedAt && (
                              <span className={styles.completedTime}>
                                Выполнено: {note.completedAt}
                              </span>
                            )}
                          </div>
                        )}

                        {!note.completed && (
                          <div className={styles.actions}>
                            <button
                              className={styles.btnDelay}
                              onClick={() => setIsOpenModal(note.id)}
                            >
                              Отложить
                            </button>
                            <button
                              className={styles.btnDone}
                              onClick={() => toggleNoteComplete(note.id)}
                            >
                              Сделано
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
            </div>
          ))}
        </div>
      </div>

      <Modal
        title="Перенести срок выполнения"
        onOk={handleUpdatedNote}
        onCancel={() => {
          setIsOpenModal(null);
          setNewDeadline(null);
        }}
        okText="Перенести"
        cancelText="Отмена"
        centered
        // Модалка открывается, если в стейте лежит ID карточки
        open={!!isOpenModal}
      >
        <div className="pt-3 pb-2">
          <p className="text-xs text-gray-400 font-medium mb-2">
            Выберите новую дату дедлайна:
          </p>
          <DatePicker
            format="DD.MM.YYYY"
            className="w-full rounded-xl h-10"
            placeholder="Новая дата"
            allowClear={false}
            value={newDeadline}
            onChange={(date) => setNewDeadline(date)}
            // Запрещаем выбирать даты из прошлого
            disabledDate={(current) =>
              current && current < dayjs().endOf("day")
            }
          />
        </div>
      </Modal>
    </div>
  );
};
