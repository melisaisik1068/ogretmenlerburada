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

### Vercel (yalnızca Next.js)
Monoreponun tamamı repo kökünde; **`backend/` Vercel’de çalıştırılmaz** (API ayrı sunucuda). Yeni proje oluştururken:

1. Repoyu içe aktar.
2. **Root Directory:** repo kökü (**`.`** — boş bırak / monorepo kökü). `vercel.json` burada tanımlıdır; **`frontend` seçme** (aksi halde `npm ci --prefix frontend` yanlış dizine bakar).
3. **Application Preset:** mümkünse tek framework (**Next.js / Other**); **Services** (Django + Next birlikte) seçme — Django için ekstra `experimentalServices` gerekmez.

### Notlar
- Öğretmen onayı admin panelinden `teacher_verification_status=approved` ile verilir; frontend rozet/etiket için `accounts/me/` endpoint’i kullanılabilir.
- Stripe/iyzico gerçek entegrasyonu için webhook + ödeme flow’u eklenmelidir (schema alanları hazır).

