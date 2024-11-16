"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Bell, Clock, Filter, Search, Settings, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useHabitStore } from "@/lib/store";

// Mock notification data
const mockNotifications = [
  {
    id: 1,
    title: "Habit Streak Milestone! 🎉",
    message: "Congratulations! You've maintained your meditation habit for 30 days straight!",
    time: "2 hours ago",
    type: "achievement",
    read: false,
  },
  {
    id: 2,
    title: "New Feature Available ✨",
    message: "Try our new analytics dashboard for deeper insights into your habits.",
    time: "1 day ago",
    type: "feature",
    read: false,
  },
  {
    id: 3,
    title: "Reminder: Evening Routine",
    message: "Don't forget to complete your evening routine habits.",
    time: "3 days ago",
    type: "reminder",
    read: true,
  },
  // Add more mock notifications as needed
];

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.3 },
  },
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(mockNotifications);
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const { isPro } = useHabitStore();

  const filteredNotifications = notifications.filter((notification) => {
    const matchesFilter = filter === "all" || notification.type === filter;
    const matchesSearch = notification.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         notification.message.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const deleteNotification = (id: number) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  return (
    <div className="container max-w-4xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <Bell className="w-8 h-8 text-primary" />
            Notifications
          </h1>
          <p className="text-muted-foreground">
            Stay updated with your habit tracking journey
          </p>
        </div>
        {!isPro && (
          <Button className="bg-gradient-1 text-white hover:opacity-90">
            Upgrade to Pro
          </Button>
        )}
      </div>

      {/* Controls */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="flex flex-col sm:flex-row gap-4"
      >
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search notifications..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Filter className="w-4 h-4" />
                Filter
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setFilter("all")}>All</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilter("achievement")}>Achievements</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilter("feature")}>Features</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilter("reminder")}>Reminders</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button variant="outline" onClick={markAllAsRead}>
            Mark all as read
          </Button>
        </div>
      </motion.div>

      {/* Notifications List */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-4"
      >
        {filteredNotifications.map((notification) => (
          <motion.div
            key={notification.id}
            variants={itemVariants}
            className={cn(
              "p-4 rounded-xl border bg-card/50 backdrop-blur-sm relative group transition-all hover:shadow-md",
              !notification.read && "border-primary/50 bg-primary/5"
            )}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1 flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold">{notification.title}</h3>
                  {!notification.read && (
                    <Badge variant="default" className="bg-primary/20 text-primary">New</Badge>
                  )}
                </div>
                <p className="text-muted-foreground">{notification.message}</p>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  {notification.time}
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => deleteNotification(notification.id)}
              >
                <Trash2 className="w-4 h-4 text-muted-foreground hover:text-destructive" />
              </Button>
            </div>
          </motion.div>
        ))}

        {filteredNotifications.length === 0 && (
          <motion.div
            variants={itemVariants}
            className="text-center p-8 text-muted-foreground"
          >
            <Bell className="w-12 h-12 mx-auto mb-4 opacity-20" />
            <p>No notifications found</p>
          </motion.div>
        )}
      </motion.div>

      {/* Settings Link */}
      <motion.div
        variants={itemVariants}
        className="flex justify-center pt-4"
      >
        <Button
          variant="link"
          className="text-muted-foreground hover:text-primary"
          onClick={() => {/* Navigate to notification settings */}}
        >
          <Settings className="w-4 h-4 mr-2" />
          Notification Settings
        </Button>
      </motion.div>
    </div>
  );
}