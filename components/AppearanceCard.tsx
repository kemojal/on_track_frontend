import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Switch } from "./ui/switch";
import { useTheme } from "next-themes";
import { Globe, Moon, Sun } from "lucide-react";

const AppearanceCard = () => {
    const { theme, setTheme } = useTheme();
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Globe className="w-5 h-5 text-primary" />
          Appearance
        </CardTitle>
        <CardDescription>
          Customize how Everyday looks and feels
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="font-medium">Theme Preference</span>
            <p className="text-sm text-muted-foreground">
              Choose your preferred theme
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Switch
              checked={theme === "dark"}
              onCheckedChange={(checked) =>
                setTheme(checked ? "dark" : "light")
              }
            />
            {theme === "dark" ? (
              <Moon className="w-4 h-4" />
            ) : (
              <Sun className="w-4 h-4" />
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AppearanceCard;
