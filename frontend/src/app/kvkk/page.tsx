import type { Metadata } from "next";

import { LegalDocPage } from "@/components/legal-doc-page";

export const metadata: Metadata = {
  title: "KVKK Aydınlatma Metni | ÖğretmenAğı",
  description: "Kişisel verilerin işlenmesine ilişkin şablon bilgilendirme sayfası.",
};

export default function KvkkPage() {
  return (
    <LegalDocPage
      eyebrow="Yasal"
      title="KVKK — Aydınlatma Metni"
      lead="Bu metin şablondur. Yayına almadan önce hukuk danışmanınızla doğrulanmalı ve veri işleme envanterinize uygun olarak güncellenmelidir."
    >
      <p>
        <strong>Veri sorumlusu:</strong> [Şirket unvanı, adres]. İletişim: [kvkk@sirket.com].
      </p>
      <p>
        Platform üzerinden toplanan kişisel veriler (kimlik / iletişim, öğrenme tercihleri, ödeme ve faturalama
        için gerekli veriler vb.) işlenme amacıyla sınırlı ve ölçülü olarak; sözleşmenin yerine getirilmesi, yasal
        yükümlülükler ve meşru menfaat çerçevesinde işlenir.
      </p>
      <p>
        İlgili kişi olarak haklarınız 6698 sayılı Kanun’un 11. maddesi kapsamındadır; taleplerinizi yukarıdaki
        kanallardan iletebilirsiniz. Şikâyet için Kişisel Verileri Koruma Kurulu’na başvurabilirsiniz.
      </p>
    </LegalDocPage>
  );
}
