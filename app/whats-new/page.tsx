"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Sparkles,
  Zap,
  Clock,
  Globe,
  Crown,
  Layout,
  Rocket,
  Target,
  Palette,
  Share2,
  LineChart,
  Smartphone,
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useHabitStore } from "@/lib/store";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useRouter } from "next/navigation";

const updates = [
  {
    version: "1.2.0",
    date: "December 2023",
    badge: "Latest Release",
    badgeColor:
      "bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-500",
    summary: "Introducing Pro features and a complete design overhaul",
    features: [
      {
        icon: Crown,
        title: "Pro Subscription",
        description:
          "Unlock premium features with our Pro subscription. Advanced analytics, unlimited habits, and more.",
        isPro: true,
        isHighlight: true,
      },
      {
        icon: Globe,
        title: "Timezone Support",
        description:
          "Track habits seamlessly across different timezones with automatic adjustments and smart reminders.",
        isPro: true,
      },
      {
        icon: Layout,
        title: "Modern Design",
        description:
          "Completely refreshed interface with improved navigation, dark mode, and smooth animations.",
        isHighlight: true,
      },
      {
        icon: LineChart,
        title: "Advanced Analytics",
        description:
          "Gain deeper insights with detailed progress tracking and trend analysis.",
        isPro: true,
      },
      {
        icon: Share2,
        title: "Social Sharing",
        description:
          "Share your achievements and inspire others with beautiful progress cards.",
      },
      {
        icon: Smartphone,
        title: "Mobile Optimized",
        description:
          "Enhanced mobile experience with responsive design and touch gestures.",
      },
    ],
  },
  {
    version: "1.1.0",
    date: "November 2023",
    summary: "Customization and performance improvements",
    features: [
      {
        icon: Clock,
        title: "Custom Week Start",
        description:
          "Personalize your tracking with flexible week start options.",
        isPro: true,
        isHighlight: true,
      },
      {
        icon: Zap,
        title: "Performance Boost",
        description:
          "Lightning-fast loading times and smoother animations throughout the app.",
        isHighlight: true,
      },
      {
        icon: Palette,
        title: "Theme Options",
        description:
          "Customize your experience with new color themes and styling options.",
      },
    ],
  },
  {
    version: "1.0.0",
    date: "October 2023",
    summary: "Initial release with core features",
    features: [
      {
        icon: Rocket,
        title: "Launch Release",
        description:
          "Introducing everyday: Your new favorite habit tracking companion.",
        isHighlight: true,
      },
      {
        icon: Target,
        title: "Core Features",
        description:
          "Essential habit tracking tools to help you build better habits.",
      },
    ],
  },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function WhatsNewPage() {
  const router = useRouter();
  const { isPro } = useHabitStore();
  const [isUpgradeOpen, setIsUpgradeOpen] = useState(false);

  const handleUpgradeClick = () => {
    setIsUpgradeOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/80">
      <div className="container max-w-5xl mx-auto p-6 py-12 space-y-12">
        {/* Hero Section */}
        <div className="text-center space-y-4 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Badge
              variant="secondary"
              className="bg-primary/10 text-primary hover:bg-primary/20 mb-4"
            >
              What's New
            </Badge>
            <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-violet-500 to-purple-500 bg-clip-text text-transparent">
              Latest Updates & Features
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto mt-4">
              Discover the latest improvements and features we've added to make
              your habit tracking experience even better.
            </p>
          </motion.div>
        </div>

        {/* Updates Timeline */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="space-y-8"
        >
          {updates.map((update) => (
            <motion.div key={update.version} variants={item}>
              <Card className="relative overflow-hidden border-border/50 group hover:border-primary/20 transition-colors duration-300">
                {/* Version gradient lines */}
                <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-violet-500/0 via-violet-500/20 to-violet-500/0" />
                <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-violet-500/0 via-violet-500/20 to-violet-500/0" />

                <CardContent className="pt-8 pb-8">
                  <div className="flex flex-wrap items-center gap-3 mb-6">
                    <div className="flex items-center gap-3">
                      <h2 className="text-2xl font-bold bg-gradient-to-r from-violet-500 to-purple-500 bg-clip-text text-transparent">
                        Version {update.version}
                      </h2>
                      <time className="text-sm text-muted-foreground">
                        {update.date}
                      </time>
                    </div>
                    {update.badge && (
                      <Badge
                        variant="secondary"
                        className={cn("ml-auto font-medium", update.badgeColor)}
                      >
                        {update.badge}
                      </Badge>
                    )}
                  </div>

                  {update.summary && (
                    <p className="text-muted-foreground mb-6">
                      {update.summary}
                    </p>
                  )}

                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {update.features.map((feature, index) => {
                      const IconComponent = feature.icon;
                      return (
                        <div
                          key={index}
                          className={cn(
                            "p-4 rounded-xl relative group/card transition-all duration-300",
                            feature.isHighlight
                              ? "bg-gradient-to-r from-violet-500/10 via-purple-500/10 to-violet-500/10 hover:from-violet-500/20 hover:via-purple-500/20 hover:to-violet-500/20"
                              : "bg-muted/50 hover:bg-muted"
                          )}
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <div
                              className={cn(
                                "p-2 rounded-lg",
                                feature.isHighlight
                                  ? "bg-violet-500/20 text-violet-500"
                                  : "bg-primary/10 text-primary"
                              )}
                            >
                              <IconComponent className="w-4 h-4" />
                            </div>
                            <h3 className="font-medium">{feature.title}</h3>
                            {feature.isPro && (
                              <Badge
                                variant="secondary"
                                className="ml-auto bg-violet-500/10 text-violet-500 hover:bg-violet-500/20"
                              >
                                Pro
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {feature.description}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA Section */}
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            className="mb-4"
            onClick={() => router.push("/home")}
          >
            ← Back to Home
          </Button>
        </div>

        {!isPro && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-center pt-8"
          >
            <div className="inline-flex items-center gap-2 bg-primary/10 rounded-full p-1 pl-6 hover:bg-primary/20 transition-colors">
              <span className="text-sm font-medium">
                Ready to unlock all features?
              </span>
              <Button
                size="sm"
                className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
                onClick={handleUpgradeClick}
              >
                Upgrade to Pro
              </Button>
            </div>
          </motion.div>
        )}
      </div>

      <Dialog open={isUpgradeOpen} onOpenChange={setIsUpgradeOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upgrade to Pro</DialogTitle>
            <DialogDescription>
              Unlock all premium features and take your habit tracking to the
              next level
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {updates[0].features
              .filter((feature) => feature.isPro)
              .map((feature, index) => {
                const IconComponent = feature.icon;
                return (
                  <div key={index} className="flex items-start gap-4">
                    <div className="p-2 rounded-lg bg-violet-500/10">
                      <IconComponent className="w-5 h-5 text-violet-500" />
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
          <DialogFooter>
            <Button
              onClick={() => {
                // Here you would typically integrate with a payment provider
                setIsUpgradeOpen(false);
              }}
              className="w-full bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600"
            >
              Upgrade Now
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
