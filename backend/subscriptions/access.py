"""Kurum paketi erişim kontrolü."""

from django.utils import timezone

from .models import StudentPackageSubscription, SubscriptionStatus


def user_has_institution_feature(user, *, exams: bool = False, premium_courses: bool = False) -> bool:
    if not user or not user.is_authenticated:
        return False
    if getattr(user, "is_staff", False):
        return True

    subs = (
        StudentPackageSubscription.objects.filter(user=user, status=SubscriptionStatus.ACTIVE)
        .select_related("package")
        .order_by("-created_at")
    )
    now = timezone.now()
    for sub in subs:
        if sub.current_period_end and sub.current_period_end <= now:
            continue
        pkg = sub.package
        if not pkg.is_active:
            continue
        if exams and pkg.includes_all_exams:
            return True
        if premium_courses and pkg.includes_premium_courses:
            return True
    return False
