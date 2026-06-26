import {
  BookOutlined,
  DeleteOutlined,
  FileTextOutlined,
  GlobalOutlined,
  PlaySquareOutlined,
  PlusOutlined,
  ReadOutlined,
  SearchOutlined,
  SoundOutlined,
  VideoCameraOutlined,
} from "@ant-design/icons";
import { Button, Form, Input, message, Modal, Popconfirm, Select, Tag } from "antd";
import { useAppStore } from "../store/useAppStore";
import { useState } from "react";
import type { Material } from "../types";

export const MaterialsPage = () => {
  const materials = useAppStore((state) => state.materials);
  const addMaterial = useAppStore((state) => state.addMaterial);
  const deleteMaterial = useAppStore((state) => state.deleteMaterial);

  const [isOpenModal, setIsOpenModal] = useState(false);
  const [form] = Form.useForm();

  const handleFormSubmit = (value: any) => {
    const materialData: Omit<Material, "id"> = {
      title: value.title,
      description: value.description,
      level: value.level,
      type: value.type,
      link: value.link,
    };

    addMaterial(materialData);
    message.success("Материал добавлен!");

    setIsOpenModal(false);
    form.resetFields();
  };

  return (
    <div className="h-full flex flex-col gap-6">
      {/* Панель фильтров */}
      <div className="flex p-4 bg-slate-50/50 rounded-2xl border border-slate-100 shadow-sm/5">
        <div className="flex flex-1 gap-3">
          <Input
            placeholder="Поиск по названию или описанию..."
            prefix={<SearchOutlined className="text-gray-400" />}
            className="max-w-md"
            allowClear
          />
          <Select
            placeholder="Уровень..."
            className="w-48"
            allowClear
            options={[
              { value: "A", label: "Beginner (A)" },
              { value: "B", label: "Intermediate (B)" },
              { value: "C", label: "Advanced (C)" },
            ]}
          />
        </div>

        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setIsOpenModal(true)}
        >
          Добавить материал
        </Button>
      </div>

      {/* Список материалов */}
      <div className="overflow-y-auto pr-1 custom-scrollbar">
        <div className="flex flex-col gap-4">
          {materials.map((material) => {
            // Цвета для иконок
            const iconMapping = {
              book: <BookOutlined className="text-blue-500!" />,
              sb: <ReadOutlined className="text-indigo-500!" />,
              wb: <FileTextOutlined className="text-teal-500!" />,
              video: <VideoCameraOutlined className="text-red-500!" />,
              film: <PlaySquareOutlined className="text-purple-500!" />,
              audio: <SoundOutlined className="text-amber-500!" />,
              test: <GlobalOutlined className="text-emerald-500!" />,
            };
            const itemIcon = iconMapping[material.type];
            // Цвета для тега
            let tagColor = "blue";
            if (material.level.startsWith("A")) tagColor = "green";
            if (material.level.startsWith("C")) tagColor = "purple";

            return (
              <div
                key={material.id}
                className="p-5 border-b border-gray-100 transition-all duration-200 hover:bg-slate-50/60 hover:shadow-xs cursor-pointer group"
              >
                {/* Левая часть: Иконка + Текстовая информация */}
                <div className="flex items-start gap-4">
                  <div className="px-2.5 py-3 bg-slate-50 text-2xl! rounded-xl border border-slate-100 flex items-center justify-center transition-transform duration-200 group-hover:-translate-y-0.5">
                    {itemIcon}
                  </div>

                  {/* Блок текста */}
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors duration-200">
                      {material.title}
                    </h3>
                    <p className="text-xs text-gray-400 font-medium">
                      {material.description}
                    </p>
                  </div>

                  {/* Правая часть: Тег уровня */}
                  <Tag color={tagColor} className="text-base! font-bold">
                    {material.level}
                  </Tag>
                  <Popconfirm
                    title="Удалить заметку?"
                    description="Вы уверены, что хотите стереть напоминание?"
                    okText="Да, удалить"
                    onConfirm={() => deleteMaterial(material.id)} // удаление
                    cancelText="Отмена"
                  >
                    <Button type="text" danger icon={<DeleteOutlined />} />
                  </Popconfirm>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      {/* Создание материала */}
      <Modal
        title="Добавить новый учебный материал"
        open={isOpenModal}
        onCancel={() => setIsOpenModal(false)}
        footer={null}
        centered
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleFormSubmit}
          className="pt-4"
          size="large"
        >
          <Form.Item
            name="title"
            label="Название пособия"
            rules={[{ required: true, message: "Введите название!" }]}
          >
            <Input placeholder="Например: English Grammar in Use" />
          </Form.Item>
          <div className="grid grid-cols-2 gap-3">
            <Form.Item
              name="level"
              label="Целевой уровень"
              rules={[{ required: true }]}
            >
              <Select
                placeholder="Выбрать"
                options={[
                  { value: "All", label: "Для всех" },
                  { value: "A1", label: "Beginner (A1)" },
                  { value: "A2", label: "Elementary (A2)" },
                  { value: "B1", label: "Intermediate (B1)" },
                  { value: "B2", label: "Upper-Intermediate (B2)" },
                  { value: "C1", label: "Advanced (C1)" },
                ]}
              />
            </Form.Item>
            <Form.Item
              name="type"
              label="Формат контента"
              rules={[{ required: true, message: "Выберите формат!" }]}
            >
              <Select
                placeholder="Выбрать"
                options={[
                  { value: "book", label: "Книга / Пособие" },
                  { value: "sb", label: "Student's Book" },
                  { value: "wb", label: "Workbook" },
                  { value: "video", label: "Видео-урок" },
                  { value: "film", label: "Фильм / Сериал" },
                  { value: "audio", label: "Аудио / Подкаст" },
                  { value: "test", label: "Интерактивный тест" },
                ]}
              />
            </Form.Item>
          </div>
          <Form.Item
            name="link"
            label="Ссылка на файл (URL)"
            rules={[
              { required: true },
              { type: "url", message: "Введите корректный URL!" },
            ]}
          >
            <Input placeholder="https://example.com" />
          </Form.Item>
          <Form.Item
            name="description"
            label="Краткое описание"
            rules={[{ required: true }]}
          >
            <Input.TextArea rows={4} placeholder="Опишите пособие..." />
          </Form.Item>
          <Form.Item className="block text-right">
            <Button className="mr-2" onClick={() => setIsOpenModal(false)}>
              Отмена
            </Button>
            <Button type="primary" htmlType="submit">
              Сохранить
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};
