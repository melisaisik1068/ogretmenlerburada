# Railway (Django API) + Vercel (Next.js) — adım adım

Bu rehber, **backend’in Railway’de**, ön yüzün **Vercel’de** çalışması için sırayı verir.

---

## Ön koşullar

- GitHub’a `ogretmenlerburada` reposu yüklü.
- Railway hesabı (GitHub bağlantılı).
- Vercel hesabı (aynı repo veya bağlı olduğunda).

---

## A) Backend — Railway

### Adım A1 — Yeni servis oluştur

1. [Railway](https://railway.app) → **New Project**.
2. **Deploy from GitHub repo** → `melisaisik1068/ogretmenlerburada` (veya fork’un) seçilir.
3. Proje oluşunca ilgili servise gir → **Settings**.

### Adım A2 — Kök dizin (monorepo)

İki senaryodan **birini** seç:

| Yöntem | Root Directory | Docker / Build |
|--------|----------------|------------------|
| **A)** Önerilen (bu repo için) | **Boş** veya **`./`** | Repo kökündeki **`Dockerfile`** → `COPY backend/` ile API imajı üretilir. Railway loglarında **`Dockerfile` bulundu`** görülür. |
| **B)** Alt klasör | **`backend`** | Aynı imaj **`backend/Dockerfile`** ile üretilir (`COPY . .` doğrudan `backend` içinden). |

> Logda **`skipping 'Dockerfile' at 'backend/Dockerfile' ... root_dir=`** görürsen Railway servisi **repo kökünü** kullanıyordur → **köke taşınmış** `Dockerfile` kullan veya **Root Directory = `backend`** yap.

### Adım A3 — PostgreSQL ekle

1. Aynı projede **New** → **Database** → **PostgreSQL**.
2. Railway **`DATABASE_URL`** ortam değişkenini API servisine **otomatik enjekte** edebilir — **PostgreSQL ile API servisi arasında “Connect” / “Reference variable”** kullanarak `DATABASE_URL`’nin API container’ına geçtiğinden emin ol (Railway UI’da “Variables” içinde `DATABASE_URL` görünmeli).

### Adım A4 — Ortam değişkenleri (Variables)

Railway → API servisi → **Variables** ile örnek aşağıdaki gibi set edilir (`Deploy` sonra yenilenir):

| Anahtar | Örnek değer | Açıklama |
|--------|----------------|----------|
| `DJANGO_SECRET_KEY` | Uzun rastgele dize | `python -c "import secrets; print(secrets.token_urlsafe(50))"` |
| `DJANGO_DEBUG` | `0` | Üretimde kapalı |
| `DJANGO_ALLOWED_HOSTS` | `xxxxx.up.railway.app,.up.railway.app` | Tam host + Django’da **başında nokta** ile alt alan eşlemesi (`.up.railway.app` → tüm `*.up.railway.app`) |
| `CORS_ALLOWED_ORIGINS` | `https://XXXX.vercel.app` | Vercel üretim (ve gerekiyorsa preview) adresleri virgülle |
| `CSRF_TRUSTED_ORIGINS` | `https://XXXX.vercel.app` | Django admin / form güvenliği için aynı kökleri `https://` ile ekle |
| `FRONTEND_URL` | `https://XXXX.vercel.app` | Stripe / e-posta sıfırlama linkleri için |
| `API_PUBLIC_URL` | `https://<railway-domain>` | **İyzico callback** tam URL üretimi (sonunda `/` yok) |
| Stripe / İyzico / SMTP | Bkz. `backend/.env.example` | Webhook sırları (3 ayrı Stripe secret), `MARKETPLACE_COMMISSION_PERCENT`, `DJANGO_EMAIL_*` |

> `DATABASE_URL` PostgreSQL bağlantısından gelmeli — elle yazma.

> **Stripe Billing Portal** müşteri kartı/fatura için Stripe Dashboard’da etkinleştirilmelidir; uç: `POST /api/subscriptions/billing-portal/`.

### Adım A5 — Deploy tetiklemesi ve log

1. **Deploy** beklenir; Build loglarında `collectstatic` ve `migrate` (`release`) çalışmalıdır.
2. **Public Networking** ile domain üretilir: `https://xxxxx.up.railway.app` gibi.

### Adım A6 — Sağlık kontrolü (tarayıcı veya curl)

- `GET https://<railway-domain>/api/health/` → **`{"status":"ok"}`** (DB gerektirmez; load balancer uyumu için).
- `GET https://<railway-domain>/api/docs/` → Swagger **açılmalı**.
- `GET https://<railway-domain>/admin/` → Admin sayfası (statik Whitenoise ile).

### Adım A6b — Dockerfile ile deploy (isteğe bağlı)

Railway servisinde **Build → Docker file** seçilebilir; repoda **`backend/Dockerfile`** bulunur.

