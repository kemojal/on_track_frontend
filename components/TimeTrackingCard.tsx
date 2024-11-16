import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { useHabitStore } from "@/lib/store";
import { useState, useEffect } from "react";
import { Progress } from "./ui/progress";
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
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { Sparkles, BarChart3, ChevronRight } from "lucide-react";

export function TimeTrackingCard({ habit }: { habit: any }) {
  const {
    startTimeTracking,
    stopTimeTracking,
    updateTimeTarget,
    getTimeProgress,
    updatePomodoroSettings,
  } = useHabitStore();
  const [isTracking, setIsTracking] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);
  const [showTargetDialog, setShowTargetDialog] = useState(false);
  const [targetInputs, setTargetInputs] = useState({
    daily: "",
    weekly: "",
    monthly: "",
  });
  const [showSessionsDialog, setShowSessionsDialog] = useState(false);
  const [showSettingsDialog, setShowSettingsDialog] = useState(false);
  const [pomodoroSettings, setPomodoroSettings] = useState({
    workDuration: 25,
    breakDuration: 5,
    longBreakDuration: 15,
    sessionsUntilLongBreak: 4,
  });
  const [trackingMode, setTrackingMode] = useState<"regular" | "pomodoro">(
    "regular"
  );
  const [pomodoroPhase, setPomodoroPhase] = useState<
    "work" | "break" | "longBreak"
  >("work");
  const [completedPomodoros, setCompletedPomodoros] = useState(0);
  const [showStats, setShowStats] = useState(false);

  const progress = {
    daily: getTimeProgress(habit.id, "daily"),
    weekly: getTimeProgress(habit.id, "weekly"),
    monthly: getTimeProgress(habit.id, "monthly"),
  };

  useEffect(() => {
    return () => {
      if (timer) {
        clearInterval(timer);
      }
    };
  }, [timer]);

  const handleStartTracking = () => {
    startTimeTracking(habit.id);
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
    stopTimeTracking(habit.id);
    setIsTracking(false);
    setElapsed(0);
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const handleUpdateTarget = () => {
    const targets = {
      daily: targetInputs.daily ? parseInt(targetInputs.daily) : undefined,
      weekly: targetInputs.weekly ? parseInt(targetInputs.weekly) : undefined,
      monthly: targetInputs.monthly
        ? parseInt(targetInputs.monthly)
        : undefined,
    };
    updateTimeTarget(habit.id, targets);
    setShowTargetDialog(false);
  };

  const getPhaseColor = (phase: string) => {
    switch (phase) {
      case "work":
        return {
          bg: "bg-green-500",
          text: "text-green-500",
          from: "from-green-500",
          to: "to-emerald-700",
        };
      case "break":
        return {
          bg: "bg-blue-500",
          text: "text-blue-500",
          from: "from-blue-500",
          to: "to-cyan-700",
        };
      default:
        return {
          bg: "bg-purple-500",
          text: "text-purple-500",
          from: "from-purple-500",
          to: "to-violet-700",
        };
    }
  };

  const calculateStreak = () => {
    if (!habit.timeTracking?.sessions) return 0;
    let streak = 0;
    const today = new Date();
    const sessions = habit.timeTracking.sessions;

    for (let i = 0; i < 7; i++) {
      const date = format(
        new Date(today.getTime() - i * 24 * 60 * 60 * 1000),
        "yyyy-MM-dd"
      );
      if (sessions.some((s) => s.date.startsWith(date))) {
        streak++;
      } else break;
    }
    return streak;
  };

  return (
    <Card className="relative p-12 space-y-8 bg-gradient-to-br from-background via-background to-muted/10 border-2 shadow-lg hover:shadow-xl transition-all duration-300 ">
      {/* Premium Badge */}
      <div className="absolute -top-4 -right-4">
        <div className="relative">
          <div className="px-4 py-1.5 text-sm font-semibold text-white bg-gradient-to-r from-amber-500 to-yellow-500 rounded-full shadow-lg">
            <span className="flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              Premium
            </span>
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-amber-500 to-yellow-500 rounded-full blur-lg opacity-40" />
        </div>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="p-3.5 rounded-xl bg-primary/10 backdrop-blur-sm ring-1 ring-primary/20">
            <Clock className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h3 className="text-2xl font-semibold tracking-tight">
              Time Tracking
            </h3>
            <p className="text-base text-muted-foreground mt-1">
              {trackingMode === "pomodoro" ? "Pomodoro Timer" : "Regular Timer"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="lg"
            onClick={() => setShowStats(!showStats)}
            className={cn(
              "hover:scale-105 transition-transform hover:bg-primary/10 p-3",
              showStats && "bg-primary/10"
            )}
          >
            <BarChart3 className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="lg"
            onClick={() => setShowSessionsDialog(true)}
            className="hover:scale-105 transition-transform hover:bg-primary/10 p-3"
          >
            <History className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="lg"
            onClick={() => setShowSettingsDialog(true)}
            className="hover:scale-105 transition-transform hover:bg-primary/10 p-3"
          >
            <Settings2 className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="lg"
            onClick={() => setShowTargetDialog(true)}
            className="hover:scale-105 transition-transform hover:bg-primary/10 p-3"
          >
            <Target className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <AnimatePresence>
        {showStats && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="grid grid-cols-3 gap-6 p-6 mb-6 rounded-xl bg-muted/50 backdrop-blur-sm border border-border/50">
              <div className="space-y-2 text-center p-4">
                <div className="text-3xl font-bold bg-gradient-to-br from-primary to-primary-foreground bg-clip-text text-transparent">
                  {calculateStreak()}
                </div>
                <div className="text-sm text-muted-foreground font-medium">
                  Day Streak
                </div>
              </div>
              <div className="space-y-2 text-center p-4">
                <div className="text-3xl font-bold bg-gradient-to-br from-primary to-primary-foreground bg-clip-text text-transparent">
                  {habit.timeTracking?.sessions?.length || 0}
                </div>
                <div className="text-sm text-muted-foreground font-medium">
                  Sessions
                </div>
              </div>
              <div className="space-y-2 text-center p-4">
                <div className="text-3xl font-bold bg-gradient-to-br from-primary to-primary-foreground bg-clip-text text-transparent">
                  {Math.round(progress.daily.percentage)}%
                </div>
                <div className="text-sm text-muted-foreground font-medium">
                  Daily Goal
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Timer Mode Selector */}
      <div className="flex justify-center mb-8">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="gap-3 px-8 py-6 text-lg font-medium hover:bg-primary/10 transition-colors ring-1 ring-primary/20"
            >
              <Timer className="h-6 w-6" />
              {trackingMode === "regular" ? "Regular Timer" : "Pomodoro Timer"}
              <ChevronRight className="h-5 w-5 ml-2" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuItem
              onClick={() => setTrackingMode("regular")}
              className="gap-3 py-3"
            >
              <Clock className="h-5 w-5" />
              Regular Timer
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => setTrackingMode("pomodoro")}
              className="gap-3 py-3"
            >
              <Timer className="h-5 w-5" />
              Pomodoro Timer
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Timer Display */}
      <div className="flex flex-col items-center justify-center space-y-8 py-8">
        <div className="w-64 h-64">
          <CircularProgressbar
            value={
              trackingMode === "pomodoro"
                ? (elapsed /
                    (pomodoroSettings[
                      pomodoroPhase === "work"
                        ? "workDuration"
                        : pomodoroPhase === "break"
                        ? "breakDuration"
                        : "longBreakDuration"
                    ] *
                      60)) *
                  100
                : 0
            }
            text={formatTime(elapsed)}
            styles={buildStyles({
              textSize: "16px",
              pathTransitionDuration: 0.5,
              pathColor:
                pomodoroPhase === "work"
                  ? "#22c55e"
                  : pomodoroPhase === "break"
                  ? "#3b82f6"
                  : "#a855f7",
              textColor: "currentColor",
              trailColor: "rgba(200, 200, 200, 0.1)",
            })}
          />
        </div>

        <div className="flex gap-4">
          {isTracking ? (
            <>
              <Button
                variant="outline"
                size="lg"
                onClick={handleStopTracking}
                className="px-8 py-6 text-lg font-medium hover:bg-destructive/10 transition-colors"
              >
                <Square className="h-6 w-6 mr-2" />
                Stop
              </Button>
            </>
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

      {/* Progress Tabs */}
      <div className="pt-8 border-t">
        <Tabs defaultValue="daily" className="w-full">
          <TabsList className="grid w-full grid-cols-3 p-1.5 rounded-lg bg-muted/50 backdrop-blur-sm">
            <TabsTrigger
              value="daily"
              className="px-8 py-3 data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-md transition-all duration-200"
            >
              Daily
            </TabsTrigger>
            <TabsTrigger
              value="weekly"
              className="px-8 py-3 data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-md transition-all duration-200"
            >
              Weekly
            </TabsTrigger>
            <TabsTrigger
              value="monthly"
              className="px-8 py-3 data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-md transition-all duration-200"
            >
              Monthly
            </TabsTrigger>
          </TabsList>
          <AnimatePresence mode="wait">
            {["daily", "weekly", "monthly"].map((period) => (
              <TabsContent key={period} value={period} className="mt-6">
                <motion.div
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -10, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Progress</span>
                      <span className="text-sm text-muted-foreground">
                        {Math.round(progress[period].percentage)}%
                      </span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-primary to-primary-foreground"
                        style={{ width: `${progress[period].percentage}%` }}
                        initial={{ width: 0 }}
                        animate={{ width: `${progress[period].percentage}%` }}
                        transition={{ duration: 0.5 }}
                      />
                    </div>
                    <div className="flex justify-between items-center text-sm text-muted-foreground">
                      <span>{formatTime(progress[period].current)}</span>
                      <span>{formatTime(progress[period].target)}</span>
                    </div>
                  </div>
                </motion.div>
              </TabsContent>
            ))}
          </AnimatePresence>
        </Tabs>
      </div>

      {/* Dialogs */}
      <Dialog open={showSessionsDialog} onOpenChange={setShowSessionsDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <History className="h-5 w-5" />
              Session History
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Accordion type="single" collapsible className="w-full">
              {habit.timeTracking?.sessions ? (
                Object.entries(
                  habit.timeTracking.sessions
                    .sort(
                      (a, b) =>
                        new Date(b.date).getTime() - new Date(a.date).getTime()
                    )
                    .reduce((acc, session) => {
                      const date = format(
                        new Date(session.date),
                        "MMM dd, yyyy"
                      );
                      if (!acc[date]) acc[date] = [];
                      acc[date].push(session);
                      return acc;
                    }, {} as Record<string, typeof habit.timeTracking.sessions>)
                ).map(([date, sessions]) => (
                  <AccordionItem key={date} value={date}>
                    <AccordionTrigger className="hover:no-underline">
                      <div className="flex items-center justify-between w-full pr-4">
                        <span className="font-medium">{date}</span>
                        <span className="text-sm text-muted-foreground">
                          {sessions.length} sessions •{" "}
                          {Math.round(
                            sessions.reduce((acc, s) => acc + s.duration, 0)
                          )}{" "}
                          minutes
                        </span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-3">
                        {sessions.map((session, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                          >
                            <div className="flex items-center gap-3">
                              <div
                                className={cn(
                                  "p-2 rounded-full",
                                  session.type === "pomodoro"
                                    ? "bg-green-500/10"
                                    : "bg-primary/10"
                                )}
                              >
                                {session.type === "pomodoro" ? (
                                  <Timer className="h-4 w-4 text-green-500" />
                                ) : (
                                  <Clock className="h-4 w-4 text-primary" />
                                )}
                              </div>
                              <div>
                                <div className="font-medium">
                                  {session.type === "pomodoro"
                                    ? "Pomodoro Session"
                                    : "Regular Session"}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  {format(new Date(session.date), "h:mm a")} •{" "}
                                  {session.duration} minutes
                                </div>
                              </div>
                            </div>
                            {session.notes && (
                              <div className="text-sm text-muted-foreground max-w-[200px] truncate">
                                {session.notes}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No sessions recorded yet
                </div>
              )}
            </Accordion>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showSettingsDialog} onOpenChange={setShowSettingsDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Settings2 className="h-5 w-5" />
              Pomodoro Settings
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6 py-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium">
                Work Duration (minutes)
              </Label>
              <Input
                type="number"
                value={pomodoroSettings.workDuration}
                onChange={(e) =>
                  setPomodoroSettings({
                    ...pomodoroSettings,
                    workDuration: parseInt(e.target.value),
                  })
                }
                className="focus-visible:ring-primary"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium">
                Break Duration (minutes)
              </Label>
              <Input
                type="number"
                value={pomodoroSettings.breakDuration}
                onChange={(e) =>
                  setPomodoroSettings({
                    ...pomodoroSettings,
                    breakDuration: parseInt(e.target.value),
                  })
                }
                className="focus-visible:ring-primary"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium">
                Long Break Duration (minutes)
              </Label>
              <Input
                type="number"
                value={pomodoroSettings.longBreakDuration}
                onChange={(e) =>
                  setPomodoroSettings({
                    ...pomodoroSettings,
                    longBreakDuration: parseInt(e.target.value),
                  })
                }
                className="focus-visible:ring-primary"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium">
                Sessions Until Long Break
              </Label>
              <Input
                type="number"
                value={pomodoroSettings.sessionsUntilLongBreak}
                onChange={(e) =>
                  setPomodoroSettings({
                    ...pomodoroSettings,
                    sessionsUntilLongBreak: parseInt(e.target.value),
                  })
                }
                className="focus-visible:ring-primary"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              onClick={() => {
                updatePomodoroSettings(habit.id, pomodoroSettings);
                setShowSettingsDialog(false);
              }}
              className="w-full sm:w-auto"
            >
              Save Settings
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showTargetDialog} onOpenChange={setShowTargetDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Set Time Targets
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6 py-4">
            {["daily", "weekly", "monthly"].map((period) => (
              <div key={period} className="space-y-2">
                <Label className="text-sm font-medium">
                  {period.charAt(0).toUpperCase() + period.slice(1)} Target
                  (minutes)
                </Label>
                <Input
                  type="number"
                  value={targetInputs[period]}
                  onChange={(e) =>
                    setTargetInputs({
                      ...targetInputs,
                      [period]: e.target.value,
                    })
                  }
                  className="focus-visible:ring-primary"
                  placeholder={`Enter ${period} target...`}
                />
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button onClick={handleUpdateTarget} className="w-full sm:w-auto">
              Save Targets
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
