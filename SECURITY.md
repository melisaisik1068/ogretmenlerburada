# Güvenlik

Bu depo ticari kaynak olarak dağıtılabilir; güvenlik açığı bildirimleri için lütfen **özel ileti kanalı** kullanın (sorumlu bildiriminizi herkese açık bir issue yerine doğrudan proje yetkilisine iletin).

Genel olarak:

- Stripe ve İyzico gizli anahtarları yalnızca sunucu tarafında tutulmalı; asla `NEXT_PUBLIC_` öneki veya istemci paketlerine eklenmemelidir.
- Üretimde `DJANGO_DEBUG=0`, güçlü `DJANGO_SECRET_KEY` ve HTTPS zorunlu kabul edilmelidir.
- Webhook uçları yalnızca sağlayıcı imzası doğrulandıktan sonra işlem yapmalıdır (repoda ilgili görünümler buna göre yazılmıştır).
