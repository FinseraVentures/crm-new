import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

import Index from "./pages/Index"; // Dashboard (nested under /dashboard/*)
import NotFound from "./pages/NotFound";
import LoginSignup from "./pages/LoginSignup"; // <-- create / import this
import DashboardRoutes from "./pages/DashboardRoutes";

const queryClient = new QueryClient();

// 20 hours in ms
const LOGIN_DURATION = 20 * 60 * 60 * 1000;

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const loggedIn = localStorage.getItem("isAuthenticated");
    const loginTime = localStorage.getItem("loginTime");
    const currentTime = Date.now();

    if (
      loggedIn === "true" &&
      loginTime &&
      currentTime - +loginTime <= LOGIN_DURATION
    ) {
      return true;
    }
    return false;
  });

  useEffect(() => {
    const loggedIn = localStorage.getItem("isAuthenticated");
    const loginTime = localStorage.getItem("loginTime");

    if (loggedIn === "true" && loginTime) {
      const currentTime = Date.now();
      if (currentTime - +loginTime > LOGIN_DURATION) {
        handleLogout();
      } else {
        setIsAuthenticated(true);
      }
    }
  }, []);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    localStorage.setItem("isAuthenticated", "true");
    localStorage.setItem("loginTime", Date.now().toString());
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.setItem("isAuthenticated", "false");
    localStorage.removeItem("loginTime");
    localStorage.removeItem("userSession");
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public auth routes – can have nested routes inside LoginSignup via /login/* */}
            <Route
              path="/login/*"
              element={<LoginSignup onLoginSuccess={handleLoginSuccess} />}
            />

            {/* Protected dashboard – all nested routes under /dashboard/* */}
            <Route
              path="/dashboard/*"
              element={
                isAuthenticated ? <DashboardRoutes /> : <Navigate to="/login" />
              }
            />

            {/* Optional root: redirect based on auth */}
            <Route
              path="/"
              element={
                isAuthenticated ? (
                  <Navigate to="/dashboard" replace />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />

            {/* Catch-all */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
