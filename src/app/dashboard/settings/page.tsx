
"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { Palette, Bell, Database, Save } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import type { UserSettings } from "@/types";
import { getUserSettings, saveUserSettings } from "@/services/userSettingsService";
import { Skeleton } from "@/components/ui/skeleton";

type Theme = "light" | "dark" | "system";

export default function SettingsPage() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = React.useState(true);
  const [theme, setTheme] = React.useState<Theme>("system");
  const [emailNotifications, setEmailNotifications] = React.useState(true);
  const [pushNotifications, setPushNotifications] = React.useState(false);
  const [shareData, setShareData] = React.useState(true);

  const applyTheme = React.useCallback((selectedTheme: Theme) => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");

    if (selectedTheme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
      root.classList.add(systemTheme);
    } else {
      root.classList.add(selectedTheme);
    }
  }, []);

  React.useEffect(() => {
    const loadSettings = async () => {
      setIsLoading(true);
      try {
        const settings = await getUserSettings();
        setTheme(settings.theme || "system");
        setEmailNotifications(settings.emailNotifications !== undefined ? settings.emailNotifications : true);
        setPushNotifications(settings.pushNotifications !== undefined ? settings.pushNotifications : false);
        setShareData(settings.shareData !== undefined ? settings.shareData : true);
        applyTheme(settings.theme || "system");
      } catch (error) {
        toast({
          title: "Error loading settings",
          description: "Could not load your saved preferences.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    loadSettings();
  }, [toast, applyTheme]);

  const handleThemeChange = (newTheme: Theme) => {
    setTheme(newTheme);
    applyTheme(newTheme);
  };

  const handleSaveChanges = async () => {
    setIsLoading(true);
    const currentSettings: UserSettings = {
      theme,
      emailNotifications,
      pushNotifications,
      shareData,
    };
    try {
      await saveUserSettings(currentSettings);
      toast({
        title: "Settings Saved",
        description: "Your preferences have been successfully saved.",
      });
    } catch (error) {
      toast({
        title: "Error Saving Settings",
        description: "Could not save your preferences.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  if (isLoading) {
    return (
      <div className="space-y-8">
        <Skeleton className="h-10 w-1/2" />
        {[1,2,3].map(i => (
          <Card key={i} className="shadow-lg">
            <CardHeader>
              <Skeleton className="h-6 w-1/3 mb-2" />
              <Skeleton className="h-4 w-2/3" />
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
            </CardContent>
          </Card>
        ))}
        <div className="flex justify-end pt-4">
          <Skeleton className="h-10 w-32" />
        </div>
      </div>
    )
  }


  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-primary">Application Settings</h1>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <Palette className="h-5 w-5 text-accent" />
            Appearance
          </CardTitle>
          <CardDescription>Customize the look and feel of the application.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="theme-group" className="text-base font-medium">Theme</Label>
            <RadioGroup
              id="theme-group"
              value={theme}
              onValueChange={(value) => handleThemeChange(value as Theme)}
              className="mt-2 grid grid-cols-1 sm:grid-cols-3 gap-4"
            >
              {(["light", "dark", "system"] as Theme[]).map((themeOption) => (
                <Label
                  key={themeOption}
                  htmlFor={`theme-${themeOption}`}
                  className={cn(
                    "flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground cursor-pointer",
                    theme === themeOption && "border-primary"
                  )}
                >
                  <RadioGroupItem value={themeOption} id={`theme-${themeOption}`} className="sr-only" />
                  <Palette className="mb-3 h-6 w-6" />
                  {themeOption.charAt(0).toUpperCase() + themeOption.slice(1)}
                </Label>
              ))}
            </RadioGroup>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <Bell className="h-5 w-5 text-accent" />
            Notifications
          </CardTitle>
          <CardDescription>Manage how you receive notifications from Account Central.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between space-x-2 p-3 rounded-md border hover:bg-secondary/30">
            <Label htmlFor="email-notifications" className="font-medium cursor-pointer flex-grow">
              Email Notifications
              <p className="text-xs text-muted-foreground">Receive updates and alerts via email.</p>
            </Label>
            <Checkbox
              id="email-notifications"
              checked={emailNotifications}
              onCheckedChange={(checked) => setEmailNotifications(Boolean(checked))}
            />
          </div>
          <div className="flex items-center justify-between space-x-2 p-3 rounded-md border hover:bg-secondary/30">
            <Label htmlFor="push-notifications" className="font-medium cursor-pointer flex-grow">
              Push Notifications
              <p className="text-xs text-muted-foreground">Get real-time updates on your device (if supported).</p>
            </Label>
            <Checkbox
              id="push-notifications"
              checked={pushNotifications}
              onCheckedChange={(checked) => setPushNotifications(Boolean(checked))}
            />
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <Database className="h-5 w-5 text-accent" />
            Data Preferences
          </CardTitle>
          <CardDescription>Control how your data is used within the application.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between space-x-2 p-3 rounded-md border hover:bg-secondary/30">
            <Label htmlFor="share-data" className="font-medium cursor-pointer flex-grow">
              Share Anonymous Usage Data
              <p className="text-xs text-muted-foreground">Help us improve Account Central by sharing anonymous usage statistics.</p>
            </Label>
            <Switch
              id="share-data"
              checked={shareData}
              onCheckedChange={setShareData}
            />
          </div>
        </CardContent>
      </Card>
      
      <div className="flex justify-end pt-4">
        <Button onClick={handleSaveChanges} className="bg-accent hover:bg-accent/90 text-accent-foreground" disabled={isLoading}>
          <Save className="mr-2 h-4 w-4" />
          {isLoading ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </div>
  );
}
