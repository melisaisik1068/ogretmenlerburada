"use client";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { RevealInView } from "@/components/motion/bento-motion";

const items = [
  {
    q: "Kurslar nasıl listeleniyor?",
    a: "Kurslar `GET /api/lessons/courses/` uç noktasından çekilir; ön yüzdeki kartlar canlı sıralanır.",
  },
  {
    q: "Üyelik ücretsiz mi?",
    a: "Evet — ücretsiz hesap oluşturup içeriği görebilirsiniz; ilerleyen süreçte isteğe bağlı ücretli paketler eklenebilir.",
  },
  {
    q: "Öğretmen doğrulaması nasıl işliyor?",
    a: "Profil yükleme sürecini tamamlayıp belgeleri yükledikten sonra ekip içi inceleme yapılır. Sonuç e-postanıza ve panelinize bildirilir.",
  },
  {
    q: "Teknik sorun çıkarsa kime yazmalıyım?",
    a: "`destek@ogretmenlerburada.com` adresine ekran görüntüsü ve tarayıcı bilgisi ile iletebilirsiniz.",
  },
];

export function FaqAccordion() {
  return (
    <RevealInView>
      <div className="rounded-3xl border border-slate-200/90 bg-[var(--surface)] px-4 py-4 shadow-sm sm:px-7 sm:py-7">
        <Accordion type="single" collapsible className="divide-y divide-slate-100">
          {items.map((item, idx) => (
            <AccordionItem key={idx} value={`item-${idx}`} className="border-0">
              <AccordionTrigger>{item.q}</AccordionTrigger>
              <AccordionContent>{item.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </RevealInView>
  );
}
