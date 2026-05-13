import type { Metadata } from "next";

import { LegalDocPage } from "@/components/legal-doc-page";

export const metadata: Metadata = {
  title: "KVKK Aydınlatma Metni | Öğretmenler Burada",
  description: "Öğretmenler Burada platformunun kişisel veri işleme politikası ve KVKK aydınlatma metni.",
};

export default function KvkkPage() {
  return (
    <LegalDocPage
      eyebrow="Yasal"
      title="KVKK — Aydınlatma Metni"
      lead="6698 sayılı Kişisel Verilerin Korunması Kanunu kapsamında veri sorumlusu sıfatıyla Öğretmenler Burada platformu aşağıdaki bilgilendirmeyi sunar."
    >
      <h2 className="text-base font-bold mt-4">1. Veri Sorumlusu</h2>
      <p>
        <strong>Öğretmenler Burada</strong> — ogretmenlerburada.com üzerinden hizmet sunan platform.
        İletişim:{" "}
        <a href="mailto:destek@ogretmenlerburada.com" className="underline">
          destek@ogretmenlerburada.com
        </a>
      </p>

      <h2 className="text-base font-bold mt-4">2. İşlenen Kişisel Veriler</h2>
      <p>Platform üzerinden aşağıdaki kişisel veriler işlenmektedir:</p>
      <ul className="list-disc pl-5 space-y-1">
        <li>Kimlik bilgileri (ad, soyad, kullanıcı adı)</li>
        <li>İletişim bilgileri (e-posta adresi, telefon numarası)</li>
        <li>Öğrenme tercihleri ve içerik etkileşim kayıtları</li>
        <li>Ödeme ve faturalama için gerekli bilgiler (kart bilgileri doğrudan işlenmez)</li>
        <li>Öğretmen doğrulama belgeleri (yalnızca öğretmen rolü için)</li>
        <li>Oturum ve güvenlik çerezleri</li>
      </ul>

      <h2 className="text-base font-bold mt-4">3. İşleme Amaçları ve Hukuki Dayanaklar</h2>
      <ul className="list-disc pl-5 space-y-1">
        <li>Hizmetin sunulması ve hesap yönetimi — <em>sözleşmenin ifası</em></li>
        <li>Kimlik ve öğretmen belge doğrulama — <em>meşru menfaat / yasal yükümlülük</em></li>
        <li>Faturalama ve ödeme işlemleri — <em>yasal yükümlülük</em></li>
        <li>Platform güvenliği ve dolandırıcılık önleme — <em>meşru menfaat</em></li>
        <li>İzinli e-posta bildirimleri — <em>açık rıza</em></li>
      </ul>

      <h2 className="text-base font-bold mt-4">4. Veri Aktarımı</h2>
      <p>
        Kişisel verileriniz; altyapı sağlayıcıları (Railway, Vercel), ödeme aracısı ve analiz
        hizmet sağlayıcılarına yalnızca hizmetin gerektirdiği ölçüde aktarılmaktadır.
        Üçüncü taraflarla ticari amaçla veri paylaşımı yapılmamaktadır.
      </p>

      <h2 className="text-base font-bold mt-4">5. Saklama Süresi</h2>
      <p>
        Veriler, hesabınız aktif olduğu sürece ve yasal saklama yükümlülükleri kapsamında tutulur.
        Hesap silme talebinde verileriniz 30 gün içinde anonimleştirilir veya silinir.
      </p>

      <h2 className="text-base font-bold mt-4">6. Haklarınız (KVKK Madde 11)</h2>
      <ul className="list-disc pl-5 space-y-1">
        <li>Kişisel verilerinizin işlenip işlenmediğini öğrenme</li>
        <li>İşlendiyse buna ilişkin bilgi talep etme</li>
        <li>Yanlış verilerin düzeltilmesini isteme</li>
        <li>Verilerin silinmesini veya yok edilmesini talep etme</li>
        <li>İşlemeye itiraz etme</li>
      </ul>
      <p className="mt-2">
        Taleplerinizi{" "}
        <a href="mailto:destek@ogretmenlerburada.com" className="underline">
          destek@ogretmenlerburada.com
        </a>{" "}
        adresine iletebilirsiniz. Şikâyet için{" "}
        <strong>Kişisel Verileri Koruma Kurulu</strong>&apos;na başvurabilirsiniz.
      </p>
    </LegalDocPage>
  );
}
