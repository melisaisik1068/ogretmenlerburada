/** next/image sizes — yanlış değer LCP/TBT için gereksiz piksel indirir (PSI).

 Kullanım: layout’a göre en dar görünümdeki sıra önce yazılır. */

/** Ana sayfa / tam genişlik hero */
export const IMG_HERO_FULL =
  "(max-width: 640px) 100vw, (max-width: 1536px) 100vw, min(1280px, 100vw)";

/** sm:grid-cols-2 lg:grid-cols-3 kart ızgarası */
export const IMG_CARD_GRID_3 =
  "(max-width: 640px) 100vw, (max-width: 1024px) 48vw, 32vw";

/** sm ve üstü iki sütun liste */
export const IMG_CARD_GRID_2 = "(max-width: 640px) 100vw, (max-width: 1024px) 48vw, 40vw";

/** Blog / etkinlik detay üst görsel — çoğunlukla içerik genişliği sınırlı */
export const IMG_ARTICLE_HERO =
  "(max-width: 768px) 100vw, (max-width: 1200px) min(896px, 92vw), 896px";

/** Kurs detay: mobil tam, masaüstü ~bir kolon */
export const IMG_COURSE_DETAIL_COVER =
  "(max-width: 1024px) 100vw, (max-width: 1536px) 42vw, 520px";

/** Bento içi ~sm:col-span-2 öğretmen görseli */
export const IMG_SPOTLIGHT_BENTO =
  "(max-width: 640px) 100vw, (max-width: 1024px) 92vw, (max-width: 1280px) 38vw, 440px";
