"use client";

import React, { useState } from "react";
import { useHabitStore } from "@/lib/store";
import {
  Settings,
  ChevronRight,
  ChevronLeft,
  Plus,
  Sparkles,
  MoreVertical,
  Edit2,
  Trash2,
  Archive,
  Calendar,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import NewHabitDialog from "@/components/NewHabitDialog";
import { formatDate, getDatesInRange } from "@/lib/utils";
import { ProDialog, SettingsDialog } from "@/components/SettingsDialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { is } from "date-fns/locale";

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  show: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 24,
    },
  },
};

export interface Habit {
  id: string;
  name: string;
  completedDates: string[];
  pomodoroSessions: number;
  color?: string;
  emoji?: string;
  streak?: number;
  frequency?: "daily" | "weekly" | "monthly";
  isArchived?: boolean;
}

const colors = [
  "from-purple-500 to-pink-500",
  "from-blue-500 to-cyan-500",
  "from-green-500 to-emerald-500",
  "from-yellow-500 to-orange-500",
];

const emojis = ["✨", "🌟", "💫", "⭐️", "🎯", "🎨", "📚", "💪", "🧘‍♀️", "🏃‍♀️"];

export default function Component() {
  const {
    habits,
    startDate,
    toggleHabitCompletion,
    adjustDates,
    setIsNewHabitOpen,
    editHabit,
    deleteHabit,
    archiveHabit,
    changeHabitFrequency,
    isPro,
  } = useHabitStore();
  const [theme, setTheme] = useState("light");
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const dates = getDatesInRange(startDate, 15);

  const toggleTheme = (newTheme) => {
    setTheme(newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
  };

  return (
    <motion.div
      className="min-h-screen bg-background flex"
      initial="hidden"
      animate="show"
      variants={containerVariants}
    >
      <div className="flex-1 p-6 pb-16">
        <motion.header
          className="flex items-center justify-between mb-8"
          variants={itemVariants}
        >
          <div className="flex-1">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
              Your Habits Dashboard
            </h1>
            <p className="text-muted-foreground mt-1">
              Track and build lasting habits
            </p>
          </div>
          <div className="flex items-center gap-4">
            <SettingsDialog />

            {!isPro && <ProDialog />}
          </div>
        </motion.header>

        <motion.div
          className="max-w-6xl mx-auto space-y-8"
          variants={containerVariants}
        >
          <motion.div
            className="flex items-center justify-between"
            variants={itemVariants}
          >
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => adjustDates(-15)}
                className="hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors duration-200"
              >
                <ChevronLeft className="w-5 h-5" />
              </Button>
              <h2 className="text-xl font-semibold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                {startDate.toLocaleString("default", {
                  month: "long",
                  year: "numeric",
                })}
              </h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => adjustDates(15)}
                className="hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors duration-200"
              >
                <ChevronRight className="w-5 h-5" />
              </Button>
            </div>
            <Button
              onClick={() => setIsNewHabitOpen(true)}
              className="rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:opacity-90 transition-opacity duration-200"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Habit
            </Button>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="bg-white/40 dark:bg-gray-900/40 rounded-2xl shadow-xl border border-gray-200/30 dark:border-gray-800/30 overflow-hidden backdrop-blur-xl min-h-[600px]"
          >
            <div className="grid grid-cols-[220px_repeat(15,minmax(45px,1fr))] border-b border-gray-200/30 dark:border-gray-800/30">
              <div className="px-4 py-3 font-semibold flex items-center gap-2 truncate">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 truncate">
                  HABITS
                </span>
                <span className="text-[10px] font-normal text-gray-400 flex-shrink-0">
                  Track daily
                </span>
              </div>
              {dates.map((date, i) => {
                const formattedDate = formatDate(date);
                const isToday =
                  date.toDateString() === new Date().toDateString();
                return (
                  <motion.div
                    key={i}
                    className={`px-2 py-3 text-center border-l border-gray-200/30 dark:border-gray-800/30 relative ${
                      isToday ? "bg-violet-50/30 dark:bg-violet-900/10" : ""
                    }`}
                    whileHover={{ backgroundColor: "rgba(139, 92, 246, 0.05)" }}
                  >
                    {isToday && (
                      <motion.div
                        className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-violet-500 to-purple-500"
                        layoutId="today-indicator"
                      />
                    )}
                    <div className="font-medium text-violet-600/70 dark:text-violet-400/70 text-[10px]">
                      {formattedDate.month}
                    </div>
                    <div className="font-bold text-sm">{formattedDate.day}</div>
                    <div className="text-[10px] font-medium text-gray-400 dark:text-gray-500">
                      {formattedDate.weekday}
                    </div>
                  </motion.div>
                );
              })}
            </div>

            <ScrollArea className="max-h-[calc(100vh-300px)]">
              <div className="grid grid-cols-[220px_repeat(15,minmax(45px,1fr))]">
                <AnimatePresence>
                  {habits.map((habit) => (
                    <motion.div
                      key={habit.id}
                      className="contents"
                      variants={itemVariants}
                      initial="hidden"
                      animate="show"
                      exit="hidden"
                    >
                      <div className="px-4 py-3 flex items-center justify-between gap-2 border-b border-gray-200/30 dark:border-gray-800/30 group hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-all duration-300">
                        <div className="flex items-center gap-3">
                          <motion.div
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            className={`w-8 h-8 rounded-lg bg-gradient-to-br ${habit.color} flex items-center justify-center text-white shadow-lg ring-1 ring-white dark:ring-gray-800`}
                          >
                            {habit.emoji}
                          </motion.div>
                          <div className="flex flex-col min-w-0">
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <span className="font-semibold text-sm text-gray-800 dark:text-gray-200 truncate max-w-[100px]">
                                    {habit.name}
                                  </span>
                                </TooltipTrigger>
                                <TooltipContent side="right">
                                  <p>{habit.name}</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                            <div className="flex items-center gap-1 text-xs">
                              <span className="text-violet-600 dark:text-violet-400 font-medium">
                                {habit.streak}🔥
                              </span>
                              <span className="text-gray-400 dark:text-gray-500">
                                streak
                              </span>
                            </div>
                          </div>
                        </div>

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <motion.button
                              className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-all duration-200"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <MoreVertical className="w-3.5 h-3.5 text-gray-400" />
                            </motion.button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-56">
                            <DropdownMenuItem
                              onClick={() => {
                                setEditingHabit(habit);
                                setIsEditDialogOpen(true);
                              }}
                              className="gap-2 py-3"
                            >
                              <Edit2 className="w-4 h-4" /> Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => {
                                setEditingHabit(habit);
                                setIsDeleteDialogOpen(true);
                              }}
                              className="gap-2 py-3 text-red-600 dark:text-red-400"
                            >
                              <Trash2 className="w-4 h-4" /> Delete
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => archiveHabit(habit.id)}
                              className="gap-2 py-3"
                            >
                              <Archive className="w-4 h-4" />
                              {habit.isArchived ? "Unarchive" : "Archive"}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="gap-2 py-3">
                              <Calendar className="w-4 h-4" />
                              <Select
                                value={habit.frequency || "daily"}
                                onValueChange={(
                                  value: "daily" | "weekly" | "monthly"
                                ) => changeHabitFrequency(habit.id, value)}
                              >
                                <SelectTrigger className="border-0 p-0 h-auto">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="daily">Daily</SelectItem>
                                  <SelectItem value="weekly">Weekly</SelectItem>
                                  <SelectItem value="monthly">
                                    Monthly
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      {dates.map((date, i) => {
                        const dateStr = date.toISOString().split("T")[0];
                        const isCompleted =
                          habit.completedDates.includes(dateStr);

                        // Calculate streak up to this specific date
                        let streakForDay = 0;
                        let checkDate = new Date(date);
                        let streakBroken = false;

                        // Check up to 30 days back from this specific date
                        for (let j = 0; j < 30; j++) {
                          const checkDateStr = checkDate
                            .toISOString()
                            .split("T")[0];
                          const isDayCompleted =
                            habit.completedDates.includes(checkDateStr);

                          if (isDayCompleted && !streakBroken) {
                            streakForDay++;
                          } else {
                            const dayOfWeek = checkDate.getDay();
                            const isRequiredDay =
                              habit.frequency === "weekly"
                                ? dayOfWeek === 1 // Monday
                                : habit.frequency === "monthly"
                                ? checkDate.getDate() === 1 // First day of month
                                : true; // Daily

                            if (isRequiredDay) {
                              streakBroken = true;
                            }
                          }

                          // Move to previous day
                          checkDate.setDate(checkDate.getDate() - 1);
                        }

                        // Enhanced streak-based opacity calculation
                        const maxOpacity = 1;
                        const minOpacity = 0.3;
                        const maxStreak = 30;

                        // Calculate intensity based on streak for this specific day
                        const streakBonus = Math.min(
                          streakForDay / maxStreak,
                          1
                        );
                        const baseOpacity =
                          minOpacity + (maxOpacity - minOpacity) * streakBonus;

                        const streakOpacity = isCompleted
                          ? baseOpacity
                          : minOpacity;

                        return (
                          <motion.button
                            key={i}
                            className={`border-l border-b border-gray-200/30 dark:border-gray-800/30 p-2 relative group transition-all duration-300 ${
                              isCompleted
                                ? "bg-violet-50/30 dark:bg-violet-900/10"
                                : ""
                            }`}
                            onClick={() =>
                              toggleHabitCompletion(habit.id, date)
                            }
                            whileHover={{ scale: 0.98 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <motion.div
                              className={`absolute inset-1.5 rounded-lg transition-all duration-300 ${
                                isCompleted
                                  ? `bg-gradient-to-br ${habit.color} shadow-sm ring-1 ring-white/50 dark:ring-gray-800/50`
                                  : "scale-90"
                              }`}
                              initial={false}
                              animate={{
                                scale: isCompleted ? 1 : 0.9,
                                opacity: isCompleted ? streakOpacity : 0,
                              }}
                              style={{
                                boxShadow: isCompleted
                                  ? `0 4px 12px rgba(139, 92, 246, ${
                                      streakBonus * 0.7
                                    })`
                                  : "none",
                              }}
                            />
                            <motion.div
                              className={`absolute inset-1.5 bg-gray-100/80 dark:bg-gray-800/50 rounded-lg transition-all duration-300 ${
                                !isCompleted && "group-hover:opacity-100"
                              } opacity-0 ring-1 ring-violet-200 dark:ring-violet-800/30`}
                            />
                          </motion.button>
                        );
                      })}
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </ScrollArea>
          </motion.div>
        </motion.div>
      </div>

      <NewHabitDialog />

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Habit</DialogTitle>
            <DialogDescription>
              Customize your habit. Make it uniquely yours!
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="habit-name">Habit Name</Label>
              <Input
                id="habit-name"
                placeholder="e.g., Read for 30 minutes, Meditate, Exercise"
                value={editingHabit?.name || ""}
                onChange={(e) =>
                  setEditingHabit((prev) =>
                    prev ? { ...prev, name: e.target.value } : null
                  )
                }
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <Label>Choose Color Theme</Label>
              <div className="grid grid-cols-4 gap-2">
                {colors.map((color, index) => (
                  <Button
                    key={index}
                    type="button"
                    onClick={() =>
                      setEditingHabit((prev) =>
                        prev ? { ...prev, color } : null
                      )
                    }
                    className={`w-full h-10 rounded-lg bg-gradient-to-br ${color} hover:opacity-90 transition-opacity ${
                      editingHabit?.color === color
                        ? "ring-2 ring-purple-600"
                        : ""
                    }`}
                  />
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <Label>Choose Emoji</Label>
              <div className="grid grid-cols-5 gap-2">
                {emojis.map((emoji, index) => (
                  <TooltipProvider key={index}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          type="button"
                          onClick={() =>
                            setEditingHabit((prev) =>
                              prev ? { ...prev, emoji } : null
                            )
                          }
                          className={`w-full h-10 bg-white hover:bg-gray-50 ${
                            editingHabit?.emoji === emoji
                              ? "ring-2 ring-purple-600"
                              : ""
                          }`}
                        >
                          {emoji}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Select emoji</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter className="mt-6">
            <Button
              onClick={() => {
                if (editingHabit) {
                  editHabit(editingHabit.id, {
                    name: editingHabit.name,
                    emoji: editingHabit.emoji,
                    color: editingHabit.color,
                  });
                  setIsEditDialogOpen(false);
                }
              }}
              disabled={!editingHabit?.name?.trim()}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 h-auto py-2 px-4 w-auto"
            >
              Save Changes
            </Button>
            <DialogClose>Cancel</DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-transparent">
              Delete Habit
            </DialogTitle>
            <DialogDescription className="pt-4 space-y-4">
              <div className="bg-red-50 dark:bg-red-900/10 rounded-lg p-4 border border-red-100 dark:border-red-900/20">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-red-100 dark:bg-red-900/20 rounded-full">
                    <Trash2 className="w-5 h-5 text-red-600 dark:text-red-400" />
                  </div>
                  <p className="text-sm text-red-600 dark:text-red-400 font-medium">
                    This action cannot be undone
                  </p>
                </div>
              </div>

              {editingHabit && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-100 dark:border-gray-800"
                >
                  <div
                    className={`w-10 h-10 rounded-lg bg-gradient-to-br ${editingHabit.color} flex items-center justify-center text-white shadow-lg mr-3`}
                  >
                    {editingHabit.emoji}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 dark:text-gray-100">
                      {editingHabit.name}
                    </h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {editingHabit.streak} day streak •{" "}
                      {editingHabit.completedDates.length} completions
                    </p>
                  </div>
                </motion.div>
              )}

              <p className="text-sm text-gray-500 dark:text-gray-400">
                You're about to delete this habit and all of its associated
                data. This includes your streak, completion history, and any
                customizations you've made.
              </p>
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="mt-6 space-y-2">
            <div className="flex flex-col sm:flex-row gap-2 w-full">
              <Button
                variant="outline"
                onClick={() => setIsDeleteDialogOpen(false)}
                className="flex-1 border-2"
              >
                <span className="font-medium">Keep Habit</span>
              </Button>
              <Button
                variant="destructive"
                onClick={() => {
                  if (editingHabit) {
                    deleteHabit(editingHabit.id);
                    setIsDeleteDialogOpen(false);
                  }
                }}
                className="flex-1 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <motion.div
                  className="flex items-center justify-center gap-2"
                  whileTap={{ scale: 0.98 }}
                >
                  <Trash2 className="w-4 h-4" />
                  <span className="font-medium">Delete Forever</span>
                </motion.div>
              </Button>
            </div>
            <p className="text-xs text-center text-gray-400 dark:text-gray-500">
              Tip: Consider archiving the habit instead if you might want to
              revisit it later
            </p>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
