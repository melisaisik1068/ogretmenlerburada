"use client";

import * as React from "react";
import * as AccordionPrimitive from "@radix-ui/react-accordion";

import { cn } from "@/lib/utils";

const Accordion = AccordionPrimitive.Root;

const AccordionItem = ({
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>) => (
  <AccordionPrimitive.Item className={cn("border-b border-slate-200/80 last:border-b-0", className)} {...props} />
);

const AccordionTrigger = ({
  className,
  children,
  ...props
}: React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>) => (
  <AccordionPrimitive.Header className="flex">
    <AccordionPrimitive.Trigger
      className={cn(
        "group flex flex-1 items-center justify-between gap-3 rounded-2xl px-1 py-4 text-left text-sm font-semibold text-[var(--brand-navy)] transition-all duration-200",
        "hover:text-[var(--brand-blue)] data-[state=open]:text-[var(--brand-blue)]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-blue)]/30",
        className,
      )}
      {...props}
    >
      {children}
      <span className="ml-2 inline-flex size-8 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 transition duration-300 group-hover:border-[var(--brand-blue)]/40 group-hover:text-[var(--brand-blue)] group-data-[state=open]:rotate-180">
        ⌄
      </span>
    </AccordionPrimitive.Trigger>
  </AccordionPrimitive.Header>
);

function AccordionContent({
  className,
  children,
  ...props
}: React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>) {
  return (
    <AccordionPrimitive.Content
      className="data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down overflow-hidden"
      {...props}
    >
      <div className={cn("pb-5 pt-1 text-sm leading-relaxed text-slate-600", className)}>{children}</div>
    </AccordionPrimitive.Content>
  );
}

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
