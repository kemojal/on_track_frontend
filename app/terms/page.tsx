"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  ArrowLeft,
  Shield,
  Users,
  Lock,
  Scale,
  Clock,
  Globe,
} from "lucide-react";

export default function TermsPage() {
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
      icon: Shield,
      title: "Privacy & Security",
      content:
        "We prioritize the protection of your personal information and maintain strict security measures to ensure your data remains private and secure.",
    },
    {
      icon: Users,
      title: "User Conduct",
      content:
        "Users are expected to maintain respectful behavior and avoid any actions that could harm or disrupt the OnTrack community.",
    },
    {
      icon: Lock,
      title: "Data Protection",
      content:
        "Your data is encrypted and stored securely. We never share your personal information with third parties without your explicit consent.",
    },
    {
      icon: Scale,
      title: "Legal Compliance",
      content:
        "Our services comply with applicable laws and regulations, including GDPR and CCPA where applicable.",
    },
    {
      icon: Clock,
      title: "Service Availability",
      content:
        "While we strive for 99.9% uptime, we may occasionally perform maintenance to improve our services.",
    },
    {
      icon: Globe,
      title: "International Usage",
      content:
        "Our services are available globally, subject to local laws and regulations in your jurisdiction.",
    },
  ];

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-100 via-white to-blue-50">
      {/* Decorative background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 -left-1/4 w-1/2 h-1/2 bg-gradient-to-br from-purple-200/30 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 -right-1/4 w-1/2 h-1/2 bg-gradient-to-tl from-blue-200/30 to-transparent rounded-full blur-3xl" />
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:px-8"
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
              Terms of Service
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

        {/* Main content */}
        <motion.div
          variants={itemVariants}
          className="prose prose-lg max-w-none"
        >
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl shadow-purple-500/5 border border-white/20 p-8 mb-8">
            <p className="text-gray-600 leading-relaxed">
              Welcome to OnTrack. By accessing or using our service, you agree
              to be bound by these terms. Please read them carefully before
              proceeding.
            </p>
          </div>

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

          <motion.div variants={itemVariants} className="mt-12 space-y-8">
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl shadow-purple-500/5 border border-white/20 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Contact Us
              </h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                If you have any questions about these Terms, please contact us
                at:
              </p>
              <Link
                href="mailto:support@ontrack.com"
                className="inline-flex items-center text-purple-600 hover:text-purple-700 font-medium"
              >
                support@ontrack.com
              </Link>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="mt-12 text-center">
            <p className="text-sm text-gray-500">
              {new Date().getFullYear()} OnTrack. All rights reserved.
            </p>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}
