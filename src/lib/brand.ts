// Shop + studio config. WHATSAPP_NUMBER: digits only, country code first (no +).
export const STUDIO = {
  name: "AxisX Studio",
  url: "https://axisxstudio.com",
  domain: "axisxstudio.com",
} as const;

export const BRAND = {
  name: "GEN-Z",
  fullName: "GEN-Z Trincomalee",
  tagline: "The Happiness of Men & Boys",
  city: "Trincomalee, Sri Lanka",
  email: "info@axisxstudio.com",
  phone: "077 453 4056",
  phoneTel: "+94774534056",
  address: "Main Street, Trincomalee",
  socials: {
    instagram: "https://instagram.com",
    facebook: "https://facebook.com",
    tiktok: "https://tiktok.com",
  },
};

// Same mobile as shop line — used for WhatsApp deep links site-wide.
export const WHATSAPP_NUMBER = "94774534056";

export const CURRENCY = "LKR";
export const formatPrice = (n: number) =>
  new Intl.NumberFormat("en-LK", { style: "currency", currency: CURRENCY, maximumFractionDigits: 0 }).format(n);

export function whatsappLink(message: string) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
