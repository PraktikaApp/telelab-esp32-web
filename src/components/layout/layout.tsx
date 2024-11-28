import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ModeToggle } from "@/components/ui/mode-toogle";
import { Toaster } from "@/components/ui/toaster";
import { Button } from "@/components/ui/button";
import { LogOut, ArrowLeft } from "lucide-react";

type LayoutProps = {
  children: React.ReactNode;
};

export function Layout({ children }: LayoutProps) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("credentials");
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("credentials");
    setIsLoggedIn(false);
    navigate("/login");
  };

  const handleBack = () => {
    navigate(-1);
  };

  const excludedPaths = ["/", "/module"];

  return (
    <div className="min-h-screen flex flex-col">
      <header className="flex items-center justify-between md:px-8 px-5 pt-5 pb-2 z-50 dark:bg-black/45 bg-white/45 backdrop-blur-sm fixed top-0 right-0 left-0">
        <div className="flex items-center flex-grow">
          {!excludedPaths.includes(location.pathname) && (
            <Button variant="outline" onClick={handleBack}>
              <ArrowLeft />
            </Button>
          )}
        </div>
        <div className="flex items-center gap-2">
          <ModeToggle />
          {isLoggedIn && (
            <Button variant="destructive" onClick={handleLogout}>
              <LogOut />
            </Button>
          )}
        </div>
      </header>

      <main className="flex-1 mt-20 md:mt-0 ">{children}</main>
      <div
        className="fixed md:bottom-10 bottom-0 flex w-full flex-col items-center gap-3 text-sm bg-gray-100 pt-2 dark:bg-gray-800 md:bg-transparent md:dark:bg-transparent  
          text-muted-foreground sm:flex-row sm:justify-end sm:pr-10"
      >
        <p>© {new Date().getFullYear()} PraktikaApp. </p>
        <p> Kontrakan Bali Developer</p>
        <Toaster />
      </div>
    </div>
  );
}
