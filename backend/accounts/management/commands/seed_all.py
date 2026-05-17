from django.core.management import call_command
from django.core.management.base import BaseCommand


class Command(BaseCommand):
    help = "Tüm demo verileri yükler (hesaplar, paket, ödev, sınav)."

    def handle(self, *args, **options):
        call_command("seed_demo")
        call_command("seed_exams")
        self.stdout.write(self.style.SUCCESS("seed_all tamamlandı."))
