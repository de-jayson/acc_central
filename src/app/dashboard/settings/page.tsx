
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

export default function SettingsPage() {
  const { toast } = useToast();
  const [theme, setTheme] = React.useState("system");
  const [emailNotifications, setEmailNotifications] = React.useState(true);
  const [pushNotifications, setPushNotifications] = React.useState(false);
  const [shareData, setShareData] = React.useState(true);

  const handleSaveChanges = () => {
    // Mock save functionality
    toast({
      title: "Settings Saved",
      description: "Your preferences have been (mock) saved.",
    });
  };

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
              defaultValue={theme}
              onValueChange={setTheme}
              className="mt-2 grid grid-cols-1 sm:grid-cols-3 gap-4"
            >
              <Label
                htmlFor="theme-light"
                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary"
              >
                <RadioGroupItem value="light" id="theme-light" className="sr-only" />
                <Palette className="mb-3 h-6 w-6" />
                Light
              </Label>
              <Label
                htmlFor="theme-dark"
                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary"
              >
                <RadioGroupItem value="dark" id="theme-dark" className="sr-only" />
                <Palette className="mb-3 h-6 w-6" />
                Dark
              </Label>
              <Label
                htmlFor="theme-system"
                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary"
              >
                <RadioGroupItem value="system" id="theme-system" className="sr-only" />
                <Palette className="mb-3 h-6 w-6" />
                System
              </Label>
            </RadioGroup>
            <p className="text-sm text-muted-foreground mt-2">
              Note: Theme switching is currently a visual mock and does not change the actual application theme.
            </p>
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
            <Label htmlFor="email-notifications" className="font-medium">
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
            <Label htmlFor="push-notifications" className="font-medium">
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
            <Label htmlFor="share-data" className="font-medium">
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
        <Button onClick={handleSaveChanges} className="bg-accent hover:bg-accent/90 text-accent-foreground">
          <Save className="mr-2 h-4 w-4" />
          Save Changes
        </Button>
      </div>
    </div>
  );
}
