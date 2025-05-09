"use client";

import React from 'react';
import { AuthProvider } from '@/contexts/AuthContext';
import { AccountProvider } from '@/contexts/AccountContext';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip'; // Added for potential tooltips in sidebar/icons

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <TooltipProvider>
      <AuthProvider>
        <AccountProvider>
          {children}
          <Toaster />
        </AccountProvider>
      </AuthProvider>
    </TooltipProvider>
  );
}
