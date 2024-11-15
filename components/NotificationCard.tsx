import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Bell, CalendarIcon, Clock, Mail, Smartphone } from "lucide-react";
import { NotificationCardItem } from "./NotificationCardItem";

const NotificationCard = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="w-5 h-5 text-primary" />
          Notifications
        </CardTitle>
        <CardDescription>Configure how you want to be reminded</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <NotificationCardItem
          title="Weekly Report"
          description="Get reminded of your habits throughout the week"
          icon={CalendarIcon}
          enabled={true}
          onChange={() => {}}
        />
        <NotificationCardItem
          title="Push Notifications"
          description="Get reminded of your habits throughout the day"
          icon={Smartphone}
          enabled={true}
          onChange={() => {}}
        />
        <NotificationCardItem
          title="Email Digests"
          description="Receive weekly progress reports and insights"
          icon={Mail}
          enabled={true}
          onChange={() => {}}
        />
        <NotificationCardItem
          title="Smart Reminders"
          description="AI-powered notifications based on your activity patterns"
          icon={Clock}
          enabled={false}
          onChange={() => {}}
        />
      </CardContent>
    </Card>
  );
};

export default NotificationCard;
