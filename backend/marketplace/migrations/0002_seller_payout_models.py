import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ("marketplace", "0001_initial"),
    ]

    operations = [
        migrations.CreateModel(
            name="SellerPayout",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("paid_at", models.DateTimeField(auto_now_add=True)),
                (
                    "total_net_try",
                    models.PositiveIntegerField(default=0, help_text="Bu ödemede yer alan net tutar (₺)."),
                ),
                (
                    "reference_note",
                    models.TextField(blank=True, default="", help_text="Dekont/havale referansı vb."),
                ),
                (
                    "seller",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="seller_payouts",
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
            ],
            options={
                "ordering": ["-paid_at"],
            },
        ),
        migrations.CreateModel(
            name="SellerEarning",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("gross_try", models.PositiveIntegerField()),
                ("commission_try", models.PositiveIntegerField()),
                ("net_try", models.PositiveIntegerField()),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                (
                    "material",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.PROTECT,
                        related_name="seller_earnings",
                        to="marketplace.material",
                    ),
                ),
                (
                    "order",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="seller_earnings",
                        to="marketplace.order",
                    ),
                ),
                (
                    "payout",
                    models.ForeignKey(
                        blank=True,
                        null=True,
                        on_delete=django.db.models.deletion.SET_NULL,
                        related_name="earnings",
                        to="marketplace.sellerpayout",
                    ),
                ),
                (
                    "seller",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="seller_earnings",
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
            ],
            options={
                "ordering": ["-created_at"],
            },
        ),
        migrations.AddConstraint(
            model_name="sellerearning",
            constraint=models.UniqueConstraint(
                fields=("order", "material"),
                name="uniq_seller_earning_order_material",
            ),
        ),
    ]
