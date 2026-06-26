import {
  BookOutlined,
  FileTextOutlined,
  GlobalOutlined,
  PlaySquareOutlined,
  PlusOutlined,
  ReadOutlined,
  SearchOutlined,
  SoundOutlined,
  VideoCameraOutlined,
} from "@ant-design/icons";
import { Button, Input, Select, Tag } from "antd";
import { useAppStore } from "../store/useAppStore";

export const MaterialsPage = () => {
  const materials = useAppStore((state) => state.materials);
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

        <Button type="primary" icon={<PlusOutlined />}>
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
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
