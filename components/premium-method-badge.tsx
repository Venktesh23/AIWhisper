"use client"

import { cn } from '@/lib/utils';

interface PremiumMethodBadgeProps {
  method: string;
  className?: string;
}

const methodStyles = {
  GET: "neon-get",
  POST: "neon-post", 
  PUT: "neon-put",
  DELETE: "neon-delete",
  PATCH: "neon-patch",
  OPTIONS: "neon-get",
  HEAD: "neon-get"
};

export function PremiumMethodBadge({ method, className }: PremiumMethodBadgeProps) {
  const styleClass = methodStyles[method as keyof typeof methodStyles] || "neon-get";
  
  return (
    <span className={cn("neon-badge", styleClass, className)}>
      {method}
    </span>
  );
} 