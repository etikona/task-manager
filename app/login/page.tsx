"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import {
  loginStart,
  loginSuccess,
  loginFailure,
} from "@/store/slices/authSlice";
import { Mail, Lock, Eye, EyeOff, LogIn } from "lucide-react";

const LoginPage = () => {
  const { isAuthenticated, initialized, loading } = useAppSelector(
    (state) => state.auth
  );
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {}
  );

  const dispatch = useAppDispatch();
  const router = useRouter();

  useEffect(() => {
    if (initialized && isAuthenticated) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, initialized, router]);

  if (!initialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (isAuthenticated) {
    return null;
  }

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {};

    if (!email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Email is invalid";
    }

    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 3) {
      newErrors.password = "Password must be at least 3 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    dispatch(loginStart());

    setTimeout(() => {
      try {
        const savedState = localStorage.getItem("smart-task-manager-state");
        const existingState = savedState ? JSON.parse(savedState) : {};
        const existingUsers = existingState?.auth?.users || [];

        const user = existingUsers.find((u: any) => u.email === email);

        if (user) {
          dispatch(loginSuccess(user));
          router.push("/dashboard");
        } else {
          dispatch(loginFailure());
          setErrors({ email: "Invalid email or password" });
        }
      } catch (error) {
        dispatch(loginFailure());
        setErrors({ email: "An error occurred. Please try again." });
      }
    }, 1000);
  };

  const handleDemoLogin = () => {
    setEmail("demo@example.com");
    setPassword("demo123");

    dispatch(loginStart());

    setTimeout(() => {
      try {
        const savedState = localStorage.getItem("smart-task-manager-state");
        const existingState = savedState ? JSON.parse(savedState) : {};
        const existingUsers = existingState?.auth?.users || [];

        let demoUser = existingUsers.find(
          (u: any) => u.email === "demo@example.com"
        );

        if (!demoUser) {
          demoUser = {
            id: Date.now(),
            name: "Demo User",
            email: "demo@example.com",
          };

          const updatedState = {
            ...existingState,
            auth: {
              ...existingState.auth,
              users: [...existingUsers, demoUser],
            },
          };
          localStorage.setItem(
            "smart-task-manager-state",
            JSON.stringify(updatedState)
          );
        }

        dispatch(loginSuccess(demoUser));
        router.push("/dashboard");
      } catch (error) {
        dispatch(loginFailure());
        setErrors({ email: "Failed to login with demo account" });
      }
    }, 500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back
          </h2>
          <p className="text-gray-600">Sign in to your account</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail
                    className={`w-5 h-5 transition-colors ${
                      focusedField === "email"
                        ? "text-gray-900"
                        : "text-gray-400"
                    }`}
                  />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email) setErrors({ ...errors, email: "" });
                  }}
                  onFocus={() => setFocusedField("email")}
                  onBlur={() => setFocusedField("")}
                  className={`block w-full pl-10 pr-3 py-2.5 border rounded-lg text-gray-900 placeholder-gray-400 transition-all focus:outline-none focus:ring-2 focus:ring-gray-900 ${
                    errors.email
                      ? "border-red-300 focus:ring-red-500"
                      : "border-gray-300 hover:border-gray-400"
                  }`}
                  placeholder="you@example.com"
                />
              </div>
              {errors.email && (
                <p className="mt-1.5 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock
                    className={`w-5 h-5 transition-colors ${
                      focusedField === "password"
                        ? "text-gray-900"
                        : "text-gray-400"
                    }`}
                  />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password) setErrors({ ...errors, password: "" });
                  }}
                  onFocus={() => setFocusedField("password")}
                  onBlur={() => setFocusedField("")}
                  className={`block w-full pl-10 pr-10 py-2.5 border rounded-lg text-gray-900 placeholder-gray-400 transition-all focus:outline-none focus:ring-2 focus:ring-gray-900 ${
                    errors.password
                      ? "border-red-300 focus:ring-red-500"
                      : "border-gray-300 hover:border-gray-400"
                  }`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1.5 text-sm text-red-600">{errors.password}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all mt-6"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  <span>Sign in</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleDemoLogin}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <span>Use Demo Account</span>
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-200 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{" "}
              <Link
                href="/register"
                className="font-medium text-gray-900 hover:text-gray-700 transition-colors"
              >
                Create account
              </Link>
            </p>
          </div>
        </div>

        <p className="mt-8 text-center text-xs text-gray-500">
          Protected by industry-standard encryption
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
