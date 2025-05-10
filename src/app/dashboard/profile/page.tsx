
"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { User, KeyRound, Shield, Eye, EyeOff } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const changeUsernameSchema = z.object({
  newUsername: z.string().min(3, "Username must be at least 3 characters."),
});

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required."), // Remains for UI, but not validated by mock service
  newPassword: z.string().min(6, "New password must be at least 6 characters."),
  confirmNewPassword: z.string(),
}).refine(data => data.newPassword === data.confirmNewPassword, {
  message: "New passwords don't match",
  path: ["confirmNewPassword"],
});

export default function ProfilePage() {
  const { user, isLoading: authLoading, updateUsername, updatePassword } = useAuth();
  const { toast } = useToast();
  const [showCurrentPassword, setShowCurrentPassword] = React.useState(false);
  const [showNewPassword, setShowNewPassword] = React.useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = React.useState(false);

  const usernameForm = useForm<z.infer<typeof changeUsernameSchema>>({
    resolver: zodResolver(changeUsernameSchema),
    defaultValues: { newUsername: user?.username || "" },
  });

  React.useEffect(() => {
    if (user) {
      usernameForm.reset({ newUsername: user.username });
    }
  }, [user, usernameForm]);

  const passwordForm = useForm<z.infer<typeof changePasswordSchema>>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: { currentPassword: "", newPassword: "", confirmNewPassword: "" },
  });

  const getInitials = (name?: string) => {
    if (!name) return "U";
    return name.substring(0, 2).toUpperCase();
  };

  const onSubmitUsername = async (values: z.infer<typeof changeUsernameSchema>) => {
    if (!user || values.newUsername === user.username) {
      toast({
        title: "No Change",
        description: "The new username is the same as the current one.",
        variant: "default",
      });
      return;
    }
    try {
      await updateUsername(values.newUsername);
      toast({
        title: "Username Updated",
        description: `Your username has been changed to "${values.newUsername}".`,
      });
    } catch (error: any) {
      toast({
        title: "Update Failed",
        description: error.message || "Could not update username.",
        variant: "destructive",
      });
    }
  };

  const onSubmitPassword = async (values: z.infer<typeof changePasswordSchema>) => {
    try {
      await updatePassword(values.currentPassword, values.newPassword);
      toast({
        title: "Password Updated (Mock)",
        description: "Your password has been successfully updated. (This is a mock operation for the demo).",
      });
      passwordForm.reset();
    } catch (error: any) {
       toast({
        title: "Password Update Failed",
        description: error.message || "Could not update password.",
        variant: "destructive",
      });
    }
  };

  if (authLoading && !user) { // Check !user to avoid flashing during username update
    return <div className="p-8">Loading profile...</div>;
  }

  if (!user) {
    return <div className="p-8">User not found. Please log in.</div>;
  }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-primary">User Profile</h1>

      <Card className="shadow-lg">
        <CardHeader className="flex flex-row items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={`https://i.pravatar.cc/100?u=${user.username}`} alt={user.username} data-ai-hint="user avatar large" />
            <AvatarFallback>{getInitials(user.username)}</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-2xl">{user.username}</CardTitle>
            <CardDescription>Manage your personal information and security settings.</CardDescription>
          </div>
        </CardHeader>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <User className="h-5 w-5 text-accent" />
            Change Username
          </CardTitle>
          <CardDescription>Update your display name. This will affect how your accounts are linked.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...usernameForm}>
            <form onSubmit={usernameForm.handleSubmit(onSubmitUsername)} className="space-y-4">
              <FormField
                control={usernameForm.control}
                name="newUsername"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New Username</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter new username" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="bg-accent hover:bg-accent/90 text-accent-foreground" disabled={authLoading}>
                {authLoading ? "Saving..." : "Save Username"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <KeyRound className="h-5 w-5 text-accent" />
            Change Password
          </CardTitle>
          <CardDescription>Update your account password. Make sure it&apos;s strong! (Mock)</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...passwordForm}>
            <form onSubmit={passwordForm.handleSubmit(onSubmitPassword)} className="space-y-4">
              <FormField
                control={passwordForm.control}
                name="currentPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Current Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input type={showCurrentPassword ? "text" : "password"} placeholder="•••••••• (mock)" {...field} />
                        <Button
                          type="button" variant="ghost" size="icon"
                          className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                          onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        >
                          {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={passwordForm.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New Password</FormLabel>
                    <FormControl>
                     <div className="relative">
                        <Input type={showNewPassword ? "text" : "password"} placeholder="••••••••" {...field} />
                        <Button
                          type="button" variant="ghost" size="icon"
                          className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                        >
                          {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={passwordForm.control}
                name="confirmNewPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm New Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input type={showConfirmNewPassword ? "text" : "password"} placeholder="••••••••" {...field} />
                        <Button
                          type="button" variant="ghost" size="icon"
                          className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                          onClick={() => setShowConfirmNewPassword(!showConfirmNewPassword)}
                        >
                          {showConfirmNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="bg-accent hover:bg-accent/90 text-accent-foreground" disabled={authLoading}>
                {authLoading ? "Saving..." : "Save Password"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
