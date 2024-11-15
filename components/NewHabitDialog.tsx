import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter} from "./ui/dialog";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useHabitStore } from "@/lib/store";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "./ui/tabs";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "./ui/select";
import { Switch } from "./ui/switch";
import { Textarea } from "./ui/textarea";
import {
  Sparkles,
  Palette,
  Settings,
  Sun,
  Moon,
  Clock,
  Flag,
  CalendarDays,
  CalendarRange,
  Calendar,
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";


const colors = [
  "from-purple-500 to-pink-500",
  "from-blue-500 to-cyan-500",
  "from-green-500 to-emerald-500",
  "from-yellow-500 to-orange-500",
];

const emojis = ["✨", "🌟", "💫", "⭐️", "🎯", "🎨", "📚", "💪", "🧘‍♀️", "🏃‍♀️"];

const NewHabitDialog = () => {
  const {
    isNewHabitOpen,
    setIsNewHabitOpen,
    habits,
    setHabits,
  } = useHabitStore();

  const [selectedColor, setSelectedColor] = useState(colors[0]);
  const [selectedEmoji, setSelectedEmoji] = useState(emojis[0]);

  const [name, setName] = useState("");
  const [timeOfDay, setTimeOfDay] = useState("");
  const [priority, setPriority] = useState("");
  const [repeatType, setRepeatType] = useState("");
  const [selectedDays, setSelectedDays] = useState([]);
  const [reminderEnabled, setReminderEnabled] = useState(false);
  const [reminderTime, setReminderTime] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [notes, setNotes] = useState("");

  const handleColorSelect = (color: string) => {
    setSelectedColor(color);
  };

  const handleEmojiSelect = (emoji: string) => {
    setSelectedEmoji(emoji);
  };

  const handleCreateHabit = () => {
    if (name.trim()) {
      const newHabit = {
        id: Math.random().toString(36).substr(2, 9),
        name: name.trim(),
        completedDates: [],
        pomodoroSessions: 0,
        color: selectedColor,
        emoji: selectedEmoji,
        streak: 0,
        timeOfDay,
        priority,
        repeatType,
        selectedDays,
        reminderEnabled,
        reminderTime,
        startDate,
        endDate,
        notes,
      };
      setHabits([...habits, newHabit]);
      setName("");
      setIsNewHabitOpen(false);
    }
  };

  const toggleSelectedDay = (day: number) => {
    if (selectedDays.includes(day)) {
      setSelectedDays(selectedDays.filter((d) => d !== day));
    } else {
      setSelectedDays([...selectedDays, day]);
    }
  };

  const handleSubmit = () => {
    handleCreateHabit();
  };

  const onClose = () => {
    setIsNewHabitOpen(false);
  };

  return (
    <Dialog open={isNewHabitOpen} onOpenChange={setIsNewHabitOpen}>
      <DialogContent className="sm:max-w-[600px] p-0 gap-0 overflow-hidden bg-gradient-to-b from-white to-gray-50 dark:from-gray-950 dark:to-gray-900">
        <DialogHeader className="p-6 pb-4">
          <DialogTitle className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">
            Create New Habit
          </DialogTitle>
          <DialogDescription className="text-base text-gray-500 dark:text-gray-400">
            Design your path to success, one habit at a time.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="basic" className="w-full">
          <div className="px-6">
            <TabsList className="grid w-full grid-cols-3 h-11 items-center bg-gray-100/80 dark:bg-gray-800/50 p-1 rounded-lg gap-1">
              <TabsTrigger
                value="basic"
                className="rounded-md data-[state=active]:bg-white dark:data-[state=active]:bg-gray-950 data-[state=active]:text-purple-600 dark:data-[state=active]:text-purple-400 data-[state=active]:shadow-sm transition-all"
              >
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  Basic
                </div>
              </TabsTrigger>
              <TabsTrigger
                value="style"
                className="rounded-md data-[state=active]:bg-white dark:data-[state=active]:bg-gray-950 data-[state=active]:text-purple-600 dark:data-[state=active]:text-purple-400 data-[state=active]:shadow-sm transition-all"
              >
                <div className="flex items-center gap-2">
                  <Palette className="w-4 h-4" />
                  Style
                </div>
              </TabsTrigger>
              <TabsTrigger
                value="advanced"
                className="rounded-md data-[state=active]:bg-white dark:data-[state=active]:bg-gray-950 data-[state=active]:text-purple-600 dark:data-[state=active]:text-purple-400 data-[state=active]:shadow-sm transition-all"
              >
                <div className="flex items-center gap-2">
                  <Settings className="w-4 h-4" />
                  Advanced
                </div>
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="px-6 mt-6">
            <TabsContent value="basic" className="space-y-4 mt-0">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-medium">
                    Habit Name
                  </Label>
                  <Input
                    id="name"
                    placeholder="Enter habit name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="h-11"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Time of Day</Label>
                  <Select onValueChange={(val) => setTimeOfDay(val)}>
                    <SelectTrigger className="h-11">
                      <SelectValue placeholder="When do you want to do this?" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem
                        value="morning"
                        className="flex items-center gap-2"
                      >
                        <Sun className="w-4 h-4 text-orange-500" />
                        Morning
                      </SelectItem>
                      <SelectItem
                        value="afternoon"
                        className="flex items-center gap-2"
                      >
                        <Sun className="w-4 h-4 text-yellow-500" />
                        Afternoon
                      </SelectItem>
                      <SelectItem
                        value="evening"
                        className="flex items-center gap-2"
                      >
                        <Moon className="w-4 h-4 text-blue-500" />
                        Evening
                      </SelectItem>
                      <SelectItem
                        value="anytime"
                        className="flex items-center gap-2"
                      >
                        <Clock className="w-4 h-4 text-purple-500" />
                        Anytime
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Priority</Label>
                  <div className="grid grid-cols-3 gap-2">
                    {["low", "medium", "high"].map((p) => (
                      <Button
                        key={p}
                        type="button"
                        variant={priority === p ? "default" : "outline"}
                        className={cn(
                          "h-11 capitalize",
                          priority === p &&
                            "bg-gradient-to-r from-purple-600 to-pink-600 text-white border-0"
                        )}
                        onClick={() => setPriority(p)}
                      >
                        <Flag
                          className={cn(
                            "w-4 h-4 mr-2",
                            p === "low" && "text-green-500",
                            p === "medium" && "text-yellow-500",
                            p === "high" && "text-red-500"
                          )}
                        />
                        {p}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="style" className="mt-0">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Color Theme</Label>
                  <div className="grid grid-cols-4 gap-2">
                    {colors.map((color, index) => (
                      <motion.button
                        key={index}
                        type="button"
                        onClick={() => handleColorSelect(color)}
                        className={cn(
                          "w-full h-11 rounded-lg bg-gradient-to-br transition-all",
                          color,
                          selectedColor === color
                            ? "ring-2 ring-purple-600 scale-95"
                            : "hover:scale-95"
                        )}
                        whileHover={{ scale: 0.97 }}
                        whileTap={{ scale: 0.95 }}
                      />
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Choose Emoji</Label>
                  <div className="grid grid-cols-5 gap-2">
                    {emojis.map((emoji, index) => (
                      <motion.button
                        key={index}
                        type="button"
                        onClick={() => handleEmojiSelect(emoji)}
                        className={cn(
                          "w-full h-11 rounded-lg bg-white dark:bg-gray-800 flex items-center justify-center text-xl transition-all",
                          selectedEmoji === emoji
                            ? "ring-2 ring-purple-600 scale-95"
                            : "hover:scale-95"
                        )}
                        whileHover={{ scale: 0.97 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {emoji}
                      </motion.button>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="advanced" className="mt-0">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Repeat</Label>
                  <Select onValueChange={(val) => setRepeatType(val)}>
                    <SelectTrigger className="h-11">
                      <SelectValue placeholder="How often?" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem
                        value="daily"
                        className="flex items-center gap-2"
                      >
                        <CalendarDays className="w-4 h-4" />
                        Daily
                      </SelectItem>
                      <SelectItem
                        value="weekly"
                        className="flex items-center gap-2"
                      >
                        <CalendarRange className="w-4 h-4" />
                        Weekly
                      </SelectItem>
                      <SelectItem
                        value="monthly"
                        className="flex items-center gap-2"
                      >
                        <Calendar className="w-4 h-4" />
                        Monthly
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  {repeatType === "weekly" && (
                    <div className="pt-2">
                      <Label className="text-sm font-medium mb-2 block">
                        Select Days
                      </Label>
                      <div className="flex gap-1">
                        {["M", "T", "W", "T", "F", "S", "S"].map((day, i) => (
                          <motion.button
                            key={i}
                            type="button"
                            onClick={() => toggleSelectedDay(i)}
                            className={cn(
                              "w-9 h-9 rounded-lg flex items-center justify-center text-sm font-medium transition-all",
                              selectedDays.includes(i)
                                ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                                : "bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"
                            )}
                            whileHover={{ scale: 0.95 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            {day}
                          </motion.button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium">Reminder</Label>
                    <Switch
                      checked={reminderEnabled}
                      onCheckedChange={setReminderEnabled}
                    />
                  </div>
                  {reminderEnabled && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="pt-2"
                    >
                      <Input
                        type="time"
                        value={reminderTime}
                        onChange={(e) => setReminderTime(e.target.value)}
                        className="h-11"
                      />
                    </motion.div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">Date Range</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label className="text-xs text-gray-500 dark:text-gray-400">
                        Start
                      </Label>
                      <Input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="h-11"
                      />
                    </div>
                    <div>
                      <Label className="text-xs text-gray-500 dark:text-gray-400">
                        End (Optional)
                      </Label>
                      <Input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="h-11"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">Notes</Label>
                  <Textarea
                    placeholder="Add any additional notes..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="min-h-[100px] resize-none"
                  />
                </div>
              </div>
            </TabsContent>
          </div>
        </Tabs>

        <DialogFooter className="px-6 py-4 bg-gray-50 dark:bg-gray-900 mt-6">
          <Button variant="outline" onClick={onClose} className="h-11">
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!name.trim()}
            className="h-11 bg-gradient-to-r from-purple-600 to-pink-600 text-white"
          >
            Create Habit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default NewHabitDialog;
