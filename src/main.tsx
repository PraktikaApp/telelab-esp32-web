import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { ModeToggle } from "./components/ui/mode-toogle";
import { RouterProvider } from "react-router-dom";
import { router } from "./helpers/route/routes";
import { ThemeProvider } from "./components/ui/theme-provider";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <RouterProvider router={router} />
      <div className="fixed right-8 top-8">
        <ModeToggle />
      </div>
      <div
        className="fixed bottom-10 flex w-full flex-col items-center gap-3 text-sm
          text-muted-foreground sm:flex-row sm:justify-end sm:pr-10"
      >
        <p>© {new Date().getFullYear()} PraktikaApp. </p>
        <p>Built with shadcn/ui + Aceternity UI</p>
      </div>
    </ThemeProvider>
  </React.StrictMode>
);
