import { useNavigate } from "react-router";
import { Alert, Button, Input, message } from "antd";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { collection, doc, getDoc, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase";

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();

  // Забираем метод сохранения вошедшего пользователя из useAuthStore
  const setCurrentUser = useAuthStore((state) => state.setCurrentUser);

  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (!login.trim() || !password.trim()) {
      setError("Пожалуйста, заполните все поля");
      return;
    }

    setLoading(true);

    try {
      let loggedUser = null;

      // 1. Проверяем преподавателя в Firestore по email и паролю
      const teacherRef = doc(db, "teachers", "t1");
      const teacherSnap = await getDoc(teacherRef);

      if (teacherSnap.exists()) {
        const teacherData = teacherSnap.data();
        if (
          teacherData.email === login.trim() &&
          teacherData.password === password
        ) {
          loggedUser = { id: teacherSnap.id, ...teacherData };
        }
      }

      // 2. Если не учитель, ищем студента в Firestore по логину и паролю
      if (!loggedUser) {
        const studentsRef = collection(db, "students");
        // Делаем точечный запрос в базу данных
        const q = query(
          studentsRef,
          where("login.login", "==", login.trim()),
          where("login.password", "==", password),
        );

        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const studentDoc = querySnapshot.docs[0];
          loggedUser = { id: studentDoc.id, ...studentDoc.data() };
        }
      }

      // 3. Если пользователь найден — сохраняем его в Zustand и делаем редирект
      if (loggedUser) {
        setCurrentUser(loggedUser); // Записываем в useAuthStore
        message.success(`Добро пожаловать, ${loggedUser.name}!`);
        navigate("/dashboard"); // Перенаправляем в личный кабинет
      } else {
        setError("Неверный логин или пароль");
      }
    } catch (err) {
      console.error("Ошибка при авторизации:", err);
      setError("Произошла ошибка при подключении к серверу");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen w-screen flex items-center justify-center bg-brand-bg px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl border border-gray-200 shadow-sm">
        {/* Логотип и заголовок */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-brand-text tracking-tight flex gap-5 items-end justify-center">
            <img className="w-10" src="../../public/icon.png" alt="" />{" "}
            <span>LinguaManage</span>
          </h1>
          <p className="text-sm text-gray-500 mt-2">
            Вход в систему управления обучением
          </p>
        </div>

        {/* Вывод ошибки валидации */}
        {error && (
          <Alert message={error} type="error" showIcon className="mb-3!" />
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
            className="w-full font-semibold! bg-brand-primary! mt-2"
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
