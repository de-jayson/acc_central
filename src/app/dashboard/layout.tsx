"use client";

import { AppHeader } from "@/components/dashboard/AppHeader";
import { AppSidebar } from "@/components/dashboard/AppSidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isLoading: authLoading } = useRequireAuth();

  if (authLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Skeleton className="h-12 w-48" />
          <Skeleton className="h-8 w-32" />
          <div className="mt-4 flex gap-2">
            <Skeleton className="h-64 w-16" />
            <Skeleton className="h-64 w-96" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <SidebarProvider defaultOpen={true}> {/* Manage sidebar state */}
      <AppSidebar />
      <SidebarInset className="flex flex-col bg-background">
        <AppHeader />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 bg-background">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
