from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from blog.models import BlogPost
from events.models import Event
from lessons.models import Course
from marketplace.models import Material


class GlobalSearchView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        q = (request.query_params.get("q") or "").strip()
        if not q:
            return Response({"q": "", "courses": [], "posts": [], "events": [], "materials": []})

        courses_qs = Course.objects.filter(is_published=True).select_related("subject", "teacher").filter(
            title__icontains=q
        )[:12]
        posts_qs = BlogPost.objects.filter(is_published=True).filter(title__icontains=q)[:12]
        events_qs = Event.objects.filter(is_published=True).filter(title__icontains=q)[:12]
        materials_qs = Material.objects.filter(is_published=True).select_related("seller").filter(title__icontains=q)[:12]

        return Response(
            {
                "q": q,
                "courses": [
                    {"id": c.id, "title": c.title, "subject": {"slug": c.subject.slug, "title": c.subject.title}}
                    for c in courses_qs
                ],
                "posts": [{"slug": p.slug, "title": p.title} for p in posts_qs],
                "events": [{"slug": e.slug, "title": e.title, "location": e.location} for e in events_qs],
                "materials": [
                    {"id": m.id, "title": m.title, "type": m.type, "price_try": m.price_try} for m in materials_qs
                ],
            }
        )

