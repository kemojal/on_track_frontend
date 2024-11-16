import { Button } from "./ui/button";
import { useHabitStore } from "@/lib/store";
import { useState, useEffect } from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { format, startOfWeek, addDays, isToday } from "date-fns";
import { useTimeTrackingStore } from "@/lib/store";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Timer,
  Sparkles,
  Trophy,
  Clock,
  Target,
  BarChart3,
  Activity,
  Settings2,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
  Cell,
} from "recharts";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./ui/tabs";

// Format time helper function

const CompletionAnimation = ({
  onComplete,
  color,
}: {
  onComplete: () => void;
  color: string;
}) => {
  useEffect(() => {
    const timer = setTimeout(onComplete, 4000); // Animation duration
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 flex items-center justify-center z-50 bg-black/50 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{
          scale: [0.5, 1.2, 1],
          opacity: 1,
        }}
        transition={{
          duration: 0.8,
          ease: "easeOut",
        }}
        className="relative"
      >
        <motion.div
          animate={{
            rotate: 360,
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 2,
            ease: "easeInOut",
            times: [0, 0.5, 1],
            repeat: Infinity,
          }}
          style={{ color }}
          className="text-8xl"
        >
          <Trophy className="w-24 h-24" />
        </motion.div>

        {/* Particle effects */}
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={`particle-${i}`}
            initial={{ scale: 0 }}
            animate={{
              scale: [0, 1, 0],
              x: [0, Math.cos(i * 30) * 100],
              y: [0, Math.sin(i * 30) * 100],
            }}
            transition={{
              duration: 2,
              ease: "easeOut",
              delay: 0.2,
            }}
            className="absolute top-1/2 left-1/2 w-3 h-3 rounded-full"
            style={{
              backgroundColor: color,
              boxShadow: `0 0 20px ${color}`,
            }}
          />
        ))}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="absolute top-full left-1/2 transform -translate-x-1/2 mt-8 text-center"
        >
          <h2 className="text-2xl font-bold mb-2 text-white">
            Session Complete!
          </h2>
          <p className="text-gray-200">Great work on staying focused!</p>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

const StatsSection = ({ selectedHabit }: { selectedHabit: Habit | null }) => {
  if (!selectedHabit) return null;

  const { getTimeProgress, getHourlyProgress } = useHabitStore();
  const hourlyData = getHourlyProgress(selectedHabit.id);

  // Get last 7 days progress
  const weeklyData = Array.from({ length: 7 }, (_, i) => {
    const date = addDays(new Date(), -6 + i);
    const progress = getTimeProgress(selectedHabit.id, "daily");
    return {
      date: format(date, "EEE"),
      minutes: progress.current,
      isToday: isToday(date),
    };
  });

  return (
    <div className="space-y-6 px-6">
      {/* Daily Progress Card */}
      <div className="bg-black/5 dark:bg-white/5 rounded-xl p-4 backdrop-blur-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-primary" />
            <h3 className="text-sm font-medium">Daily Progress</h3>
          </div>
          <div className="text-xs text-muted-foreground">
            {format(new Date(), "MMM d, yyyy")}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <div className="text-2xl font-semibold">
              {Math.floor(weeklyData[6].minutes / 60)}h{" "}
              {weeklyData[6].minutes % 60}m
            </div>
            <div className="text-xs text-muted-foreground">
              Time tracked today
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-2xl font-semibold text-emerald-500">
              {hourlyData.reduce((sum, p) => sum + (p > 0 ? 1 : 0), 0)}
            </div>
            <div className="text-xs text-muted-foreground">Active hours</div>
          </div>
        </div>
      </div>

      {/* Weekly Progress Chart */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-primary" />
            <h3 className="text-sm font-medium">Weekly Progress</h3>
          </div>
          <div className="text-xs text-muted-foreground">Last 7 days</div>
        </div>

        <div className="h-48 bg-black/5 dark:bg-white/5 rounded-xl p-4 backdrop-blur-sm w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={weeklyData}
              margin={{ top: 5, right: 5, bottom: 5, left: 5 }}
            >
              <XAxis
                dataKey="date"
                tick={{ fontSize: 12 }}
                stroke="hsl(var(--muted-foreground))"
              />
              <YAxis
                tick={{ fontSize: 12 }}
                stroke="hsl(var(--muted-foreground))"
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--background))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "6px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                }}
                cursor={{ fill: "hsl(var(--muted))", opacity: 0.1 }}
              />
              <Bar
                dataKey="minutes"
                fill={selectedHabit?.color || "hsl(var(--primary))"}
                radius={[4, 4, 0, 0]}
              >
                {weeklyData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={
                      entry.isToday
                        ? selectedHabit?.color || "hsl(var(--primary))"
                        : "hsl(var(--primary)/0.6)"
                    }
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Hourly Distribution */}
      <div className="space-y-4">
        <div className="flex items-center justify-between ">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-primary" />
            <h3 className="text-sm font-medium">Hourly Distribution</h3>
          </div>
        </div>

        <div className="h-48 bg-black/5 dark:bg-white/5 rounded-xl p-4 backdrop-blur-sm w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={hourlyData}
              margin={{ top: 5, right: 5, bottom: 5, left: 5 }}
            >
              <defs>
                <linearGradient id="colorProgress" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor={selectedHabit?.color || "hsl(var(--primary))"}
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor={selectedHabit?.color || "hsl(var(--primary))"}
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="hour"
                tick={{ fontSize: 12 }}
                stroke="hsl(var(--muted-foreground))"
              />
              <YAxis
                tick={{ fontSize: 12 }}
                stroke="hsl(var(--muted-foreground))"
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--background))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "6px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                }}
              />
              <Area
                type="monotone"
                dataKey="minutes"
                stroke={selectedHabit?.color || "hsl(var(--primary))"}
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorProgress)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