1. Railway → servis → **Settings** → build stratejisinde Dockerfile yolunun **`Dockerfile`** (root `backend/` iken) olduğundan emin ol.
2. **Release command** yine: `python manage.py migrate` (imaj içinde `ENTRYPOINT` yok; Railway release aşamasında çalışır).
3. Ortam değişkenleri Nixpacks ile aynı (`DATABASE_URL`, `DJANGO_*`, CORS, CSRF).

> Nixpacks + `Procfile` yerine Docker kullanırsan, loglarda Gunicorn’un container içinde `PORT` ile bind ettiğini doğrula.

### Adım A7 — Süper kullanıcı (ilk kez)

Railway üzerinden **shell** veya tek seferlik komut ile:

```bash
python manage.py createsuperuser
```

(Railway’in birçok kurulumunda bu, **Deployments → Shell / Run Command** veya yerel bağlantıyla yapılır.)

---

## B) Frontend — Vercel

### Adım B1 — Proje

1. **Add New → Project** → GitHub reposu seçilir.
2. **Root Directory** → **`frontend`** (daha önce konuştuğumuz gibi).

### Adım B2 — Ortam değişkeni

**Settings → Environment Variables**:

| Anahtar | Değer |
|--------|--------|
| `NEXT_PUBLIC_API_BASE_URL` | **`https://<railway-public-domain>`** (sonunda `/` yok) |
| İsteğe bağlı `API_INTERNAL_URL` | Bazen Vercel sunucunun da aynı public URL ile API’yi çağırması için **aynı** URL atanabilir |

### Adım B3 — Redeploy

- **Deployments → Redeploy** (isteğe bağlı **Clear build cache**).

### Adım B4 — CORS uyumu

Ön yüz açılıyor ancak tarayıcı **CORS** hatası veriyorsa:

- Django `CORS_ALLOWED_ORIGINS` içine **tam** Vercel URL’sini ekleyin (`https://proje-xxxx.vercel.app` ve gerekiyorsa Preview URL şablonları).
- Railway’de **yeniden deploy** edin.

---

## C) Son kontrol listesi

- [ ] `https://<railway>/api/health/` → `{"status":"ok"}` ?
- [ ] `https://<railway>/api/docs/` çalışıyor mu?
- [ ] Vercel **Environment**’ta `NEXT_PUBLIC_API_BASE_URL` = Railway HTTPS kök adresi mi?
- [ ] İsteğe bağlı **`API_INTERNAL_URL`** (Vercel sunucunun Route Handler ile API’yi çağırması) aynı kök ise yine **`https://<railway>`** atanabilir.
- [ ] Giriş/kayıtta tarayıcı **Network**: istekler doğrudan **`https://<railway>`** kök host’una gidiyor mu?

---

## Sık sorunlar

1. **`DisallowedHost`**: `DJANGO_ALLOWED_HOSTS` Railway domain’ini içermiyor.
2. **CORS**: `CORS_ALLOWED_ORIGINS` Vercel URL’sinin **şemalı** tam eşleniği değil.
3. **CSRF**: Admin kullanılacaksa `CSRF_TRUSTED_ORIGINS` tanımlı olmalı.
4. **`DATABASE_URL` yok**: PostgreSQL ile servis bağlantısı / değişken referansı eksik.
5. **pip `Invalid requirement ... \x00`**: `backend/requirements.txt` yanlışlıkla **UTF-16** ile kaydedilmiş. Cursor/VS Code’da dosyayı **UTF-8** ile yeniden kaydedin (Save with Encoding → UTF-8), sonra commit/push.

## D) Sıradaki doğal adımlar (bundan sonra)

1. Django **admin**: `/admin/` ile planlar (`SubscriptionPlan`), kullanıcı onayı, iletişim mesajları.
2. **`MEDIA`/yüklemeler**: Railway disk geçici; uzun vadede S3 uyumlu depolama (ayrı rehber).
3. **`createsuperuser`** ve ilk **abonelik planları** (`basic` / `pro` …) oluşturulması.
4. Vercel’de üretim + preview URL’lerinin tamamının `CORS_ALLOWED_ORIGINS`’e eklenmesi (gerekirse virgülle çoklu).

---

Kaynak yapı dosyası: **`backend/Procfile`** (Railway **`$PORT`** üzerinden Gunicorn).

Alternatif konteyner: **`backend/Dockerfile`** + **`backend/.dockerignore`**.

Railway Dashboard’da sık yapılan eşleme:

- **Install / Build**: `pip install -r requirements.txt && python manage.py collectstatic --noinput`
- **Release** (migrate): `python manage.py migrate`
- **Start**: boş bırakılabilir (**Procfile** `web:` satırı kullanılır), veya doğrudan aynı Gunicorn komutu yazılabilir.
