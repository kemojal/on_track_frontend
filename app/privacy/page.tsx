"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  ArrowLeft,
  Shield,
  Database,
  Lock,
  Eye,
  Server,
  Bell,
  Download,
  Trash2,
} from "lucide-react";

export default function PrivacyPage() {
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

  const sections = [
    {
      icon: Database,
      title: "Data Collection",
      content:
        "We collect only essential information needed to provide you with the best habit tracking experience. This includes your account details and habit data.",
    },
    {
      icon: Lock,
      title: "Data Security",
      content:
        "Your data is encrypted using industry-standard protocols. We employ multiple layers of security to protect your information.",
    },
    {
      icon: Eye,
      title: "Data Usage",
      content:
        "We use your data solely to improve your experience and provide personalized insights. We never sell your personal information.",
    },
    {
      icon: Server,
      title: "Data Storage",
      content:
        "Your data is stored in secure, encrypted servers located in compliance with relevant data protection regulations.",
    },
    {
      icon: Bell,
      title: "Communications",
      content:
        "We may send you important updates about our service. You can manage your communication preferences at any time.",
    },
    {
      icon: Download,
      title: "Data Access",
      content:
        "You can request a copy of your personal data at any time. We provide this in a machine-readable format.",
    },
    {
      icon: Trash2,
      title: "Data Deletion",
      content:
        "You have the right to request deletion of your data. We will comply with your request within the statutory period.",
    },
    {
      icon: Shield,
      title: "Your Rights",
      content:
        "You have full control over your data, including the right to access, modify, export, or delete it at any time.",
    },
  ];

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-100 via-white to-blue-50">
      {/* Decorative background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 -right-1/4 w-1/2 h-1/2 bg-gradient-to-bl from-purple-200/30 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 -left-1/4 w-1/2 h-1/2 bg-gradient-to-tr from-blue-200/30 to-transparent rounded-full blur-3xl" />
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative max-w-6xl mx-auto px-4 py-12 sm:px-6 lg:px-8"
      >
        {/* Header */}
        <div className="mb-12">
          <motion.div
            variants={itemVariants}
            className="flex items-center justify-between mb-8"
          >
            <Link
              href="/landing"
              className="group flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span className="text-sm font-medium">Back to home</span>
            </Link>
            <Link
              href="/landing"
              className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600"
            >
              OnTrack
            </Link>
          </motion.div>

          <motion.div variants={itemVariants} className="text-center mb-16">
            <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-950 to-blue-950 mb-4">
              Privacy Policy
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Last updated:{" "}
              {new Date().toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </p>
          </motion.div>
        </div>

        {/* Introduction */}
        <motion.div
          variants={itemVariants}
          className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl shadow-purple-500/5 border border-white/20 p-8 mb-12"
        >
          <div className="max-w-3xl mx-auto">
            <p className="text-gray-600 leading-relaxed">
              At OnTrack, we take your privacy seriously. This policy outlines
              how we collect, use, and protect your personal information. We're
              committed to maintaining the trust you place in us by being
              transparent about our data practices.
            </p>
          </div>
        </motion.div>

        {/* Main content */}
        <div className="grid gap-8 md:grid-cols-2">
          {sections.map((section, index) => (
            <motion.div
              key={section.title}
              variants={itemVariants}
              className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-lg shadow-purple-500/5 border border-white/20 p-6 hover:shadow-xl transition-shadow"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 bg-gradient-to-br from-purple-100 to-blue-50 rounded-2xl">
                  <section.icon className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {section.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {section.content}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Contact section */}
        <motion.div variants={itemVariants} className="mt-12">
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl shadow-purple-500/5 border border-white/20 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Contact Us About Privacy
            </h2>
            <p className="text-gray-600 leading-relaxed mb-6">
              If you have any questions about our privacy practices or would
              like to exercise your data rights, please contact our Data
              Protection Officer at:
            </p>
            <Link
              href="mailto:privacy@ontrack.com"
              className="inline-flex items-center text-purple-600 hover:text-purple-700 font-medium"
            >
              privacy@ontrack.com
            </Link>
          </div>
        </motion.div>

        {/* Footer */}
        <motion.div variants={itemVariants} className="mt-12 text-center">
          <p className="text-sm text-gray-500">
            {new Date().getFullYear()} OnTrack. All rights reserved.
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
