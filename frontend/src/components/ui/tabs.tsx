"use client";

import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";

import { cn } from "@/lib/utils";

const Tabs = TabsPrimitive.Root;

const TabsList = ({ className, ...props }: React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>) => (
  <TabsPrimitive.List
    className={cn(
      "inline-flex h-auto min-h-11 flex-wrap items-center gap-1 rounded-2xl border border-slate-200/90 bg-[var(--surface-muted)] p-1 text-sm text-[var(--foreground)] shadow-sm backdrop-blur-sm",
      className,
    )}
    {...props}
  />
);

const TabsTrigger = ({ className, ...props }: React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>) => (
  <TabsPrimitive.Trigger
    className={cn(
      "inline-flex shrink-0 items-center justify-center rounded-xl px-4 py-2 font-semibold tracking-tight text-slate-600 transition-colors duration-200",
      "data-[state=active]:bg-white data-[state=active]:text-[var(--brand-navy)] data-[state=active]:shadow-sm",
      "hover:text-[var(--brand-navy)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-blue)]/35",
      className,
    )}
    {...props}
  />
);

const TabsContent = ({ className, ...props }: React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>) => (
  <TabsPrimitive.Content
    className={cn("mt-2 outline-none data-[state=inactive]:hidden", className)}
    {...props}
  />
);

export { Tabs, TabsList, TabsTrigger, TabsContent };
