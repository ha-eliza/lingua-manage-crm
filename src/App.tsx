import { Link, Outlet, useLocation } from "react-router";
import "./App.css";
import {
  BookOutlined,
  CalendarOutlined,
  FolderOpenOutlined,
  GroupOutlined,
  LeftOutlined,
  LogoutOutlined,
  RightOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useState } from "react";
import { useAuthStore } from "./store/useAuthStore";
import { message } from "antd";

function App() {
  const location = useLocation(); // для шапки, название адреса
  const [isCollapsed, setIsCollapsed] = useState(false); // для выдвижения aside

  // Забираем текущего пользователя и функцию выхода из Zustand
  const currentUser = useAuthStore((state) => state.currentUser);
  const logoutUser = useAuthStore((state) => state.logoutUser);

  const userRole = currentUser?.role || "teacher";

  const menuItems = [
    { key: "/dashboard", icon: <UserOutlined />, label: "Мой кабинет" },
    {
      key: "/calendar",
      icon: <CalendarOutlined />,
      label: "Календарь",
    },
    {
      key: "/materials",
      icon: <FolderOpenOutlined />,
      label: "Материалы",
    },
    {
      key: "/students",
      icon: <GroupOutlined />,
      label: "Студенты",
      onlyTeacher: true,
    },
    { key: "/notes", icon: <BookOutlined />, label: "Заметки" },
    { key: "/login", icon: <LogoutOutlined />, label: "Выйти" },
  ];

  const allowedMenu = menuItems.filter(
    (item) => !item.onlyTeacher || userRole === "teacher",
  );

  // Функция для перевода пути в понятный заголовок для шапки
  const getPageTitle = (pathname: string) => {
    // Ищем совпадение текущего пути в массиве меню преподавателя или студента
    const allItems = [...menuItems];
    const currentItem = allItems.find((item) => item.key === pathname);
    return currentItem ? currentItem.label : "Панель управления";
  };

  return (
    <div className="layout">
      <aside className={`sidebar ${isCollapsed ? "collapsed" : ""}`}>
        <div className="logo">{isCollapsed ? "LM" : "LinguaManage"}</div>
        <nav className="menu">
          {allowedMenu.map((item) => {
            const isActive = location.pathname === item.key;
            const handleLinkClick = () => {
              if (item.key === "/login") {
                logoutUser(); // Очищаем стейт текущего юзера и роли в Zustand
                message.success(`Вы вышли с аккаунта`);
              }
            };
            return (
              <Link
                key={item.key}
                to={item.key}
                onClick={handleLinkClick}
                className={`menu-link ${isActive ? "active" : ""}`}
                title={isCollapsed ? item.label : ""} // Всплывающая подсказка при наведении в свернутом виде
              >
                {item.icon}
                {/* Текст скрывается если есть класс collapsed */}
                <span className="link-text">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* isCollapsed: кнопка выдвижения бокового меню */}
        <div
          className="mt-auto mx-auto cursor-pointer toggle-btn"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          {isCollapsed ? <RightOutlined /> : <LeftOutlined />}
        </div>
      </aside>

      <div className="main-wrapper">
        <header className="header">
          <h2 className="text-white text-xl font-bold">
            {/* название адреса */}
            {getPageTitle(location.pathname)}
          </h2>
          <div
            className="border-0 rounded-full text-white font-semibold py-1 px-2.5 cursor-pointer"
            style={{
              backgroundColor: currentUser?.avatarColor || "#1D3557", // Цвет из стора
            }}
          >
            {/* Первая буква имени пользователя или L */}
            {currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : "L"}
          </div>
        </header>

        <main className="m-5 bg-white rounded-xl p-7" style={{height: 'calc(100vh - 70px - 40px)'}}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default App;
