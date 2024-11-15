"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, Mail, Check, ArrowRight } from "lucide-react";

export default function ResetPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [focused, setFocused] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // TODO: Implement password reset logic
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1500);
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
        <div className="absolute top-1/4 -left-1/4 w-1/2 h-1/2 bg-gradient-to-br from-purple-200/30 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-gradient-to-tl from-blue-200/30 to-transparent rounded-full blur-3xl" />
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
                  href="/login"
                  className="group flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                  <span className="text-sm font-medium">Back to login</span>
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

            {!submitted ? (
              <>
                {/* Title */}
                <motion.div
                  variants={itemVariants}
                  className="text-center mb-10"
                >
                  <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-950 to-blue-950 mb-2">
                    Reset Password
                  </h1>
                  <p className="text-gray-600">
                    Enter your email address and we'll send you instructions to
                    reset your password
                  </p>
                </motion.div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                  <motion.div variants={itemVariants}>
                    <div className="relative">
                      <label
                        htmlFor="email"
                        className={`absolute left-3 ${
                          focused || email
                            ? "-top-2.5 text-xs bg-white/80 px-2 text-purple-600"
                            : "top-3.5 text-gray-500"
                        } transition-all pointer-events-none`}
                      >
                        Email Address
                      </label>
                      <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        onFocus={() => setFocused(true)}
                        onBlur={() => setFocused(false)}
                        required
                        className="w-full px-4 py-3.5 bg-white/50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-purple-600/20 focus:border-purple-600 outline-none transition-all pl-11"
                      />
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    </div>
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
                          <span>Sending instructions...</span>
                        </div>
                      ) : (
                        "Send Reset Instructions"
                      )}
                    </button>
                  </motion.div>
                </form>
              </>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-8"
              >
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Check className="w-8 h-8 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Check Your Email
                </h2>
                <p className="text-gray-600 mb-8">
                  We've sent password reset instructions to:
                  <br />
                  <span className="font-medium text-gray-900">{email}</span>
                </p>
                <div className="space-y-4">
                  <Link
                    href="/login"
                    className="inline-flex items-center justify-center w-full gap-2 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-2xl font-semibold hover:shadow-lg hover:shadow-purple-500/10 transform hover:scale-[1.01] transition-all"
                  >
                    <span>Return to Login</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="w-full py-3 text-gray-600 hover:text-gray-900 font-medium transition-colors"
                  >
                    Didn't receive the email? Try again
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
