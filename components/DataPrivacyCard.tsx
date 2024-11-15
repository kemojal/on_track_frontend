import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Shield } from "lucide-react";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";

const DataPrivacyCard = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-primary" />
          Data & Privacy
        </CardTitle>
        <CardDescription>
          Manage your data and privacy preferences
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="font-medium">Data Export</span>
            <p className="text-sm text-muted-foreground">
              Download all your habit data
            </p>
          </div>
          <Button variant="outline">Export</Button>
        </div>
        <Separator />
        <div className="flex items-center justify-between">
          <div>
            <span className="font-medium">Delete Account</span>
            <p className="text-sm text-muted-foreground">
              Permanently delete your account
            </p>
          </div>
          <Button variant="destructive">Delete</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default DataPrivacyCard;
