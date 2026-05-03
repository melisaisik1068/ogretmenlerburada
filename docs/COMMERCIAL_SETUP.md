# Ticari kurulum özeti (alıcı checklist)

Bu belge paketi satın alan veya yeniden dağıtan ekiplerin üretimi ayağa kaldırması için kontrol listesidir. **Hukuki metinleri** (`/kvkk`, `/kullanim-kosullari`, `/gizlilik`) kendi işinize göre güncellemeniz gerekir; şablonda açıkça belirtilmiştir.

## 1. Marka ve alan adı

- `frontend` ve `backend` içindeki görünür metinler, e-posta konuları ve admin başlıklarını kendi markanıza göre düzenleyin.
- `FRONTEND_URL`, `CORS_ALLOWED_ORIGINS`, `CSRF_TRUSTED_ORIGINS` ile tam HTTPS köklerinizi eşleyin.

## 2. Ortam değişkenleri

| Alan | Dosya | Zorunluluk |
|------|--------|-------------|
| API genel adresi | `frontend/.env.local` → `NEXT_PUBLIC_API_BASE_URL` | Evet |
| Docker / SSR içi API | `frontend/.env.local` → `API_INTERNAL_URL` | Ortama göre |
| Django gizli anahtar, debug, hostlar | `backend/.env` | Evet |
| CORS / CSRF kökleri | `backend/.env` | Üretimde evet |
| PostgreSQL | `backend/.env` → `DATABASE_URL` veya `DB_*` | Evet |
| Stripe | `STRIPE_*` | Abonelik / shop için |
| İyzico | `IYZICO_*`, `API_PUBLIC_URL` | İyzico kullanıyorsanız |
| E-posta | `DJANGO_EMAIL_*` | Bildirimler için |

Tam liste: `backend/.env.example` ve `frontend/.env.local.example`.

## 3. Veritabanı ve statik dosyalar

- `python manage.py migrate`
- Üretimde medya dosyaları için nesne depolama veya ters vekil kullanın; `DJANGO_SERVE_MEDIA_PUBLIC` üretimde genelde kapalıdır.

## 4. Ödeme ve webhooks

- Stripe Dashboard’da webhook uçlarını backend URL’nize göre tanımlayın; `STRIPE_WEBHOOK_SECRET*` değerlerini eşleyin.
- İyzico sandbox / prod geçişinde `IYZICO_BASE_URL` ve anahtarları güncelleyin.

## 5. Dağıtım

- Adım adım: `infra/DEPLOY_RAILWAY_VERCEL.md`
- İsteğe bağlı GitHub Actions deploy hook için repoda `.github/workflows/vercel-production-hook.yml` — repoda **`VERCEL_DEPLOY_HOOK_URL`** sırrını tanımlayın.

## 6. Lisans

- Repo kökündeki `LICENSE` (MIT); üçüncü taraf bileşenlerin kendi lisansları `package.json` / `requirements.txt` ile birlikte değerlendirilmelidir.

## 7. Bilinen sınırlar (ürün olarak satarken şeffaflık)

- **Randevu / canlı ders:** `/api/booking/` — öğretmen müsaitlikleri, herkese açık slot listesi (`…/availabilities/public-slots/?teacher=`), randevu oluşturma ve `meeting_url` ile güncelleme. Next: `/dashboard/teacher/appointments`, `/dashboard/appointments`.
- Backend’de **topluluk** API’si vardır (`/api/community/…`): gönderiler, `?post=` ile cevap listesi, cevap oluşturma ve soru gönderisinde **en iyi cevap** (`POST …/posts/{id}/accept-answer/` + gövde `{"answer": <cevap_id>}`). Next.js tarafında `/community` arayüzü ihtiyaç halinde eklenebilir.
- Hukuki sayfalar **şablondur**; KVKK ve sözleşme metni için hukuk danışmanlığı alınmalıdır.
