import { Wallet } from 'lucide-react'; // Using Wallet icon for the logo
import React from 'react'; // Import React for React.memo

interface LogoProps {
  className?: string;
  iconSize?: number;
  textSize?: string;
}

export const Logo = React.memo(function LogoComponent({ className, iconSize = 28, textSize = "text-2xl" }: LogoProps) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Wallet color="hsl(var(--accent))" size={iconSize} />
      <h1 className={`font-bold ${textSize} text-primary`}>
        Account Central
      </h1>
    </div>
  );
});
