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
  addHabit: (habit: Habit) => void;
  removeHabit: (habitId: string) => void;
  updateHabit: (habitId: string, updates: Partial<Habit>) => void;
  toggleHabitCompletion: (habitId: string, targetDate: Date) => void;
  adjustDates: (days: number) => void;
  calculateProgress: (habit: Habit) => number;
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
    }),
    {
      name: "habit-storage",
      // You can add storage configuration options here
    }
  )
);

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
