import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Calendar, ChevronRight } from "lucide-react";
import { Button } from "./ui/button";
import { useHabitStore } from "@/lib/store";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

const weekDays = [
  { value: "0", label: "Sunday" },
  { value: "1", label: "Monday" },
  { value: "2", label: "Tuesday" },
  { value: "3", label: "Wednesday" },
  { value: "4", label: "Thursday" },
  { value: "5", label: "Friday" },
  { value: "6", label: "Saturday" },
];

const TrackingCard = () => {
  const { timezone, weekStartsOn, setTimezone, setWeekStartsOn } =
    useHabitStore();
  const [isTimeZoneOpen, setIsTimeZoneOpen] = useState(false);
  const [isWeekStartOpen, setIsWeekStartOpen] = useState(false);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-primary" />
          Tracking Preferences
        </CardTitle>
        <CardDescription>
          Customize your habit tracking experience
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Dialog open={isTimeZoneOpen} onOpenChange={setIsTimeZoneOpen}>
          <DialogTrigger asChild>
            <div className="flex items-center justify-between p-4 rounded-xl bg-card hover:bg-accent/5 transition-colors cursor-pointer">
              <div>
                <h3 className="font-medium">Time Zone</h3>
                <p className="text-sm text-muted-foreground">
                  Currently set to {timezone}
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground"
              >
                Change
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Select Time Zone</DialogTitle>
            </DialogHeader>
            <Select
              value={timezone}
              onValueChange={(value) => {
                setTimezone(value);
                setIsTimeZoneOpen(false);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a timezone" />
              </SelectTrigger>
              <SelectContent>
                {Intl.supportedValuesOf("timeZone").map((tz) => (
                  <SelectItem key={tz} value={tz}>
                    {tz}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </DialogContent>
        </Dialog>

        <Dialog open={isWeekStartOpen} onOpenChange={setIsWeekStartOpen}>
          <DialogTrigger asChild>
            <div className="flex items-center justify-between p-4 rounded-xl bg-card hover:bg-accent/5 transition-colors cursor-pointer">
              <div>
                <h3 className="font-medium">Week Starts On</h3>
                <p className="text-sm text-muted-foreground">
                  Currently set to{" "}
                  {
                    weekDays.find(
                      (day) => day.value === weekStartsOn.toString()
                    )?.label
                  }
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground"
              >
                Change
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Select Week Start Day</DialogTitle>
            </DialogHeader>
            <Select
              value={weekStartsOn.toString()}
              onValueChange={(value) => {
                setWeekStartsOn(parseInt(value) as 0 | 1 | 2 | 3 | 4 | 5 | 6);
                setIsWeekStartOpen(false);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select start day" />
              </SelectTrigger>
              <SelectContent>
                {weekDays.map((day) => (
                  <SelectItem key={day.value} value={day.value}>
                    {day.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default TrackingCard;
