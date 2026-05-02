import type { Metadata } from "next";

import { LegalDocPage } from "@/components/legal-doc-page";

export const metadata: Metadata = {
  title: "Kullanım Koşulları | ÖğretmenAğı",
  description: "Hizmet şartlarına ilişkin şablon bilgilendirme sayfası.",
};

export default function TermsPage() {
  return (
    <LegalDocPage
      eyebrow="Yasal"
      title="Kullanım koşulları"
      lead="Bu metin şablondur. Lisansınız, ödeme modeliniz ve sorumluluk sınırlarını hukuk uzmanınızla netleştirin."
    >
      <p>
        Bu platforma erişerek aşağıdaki koşulları kabul etmiş sayılırsınız. Hizmet; &quot;niteliği korunarak&quot;
        sunulabilir; bakım ve güncellemeler nedeniyle geçici kesintiler olabilir.
      </p>
      <p>
        Hesap güvenliğinden kullanıcı sorumludur. Hesabın üçüncü kişilerce kötüye kullanımı halinde derhal bildirim
        beklenir. Yasadışı içerik, telif ihlali veya dolandırıcılığa izin verilmez.
      </p>
      <p>
        Ücretli hizmetlerde ödeme ve iptal politikaları sipariş anında bildirilen koşullara tabidir.
        Uyuşmazlıklarda [yetkili mahkeme / merci] seçilebilir.
      </p>
    </LegalDocPage>
  );
}
