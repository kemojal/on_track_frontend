import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Habit {
  id: string;
  name: string;
  completedDates: string[];
  pomodoroSessions: number;
  color?: string;
  streak?: number;
  emoji?: string;
  
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

  // Actions
  setHabits: (habits: Habit[]) => void;
  setIsNewHabitOpen: (isOpen: boolean) => void;
  setNewHabitName: (name: string) => void;
  setStartDate: (date: Date) => void;
  setIsSidebarOpen: (isOpen: boolean) => void;
  setActiveTab: (tab: string) => void;
  setSelectedHabit: (habit: Habit | null) => void;

  // Business Logic
  addHabit: (name: string) => void;
  toggleHabitCompletion: (habitId: string, date: Date) => void;
  adjustDates: (days: number) => void;
  calculateProgress: (habit: Habit) => number;
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

      // Basic setters
      setHabits: (habits) => set({ habits }),
      setIsNewHabitOpen: (isOpen) => set({ isNewHabitOpen: isOpen }),
      setNewHabitName: (name) => set({ newHabitName: name }),
      setStartDate: (date) => set({ startDate: date }),
      setIsSidebarOpen: (isOpen) => set({ isSidebarOpen: isOpen }),
      setActiveTab: (tab) => set({ activeTab: tab }),
      setSelectedHabit: (habit) => set({ selectedHabit: habit }),

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

      toggleHabitCompletion: (habitId, date) => {
        const { habits } = get();
        const updatedHabits = habits.map((habit) => {
          if (habit.id === habitId) {
            const dateStr = date.toISOString().split("T")[0];
            const completedDates = habit.completedDates.includes(dateStr)
              ? habit.completedDates.filter((d) => d !== dateStr)
              : [...habit.completedDates, dateStr];
            return { ...habit, completedDates };
          }
          return habit;
        });
        set({ habits: updatedHabits });
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
