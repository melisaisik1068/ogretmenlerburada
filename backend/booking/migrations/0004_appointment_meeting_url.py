from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("booking", "0003_alter_appointment_created_at_and_more"),
    ]

    operations = [
        migrations.AddField(
            model_name="appointment",
            name="meeting_url",
            field=models.URLField(
                blank=True,
                default="",
                help_text="Google Meet, Zoom, Jitsi veya başka bir canlı oturum adresi.",
                max_length=500,
                verbose_name="Canlı ders / toplantı linki",
            ),
        ),
    ]
