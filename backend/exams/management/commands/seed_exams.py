from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand

from exams.models import Exam, ExamQuestion, ExamType

User = get_user_model()


class Command(BaseCommand):
    help = "Örnek LGS/YKS deneme sınavı ve soruları oluşturur."

    def handle(self, *args, **options):
        teacher = User.objects.filter(role="teacher").first()
        exam, created = Exam.objects.get_or_create(
            title="Demo LGS Matematik Denemesi",
            defaults={
                "exam_type": ExamType.LGS,
                "description": "Platform demo sınavı — süre ve analiz testi için.",
                "duration_minutes": 45,
                "negative_per_wrong": 0.25,
                "is_published": True,
                "show_leaderboard": True,
                "created_by": teacher,
            },
        )
        if created or exam.questions.count() == 0:
            topics = [
                ("karekok", "Kareköklü Sayılar", "B"),
                ("uslu", "Üslü İfadeler", "C"),
                ("denklem", "Birinci Derece Denklemler", "A"),
                ("geometri", "Üçgenler", "D"),
                ("oran", "Oran-Orantı", "A"),
            ]
            for i, (slug, title, ans) in enumerate(topics):
                ExamQuestion.objects.get_or_create(
                    exam=exam,
                    order_index=i,
                    defaults={
                        "topic_slug": slug,
                        "topic_title": title,
                        "correct_choice": ans,
                        "choice_count": 5,
                    },
                )
            exam.is_published = True
            exam.save(update_fields=["is_published"])
            self.stdout.write(self.style.SUCCESS(f"Demo sınav hazır: id={exam.id}"))
        else:
            self.stdout.write(f"Sınav zaten var: id={exam.id}")
