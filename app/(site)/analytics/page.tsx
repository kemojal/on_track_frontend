"use client";
import React, { useState } from "react";
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
import { motion } from "framer-motion";
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

export default function AnalyticsDashboard() {
  const { habits, calculateProgress } = useHabitStore();
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
  const totalCompletions = habits.reduce(
    (acc, habit) => acc + habit.completedDates.length,
    0
  );

  const averageCompletionRate =
    habits.reduce(
      (acc, habit) =>
        acc +
        calculateCompletionRate(habit.completedDates, parseInt(timeRange)),
      0
    ) / habits.length;

  const bestStreak = Math.max(
    ...habits.map((habit) => calculateStreak(habit.completedDates))
  );

  const mostConsistentHabit = habits.reduce((prev, current) => {
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
    </motion.div>
  );
}
