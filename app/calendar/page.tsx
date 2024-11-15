"use client";
import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Trophy,
  Flame,
  Calendar as CalendarIcon,
  CheckCircle2,
  XCircle,
  Info,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useHabitStore } from "@/lib/store";

export default function CalendarPage() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedView, setSelectedView] = useState("month");


const {habits} = useHabitStore()
  const getCompletionData = (date) => {
    return habits.map((habit) => ({
      habitId: habit.id,
      completed: Math.random() > 0.3,
      notes: "Sample note for this habit",
    }));
  };

  const DayCell = ({ date, isCompact = false }) => {
    const completions = getCompletionData(date);
    const dayNumber = date.getDate();
    const isToday = new Date().toDateString() === date.toDateString();
    const isPast = date < new Date();

    if (isCompact) {
      return (
        <div
          className={`h-16 p-2 border rounded-lg transition-all ${
            isToday
              ? "bg-violet-50 dark:bg-violet-900/20 border-violet-200 dark:border-violet-800"
              : "hover:bg-accent/5"
          }`}
        >
          <span
            className={`text-sm font-medium ${
              isToday ? "text-violet-600 dark:text-violet-400" : ""
            }`}
          >
            {dayNumber}
          </span>
          {isPast && (
            <div className="flex -space-x-1 mt-1">
              {completions.map((completion, idx) => (
                <div
                  key={idx}
                  className={`w-2 h-2 rounded-full border border-white dark:border-gray-800 ${
                    completion.completed ? "bg-green-500" : "bg-red-500"
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      );
    }

    return (
      <div
        className={`h-28 p-2 border rounded-lg transition-all ${
          isToday
            ? "bg-violet-50 dark:bg-violet-900/20 border-violet-200 dark:border-violet-800"
            : "hover:bg-accent/5"
        }`}
      >
        <div className="flex justify-between items-start">
          <span
            className={`text-sm font-medium ${
              isToday ? "text-violet-600 dark:text-violet-400" : ""
            }`}
          >
            {dayNumber}
          </span>
          {isPast && (
            <div className="flex -space-x-1">
              {completions.map((completion, idx) => (
                <div
                  key={idx}
                  className={`w-2 h-2 rounded-full border border-white dark:border-gray-800 ${
                    completion.completed ? "bg-green-500" : "bg-red-500"
                  }`}
                />
              ))}
            </div>
          )}
        </div>
        {isPast && (
          <div className="mt-2 space-y-1">
            {completions.map((completion, idx) => {
              const habit = habits.find((h) => h.id === completion.habitId);
              return (
                <TooltipProvider key={idx}>
                  <Tooltip>
                    <TooltipTrigger>
                      <div
                        className={`flex items-center text-xs gap-1 ${
                          completion.completed
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {completion.completed ? (
                          <CheckCircle2 className="w-3 h-3" />
                        ) : (
                          <XCircle className="w-3 h-3" />
                        )}
                        <span className="truncate">{habit.name}</span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{habit.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {completion.notes}
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  const generateCalendarDays = (view) => {
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth();
    const days = [];

    switch (view) {
      case "month": {
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);

        // Add previous month's days
        const firstDayOfWeek = firstDay.getDay() || 7; // Convert Sunday (0) to 7
        for (let i = firstDayOfWeek - 1; i >= 0; i--) {
          days.push(new Date(year, month, -i));
        }

        // Add current month's days
        for (let i = 1; i <= lastDay.getDate(); i++) {
          days.push(new Date(year, month, i));
        }

        // Add next month's days
        const remainingDays = 42 - days.length;
        for (let i = 1; i <= remainingDays; i++) {
          days.push(new Date(year, month + 1, i));
        }
        break;
      }

      case "week": {
        const currentDay = selectedDate.getDay() || 7;
        const monday = new Date(selectedDate);
        monday.setDate(selectedDate.getDate() - (currentDay - 1));

        for (let i = 0; i < 7; i++) {
          const day = new Date(monday);
          day.setDate(monday.getDate() + i);
          days.push(day);
        }
        break;
      }

      case "day": {
        days.push(selectedDate);
        break;
      }
    }

    return days;
  };

  const handleNavigation = (direction) => {
    const newDate = new Date(selectedDate);

    switch (selectedView) {
      case "month":
        newDate.setMonth(selectedDate.getMonth() + direction);
        break;
      case "week":
        newDate.setDate(selectedDate.getDate() + direction * 7);
        break;
      case "day":
        newDate.setDate(selectedDate.getDate() + direction);
        break;
    }

    setSelectedDate(newDate);
  };

  const getNavigationLabel = () => {
    const options = { month: "long", year: "numeric" };

    switch (selectedView) {
      case "month":
        return selectedDate.toLocaleDateString("en-US", options);
      case "week": {
        const days = generateCalendarDays("week");
        const startDate = days[0].toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        });
        const endDate = days[6].toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        });
        return `${startDate} - ${endDate}`;
      }
      case "day":
        return selectedDate.toLocaleDateString("en-US", {
          ...options,
          day: "numeric",
        });
      default:
        return "";
    }
  };

  const renderCalendarGrid = () => {
    const days = generateCalendarDays(selectedView);

    switch (selectedView) {
      case "month":
        return (
          <>
            <div className="grid grid-cols-7 gap-4 mb-4">
              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
                <div
                  key={day}
                  className="text-sm font-medium text-center text-muted-foreground"
                >
                  {day}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-4">
              {days.map((date, index) => (
                <DayCell key={index} date={date} />
              ))}
            </div>
          </>
        );

      case "week":
        return (
          <>
            <div className="grid grid-cols-7 gap-4 mb-4">
              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
                <div
                  key={day}
                  className="text-sm font-medium text-center text-muted-foreground"
                >
                  {day}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-4">
              {days.map((date, index) => (
                <DayCell key={index} date={date} />
              ))}
            </div>
          </>
        );

      case "day":
        return (
          <div className="space-y-4">
            <div className="text-sm font-medium text-center text-muted-foreground">
              {selectedDate.toLocaleDateString("en-US", { weekday: "long" })}
            </div>
            <div className="max-w-md mx-auto">
              <DayCell date={days[0]} />
            </div>
          </div>
        );
    }
  };

  return (
    <div className="container max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Calendar</h1>
          <p className="text-muted-foreground">
            Track your habit progress over time
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Select value={selectedView} onValueChange={setSelectedView}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Select view" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="month">Month View</SelectItem>
              <SelectItem value="week">Week View</SelectItem>
              <SelectItem value="day">Day View</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={() => setSelectedDate(new Date())}>
            Today
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Current Streak
            </CardTitle>
            <Flame className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">15 days</div>
            <p className="text-xs text-muted-foreground">+2 from last week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Completion Rate
            </CardTitle>
            <Trophy className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">89%</div>
            <p className="text-xs text-muted-foreground">+5% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Perfect Days</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24 days</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>
      </div>

      {/* Calendar Navigation */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => handleNavigation(-1)}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <h2 className="text-lg font-semibold">{getNavigationLabel()}</h2>
          <Button
            variant="outline"
            size="icon"
            onClick={() => handleNavigation(1)}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Info className="w-4 h-4" />
          Click on any day to see detailed stats
        </div>
      </div>

      {/* Calendar Grid */}
      <Card>
        <CardContent className="p-4">{renderCalendarGrid()}</CardContent>
      </Card>

      {/* Habits Legend */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Your Habits</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            {habits.map((habit) => (
              <div key={habit.id} className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full bg-${habit.color}`} />
                <span className="text-sm">{habit.name}</span>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Flame className="w-3 h-3" />
                  {habit.streak}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
