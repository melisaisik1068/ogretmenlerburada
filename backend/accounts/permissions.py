from rest_framework.permissions import BasePermission


class IsTeacher(BasePermission):
    def has_permission(self, request, view) -> bool:
        u = getattr(request, "user", None)
        return bool(u and u.is_authenticated and getattr(u, "role", None) == "teacher")


class IsStudent(BasePermission):
    def has_permission(self, request, view) -> bool:
        u = getattr(request, "user", None)
        return bool(u and u.is_authenticated and getattr(u, "role", None) == "student")


class IsVerifiedTeacher(BasePermission):
    def has_permission(self, request, view) -> bool:
        u = getattr(request, "user", None)
        return bool(u and u.is_authenticated and getattr(u, "is_teacher_verified", False))

