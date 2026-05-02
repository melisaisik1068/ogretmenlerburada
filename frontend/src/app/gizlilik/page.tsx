import type { Metadata } from "next";

import { LegalDocPage } from "@/components/legal-doc-page";

export const metadata: Metadata = {
  title: "Gizlilik Politikası | ÖğretmenAğı",
  description: "Gizlilik ve çerez bilgisine ilişkin şablon sayfa.",
};

export default function PrivacyPage() {
  return (
    <LegalDocPage
      eyebrow="Yasal"
      title="Gizlilik politikası"
      lead="Bu metin şablondur. Çerez türleri ve üçüncü taraf entegrasyonları (analytics, ödeme, video) işinize göre listelenmelidir."
    >
      <p>Hangi verilerin toplandığı, süreleri, kimlerle paylaşıldığı ve saklama süreleri iş envanterine göre doldurulmalıdır.</p>
      <p>
        Oturum ve güvenlik için zorunlu çerezler kullanılabilir. Analiz veya pazarlama çerezleri yalnızca açık rızanız
        varsa aktifleştirilmelidir; tercih yönetimi için [Çerez paneli bağlantısı] eklenebilir.
      </p>
      <p>Uluslararası aktarım ve alt işlemciler kullanılıyorsa bunlar politikada tek tek yazılmalıdır.</p>
    </LegalDocPage>
  );
}
