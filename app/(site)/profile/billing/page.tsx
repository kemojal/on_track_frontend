"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useHabitStore, useBillingStore } from "@/lib/store";
import { Check, Shield, Sparkles } from "lucide-react";
import { PaymentHistoryCard } from "@/components/billings/PaymentHistoryCard";
import { useState, useEffect } from "react";

const features = [
  {
    title: "Unlimited Habits",
    description: "Track as many habits as you want",
  },
  {
    title: "Advanced Analytics",
    description: "Get detailed insights about your progress",
  },
  {
    title: "Custom Categories",
    description: "Organize habits your way",
  },
  {
    title: "Priority Support",
    description: "Get help when you need it",
  },
];

export default function BillingPage() {
  const { isPro, setIsPro } = useHabitStore();
  const {
    subscriptionDetails,
    isYearly,
    setIsYearly,
    pricingPlans,
    usageLimits,
    upgradeSubscription,
    isUpgradeDialogOpen,
    setIsUpgradeDialogOpen,
  } = useBillingStore();

  const [localIsYearly, setLocalIsYearly] = useState(isYearly);

  useEffect(() => {
    setLocalIsYearly(isYearly);
  }, [isUpgradeDialogOpen, isYearly]);

  return (
    <div className="container max-w-6xl space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Billing</h1>
          <p className="text-muted-foreground">
            Manage your billing and subscription
          </p>
        </div>
      </div>

      <div className="grid gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Subscription</CardTitle>
            <CardDescription>
              Your current plan and subscription details
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <p className="font-medium">
                    {isPro ? subscriptionDetails.plan : "Free"} Plan
                  </p>
                  {isPro && subscriptionDetails.status === "active" && (
                    <span className="text-sm px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                      {isYearly ? "Yearly" : "Monthly"}
                    </span>
                  )}
                  {isPro && subscriptionDetails.status === "cancelled" && (
                    <span className="text-sm px-2 py-0.5 rounded-full bg-destructive/10 text-destructive">
                      Cancelled
                    </span>
                  )}
                  {!isPro && (
                    <span className="text-sm px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400">
                      Limited
                    </span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">
                  {!isPro ? (
                    "Upgrade to Pro to unlock all features"
                  ) : subscriptionDetails.status === "active" ? (
                    <>
                      {isYearly ? (
                        <span>${pricingPlans.yearly.price}/year • </span>
                      ) : (
                        <span>${pricingPlans.monthly.price}/month • </span>
                      )}
                      Next billing on {subscriptionDetails.nextBilling}
                    </>
                  ) : (
                    `Pro features available until ${subscriptionDetails.nextBilling}`
                  )}
                </p>
              </div>
              <div className="space-x-2">
                {!isPro && (
                  <Button
                    className="bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600"
                    onClick={() => setIsUpgradeDialogOpen(true)}
                  >
                    Upgrade to Pro
                  </Button>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  <span>Habits Usage</span>
                </div>
                <span className="text-muted-foreground">
                  {usageLimits.habits.used} / {usageLimits.habits.total}
                </span>
              </div>
              <Progress
                value={
                  (usageLimits.habits.used / usageLimits.habits.total) * 100
                }
              />
            </div>

            {isPro && (
              <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
                <div className="p-6 space-y-4">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-primary" />
                    <h3 className="font-medium">Pro Features</h3>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    {features.map((feature) => (
                      <div
                        key={feature.title}
                        className="flex items-start gap-2"
                      >
                        <Badge variant="secondary" className="mt-0.5">
                          <Check className="h-3.5 w-3.5" />
                        </Badge>
                        <div className="space-y-1">
                          <p className="text-sm font-medium leading-none">
                            {feature.title}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {feature.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <PaymentHistoryCard />

       
      </div>
    </div>
  );
}
