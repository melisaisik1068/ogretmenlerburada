## ÖğretmenlerBurada · Full‑Stack Mimari (Django DRF + Next.js + PostgreSQL)

### Monorepo yapı
- `backend/`: Django REST Framework API (JWT, CORS, OpenAPI)
- `frontend/`: Next.js (App Router) + Tailwind (Bento/Glass UI) + TypeScript API client
- `infra/`: PostgreSQL docker-compose

### Backend (Django + DRF)
Öne çıkan modüller:
- **Gelişmiş üyelik**: `accounts.User` içinde `role` (teacher/student) ve öğretmenler için `teacher_verification_status` (pending/approved/rejected).
- **Abonelik**: `subscriptions.SubscriptionPlan` (Temel/Pro/Kurumsal) + `Subscription` (stripe/iyzico alanları hazır).
- **Topluluk**: `community.CommunityPost` varsayılan `pending` (önce onay). Public list/retrieve sadece `approved`.
- **Canlı ders**: `booking.TeacherAvailability` + `Appointment`.
- **Materyal pazaryeri**: `marketplace.Material` (PDF/Video dosya) + `MaterialAccess`.

Çalıştırma:

```bash
# 1) PostgreSQL
cd infra
docker compose up -d

# 2) Backend env
cd ../backend
copy .env.example .env

# 3) Python deps
.\.venv\Scripts\python -m pip install -r requirements.txt

# 4) Migrate + admin
.\.venv\Scripts\python manage.py migrate
.\.venv\Scripts\python manage.py createsuperuser

# 5) Seed (opsiyonel): admin panelinden planları ekleyin
.\.venv\Scripts\python manage.py runserver 0.0.0.0:8000
```

API dokümantasyonu:
- Swagger UI: `http://localhost:8000/api/docs/`

### Frontend (Next.js + Tailwind)
Öne çıkanlar:
- **Bento + Glassmorphism** landing (`/`)
- **Topluluk ISR**: `/community` ve `/community/[id]` (SEO için revalidate=60)
- **RBAC örneği**: `/dashboard/pro` sayfası middleware ile plan kontrolü yapar; plan yetmezse `/upgrade` sayfasına atar.

Çalıştırma:

```bash
cd frontend
copy .env.local.example .env.local
npm install
npm run dev
```

### Frontend ↔ Django API (JWT)

- Çalıştırma: `cd backend && .venv\\Scripts\\python manage.py runserver 0.0.0.0:8000` ve `cd frontend && npm run dev`.
- Next istemcisi varsayılan olarak `NEXT_PUBLIC_API_BASE_URL` (örn. `http://localhost:8000`) kullanır.
- Oturum: tarayıcı **`/api/auth/login`** üzerinden JWT alır; access token **`ob_access`** httpOnly çerezinde tutulur (middleware `/dashboard` için kullanır).
- Kayıt: **`POST /api/accounts/register/`** (Next proxy: **`POST /api/auth/register`**).
- İletişim formu: Django **`POST /api/contact/messages/`** (Next proxy: **`POST /api/contact`**).
- Kurs listesi: **`GET /api/lessons/courses/`** (`/classes` sayfasında kullanılır).
- Planlar: **`GET /api/subscriptions/plans/`** (`/upgrade`).
- CORS: geliştirmede `http://localhost:3000`; üretimde `CORS_ALLOWED_ORIGINS` ile frontend domain’ini ekleyin.

Railway ile API ve Vercel ile ön yüz yayını için adım adım rehbere **`infra/DEPLOY_RAILWAY_VERCEL.md`** bakın.

### Vercel (yalnızca Next.js)
Monoreponun tamamı repo kökünde; **`backend/` Vercel’de çalıştırılmaz** (API ayrı sunucuda). Yeni proje oluştururken:

1. Repoyu içe aktar.
2. **Root Directory:** **`frontend`** — Deploy düğmesinin yanındaki **Edit** ile klasörü seç (varsayılan komutlar `npm install` / `next build` olur).
3. **Framework Preset:** **Next.js**.
4. **Services / multi-service** (Django + Next birlikte) seçme; Django için Vercel’de ekstra servis gerekmez.

### Cursor / VS Code — `requirements.txt` her zaman UTF-8

Railway / `pip` hata vermemesi için `backend/requirements.txt` dosyası **UTF-8** olmalı (UTF-16 ile kaydetme).

1. Cursor’da dosyayı aç: **`backend/requirements.txt`**
2. **Durum çubuğunun sağ altı**nda kodlamaya bak: **`UTF-8`** değilse (ör. UTF-16) tıkla.
3. **Save with Encoding** → **UTF-8** → kaydet (**Ctrl+S**).

Bu repoda klasör Workspace için varsayılan **UTF-8** ayarı vardır: **`.vscode/settings.json`** ve **`.editorconfig`**.

### Notlar
- Öğretmen onayı admin panelinden `teacher_verification_status=approved` ile verilir; frontend rozet/etiket için `accounts/me/` endpoint’i kullanılabilir.
- Stripe/iyzico gerçek entegrasyonu için webhook + ödeme flow’u eklenmelidir (schema alanları hazır).

