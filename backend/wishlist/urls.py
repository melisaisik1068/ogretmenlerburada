from django.urls import path

from .views import (
    CourseWishlistDeleteView,
    CourseWishlistListCreateView,
    MaterialWishlistDeleteView,
    MaterialWishlistListCreateView,
)

urlpatterns = [
    path("courses/", CourseWishlistListCreateView.as_view(), name="wishlist-courses"),
    path("courses/<int:course_id>/", CourseWishlistDeleteView.as_view(), name="wishlist-courses-delete"),
    path("materials/", MaterialWishlistListCreateView.as_view(), name="wishlist-materials"),
    path("materials/<int:material_id>/", MaterialWishlistDeleteView.as_view(), name="wishlist-materials-delete"),
]

