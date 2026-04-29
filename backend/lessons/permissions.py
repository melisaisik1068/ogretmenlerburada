from rest_framework.permissions import BasePermission


PLAN_RANK = {"free": 0, "basic": 1, "pro": 2, "enterprise": 3}


def rank(code: str | None) -> int:
    return PLAN_RANK.get(code or "free", 0)


class HasCourseAccess(BasePermission):
    """
    Course erişimi: course.access_level <= user's active subscription plan.
    MVP: tek abonelik varsayımı; subscription yoksa free.
    """

    def has_object_permission(self, request, view, obj) -> bool:
        required = getattr(obj, "access_level", "free")

        u = getattr(request, "user", None)
        if not u or not u.is_authenticated:
            return required == "free"

        sub = (
            getattr(u, "subscriptions", None)
            and u.subscriptions.select_related("plan").order_by("-created_at").first()
        )
        code = getattr(getattr(sub, "plan", None), "code", None) if sub else None
        return rank(code) >= rank(required)

