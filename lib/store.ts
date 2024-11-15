import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Habit {
  id: string;
  name: string;
  completedDates: string[];
  pomodoroSessions: number;
  color?: string;
  streak?: number;
  bestStreak?: number;
  emoji?: string;
  frequency?: "daily" | "weekly" | "monthly";
  isArchived?: boolean;

  // New fields
  timeOfDay?: "morning" | "afternoon" | "evening" | "anytime";
  startDate?: string;
  endDate?: string;
  reminder?: {
    enabled: boolean;
    time?: string; // HH:mm format
    days?: number[]; // 0-6 for Sunday-Saturday
  };
  repeat?: {
    type: "daily" | "weekly" | "monthly";
    interval: number; // e.g., every 2 days, every 3 weeks
    selectedDays?: number[]; // For weekly: [1,3,5] for Mon,Wed,Fri
    selectedDates?: number[]; // For monthly: [1,15] for 1st and 15th
  };
  priority?: "low" | "medium" | "high";
  notes?: string;
  tags?: string[];
}

interface HabitStore {
  isPro: boolean;
  setIsPro: (isPro: boolean) => void;
  habits: Habit[];
  streakHistory?: number[];
  bestStreak?: number;
  weeklyAverages?: number[];
  isNewHabitOpen: boolean;
  newHabitName: string;
  startDate: Date;
  isSidebarOpen: boolean;
  activeTab: string;
  selectedHabit: Habit | null;
  timezone: string;
  weekStartsOn: 0 | 1 | 2 | 3 | 4 | 5 | 6; // 0 = Sunday, 1 = Monday, etc.
  setTimezone: (timezone: string) => void;
  setWeekStartsOn: (day: 0 | 1 | 2 | 3 | 4 | 5 | 6) => void;

  // Actions
  setHabits: (habits: Habit[]) => void;
  setIsNewHabitOpen: (isOpen: boolean) => void;
  setNewHabitName: (name: string) => void;
  setStartDate: (date: Date) => void;
  setIsSidebarOpen: (isOpen: boolean) => void;
  setActiveTab: (tab: string) => void;
  setSelectedHabit: (habit: Habit | null) => void;
  editHabit: (habitId: string, updates: Partial<Habit>) => void;
  deleteHabit: (habitId: string) => void;
  archiveHabit: (habitId: string) => void;
  changeHabitFrequency: (
    habitId: string,
    frequency: "daily" | "weekly" | "monthly"
  ) => void;

  // Business Logic
  addHabit: (name: string) => void;
  toggleHabitCompletion: (habitId: string, targetDate: Date) => void;
  adjustDates: (days: number) => void;
  calculateProgress: (habit: Habit) => number;
  // editHabit: (habitId: string, updates: Partial<Habit>) => void;
  // deleteHabit: (habitId: string) => void;
  // archiveHabit: (habitId: string) => void;
  // changeHabitFrequency: (
  //   habitId: string,
  //   frequency: "daily" | "weekly" | "monthly"
  // ) => void;
}

const colors = [
  "from-purple-500 to-pink-500",
  "from-blue-500 to-cyan-500",
  "from-green-500 to-emerald-500",
  "from-yellow-500 to-orange-500",
];

const emojis = ["✨", "🌟", "💫", "⭐️", "🎯", "🎨", "📚", "💪", "🧘‍♀️", "🏃‍♀️"];

