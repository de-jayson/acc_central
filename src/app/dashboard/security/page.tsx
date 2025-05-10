
"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { ShieldAlert, Smartphone, KeyRound, ShieldCheck, LogIn } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";

const recentActivity = [
  { id: "1", date: "2024-07-20 10:00 AM", device: "Chrome on Windows", ip: "192.168.1.100", status: "Successful" },
  { id: "2", date: "2024-07-19 05:30 PM", device: "Safari on macOS", ip: "10.0.0.5", status: "Successful" },
  { id: "3", date: "2024-07-19 09:15 AM", device: "Mobile App on Android", ip: "172.16.0.12", status: "Failed Attempt" },
];

export default function SecurityPage() {
  const { toast } = useToast();
  const [is2FAEnabled, setIs2FAEnabled] = React.useState(false);

  const handleToggle2FA = () => {
    setIs2FAEnabled(!is2FAEnabled);
    toast({
      title: `Two-Factor Authentication ${!is2FAEnabled ? "Enabled" : "Disabled"} (Mock)`,
      description: `2FA status has been updated. This is a mock action.`,
    });
  };

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-primary">Security Settings</h1>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <ShieldCheck className="h-5 w-5 text-accent" />
            Two-Factor Authentication (2FA)
          </CardTitle>
          <CardDescription>Add an extra layer of security to your account.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between space-x-2 p-3 rounded-md border hover:bg-secondary/30">
            <Label htmlFor="enable-2fa" className="font-medium">
              Enable Two-Factor Authentication
              <p className="text-xs text-muted-foreground">
                {is2FAEnabled 
                  ? "2FA is currently active. You will be prompted for a code from your authenticator app upon login." 
                  : "Protect your account with an additional verification step during login."}
              </p>
            </Label>
            <Switch
              id="enable-2fa"
              checked={is2FAEnabled}
              onCheckedChange={handleToggle2FA}
            />
          </div>
           {is2FAEnabled && (
            <div className="p-3 bg-green-50 border border-green-200 rounded-md text-green-700 text-sm">
              <Smartphone className="inline h-4 w-4 mr-1" /> 
              2FA is active. You're more secure!
            </div>
          )}
          {!is2FAEnabled && (
             <Button onClick={handleToggle2FA} variant="outline">
                Set Up 2FA
            </Button>
          )}
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <KeyRound className="h-5 w-5 text-accent" />
            Password Management
          </CardTitle>
          <CardDescription>Keep your password strong and unique.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-muted-foreground">
            Regularly changing your password and using a strong, unique password helps protect your account.
          </p>
          <Button asChild variant="default" className="bg-primary hover:bg-primary/90 text-primary-foreground">
            <Link href="/dashboard/profile">
              <KeyRound className="mr-2 h-4 w-4" />
              Change Your Password
            </Link>
          </Button>
          <p className="text-xs text-muted-foreground pt-2">
            You will be redirected to your profile page to change your password.
          </p>
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <LogIn className="h-5 w-5 text-accent" />
            Recent Login Activity
          </CardTitle>
          <CardDescription>Review recent logins to your account. This is mock data.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date & Time</TableHead>
                <TableHead>Device/Browser</TableHead>
                <TableHead>IP Address</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentActivity.map((activity) => (
                <TableRow key={activity.id}>
                  <TableCell>{activity.date}</TableCell>
                  <TableCell>{activity.device}</TableCell>
                  <TableCell>{activity.ip}</TableCell>
                  <TableCell>
                     <span className={`${activity.status === "Successful" ? "text-green-600" : "text-red-600"} font-medium`}>
                       {activity.status}
                     </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
           <p className="text-xs text-muted-foreground pt-4">
            If you see any suspicious activity, please change your password immediately and contact support.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
