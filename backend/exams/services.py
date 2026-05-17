from collections import defaultdict
from decimal import Decimal

from django.utils import timezone

from .models import AttemptStatus, Exam, ExamAnswer, ExamAttempt, ExamQuestion


def score_attempt(attempt: ExamAttempt) -> ExamAttempt:
    """Doğru / yanlış / boş ve net hesapla; konu analizi üret."""
    exam = attempt.exam
    questions = list(exam.questions.all())
    answers_by_q = {a.question_id: a for a in attempt.answers.select_related("question")}

    correct = wrong = blank = 0
    topic_stats: dict[str, dict[str, int]] = defaultdict(lambda: {"correct": 0, "wrong": 0, "blank": 0, "total": 0})

    for q in questions:
        topic_key = q.topic_title or q.topic_slug or "Genel"
        topic_stats[topic_key]["total"] += 1
        ans = answers_by_q.get(q.id)
        choice = (ans.choice if ans else "").strip().upper()
        correct_choice = (q.correct_choice or "").strip().upper()

        if not choice:
            blank += 1
            topic_stats[topic_key]["blank"] += 1
        elif choice == correct_choice:
            correct += 1
            topic_stats[topic_key]["correct"] += 1
        else:
            wrong += 1
            topic_stats[topic_key]["wrong"] += 1

    neg = Decimal(str(exam.negative_per_wrong or 0))
    net = Decimal(correct) - (Decimal(wrong) * neg)
    if net < 0:
        net = Decimal("0")

    attempt.correct_count = correct
    attempt.wrong_count = wrong
    attempt.blank_count = blank
    attempt.net_score = net.quantize(Decimal("0.01"))
    attempt.analysis_summary = build_analysis_summary(topic_stats, correct, wrong, blank, float(net))
    attempt.save(
        update_fields=[
            "correct_count",
            "wrong_count",
            "blank_count",
            "net_score",
            "analysis_summary",
        ]
    )
    return attempt


def build_analysis_summary(
    topic_stats: dict[str, dict[str, int]],
    correct: int,
    wrong: int,
    blank: int,
    net: float,
) -> str:
    lines = [
        f"Toplam: {correct} doğru, {wrong} yanlış, {blank} boş — Net: {net:.2f}.",
    ]
    weak: list[tuple[str, float]] = []
    strong: list[tuple[str, float]] = []
    for topic, st in topic_stats.items():
        total = st["total"] or 1
        rate = st["correct"] / total
        if total >= 2 and rate < 0.5:
            weak.append((topic, rate))
        elif st["correct"] >= 2 and rate >= 0.7:
            strong.append((topic, rate))

    weak.sort(key=lambda x: x[1])
    strong.sort(key=lambda x: x[1], reverse=True)

    if strong:
        t = strong[0][0]
        lines.append(f"Güçlü olduğun alan: {t}.")
    if weak:
        t = weak[0][0]
        lines.append(f"Geliştirmen gereken alan: {t} — bu konuda daha fazla pratik yap.")
        if len(weak) > 1:
            lines.append(f"Ayrıca {weak[1][0]} konusunda da zayıf görünüyorsun.")
    elif correct > wrong:
        lines.append("Genel performansın dengeli; küçük hatalara odaklan.")
    return " ".join(lines)


def finalize_attempt_if_expired(attempt: ExamAttempt) -> ExamAttempt:
    now = timezone.now()
    if attempt.status != AttemptStatus.IN_PROGRESS:
        return attempt
    if attempt.ends_at <= now:
        attempt.status = AttemptStatus.EXPIRED
        attempt.submitted_at = now
        attempt.save(update_fields=["status", "submitted_at"])
        score_attempt(attempt)
    return attempt


def submit_attempt(attempt: ExamAttempt) -> ExamAttempt:
    now = timezone.now()
    if attempt.status != AttemptStatus.IN_PROGRESS:
        return attempt
    attempt.status = AttemptStatus.SUBMITTED
    attempt.submitted_at = now
    attempt.save(update_fields=["status", "submitted_at"])
    return score_attempt(attempt)
