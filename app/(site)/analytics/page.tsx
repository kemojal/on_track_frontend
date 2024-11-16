"use client";
import React, { useState, useMemo } from "react";
import { useHabitStore } from "@/lib/store";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  Legend,
  LineChart,
  Line,
} from "recharts";
import {
  TrendingUp,
  Award,
  Target,
  Calendar as CalendarIcon,
  Activity,
  BarChart2,
  Lock,
  Sparkles,
  ChartBar,
  Download,
  ArrowRight,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import {
  format,
  subDays,
  eachDayOfInterval,
  isWithinInterval,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  startOfYear,
  endOfYear,
  addDays,
  getWeek,
} from "date-fns";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import AdvancedAnalyticsDashboard from "@/components/AdvancedAnalyticsDashboard";

// Define chart colors using CSS variables
const CHART_COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/80 backdrop-blur-lg border border-gray-200 rounded-lg p-3 shadow-lg">
        <p className="font-medium">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            {entry.name}: {entry.value.toFixed(1)}%
          </p>
        ))}
      </div>
    );
  }
  return null;
};

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

const cardVariants = {
  hover: {
    scale: 1.02,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 10,
    },
  },
  tap: {
    scale: 0.98,
  },
};

const ViewToggle = ({ view, onViewChange }) => (
  <div className="flex space-x-2 mb-4">
    {["week", "month", "year"].map((v) => (
      <Button
        key={v}
        variant={view === v ? "default" : "outline"}
        onClick={() => onViewChange(v)}
        className="capitalize"
      >
        {v}
      </Button>
    ))}
  </div>
);

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const HeatmapCell = ({ value, max, date, habits }) => {
  const intensity = value ? Math.min((value / max) * 100, 100) : 0;
  const level = Math.floor(intensity / 20); // 0-4 levels

  // Get completed habits for this date
  const completedHabits = habits.filter((habit) =>
    habit.completedDates.some(
      (d) => format(new Date(d), "yyyy-MM-dd") === format(date, "yyyy-MM-dd")
    )
  );

  return (
    <div className="relative group">
      <div
        className={cn(
          "w-3 h-3 rounded-sm transition-all heatmap-cell",
          level === 0 && "bg-primary/5 dark:bg-primary/10",
          level === 1 && "bg-primary/20 dark:bg-primary/30",
          level === 2 && "bg-primary/40 dark:bg-primary/50",
          level === 3 && "bg-primary/60 dark:bg-primary/70",
          level === 4 && "bg-primary/80 dark:bg-primary",
          "hover:ring-2 hover:ring-primary/50 hover:ring-offset-1"
        )}
      />
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-50">
        <div className="bg-popover/95 backdrop-blur-sm px-3 py-2 rounded-lg shadow-xl border border-border">
          <div className="font-semibold text-sm">
            {format(date, "MMMM d, yyyy")}
          </div>
          <div className="text-sm text-muted-foreground">
            {value} {value === 1 ? "habit" : "habits"} completed
          </div>
          {completedHabits.length > 0 && (
            <div className="mt-2 space-y-1">
              {completedHabits.map((habit) => (
                <div
                  key={habit.id}
                  className="flex items-center gap-1.5 text-xs"
                >
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: habit.color || "currentColor" }}
                  />
                  {habit.name}
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-popover/95 mx-auto" />
      </div>
    </div>
  );
};

const PremiumAnalytics = ({ habits }) => {
  const [view, setView] = useState("year");
  const router = useRouter();
  const { isPro } = useHabitStore();

  const getDateRange = () => {
    const end = new Date();
    const start = {
      week: startOfWeek(end),
      month: startOfMonth(end),
      year: subDays(end, 365),
    }[view];
    return { start, end };
  };

  const heatmapData = useMemo(() => {
    if (!isPro) return [];

    const { start, end } = getDateRange();
    const days = eachDayOfInterval({ start, end });

    // Group days by week for GitHub-style layout
    const weeks = days.reduce((acc, day) => {
      const weekNum = format(day, "w");
      if (!acc[weekNum]) {
        acc[weekNum] = [];
      }

      // Count unique habits completed on this day
      const completedHabits = habits.filter((habit) =>
        habit.completedDates.some(
          (d) => format(new Date(d), "yyyy-MM-dd") === format(day, "yyyy-MM-dd")
        )
      );

      acc[weekNum].push({
        date: day,
        value: completedHabits.length,
        habits: completedHabits,
      });
      return acc;
    }, {});

    return Object.values(weeks);
  }, [habits, view, isPro]);

  const maxValue = Math.max(...heatmapData.flat().map((d) => d.value), 1);

  if (!isPro) {
    return (
      <Card className="col-span-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="w-5 h-5" />
            Premium Analytics
          </CardTitle>
          <CardDescription>
            Unlock beautiful GitHub-style habit tracking visualizations and
            advanced analytics
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center p-8 space-y-4">
          <div className="text-center max-w-md">
            <h3 className="text-lg font-semibold mb-2">
              Visualize Your Progress
            </h3>
            <p className="text-muted-foreground">
              See your habit completion patterns with our beautiful contribution
              graph, inspired by GitHub's design
            </p>
          </div>
          <Button
            onClick={() => router.push("/profile/billing")}
            variant="premium"
            className="button-premium"
          >
            Upgrade to Premium
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="col-span-full card-premium overflow-hidden">
      <CardHeader className="border-b border-border/50 bg-gradient-to-br from-background via-background/95 to-background/90">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Award className="w-5 h-5 text-primary animate-pulse" />
              Premium Analytics
            </CardTitle>
            <CardDescription>
              Track your habit consistency with our beautiful contribution graph
            </CardDescription>
          </div>
          <ViewToggle view={view} onViewChange={setView} />
        </div>
      </CardHeader>
      <CardContent className="p-8">
        <div className="relative pl-8">
          {/* Weekday Labels */}
          <div className="absolute left-0 top-10 grid grid-rows-7 gap-[2px] text-xs font-medium text-muted-foreground/70 h-[124px]">
            {WEEKDAYS.map((day, i) => (
              <div key={day} className="h-[16px] flex items-center">
                {i % 2 === 0 ? day.slice(0, 1) : ""}{" "}
                {/* Show only first letter every other day */}
              </div>
            ))}
          </div>

          {/* Month Labels */}
          <div className="flex mb-2 text-xs text-muted-foreground/70 font-medium h-6">
            <div className="w-8" /> {/* Spacer for weekday labels */}
            <div className="flex-1 relative">
              {MONTHS.map((month, i) => {
                const firstDayOfMonth = new Date(
                  new Date().getFullYear(),
                  i,
                  1
                );
                const weekOfYear = getWeek(firstDayOfMonth);
                const position = ((weekOfYear - 1) / 53) * 100;

                return (
                  <div
                    key={month}
                    className="absolute text-muted-foreground/70 hover:text-muted-foreground/90 transition-colors"
                    style={{
                      left: `${position}%`,
                      transform: "translateX(-50%)",
                      fontSize: "0.75rem",
                      fontWeight: 500,
                    }}
                  >
                    {month.slice(0, 3)}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Grid Container */}
          <div className="relative bg-card/30 rounded-lg p-4">
            {/* Contribution Grid */}
            <div className="grid grid-cols-53 gap-[2px]">
              {Array.from({ length: 7 }, (_, rowIndex) => (
                <React.Fragment key={`row-${rowIndex}`}>
                  {Array.from({ length: 53 }, (_, colIndex) => {
                    const currentDate = addDays(
                      startOfYear(new Date()),
                      colIndex * 7 + rowIndex
                    );

                    const weekData = heatmapData.find((week) =>
                      week.some(
                        (day) =>
                          format(day.date, "yyyy-MM-dd") ===
                          format(currentDate, "yyyy-MM-dd")
                      )
                    );

                    const dayData = weekData?.find(
                      (day) =>
                        format(day.date, "yyyy-MM-dd") ===
                        format(currentDate, "yyyy-MM-dd")
                    );

                    return (
                      <motion.div
                        key={`cell-${rowIndex}-${colIndex}`}
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{
                          delay: (colIndex * 7 + rowIndex) * 0.0005,
                          type: "spring",
                          stiffness: 500,
                          damping: 30,
                        }}
                        className="w-[16px] h-[16px]"
                        style={{
                          gridRow: rowIndex + 1,
                          gridColumn: colIndex + 1,
                        }}
                      >
                        <HeatmapCell
                          value={dayData?.value || 0}
                          max={maxValue}
                          date={currentDate}
                          habits={habits}
                        />
                      </motion.div>
                    );
                  })}
                </React.Fragment>
              ))}
            </div>

            {/* Legend */}
            <div className="mt-6 flex items-center justify-end gap-2 text-xs text-muted-foreground/70">
              <span className="font-medium">Less</span>
              {[0, 1, 2, 3, 4].map((level) => (
                <div
                  key={level}
                  className={cn(
                    "w-[16px] h-[16px] rounded-sm transition-colors duration-200",
                    level === 0 &&
                      "bg-primary/5 dark:bg-primary/10 hover:bg-primary/10",
                    level === 1 &&
                      "bg-primary/20 dark:bg-primary/30 hover:bg-primary/25",
                    level === 2 &&
                      "bg-primary/40 dark:bg-primary/50 hover:bg-primary/45",
                    level === 3 &&
                      "bg-primary/60 dark:bg-primary/70 hover:bg-primary/65",
                    level === 4 &&
                      "bg-primary/80 dark:bg-primary hover:bg-primary/85"
                  )}
                />
              ))}
              <span className="font-medium">More</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default function AnalyticsDashboard() {
  const { habits, calculateProgress } = useHabitStore();
  const { isPro } = useHabitStore();
  const [timeRange, setTimeRange] = useState("30");

  // Utility functions for data calculations
  const calculateStreak = (dates) => {
    let streak = 0;
    const today = new Date();
    for (let i = 0; i < dates.length; i++) {
      const date = new Date(dates[i]);
      if (date.toDateString() === today.toDateString()) {
        streak++;
        today.setDate(today.getDate() - 1);
      } else {
        break;
      }
    }
    return streak;
  };

  const calculateCompletionRate = (dates, days) => {
    const uniqueDates = new Set(dates);
    return (uniqueDates.size / days) * 100;
  };

  // Data preparation functions
  const getHeatmapData = () => {
    const last30Days = Array.from({ length: 30 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date.toISOString().split("T")[0];
    }).reverse();

    return last30Days.map((date) => ({
      date,
      completed: habits.filter((habit) => habit.completedDates.includes(date))
        .length,
    }));
  };

  const getTrendData = () => {
    const weeks = Array.from({ length: 12 }, (_, i) => {
      const weekStart = new Date();
      weekStart.setDate(weekStart.getDate() - i * 7);
      return weekStart.toISOString().split("T")[0];
    }).reverse();

    return weeks.map((week) => ({
      week,
      completionRate:
        habits?.reduce((acc, habit) => {
          const weekRate = calculateCompletionRate(
            habit.completedDates.filter((date) => date >= week),
            7
          );
          return acc + weekRate;
        }, 0) / habits.length,
    }));
  };

  const getPieData = () => {
    return habits.map((habit) => ({
      name: habit.name,
      value: calculateCompletionRate(habit.completedDates, parseInt(timeRange)),
    }));
  };

  // Metrics calculations
  const totalCompletions = habits?.reduce(
    (acc, habit) => acc + habit.completedDates.length,
    0
  );

  const averageCompletionRate =
    habits?.reduce(
      (acc, habit) =>
        acc +
        calculateCompletionRate(habit.completedDates, parseInt(timeRange)),
      0
    ) / habits.length;

  const bestStreak = Math.max(
    ...habits.map((habit) => calculateStreak(habit.completedDates))
  );

  const mostConsistentHabit = habits?.reduce((prev, current) => {
    const prevRate = calculateCompletionRate(
      prev.completedDates,
      parseInt(timeRange)
    );
    const currentRate = calculateCompletionRate(
      current.completedDates,
      parseInt(timeRange)
    );
    return prevRate > currentRate ? prev : current;
  });

  return (
    <motion.div
      className="space-y-6 p-6 pb-16"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      <div className="flex justify-between items-center">
        <motion.div variants={itemVariants}>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
            Analytics Dashboard
          </h2>
          <p className="text-muted-foreground">
            Track your habit progress and insights
          </p>
        </motion.div>
        <motion.div variants={itemVariants}>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Last 7 days</SelectItem>
              <SelectItem value="30">Last 30 days</SelectItem>
              <SelectItem value="90">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
        </motion.div>
      </div>

      {/* Key Metrics */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
        variants={containerVariants}
      >
        {[
          {
            title: "Total Completions",
            value: totalCompletions,
            icon: Target,
            description: "Across all habits",
            sparklineData: habits.map((h) => h.completedDates.length),
          },
          {
            title: "Average Completion Rate",
            value: `${averageCompletionRate.toFixed(1)}%`,
            icon: Activity,
            description: `Last ${timeRange} days`,
            sparklineData: getTrendData().map((d) => d.completionRate),
          },
          {
            title: "Best Streak",
            value: `${bestStreak} days`,
            icon: Award,
            description: "Current record",
            sparklineData: habits.map((h) => calculateStreak(h.completedDates)),
          },
          {
            title: "Most Consistent",
            value: mostConsistentHabit.name,
            icon: TrendingUp,
            description: `${calculateCompletionRate(
              mostConsistentHabit.completedDates,
              parseInt(timeRange)
            ).toFixed(1)}% completion`,
            sparklineData: getPieData().map((d) => d.value),
          },
        ].map((metric, index) => (
          <motion.div
            key={metric.title}
            variants={itemVariants}
            whileHover="hover"
            whileTap="tap"
          >
            <Card
              className="overflow-hidden backdrop-blur-lg bg-white/50 dark:bg-gray-800/50 border border-gray-200/50 dark:border-gray-700/50 shadow-lg hover:shadow-xl transition-all duration-300"
              variants={cardVariants}
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {metric.title}
                </CardTitle>
                <metric.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metric.value}</div>
                <p className="text-xs text-muted-foreground">
                  {metric.description}
                </p>
                <div className="h-8 mt-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={metric.sparklineData.map((value, i) => ({
                        value,
                        index: i,
                      }))}
                    >
                      <Line
                        type="monotone"
                        dataKey="value"
                        stroke={CHART_COLORS[index]}
                        strokeWidth={2}
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Detailed Analytics */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="bg-white/50 backdrop-blur-lg dark:bg-gray-800/50">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BarChart2 className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="trends" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Trends
          </TabsTrigger>
          <TabsTrigger value="calendar" className="flex items-center gap-2">
            <CalendarIcon className="h-4 w-4" />
            Calendar
          </TabsTrigger>
          <TabsTrigger value="habits" className="flex items-center gap-2">
            Habits
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
            variants={containerVariants}
          >
            {/* Completion Rates */}
            <motion.div
              variants={itemVariants}
              whileHover="hover"
              whileTap="tap"
            >
              <Card className="backdrop-blur-lg bg-white/50 dark:bg-gray-800/50 border border-gray-200/50 dark:border-gray-700/50 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardHeader>
                  <CardTitle>Habit Completion Rates</CardTitle>
                  <CardDescription>Performance by habit</CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={habits.map((habit) => ({
                        name: habit.name,
                        rate: calculateCompletionRate(
                          habit.completedDates,
                          parseInt(timeRange)
                        ),
                      }))}
                      layout="vertical"
                    >
                      <defs>
                        {habits.map((_, index) => (
                          <linearGradient
                            key={`gradient-${index}`}
                            id={`barGradient-${index}`}
                            x1="0"
                            y1="0"
                            x2="1"
                            y2="0"
                          >
                            <stop
                              offset="0%"
                              stopColor={
                                CHART_COLORS[index % CHART_COLORS.length]
                              }
                              stopOpacity={0.8}
                            />
                            <stop
                              offset="100%"
                              stopColor={
                                CHART_COLORS[(index + 1) % CHART_COLORS.length]
                              }
                              stopOpacity={0.8}
                            />
                          </linearGradient>
                        ))}
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                      <XAxis
                        type="number"
                        unit="%"
                        tickLine={false}
                        axisLine={false}
                        style={{ fontSize: "12px" }}
                      />
                      <YAxis
                        dataKey="name"
                        type="category"
                        width={120}
                        tickLine={false}
                        axisLine={false}
                        style={{ fontSize: "12px" }}
                      />
                      <Tooltip
                        content={<CustomTooltip />}
                        cursor={{ fill: "rgba(255,255,255,0.1)" }}
                      />
                      <Bar
                        dataKey="rate"
                        radius={[0, 4, 4, 0]}
                        animationDuration={1500}
                      >
                        {habits.map((_, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={`url(#barGradient-${index})`}
                            className="transition-opacity duration-200 hover:opacity-90"
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </motion.div>

            {/* Distribution */}
            <motion.div
              variants={itemVariants}
              whileHover="hover"
              whileTap="tap"
            >
              <Card className="backdrop-blur-lg bg-white/50 dark:bg-gray-800/50 border border-gray-200/50 dark:border-gray-700/50 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardHeader>
                  <CardTitle>Habit Distribution</CardTitle>
                  <CardDescription>Completion share by habit</CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <defs>
                        {habits.map((_, index) => (
                          <linearGradient
                            key={`pieGradient-${index}`}
                            id={`pieGradient-${index}`}
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                          >
                            <stop
                              offset="0%"
                              stopColor={
                                CHART_COLORS[index % CHART_COLORS.length]
                              }
                              stopOpacity={0.8}
                            />
                            <stop
                              offset="100%"
                              stopColor={
                                CHART_COLORS[(index + 1) % CHART_COLORS.length]
                              }
                              stopOpacity={0.8}
                            />
                          </linearGradient>
                        ))}
                      </defs>
                      <Pie
                        data={getPieData()}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        labelLine={false}
                        animationDuration={1500}
                      >
                        {getPieData().map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={`url(#pieGradient-${index})`}
                            className="transition-opacity duration-200 hover:opacity-90"
                          />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                      <Legend
                        verticalAlign="bottom"
                        height={36}
                        iconSize={8}
                        formatter={(value) => (
                          <span className="text-xs text-muted-foreground">
                            {value}
                          </span>
                        )}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </TabsContent>

        <TabsContent value="trends" className="space-y-4">
          <Card className="backdrop-blur-lg bg-white/50 dark:bg-gray-800/50 hover:shadow-lg transition-all duration-200">
            <CardHeader>
              <CardTitle>Completion Trend</CardTitle>
              <CardDescription>
                Weekly completion rates over time
              </CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={getTrendData()}
                  margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient
                      id="colorGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor={CHART_COLORS[0]}
                        stopOpacity={0.8}
                      />
                      <stop
                        offset="95%"
                        stopColor={CHART_COLORS[0]}
                        stopOpacity={0.1}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                  <XAxis
                    dataKey="week"
                    tickLine={false}
                    axisLine={false}
                    style={{ fontSize: "12px" }}
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    style={{ fontSize: "12px" }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="completionRate"
                    stroke={CHART_COLORS[0]}
                    fill="url(#colorGradient)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="calendar" className="space-y-4">
          <Card className="backdrop-blur-lg bg-white/50 dark:bg-gray-800/50 hover:shadow-lg transition-all duration-200">
            <CardHeader>
              <CardTitle>Activity Calendar</CardTitle>
              <CardDescription>Daily completion heatmap</CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={getHeatmapData()}
                  margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient
                      id="calendarGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor={CHART_COLORS[1]}
                        stopOpacity={0.8}
                      />
                      <stop
                        offset="95%"
                        stopColor={CHART_COLORS[1]}
                        stopOpacity={0.1}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                  <XAxis
                    dataKey="date"
                    tickLine={false}
                    axisLine={false}
                    style={{ fontSize: "12px" }}
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    style={{ fontSize: "12px" }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="completed"
                    stroke={CHART_COLORS[1]}
                    fill="url(#calendarGradient)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="habits" className="space-y-4">
          <ScrollArea className="h-[600px] pr-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {habits.map((habit) => (
                <Card
                  key={habit.id}
                  className="backdrop-blur-lg bg-white/50 dark:bg-gray-800/50 hover:shadow-lg transition-all duration-200 hover:scale-[1.02]"
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-10 h-10 rounded-xl bg-gradient-to-br ${habit.color} flex items-center justify-center text-white text-lg shadow-lg`}
                        >
                          {habit.emoji}
                        </div>
                        <div>
                          <CardTitle className="text-base">
                            {habit.name}
                          </CardTitle>
                          <CardDescription>
                            {calculateCompletionRate(
                              habit.completedDates,
                              parseInt(timeRange)
                            ).toFixed(1)}
                            % completion
                          </CardDescription>
                        </div>
                      </div>
                      <div className="text-sm font-medium">
                        {habit.streak}🔥
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Progress
                      value={calculateProgress(habit)}
                      className="h-2"
                      indicatorClassName={`bg-gradient-to-r ${habit.color}`}
                    />
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative mt-8 rounded-2xl overflow-hidden border border-purple-500/20 shadow-2xl"
      >
        {/* Premium Content */}
        <div
          className={cn(
            "transition-all duration-500",
            !isPro && "filter blur-[2px] scale-[0.99]"
          )}
        >
          <PremiumAnalytics habits={habits} />
          <AdvancedAnalyticsDashboard habits={habits} />
        </div>

        {/* Premium Overlay - Only show for non-pro users */}
        {!isPro && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="absolute inset-0 backdrop-blur-[8px]"
          >
            {/* Multi-layered gradient background */}
            <div className="absolute inset-0 bg-gradient-to-b from-background/10 via-background/50 to-background/90" />
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-pink-500/10 to-blue-500/10" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-500/10 via-transparent to-transparent" />

            {/* Glass effect card */}
            <motion.div
              className="relative h-full flex flex-col items-center justify-center p-12 text-center"
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 100 }}
            >
              {/* Premium Icon */}
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
                className="relative mb-8"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl blur-xl opacity-50" />
                <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center relative shadow-xl ring-1 ring-white/20">
                  <Sparkles className="h-10 w-10 text-white" />
                </div>
              </motion.div>

              {/* Title and Description */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="max-w-2xl mb-12"
              >
                <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent mb-4">
                  Unlock Advanced Analytics
                </h2>
                <p className="text-lg text-muted-foreground max-w-md mx-auto">
                  Get deeper insights into your habits with our premium
                  analytics suite. Track trends, visualize progress, and achieve
                  your goals faster.
                </p>
              </motion.div>

              {/* Features Grid */}
              <motion.div
                className="flex flex-col items-center gap-8 mb-12"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  {[
                    {
                      icon: ChartBar,
                      text: "Detailed Insights",
                      color: "from-purple-500 to-pink-500",
                    },
                    {
                      icon: TrendingUp,
                      text: "Progress Tracking",
                      color: "from-pink-500 to-rose-500",
                    },
                    {
                      icon: CalendarIcon,
                      text: "Historical Data",
                      color: "from-blue-500 to-cyan-500",
                    },
                    {
                      icon: Download,
                      text: "Export Reports",
                      color: "from-emerald-500 to-teal-500",
                    },
                  ].map((feature, i) => (
                    <motion.div
                      key={i}
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.7 + i * 0.1 }}
                      className="flex flex-col items-center gap-3 group"
                    >
                      <div className="relative">
                        <div
                          className={`absolute inset-0 bg-gradient-to-br ${feature.color} blur-lg opacity-0 group-hover:opacity-50 transition-opacity duration-500`}
                        />
                        <div className="h-14 w-14 rounded-xl bg-primary/10 flex items-center justify-center relative ring-1 ring-white/10 group-hover:ring-white/20 transition-all duration-500">
                          <feature.icon className="h-6 w-6 text-primary group-hover:scale-110 transition-transform duration-500" />
                        </div>
                      </div>
                      <span className="text-sm font-medium text-muted-foreground group-hover:text-primary transition-colors duration-500">
                        {feature.text}
                      </span>
                    </motion.div>
                  ))}
                </div>

                {/* CTA Button */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 1.1 }}
                >
                  <Button
                    onClick={() => router.push("/profile/billing")}
                    className="relative group px-8 py-6 rounded-xl overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 transition-transform duration-500 group-hover:scale-[1.02]" />
                    <div className="relative flex items-center text-white text-lg font-medium">
                      Upgrade to Pro
                      <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-500" />
                    </div>
                  </Button>
                </motion.div>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
}
