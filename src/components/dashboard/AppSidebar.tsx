"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Logo } from "@/components/Logo";
import { LayoutDashboard, PlusCircle, Sparkles, Settings, HelpCircle, ShieldCheck } from "lucide-react";
import { Button } from "../ui/button";
import { useAuth } from "@/contexts/AuthContext";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/add-account", label: "Add Account", icon: PlusCircle },
  { href: "/dashboard/categorize", label: "Categorize Tool", icon: Sparkles },
];

const secondaryNavItems = [
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
  { href: "/dashboard/help", label: "Help & Support", icon: HelpCircle },
  { href: "/dashboard/security", label: "Security", icon: ShieldCheck },
];


export function AppSidebar() {
  const pathname = usePathname();
  const { user, logOut } = useAuth();

  return (
    <Sidebar variant="sidebar" collapsible="icon" side="left">
      <SidebarHeader className="border-b border-sidebar-border">
        <Logo className="text-sidebar-foreground group-data-[collapsible=icon]:hidden" iconSize={28} textSize="text-2xl" />
         {/* Placeholder for icon-only logo when collapsed */}
        <div className="hidden group-data-[collapsible=icon]:block py-2">
            <WalletIconSimple className="h-7 w-7 mx-auto text-sidebar-accent" />
        </div>
      </SidebarHeader>
      <SidebarContent className="p-2">
        <SidebarMenu>
          {navItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <Link href={item.href} passHref legacyBehavior>
                <SidebarMenuButton
                  isActive={pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href))}
                  tooltip={{ children: item.label, className:"bg-sidebar text-sidebar-foreground border-sidebar-border"}}
                >
                  <item.icon />
                  <span>{item.label}</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
        
        <div className="mt-auto"> {/* Pushes secondaryNavItems and footer to the bottom */}
          <SidebarMenu className="mt-4 pt-4 border-t border-sidebar-border">
             {secondaryNavItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <Link href={item.href} passHref legacyBehavior>
                  <SidebarMenuButton
                    isActive={pathname === item.href}
                    tooltip={{ children: item.label, className:"bg-sidebar text-sidebar-foreground border-sidebar-border" }}
                  >
                    <item.icon />
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </div>

      </SidebarContent>
       <SidebarFooter className="p-2 border-t border-sidebar-border">
         {user && (
            <div className="flex flex-col items-start gap-2 group-data-[collapsible=icon]:items-center">
                <div className="flex items-center gap-2 group-data-[collapsible=icon]:flex-col group-data-[collapsible=icon]:text-center">
                    <img 
                        src={`https://i.pravatar.cc/40?u=${user.username}`} 
                        alt={user.username}
                        data-ai-hint="user avatar" 
                        className="h-8 w-8 rounded-full"
                    />
                    <div className="group-data-[collapsible=icon]:hidden">
                        <p className="text-sm font-medium text-sidebar-foreground">{user.username}</p>
                        <p className="text-xs text-sidebar-foreground/70">Your Plan: Free</p>
                    </div>
                </div>
                <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full bg-sidebar-accent text-sidebar-accent-foreground hover:bg-sidebar-accent/80 group-data-[collapsible=icon]:w-auto group-data-[collapsible=icon]:p-2"
                    onClick={logOut}
                    title="Log Out"
                >
                    <LogOutIcon className="h-4 w-4 group-data-[collapsible=icon]:m-0 group-data-[collapsible=icon]:mr-0 mr-2" />
                    <span className="group-data-[collapsible=icon]:hidden">Log Out</span>
                </Button>
            </div>
         )}
      </SidebarFooter>
    </Sidebar>
  );
}


// Simple Wallet Icon for collapsed state
function WalletIconSimple(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1" />
      <path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4" />
    </svg>
  )
}

// LogOut Icon to avoid conflicts if not imported elsewhere
function LogOutIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" x2="9" y1="12" y2="12" />
    </svg>
  )
}
