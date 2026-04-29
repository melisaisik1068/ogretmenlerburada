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

1. **Settings → Root Directory** → **`backend`** yazılıp kaydedilir.  
   (Kodların `requirements.txt` ve `manage.py` bu klasördedir.)

### Adım A3 — PostgreSQL ekle

1. Aynı projede **New** → **Database** → **PostgreSQL**.
2. Railway **`DATABASE_URL`** ortam değişkenini API servisine **otomatik enjekte** edebilir — **PostgreSQL ile API servisi arasında “Connect” / “Reference variable”** kullanarak `DATABASE_URL`’nin API container’ına geçtiğinden emin ol (Railway UI’da “Variables” içinde `DATABASE_URL` görünmeli).

### Adım A4 — Ortam değişkenleri (Variables)

Railway → API servisi → **Variables** ile örnek aşağıdaki gibi set edilir (`Deploy` sonra yenilenir):

| Anahtar | Örnek değer | Açıklama |
|--------|----------------|----------|
| `DJANGO_SECRET_KEY` | Uzun rastgele dize | `python -c "import secrets; print(secrets.token_urlsafe(50))"` |
| `DJANGO_DEBUG` | `0` | Üretimde kapalı |
| `DJANGO_ALLOWED_HOSTS` | `<railway-domaini>,*.up.railway.app` | Railway’in verdiği host adı dosyayı ekle (`Settings → Networking → Public Domain` önizlemesine bakılabilir) |
| `CORS_ALLOWED_ORIGINS` | `https://XXXX.vercel.app` | Vercel üretim (ve gerekiyorsa preview) adresleri virgülle |
| `CSRF_TRUSTED_ORIGINS` | `https://XXXX.vercel.app` | Django admin / form güvenliği için aynı kökleri `https://` ile ekle |

> `DATABASE_URL` PostgreSQL bağlantısından gelmeli — elle yazma.

### Adım A5 — Deploy tetiklemesi ve log

1. **Deploy** beklenir; Build loglarında `collectstatic` ve `migrate` (`release`) çalışmalıdır.
2. **Public Networking** ile domain üretilir: `https://xxxxx.up.railway.app` gibi.

### Adım A6 — Sağlık kontrolü (tarayıcı veya curl)

- `GET https://<railway-domain>/api/docs/` → Swagger **açılmalı**.
- `GET https://<railway-domain>/admin/` → Admin sayfası (statik Whitenoise ile).

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

- [ ] `https://<railway>/api/docs/` çalışıyor mu?
- [ ] Vercel’den site açılıyor mu; giriş/kayıt **Network**’te Railway host’una istek gidiyor mu?
- [ ] Yerelde olduğu gibi: backend **çalışırken** `NEXT_PUBLIC_API_BASE_URL` doğru kök adres olmalı (path’siz).

---

## Sık sorunlar

1. **`DisallowedHost`**: `DJANGO_ALLOWED_HOSTS` Railway domain’ini içermiyor.
2. **CORS**: `CORS_ALLOWED_ORIGINS` Vercel URL’sinin **şemalı** tam eşleniği değil.
3. **CSRF**: Admin kullanılacaksa `CSRF_TRUSTED_ORIGINS` tanımlı olmalı.
4. **`DATABASE_URL` yok**: PostgreSQL ile servis bağlantısı / değişken referansı eksik.

Kaynak yapı dosyası: `backend/Procfile` (Railway **`$PORT`** üzerinden Gunicorn).

Railway Dashboard’da sık yapılan eşleme:

- **Install / Build**: `pip install -r requirements.txt && python manage.py collectstatic --noinput`
- **Release** (migrate): `python manage.py migrate`
- **Start**: boş bırakılabilir (**Procfile** `web:` satırı kullanılır), veya doğrudan aynı Gunicorn komutu yazılabilir.
