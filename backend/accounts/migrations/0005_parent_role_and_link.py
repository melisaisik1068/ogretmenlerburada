# Generated manually for parent role + ParentStudentLink

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ("accounts", "0004_user_phone_user_accounts_us_phone_f54457_idx_and_more"),
    ]

    operations = [
        migrations.AlterField(
            model_name="user",
            name="role",
            field=models.CharField(
                choices=[
                    ("teacher", "Öğretmen"),
                    ("student", "Öğrenci"),
                    ("parent", "Veli"),
                ],
                default="student",
                help_text="Öğretmen mi öğrenci mi olduğunu belirtir.",
                max_length=20,
                verbose_name="Rol",
            ),
        ),
        migrations.CreateModel(
            name="ParentStudentLink",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("label", models.CharField(blank=True, default="", help_text="Örn. 'Oğlum', 'Kızım'.", max_length=80, verbose_name="İlişki etiketi")),
                ("created_at", models.DateTimeField(auto_now_add=True, verbose_name="Oluşturulma")),
                (
                    "parent",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="parent_links",
                        to=settings.AUTH_USER_MODEL,
                        verbose_name="Veli",
                    ),
                ),
                (
                    "student",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="student_parent_links",
                        to=settings.AUTH_USER_MODEL,
                        verbose_name="Öğrenci",
                    ),
                ),
            ],
            options={
                "verbose_name": "Veli–öğrenci bağlantısı",
                "verbose_name_plural": "Veli–öğrenci bağlantıları",
            },
        ),
        migrations.AddConstraint(
            model_name="parentstudentlink",
            constraint=models.UniqueConstraint(
                fields=("parent", "student"),
                name="accounts_parentstudentlink_parent_student_uniq",
            ),
        ),
    ]
