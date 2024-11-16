import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import {
  Trophy,
  Target,
  Zap,
  Calendar,
  Clock,
  ArrowUp,
  ArrowDown,
  Award,
  Flame,
  Crown,
  Share2,
  Download,
  BarChart2,
} from "lucide-react";

const AdvancedAnalyticsDashboard = ({ habits }) => {
  const [selectedMetric, setSelectedMetric] = useState("completion");

  // AI-Generated Insights Component
  const InsightsPanel = () => (
    <Card className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 border-none shadow-xl">
      <CardHeader className="space-y-1">
        <div className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-yellow-500" />
          <CardTitle className="text-lg">AI Insights</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            {
              icon: <ArrowUp className="w-4 h-4 text-green-500" />,
              title: "Trending Up",
              habit: "Morning Meditation",
              insight: "33% improvement in consistency this week",
            },
            {
              icon: <Trophy className="w-4 h-4 text-yellow-500" />,
              title: "Achievement Unlocked",
              habit: "Daily Exercise",
              insight: "New personal best: 14 day streak!",
            },
            {
              icon: <Clock className="w-4 h-4 text-blue-500" />,
              title: "Optimal Time",
              habit: "Reading",
              insight: "Most successful between 7-8 AM",
            },
            {
              icon: <Target className="w-4 h-4 text-purple-500" />,
              title: "Goal Progress",
              habit: "All Habits",
              insight: "On track to hit monthly targets",
            },
          ].map((item, i) => (
            <div
              key={i}
              className="flex items-start gap-3 p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg backdrop-blur-lg"
            >
              <div className="p-2 bg-white dark:bg-gray-700 rounded-full shadow-sm">
                {item.icon}
              </div>
              <div>
                <div className="font-medium">{item.title}</div>
                <div className="text-sm text-muted-foreground">
                  {item.habit}
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  {item.insight}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  // Achievement Showcase
  const AchievementShowcase = () => (
    <Card className="bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-gray-900 dark:to-gray-800 border-none shadow-xl">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Crown className="w-5 h-5 text-yellow-500" />
          <CardTitle>Achievement Showcase</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: Flame, label: "30 Day Streak", color: "text-orange-500" },
            { icon: Award, label: "Habit Master", color: "text-purple-500" },
            { icon: Trophy, label: "Early Bird", color: "text-yellow-500" },
            { icon: Target, label: "Goal Crusher", color: "text-blue-500" },
          ].map((achievement, i) => (
            <div
              key={i}
              className="group relative p-4 bg-white/50 dark:bg-gray-800/50 rounded-xl backdrop-blur-lg text-center hover:scale-105 transition-all duration-200"
            >
              <div className="flex flex-col items-center gap-2">
                <achievement.icon className={`w-8 h-8 ${achievement.color}`} />
                <span className="text-sm font-medium">{achievement.label}</span>
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/50 to-white/0 dark:from-gray-900/0 dark:via-gray-900/50 dark:to-gray-900/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  // Social Proof Section
  const SocialProof = () => (
    <div className="flex gap-4 overflow-x-auto pb-4">
      {[
        { name: "Global Rank", value: "#234", icon: Crown, change: "+12" },
        {
          name: "Leaderboard Position",
          value: "Top 1%",
          icon: Trophy,
          change: "+2%",
        },
        {
          name: "Community Impact",
          value: "4.8k",
          icon: Share2,
          change: "+156",
        },
      ].map((stat, i) => (
        <Card
          key={i}
          className="min-w-[200px] bg-white/50 dark:bg-gray-800/50 backdrop-blur-lg"
        >
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {stat.name}
                </p>
                <h4 className="text-2xl font-bold">{stat.value}</h4>
                <p className="text-xs text-green-500">
                  <ArrowUp className="w-3 h-3 inline mr-1" />
                  {stat.change} this week
                </p>
              </div>
              <stat.icon className="w-8 h-8 text-muted-foreground/50" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  return (
    <div className="space-y-6">
      <InsightsPanel />
      <AchievementShowcase />
      <SocialProof />

      {/* Action Bar */}
      <div className="flex justify-between items-center bg-white/50 dark:bg-gray-800/50 backdrop-blur-lg p-4 rounded-lg">
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" /> Export Data
          </Button>
          <Button variant="outline" size="sm">
            <Share2 className="w-4 h-4 mr-2" /> Share Report
          </Button>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="w-4 h-4" /> Last updated: Just now
        </div>
      </div>
    </div>
  );
};

export default AdvancedAnalyticsDashboard;
