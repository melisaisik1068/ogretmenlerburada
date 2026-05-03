# Generated manually for Stack Overflow–style accepted answer

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("community", "0003_alter_communityanswer_approved_at_and_more"),
    ]

    operations = [
        migrations.AddField(
            model_name="communityanswer",
            name="is_accepted",
            field=models.BooleanField(
                default=False,
                verbose_name="En iyi cevap",
                help_text="Gönderi sahibi veya moderatör tarafından işaretlenir; soru başlığında tek olabilir.",
            ),
        ),
        migrations.AddConstraint(
            model_name="communityanswer",
            constraint=models.UniqueConstraint(
                condition=models.Q(is_accepted=True),
                fields=("post",),
                name="community_answer_one_accepted_per_post",
            ),
        ),
    ]
