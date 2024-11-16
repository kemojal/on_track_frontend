import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "./ui/dialog";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useHabitStore, useBillingStore } from "@/lib/store";
import { Sparkles } from "lucide-react";
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
  Palette,
  Settings,
  Sun,
  Moon,
  Clock,
  Flag,
  CalendarDays,
  CalendarRange,
  Calendar,
  Check,
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { DateTimePicker } from "@/components/ui/datetime-picker";

const colors = [
  "from-purple-500 to-pink-500",
  "from-blue-500 to-cyan-500",
  "from-green-500 to-emerald-500",
  "from-yellow-500 to-orange-500",
];

const emojis = ["✨", "🌟", "💫", "⭐️", "🎯", "🎨", "📚", "💪", "🧘‍♀️", "🏃‍♀️"];

const NewHabitDialog = () => {
  const { isNewHabitOpen, setIsNewHabitOpen, addHabit, isPro } =
    useHabitStore();

  const { usageLimits, setIsUpgradeDialogOpen } = useBillingStore();

  const [selectedColor, setSelectedColor] = useState(colors[0]);
  const [selectedEmoji, setSelectedEmoji] = useState(emojis[0]);

  const [name, setName] = useState("");
  const [timeOfDay, setTimeOfDay] = useState("");
  const [priority, setPriority] = useState("");
  const [repeatType, setRepeatType] = useState("");
  const [selectedDays, setSelectedDays] = useState([]);
  const [reminderEnabled, setReminderEnabled] = useState(false);
  const [reminderTime, setReminderTime] = useState("");
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [notes, setNotes] = useState("");
  const [showUpgradePrompt, setShowUpgradePrompt] = useState(false);

  const canAddHabit =
    isPro || usageLimits?.habits?.used < usageLimits?.habits?.total;

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
        timeOfDay,
        priority,
        repeatType,
        color: selectedColor,
        emoji: selectedEmoji,
        reminderEnabled,
        reminderTime,
        startDate: startDate?.toISOString(),
        endDate: endDate?.toISOString(),
        notes,
      };

      // Use the new addHabit function which will automatically update billing limits
      addHabit(newHabit);

      // Reset form
      setName("");
      setTimeOfDay("");
      setPriority("");
      setRepeatType("");
      setSelectedColor(colors[0]);
      setSelectedEmoji(emojis[0]);
      setReminderEnabled(false);
      setReminderTime("");
      setStartDate(undefined);
      setEndDate(undefined);
      setNotes("");

      // Close dialog
      setIsNewHabitOpen(false);
    }
  };

  const handleSubmit = () => {
    // Check limit again before submitting
    if (!isPro && usageLimits?.habits?.used >= usageLimits?.habits?.total) {
      setShowUpgradePrompt(true);
      return;
    }

    handleCreateHabit();
  };

  const onClose = () => {
    setShowUpgradePrompt(false);
    setIsNewHabitOpen(false);
  };

  useEffect(() => {
    if (!isPro && usageLimits?.habits?.used >= usageLimits?.habits?.total) {
      setShowUpgradePrompt(true);
    }
  }, [isPro, usageLimits?.habits?.used, usageLimits?.habits?.total]);

  const handleUpgradeClick = () => {
    setIsNewHabitOpen(false);
    setIsUpgradeDialogOpen(true);
  };

  const toggleSelectedDay = (day: number) => {
    if (selectedDays.includes(day)) {
      setSelectedDays(selectedDays.filter((d) => d !== day));
    } else {
      setSelectedDays([...selectedDays, day]);
    }
  };

  if (!isPro && showUpgradePrompt) {
    return (
      <Dialog open={isNewHabitOpen} onOpenChange={setIsNewHabitOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <div className="mx-auto w-12 h-12 rounded-full bg-gradient-to-br from-violet-600 to-purple-600 flex items-center justify-center mb-4">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <DialogTitle className="text-center text-xl">
              Habit Limit Reached
            </DialogTitle>
            <DialogDescription className="text-center">
              <div className="space-y-2">
                <p className="text-sm">
                  You're currently using{" "}
                  <span className="font-semibold text-purple-600 dark:text-purple-400">
                    {usageLimits?.habits?.used}
                  </span>{" "}
                  out of{" "}
                  <span className="font-semibold text-purple-600 dark:text-purple-400">
                    {usageLimits?.habits?.total}
                  </span>{" "}
                  habits
                </p>
              </div>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex-col gap-2 sm:flex-col">
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 h-11"
              onClick={handleUpgradeClick}
            >
              Upgrade Now
            </Button>
            <Button
              variant="outline"
              className="w-full h-11"
              onClick={() => {
                setShowUpgradePrompt(false);
                setIsNewHabitOpen(false);
              }}
            >
              Maybe Later
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

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
                  <Palette className="w-4 h-4" />
                  Basic
                </div>
              </TabsTrigger>
              <TabsTrigger
                value="style"
                className="rounded-md data-[state=active]:bg-white dark:data-[state=active]:bg-gray-950 data-[state=active]:text-purple-600 dark:data-[state=active]:text-purple-400 data-[state=active]:shadow-sm transition-all"
              >
                <div className="flex items-center gap-2">
                  <Settings className="w-4 h-4" />
                  Style
                </div>
              </TabsTrigger>
              <TabsTrigger
                value="advanced"
                className="rounded-md data-[state=active]:bg-white dark:data-[state=active]:bg-gray-950 data-[state=active]:text-purple-600 dark:data-[state=active]:text-purple-400 data-[state=active]:shadow-sm transition-all"
              >
                <div className="flex items-center gap-2">
                  <Sun className="w-4 h-4" />
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
                      <div className="flex gap-2 p-2">
                        <SelectItem
                          value="morning"
                          className="flex-1 flex items-center justify-center gap-2 rounded-lg p-3 hover:bg-accent cursor-pointer"
                        >
                          <Sun className="w-4 h-4 text-orange-500" />
                          Morning
                        </SelectItem>
                        <SelectItem
                          value="afternoon"
                          className="flex-1 flex items-center justify-center gap-2 rounded-lg p-3 hover:bg-accent cursor-pointer"
                        >
                          <Sun className="w-4 h-4 text-yellow-500" />
                          Afternoon
                        </SelectItem>
                        <SelectItem
                          value="evening"
                          className="flex-1 flex items-center justify-center gap-2 rounded-lg p-3 hover:bg-accent cursor-pointer"
                        >
                          <Moon className="w-4 h-4 text-blue-500" />
                          Evening
                        </SelectItem>
                        <SelectItem
                          value="anytime"
                          className="flex-1 flex items-center justify-center gap-2 rounded-lg p-3 hover:bg-accent cursor-pointer"
                        >
                          <Clock className="w-4 h-4 text-purple-500" />
                          Anytime
                        </SelectItem>
                      </div>
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
                      <div className="flex gap-2 p-2">
                        <SelectItem
                          value="daily"
                          className="flex-1 flex items-center justify-center gap-2 rounded-lg p-3 hover:bg-accent cursor-pointer"
                        >
                          <CalendarDays className="w-4 h-4" />
                          Daily
                        </SelectItem>
                        <SelectItem
                          value="weekly"
                          className="flex-1 flex items-center justify-center gap-2 rounded-lg p-3 hover:bg-accent cursor-pointer"
                        >
                          <CalendarRange className="w-4 h-4" />
                          Weekly
                        </SelectItem>
                        <SelectItem
                          value="monthly"
                          className="flex-1 flex items-center justify-center gap-2 rounded-lg p-3 hover:bg-accent cursor-pointer"
                        >
                          <Calendar className="w-4 h-4" />
                          Monthly
                        </SelectItem>
                      </div>
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
                  <div className="flex flex-col gap-2">
                    <DateTimePicker
                      date={startDate}
                      setDate={setStartDate}
                      label="Start Date"
                      placeholder="Start Date"
                    />
                    <DateTimePicker
                      date={endDate}
                      setDate={(date) => {
                        // Only allow setting end date if it's after start date
                        if (startDate && date && date < startDate) {
                          return;
                        }
                        setEndDate(date);
                      }}
                      label="End Date (Optional)"
                      placeholder="End Date"
                      disabled={!startDate} // Disable end date picker until start date is selected
                      fromDate={startDate} // Minimum selectable date is the start date
                    />
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
            disabled={!name.trim() || !canAddHabit}
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
