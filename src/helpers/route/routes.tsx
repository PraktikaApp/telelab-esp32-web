import { lazy } from "react";
import { createBrowserRouter } from "react-router-dom";

const LoginPage = lazy(() => import("@/pages/Login"));
const ModuleSelectPage = lazy(() => import("@/pages/Module/index"));

export const router = createBrowserRouter([
  {
    path: "/",
    element: <LoginPage />,
  },
  {
    path: "/module",
    element: <ModuleSelectPage />,
  },
]);
