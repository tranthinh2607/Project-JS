import { createBrowserRouter, Outlet } from "react-router-dom";

import { MasterLayout } from "../layouts";
import { ProtectedRoute, PublicRoute } from "../routing";
import { DashboardPage } from "../../modules/dashboard";
import { LoginPage, RegisterPage } from "../../modules/auth";
import { BuildingPage } from "../../modules/systems";
import { ProjectDetailPage, ProjectListPage } from "../../modules/projects";

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
      { path: "/*", element: <BuildingPage /> },
    ],
  },
]);
