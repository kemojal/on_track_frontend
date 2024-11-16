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
  Activity,
  Target,
  Award,
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
import { Progress } from "@/components/ui/progress";
import { useRouter } from "next/navigation";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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
    setIsNewHabitOpen,
    editHabit,
    deleteHabit,
    archiveHabit,
    changeHabitFrequency,
    calculateProgress,
    isPro,
  } = useHabitStore();
  const [theme, setTheme] = useState("light");
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const router = useRouter();

  const sortedHabits = habits
    .filter((h) => !h.isArchived)
    .sort((a, b) => (b.streak || 0) - (a.streak || 0));

  // Handler functions
  const handleEdit = (habit: Habit) => {
    setEditingHabit(habit);
    setIsEditDialogOpen(true);
  };

  const handleDelete = (habit: Habit) => {
    setEditingHabit(habit);
    setIsDeleteDialogOpen(true);
  };

  const handleArchive = (habit: Habit) => {
    archiveHabit(habit.id);
  };

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-background via-background/95 to-background/90 p-6 pb-16"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      {/* Welcome Section with Stats */}
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <motion.div
            variants={itemVariants}
            className="col-span-full lg:col-span-2"
          >
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
              Your Habits Dashboard
            </h1>
            <p className="text-muted-foreground mt-2">
              Track your progress and build lasting habits
            </p>
          </motion.div>
          <motion.div
            variants={itemVariants}
            className="col-span-full lg:col-span-2 flex justify-end gap-2"
          >
            <Button
              onClick={() => setIsNewHabitOpen(true)}
              className="rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:opacity-90 transition-opacity duration-200"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Habit
            </Button>
            <SettingsDialog />
          </motion.div>
        </div>

        {/* Quick Stats */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
          variants={containerVariants}
        >
          <QuickStatCard
            title="Active Habits"
            value={habits.filter((h) => !h.isArchived).length}
            icon={Target}
            color="from-purple-500 to-pink-500"
          />
          <QuickStatCard
            title="Total Completions"
            value={habits.reduce(
              (acc, habit) => acc + habit.completedDates.length,
              0
            )}
            icon={Calendar}
            color="from-blue-500 to-cyan-500"
          />
          <QuickStatCard
            title="Best Streak"
            value={Math.max(...habits.map((habit) => habit.streak || 0))}
            suffix="days"
            icon={Award}
            color="from-green-500 to-emerald-500"
          />
          <QuickStatCard
            title="Completion Rate"
            value={Math.round(
              habits.reduce((acc, habit) => acc + calculateProgress(habit), 0) /
                Math.max(habits.length, 1)
            )}
            suffix="%"
            icon={Activity}
            color="from-yellow-500 to-orange-500"
          />
        </motion.div>

        {/* Premium Promotion */}
        {!isPro && (
          <motion.div
            variants={itemVariants}
            className="rounded-xl p-6 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-blue-500/10 border border-purple-500/20 backdrop-blur-sm"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                  <Sparkles className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    Unlock Premium Features
                  </h3>
                  <p className="text-muted-foreground">
                    Get detailed analytics, unlimited habits, and more
                  </p>
                </div>
              </div>
              <Button
                variant="premium"
                onClick={() => router.push("/profile/billing")}
                className="rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:opacity-90 transition-opacity duration-200"
              >
                Upgrade Now
              </Button>
            </div>
          </motion.div>
        )}

        {/* Habits Grid */}
        <motion.div variants={containerVariants} className="grid gap-6">
          <ScrollArea className="h-[600px] pr-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {sortedHabits.map((habit) => (
                <motion.div
                  key={habit.id}
                  variants={itemVariants}
                  className="group"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="relative rounded-xl border bg-card/50 backdrop-blur-sm text-card-foreground shadow-sm transition-all duration-200 hover:shadow-lg overflow-hidden">
                    {/* Gradient Background */}
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${
                        habit.color || colors[0]
                      } opacity-5`}
                    />

                    {/* Card Content */}
                    <div className="p-6 relative">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-12 h-12 rounded-xl bg-gradient-to-br ${
                              habit.color || colors[0]
                            } flex items-center justify-center text-white text-xl shadow-lg ring-1 ring-white/10`}
                          >
                            {habit.emoji || "✨"}
                          </div>
                          <div>
                            <h3 className="font-semibold text-lg">
                              {habit.name}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              {habit.frequency || "daily"}
                            </p>
                          </div>
                        </div>
                        <HabitMenu
                          habit={habit}
                          onEdit={handleEdit}
                          onArchive={handleArchive}
                          onDelete={handleDelete}
                        />
                      </div>

                      {/* Progress Section */}
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">
                            Progress
                          </span>
                          <span className="font-medium">
                            {calculateProgress(habit)}%
                          </span>
                        </div>
                        <Progress
                          value={calculateProgress(habit)}
                          className="h-2"
                          indicatorClassName={`bg-gradient-to-r ${
                            habit.color || colors[0]
                          }`}
                        />
                      </div>

                      {/* Stats */}
                      <div className="mt-4 pt-4 border-t border-border/50 grid grid-cols-2 gap-4">
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                            <Award className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">
                              Streak
                            </p>
                            <p className="font-semibold">
                              {habit.streak || 0}🔥
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                            <Calendar className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">
                              Completed
                            </p>
                            <p className="font-semibold">
                              {habit.completedDates.length}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </ScrollArea>
        </motion.div>
      </div>

      {/* Dialogs */}
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

function QuickStatCard({
  title,
  value,
  icon: Icon,
  color,
  suffix,
}: {
  title: string;
  value: number;
  icon: React.ElementType;
  color: string;
  suffix?: string;
}) {
  return (
    <motion.div
      variants={itemVariants}
      className="bg-white/40 dark:bg-gray-900/40 rounded-2xl shadow-xl border border-gray-200/30 dark:border-gray-800/30 overflow-hidden backdrop-blur-xl p-6"
    >
      <div className="flex items-center gap-4">
        <div
          className={`h-12 w-12 rounded-xl bg-gradient-to-r ${color} flex items-center justify-center text-white shadow-lg ring-1 ring-white/10`}
        >
          <Icon className="h-6 w-6" />
        </div>
        <div>
          <h3 className="text-lg font-semibold">{title}</h3>
          <p className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            {value}
            {suffix}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

function HabitMenu({
  habit,
  onEdit,
  onArchive,
  onDelete,
}: {
  habit: Habit;
  onEdit: (habit: Habit) => void;
  onArchive: (habit: Habit) => void;
  onDelete: (habit: Habit) => void;
}) {
  return (
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
        <DropdownMenuItem onClick={() => onEdit(habit)} className="gap-2 py-3">
          <Edit2 className="w-4 h-4" /> Edit
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => onDelete(habit)}
          className="gap-2 py-3 text-red-600 dark:text-red-400"
        >
          <Trash2 className="w-4 h-4" /> Delete
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => onArchive(habit)}
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
            onValueChange={(value: "daily" | "weekly" | "monthly") =>
              changeHabitFrequency(habit.id, value)
            }
          >
            <SelectTrigger className="border-0 p-0 h-auto">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="daily">Daily</SelectItem>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
            </SelectContent>
          </Select>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
