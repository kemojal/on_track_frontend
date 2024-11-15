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
  LineChart,
  Line,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  Calendar,
  TrendingUp,
  Award,
  Target,
  Clock,
  Calendar as CalendarIcon,
  Activity,
  BarChart2,
  PieChart as PieChartIcon,
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
import { Button } from "react-day-picker";

const COLORS = ["#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEEAD"];

export default function AnalyticsDashboard() {
  const {
    habits,
    activeTab,
    setActiveTab,
    calculateProgress,
    setIsNewHabitOpen,
  } = useHabitStore();
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
    <div className="space-y-6">
      
        {/* Time Range Selector */}
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-bold">Analytics Dashboard</h2>
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
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="hover-scale">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Completions
              </CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalCompletions}</div>
              <p className="text-xs text-muted-foreground">Across all habits</p>
            </CardContent>
          </Card>
          <Card className="hover-scale">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Average Completion Rate
              </CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {averageCompletionRate.toFixed(1)}%
              </div>
              <p className="text-xs text-muted-foreground">
                Last {timeRange} days
              </p>
            </CardContent>
          </Card>
          <Card className="hover-scale">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Best Streak</CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{bestStreak} days</div>
              <p className="text-xs text-muted-foreground">Current record</p>
            </CardContent>
          </Card>
          <Card className="hover-scale">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Most Consistent
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {mostConsistentHabit.name}
              </div>
              <p className="text-xs text-muted-foreground">
                {calculateCompletionRate(
                  mostConsistentHabit.completedDates,
                  parseInt(timeRange)
                ).toFixed(1)}
                % completion
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Analytics */}
        <Tabs defaultValue="overview" className="space-y-4 mt-4">
          <TabsList>
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
              {/* <Bulb className="h-4 w-4" /> */}
              Habits
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Completion Rates */}
              <Card>
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
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" unit="%" />
                      <YAxis dataKey="name" type="category" width={100} />
                      <Tooltip />
                      <Bar dataKey="rate" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle>Habit Distribution</CardTitle>
                  <CardDescription>Completion share by habit</CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={getPieData()}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        label
                      >
                        {getPieData().map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="trends" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Completion Trend</CardTitle>
                <CardDescription>
                  Weekly completion rates over time
                </CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={getTrendData()}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="week" />
                    <YAxis />
                    <Tooltip />
                    <Area
                      type="monotone"
                      dataKey="completionRate"
                      stroke="#8884d8"
                      fill="#8884d8"
                      fillOpacity={0.3}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="calendar" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Activity Calendar</CardTitle>
                <CardDescription>Daily completion heatmap</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={getHeatmapData()}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Area
                      type="monotone"
                      dataKey="completed"
                      stroke="#82ca9d"
                      fill="#82ca9d"
                      fillOpacity={0.3}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="habits" className="space-y-4">
          <ScrollArea className="flex-1 mt-6 -mx-6 px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {habits.map((habit) => (
                <div
                  key={habit.id}
                  className="p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:scale-[1.02] transition-transform duration-200"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 rounded-lg bg-gradient-to-br ${habit.color} flex items-center justify-center text-white`}
                      >
                        {habit.emoji}
                      </div>
                      <span className="font-semibold">{habit.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="text-sm font-medium text-violet-500">
                        {habit.streak}🔥
                      </div>
                    </div>
                  </div>
                  <Progress
                    value={calculateProgress(habit)}
                    className="h-2 bg-gray-100 dark:bg-gray-700"
                  />
                </div>
              ))}
              {/* <Button
                onClick={() => setIsNewHabitOpen(true)}
                className="mt-6 bg-gradient-to-r from-violet-500 to-purple-500 text-white hover:opacity-90 rounded-xl h-12"
              >
                <span className="mr-2">+</span>
                Add New Habit
              </Button> */}
            </div>
          </ScrollArea>
            </TabsContent>
        </Tabs>
     
    </div>
  );
}
