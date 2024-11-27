import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { ModeToggle } from "./components/ui/mode-toogle";
import { RouterProvider } from "react-router-dom";
import { router } from "./helpers/route/routes";
import { ThemeProvider } from "./components/ui/theme-provider";
import { Toaster } from "./components/ui/toaster";
import { LogOut } from "lucide-react";
import { Button } from "./components/ui/button";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("credentials");
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("credentials");
    setIsLoggedIn(false);
  };

  return (
    <React.StrictMode>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <RouterProvider router={router} />
        <div className="fixed right-8 top-8">
          <ModeToggle />{" "}
          {isLoggedIn && (
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="mr-2" />
            </Button>
          )}
        </div>
        <div
          className="fixed md:bottom-10 bottom-0 flex w-full flex-col items-center gap-3 text-sm bg-gray-100 pt-2 dark:bg-gray-800 md:bg-transparent md:dark:bg-transparent  
          text-muted-foreground sm:flex-row sm:justify-end sm:pr-10"
        >
          <p>© {new Date().getFullYear()} PraktikaApp. </p>
          <p>Built with shadcn/ui + Aceternity UI</p>
          <Toaster />
        </div>
      </ThemeProvider>
    </React.StrictMode>
  );
}

ReactDOM.createRoot(document.getElementById("root")!).render(<App />);
