import { create } from "zustand";
import { persist } from "zustand/middleware";

interface Habit {
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

  // Time tracking fields
  timeTracking?: {
    totalTime: number; // Total time in minutes
    sessions: {
      date: string;
      duration: number; // Duration in minutes
      notes?: string;
      type?: 'pomodoro' | 'regular';
      completed?: boolean;
    }[];
    target?: {
      daily?: number; // Target minutes per day
      weekly?: number; // Target minutes per week
      monthly?: number; // Target minutes per month
    };
    pomodoroSettings?: {
      workDuration: number; // minutes
      breakDuration: number; // minutes
      longBreakDuration: number; // minutes
      sessionsUntilLongBreak: number;
    };
  };

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
  isPremium?: boolean;
}

interface TimeTracking {
  sessions: {
    id: string;
    date: string;
    duration: number;
    type: "regular" | "pomodoro";
    phase?: "work" | "break" | "longBreak";
    notes?: string;
    completed: boolean;
    targetMet: boolean;
  }[];
  currentSession?: {
    startTime: number;
    elapsedTime: number;
    type: "regular" | "pomodoro";
    phase?: "work" | "break" | "longBreak";
    pomodoroCount?: number;
    isActive: boolean;
    isPaused: boolean;
  };
  pomodoroSettings: {
    workDuration: number;
    breakDuration: number;
    longBreakDuration: number;
    sessionsUntilLongBreak: number;
    autoStartBreaks: boolean;
    autoStartPomodoros: boolean;
    soundEnabled: boolean;
    notificationsEnabled: boolean;
  };
  streakData: {
    currentStreak: number;
    longestStreak: number;
    lastTrackedDate?: string;
  };
  stats: {
    totalSessions: number;
    totalTimeSpent: number;
    completedPomodoros: number;
    averageSessionLength: number;
  };
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
  addHabit: (habit: Habit) => void;
  removeHabit: (habitId: string) => void;
  updateHabit: (habitId: string, updates: Partial<Habit>) => void;
  toggleHabitCompletion: (habitId: string, targetDate: Date) => void;
  adjustDates: (days: number) => void;
  calculateProgress: (habit: Habit) => number;

  // Time Tracking Actions
  startTimeTracking: (habitId: string, type?: 'pomodoro' | 'regular') => void;
  stopTimeTracking: (habitId: string, notes?: string) => void;
  updateTimeTarget: (
    habitId: string,
    target: {
      daily?: number;
      weekly?: number;
      monthly?: number;
    }
  ) => void;
  updatePomodoroSettings: (
    habitId: string,
    settings: {
      workDuration: number;
      breakDuration: number;
      longBreakDuration: number;
      sessionsUntilLongBreak: number;
    }
  ) => void;
  getTimeProgress: (
    habitId: string,
    period: "daily" | "weekly" | "monthly"
  ) => {
    current: number;
    target: number;
    percentage: number;
  };
  startSession: (habitId: string, type: "regular" | "pomodoro") => void;
  pauseSession: (habitId: string) => void;
  resumeSession: (habitId: string) => void;
  togglePremium: (habitId: string) => void;
}

const PRICING_PLANS = {
  monthly: {
    price: 9.99,
    name: "Monthly Pro",
    period: "month",
  },
  yearly: {
    price: 99.99,
    name: "Yearly Pro",
    period: "year",
    savings: "Save 17%",
  },
} as const;

interface PaymentHistoryItem {
  id: string;
  date: string;
  amount: string;
  status: "paid" | "pending" | "failed";
  invoice: string;
  planName: string;
  planType: "monthly" | "yearly";
}

interface BillingState {
  subscriptionDetails: {
    plan: string;
    status: string;
    nextBilling: string;
    amount: string;
    period: string;
  };
  paymentHistory: PaymentHistoryItem[];
  paymentMethod: {
    last4: string;
    expiryDate: string;
    type: string;
  };
  usageLimits: {
    habits: {
      used: number;
      total: number;
    };
    storage: {
      used: number;
      total: number;
    };
  };
  isYearly: boolean;
  setIsYearly: (yearly: boolean) => void;
  pricingPlans: typeof PRICING_PLANS;
  updatePaymentMethod: (method: {
    last4: string;
    expiryDate: string;
    type: string;
  }) => void;
  updateSubscription: (details: {
    plan: string;
    status: string;
    nextBilling: string;
    amount: string;
    period: string;
  }) => void;
  updateUsageLimits: (habitsCount: number) => void;
  addPaymentHistory: (payment: {
    planType: "monthly" | "yearly";
    status: string;
    type: "subscription" | "cancellation";
  }) => void;
  getInvoiceNumber: () => string;
  upgradeSubscription: () => void;
  cancelSubscription: () => void;
  isUpgradeDialogOpen: boolean;
  setIsUpgradeDialogOpen: (open: boolean) => void;
}

