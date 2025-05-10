
"use client";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, UserCircle, Settings, ChevronDown } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Logo } from "@/components/Logo";
import { SidebarTrigger } from "@/components/ui/sidebar"; // Import SidebarTrigger
import Link from "next/link"; // Import Link

export function AppHeader() {
  const { user, logOut } = useAuth();

  const getInitials = (name?: string) => {
    if (!name) return 'U';
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-card px-4 sm:px-6 shadow-sm">
      {/* SidebarTrigger for mobile and collapsible sidebar */}
      <div className="md:hidden"> {/* Only show on smaller screens if sidebar is collapsible */}
        <SidebarTrigger />
      </div>
      <div className="hidden md:block"> {/* Logo for larger screens */}
        <Logo className="text-lg" iconSize={24} textSize="text-xl" />
      </div>
      
      <div className="flex-1 md:hidden text-center"> {/* Centered Logo for smaller screens */}
         <Logo className="text-lg justify-center" iconSize={24} textSize="text-xl" />
      </div>


      <div className="flex items-center gap-4 ml-auto">
        {user && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative flex items-center gap-2 p-1.5 h-auto rounded-full focus-visible:ring-ring focus-visible:ring-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={`https://i.pravatar.cc/40?u=${user.username}`} alt={user.username} data-ai-hint="user avatar" />
                  <AvatarFallback>{getInitials(user.username)}</AvatarFallback>
                </Avatar>
                <span className="hidden sm:inline font-medium">{user.username}</span>
                <ChevronDown className="h-4 w-4 text-muted-foreground hidden sm:inline" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">Signed in as</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user.username}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/dashboard/profile">
                  <UserCircle className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/dashboard/settings">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logOut} className="text-red-600 focus:bg-red-50 focus:text-red-700 dark:focus:bg-red-900/50 dark:focus:text-red-400">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </header>
  );
}
