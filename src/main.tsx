import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { createBrowserRouter, RouterProvider } from "react-router";
import { LoginPage } from "./pages/LoginPage.tsx";
import { DashboardPage } from "./pages/Dashboard.tsx";
import { CalendarPage } from "./pages/CalendarPage.tsx";
import { StudentsPage } from "./pages/StudentsPage.tsx";
import { MaterialsPage } from "./pages/MaterialsPage.tsx";
import { NotesPage } from "./pages/NotesPage.tsx";
import { StudentProfilePage } from "./pages/StudentProfilePage.tsx";
import { ConfigProvider } from "antd";

const router = createBrowserRouter([
  {
    // Страница входа без layout
    path: "/login",
    element: <LoginPage />,
  },
  {
    // Внутренняя часть системы
    path: "/",
    element: <App />, // Layout
    children: [
      {
        path: "/dashboard",
        element: <DashboardPage />,
      },
      {
        path: "/calendar",
        element: <CalendarPage />,
      },
      {
        path: "/students",
        element: <StudentsPage />,
      },
      {
        path: "/materials",
        element: <MaterialsPage />,
      },
      {
        path: "/notes",
        element: <NotesPage />,
      },
      {
        path: "/profile/:id",
        element: <StudentProfilePage />,
      },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <ConfigProvider // изменение стилей у AntD
    theme={{
      token: {
        colorPrimary: "#1E3A8A",
      },
      components: {
        Input: {
          colorBorder: "#E2E8F0",
        },
      },
    }}
  >
    <StrictMode>
      <RouterProvider router={router} />
    </StrictMode>
  </ConfigProvider>,
);
