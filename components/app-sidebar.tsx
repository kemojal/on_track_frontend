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
  MoreVertical,
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

export function AppSidebar() {
  const pathname = usePathname();
  const { setIsNewHabitOpen } = useHabitStore();
  const { setTheme } = useTheme();

  const navigationItems = [
    { href: "/home", label: "Home", icon: Home },
    { href: "/analytics", label: "Analytics", icon: BarChart2 },
    { href: "/calendar", label: "Calendar", icon: Calendar },
    { href: "/settings", label: "Settings", icon: Settings },
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

          {/* User Profile Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-transparent border-border/50 border-[1px] hover:border-primary p-1 ">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder.svg" alt="Profile" />
                  <AvatarFallback className="text-primary">KJ</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/placeholder.svg" alt="Profile" />
                    <AvatarFallback>KJ</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="font-medium">Kemo Jallow</span>
                    <span className="text-xs text-muted-foreground">
                      Member
                    </span>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuLabel>Appearance</DropdownMenuLabel>
              <div className="flex items-center justify-between px-3 py-2">
                <div className="flex w-full items-center gap-2 rounded-lg border p-1">
                  <button
                    onClick={() => setTheme("light")}
                    className="flex flex-1 items-center justify-center rounded-md px-2 py-1.5 text-sm font-medium ring-offset-background hover:bg-muted hover:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 data-[state=on]:bg-accent data-[state=on]:text-accent-foreground"
                  >
                    Light
                  </button>
                  <button
                    onClick={() => setTheme("dark")}
                    className="flex flex-1 items-center justify-center rounded-md px-2 py-1.5 text-sm font-medium ring-offset-background hover:bg-muted hover:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 data-[state=on]:bg-accent data-[state=on]:text-accent-foreground"
                  >
                    Dark
                  </button>
                  <button
                    onClick={() => setTheme("system")}
                    className="flex flex-1 items-center justify-center rounded-md px-2 py-1.5 text-sm font-medium ring-offset-background hover:bg-muted hover:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 data-[state=on]:bg-accent data-[state=on]:text-accent-foreground"
                  >
                    System
                  </button>
                </div>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem>News</DropdownMenuItem>
              {/* <DropdownMenuItem>Creator Hub</DropdownMenuItem> */}
              <DropdownMenuItem>Help centre & FAQ</DropdownMenuItem>
              <DropdownMenuItem>Feature Requests</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Terms of Use</DropdownMenuItem>
              <DropdownMenuItem>Privacy Policy</DropdownMenuItem>
              {/* <DropdownMenuItem>Community Policies</DropdownMenuItem> */}
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-600">
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2">
        <SidebarGroup className="space-y-1">
          {navigationItems.map((item) => {
            const IconComponent = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 group
                  ${
                    isActive
                      ? "bg-sidebar-accent text-sidebar-primary font-medium"
                      : "text-sidebar-foreground hover:bg-sidebar-accent/50"
                  }`}
              >
                <IconComponent
                  className={`w-5 h-5 ${
                    isActive ? "text-violet-500" : "text-muted-foreground"
                  }`}
                />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="px-4 pb-6 relative z-50">
        <Button
          onClick={() => setIsNewHabitOpen(true)}
          className="w-full bg-gradient-to-r from-violet-500 to-purple-500 text-white hover:opacity-90 rounded-xl h-12 shadow-lg shadow-violet-500/20 transition-all duration-200 hover:shadow-violet-500/30 relative z-50"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add New Habit
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}

export default AppSidebar;
