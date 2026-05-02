from django.core.management.base import BaseCommand

from subscriptions.models import SubscriptionPlan, SubscriptionPlanCode


class Command(BaseCommand):
    help = "Create default subscription plans (Temel/Pro/Kurumsal)."

    def handle(self, *args, **options):
        defaults = [
            (SubscriptionPlanCode.BASIC, "Temel", 900),
            (SubscriptionPlanCode.PRO, "Pro", 1500),
            (SubscriptionPlanCode.ENTERPRISE, "Kurumsal", 2000),
        ]

        for code, title, price in defaults:
            SubscriptionPlan.objects.update_or_create(
                code=code,
                defaults={"title": title, "price_try": price, "is_active": True, "billing_cycle_days": 30},
            )

        self.stdout.write(self.style.SUCCESS("Seeded subscription plans."))

