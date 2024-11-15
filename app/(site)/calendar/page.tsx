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
  Calendar1Icon as CalendarIcon,
  CheckCircle2,
  XCircle,
  Info,
  Plus,
  Filter,
  Share2,
  Download,
  TrendingUp,
  Star,
  Clock,
 
 

} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useHabitStore } from "@/lib/store";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import NewHabitDialog from "@/components/NewHabitDialog";
import {
  FileJson,
  FileSpreadsheet,
  Twitter,
  Linkedin,
  Copy,
} from "lucide-react";

import { toast } from "@/hooks/use-toast";
import { btoa } from "@/lib/btoa";
import { ExternalLink, ArrowRight, Users } from "lucide-react";

export default function CalendarPage() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedView, setSelectedView] = useState("month");
  const [showDayDialog, setShowDayDialog] = useState(false);
  const [selectedDayDetails, setSelectedDayDetails] = useState(null);
  const [selectedHabits, setSelectedHabits] = useState([]);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const { habits, setIsNewHabitOpen } = useHabitStore();

  // Filter habits based on selection
  const filteredHabits =
    selectedHabits.length > 0
      ? habits.filter((habit) => selectedHabits.includes(habit.id))
      : habits;

  const getCompletionData = (date) => {
    return filteredHabits.map((habit) => ({
      habitId: habit.id,
      completed: Math.random() > 0.3,
      notes: "Sample note for this habit",
      completedAt: new Date(),
    }));
  };

  const DayCell = ({ date, isCompact = false }) => {
    const completions = getCompletionData(date);
    const isToday = new Date().toDateString() === date.toDateString();
    const isPast = date < new Date();
    const isCurrentMonth = date.getMonth() === selectedDate.getMonth();
    const completionRate =
      completions.filter((c) => c.completed).length / completions.length;

    return (
      <div
        onClick={() => handleDayClick(date)}
        className={`group relative ${
          isCompact ? "h-24" : "h-32"
        } p-3 border rounded-xl transition-all duration-300 
          ${
            isToday
              ? "bg-violet-50 dark:bg-violet-900/20 border-violet-300 ring-2 ring-violet-200 dark:ring-violet-800 ring-offset-2"
              : isPast
              ? "hover:border-violet-200 dark:hover:border-violet-800 hover:bg-violet-50/30 hover:shadow-md"
              : "opacity-50"
          } 
          ${!isCurrentMonth ? "opacity-40" : ""}
          cursor-pointer hover:scale-[1.02] transform transition-all duration-300
        `}
      >
        <div className="flex justify-between items-start mb-2">
          <div className="flex flex-col">
            <span
              className={`text-sm font-medium ${
                isToday
                  ? "text-violet-600 dark:text-violet-400"
                  : isCurrentMonth
                  ? "text-gray-900"
                  : "text-gray-500"
              }`}
            >
              {isCompact ? (
                <div className="flex flex-col">
                  <span className="text-[10px] text-gray-400">
                    {date.toLocaleDateString("en-US", { weekday: "short" })}
                  </span>
                  <span>{date.getDate()}</span>
                </div>
              ) : (
                date.getDate()
              )}
            </span>
            {isPast && completions.length > 0 && (
              <span className="text-[10px] text-gray-400">
                {completions.filter((c) => c.completed).length}/
                {completions.length}
              </span>
            )}
          </div>
          {isPast && (
            <div className="flex gap-1">
              {completionRate === 1 && (
                <div className="bg-green-400/10 rounded-full p-1">
                  <Trophy className="w-3 h-3 text-green-500" />
                </div>
              )}
              {completionRate >= 0.8 && completionRate < 1 && (
                <div className="bg-orange-400/10 rounded-full p-1">
                  <Star className="w-3 h-3 text-orange-500" />
                </div>
              )}
            </div>
          )}
        </div>

        {isPast && (
          <>
            <div
              className={`flex justify-center items-center gap-1 ${
                isCompact ? "h-[40%]" : "h-[60%]"
              }`}
            >
              {completions.map((completion, idx) => {
                const habit = habits.find((h) => h.id === completion.habitId);
                return (
                  <TooltipProvider key={idx}>
                    <Tooltip>
                      <TooltipTrigger>
                        <div
                          className={`w-2 ${
                            isCompact ? "h-8" : "h-12"
                          } rounded-full transition-all ${
                            completion.completed
                              ? `bg-gradient-to-b from-${habit.color} to-${habit.color}/80 hover:shadow-md`
                              : "bg-gradient-to-b from-gray-200 to-gray-300 hover:shadow-md"
                          }`}
                        />
                      </TooltipTrigger>
                      <TooltipContent
                        className="bg-white/80 backdrop-blur-sm border-violet-100 shadow-lg"
                        side="bottom"
                      >
                        <div className="flex items-center gap-2">
                          {completion.completed ? (
                            <CheckCircle2
                              className={`w-4 h-4 text-${habit.color}`}
                            />
                          ) : (
                            <XCircle className="w-4 h-4 text-gray-400" />
                          )}
                          <p className="font-medium text-violet-900">
                            {habit?.name}
                          </p>
                        </div>
                        {completion.notes && (
                          <p className="text-xs text-violet-600 mt-1">
                            {completion.notes}
                          </p>
                        )}
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                );
              })}
            </div>
            {/* Mini Progress Bar */}
            <div className="absolute bottom-2 left-2 right-2">
              <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-violet-400 to-violet-500 rounded-full transition-all duration-300"
                  style={{ width: `${completionRate * 100}%` }}
                />
              </div>
            </div>
          </>
        )}
        {/* Day interaction hint */}
        <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center bg-violet-500/10 backdrop-blur-[1px]">
          <div className="bg-white/90 px-2 py-1 rounded text-xs text-violet-600 shadow-sm">
            Click for details
          </div>
        </div>
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

  const handleDayClick = (date) => {
    const completions = getCompletionData(date);
    setSelectedDayDetails({
      date,
      completions,
      completionRate:
        completions.filter((c) => c.completed).length / completions.length,
    });
    setShowDayDialog(true);
  };

  const handleExport = (format) => {
    const exportData = {
      habits: filteredHabits.map((habit) => ({
        name: habit.name,
        color: habit.color,
        completions: getCompletionData(selectedDate)
          .filter((c) => c.habitId === habit.id)
          .map((c) => ({
            date: format(selectedDate, "yyyy-MM-dd"),
            completed: c.completed,
            notes: c.notes,
            completedAt: c.completedAt,
          })),
      })),
      exportDate: new Date().toISOString(),
      dateRange: {
        start: format(selectedDate, "yyyy-MM-dd"),
        end: format(selectedDate, "yyyy-MM-dd"),
      },
    };

    const fileName = `habits-export-${format(new Date(), "yyyy-MM-dd")}`;

    if (format === "csv") {
      // Convert to CSV
      const csvContent = [
        ["Habit Name", "Date", "Completed", "Notes", "Completed At"],
        ...exportData.habits.flatMap((habit) =>
          habit.completions.map((c) => [
            habit.name,
            c.date,
            c.completed ? "Yes" : "No",
            c.notes,
            new Date(c.completedAt).toLocaleString(),
          ])
        ),
      ]
        .map((row) => row.join(","))
        .join("\n");

      const blob = new Blob([csvContent], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${fileName}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      // Export as JSON
      const blob = new Blob([JSON.stringify(exportData, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${fileName}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const generateShareableLink = () => {
    const shareData = {
      habits: filteredHabits.map((h) => h.id),
      date: selectedDate.toISOString(),
      view: selectedView,
    };
    return `${window.location.origin}/calendar/share/${btoa(
      JSON.stringify(shareData)
    )}`;
  };

  return (
    <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Quick Actions Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl border shadow-sm">
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2 hover:bg-violet-50 hover:text-violet-600 transition-colors"
            onClick={() => setIsNewHabitOpen(true)}
          >
            <Plus className="h-4 w-4" />
            Add Habit
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <Filter className="w-4 h-4" />
                Filter View
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 bg-white/80 backdrop-blur-sm">
              <DropdownMenuLabel>Filter Habits</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {habits.map((habit) => (
                <DropdownMenuCheckboxItem
                  key={habit.id}
                  checked={
                    selectedHabits.length === 0 ||
                    selectedHabits.includes(habit.id)
                  }
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setSelectedHabits([...selectedHabits, habit.id]);
                    } else {
                      setSelectedHabits(
                        selectedHabits.filter((id) => id !== habit.id)
                      );
                    }
                  }}
                >
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-2 h-2 rounded-full bg-${habit.color}-500`}
                    />
                    {habit.name}
                  </div>
                </DropdownMenuCheckboxItem>
              ))}
              {habits.length > 0 && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuCheckboxItem
                    checked={selectedHabits.length === 0}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedHabits([]);
                      }
                    }}
                  >
                    Show All
                  </DropdownMenuCheckboxItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="flex items-center gap-2">
          <Select value={selectedView} onValueChange={setSelectedView}>
            <SelectTrigger className="w-40 shadow-sm">
              <SelectValue placeholder="Select view" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="month">Month View</SelectItem>
              <SelectItem value="week">Week View</SelectItem>
              <SelectItem value="day">Day View</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            onClick={() => setSelectedDate(new Date())}
            className="shadow-sm hover:shadow-md transition-all"
          >
            Today
          </Button>
        </div>
      </div>

      {/* Header with Stats */}
      <div className="space-y-6">
        <div className="flex flex-col gap-1">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
            Calendar
          </h2>
          <p className="text-muted-foreground">
            Track your habit progress over time
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
          <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 border-t-4 border-t-orange-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-base font-semibold">
                Current Streak
              </CardTitle>
              <div className="p-2 bg-orange-100 rounded-full">
                <Flame className="h-5 w-5 text-orange-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">15 days</div>
              <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                <span className="text-green-500">↑</span> +2 from last week
              </p>
            </CardContent>
          </Card>
          <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 border-t-4 border-t-yellow-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-base font-semibold">
                Completion Rate
              </CardTitle>
              <div className="p-2 bg-yellow-100 rounded-full">
                <Trophy className="h-5 w-5 text-yellow-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">89%</div>
              <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                <span className="text-green-500">↑</span> +5% from last month
              </p>
            </CardContent>
          </Card>
          <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 border-t-4 border-t-green-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-base font-semibold">
                Perfect Days
              </CardTitle>
              <div className="p-2 bg-green-100 rounded-full">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">24 days</div>
              <p className="text-sm text-muted-foreground mt-1">This month</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Calendar Navigation */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm p-4 rounded-2xl border shadow-sm">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => handleNavigation(-1)}
            className="hover:bg-violet-50 hover:text-violet-600 transition-colors"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <h2 className="text-xl font-semibold min-w-[200px] text-center">
            {getNavigationLabel()}
          </h2>
          <Button
            variant="outline"
            size="icon"
            onClick={() => handleNavigation(1)}
            className="hover:bg-violet-50 hover:text-violet-600 transition-colors"
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground bg-violet-50/50 dark:bg-violet-900/20 px-4 py-2 rounded-full">
          <Info className="w-4 h-4 text-violet-500" />
          <span>Click on any day to see detailed stats</span>
        </div>
      </div>

      {/* Calendar Grid */}
      <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
        <CardContent className="p-6">
          {selectedView === "month" && (
            <>
              {/* Progress Bar */}
              <div className="mb-8 group relative">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-medium text-gray-600">
                      Monthly Progress
                    </h3>
                    <Badge
                      variant="outline"
                      className="bg-violet-50 text-violet-600 hover:bg-violet-100"
                    >
                      <TrendingUp className="w-3 h-3 mr-1" />
                      +12% from last month
                    </Badge>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex -space-x-2">
                      {[...Array(3)].map((_, i) => (
                        <div
                          key={i}
                          className="w-6 h-6 rounded-full bg-gradient-to-r from-violet-400 to-violet-500 border-2 border-white flex items-center justify-center text-[10px] text-white font-medium"
                        >
                          {i + 1}
                        </div>
                      ))}
                    </div>
                    <span className="text-sm font-semibold text-violet-600">
                      78% Complete
                    </span>
                  </div>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-violet-500 to-indigo-500 rounded-full transition-all duration-500"
                    style={{ width: "78%" }}
                  />
                </div>
                <div className="absolute -bottom-6 left-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity text-xs text-center text-gray-500">
                  Best streak this month: 12 days
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="bg-violet-50/50 dark:bg-violet-900/20 rounded-lg p-3 border border-violet-100 dark:border-violet-800">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-violet-600">
                      Perfect Days
                    </span>
                    <span className="text-lg font-bold text-violet-700">
                      12
                    </span>
                  </div>
                </div>
                <div className="bg-green-50/50 dark:bg-green-900/20 rounded-lg p-3 border border-green-100 dark:border-green-800">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-green-600">
                      Current Streak
                    </span>
                    <span className="text-lg font-bold text-green-700">5</span>
                  </div>
                </div>
                <div className="bg-orange-50/50 dark:bg-orange-900/20 rounded-lg p-3 border border-orange-100 dark:border-orange-800">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-orange-600">
                      Total Habits
                    </span>
                    <span className="text-lg font-bold text-orange-700">8</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-7 gap-4 mb-6">
                {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(
                  (day) => (
                    <div
                      key={day}
                      className="text-sm font-semibold text-center text-violet-600 py-2"
                    >
                      {day}
                    </div>
                  )
                )}
              </div>
              <div className="grid grid-cols-7 gap-4">
                {generateCalendarDays(selectedView).map((date, index) => {
                  const isToday =
                    new Date().toDateString() === date.toDateString();
                  const isPast = date < new Date();
                  const isCurrentMonth =
                    date.getMonth() === selectedDate.getMonth();
                  const completions = getCompletionData(date);
                  const completionRate =
                    completions.filter((c) => c.completed).length /
                    completions.length;

                  return (
                    <div
                      key={index}
                      onClick={() => handleDayClick(date)}
                      className={`group relative h-32 p-3 border rounded-xl transition-all duration-300 
                        ${
                          isToday
                            ? "bg-violet-50 dark:bg-violet-900/20 border-violet-300 ring-2 ring-violet-200 ring-offset-2"
                            : isPast
                            ? "hover:border-violet-200 hover:bg-violet-50/30 hover:shadow-md"
                            : "opacity-50"
                        } 
                        ${!isCurrentMonth ? "opacity-40" : ""}
                        cursor-pointer hover:scale-[1.02] transform transition-all duration-300
                      `}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex flex-col">
                          <span
                            className={`text-sm font-medium ${
                              isToday
                                ? "text-violet-600 dark:text-violet-400"
                                : isCurrentMonth
                                ? "text-gray-900"
                                : "text-gray-500"
                            }`}
                          >
                            {date.getDate()}
                          </span>
                          {isPast && completions.length > 0 && (
                            <span className="text-[10px] text-gray-400">
                              {completions.filter((c) => c.completed).length}/
                              {completions.length}
                            </span>
                          )}
                        </div>
                        {isPast && (
                          <div className="flex gap-1">
                            {completionRate === 1 && (
                              <div className="bg-green-400/10 rounded-full p-1">
                                <Trophy className="w-3 h-3 text-green-500" />
                              </div>
                            )}
                            {completionRate >= 0.8 && completionRate < 1 && (
                              <div className="bg-orange-400/10 rounded-full p-1">
                                <Star className="w-3 h-3 text-orange-500" />
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      {/* ... existing habit bars and progress ... */}

                      {/* Day interaction hint */}
                      <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center bg-violet-500/10 backdrop-blur-[1px]">
                        <div className="bg-white/90 px-2 py-1 rounded text-xs text-violet-600 shadow-sm">
                          Click for details
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
          {selectedView !== "month" && renderCalendarGrid()}
        </CardContent>
      </Card>

      {/* Legend and Actions */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl border shadow-sm">
        <div className="flex flex-wrap items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-gradient-to-b from-green-400 to-green-500" />
            <span className="text-sm text-gray-600">Completed</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-gradient-to-b from-gray-200 to-gray-300" />
            <span className="text-sm text-gray-600">Not Completed</span>
          </div>
          <div className="flex items-center gap-2">
            <Trophy className="w-3 h-3 text-green-500" />
            <span className="text-sm text-gray-600">Perfect Day</span>
          </div>
          <div className="flex items-center gap-2">
            <Star className="w-3 h-3 text-orange-500" />
            <span className="text-sm text-gray-600">Almost Perfect</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="text-violet-600 hover:text-violet-700 hover:bg-violet-50"
              >
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 bg-white/90 backdrop-blur-sm border border-violet-100 shadow-lg animate-in slide-in-from-top-2">
              <DropdownMenuLabel className="text-violet-600 font-medium">
                Export Options
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-violet-100" />
              <DropdownMenuGroup>
                <DropdownMenuItem
                  onClick={() => handleExport("json")}
                  className="group cursor-pointer hover:bg-violet-50 focus:bg-violet-50"
                >
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-2">
                      <div className="p-1 rounded-md bg-violet-100 group-hover:bg-violet-200 transition-colors">
                        <FileJson className="w-4 h-4 text-violet-600" />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-medium">JSON</span>
                        <span className="text-xs text-gray-500">
                          Full data export
                        </span>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-violet-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleExport("csv")}
                  className="group cursor-pointer hover:bg-violet-50 focus:bg-violet-50 mt-1"
                >
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-2">
                      <div className="p-1 rounded-md bg-green-100 group-hover:bg-green-200 transition-colors">
                        <FileSpreadsheet className="w-4 h-4 text-green-600" />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-medium">CSV</span>
                        <span className="text-xs text-gray-500">
                          Spreadsheet friendly
                        </span>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-violet-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>

          <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
            <DialogTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="text-violet-600 hover:text-violet-700 hover:bg-violet-50"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] bg-white/95 backdrop-blur-md shadow-xl">
              <DialogHeader>
                <DialogTitle className="text-2xl font-semibold text-gray-900">
                  Share Your Progress
                </DialogTitle>
                <p className="text-gray-500 mt-1">
                  Share your habit tracking journey with others
                </p>
              </DialogHeader>
              <div className="grid gap-6 py-4">
                <div className="space-y-4">
                  <Label className="text-sm font-medium text-gray-700">
                    Quick Share
                  </Label>
                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      variant="outline"
                      size="lg"
                      className="group relative h-24 border-2 hover:border-violet-400 hover:bg-violet-50 transition-all"
                      onClick={() => {
                        const url = generateShareableLink();
                        window.open(
                          `https://twitter.com/intent/tweet?url=${encodeURIComponent(
                            url
                          )}&text=${encodeURIComponent(
                            "🎯 Check out my habit tracking progress! Building better habits, one day at a time. #ProductivityGoals #HabitTracking"
                          )}`,
                          "_blank"
                        );
                      }}
                    >
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="flex flex-col items-center gap-2">
                          <div className="p-2 rounded-full bg-blue-100 group-hover:bg-blue-200 transition-colors">
                            <Twitter className="w-5 h-5 text-blue-500" />
                          </div>
                          <span className="text-sm font-medium">Twitter</span>
                        </div>
                      </div>
                      <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <ExternalLink className="w-4 h-4 text-violet-400" />
                      </div>
                    </Button>
                    <Button
                      variant="outline"
                      size="lg"
                      className="group relative h-24 border-2 hover:border-violet-400 hover:bg-violet-50 transition-all"
                      onClick={() => {
                        const url = generateShareableLink();
                        window.open(
                          `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
                            url
                          )}`,
                          "_blank"
                        );
                      }}
                    >
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="flex flex-col items-center gap-2">
                          <div className="p-2 rounded-full bg-blue-100 group-hover:bg-blue-200 transition-colors">
                            <Linkedin className="w-5 h-5 text-blue-600" />
                          </div>
                          <span className="text-sm font-medium">LinkedIn</span>
                        </div>
                      </div>
                      <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <ExternalLink className="w-4 h-4 text-violet-400" />
                      </div>
                    </Button>
                  </div>
                </div>

                <div className="space-y-4">
                  <Label className="text-sm font-medium text-gray-700">
                    Shareable Link
                  </Label>
                  <div className="relative">
                    <Input
                      readOnly
                      value={generateShareableLink()}
                      className="pr-24 bg-gray-50/50 border-2 focus:border-violet-400 transition-all"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute right-1 top-1 bottom-1 hover:bg-violet-50 gap-2 text-violet-600"
                      onClick={() => {
                        navigator.clipboard.writeText(generateShareableLink());
                        toast({
                          title: "Link copied!",
                          description:
                            "The shareable link has been copied to your clipboard.",
                          duration: 3000,
                        });
                      }}
                    >
                      <Copy className="w-4 h-4" />
                      Copy
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500">
                    Anyone with this link can view your progress for the
                    selected habits
                  </p>
                </div>

                <div className="space-y-4">
                  <Label className="text-sm font-medium text-gray-700">
                    Customize Share
                  </Label>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 rounded-lg border-2 border-gray-100 hover:border-violet-200 transition-all">
                      <div className="flex items-center gap-3">
                        <Calendar className="w-5 h-5 text-violet-500" />
                        <div>
                          <p className="font-medium">Date Range</p>
                          <p className="text-sm text-gray-500">
                            Current view only
                          </p>
                        </div>
                      </div>
                      <Switch />
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg border-2 border-gray-100 hover:border-violet-200 transition-all">
                      <div className="flex items-center gap-3">
                        <Users className="w-5 h-5 text-violet-500" />
                        <div>
                          <p className="font-medium">Public Profile</p>
                          <p className="text-sm text-gray-500">
                            Show your profile info
                          </p>
                        </div>
                      </div>
                      <Switch />
                    </div>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Day Details Dialog */}
      <Dialog open={showDayDialog} onOpenChange={setShowDayDialog}>
        <DialogContent className="sm:max-w-[925px] bg-white/80 backdrop-blur-sm max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-xl font-semibold">
                  {selectedDayDetails?.date.toLocaleDateString("en-US", {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
                {selectedDayDetails?.completionRate === 1 && (
                  <div className="bg-green-400/10 rounded-full p-1">
                    <Trophy className="w-4 h-4 text-green-500" />
                  </div>
                )}
              </div>
              <Badge variant="outline" className="bg-violet-50 text-violet-600">
                {Math.round(selectedDayDetails?.completionRate * 100)}% Complete
              </Badge>
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4 grid-cols-2">
            {selectedDayDetails?.completions.map((completion, idx) => {
              const habit = habits.find((h) => h.id === completion.habitId);
              return (
                <div
                  key={idx}
                  className={`p-4 rounded-lg border transition-all ${
                    completion.completed
                      ? "bg-green-50/50 border-green-100"
                      : "bg-gray-50/50 border-gray-100"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {completion.completed ? (
                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                      ) : (
                        <XCircle className="w-5 h-5 text-gray-400" />
                      )}
                      <h3 className="font-medium text-gray-900">
                        {habit?.name}
                      </h3>
                    </div>
                    <Badge
                      variant="outline"
                      className={`${
                        completion.completed
                          ? "bg-green-50 text-green-600 border-green-200"
                          : "bg-gray-50 text-gray-600 border-gray-200"
                      }`}
                    >
                      {completion.completed ? "Completed" : "Missed"}
                    </Badge>
                  </div>
                  {completion.notes && (
                    <p className="text-sm text-gray-600 ml-7">
                      {completion.notes}
                    </p>
                  )}
                  <div className="flex items-center gap-2 ml-7 mt-2">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span className="text-xs text-gray-500">
                      Completed at{" "}
                      {new Date(completion.completedAt).toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Habit Dialog */}
      {/* <Dialog open={showAddHabitDialog} onOpenChange={setShowAddHabitDialog}>
        <DialogContent className="sm:max-w-[425px] bg-white/80 backdrop-blur-sm">
          <DialogHeader>
            <DialogTitle>Add New Habit</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Habit Name</Label>
              <Input
                id="name"
                placeholder="Enter habit name..."
                className="bg-white/50 dark:bg-gray-800/50"
              />
            </div>
            <div className="grid gap-2">
              <Label>Color</Label>
              <div className="flex flex-wrap gap-2">
                {["violet", "green", "blue", "red", "yellow", "pink"].map(
                  (color) => (
                    <button
                      key={color}
                      className={`w-8 h-8 rounded-full bg-${color}-500 hover:ring-2 ring-offset-2 ring-${color}-400 transition-all`}
                    />
                  )
                )}
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                placeholder="Enter habit description..."
                className="bg-white/50 dark:bg-gray-800/50"
              />
            </div>
            <div className="grid gap-2">
              <Label>Frequency</Label>
              <div className="flex flex-wrap gap-2">
                {["Daily", "Weekly", "Monthly"].map((freq) => (
                  <Button
                    key={freq}
                    variant="outline"
                    size="sm"
                    className="gap-2"
                  >
                    {freq}
                  </Button>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowAddHabitDialog(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                // TODO: Implement habit creation
                setShowAddHabitDialog(false);
              }}
            >
              Create Habit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog> */}
      <NewHabitDialog />
    </div>
  );
}
