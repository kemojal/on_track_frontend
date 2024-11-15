import React from "react";
import { useState } from "react";
import { useHabitStore } from "@/lib/store";
import {
  Moon,
  Sun,
  X,
  BarChart3,
  Settings as SettingsIcon,
  Crown,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import NotificationCard from "./NotificationCard";
import TrackingCard from "./TrackingCard";
import PremiumFeaturesCard from "./PremiumFeaturesCard";
import DataPrivacyCard from "./DataPrivacyCard";
import AppearanceCard from "./AppearanceCard";
import Link from "next/link";
import { DialogClose } from "@radix-ui/react-dialog";

// Settings Dialog Component
export const SettingsDialog = () => {
  const { theme, setTheme } = useTheme();
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-xl">
          <SettingsIcon className="w-5 h-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
        </DialogHeader>

        <AppearanceCard />
        {/* <NotificationCard /> */}

        {/* <TrackingCard /> */}
        <PremiumFeaturesCard />
        {/* <DataPrivacyCard /> */}
        <DialogFooter className="flex space-x-2">
          <Button type="submit">
            <Link href={"/settings"}>More Settings</Link>
          </Button>
          <DialogClose>Close</DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// Pro Dialog Component
export const ProDialog = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="rounded-xl bg-gradient-to-r from-violet-500 to-purple-500 text-white hover:opacity-90">
          <Crown className="w-4 h-4 mr-2" />
          Upgrade to Pro
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Upgrade to Pro</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <Card className="border-2 border-purple-500">
            <CardHeader>
              <CardTitle>Pro Plan</CardTitle>
              <CardDescription>$9.99/month</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center gap-2">
                <span>✓</span>
                <span>Unlimited habits</span>
              </div>
              <div className="flex items-center gap-2">
                <span>✓</span>
                <span>Advanced analytics</span>
              </div>
              <div className="flex items-center gap-2">
                <span>✓</span>
                <span>Custom themes</span>
              </div>
              <div className="flex items-center gap-2">
                <span>✓</span>
                <span>Priority support</span>
              </div>
              <Button className="w-full mt-4 bg-gradient-to-r from-violet-500 to-purple-500">
                Get Started
              </Button>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};
