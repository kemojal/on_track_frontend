import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { useHabitStore } from "@/lib/store"; // Import the store

const colors = [
  "from-purple-500 to-pink-500",
  "from-blue-500 to-cyan-500",
  "from-green-500 to-emerald-500",
  "from-yellow-500 to-orange-500",
];

const emojis = ["✨", "🌟", "💫", "⭐️", "🎯", "🎨", "📚", "💪", "🧘‍♀️", "🏃‍♀️"];

const NewHabitDialog = () => {
  // Get everything we need from the store
  const {
    isNewHabitOpen,
    setIsNewHabitOpen,
    newHabitName,
    setNewHabitName,
    habits,
    setHabits,
    addHabit,
  } = useHabitStore();

  const handleColorSelect = (color: string) => {
    if (newHabitName.trim()) {
      const newHabit = {
        id: Math.random().toString(36).substr(2, 9),
        name: newHabitName.trim(),
        completedDates: [],
        pomodoroSessions: 0,
        color: color,
        emoji: emojis[Math.floor(Math.random() * emojis.length)],
        streak: 0,
      };
      setHabits([...habits, newHabit]);
      setNewHabitName("");
      setIsNewHabitOpen(false);
    }
  };

  const handleEmojiSelect = (emoji: string) => {
    if (newHabitName.trim()) {
      const newHabit = {
        id: Math.random().toString(36).substr(2, 9),
        name: newHabitName.trim(),
        completedDates: [],
        pomodoroSessions: 0,
        color: colors[Math.floor(Math.random() * colors.length)],
        emoji: emoji,
        streak: 0,
      };
      setHabits([...habits, newHabit]);
      setNewHabitName("");
      setIsNewHabitOpen(false);
    }
  };

  return (
    <Dialog open={isNewHabitOpen} onOpenChange={setIsNewHabitOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New Habit</DialogTitle>
          <DialogDescription>
            Add a new habit to track. What would you like to improve?
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="habit-name">Habit Name</Label>
            <Input
              id="habit-name"
              placeholder="e.g., Read for 30 minutes, Meditate, Exercise"
              value={newHabitName}
              onChange={(e) => setNewHabitName(e.target.value)}
              className="w-full"
            />
          </div>
          <div className="space-y-2">
            <Label>Choose Color Theme</Label>
            <div className="grid grid-cols-4 gap-2">
              {colors.map((color, index) => (
                <Button
                  key={index}
                  className={`w-full h-10 rounded-lg bg-gradient-to-br ${color} hover:opacity-90 transition-opacity`}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleColorSelect(color);
                  }}
                />
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <Label>Choose Emoji</Label>
            <div className="grid grid-cols-5 gap-2">
              {emojis.map((emoji, index) => (
                <TooltipProvider key={index}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        className="w-full h-10 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 flex items-center justify-center text-lg transition-colors"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleEmojiSelect(emoji);
                        }}
                      >
                        {emoji}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Select this emoji</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ))}
            </div>
          </div>
          <div className="flex justify-end gap-4 pt-4">
            <Button
              variant="outline"
              onClick={() => {
                setNewHabitName("");
                setIsNewHabitOpen(false);
              }}
            >
              Cancel
            </Button>
            <Button
              className="bg-gradient-to-r from-violet-500 to-purple-500 text-white hover:opacity-90"
              onClick={() => addHabit(newHabitName)}
              disabled={!newHabitName.trim()}
            >
              Add Habit
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NewHabitDialog;
