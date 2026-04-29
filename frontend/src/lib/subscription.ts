import type { SubscriptionPayload } from "@/lib/types/api";

export function subscriptionPlanCode(sub: SubscriptionPayload | null): string | null {
  if (!sub || typeof sub !== "object") return null;
  const plan = "plan" in sub ? sub.plan : null;
  if (plan && typeof plan === "object" && "code" in plan && typeof (plan as { code?: string }).code === "string") {
    return (plan as { code: string }).code;
  }
  return null;
}
