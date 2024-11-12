import { lazy, Suspense } from "react";
import { createBrowserRouter } from "react-router-dom";

const LoginPage = lazy(() => import("@/pages/Login"));
const ModuleSelectPage = lazy(() => import("@/pages/Module/index"));
const ExperimentPage = lazy(() => import("@/pages/Experiment"));

const Loading = () => <div>Loading...</div>; // You can customize the loading spinner here

export const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <Suspense fallback={<Loading />}>
        <LoginPage />
      </Suspense>
    ),
  },
  {
    path: "/module",
    element: (
      <Suspense fallback={<Loading />}>
        <ModuleSelectPage />
      </Suspense>
    ),
  },
  {
    path: "/experiment",
    element: (
      <Suspense fallback={<Loading />}>
        <ExperimentPage />
      </Suspense>
    ),
  },
]);
