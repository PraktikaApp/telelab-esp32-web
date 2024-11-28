import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

type ProtectedLayoutProps = {
  children: React.ReactNode;
};

export function ProtectedLayout({ children }: ProtectedLayoutProps) {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("credentials");
    if (!token) {
      navigate("/");
    }
  }, [navigate]);

  return <>{children}</>;
}