export const useHabitStore = create<HabitStore>()(
  persist(
    (set, get) => ({
      isPro: false,
      setIsPro: (isPro) => set({ isPro }),
      habits: [],
      streakHistory: [],
      bestStreak: 0,
      weeklyAverages: [],
      isNewHabitOpen: false,
      newHabitName: "",
      startDate: (() => {
        const date = new Date();
        date.setDate(date.getDate() - 7);
        return date;
      })(),
      isSidebarOpen: true,
      activeTab: "habits",
      selectedHabit: null,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      weekStartsOn: 1, // Default to Monday
      setTimezone: (timezone) => set({ timezone }),
      setWeekStartsOn: (day) => set({ weekStartsOn: day }),

      // Basic setters
      setHabits: (habits) => set({ habits }),
      setIsNewHabitOpen: (isOpen) => set({ isNewHabitOpen: isOpen }),
      setNewHabitName: (name) => set({ newHabitName: name }),
      setStartDate: (date) => set({ startDate: date }),
      setIsSidebarOpen: (isOpen) => set({ isSidebarOpen: isOpen }),
      setActiveTab: (tab) => set({ activeTab: tab }),
      setSelectedHabit: (habit) => set({ selectedHabit: habit }),
      editHabit: (habitId, updates) => {
        const { habits } = get();
        const updatedHabits = habits.map((habit) =>
          habit.id === habitId ? { ...habit, ...updates } : habit
        );
        set({ habits: updatedHabits });
      },
      deleteHabit: (habitId) => {
        const { habits } = get();
        const filteredHabits = habits.filter((habit) => habit.id !== habitId);
        set({ habits: filteredHabits });
      },
      archiveHabit: (habitId) => {
        const { habits } = get();
        const updatedHabits = habits.map((habit) =>
          habit.id === habitId
            ? { ...habit, isArchived: !habit.isArchived }
            : habit
        );
        set({ habits: updatedHabits });
      },
      changeHabitFrequency: (habitId, frequency) => {
        const { habits } = get();
        const updatedHabits = habits.map((habit) =>
          habit.id === habitId ? { ...habit, frequency } : habit
        );
        set({ habits: updatedHabits });
      },

      // Business Logic
      addHabit: (name) => {
        const { habits } = get();
        if (name.trim()) {
          const newHabit = {
            id: Math.random().toString(36).substr(2, 9),
            name: name.trim(),
            completedDates: [],
            pomodoroSessions: 0,
            color: colors[Math.floor(Math.random() * colors.length)],
            emoji: emojis[Math.floor(Math.random() * emojis.length)],
            streak: 0,
          };
          set({
            habits: [...habits, newHabit],
            newHabitName: "",
            isNewHabitOpen: false,
          });
        }
      },

      toggleHabitCompletion: (habitId, targetDate) => {
        const { habits } = get();
        const updatedHabits = habits.map((habit) => {
          if (habit.id === habitId) {
            const dateStr = targetDate.toISOString().split("T")[0];
            const isCompleting = !habit.completedDates.includes(dateStr);
            const completedDates = isCompleting
              ? [...habit.completedDates, dateStr].sort()
              : habit.completedDates.filter((d) => d !== dateStr);

            // Calculate streak
            let currentStreak = 0;
            let checkDate = new Date();
            let streakBroken = false;

            // Check up to 100 days back
            for (let i = 0; i < 100; i++) {
              const checkDateStr = checkDate.toISOString().split("T")[0];
              const isCompleted = completedDates.includes(checkDateStr);

              // For days in the future or today, just check if completed
              if (i === 0) {
                if (isCompleted) currentStreak++;
              }
              // For past days
              else {
                // If the habit is completed for this day
                if (isCompleted) {
                  if (!streakBroken) currentStreak++;
                }
                // If not completed and it's a required day based on frequency
                else {
                  const dayOfWeek = checkDate.getDay();
                  const isRequiredDay =
                    habit.frequency === "weekly"
                      ? dayOfWeek === 1 // Monday
                      : habit.frequency === "monthly"
                      ? checkDate.getDate() === 1 // First day of month
                      : true; // Daily

                  if (isRequiredDay) {
                    streakBroken = true;
                  } else if (!streakBroken) {
                    currentStreak++;
                  }
                }
              }

              // Move to previous day
              checkDate.setDate(checkDate.getDate() - 1);
            }

            // Update best streak if current streak is higher
            const bestStreak = Math.max(habit.bestStreak || 0, currentStreak);

            return {
              ...habit,
              completedDates,
              streak: currentStreak,
              bestStreak,
            };
          }
          return habit;
        });

        set({ habits: updatedHabits });

        // Update global streak stats
        const totalStreak = updatedHabits.reduce(
          (sum, habit) => sum + (habit.streak || 0),
          0
        );
        const averageStreak = totalStreak / updatedHabits.length;
        const streakHistory = [
          ...(get().streakHistory || []),
          averageStreak,
        ].slice(-30); // Keep last 30 days
        const bestStreak = Math.max(
          ...updatedHabits.map((h) => h.bestStreak || 0)
        );

        set({
          streakHistory,
          bestStreak,
        });
      },

      adjustDates: (days) => {
        const { startDate } = get();
        const newDate = new Date(startDate);
        newDate.setDate(newDate.getDate() + days);
        set({ startDate: newDate });
      },

      calculateProgress: (habit) => {
        const today = new Date().toISOString().split("T")[0];
        return habit.completedDates.includes(today) ? 100 : 0;
      },
    }),
    {
      name: "habit-storage",
      // You can add storage configuration options here
    }
  )
);
