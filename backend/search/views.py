from django.db import connection
from django.db.models import F, FloatField, Q, Value
from django.db.models.functions import Coalesce
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from blog.models import BlogPost
from events.models import Event
from lessons.models import Course
from marketplace.models import Material


def _to_int(v: str | None, default: int) -> int:
    try:
        return int(v or "")
    except Exception:
        return default


def _snippet(text: str, q: str, radius: int = 80) -> str:
    needle = (q or "").strip()
    if not needle:
        return ""
    hay = (text or "").strip()
    if not hay:
        return ""

    i = hay.lower().find(needle.lower())
    if i < 0:
        return hay[: (radius * 2)].strip()

    start = max(0, i - radius)
    end = min(len(hay), i + len(needle) + radius)
    prefix = "…" if start > 0 else ""
    suffix = "…" if end < len(hay) else ""
    return f"{prefix}{hay[start:end].strip()}{suffix}"


class GlobalSearchView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        q = (request.query_params.get("q") or "").strip()
        if not q:
            return Response({"q": "", "courses": [], "posts": [], "events": [], "materials": []})

        limit = max(1, min(40, _to_int(request.query_params.get("limit"), 12)))
        subject = (request.query_params.get("subject") or "").strip()
        material_type = (request.query_params.get("type") or "").strip()

        is_pg = connection.vendor == "postgresql"

        # Courses
        courses_qs = (
            Course.objects.filter(is_published=True)
            .select_related("subject", "teacher")
            .filter(Q(title__icontains=q) | Q(description__icontains=q) | Q(teacher__username__icontains=q))
        )
        if subject:
            courses_qs = courses_qs.filter(subject__slug=subject)

        # Posts
        posts_qs = BlogPost.objects.filter(is_published=True).filter(Q(title__icontains=q) | Q(content__icontains=q))

        # Events
        events_qs = Event.objects.filter(is_published=True).filter(Q(title__icontains=q) | Q(description__icontains=q) | Q(location__icontains=q))

        # Materials
        materials_qs = Material.objects.filter(is_published=True).select_related("seller").filter(Q(title__icontains=q) | Q(description__icontains=q))
        if material_type:
            materials_qs = materials_qs.filter(type=material_type)

        if is_pg:
            try:
                from django.contrib.postgres.search import SearchQuery, SearchRank, SearchVector
                from django.contrib.postgres.search import TrigramSimilarity

                query = SearchQuery(q, search_type="websearch")

                courses_qs = courses_qs.annotate(
                    _rank=Coalesce(
                        SearchRank(
                            SearchVector("title", weight="A")
                            + SearchVector("description", weight="B")
                            + SearchVector("teacher__username", weight="C"),
                            query,
                        ),
                        Value(0.0),
                    ),
                    _sim=Coalesce(
                        TrigramSimilarity("title", q) * Value(0.7) + TrigramSimilarity("description", q) * Value(0.3),
                        Value(0.0),
                        output_field=FloatField(),
                    ),
                    _score=F("_rank") + F("_sim"),
                ).order_by("-_score", "-created_at")

                posts_qs = posts_qs.annotate(
                    _rank=Coalesce(SearchRank(SearchVector("title", weight="A") + SearchVector("content", weight="B"), query), Value(0.0)),
                    _sim=Coalesce(TrigramSimilarity("title", q), Value(0.0), output_field=FloatField()),
                    _score=F("_rank") + F("_sim"),
                ).order_by("-_score", "-published_at", "-id")

                events_qs = events_qs.annotate(
                    _rank=Coalesce(SearchRank(SearchVector("title", weight="A") + SearchVector("description", weight="B") + SearchVector("location", weight="C"), query), Value(0.0)),
                    _sim=Coalesce(TrigramSimilarity("title", q), Value(0.0), output_field=FloatField()),
                    _score=F("_rank") + F("_sim"),
                ).order_by("-_score", "-starts_at", "-id")

                materials_qs = materials_qs.annotate(
                    _rank=Coalesce(SearchRank(SearchVector("title", weight="A") + SearchVector("description", weight="B"), query), Value(0.0)),
                    _sim=Coalesce(TrigramSimilarity("title", q), Value(0.0), output_field=FloatField()),
                    _score=F("_rank") + F("_sim"),
                ).order_by("-_score", "-created_at")
            except Exception:
                # Safe fallback if pg extensions/features aren't available.
                pass

        courses = []
        for c in courses_qs[:limit]:
            t = " ".join(filter(None, [getattr(c.teacher, "first_name", ""), getattr(c.teacher, "last_name", "")])).strip()
            teacher_label = t or getattr(c.teacher, "username", "")
            courses.append(
                {
                    "id": c.id,
                    "title": c.title,
                    "subject": {"slug": c.subject.slug, "title": c.subject.title},
                    "teacher": {"username": getattr(c.teacher, "username", ""), "name": teacher_label},
                    "snippet": _snippet(f"{c.title}\n{c.description}", q),
                }
            )

        posts = [{"slug": p.slug, "title": p.title, "snippet": _snippet(f"{p.title}\n{p.content}", q)} for p in posts_qs[:limit]]
        events = [
            {"slug": e.slug, "title": e.title, "location": e.location, "snippet": _snippet(f"{e.title}\n{e.description}\n{e.location}", q)}
            for e in events_qs[:limit]
        ]
        materials = [
            {"id": m.id, "title": m.title, "type": m.type, "price_try": m.price_try, "snippet": _snippet(f"{m.title}\n{m.description}", q)}
            for m in materials_qs[:limit]
        ]

        return Response({"q": q, "courses": courses, "posts": posts, "events": events, "materials": materials})