const colors = [
  "from-purple-500 to-pink-500",
  "from-blue-500 to-cyan-500",
  "from-green-500 to-emerald-500",
  "from-yellow-500 to-orange-500",
];

const emojis = ["✨", "🌟", "💫", "⭐️", "🎯", "🎨", "📚", "💪", "🧘‍♀️", "🏃‍♀️"];

const defaultPomodoroSettings: {
  workDuration: number;
  breakDuration: number;
  longBreakDuration: number;
  sessionsUntilLongBreak: number;
  autoStartBreaks: boolean;
  autoStartPomodoros: boolean;
  soundEnabled: boolean;
  notificationsEnabled: boolean;
} = {
  workDuration: 25 * 60,
  breakDuration: 5 * 60,
  longBreakDuration: 15 * 60,
  sessionsUntilLongBreak: 4,
  autoStartBreaks: false,
  autoStartPomodoros: false,
  soundEnabled: true,
  notificationsEnabled: true,
};

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

      // time tracking
      // Time Tracking Implementation
      startTimeTracking: (habitId: string, type?: 'pomodoro' | 'regular') => {
        const { habits } = get();
        const now = new Date().toISOString();

        set({
          habits: habits.map((habit) =>
            habit.id === habitId
              ? {
                  ...habit,
                  timeTracking: {
                    ...habit.timeTracking,
                    currentSession: {
                      startTime: now,
                      type,
                    },
                  },
                }
              : habit
          ),
        });
      },

      stopTimeTracking: (habitId: string, notes?: string) => {
        const { habits } = get();
        const now = new Date();
        
        set({
          habits: habits.map((habit) => {
            if (habit.id === habitId && habit.timeTracking?.currentSession) {
              const startTime = new Date(habit.timeTracking.currentSession.startTime);
              const duration = Math.round((now.getTime() - startTime.getTime()) / 60000); // Convert to minutes
              
              const newSession = {
                id: Math.random().toString(36).substring(2) + Date.now().toString(36),
                date: now.toISOString(),
                duration,
                notes,
                type: habit.timeTracking.currentSession.type,
                completed: true,
                targetMet: false, // Calculate based on target
              };

              return {
                ...habit,
                timeTracking: {
                  totalTime: (habit.timeTracking?.totalTime || 0) + duration,
                  sessions: [...(habit.timeTracking?.sessions || []), newSession],
                  target: habit.timeTracking?.target,
                },
              };
            }
            return habit;
          }),
        });
      },

      updateTimeTarget: (habitId: string, target) => {
        const { habits } = get();
        
        set({
          habits: habits.map((habit) =>
            habit.id === habitId
              ? {
                  ...habit,
                  timeTracking: {
                    ...habit.timeTracking,
                    target: {
                      ...habit.timeTracking?.target,
                      ...target,
                    },
                  },
                }
              : habit
          ),
        });
      },

      updatePomodoroSettings: (habitId, settings) => {
        const habits = get().habits;
        const habitIndex = habits.findIndex((h) => h.id === habitId);
        if (habitIndex === -1) return;

        const updatedHabits = [...habits];
        const habit = { ...updatedHabits[habitIndex] };
        
        if (!habit.timeTracking) {
          habit.timeTracking = {
            totalTime: 0,
            sessions: [],
          };
        }

        habit.timeTracking.pomodoroSettings = {
          ...defaultPomodoroSettings,
          ...habit.timeTracking.pomodoroSettings,
          ...settings,
        };
        updatedHabits[habitIndex] = habit;
        set({ habits: updatedHabits });
      },

      getTimeProgress: (habitId: string, period) => {
        const { habits } = get();
        const habit = habits.find((h) => h.id === habitId);
        if (!habit?.timeTracking) {
          return { current: 0, target: 0, percentage: 0 };
        }

        const now = new Date();
        const sessions = habit.timeTracking.sessions || [];
        let current = 0;
        let target = 0;

        switch (period) {
          case 'daily':
            current = sessions
              .filter((s) => new Date(s.date).toDateString() === now.toDateString())
              .reduce((sum, s) => sum + s.duration, 0);
            target = habit.timeTracking.target?.daily || 0;
            break;
          case 'weekly':
            const weekStart = new Date(now);
            weekStart.setDate(now.getDate() - now.getDay());
            current = sessions
              .filter((s) => new Date(s.date) >= weekStart)
              .reduce((sum, s) => sum + s.duration, 0);
            target = habit.timeTracking.target?.weekly || 0;
            break;
          case 'monthly':
            const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
            current = sessions
              .filter((s) => new Date(s.date) >= monthStart)
              .reduce((sum, s) => sum + s.duration, 0);
            target = habit.timeTracking.target?.monthly || 0;
            break;
        }

        return {
          current,
          target,
          percentage: target > 0 ? (current / target) * 100 : 0,
        };
      },
      // end tracking
      // Business Logic
      addHabit: (habit: Habit) =>
        set((state) => {
          const newHabits = [...(state.habits || []), habit];
          // Update billing store usage limits
          useBillingStore.getState().updateUsageLimits(newHabits.length);
          return { habits: newHabits };
        }),
      removeHabit: (habitId: string) =>
        set((state) => {
          const newHabits = state.habits?.filter((h) => h.id !== habitId) || [];
          // Update billing store usage limits
          useBillingStore.getState().updateUsageLimits(newHabits.length);
          return { habits: newHabits };
        }),
      updateHabit: (habitId: string, updates: Partial<Habit>) =>
        set((state) => ({
          habits:
            state.habits?.map((habit) =>
              habit.id === habitId ? { ...habit, ...updates } : habit
            ) || [],
        })),
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
      startSession: (habitId: string, type: "regular" | "pomodoro") => {
        const { habits } = get();
        const now = new Date().toISOString();

        set({
          habits: habits.map((habit) =>
            habit.id === habitId
              ? {
                  ...habit,
                  timeTracking: {
                    ...habit.timeTracking,
                    currentSession: {
                      startTime: now,
                      elapsedTime: 0,
                      type,
                      phase: type === "pomodoro" ? "work" : undefined,
                      pomodoroCount: type === "pomodoro" ? 0 : undefined,
                      isActive: true,
                      isPaused: false,
                    },
                  },
                }
              : habit
          ),
        });
      },

      pauseSession: (habitId: string) => {
        const { habits } = get();
        
        set({
          habits: habits.map((habit) =>
            habit.id === habitId && habit.timeTracking?.currentSession
              ? {
                  ...habit,
                  timeTracking: {
                    ...habit.timeTracking,
                    currentSession: {
                      ...habit.timeTracking.currentSession,
                      isPaused: true,
                    },
                  },
                }
              : habit
          ),
        });
      },

      resumeSession: (habitId: string) => {
        const { habits } = get();
        
        set({
          habits: habits.map((habit) =>
            habit.id === habitId && habit.timeTracking?.currentSession
              ? {
                  ...habit,
                  timeTracking: {
                    ...habit.timeTracking,
                    currentSession: {
                      ...habit.timeTracking.currentSession,
                      isPaused: false,
                    },
                  },
                }
              : habit
          ),
        });
      },

      togglePremium: (habitId: string) => {
        const { habits } = get();
        
        set({
          habits: habits.map((habit) =>
            habit.id === habitId
              ? {
                  ...habit,
                  isPremium: !habit.isPremium,
                }
              : habit
          ),
        });
      },
    }),
    {
      name: "habit-storage",
      // You can add storage configuration options here
    }
  )
);

