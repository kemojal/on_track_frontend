"use client";

import React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { useHabitStore } from "@/lib/store";
import { Button } from "./ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  BarChart2,
  Calendar,
  Settings,
  Plus,
  Sparkles,
  Crown,
  Trophy,
  Zap,
  Target,
  TrendingUp,
  User2Icon,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useTheme } from "next-themes";
import {
  User,
  Bell,
  CreditCard,
  HelpCircle,
  MessageSquare,
  FileText,
  Shield,
  LogOut,
} from "lucide-react";

export function AppSidebar() {
  const pathname = usePathname();
  const { setIsNewHabitOpen, isPro } = useHabitStore();
  const { setTheme } = useTheme();

  const handleUpgradeClick = () => {
    // Call the global openUpgradeDialog function
    (window as any).openUpgradeDialog?.();
  };

  const navigationItems = [
    { href: "/home", label: "Home", icon: Home },
    { href: "/analytics", label: "Analytics", icon: BarChart2 },
    { href: "/calendar", label: "Calendar", icon: Calendar },
    { href: "/settings", label: "Settings", icon: Settings },
    { href: "/profile/settings", label: "Profile", icon: User2Icon },
  ];

  return (
    <Sidebar className="border-r border-sidebar-border">
      <SidebarHeader className="px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative hover-scale">
              <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-violet-500 to-purple-500 bg-clip-text text-transparent">
              everyday
            </h1>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2 flex-1">
        <SidebarGroup className="space-y-1">
          {/* Quick Actions */}
          <div className="px-4 py-2 mb-2">
            <Button
              onClick={() => setIsNewHabitOpen(true)}
              className="w-full bg-primary/10 hover:bg-primary/15 text-primary font-medium"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Habit
            </Button>
          </div>

          {/* Navigation Items */}
          {navigationItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-2 text-muted-foreground hover:text-primary hover:bg-primary/5 transition-colors ${
                pathname === item.href
                  ? "text-primary bg-primary/5 font-medium"
                  : ""
              }`}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
              {item.href === "/analytics" && !isPro && (
                <span className="ml-auto flex items-center gap-0.5 text-xs text-violet-500">
                  <Zap className="w-3 h-3" />
                  Pro
                </span>
              )}
            </Link>
          ))}
        </SidebarGroup>
      </SidebarContent>

      <SidebarGroup className="space-y-1">
        {/* <SidebarGroupLabel>Help</SidebarGroupLabel> */}
        {/* Quick Stats - Only for Pro Users */}
        {isPro && (
          <div className="px-4 py-3 mb-2">
            <div className="bg-gradient-to-r from-violet-500/10 to-purple-500/10 rounded-xl p-3 border border-violet-500/20">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium flex items-center gap-1">
                  <Trophy className="w-4 h-4 text-yellow-500" />
                  Pro Stats
                </span>
                <span className="text-xs bg-violet-500/20 text-violet-500 px-2 py-0.5 rounded-full">
                  Premium
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-white/5 rounded-lg p-2">
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
                    <Target className="w-3 h-3" />
                    Streak
                  </div>
                  <p className="text-lg font-semibold">12 days</p>
                </div>
                <div className="bg-white/5 rounded-lg p-2">
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
                    <TrendingUp className="w-3 h-3" />
                    Progress
                  </div>
                  <p className="text-lg font-semibold">87%</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </SidebarGroup>

      <SidebarFooter className="mt-auto border-t border-border/50">
        
        {/* Upgrade Button */}
        {!isPro && (
          <div className="px-4 py-4">
            <Button
              onClick={handleUpgradeClick}
              className="w-full bg-gradient-to-r from-violet-600 via-violet-500 to-purple-500 hover:from-violet-500 hover:to-purple-400 text-white font-medium group relative overflow-hidden shadow-lg transition-all duration-300 hover:shadow-violet-500/25 hover:scale-[1.02]"
            >
              <div className="absolute inset-0 bg-white/20 group-hover:bg-white/30 transition-colors duration-300" />
              <div className="relative flex items-center justify-center gap-2">
                <Crown className="w-4 h-4 text-yellow-300" />
                <span>Upgrade to Pro</span>
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/50 to-transparent" />
            </Button>
            <p className="text-xs text-center mt-2 text-muted-foreground">
              Unlock unlimited habits & more
            </p>
          </div>
        )}
        <div className="p-4">
          {isPro && (
            <div className="mb-4 px-2 py-1.5 bg-gradient-to-r from-violet-500/10 to-purple-500/10 rounded-lg border border-violet-500/20 flex items-center justify-center gap-1">
              <Crown className="w-4 h-4 text-yellow-500" />
              <span className="text-xs font-medium text-violet-500">
                Pro Member
              </span>
            </div>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="w-full border-border/50 border hover:bg-primary/5 p-2"
              >
                <div className="flex items-center gap-3 w-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/placeholder.svg" alt="Profile" />
                    <AvatarFallback className="text-primary">KJ</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col items-start">
                    <span className="text-sm font-medium">Kemo Jallow</span>
                    <span className="text-xs text-muted-foreground">
                      {isPro ? "Pro Member" : "Free Plan"}
                    </span>
                  </div>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className=" ml-8 w-64">
              <DropdownMenuLabel>Account</DropdownMenuLabel>
              <DropdownMenuItem className="flex items-center gap-2">
                <User className="w-4 h-4" />
                Profile Settings
              </DropdownMenuItem>
              <Link href="/profile/notifications">
                <DropdownMenuItem className="flex items-center gap-2">
                  <Bell className="w-4 h-4" />
                  Notifications
                </DropdownMenuItem>
              </Link>
              <Link href="/profile/billing">
                <DropdownMenuItem className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4" />
                  Billing
                </DropdownMenuItem>
              </Link>

              <DropdownMenuSeparator />
              <DropdownMenuLabel>Appearance</DropdownMenuLabel>
              <div className="flex items-center justify-between px-3 py-2">
                <div className="flex w-full items-center gap-2 rounded-lg border p-1">
                  <button
                    onClick={() => setTheme("light")}
                    className="flex flex-1 items-center justify-center rounded-md px-2 py-1.5 text-sm font-medium hover:bg-muted"
                  >
                    Light
                  </button>
                  <button
                    onClick={() => setTheme("dark")}
                    className="flex flex-1 items-center justify-center rounded-md px-2 py-1.5 text-sm font-medium hover:bg-muted"
                  >
                    Dark
                  </button>
                </div>
              </div>

              {!isPro && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="cursor-pointer px-3 py-2.5"
                    onClick={handleUpgradeClick}
                  >
                    <div className="w-full bg-gradient-to-r from-violet-600 via-violet-500 to-purple-500 text-white rounded-lg px-3 py-2 group relative overflow-hidden">
                      <div className="absolute inset-0 bg-white/10 group-hover:bg-white/20 transition-colors duration-300" />
                      <div className="relative flex items-center gap-2">
                        <Crown className="w-4 h-4 text-yellow-300" />
                        <div className="flex flex-col">
                          <span className="text-sm font-medium">
                            Upgrade to Pro
                          </span>
                          <span className="text-xs text-white/80">
                            Unlock all premium features
                          </span>
                        </div>
                        <div className="ml-auto bg-white/20 rounded-md px-2 py-0.5 text-xs">
                          20% OFF
                        </div>
                      </div>
                    </div>
                  </DropdownMenuItem>
                </>
              )}

              <DropdownMenuSeparator />
              <DropdownMenuLabel>Support</DropdownMenuLabel>
              <Link href="/help">
                <DropdownMenuItem className="flex items-center gap-2 cursor-pointer">
                  <HelpCircle className="w-4 h-4" />
                  Help Center
                </DropdownMenuItem>
              </Link>
              <Link href="/feedback">
                <DropdownMenuItem className="flex items-center gap-2 cursor-pointer">
                  <MessageSquare className="w-4 h-4" />
                  Feedback
                </DropdownMenuItem>
              </Link>
              <Link href="/whats-new">
                <DropdownMenuItem className="flex items-center gap-2 cursor-pointer">
                  <Sparkles className="w-4 h-4" />
                  What's New
                </DropdownMenuItem>
              </Link>

              <DropdownMenuSeparator />
              <DropdownMenuLabel>Legal</DropdownMenuLabel>
              <Link href="/terms" target="_blank" rel="noopener noreferrer">
                <DropdownMenuItem className="flex items-center gap-2 cursor-pointer">
                  <FileText className="w-4 h-4" />
                  Terms of Service
                </DropdownMenuItem>
              </Link>
              <Link href="/privacy" target="_blank" rel="noopener noreferrer">
                <DropdownMenuItem className="flex items-center gap-2 cursor-pointer">
                  <Shield className="w-4 h-4" />
                  Privacy Policy
                </DropdownMenuItem>
              </Link>

              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-600 flex items-center gap-2 cursor-pointer">
                <LogOut className="w-4 h-4" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}

export default AppSidebar;
