"use client";

import React, { useState } from "react";

import { useHabitStore } from "@/lib/store";

import { Settings, ChevronRight, ChevronLeft, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import NewHabitDialog from "@/components/NewHabitDialog";
import { formatDate, getDatesInRange } from "@/lib/utils";
import { ProDialog, SettingsDialog } from "@/components/SettingsDialog";

export interface Habit {
  id: string;
  name: string;
  completedDates: string[];
  pomodoroSessions: number;
  color?: string;
  emoji?: string;
  streak?: number;
}

export default function Component() {
  const {
    habits,
    startDate,
    toggleHabitCompletion,
    adjustDates,
    setIsNewHabitOpen,
  } = useHabitStore();
  const [theme, setTheme] = useState("light");


  const dates = getDatesInRange(startDate, 15);

  const toggleTheme = (newTheme) => {
    setTheme(newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
  };


  return (
    <div className="min-h-screen bg-background flex">
      <div className="flex-1 p-6">
        <header className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4 ml-auto">
            {/* <Button variant="ghost" size="icon" className="rounded-xl">
              <Settings className="w-5 h-5" />
            </Button> */}
            <SettingsDialog  />
            <ProDialog />
            {/* <Button className="rounded-xl bg-gradient-to-r from-violet-500 to-purple-500 text-white hover:opacity-90">
              <span className="mr-2">👑</span>
              Upgrade to Pro
            </Button> */}
          </div>
        </header>

        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => adjustDates(-15)}
                className="hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl"
              >
                <ChevronLeft className="w-5 h-5" />
              </Button>
              <h2 className="text-lg font-semibold">
                {startDate.toLocaleString("default", {
                  month: "long",
                  year: "numeric",
                })}
              </h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => adjustDates(15)}
                className="hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl"
              >
                <ChevronRight className="w-5 h-5" />
              </Button>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
            <div className="grid grid-cols-[200px_repeat(15,minmax(60px,1fr))] border-b border-gray-200 dark:border-gray-800">
              <div className="p-4 font-medium flex items-center gap-4">
                HABITS
              </div>
              {dates.map((date, i) => {
                const formattedDate = formatDate(date);
                return (
                  <div
                    key={i}
                    className={`p-4 text-center border-l border-gray-200 dark:border-gray-800 ${
                      date.toDateString() === new Date().toDateString()
                        ? "bg-violet-50 text-violet-500 dark:bg-violet-900/20"
                        : ""
                    }`}
                  >
                    <div className="font-medium text-muted-foreground dark:text-gray-400 text-xs">
                      {formattedDate.month}
                    </div>
                    <div className=" font-bold">{formattedDate.day}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400 text-xs">
                      {formattedDate.weekday}
                    </div>
                  </div>
                );
              })}
            </div>

            <ScrollArea className="max-h-[calc(100vh-300px)]">
              <div className="grid grid-cols-[200px_repeat(15,minmax(60px,1fr))]">
                {habits.map((habit) => (
                  <div key={habit.id} className="contents">
                    <div className="p-4 flex items-center gap-3 border-b border-gray-200 dark:border-gray-800">
                      <div
                        className={`w-8 h-8 rounded-lg bg-gradient-to-br ${habit.color} flex items-center justify-center text-white`}
                      >
                        {habit.emoji}
                      </div>
                      <span className="font-medium">{habit.name}</span>
                    </div>
                    {dates.map((date, i) => {
                      const isCompleted = habit.completedDates.includes(
                        date.toISOString().split("T")[0]
                      );
                      return (
                        <button
                          key={i}
                          className={`border-l border-b border-gray-200 dark:border-gray-800 p-4 relative group transition-all duration-200 ${
                            isCompleted
                              ? "bg-violet-50 dark:bg-violet-900/20"
                              : ""
                          }`}
                          onClick={() => toggleHabitCompletion(habit.id, date)}
                        >
                          <div
                            className={`absolute inset-2 rounded-lg transition-all duration-200 ${
                              isCompleted
                                ? "bg-gradient-to-br from-violet-500 to-purple-500 scale-100 opacity-100"
                                : "scale-80 opacity-0"
                            }`}
                          />
                          <div
                            className={`absolute inset-2 bg-gray-100 dark:bg-gray-800 rounded-lg transition-all duration-200 ${
                              !isCompleted && "group-hover:opacity-100"
                            } opacity-0`}
                          />
                        </button>
                      );
                    })}
                  </div>
                ))}
              </div>
              <div className="p-4">
                <Button
                  variant="ghost"
                  className="justify-start px-4"
                  onClick={() => setIsNewHabitOpen(true)}
                >
                  <Plus className="w-4 h-4" />
                  New Habit
                </Button>
              </div>
            </ScrollArea>
          </div>
        </div>
      </div>

      <NewHabitDialog />
    </div>
  );
}
