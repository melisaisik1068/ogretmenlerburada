from django.conf import settings
from django.db import models


class CourseWishlist(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="course_wishlist_items")
    course = models.ForeignKey("lessons.Course", on_delete=models.CASCADE, related_name="wishlisted_by")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]
        unique_together = [("user", "course")]
        indexes = [models.Index(fields=["user", "created_at"])]


class MaterialWishlist(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="material_wishlist_items")
    material = models.ForeignKey("marketplace.Material", on_delete=models.CASCADE, related_name="wishlisted_by")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]
        unique_together = [("user", "material")]
        indexes = [models.Index(fields=["user", "created_at"])]

