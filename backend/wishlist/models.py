from django.conf import settings
from django.db import models
from django.utils.translation import gettext_lazy as _


class CourseWishlist(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="course_wishlist_items",
        verbose_name=_("Kullanıcı"),
    )
    course = models.ForeignKey(
        "lessons.Course",
        on_delete=models.CASCADE,
        related_name="wishlisted_by",
        verbose_name=_("Kurs"),
    )
    created_at = models.DateTimeField(_("Eklenme zamanı"), auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]
        verbose_name = _("Kurs istek kaydı")
        verbose_name_plural = _("Kurs istek kayıtları")
        constraints = [
            models.UniqueConstraint(
                fields=("user", "course"),
                name="wishlist_course_user_course_uniq",
            ),
        ]
        indexes = [models.Index(fields=["user", "created_at"])]


class MaterialWishlist(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="material_wishlist_items",
        verbose_name=_("Kullanıcı"),
    )
    material = models.ForeignKey(
        "marketplace.Material",
        on_delete=models.CASCADE,
        related_name="wishlisted_by",
        verbose_name=_("Materyal"),
    )
    created_at = models.DateTimeField(_("Eklenme zamanı"), auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]
        verbose_name = _("Materyal istek kaydı")
        verbose_name_plural = _("Materyal istek kayıtları")
        constraints = [
            models.UniqueConstraint(
                fields=("user", "material"),
                name="wishlist_material_user_material_uniq",
            ),
        ]
        indexes = [models.Index(fields=["user", "created_at"])]
