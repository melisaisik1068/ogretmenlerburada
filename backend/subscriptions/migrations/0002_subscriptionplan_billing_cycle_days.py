# Generated manually for SubscriptionPlan billing cycle (İyzico/tekrarsız ödeme dönemi).

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("subscriptions", "0001_initial"),
    ]

    operations = [
        migrations.AddField(
            model_name="subscriptionplan",
            name="billing_cycle_days",
            field=models.PositiveSmallIntegerField(
                default=30,
                help_text="İyzico/tekrarlayan olmayan tek sefer ödemede bir dönem süresi (gün).",
            ),
        ),
    ]
