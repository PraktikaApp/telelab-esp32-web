import { lazy, Suspense } from "react";
import { createBrowserRouter } from "react-router-dom";
import { Layout } from "@/components/layout/layout";
import { ProtectedLayout } from "@/components/layout/protected-layout";

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
        <Layout>
          <LoginPage />
        </Layout>
      </Suspense>
    ),
  },
  {
    path: "/module/:id",
    element: (
      <Suspense fallback={<Loading />}>
        <ProtectedLayout>
          <Layout>
            <ModuleSelectPage />
          </Layout>
        </ProtectedLayout>
      </Suspense>
    ),
  },
  {
    path: "/experiment/:id",
    element: (
      <Suspense fallback={<Loading />}>
        <ProtectedLayout>
          <Layout>
            <ExperimentPage />
          </Layout>
        </ProtectedLayout>
      </Suspense>
    ),
  },
  {
    path: "/test",
    element: (
      <Suspense fallback={<Loading />}>
        <Layout>
          <TestPage />
        </Layout>
      </Suspense>
    ),
  },
]);
