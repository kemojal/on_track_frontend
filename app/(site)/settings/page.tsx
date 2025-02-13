"use client";
import React from "react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
// tobe moved
//
import NotificationCard from "@/components/NotificationCard";
import TrackingCard from "@/components/TrackingCard";
import PremiumFeaturesCard from "@/components/PremiumFeaturesCard";
import DataPrivacyCard from "@/components/DataPrivacyCard";
import AppearanceCard from "@/components/AppearanceCard";
import { useHabitStore } from "@/lib/store";

// Time zones array (simplified for example)

export default function SettingsPage() {
  const { isPro } = useHabitStore();

  return (
    <div className="container max-w-4xl mx-auto p-6 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">
            Manage your habit tracking preferences
          </p>
        </div>
        {!isPro && (
          <Button className="bg-gradient-1 text-white hover:opacity-90 border-primary text-primary font-bold hover:text-white border-[1px]">
            Upgrade to Pro
          </Button>
        )}
      </div>

      <div className="grid gap-6">
        {/* Appearance */}
        <AppearanceCard />

        {/* Notifications */}
        <NotificationCard />

        {/* Tracking Preferences */}
        <TrackingCard />
        {/* <Card>
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
            <Dialog>
              <DialogTrigger asChild>
                <div className="flex items-center justify-between p-4 rounded-xl bg-card hover:bg-accent/5 transition-colors cursor-pointer">
                  <div>
                    <h3 className="font-medium">Time Zone</h3>
                    <p className="text-sm text-muted-foreground">
                      Currently set to {selectedTimeZone}
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
                  <DialogDescription>
                    Choose the time zone for your habit tracking
                  </DialogDescription>
                </DialogHeader>
                <Select
                  value={selectedTimeZone}
                  onValueChange={handleTimeZoneChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select time zone" />
                  </SelectTrigger>
                  <SelectContent>
                    {timeZones.map((tz) => (
                      <SelectItem key={tz.value} value={tz.value}>
                        {tz.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </DialogContent>
            </Dialog>

            <Dialog>
              <DialogTrigger asChild>
                <div className="flex items-center justify-between p-4 rounded-xl bg-card hover:bg-accent/5 transition-colors cursor-pointer">
                  <div>
                    <h3 className="font-medium">Week Starts On</h3>
                    <p className="text-sm text-muted-foreground">
                      Currently set to{" "}
                      {selectedWeekStart.charAt(0).toUpperCase() +
                        selectedWeekStart.slice(1)}
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
                  <DialogTitle>Select Week Start</DialogTitle>
                  <DialogDescription>
                    Choose which day your week begins on
                  </DialogDescription>
                </DialogHeader>
                <Select
                  value={selectedWeekStart}
                  onValueChange={handleWeekStartChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select week start" />
                  </SelectTrigger>
                  <SelectContent>
                    {weekStarts.map((day) => (
                      <SelectItem key={day.value} value={day.value}>
                        {day.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card> */}

        {/* Premium Features */}
        <PremiumFeaturesCard />
        {/* <Dialog open={isUpgradeOpen} onOpenChange={setIsUpgradeOpen}>
          <DialogTrigger asChild>
            <Button
              variant="premium"
              className="bg-gradient-1 text-white hover:opacity-90"
            >
              Upgrade to Pro
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Upgrade to Pro</DialogTitle>
              <DialogDescription>
                Unlock premium features and take your habit tracking to the next
                level
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <PricingCard
                  title="Monthly"
                  price={9.99}
                  features={[
                    "Advanced Analytics",
                    "Cloud Backup",
                    "Smart Reminders",
                    "Priority Support",
                  ]}
                />
                <PricingCard
                  title="Yearly"
                  price={99.99}
                  features={[
                    "All Monthly Features",
                    "2 Months Free",
                    "Early Access to New Features",
                    "Personal Habit Coach",
                  ]}
                  recommended
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsUpgradeOpen(false)}>
                Cancel
              </Button>
              <Button
                className="bg-gradient-1 text-white hover:opacity-90"
                onClick={() => handleUpgrade("monthly")}
              >
                <CreditCard className="w-4 h-4 mr-2" />
                Upgrade Now
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog> */}

        {/* Data & Privacy */}
        <DataPrivacyCard />
      </div>
    </div>
  );
}
