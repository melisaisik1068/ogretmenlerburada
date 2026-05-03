# Changelog

## Unreleased

- **Topluluk:** `CommunityAnswer.is_accepted` + veritabanı kısıtı (gönderi başına tek “en iyi cevap”); `POST /api/community/posts/{id}/accept-answer/`; `GET|POST /api/community/answers/` (`?post=` zorunlu).
- **Frontend:** Web App Manifest (`/manifest.webmanifest`), `appleWebApp` + isteğe bağlı `NEXT_PUBLIC_SITE_URL` / `metadataBase`; kurs ve mağaza detay sayfalarında dinamik `generateMetadata`.

## 1.0.0 — 2026-05-01

- Monorepo: Django REST API + Next.js App Router, PostgreSQL.
- Üyelik: roller, öğretmen doğrulama, abonelik planları, Stripe + isteğe bağlı İyzico.
- Pazaryeri: materyal, erişim, satıcı hakediş ve ödeme akışları.
- Frontend: Bento/glass landing, dashboard, sınıflar, blog, etkinlikler, mağaza, iletişim; JWT httpOnly çerez + middleware.
- Dağıtım notları: `infra/DEPLOY_RAILWAY_VERCEL.md`; isteğe bağlı Vercel deploy hook workflow.
