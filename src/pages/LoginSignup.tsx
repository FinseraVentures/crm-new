import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import axios from "axios";
import CONFIG ,{ API_ENDPOINTS, getApiUrl } from "@/config/env";

interface LoginSignupProps {
  onLoginSuccess: () => void;
}

type Mode = "login" | "signup";

const LoginSignup: React.FC<LoginSignupProps> = ({ onLoginSuccess }) => {
  const [mode, setMode] = useState<Mode>("login");
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  const handleChange =
    (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
    };

      const extractAuthFromResponse = (data: any) => {
        // tries common shapes for token + user
        const token =
          data?.token ||
          data?.accessToken ||
          data?.data?.token ||
          data?.data?.accessToken ||
          null;
        const refreshToken =
          data?.refreshToken || data?.data?.refreshToken || null;
        const user = data?.user || data?.data?.user || data?.data || null;
        return { token, refreshToken, user };
      };
        const saveAuth = (payload: {
          token?: string | null;
          refreshToken?: string | null;
          user?: any | null;
        }) => {
          const { token, refreshToken, user } = payload;
          if (token) {
            localStorage.setItem(CONFIG.auth.tokenKey, token);
          }
          if (refreshToken) {
            localStorage.setItem(CONFIG.auth.refreshTokenKey, refreshToken);
          }
          if (user) {
            try {
              localStorage.setItem(CONFIG.auth.userKey, JSON.stringify(user));
              // also store some convenient keys if present
              if (
                (user.email || form.email) &&
                !localStorage.getItem(CONFIG.storage.userEmail)
              ) {
                localStorage.setItem(
                  CONFIG.storage.userEmail,
                  user.email || form.email
                );
              }
              localStorage.setItem(
                CONFIG.storage.userRole,
                user.user_role || "user"
              );
               localStorage.setItem(
                 CONFIG.storage.userId,
                 user._id || ""
               );
               localStorage.setItem(
                 CONFIG.storage.userName,
                 user.name || ""
               );
            } catch {}
          }
          localStorage.setItem(CONFIG.storage.isAuthenticated, "true");
        };

 const handleSubmit = async (e: React.FormEvent) => {
   e.preventDefault();
   setError(null);

   if (mode === "signup" && form.password !== form.confirmPassword) {
     setError("Passwords do not match.");
     return;
   }

   setLoading(true);

   try {
     if (mode === "login") {
       const url = getApiUrl(API_ENDPOINTS.AUTH.LOGIN);
       const res = await axios.post(url, {
         email: form.email,
         password: form.password,
       });

       // Accept many server shapes: { success, token, user } or { success, data: { token, user } }
       const data = res.data;
       if (data?.success === false) {
         throw new Error(data?.message || "Login failed");
       }

       const { token, refreshToken, user } = extractAuthFromResponse(data);
       // If no token but success true, still proceed (maybe sessionless)
       if (token || data?.success) {
         saveAuth({ token, refreshToken, user });
         onLoginSuccess();
         navigate("/dashboard");
         return;
       }

       throw new Error(data?.message || "Login failed");
     } else {
       // signup
       const url = getApiUrl(API_ENDPOINTS.AUTH.SIGNUP);
       const res = await axios.post(url, {
         name: form.name,
         email: form.email,
         password: form.password,
       });

       const data = res.data;
       if (data?.success === false) {
         throw new Error(data?.message || "Signup failed");
       }

       // If API returns token on signup, use it. Otherwise try to login automatically.
       const { token, refreshToken, user } = extractAuthFromResponse(data);

       if (token) {
         saveAuth({ token, refreshToken, user });
         onLoginSuccess();
         navigate("/dashboard");
         return;
       }

      

       // fallback - signup succeeded but no token, go to login screen and show success
       setMode("login");
       setError("Account created. Please sign in.");
     }
   } catch (err: any) {
     console.error(err);
     const message =
       err?.response?.data?.message ||
       err?.response?.data?.error ||
       err?.message ||
       "Something went wrong. Please try again.";
     setError(message);
   } finally {
     setLoading(false);
   }
 };
  const toggleMode = () => {
    setError(null);
    setMode((prev) => (prev === "login" ? "signup" : "login"));
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-indigo-600 via-purple-500 to-orange-300 flex items-center justify-center px-4">
      <Card className="w-full max-w-md shadow-2xl border-none bg-white/95 backdrop-blur-xl">
        <CardHeader className="space-y-2">
          <div className="flex items-center justify-center mb-2">
            {/* Logo area – replace img if you have one */}
            <div className="flex items-center gap-2">
              {/* <div className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold">
                F
              </div> */}
              {/* <span className="text-xl font-semibold text-slate-900">
                Finsera
              </span> */}
              <img src="/images/Logo.png" className=" w-20 " alt="" />
            </div>
          </div>
          <CardTitle className="text-2xl text-center">
            {mode === "login" ? "Sign In" : "Create Account"}
          </CardTitle>
          <CardDescription className="text-center">
            {mode === "login"
              ? "Welcome back! Enter your details to access the dashboard."
              : "Get started by creating your Finsera CRM account."}
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {mode === "signup" && (
              <div className="space-y-1">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Rizvan K."
                  value={form.name}
                  onChange={handleChange("name")}
                  required
                />
              </div>
            )}

            <div className="space-y-1">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@finsera.com"
                value={form.email}
                onChange={handleChange("email")}
                required
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={form.password}
                onChange={handleChange("password")}
                required
              />
            </div>

            {mode === "signup" && (
              <div className="space-y-1">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={form.confirmPassword}
                  onChange={handleChange("confirmPassword")}
                  required
                />
              </div>
            )}

            {error && (
              <p className="text-sm text-red-600 mt-1 text-center">{error}</p>
            )}
          </CardContent>

          <CardFooter className="flex flex-col gap-3">
            <Button
              type="submit"
              className="w-full bg-indigo-700 hover:bg-indigo-800"
              disabled={loading}
            >
              {loading
                ? "Please wait..."
                : mode === "login"
                ? "Sign In"
                : "Sign Up"}
            </Button>

            <p className="text-xs text-center text-slate-500">
              {mode === "login" ? (
                <>
                  Don&apos;t have an account?{" "}
                  <button
                    type="button"
                    onClick={toggleMode}
                    className="text-indigo-600 hover:underline font-medium"
                  >
                    Sign up
                  </button>
                </>
              ) : (
                <>
                  Already have an account?{" "}
                  <button
                    type="button"
                    onClick={toggleMode}
                    className="text-indigo-600 hover:underline font-medium"
                  >
                    Sign in
                  </button>
                </>
              )}
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default LoginSignup;