function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

function calculateStats(sessions: {
  id: string;
  date: string;
  duration: number;
  type: "regular" | "pomodoro";
  phase?: "work" | "break" | "longBreak";
  notes?: string;
  completed: boolean;
  targetMet: boolean;
}[]): TimeTracking["stats"] {
  const totalSessions = sessions.length;
  const totalTimeSpent = sessions.reduce((acc, session) => acc + session.duration, 0);
  const completedPomodoros = sessions.filter(
    (s) => s.type === "pomodoro" && s.completed
  ).length;
  const averageSessionLength = totalSessions > 0 ? totalTimeSpent / totalSessions : 0;

  return {
    totalSessions,
    totalTimeSpent,
    completedPomodoros,
    averageSessionLength,
  };
}

function calculateStreak(sessions: {
  id: string;
  date: string;
  duration: number;
  type: "regular" | "pomodoro";
  phase?: "work" | "break" | "longBreak";
  notes?: string;
  completed: boolean;
  targetMet: boolean;
}[]): TimeTracking["streakData"] {
  if (sessions.length === 0) {
    return { currentStreak: 0, longestStreak: 0 };
  }

  const dates = sessions.map((s) => s.date.split("T")[0]);
  const uniqueDates = [...new Set(dates)].sort();
  let currentStreak = 0;
  let longestStreak = 0;
  let streak = 0;

  for (let i = 0; i < uniqueDates.length; i++) {
    const current = new Date(uniqueDates[i]);
    const prev = i > 0 ? new Date(uniqueDates[i - 1]) : current;
    const diffDays = Math.floor(
      (current.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (diffDays <= 1) {
      streak++;
      if (streak > longestStreak) {
        longestStreak = streak;
      }
    } else {
      streak = 1;
    }
  }

  currentStreak = streak;
  return {
    currentStreak,
    longestStreak,
    lastTrackedDate: uniqueDates[uniqueDates.length - 1],
  };
}

declare global {
  interface Window {
    openUpgradeDialog?: () => void;
  }
}

const getInitialHabitsCount = () => {
  const habitStore = useHabitStore.getState();
  return habitStore.habits?.length || 0;
};

export const useBillingStore = create<BillingState>()(
  persist(
    (set, get) => ({
      subscriptionDetails: {
        plan: "Pro",
        status: "active",
        nextBilling: "Dec 1, 2023",
        amount: "$9.99",
        period: "monthly",
      },
      paymentHistory: [],
      paymentMethod: {
        last4: "4242",
        expiryDate: "12/24",
        type: "visa",
      },

      usageLimits: {
        habits: {
          used: getInitialHabitsCount(),
          total: 6,
        },
        storage: {
          used: getInitialHabitsCount(), // Sync with number of habits
          total: 20,
        },
      },
      isYearly: false,
      setIsYearly: (yearly) => set({ isYearly: yearly }),
      pricingPlans: PRICING_PLANS,
      updatePaymentMethod: (method) => set({ paymentMethod: method }),
      updateSubscription: (details) => set({ subscriptionDetails: details }),
      updateUsageLimits: (habitsCount) =>
        set((state) => ({
          usageLimits: {
            habits: {
              used: habitsCount,
              total: state.usageLimits.habits.total,
            },
          },
        })),
      getInvoiceNumber: () => {
        const timestamp = Date.now();
        const random = Math.floor(Math.random() * 1000);
        return `INV-${timestamp}-${random}`;
      },
      addPaymentHistory: (payment) => {
        const { isYearly, pricingPlans } = get();
        const plan = isYearly ? pricingPlans.yearly : pricingPlans.monthly;

        const newPayment: PaymentHistoryItem = {
          id: crypto.randomUUID(),
          date: new Date().toISOString(),
          amount: `$${plan.price}`,
          status: payment.status === "cancelled" ? "failed" : "paid",
          invoice: get().getInvoiceNumber(),
          planName: plan.name,
          planType: payment.planType,
        };

        set((state) => ({
          paymentHistory: [newPayment, ...state.paymentHistory],
        }));
      },
      upgradeSubscription: () =>
        set((state) => {
          const planType = state.isYearly ? "yearly" : "monthly";
          const plan = state.pricingPlans[planType];

          return {
            subscriptionDetails: {
              ...state.subscriptionDetails,
              plan: "Pro",
              status: "active",
              amount: `$${plan.price.toFixed(2)}`,
              period: plan.period,
              nextBilling: new Date(
                new Date().setMonth(
                  new Date().getMonth() + (state.isYearly ? 12 : 1)
                )
              ).toLocaleDateString(),
            },
          };
        }),
      cancelSubscription: () =>
        set((state) => ({
          subscriptionDetails: {
            ...state.subscriptionDetails,
            status: "cancelled",
          },
        })),
      isUpgradeDialogOpen: false,
      setIsUpgradeDialogOpen: (open) => set({ isUpgradeDialogOpen: open }),
    }),
    {
      name: "billing-storage",
    }
  )
);

// Subscribe to habit store changes to update usage limits
useHabitStore.subscribe((state) => {
  const habitsCount = state.habits?.length || 0;
  useBillingStore.getState().updateUsageLimits(habitsCount);
});
