"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import {
  Target,
  Sparkles,
  Rocket,
  Award,
  ArrowRight,
  Check,
} from "lucide-react";
import { useRouter } from "next/navigation";
import NewHabitDialog from "@/components/NewHabitDialog";
import { useHabitStore } from "@/lib/store";
import { Button } from "@/components/ui/button";

export default function WelcomePage() {
  const router = useRouter();
  const { setIsNewHabitOpen, habits } = useHabitStore();
  const [step, setStep] = useState(1);
  const [preferences, setPreferences] = useState({
    goals: [],
    frequency: "",
    reminders: false,
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
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
        damping: 15,
      },
    },
  };

  const goals = [
    {
      icon: Target,
      label: "Exercise Regularly",
      description: "Build a consistent workout routine",
    },
    {
      icon: Sparkles,
      label: "Mindfulness",
      description: "Practice daily meditation",
    },
    { icon: Award, label: "Learning", description: "Acquire new skills" },
    {
      icon: Rocket,
      label: "Productivity",
      description: "Enhance work efficiency",
    },
  ];

  const frequencies = ["Daily", "Weekly", "Monthly"];

  const toggleGoal = (goal: string) => {
    setPreferences((prev) => ({
      ...prev,
      goals: prev.goals.includes(goal)
        ? prev.goals.filter((g) => g !== goal)
        : [...prev.goals, goal],
    }));
  };

  useEffect(() => {
    setIsNewHabitOpen(false);
  }, []);

  useEffect(() => {
    if (habits.length > 0) {
      router.push("/home");
    }
  }, [habits, router]);

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <AnimatePresence mode="wait">
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  What are your goals?
                </h2>
                <p className="text-gray-600">
                  Select the habits you want to develop
                </p>
              </div>

              <motion.div
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {goals.map(({ icon: Icon, label, description }) => (
                  <motion.button
                    key={label}
                    variants={itemVariants}
                    layout
                    onClick={() => toggleGoal(label)}
                    className={`p-6 rounded-2xl text-left transition-all ${
                      preferences.goals.includes(label)
                        ? "bg-purple-50 border-purple-200 ring-2 ring-purple-600"
                        : "bg-white hover:bg-gray-50 border border-gray-200"
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className={`p-3 rounded-xl ${
                          preferences.goals.includes(label)
                            ? "bg-purple-100"
                            : "bg-gray-100"
                        }`}
                      >
                        <Icon
                          className={`w-6 h-6 ${
                            preferences.goals.includes(label)
                              ? "text-purple-600"
                              : "text-gray-600"
                          }`}
                        />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">
                          {label}
                        </h3>
                        <p className="text-sm text-gray-600">{description}</p>
                      </div>
                      {preferences.goals.includes(label) && (
                        <Check className="w-5 h-5 text-purple-600 ml-auto" />
                      )}
                    </div>
                  </motion.button>
                ))}
              </motion.div>
            </motion.div>
          </AnimatePresence>
        );

      case 2:
        return (
          <AnimatePresence mode="wait">
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  How often do you want to track?
                </h2>
                <p className="text-gray-600">
                  Choose your preferred tracking frequency
                </p>
              </div>

              <motion.div
                className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {frequencies.map((freq) => (
                  <motion.button
                    key={freq}
                    variants={itemVariants}
                    layout
                    onClick={() =>
                      setPreferences((prev) => ({ ...prev, frequency: freq }))
                    }
                    className={`p-6 rounded-2xl text-center transition-all relative group overflow-hidden ${
                      preferences.frequency === freq
                        ? "bg-purple-50 border-purple-200 ring-2 ring-purple-600"
                        : "bg-white hover:bg-gray-50 border-2 border-gray-200 hover:border-purple-200"
                    }`}
                  >
                    <div className="relative z-10">
                      <h3
                        className={`font-semibold ${
                          preferences.frequency === freq
                            ? "text-purple-600"
                            : "text-gray-900"
                        }`}
                      >
                        {freq}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        Track your habits {freq.toLowerCase()}
                      </p>
                    </div>
                    {preferences.frequency === freq && (
                      <div className="absolute inset-0 bg-purple-50/50 pointer-events-none" />
                    )}
                  </motion.button>
                ))}
              </motion.div>
            </motion.div>
          </AnimatePresence>
        );

      case 3:
        return (
          <AnimatePresence mode="wait">
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                  Enable Reminders
                </h2>
                <p className="text-gray-600">
                  Stay on track with helpful notifications
                </p>
              </div>

              <motion.div
                className="max-w-md mx-auto"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                <motion.button
                  variants={itemVariants}
                  layout
                  onClick={() =>
                    setPreferences((prev) => ({
                      ...prev,
                      reminders: !prev.reminders,
                    }))
                  }
                  className={`w-full p-6 rounded-2xl transition-all relative group ${
                    preferences.reminders
                      ? "bg-purple-50 border-purple-200 ring-2 ring-purple-600"
                      : "bg-white hover:bg-gray-50 border-2 border-gray-200 hover:border-purple-200"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">
                        Daily Reminders
                      </h3>
                      <p className="text-sm text-gray-600">
                        Get notified to track your habits
                      </p>
                    </div>
                    <div className="relative">
                      <div
                        className={`w-14 h-7 rounded-full transition-colors ${
                          preferences.reminders
                            ? "bg-purple-600"
                            : "bg-gray-200"
                        }`}
                      >
                        <div
                          className={`absolute top-1 w-5 h-5 rounded-full bg-white shadow-sm transition-all duration-200 ${
                            preferences.reminders ? "right-1" : "left-1"
                          }`}
                        />
                      </div>
                    </div>
                  </div>
                </motion.button>

                <motion.div
                  variants={itemVariants}
                  className="mt-6 p-4 bg-purple-50 rounded-xl"
                >
                  <p className="text-sm text-purple-700">
                    You can customize your reminder schedule in settings after
                    setup
                  </p>
                </motion.div>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        );

      default:
        return null;
    }
  };

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      // Open the NewHabitDialog when clicking Get Started
      setIsNewHabitOpen(true);
    }
  };

  const isStepValid = () => {
    switch (step) {
      case 1:
        return preferences.goals.length > 0;
      case 2:
        return preferences.frequency !== "";
      case 3:
        return true;
      default:
        return false;
    }
  };

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
        {/* Progress bar */}
        <motion.div variants={itemVariants} className="mb-12">
          <div className="max-w-xs mx-auto">
            <div className="h-2 bg-gray-200 rounded-full">
              <div
                className="h-full bg-gradient-to-r from-purple-600 to-blue-600 rounded-full transition-all"
                style={{ width: `${(step / 3) * 100}%` }}
              />
            </div>
            <div className="mt-2 text-center text-sm text-gray-600">
              Step {step} of 3
            </div>
          </div>
        </motion.div>

        {/* Content */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl shadow-purple-500/5 border border-white/20 p-8">
          <AnimatePresence mode="wait">{renderStep()}</AnimatePresence>

          {/* Navigation */}
          <motion.div variants={itemVariants} className="mt-12">
            <Button
              onClick={handleNext}
              disabled={!isStepValid()}
              className="h-auto w-full py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-2xl font-semibold hover:shadow-lg hover:shadow-purple-500/10 transform hover:scale-[1.01] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
            >
              <span>{step === 3 ? "Get Started" : "Continue"}</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </motion.div>
        </div>
      </motion.div>
      <NewHabitDialog />
    </div>
  );
}
