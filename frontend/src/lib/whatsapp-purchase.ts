/** Türkiye GSM, baştaki 0 olmadan ülke kodu ile (wa.me formatı). */
export const WHATSAPP_PURCHASE_E164 = "905307662975";

const defaultPrefill = "Merhaba, ÖğretmenAğı yazılımını satın almak istiyorum.";

export function whatsAppPurchaseHref(prefill: string = defaultPrefill): string {
  const q = encodeURIComponent(prefill.trim() || defaultPrefill);
  return `https://wa.me/${WHATSAPP_PURCHASE_E164}?text=${q}`;
}
