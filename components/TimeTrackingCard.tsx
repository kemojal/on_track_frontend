import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { useHabitStore } from "@/lib/store";
import { useState, useEffect } from "react";
import {
  Play,
  Square,
  Target,
  Clock,
  Award,
  TrendingUp,
  History,
  Settings2,
  Timer,
  Sparkles,
  BarChart3,
  ChevronRight,
  Pause,
  X,
} from "lucide-react";
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
import { SheetHeader, SheetTitle } from "./ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { format, startOfWeek, addDays } from "date-fns";

// Format time helper function
const formatTime = (seconds: number) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;
  return `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
};

export function TimeTrackingCard() {
  const {
    habits,
    startTimeTracking,
    stopTimeTracking,
    getTimeProgress,
    getHourlyProgress,
    updatePomodoroSettings,
  } = useHabitStore();
  const [selectedHabitId, setSelectedHabitId] = useState<string | null>(null);
  const [isTracking, setIsTracking] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);
  const [trackingMode, setTrackingMode] = useState<"regular" | "pomodoro">(
    "regular"
  );
  const [showStats, setShowStats] = useState(false);
  const [showSettingsDialog, setShowSettingsDialog] = useState(false);
  const [pomodoroSettings, setPomodoroSettings] = useState({
    workDuration: 25,
    breakDuration: 5,
    longBreakDuration: 15,
    sessionsUntilLongBreak: 4,
  });

  // Get hourly progress data
  const hourlyProgress = selectedHabitId
    ? getHourlyProgress(selectedHabitId)
    : [];

  const selectedHabit = habits.find((h) => h.id === selectedHabitId);
  const progress = selectedHabit
    ? {
        daily: getTimeProgress(selectedHabit.id, "daily"),
        weekly: getTimeProgress(selectedHabit.id, "weekly"),
        monthly: getTimeProgress(selectedHabit.id, "monthly"),
      }
    : null;

  useEffect(() => {
    if (habits.length > 0 && !selectedHabitId) {
      setSelectedHabitId(habits[0].id);
    }
  }, [habits, selectedHabitId]);

  const handleStartTracking = () => {
    startTimeTracking(selectedHabitId);
    setIsTracking(true);
    const startTime = Date.now();
    const newTimer = setInterval(() => {
      setElapsed(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);
    setTimer(newTimer);
  };

  const handleStopTracking = () => {
    if (timer) {
      clearInterval(timer);
      setTimer(null);
    }
    stopTimeTracking(selectedHabitId);
    setIsTracking(false);
    setElapsed(0);
  };

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

  return (
    <div className="h-full flex flex-col">
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

      <div className="flex-1 p-6 space-y-8 overflow-y-auto">
        {/* Habit Selection */}
        <div className="flex items-center gap-4">
          <Select
            value={selectedHabitId || ""}
            onValueChange={setSelectedHabitId}
          >
            <SelectTrigger className="w-[300px]">
              <SelectValue placeholder="Select a habit to track" />
            </SelectTrigger>
            <SelectContent>
              {habits.map((habit) => (
                <SelectItem key={habit.id} value={habit.id}>
                  {habit.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="ml-auto flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowStats(!showStats)}
              className={cn(
                "hover:bg-primary/10 transition-colors",
                showStats && "bg-primary/10"
              )}
            >
              <BarChart3 className="h-4 w-4" />
            </Button>
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

        {/* Timer Display */}
        {selectedHabit ? (
          <div className="flex flex-col items-center justify-center space-y-8 py-12">
            <div className="relative w-72 h-72">
              <CircularProgressbar
                value={progress?.daily.percentage || 0}
                text={formatTime(elapsed)}
                styles={buildStyles({
                  textSize: "16px",
                  pathTransitionDuration: 0.5,
                  pathColor: "var(--primary)",
                  textColor: "currentColor",
                  trailColor: "rgba(200, 200, 200, 0.1)",
                })}
              />
            </div>

            <div className="flex gap-4">
              {isTracking ? (
                <Button
                  variant="outline"
                  size="lg"
                  onClick={handleStopTracking}
                  className="px-8 py-6 text-lg font-medium hover:bg-destructive/10 transition-colors"
                >
                  <Square className="h-6 w-6 mr-2" />
                  Stop
                </Button>
              ) : (
                <Button
                  size="lg"
                  onClick={handleStartTracking}
                  className="px-12 py-6 text-lg font-medium bg-gradient-to-r from-primary to-primary-foreground hover:opacity-90 transition-opacity"
                >
                  <Play className="h-6 w-6 mr-2" />
                  Start
                </Button>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            {habits.length > 0
              ? "Select a habit to start tracking time"
              : "Create a habit to start tracking time"}
          </div>
        )}

        {/* Daily Progress Visualization */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium">Today's Sessions</h3>
            <span className="text-sm text-muted-foreground">
              {hourlyProgress.reduce((sum, p) => sum + (p > 0 ? 1 : 0), 0)}{" "}
              active hours
            </span>
          </div>
          <div className="space-y-2">
            <div>Today</div>
            <div className="grid grid-cols-24 gap-1">
              {hourlyProgress.map((progress, hour) => (
                <div key={hour} className="space-y-1">
                  <div className="h-10 bg-black/10 dark:bg-white/10 rounded-lg overflow-hidden">
                    <div
                      className="bg-primary/20 h-full transition-all duration-300"
                      style={{
                        height: `${progress * 100}%`,
                        backgroundColor:
                          selectedHabit?.color || "var(--primary)",
                      }}
                    />
                  </div>
                  {/* <div className="text-xs text-muted-foreground text-center">
                  {hour.toString().padStart(2, "0")}
                </div> */}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Weekly Hourly Progress */}
        <div className="space-y-4 mt-8">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold tracking-tight">
              Weekly Activity
            </h3>
            <div className="text-xs text-muted-foreground">
              {format(weekDays[0], "MMM d")} - {format(weekDays[6], "MMM d")}
            </div>
          </div>

          <div className="space-y-3 rounded-xl bg-black/5 dark:bg-white/5 p-4 backdrop-blur-sm">
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
                    {weeklyHourlyProgress[dayIndex].map((progress, hour) => (
                      <div key={hour} className="group relative">
                        <div
                          className={cn(
                            "absolute bottom-0 w-full rounded-sm transition-all duration-300",
                            progress > 0
                              ? "bg-primary"
                              : "bg-black/10 dark:bg-white/10",
                            isCurrentDay(day) ? "opacity-100" : "opacity-60"
                          )}
                          style={{
                            height: progress > 0 ? `${progress * 100}%` : "15%",
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

        {/* Settings Dialog */}
        <Dialog open={showSettingsDialog} onOpenChange={setShowSettingsDialog}>
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
                  if (selectedHabitId) {
                    updatePomodoroSettings(selectedHabitId, pomodoroSettings);
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
    </div>
  );
}
