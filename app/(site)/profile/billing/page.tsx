"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useHabitStore, useBillingStore } from "@/lib/store";
import {
  CreditCard,
  Shield,
  Download,
  Clock,
  Check,
  Sparkles,
} from "lucide-react";
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
    paymentMethod,
    paymentHistory,
    isYearly,
    setIsYearly,
    updatePaymentMethod,
    cancelSubscription,
    addPaymentHistory,
    pricingPlans,
    usageLimits,
    upgradeSubscription,
  } = useBillingStore();

  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [isEditPaymentOpen, setIsEditPaymentOpen] = useState(false);
  const [isDowngradeOpen, setIsDowngradeOpen] = useState(false);
  const [newPaymentMethod, setNewPaymentMethod] = useState({
    last4: "",
    expiryDate: "",
    type: "visa",
  });
  const [isUpgradeOpen, setIsUpgradeOpen] = useState(false);
  const [localIsYearly, setLocalIsYearly] = useState(isYearly);

  useEffect(() => {
    setLocalIsYearly(isYearly);
  }, [isUpgradeOpen, isYearly]);

  const handleAddPayment = () => {
    updatePaymentMethod(newPaymentMethod);
    setIsPaymentOpen(false);

    // Proceed with upgrade if coming from upgrade flow
    if (isUpgradeOpen) {
      setIsPro(true);
      setIsYearly(localIsYearly);
      upgradeSubscription();
      addPaymentHistory({
        planType: localIsYearly ? "yearly" : "monthly",
        status: "paid",
        type: "subscription",
      });
      setIsUpgradeOpen(false);
    }
  };

  const handleEditPayment = () => {
    updatePaymentMethod(newPaymentMethod);
    setIsEditPaymentOpen(false);
  };

  const handleCancel = () => {
    setIsPro(false);
    cancelSubscription();
    addPaymentHistory({
      planType: isYearly ? "yearly" : "monthly",
      status: "cancelled",
      type: "cancellation",
    });
    setIsDowngradeOpen(false);
  };

  const handleUpgrade = () => {
    if (!paymentMethod.last4) {
      setIsPaymentOpen(true);
      return;
    }

    setIsPro(true);
    setIsYearly(localIsYearly);
    upgradeSubscription();
    addPaymentHistory({
      planType: localIsYearly ? "yearly" : "monthly",
      status: "paid",
      type: "subscription",
    });
    setIsUpgradeOpen(false);
  };

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
                    onClick={() => setIsUpgradeOpen(true)}
                  >
                    Upgrade to Pro
                  </Button>
                )}
                {isPro && subscriptionDetails.status === "active" && (
                  <>
                    <Button
                      variant="outline"
                      onClick={() => setIsDowngradeOpen(true)}
                    >
                      Cancel Plan
                    </Button>
                    <Button
                      className="bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600"
                      onClick={() => setIsYearly(!isYearly)}
                    >
                      Switch to {isYearly ? "Monthly" : "Yearly"}
                      {!isYearly && (
                        <span className="ml-1 text-xs">(Save 17%)</span>
                      )}
                    </Button>
                  </>
                )}
                {isPro && subscriptionDetails.status === "cancelled" && (
                  <Button
                    className="bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600"
                    onClick={() => (window as any).openUpgradeDialog?.()}
                  >
                    Reactivate Pro
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Payment Method</CardTitle>
            <CardDescription>Your payment information</CardDescription>
          </CardHeader>
          <CardContent>
            {paymentMethod.last4 ? (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-2 border rounded-lg">
                    <CreditCard className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-medium">
                      {paymentMethod.type.toUpperCase()} ****
                      {paymentMethod.last4}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Expires {paymentMethod.expiryDate}
                    </p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  onClick={() => setIsEditPaymentOpen(true)}
                >
                  Edit
                </Button>
              </div>
            ) : (
              <div className="text-center py-6">
                <Button onClick={() => setIsPaymentOpen(true)}>
                  Add Payment Method
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Payment History</CardTitle>
            <CardDescription>
              View your past payments and invoices
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {paymentHistory.map((payment) => (
                <div
                  key={payment.id}
                  className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent/5 transition-colors"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{payment.invoice}</p>
                      <span className="text-sm text-muted-foreground">
                        ({payment.planName})
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      {payment.date}
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <p className="font-medium">{payment.amount}</p>
                    <Button variant="ghost" size="icon">
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Usage & Limits</CardTitle>
            <CardDescription>
              Monitor your current usage and plan limits
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Habits</span>
                <span>
                  {usageLimits.habits.used}/{usageLimits.habits.total} used
                </span>
              </div>
              <Progress
                value={
                  (usageLimits.habits.used / usageLimits.habits.total) * 100
                }
                className="h-2"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Storage</span>
                <span>
                  {usageLimits.storage.used}GB/{usageLimits.storage.total}GB
                  used
                </span>
              </div>
              <Progress
                value={
                  (usageLimits.storage.used / usageLimits.storage.total) * 100
                }
                className="h-2"
              />
            </div>
          </CardContent>
        </Card>

        <Dialog open={isPaymentOpen} onOpenChange={setIsPaymentOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add Payment Method</DialogTitle>
              <DialogDescription>
                {isUpgradeOpen
                  ? "Add a payment method to complete your upgrade to Pro"
                  : "Add a new payment method to your account"}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="card">Card Number</Label>
                <Input
                  id="card"
                  placeholder="4242 4242 4242 4242"
                  onChange={(e) =>
                    setNewPaymentMethod({
                      ...newPaymentMethod,
                      last4: e.target.value.slice(-4),
                    })
                  }
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="expiry">Expiry Date</Label>
                  <Input
                    id="expiry"
                    placeholder="MM/YY"
                    onChange={(e) =>
                      setNewPaymentMethod({
                        ...newPaymentMethod,
                        expiryDate: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cvc">CVC</Label>
                  <Input id="cvc" placeholder="123" />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsPaymentOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleAddPayment}
                className="bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600"
              >
                {isUpgradeOpen
                  ? "Add & Complete Upgrade"
                  : "Add Payment Method"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={isEditPaymentOpen} onOpenChange={setIsEditPaymentOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Payment Method</DialogTitle>
              <DialogDescription>
                Update your payment information
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4">
              <div>
                <Label>Card Number</Label>
                <Input
                  placeholder="4242 4242 4242 4242"
                  onChange={(e) =>
                    setNewPaymentMethod({
                      ...newPaymentMethod,
                      last4: e.target.value.slice(-4),
                    })
                  }
                />
              </div>
              <div>
                <Label>Expiry Date</Label>
                <Input
                  placeholder="MM/YY"
                  onChange={(e) =>
                    setNewPaymentMethod({
                      ...newPaymentMethod,
                      expiryDate: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <Label>CVC</Label>
                <Input placeholder="123" />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsEditPaymentOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleEditPayment}>Update Card</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={isDowngradeOpen} onOpenChange={setIsDowngradeOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Cancel Subscription</DialogTitle>
              <DialogDescription>
                Are you sure you want to cancel your Pro subscription? You will
                lose access to all Pro features at the end of your current
                billing period.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsDowngradeOpen(false)}
              >
                Keep Subscription
              </Button>
              <Button variant="destructive" onClick={handleCancel}>
                Cancel Subscription
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog
          open={isUpgradeOpen}
          onOpenChange={(open) => {
            setIsUpgradeOpen(open);
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
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
              </div>
            </div>

            <div className="p-6 pt-12">
              <h2 className="text-2xl font-bold">Upgrade to Pro</h2>
              <p className="text-muted-foreground">
                Unlock premium features and maximize your habit tracking
                potential
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
                    <p className="text-xs uppercase tracking-wider opacity-70">
                      YEARLY (SAVE 17%)
                    </p>
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-bold">
                        ${pricingPlans.yearly.price}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        /year
                      </span>
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
                    <p className="text-xs uppercase tracking-wider opacity-70">
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
                    <Check className="w-5 h-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-medium text-sm">{feature.title}</p>
                      <p className="text-xs text-muted-foreground">
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
                    <p className="text-sm font-medium">John Doe</p>
                    <p className="text-xs text-muted-foreground">
                      "This app has completely transformed how I build and
                      maintain habits. The pro features are absolutely worth
                      it!"
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Shield className="w-3 h-3" />
                <span>30-day money-back guarantee. No questions asked.</span>
              </div>
            </div>

            <div className="p-4 border-t space-y-2">
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
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
