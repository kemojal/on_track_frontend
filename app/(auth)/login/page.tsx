"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import { Eye, EyeOff, ArrowLeft, Check } from "lucide-react";

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // TODO: Implement login logic
    setTimeout(() => setLoading(false), 1500);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
      },
    },
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-100 via-white to-blue-50 flex items-center justify-center p-4">
      {/* Decorative background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 -right-1/4 w-1/2 h-1/2 bg-gradient-to-bl from-purple-200/30 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 -left-1/4 w-1/2 h-1/2 bg-gradient-to-tr from-blue-200/30 to-transparent rounded-full blur-3xl" />
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-lg relative"
      >
        {/* Card */}
        <motion.div
          variants={itemVariants}
          className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl shadow-purple-500/5 overflow-hidden border border-white/20"
        >
          <div className="p-8 sm:p-12">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <motion.div variants={itemVariants}>
                <Link
                  href="/landing"
                  className="group flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                  <span className="text-sm font-medium">Back</span>
                </Link>
              </motion.div>
              <motion.div variants={itemVariants}>
                <Link
                  href="/landing"
                  className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600"
                >
                  OnTrack
                </Link>
              </motion.div>
            </div>

            {/* Title */}
            <motion.div variants={itemVariants} className="text-center mb-10">
              <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-950 to-blue-950 mb-2">
                Welcome Back
              </h1>
              <p className="text-gray-600">
                Continue your journey to better habits
              </p>
            </motion.div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <motion.div variants={itemVariants}>
                <div className="relative">
                  <label
                    htmlFor="email"
                    className={`absolute left-3 ${
                      focused === "email" || formData.email
                        ? "-top-2.5 text-xs bg-white/80 px-2 text-purple-600"
                        : "top-3.5 text-gray-500"
                    } transition-all pointer-events-none`}
                  >
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    onFocus={() => setFocused("email")}
                    onBlur={() => setFocused("")}
                    required
                    className="w-full px-4 py-3.5 bg-white/50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-purple-600/20 focus:border-purple-600 outline-none transition-all"
                  />
                </div>
              </motion.div>

              <motion.div variants={itemVariants}>
                <div className="relative">
                  <label
                    htmlFor="password"
                    className={`absolute left-3 ${
                      focused === "password" || formData.password
                        ? "-top-2.5 text-xs bg-white/80 px-2 text-purple-600"
                        : "top-3.5 text-gray-500"
                    } transition-all pointer-events-none`}
                  >
                    Password
                  </label>
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    onFocus={() => setFocused("password")}
                    onBlur={() => setFocused("")}
                    required
                    className="w-full px-4 py-3.5 bg-white/50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-purple-600/20 focus:border-purple-600 outline-none transition-all pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </motion.div>

              <motion.div
                variants={itemVariants}
                className="flex items-center justify-between"
              >
                <label className="flex items-center gap-2 cursor-pointer group">
                  <div
                    className={`w-4 h-4 rounded border transition-colors ${
                      rememberMe
                        ? "bg-purple-600 border-purple-600"
                        : "border-gray-300 group-hover:border-purple-600"
                    }`}
                    onClick={() => setRememberMe(!rememberMe)}
                  >
                    {rememberMe && <Check className="w-3 h-3 text-white" />}
                  </div>
                  <span className="text-sm text-gray-600">Remember me</span>
                </label>
                <Link
                  href="/forgot-password"
                  className="text-sm text-purple-600 hover:text-purple-700 font-medium"
                >
                  Forgot password?
                </Link>
              </motion.div>

              <motion.div variants={itemVariants}>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-2xl font-semibold hover:shadow-lg hover:shadow-purple-500/10 transform hover:scale-[1.01] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {loading ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Signing in...</span>
                    </div>
                  ) : (
                    "Sign In"
                  )}
                </button>
              </motion.div>

              <motion.div variants={itemVariants} className="relative my-8">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-gray-500">
                    or continue with
                  </span>
                </div>
              </motion.div>

              <motion.div
                variants={itemVariants}
                className="grid grid-cols-2 gap-4"
              >
                <button
                  type="button"
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-2xl hover:bg-gray-50 transition-colors group"
                >
                  <img
                    src="https://www.google.com/favicon.ico"
                    alt="Google"
                    className="w-5 h-5 group-hover:scale-110 transition-transform"
                  />
                  <span className="text-gray-700">Google</span>
                </button>
                <button
                  type="button"
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-2xl hover:bg-gray-50 transition-colors group"
                >
                  <img
                    src="https://github.com/favicon.ico"
                    alt="GitHub"
                    className="w-5 h-5 group-hover:scale-110 transition-transform"
                  />
                  <span className="text-gray-700">GitHub</span>
                </button>
              </motion.div>
            </form>

            <motion.p
              variants={itemVariants}
              className="mt-8 text-center text-gray-600"
            >
              Don't have an account?{" "}
              <Link
                href="/signup"
                className="text-purple-600 hover:text-purple-700 font-semibold"
              >
                Sign up
              </Link>
            </motion.p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
