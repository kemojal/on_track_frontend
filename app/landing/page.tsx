"use client";

import { motion, useInView } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  CheckCircle,
  Clock,
  BarChart2,
  Target,
} from "lucide-react";
import { useRef } from "react";

export default function LandingPage() {
  // Refs for scroll animations
  const heroRef = useRef(null);
  const featuresRef = useRef(null);
  const statsRef = useRef(null);
  const ctaRef = useRef(null);

  // Check if sections are in view
  const isHeroInView = useInView(heroRef, { once: true, margin: "-100px" });
  const isFeaturesInView = useInView(featuresRef, {
    once: true,
    margin: "-100px",
  });
  const isStatsInView = useInView(statsRef, { once: true, margin: "-100px" });
  const isCtaInView = useInView(ctaRef, { once: true, margin: "-100px" });

  const features = [
    {
      icon: <Clock className="w-6 h-6" />,
      title: "Time Tracking",
      description:
        "Track your habits with precision timing and smart reminders",
    },
    {
      icon: <BarChart2 className="w-6 h-6" />,
      title: "Analytics Dashboard",
      description: "Visualize your progress with beautiful, insightful charts",
    },
    {
      icon: <Target className="w-6 h-6" />,
      title: "Goal Setting",
      description:
        "Set and achieve your personal goals with our smart tracking system",
    },
  ];

  const slideUpVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link
              href="/"
              className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600"
            >
              OnTrack
            </Link>
            <nav className="hidden md:flex items-center space-x-8">
              <Link
                href="/features"
                className="text-gray-600 hover:text-gray-900"
              >
                Features
              </Link>
              <Link
                href="/pricing"
                className="text-gray-600 hover:text-gray-900"
              >
                Pricing
              </Link>
              <Link href="/about" className="text-gray-600 hover:text-gray-900">
                About
              </Link>
              <Link
                href="/signup"
                className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full font-semibold"
              >
                Get Started
              </Link>
            </nav>
          </div>
        </div>
      </header>
      {/* Hero Section */}
      <motion.div
        ref={heroRef}
        initial="hidden"
        animate={isHeroInView ? "visible" : "hidden"}
        variants={slideUpVariants}
        className="relative overflow-hidden pt-16"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 text-center">
          <motion.h1
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: {
                opacity: 1,
                y: 0,
                transition: { duration: 0.8, delay: 0.2 },
              },
            }}
            className="text-5xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600 mb-6"
          >
            Transform Your Habits,
            <br />
            Transform Your Life
          </motion.h1>

          <motion.p
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: {
                opacity: 1,
                y: 0,
                transition: { duration: 0.8, delay: 0.4 },
              },
            }}
            className="text-xl text-gray-600 max-w-2xl mx-auto mb-10"
          >
            Track, analyze, and improve your daily habits with our intelligent
            habit tracking platform. Built for high performers who want to
            achieve more.
          </motion.p>

          <motion.div
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: {
                opacity: 1,
                y: 0,
                transition: { duration: 0.8, delay: 0.6 },
              },
            }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link href="/signup">
              <button className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full font-semibold hover:shadow-lg transform hover:scale-105 transition-all flex items-center gap-2 w-full sm:w-auto justify-center">
                Get Started Free <ArrowRight className="w-5 h-5" />
              </button>
            </Link>
            <Link href="/demo">
              <button className="px-8 py-4 bg-white text-gray-800 rounded-full font-semibold hover:shadow-lg transform hover:scale-105 transition-all border border-gray-200 w-full sm:w-auto">
                Watch Demo
              </button>
            </Link>
          </motion.div>
        </div>
      </motion.div>

      {/* Features Section */}
      <motion.div
        ref={featuresRef}
        initial="hidden"
        animate={isFeaturesInView ? "visible" : "hidden"}
        variants={slideUpVariants}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20"
      >
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.5, delay: index * 0.2 },
                },
              }}
              className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center text-purple-600 mb-6">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Social Proof Section */}
      <motion.div
        ref={statsRef}
        initial="hidden"
        animate={isStatsInView ? "visible" : "hidden"}
        variants={slideUpVariants}
        className="bg-gradient-to-br from-purple-50 to-indigo-50 py-16"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex flex-wrap justify-center gap-8 items-center">
            <motion.div
              variants={{
                hidden: { opacity: 0, scale: 0.8 },
                visible: {
                  opacity: 1,
                  scale: 1,
                  transition: { duration: 0.5, delay: 0.2 },
                },
              }}
              className="flex items-center gap-2"
            >
              <span className="text-4xl font-bold text-purple-600">50K+</span>
              <span className="text-gray-600">Active Users</span>
            </motion.div>
            <motion.div
              variants={{
                hidden: { opacity: 0, scale: 0.8 },
                visible: {
                  opacity: 1,
                  scale: 1,
                  transition: { duration: 0.5, delay: 0.4 },
                },
              }}
              className="flex items-center gap-2"
            >
              <span className="text-4xl font-bold text-purple-600">1M+</span>
              <span className="text-gray-600">Habits Tracked</span>
            </motion.div>
            <motion.div
              variants={{
                hidden: { opacity: 0, scale: 0.8 },
                visible: {
                  opacity: 1,
                  scale: 1,
                  transition: { duration: 0.5, delay: 0.6 },
                },
              }}
              className="flex items-center gap-2"
            >
              <span className="text-4xl font-bold text-purple-600">4.9</span>
              <span className="text-gray-600">App Rating</span>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* CTA Section */}
      <motion.div
        ref={ctaRef}
        initial="hidden"
        animate={isCtaInView ? "visible" : "hidden"}
        variants={slideUpVariants}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center"
      >
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-3xl p-12 text-white">
          <motion.h2
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: {
                opacity: 1,
                y: 0,
                transition: { duration: 0.8, delay: 0.2 },
              },
            }}
            className="text-3xl md:text-4xl font-bold mb-6"
          >
            Ready to Transform Your Life?
          </motion.h2>
          <motion.p
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: {
                opacity: 1,
                y: 0,
                transition: { duration: 0.8, delay: 0.4 },
              },
            }}
            className="text-lg text-purple-100 mb-8 max-w-2xl mx-auto"
          >
            Join thousands of users who are already achieving their goals with
            our habit tracking platform.
          </motion.p>
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: {
                opacity: 1,
                y: 0,
                transition: { duration: 0.8, delay: 0.6 },
              },
            }}
          >
            <Link href="/signup">
              <button className="px-8 py-4 bg-white text-purple-600 rounded-full font-semibold hover:shadow-lg transform hover:scale-105 transition-all">
                Start Your Journey Today
              </button>
            </Link>
          </motion.div>
        </div>
      </motion.div>

      <footer className="bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600 mb-4">
                OnTrack
              </h3>
              <p className="text-gray-600">
                Transform your habits, transform your life.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <div className="space-y-2">
                <Link
                  href="/features"
                  className="block text-gray-600 hover:text-gray-900"
                >
                  Features
                </Link>
                <Link
                  href="/pricing"
                  className="block text-gray-600 hover:text-gray-900"
                >
                  Pricing
                </Link>
                <Link
                  href="/about"
                  className="block text-gray-600 hover:text-gray-900"
                >
                  About
                </Link>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <div className="space-y-2">
                <Link
                  href="/blog"
                  className="block text-gray-600 hover:text-gray-900"
                >
                  Blog
                </Link>
                <Link
                  href="/careers"
                  className="block text-gray-600 hover:text-gray-900"
                >
                  Careers
                </Link>
                <Link
                  href="/contact"
                  className="block text-gray-600 hover:text-gray-900"
                >
                  Contact
                </Link>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <div className="space-y-2">
                <Link
                  href="/privacy"
                  className="block text-gray-600 hover:text-gray-900"
                >
                  Privacy
                </Link>
                <Link
                  href="/terms"
                  className="block text-gray-600 hover:text-gray-900"
                >
                  Terms
                </Link>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-100 text-center text-gray-600">
            © {new Date().getFullYear()} OnTrack. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
