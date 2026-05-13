import type { Metadata } from "next";

import { LegalDocPage } from "@/components/legal-doc-page";

export const metadata: Metadata = {
  title: "Gizlilik Politikası | Öğretmenler Burada",
  description: "Öğretmenler Burada platformunun gizlilik ve çerez politikası.",
};

export default function PrivacyPage() {
  return (
    <LegalDocPage
      eyebrow="Yasal"
      title="Gizlilik Politikası"
      lead="Öğretmenler Burada olarak gizliliğinizi ciddiye alıyoruz. Bu politika, hangi verileri topladığımızı ve nasıl kullandığımızı açıklar."
    >
      <h2 className="text-base font-bold mt-4">1. Toplanan Veriler</h2>
      <ul className="list-disc pl-5 space-y-1">
        <li>Hesap oluşturma sırasında verilen ad, soyad, e-posta ve kullanıcı adı</li>
        <li>Platform kullanım istatistikleri (izlenen içerikler, tamamlama oranları)</li>
        <li>Oturum ve kimlik doğrulama çerezleri</li>
        <li>Teknik veriler (tarayıcı türü, IP adresi, ziyaret tarihleri)</li>
      </ul>

      <h2 className="text-base font-bold mt-4">2. Çerezler</h2>
      <p>Platform yalnızca zorunlu çerezler kullanır:</p>
      <ul className="list-disc pl-5 space-y-1">
        <li><strong>ob_access / ob_refresh:</strong> Güvenli oturum yönetimi için HttpOnly çerezler. Tarayıcı kapatıldığında veya süre dolduğunda otomatik silinir.</li>
        <li><strong>Analiz çerezleri:</strong> Yalnızca açık rızanızla etkinleştirilebilir.</li>
      </ul>

      <h2 className="text-base font-bold mt-4">3. Üçüncü Taraf Hizmetler</h2>
      <p>
        Platform altyapısı için Railway (sunucu) ve Vercel (frontend hosting) kullanılmaktadır.
        Bu sağlayıcılar kendi gizlilik politikalarına tabidir. Ödeme işlemleri güvenli ödeme
        altyapısı üzerinden gerçekleştirilir; kart bilgileriniz platformumuzda saklanmaz.
      </p>

      <h2 className="text-base font-bold mt-4">4. Veri Güvenliği</h2>
      <ul className="list-disc pl-5 space-y-1">
        <li>Tüm iletişim HTTPS ile şifrelenir.</li>
        <li>Şifreler güçlü hashing algoritmasıyla (bcrypt/argon2) saklanır.</li>
        <li>JWT token'lar HttpOnly çerezlerde tutulur; JavaScript tarafından erişilemez.</li>
      </ul>

      <h2 className="text-base font-bold mt-4">5. Verileriniz Üzerindeki Haklarınız</h2>
      <p>
        Verilerinize erişim, düzeltme, silme veya taşınabilirlik talep etmek için{" "}
        <a href="mailto:destek@ogretmenlerburada.com" className="underline">
          destek@ogretmenlerburada.com
        </a>{" "}
        adresiyle iletişime geçebilirsiniz. Talepler 30 gün içinde yanıtlanır.
      </p>

      <h2 className="text-base font-bold mt-4">6. İletişim</h2>
      <p>
        Gizlilik konularındaki sorularınız için:{" "}
        <a href="mailto:destek@ogretmenlerburada.com" className="underline">
          destek@ogretmenlerburada.com
        </a>
      </p>
    </LegalDocPage>
  );
}
