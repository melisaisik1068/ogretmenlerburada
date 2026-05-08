from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("contact", "0004_alter_contactmessage_created_at_and_more"),
    ]

    operations = [
        migrations.AddField(
            model_name="contactmessage",
            name="phone",
            field=models.CharField(blank=True, default="", max_length=32, verbose_name="Telefon"),
        ),
        migrations.AddField(
            model_name="contactmessage",
            name="kvkk_consent",
            field=models.BooleanField(default=False, verbose_name="KVKK onayı"),
        ),
    ]

