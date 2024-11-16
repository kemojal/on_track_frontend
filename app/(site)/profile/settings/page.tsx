"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { useHabitStore } from "@/lib/store";
import {
  User,
  Settings,
  Bell,
  Moon,
  Sun,
  Globe,
  Shield,
  Zap,
  Camera,
  LogOut,
  Save,
  Trash2,
  CloudOff,
  Mail,
} from "lucide-react";
import { useTheme } from "next-themes";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

interface UserSettings {
  email: string;
  name: string;
  notifications: {
    email: boolean;
    push: boolean;
    weeklyReport: boolean;
  };
  preferences: {
    timezone: string;
    weekStart: "monday" | "sunday";
  };
  privacy: {
    publicProfile: boolean;
    shareProgress: boolean;
  };
}

export default function SettingsPage() {
  const { isPro } = useHabitStore();
  const { theme, setTheme } = useTheme();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [settings, setSettings] = useState<UserSettings>({
    email: "user@example.com",
    name: "John Doe",
    notifications: {
      email: true,
      push: true,
      weeklyReport: true,
    },
    preferences: {
      timezone: "America/New_York",
      weekStart: "monday",
    },
    privacy: {
      publicProfile: false,
      shareProgress: true,
    },
  });

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSaving(false);
    setIsEditing(false);
  };

  return (
    <div className="container max-w-4xl mx-auto p-4 space-y-8">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="space-y-8"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="space-y-2">
          <div className="flex items-center gap-3">
            <Settings className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold">Settings</h1>
            {isPro && (
              <Badge
                className="bg-gradient-to-r from-violet-500/20 to-purple-500/20 text-violet-500 ml-2"
              >
                PRO
              </Badge>
            )}
          </div>
          <p className="text-muted-foreground text-lg">
            Manage your account settings and preferences
          </p>
        </motion.div>

        {/* Profile Section */}
        <motion.div variants={itemVariants}>
          <Card className="bg-gradient-to-r from-card/50 to-card border-muted/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5 text-primary" />
                Profile
              </CardTitle>
              <CardDescription>
                Manage your profile information and preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-6">
                <Avatar className="w-20 h-20">
                  <AvatarImage src="/placeholder-avatar.jpg" />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
                <div className="space-y-2">
                  <Button variant="outline" size="sm" className="gap-2">
                    <Camera className="w-4 h-4" />
                    Change Photo
                  </Button>
                  {isPro && (
                    <p className="text-sm text-muted-foreground">
                      Unlock custom avatars with Pro
                    </p>
                  )}
                </div>
              </div>

              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label>Name</Label>
                  <Input
                    value={settings.name}
                    onChange={(e) =>
                      setSettings({ ...settings, name: e.target.value })
                    }
                    className="bg-background/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input
                    value={settings.email}
                    onChange={(e) =>
                      setSettings({ ...settings, email: e.target.value })
                    }
                    type="email"
                    className="bg-background/50"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Preferences Section */}
        <motion.div variants={itemVariants}>
          <Card className="bg-gradient-to-r from-blue-500/5 to-cyan-500/5 border-blue-500/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="w-5 h-5 text-blue-500" />
                Preferences
              </CardTitle>
              <CardDescription>
                Customize your tracking experience
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Theme</Label>
                  <p className="text-sm text-muted-foreground">
                    Choose your preferred theme
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Sun className="w-4 h-4" />
                  <Switch
                    checked={theme === "dark"}
                    onCheckedChange={(checked) =>
                      setTheme(checked ? "dark" : "light")
                    }
                  />
                  <Moon className="w-4 h-4" />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <Label>Timezone</Label>
                <select
                  value={settings.preferences.timezone}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      preferences: {
                        ...settings.preferences,
                        timezone: e.target.value,
                      },
                    })
                  }
                  className="w-full bg-background/50 rounded-md border border-input px-3 py-2"
                >
                  <option value="America/New_York">New York (EST)</option>
                  <option value="America/Los_Angeles">Los Angeles (PST)</option>
                  <option value="Europe/London">London (GMT)</option>
                  <option value="Asia/Tokyo">Tokyo (JST)</option>
                </select>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Notifications Section */}
        <motion.div variants={itemVariants}>
          <Card className="bg-gradient-to-r from-violet-500/5 to-purple-500/5 border-violet-500/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-violet-500" />
                Notifications
              </CardTitle>
              <CardDescription>
                Control how you receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive updates via email
                  </p>
                </div>
                <Switch
                  checked={settings.notifications.email}
                  onCheckedChange={(checked) =>
                    setSettings({
                      ...settings,
                      notifications: {
                        ...settings.notifications,
                        email: checked,
                      },
                    })
                  }
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Push Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Get notified on your device
                  </p>
                </div>
                <Switch
                  checked={settings.notifications.push}
                  onCheckedChange={(checked) =>
                    setSettings({
                      ...settings,
                      notifications: {
                        ...settings.notifications,
                        push: checked,
                      },
                    })
                  }
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Weekly Report</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive weekly progress summary
                  </p>
                </div>
                <Switch
                  checked={settings.notifications.weeklyReport}
                  onCheckedChange={(checked) =>
                    setSettings({
                      ...settings,
                      notifications: {
                        ...settings.notifications,
                        weeklyReport: checked,
                      },
                    })
                  }
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Privacy Section */}
        <motion.div variants={itemVariants}>
          <Card className="bg-gradient-to-r from-emerald-500/5 to-teal-500/5 border-emerald-500/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-emerald-500" />
                Privacy
              </CardTitle>
              <CardDescription>
                Control your privacy settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Public Profile</Label>
                  <p className="text-sm text-muted-foreground">
                    Make your profile visible to others
                  </p>
                </div>
                <Switch
                  checked={settings.privacy.publicProfile}
                  onCheckedChange={(checked) =>
                    setSettings({
                      ...settings,
                      privacy: {
                        ...settings.privacy,
                        publicProfile: checked,
                      },
                    })
                  }
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Share Progress</Label>
                  <p className="text-sm text-muted-foreground">
                    Allow sharing your habit progress
                  </p>
                </div>
                <Switch
                  checked={settings.privacy.shareProgress}
                  onCheckedChange={(checked) =>
                    setSettings({
                      ...settings,
                      privacy: {
                        ...settings.privacy,
                        shareProgress: checked,
                      },
                    })
                  }
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Actions Section */}
        <motion.div variants={itemVariants}>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              onClick={handleSave}
              disabled={isSaving}
              className="flex-1 bg-primary hover:bg-primary/90"
            >
              {isSaving ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <Zap className="w-4 h-4" />
                </motion.div>
              ) : (
                <span className="flex items-center gap-2">
                  <Save className="w-4 h-4" />
                  Save Changes
                </span>
              )}
            </Button>

            <Button
              variant="outline"
              className="flex-1 text-destructive hover:text-destructive"
            >
              <span className="flex items-center gap-2">
                <LogOut className="w-4 h-4" />
                Sign Out
              </span>
            </Button>
          </div>

          <div className="mt-8 space-y-4">
            <Separator />
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="text-destructive font-medium">Danger Zone</h3>
                <p className="text-sm text-muted-foreground">
                  Permanent account actions
                </p>
              </div>
              <div className="flex gap-4">
                <Button
                  variant="outline"
                  className="border-destructive/50 hover:bg-destructive/10"
                >
                  <span className="flex items-center gap-2 text-destructive">
                    <CloudOff className="w-4 h-4" />
                    Export Data
                  </span>
                </Button>
                <Button variant="destructive">
                  <span className="flex items-center gap-2">
                    <Trash2 className="w-4 h-4" />
                    Delete Account
                  </span>
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}