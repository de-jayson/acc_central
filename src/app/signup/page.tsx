"use client";

import { SignupForm } from "@/components/auth/SignupForm";
import { Logo } from "@/components/Logo";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function SignupPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace('/dashboard');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading || (!isLoading && isAuthenticated)) {
    // Show loading or nothing while redirecting
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <p className="text-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4 sm:p-6 md:p-8">
      <div className="mb-8">
        <Logo iconSize={40} textSize="text-4xl" />
      </div>
      <SignupForm />
    </div>
  );
}
