import React, { useState, useContext } from "react";
import axios from "axios";
import {
  Eye,
  EyeOff,
  LockKeyhole,
  UserRound,
  LogIn,
} from "lucide-react";

import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;

    setError("");
    setLoading(true);

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/user/login`,
        {
          username,
          password,
        },
        {
          withCredentials: true,
        }
      );

      login({
        user: res.data.data,
        token: res.data.token,
      });

      toast.success("Login successful!");

      if (res.data.data.role === "admin") {
        navigate("/");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      const message =
        err.response?.data?.message ||
        "Invalid username or password";

      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-red-50 via-white to-rose-100 px-4 py-8">

      {/* Background Decoration */}

      <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-red-200/30 blur-3xl" />

      <div className="absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-rose-200/40 blur-3xl" />

      {/* Login Card */}

      <div className="relative w-full max-w-md">

        <div className="rounded-3xl border border-white/80 bg-white/90 p-6 shadow-[0_20px_70px_rgba(220,38,38,0.12)] backdrop-blur-xl sm:p-8">

          {/* Logo */}

          <div className="mb-7 flex justify-center">

            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-red-500 to-rose-600 text-white shadow-lg shadow-red-200">
              <LogIn size={28} strokeWidth={2.2} />
            </div>

          </div>

          {/* Heading */}

          <h2 className="mb-7 text-center text-3xl font-bold tracking-tight text-gray-900">
            Login
          </h2>

          {/* Error */}

          {error && (
            <div className="mb-5 rounded-xl border border-red-100 bg-red-50 px-4 py-3">
              <p className="text-center text-sm font-medium text-red-600">
                {error}
              </p>
            </div>
          )}

          {/* Form */}

          <form onSubmit={handleSubmit}>

            {/* Username */}

            <div className="mb-5">

              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Username
              </label>

              <div className="relative">

                <UserRound
                  size={19}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  type="text"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    setError("");
                  }}
                  required
                  autoComplete="username"
                  className="h-13 w-full rounded-xl border border-gray-200 bg-gray-50 pl-11 pr-4 text-sm text-gray-900 outline-none transition-all placeholder:text-gray-400 hover:border-gray-300 focus:border-red-500 focus:bg-white focus:ring-4 focus:ring-red-500/10"
                />

              </div>
            </div>

            {/* Password */}

            <div className="mb-6">

              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Password
              </label>

              <div className="relative">

                <LockKeyhole
                  size={19}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  placeholder="Password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError("");
                  }}
                  required
                  autoComplete="current-password"
                  className="h-13 w-full rounded-xl border border-gray-200 bg-gray-50 pl-11 pr-12 text-sm text-gray-900 outline-none transition-all placeholder:text-gray-400 hover:border-gray-300 focus:border-red-500 focus:bg-white focus:ring-4 focus:ring-red-500/10"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(
                      !showPassword
                    )
                  }
                  className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-lg text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
                >
                  {showPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>

              </div>
            </div>

            {/* Login Button */}

            <button
              type="submit"
              disabled={loading}
              className="flex h-13 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-red-500 to-rose-600 text-sm font-semibold text-white shadow-lg shadow-red-200 transition-all duration-200 hover:-translate-y-0.5 hover:from-red-600 hover:to-rose-700 hover:shadow-xl hover:shadow-red-200 active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <>
                  <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Login...
                </>
              ) : (
                <>
                  <LogIn size={18} />
                  Login
                </>
              )}
            </button>

          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;