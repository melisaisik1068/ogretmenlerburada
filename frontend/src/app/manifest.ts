import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "ÖğretmenAğı",
    short_name: "ÖğretmenAğı",
    description: "Onaylı eğitmenler, sınıfa özel içerikler ve güvenilir dijital eğitim.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait-primary",
    background_color: "#ffffff",
    theme_color: "#2563eb",
    lang: "tr",
  };
}
