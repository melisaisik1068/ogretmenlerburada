import type { Metadata } from "next";

import { LegalDocPage } from "@/components/legal-doc-page";

export const metadata: Metadata = {
  title: "Kullanım Koşulları | Öğretmenler Burada",
  description: "Öğretmenler Burada platformu hizmet kullanım koşulları.",
};

export default function TermsPage() {
  return (
    <LegalDocPage
      eyebrow="Yasal"
      title="Kullanım Koşulları"
      lead="Öğretmenler Burada platformunu kullanarak aşağıdaki koşulları kabul etmiş sayılırsınız. Lütfen dikkatlice okuyunuz."
    >
      <h2 className="text-base font-bold mt-4">1. Hizmetin Kapsamı</h2>
      <p>
        Öğretmenler Burada; öğretmen ve öğrencilerin bir araya geldiği, eğitim içeriklerinin paylaşıldığı
        dijital bir öğrenme platformudur. Platform; içerik izleme, ders rezervasyonu, materyal indirme ve
        öğretmen profili yönetimi hizmetlerini kapsar.
      </p>

      <h2 className="text-base font-bold mt-4">2. Hesap Sorumluluğu</h2>
      <ul className="list-disc pl-5 space-y-1">
        <li>Hesap güvenliğinden (şifre, erişim) kullanıcı sorumludur.</li>
        <li>Hesabın yetkisiz kullanımının fark edilmesi halinde derhal bildirim yapılmalıdır.</li>
        <li>Her kullanıcı yalnızca bir hesap açabilir; çoklu hesap kullanımı yasaktır.</li>
      </ul>

      <h2 className="text-base font-bold mt-4">3. Öğretmen Hesapları</h2>
      <p>
        Öğretmen rolüyle kayıt olan kullanıcılar; kimlik ve diploma belgelerini platform yönetimine
        sunmakla yükümlüdür. Belge onayı tamamlanmadan içerik yayını yapılamaz.
        Platform, sahte belge sunulduğu tespit edilen hesapları derhal askıya alma hakkını saklı tutar.
      </p>

      <h2 className="text-base font-bold mt-4">4. Yasaklı İçerik ve Davranışlar</h2>
      <ul className="list-disc pl-5 space-y-1">
        <li>Yasadışı, müstehcen, nefret söylemi içeren veya ayrımcı içerik paylaşımı</li>
        <li>Başkasına ait telif hakkıyla korunan materyallerin izinsiz yüklenmesi</li>
        <li>Spam, phishing veya dolandırıcılık amaçlı faaliyetler</li>
        <li>Platformun altyapısına zarar vermeye yönelik girişimler</li>
      </ul>

      <h2 className="text-base font-bold mt-4">5. Ücretli Hizmetler ve İptal</h2>
      <p>
        Ücretli abonelik ve içerik satın alma işlemleri sipariş anında gösterilen fiyat ve koşullara
        tabidir. İptal ve iade talepleri için{" "}
        <a href="mailto:destek@ogretmenlerburada.com" className="underline">
          destek@ogretmenlerburada.com
        </a>{" "}
        adresine başvurabilirsiniz. Dijital içeriklerin indirilmesi sonrası iade yapılmamaktadır.
      </p>

      <h2 className="text-base font-bold mt-4">6. Hizmet Kesintileri</h2>
      <p>
        Platform bakım, güncelleme veya teknik nedenlerle geçici olarak erişime kapatılabilir.
        Bu durumlarda önceden bildirim yapılmaya çalışılır.
      </p>

      <h2 className="text-base font-bold mt-4">7. Değişiklikler</h2>
      <p>
        Kullanım koşulları güncellenebilir. Değişiklikler platformda duyurulur; platformu kullanmaya
        devam etmek güncel koşulların kabul edildiği anlamına gelir.
      </p>

      <h2 className="text-base font-bold mt-4">8. İletişim</h2>
      <p>
        Sorularınız için:{" "}
        <a href="mailto:destek@ogretmenlerburada.com" className="underline">
          destek@ogretmenlerburada.com
        </a>
      </p>
    </LegalDocPage>
  );
}
