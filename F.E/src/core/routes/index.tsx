import { createBrowserRouter, Outlet } from "react-router-dom";

import { MasterLayout } from "../layouts";
import { ProtectedRoute, PublicRoute } from "../routing";
import { DashboardPage } from "../../modules/dashboard";
import { BuildingPage, SystemConfigsPage } from "../../modules/systems";
import { LoginPage, RegisterPage, TokenExpiredPage } from "../../modules/auth";
import { ProjectDetailPage, ProjectListPage } from "../../modules/projects";
import { ListPage as TaskListPage } from "../../modules/tasks";
import ProfilePage from "../../modules/auth/pages/ProfilePage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <MasterLayout />
      </ProtectedRoute>
    ),
    children: [
      { path: "/", element: <DashboardPage /> },
      { path: "/projects", element: <ProjectListPage /> },
      { path: "/projects/:id", element: <ProjectDetailPage /> },
      { path: "/tasks", element: <TaskListPage /> },
      { path: "/settings/system-configs", element: <SystemConfigsPage /> },
      { path: "/profile", element: <ProfilePage /> },
    ]
  },
  {
    path: "/",
    element: (
      <PublicRoute>
        <Outlet />
      </PublicRoute>
    ),
    children: [
      { path: "login", element: <LoginPage /> },
      { path: "register", element: <RegisterPage /> },
      // { path: "activate-otp", element: <ActivateOtpPage /> },
      // { path: "forgot-password", element: <ForgotPasswordPage /> },
      { path: "token-expired", element: <TokenExpiredPage /> },
      { path: "/*", element: <BuildingPage /> },
    ],
  },
]);