const TimeTrackingCard = () => {
  const {
    isTracking,
    elapsed,
    selectedHabit,
    showTimeTrackingSheet,
    startTimeTracking,
    stopTimeTracking,
    updateElapsed,
    setShowTimeTrackingSheet,
    setSelectedHabit,
  } = useTimeTrackingStore();
  const { habits, getHourlyProgress, updatePomodoroSettings, getTimeProgress } =
    useHabitStore();
  const [trackingMode, setTrackingMode] = useState<"regular" | "pomodoro">(
    "regular"
  );
  const [showSettingsDialog, setShowSettingsDialog] = useState(false);
  const [pomodoroSettings, setPomodoroSettings] = useState({
    workDuration: 25,
    breakDuration: 5,
    longBreakDuration: 15,
    sessionsUntilLongBreak: 4,
  });

  const [showCompletionAnimation, setShowCompletionAnimation] = useState(false);
  // Handle session completion
  const handleSessionComplete = () => {
    stopTimeTracking();
    setShowCompletionAnimation(true);
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTracking) {
      interval = setInterval(() => {
        const newElapsed = elapsed + 1;
        if (newElapsed >= pomodoroSettings.workDuration * 60) {
          handleSessionComplete();
        } else {
          updateElapsed(newElapsed);
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTracking, elapsed, pomodoroSettings.workDuration]);

  // Calculate weekly data
  const weeklyData = Array.from({ length: 7 }, (_, i) => {
    const date = addDays(new Date(), -6 + i);
    const progress = selectedHabit
      ? getTimeProgress(selectedHabit.id, "daily")
      : { current: 0, target: 0 };
    return {
      date: format(date, "EEE"),
      minutes: progress.current,
      isToday: isToday(date),
    };
  });

  // Get hourly progress data
  const hourlyProgress = selectedHabit
    ? getHourlyProgress(selectedHabit.id)
    : [];

  useEffect(() => {
    if (habits.length > 0 && !selectedHabit) {
      setSelectedHabit(habits[0]);
    }
  }, [habits, selectedHabit, setSelectedHabit]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTracking) {
      interval = setInterval(() => {
        updateElapsed(elapsed + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTracking, elapsed, updateElapsed]);

  // Add weekly progress tracking
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const startOfCurrentWeek = startOfWeek(new Date());
    return addDays(startOfCurrentWeek, i);
  });

  const weeklyHourlyProgress = weekDays.map((day) => {
    if (!selectedHabit) return Array(24).fill(0);
    const sessions = useHabitStore
      .getState()
      .getDailySessions(selectedHabit.id);
    const dayProgress = Array(24).fill(0);

    sessions.forEach((session) => {
      const sessionDate = new Date(session.startTime);
      if (sessionDate.toDateString() === day.toDateString()) {
        const hour = sessionDate.getHours();
        const duration = session.duration / 3600; // Convert to hours
        dayProgress[hour] = Math.min(1, (dayProgress[hour] || 0) + duration);
      }
    });

    return dayProgress;
  });

  const isCurrentDay = (date: Date) => {
    return date.toDateString() === new Date().toDateString();
  };

  const handleHabitSelect = (habitId: string) => {
    const habit = habits.find((h) => h.id === habitId);
    if (habit) {
      setSelectedHabit(habit);
    }
  };

  return (
    <AnimatePresence>
      {showCompletionAnimation && (
        <CompletionAnimation
          color={selectedHabit?.color || "#10B981"}
          onComplete={() => setShowCompletionAnimation(false)}
        />
      )}
      <Sheet
        open={showTimeTrackingSheet}
        onOpenChange={setShowTimeTrackingSheet}
      >
        <SheetContent
          side="right"
          className="w-full sm:w-[540px] max-h-[calc(100vh-2rem)] overflow-y-auto  p-0 py-8  rounded-xl m-4"
        >
          <SheetHeader className="px-6 py-4 border-b">
            <SheetTitle className="flex items-center gap-3 text-xl">
              <div className="p-2 rounded-xl bg-primary/10">
                <Timer className="w-5 h-5 text-primary" />
              </div>
              Time Tracking
              <div className="ml-auto flex items-center gap-2">
                <div className="px-3 py-1 text-xs font-semibold text-white bg-gradient-to-r from-amber-500 to-yellow-500 rounded-full shadow-sm">
                  <span className="flex items-center gap-1">
                    <Sparkles className="h-3 w-3" />
                    Premium
                  </span>
                </div>
              </div>
            </SheetTitle>
          </SheetHeader>

          <div className="flex-1 p-2 space-y-8 overflow-y-auto">
            {/* Habit Selection */}
            <div className="flex items-center gap-4">
              <Select
                value={selectedHabit?.id || ""}
                onValueChange={handleHabitSelect}
              >
                <SelectTrigger className="w-[300px]">
                  <SelectValue placeholder="Select a habit to track" />
                </SelectTrigger>
                <SelectContent>
                  {habits.map((habit) => (
                    <SelectItem key={habit.id} value={habit.id}>
                      <div className="flex items-center gap-2">
                        <div
                          className="w-2 h-6 rounded-full"
                          style={{ backgroundColor: habit.color }}
                        />
                        {habit.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="ml-auto flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowSettingsDialog(true)}
                  className="hover:bg-primary/10 transition-colors"
                >
                  <Settings2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Main Content */}
            <Tabs defaultValue="timer" className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-4">
                <TabsTrigger value="timer">
                  <Timer className="w-4 h-4 mr-2" />
                  Timer
                </TabsTrigger>
                <TabsTrigger value="weekly">
                  <Activity className="w-4 h-4 mr-2" />
                  Weekly
                </TabsTrigger>
                <TabsTrigger value="stats">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Stats
                </TabsTrigger>
              </TabsList>

              <TabsContent value="timer" className="space-y-6 px-6">
                {/* Timer Section */}
                <div className="flex flex-col items-center gap-4">
                  <div className="w-48 h-48 relative">
                    <CircularProgressbar
                      value={elapsed}
                      maxValue={pomodoroSettings.workDuration * 60}
                      text={`${Math.floor(elapsed / 60)}:${(elapsed % 60)
                        .toString()
                        .padStart(2, "0")}`}
                      styles={buildStyles({
                        pathColor:
                          selectedHabit?.color || "hsl(var(--primary))",
                        textColor: "hsl(var(--foreground))",
                        trailColor: "hsl(var(--muted))",
                        pathTransitionDuration: 0.5,
                      })}
                    />
                  </div>

                  <div className="flex gap-2">
                    {!isTracking ? (
                      <Button
                        onClick={startTimeTracking}
                        disabled={!selectedHabit}
                        className="bg-emerald-500 hover:bg-emerald-600 px-8"
                      >
                        Start
                      </Button>
                    ) : (
                      <Button
                        onClick={stopTimeTracking}
                        className="bg-red-500 hover:bg-red-600 px-8"
                      >
                        Stop
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      onClick={() => setShowSettingsDialog(true)}
                      className="hover:bg-primary/5"
                    >
                      <Settings2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Today's Activity Section */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Activity className="w-4 h-4 text-primary" />
                      <h3 className="text-sm font-medium">Today's Activity</h3>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {hourlyProgress.reduce(
                        (sum, p) => sum + (p > 0 ? 1 : 0),
                        0
                      )}{" "}
                      hrs active
                    </div>
                  </div>

                  {/* Today's Hourly Bars */}
                  <div className="relative bg-black/5 dark:bg-white/5 rounded-xl p-4 backdrop-blur-sm">
                    <div className="absolute inset-0 grid grid-cols-24 gap-px pointer-events-none opacity-5">
                      {Array(24)
                        .fill(0)
                        .map((_, i) => (
                          <div
                            key={i}
                            className="border-r border-primary/20 last:border-r-0"
                          />
                        ))}
                    </div>

                    <div className="grid grid-cols-24 gap-px h-12">
                      {hourlyProgress.map((progress, hour) => (
                        <div key={hour} className="group relative">
                          <div
                            className={cn(
                              "absolute bottom-0 w-full rounded-sm transition-all duration-300",
                              progress > 0
                                ? "bg-primary"
                                : "bg-black/10 dark:bg-white/10"
                            )}
                            style={{
                              height:
                                progress > 0 ? `${progress * 100}%` : "15%",
                              backgroundColor:
                                progress > 0
                                  ? selectedHabit?.color || "var(--primary)"
                                  : undefined,
                            }}
                          />
                          <div className="opacity-0 group-hover:opacity-100 absolute -top-6 left-1/2 -translate-x-1/2 bg-background border px-2 py-1 rounded text-[10px] whitespace-nowrap z-10">
                            {hour}:00 - {(hour + 1) % 24}:00
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Time Labels */}
                    <div className="grid grid-cols-8 mt-2">
                      {[0, 3, 6, 9, 12, 15, 18, 21].map((hour) => (
                        <div
                          key={hour}
                          className="text-[10px] text-muted-foreground"
                        >
                          {hour}:00
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Distribution Chart */}
                  <div className="mt-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <Target className="w-4 h-4 text-primary" />
                        <h3 className="text-sm font-medium">
                          Time Distribution
                        </h3>
                      </div>
                    </div>
                    <div className="h-32">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart
                          data={hourlyProgress}
                          margin={{ top: 5, right: 5, bottom: 5, left: 5 }}
                        >
                          <defs>
                            <linearGradient
                              id="colorProgress"
                              x1="0"
                              y1="0"
                              x2="0"
                              y2="1"
                            >
                              <stop
                                offset="5%"
                                stopColor={
                                  selectedHabit?.color || "hsl(var(--primary))"
                                }
                                stopOpacity={0.8}
                              />
                              <stop
                                offset="95%"
                                stopColor={
                                  selectedHabit?.color || "hsl(var(--primary))"
                                }
                                stopOpacity={0}
                              />
                            </linearGradient>
                          </defs>
                          <XAxis
                            dataKey="hour"
                            tick={{ fontSize: 12 }}
                            stroke="hsl(var(--muted-foreground))"
                          />
                          <YAxis
                            tick={{ fontSize: 12 }}
                            stroke="hsl(var(--muted-foreground))"
                          />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "hsl(var(--background))",
                              border: "1px solid hsl(var(--border))",
                              borderRadius: "6px",
                              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                            }}
                          />
                          <Area
                            type="monotone"
                            dataKey="minutes"
                            stroke={
                              selectedHabit?.color || "hsl(var(--primary))"
                            }
                            strokeWidth={2}
                            fillOpacity={1}
                            fill="url(#colorProgress)"
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="weekly" className="space-y-4 ">
                {/* Weekly Progress Overview */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <BarChart3 className="w-4 h-4 text-primary" />
                      <h3 className="text-sm font-medium">Weekly Overview</h3>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {format(weekDays[0], "MMM d")} -{" "}
                      {format(weekDays[6], "MMM d")}
                    </div>
                  </div>

                  {/* Weekly Hourly Progress */}
                  <div className="space-y-3 rounded-xl bg-black/5 dark:bg-white/5 p-4 backdrop-blur-sm w-full">
                    {weekDays.map((day, dayIndex) => (
                      <div
                        key={day.toISOString()}
                        className={cn(
                          "space-y-2",
                          isCurrentDay(day) &&
                            "bg-gradient-to-r from-primary/10 to-transparent rounded-lg p-3 -mx-2"
                        )}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span
                              className={cn(
                                "text-sm font-medium",
                                isCurrentDay(day) && "text-primary"
                              )}
                            >
                              {format(day, "EEE")}
                            </span>
                            {isCurrentDay(day) && (
                              <span className="text-[10px] font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                                Today
                              </span>
                            )}
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {weeklyHourlyProgress[dayIndex].reduce(
                              (sum, p) => sum + (p > 0 ? 1 : 0),
                              0
                            )}{" "}
                            hrs active
                          </span>
                        </div>

                        <div className="relative">
                          <div className="absolute inset-0 grid grid-cols-24 gap-px pointer-events-none opacity-5">
                            {Array(24)
                              .fill(0)
                              .map((_, i) => (
                                <div
                                  key={i}
                                  className="border-r border-primary/20 last:border-r-0"
                                />
                              ))}
                          </div>

                          <div className="grid grid-cols-24 gap-px h-8">
                            {weeklyHourlyProgress[dayIndex].map(
                              (progress, hour) => (
                                <div key={hour} className="group relative">
                                  <div
                                    className={cn(
                                      "absolute bottom-0 w-full rounded-sm transition-all duration-300",
                                      progress > 0
                                        ? "bg-primary"
                                        : "bg-black/10 dark:bg-white/10",
                                      isCurrentDay(day)
                                        ? "opacity-100"
                                        : "opacity-60"
                                    )}
                                    style={{
                                      height:
                                        progress > 0
                                          ? `${progress * 100}%`
                                          : "15%",
                                      backgroundColor:
                                        progress > 0
                                          ? selectedHabit?.color ||
                                            "var(--primary)"
                                          : undefined,
                                    }}
                                  />
                                  <div className="opacity-0 group-hover:opacity-100 absolute -top-6 left-1/2 -translate-x-1/2 bg-background border px-2 py-1 rounded text-[10px] whitespace-nowrap z-10">
                                    {hour}:00 - {(hour + 1) % 24}:00
                                  </div>
                                </div>
                              )
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between text-xs text-muted-foreground mt-2">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-primary/60" />
                        <span>Active Hours</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-black/10 dark:bg-white/10" />
                        <span>Inactive</span>
                      </div>
                    </div>
                    <button className="hover:text-foreground transition-colors">
                      View detailed analytics →
                    </button>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="stats" className="space-y-4">
                <StatsSection selectedHabit={selectedHabit} />
              </TabsContent>
            </Tabs>

            {/* Settings Dialog */}
            <Dialog
              open={showSettingsDialog}
              onOpenChange={setShowSettingsDialog}
            >
              <DialogContent>
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <Settings2 className="w-5 h-5" />
                    Pomodoro Settings
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-6 py-4">
                  <div className="space-y-2">
                    <Label>Work Duration (minutes)</Label>
                    <Input
                      type="number"
                      value={pomodoroSettings.workDuration}
                      onChange={(e) =>
                        setPomodoroSettings((prev) => ({
                          ...prev,
                          workDuration: parseInt(e.target.value),
                        }))
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Break Duration (minutes)</Label>
                    <Input
                      type="number"
                      value={pomodoroSettings.breakDuration}
                      onChange={(e) =>
                        setPomodoroSettings((prev) => ({
                          ...prev,
                          breakDuration: parseInt(e.target.value),
                        }))
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Long Break Duration (minutes)</Label>
                    <Input
                      type="number"
                      value={pomodoroSettings.longBreakDuration}
                      onChange={(e) =>
                        setPomodoroSettings((prev) => ({
                          ...prev,
                          longBreakDuration: parseInt(e.target.value),
                        }))
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Sessions Until Long Break</Label>
                    <Input
                      type="number"
                      value={pomodoroSettings.sessionsUntilLongBreak}
                      onChange={(e) =>
                        setPomodoroSettings((prev) => ({
                          ...prev,
                          sessionsUntilLongBreak: parseInt(e.target.value),
                        }))
                      }
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    onClick={() => {
                      if (selectedHabit) {
                        updatePomodoroSettings(
                          selectedHabit.id,
                          pomodoroSettings
                        );
                      }
                      setShowSettingsDialog(false);
                    }}
                  >
                    Save Settings
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </SheetContent>
      </Sheet>
    </AnimatePresence>
  );
};

export { TimeTrackingCard };
