import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "./ui/card";
import { Award, Check, CloudIcon, Shield, Sparkles, Zap } from "lucide-react";
import { Button } from "./ui/button";
import { useHabitStore } from "@/lib/store";
import { useBillingStore } from "@/lib/store";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Badge } from "./ui/badge";

const features = [
  {
    icon: Shield,
    title: "Advanced Analytics",
    description: "Get deeper insights into your habits",
  },
  {
    icon: CloudIcon,
    title: "Cloud Backup",
    description: "Keep your data safe and synced",
  },
  {
    icon: Sparkles,
    title: "Custom Themes",
    description: "Personalize your tracking experience",
  },
  {
    icon: Zap,
    title: "Priority Support",
    description: "Get help when you need it",
  },
];

const PremiumFeaturesCard = () => {
  const { isPro, setIsPro } = useHabitStore();
  const {
    isYearly,
    setIsYearly,
    pricingPlans,
    addPaymentHistory,
    upgradeSubscription,
    cancelSubscription,
    isUpgradeDialogOpen,
    setIsUpgradeDialogOpen,
  } = useBillingStore();
  const [isDowngradeOpen, setIsDowngradeOpen] = useState(false);
  const [localIsYearly, setLocalIsYearly] = useState(isYearly);

  useEffect(() => {
    setLocalIsYearly(isYearly);
  }, [isUpgradeDialogOpen, isYearly]);

  const handleUpgrade = () => {
    setIsPro(true);
    setIsYearly(localIsYearly);
    upgradeSubscription();
    addPaymentHistory({
      planType: localIsYearly ? "yearly" : "monthly",
      status: "paid",
      type: "subscription",
    });
    setIsUpgradeDialogOpen(false);
  };

  const handleCancel = () => {
    setIsPro(false);
    cancelSubscription();
    addPaymentHistory({
      planType: isYearly ? "yearly" : "monthly",
      status: "cancelled",
      type: "cancellation",
    });
  };

  const currentPlan = localIsYearly
    ? pricingPlans.yearly
    : pricingPlans.monthly;

  useEffect(() => {
    (window as any).openUpgradeDialog = () => setIsUpgradeDialogOpen(true);

    return () => {
      delete (window as any).openUpgradeDialog;
    };
  }, []);

  if (isPro) {
    return (
      <>
        <Card className="bg-gradient-to-r from-violet-500/10 to-purple-500/10 border-violet-500/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="w-5 h-5 text-violet-500" />
              Premium Features
              <Badge className="bg-violet-500/20 text-violet-700 dark:text-violet-300 ml-2">
                PRO
              </Badge>
            </CardTitle>
            <CardDescription>
              You have access to all premium features
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center gap-4">
                  <div className="p-2 rounded-lg bg-violet-500/10">
                    <Check className="w-5 h-5 text-violet-500" />
                  </div>
                  <div>
                    <h3 className="font-medium">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Button
              variant="ghost"
              className="w-full text-muted-foreground hover:text-destructive"
              onClick={() => setIsDowngradeOpen(true)}
            >
              Cancel Subscription
            </Button>
          </CardFooter>
        </Card>

        <Dialog open={isDowngradeOpen} onOpenChange={setIsDowngradeOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Cancel Pro Subscription</DialogTitle>
              <DialogDescription>
                Are you sure you want to cancel your Pro subscription? You will
                lose access to all Pro features at the end of your current
                billing period.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="ghost"
                className="w-full sm:w-auto"
                onClick={() => setIsDowngradeOpen(false)}
              >
                Keep Subscription
              </Button>
              <Button
                variant="destructive"
                className="w-full sm:w-auto"
                onClick={() => {
                  handleCancel();
                  setIsDowngradeOpen(false);
                }}
              >
                Cancel Subscription
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </>
    );
  }

  return (
    <>
      <Card className="bg-gradient-to-r from-violet-500/10 to-purple-500/10 border-violet-500/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="w-5 h-5 text-violet-500" />
            Premium Features
          </CardTitle>
          <CardDescription>Unlock advanced features with Pro</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="flex items-center gap-4">
                  <div className="p-2 rounded-lg bg-violet-500/10">
                    <Icon className="w-5 h-5 text-violet-500" />
                  </div>
                  <div>
                    <h3 className="font-medium">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {feature.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
          <Button
            className="w-full bg-gradient-to-r from-violet-500 to-purple-500 text-white font-bold hover:opacity-90 py-2 h-auto"
            onClick={() => setIsUpgradeDialogOpen(true)}
          >
            Upgrade Now
          </Button>
        </CardContent>
      </Card>

      <Dialog
        open={isUpgradeDialogOpen}
        onOpenChange={(open) => {
          setIsUpgradeDialogOpen(open);
          if (!open) {
            setLocalIsYearly(isYearly);
          }
        }}
      >
        <DialogContent className="sm:max-w-[600px] p-0 gap-0 overflow-hidden">
          <div className="relative h-24 bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600">
            <div className="absolute inset-0 bg-[url('/noise.png')] opacity-20"></div>
            <div className="absolute -bottom-8 left-6">
              <div className="bg-gradient-to-br from-violet-600 to-purple-600 w-16 h-16 rounded-xl shadow-xl flex items-center justify-center p-3 ring-4 ring-white dark:ring-gray-900">
                <Award className="w-full h-full text-white" />
              </div>
            </div>
          </div>

          <div className="px-6 pt-12 pb-4">
            <h2 className="text-xl font-bold">Upgrade to Pro</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Join thousands of users who have upgraded to unlock the full
              potential of their habit tracking journey.
            </p>
          </div>

          <div className="p-4 space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setLocalIsYearly(true)}
                className={`text-left flex items-center justify-between p-3 rounded-xl border transition-all duration-200 ${
                  localIsYearly
                    ? "bg-violet-50 dark:bg-violet-500/10 border-violet-200 dark:border-violet-500/20 ring-2 ring-violet-500 ring-offset-2 dark:ring-offset-gray-900"
                    : "bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 hover:bg-violet-50/50 dark:hover:bg-violet-500/5"
                }`}
              >
                <div className="space-y-0.5">
                  <p className="text-xs text-violet-600 dark:text-violet-400 font-medium">
                    YEARLY (SAVE 20%)
                  </p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-bold">
                      ${pricingPlans.yearly.price}
                    </span>
                    <span className="text-xs text-muted-foreground">/year</span>
                  </div>
                </div>
                {localIsYearly && (
                  <Badge
                    variant="secondary"
                    className="text-xs bg-violet-100 dark:bg-violet-500/20 text-violet-600 dark:text-violet-400"
                  >
                    BEST VALUE
                  </Badge>
                )}
              </button>

              <button
                onClick={() => setLocalIsYearly(false)}
                className={`text-left p-3 rounded-xl border transition-all duration-200 ${
                  !localIsYearly
                    ? "bg-violet-50 dark:bg-violet-500/10 border-violet-200 dark:border-violet-500/20 ring-2 ring-violet-500 ring-offset-2 dark:ring-offset-gray-900"
                    : "bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 hover:bg-violet-50/50 dark:hover:bg-violet-500/5"
                }`}
              >
                <div className="space-y-0.5">
                  <p className="text-xs text-gray-600 dark:text-gray-400 font-medium">
                    MONTHLY
                  </p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-bold">
                      ${pricingPlans.monthly.price}
                    </span>
                    <span className="text-xs text-muted-foreground">/mo</span>
                  </div>
                </div>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="flex items-start gap-2 p-2 rounded-lg bg-gray-50 dark:bg-gray-800/50"
                >
                  <div className="mt-0.5">
                    <Check className="w-3 h-3 text-violet-500" />
                  </div>
                  <div>
                    <h4 className="text-xs font-medium">{feature.title}</h4>
                    <p className="text-[10px] text-muted-foreground">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 border">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-400 to-purple-400 flex items-center justify-center text-xs text-white font-semibold">
                  JD
                </div>
                <div>
                  <p className="text-xs italic text-muted-foreground">
                    "Upgrading to Pro was a game-changer for my habit tracking.
                    The advanced analytics helped me understand my patterns
                    better than ever."
                  </p>
                  <p className="text-xs font-medium mt-1">John Doe</p>
                  <p className="text-[10px] text-muted-foreground">
                    Product Designer at Meta
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Shield className="w-3 h-3" />
              <span>30-day money-back guarantee. No questions asked.</span>
            </div>
          </div>

          <DialogFooter className="p-4 bg-gray-50 dark:bg-gray-800/50 border-t">
            <div className="w-full space-y-2">
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 text-white font-medium py-4"
                onClick={handleUpgrade}
              >
                {localIsYearly
                  ? `Upgrade to Pro Yearly • $${pricingPlans.yearly.price}/year`
                  : `Upgrade to Pro Monthly • $${pricingPlans.monthly.price}/month`}
              </Button>
              <p className="text-[10px] text-center text-muted-foreground">
                Secure payment powered by Stripe
              </p>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PremiumFeaturesCard;
