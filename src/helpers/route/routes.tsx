import { lazy, Suspense } from "react";
import { createBrowserRouter } from "react-router-dom";

const LoginPage = lazy(() => import("@/pages/Login"));
const ModuleSelectPage = lazy(() => import("@/pages/Module"));
const ExperimentPage = lazy(() => import("@/pages/Experiment"));
const TestPage = lazy(() => import("@/pages/Test"));

const Loading = () => <div>Loading...</div>;

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
    path: "/module/:id",
    element: (
      <Suspense fallback={<Loading />}>
        <ModuleSelectPage />
      </Suspense>
    ),
  },
  {
    path: "/experiment/:id",
    element: (
      <Suspense fallback={<Loading />}>
        <ExperimentPage />
      </Suspense>
    ),
  },
  {
    path: "/test",
    element: (
      <Suspense fallback={<Loading />}>
        <TestPage />
      </Suspense>
    ),
  },
]);
