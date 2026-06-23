import { useNavigate } from "react-router";
import { useAppStore } from "../store/useAppStore";
import { Alert, Button, Input, message } from "antd";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { mockTeacher } from "../types/mockData";

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();

  // Забираем актуальный список студентов из useAppStore
  const students = useAppStore((state) => state.students);
  // Забираем вошедшего пользователя из useAuthStore
  const setCurrentUser = useAuthStore((state) => state.setCurrentUser);

  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (!login.trim() || !password.trim()) {
      setError("Пожалуйста, заполните все поля");
      return;
    }

    setLoading(true);

    setTimeout(() => {
      let loggedUser = null;

      // 1. Проверяем не преподаватель ли это (т.к преподаватель 1)
      if (mockTeacher.email === login.trim() && mockTeacher.password === password) {
        loggedUser = mockTeacher;
      }

      // 2. Если не учитель, используем метод .find() для поиска студента в массиве из Zustand (т.к планируется добавлять студентов)
      if (!loggedUser) {
        const student = students.find(
          (s) => s.login.login === login.trim() && s.login.password === password
        );
        if (student) loggedUser = student;
      }

      // 3. Если пользователь найден — сохраняем его в сессию и делаем редирект
      if (loggedUser) {
        setCurrentUser(loggedUser); // Записываем в useAuthStore
        message.success(`Добро пожаловать, ${loggedUser.name}!`);
        navigate("/dashboard"); // Перенаправляем в личный кабинет
      } else {
        setError("Неверный логин или пароль");
      }
      setLoading(false);
    }, 800);
  };
  return (
    <div className="min-h-screen w-screen flex items-center justify-center bg-[var(--color-brand-bg)] px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl border border-gray-200 shadow-sm">
        {/* Логотип и заголовок */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[var(--color-brand-text)] tracking-tight flex gap-5 items-end justify-center">
            <img className="w-10" src="../../public/icon.png" alt="" /> <span>LinguaManage</span>
          </h1>
          <p className="text-sm text-gray-500 mt-2">
            Вход в систему управления обучением
          </p>
        </div>

        {/* Вывод ошибки валидации */}
        {error && (
          <Alert
            message={error}
            type="error"
            showIcon
            className="mb-3!"
          />
        )}

        {/* Форма авторизации */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Email или Логин
            </label>
            <Input
              size="large"
              placeholder="example@tutor.ru"
              prefix={<UserOutlined />}
              value={login}
              onChange={(e) => setLogin(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Пароль
            </label>
            <Input.Password
              size="large"
              placeholder="••••••••"
              prefix={<LockOutlined />}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            className="w-full font-semibold! bg-[var(--color-brand-primary)]! mt-2"
          >
            Войти в систему
          </Button>
        </form>

        {/* Тестовые данные */}
        <div className="mt-6 pt-4 border-t border-gray-100 text-xs text-gray-400 text-center space-y-1">
          <div>🔑 Учитель: maria.eng@tutor.ru / hashed_password_123</div>
          <div>🔑 Студент: alex_eng / password1</div>
        </div>
      </div>
    </div>
  );
};
