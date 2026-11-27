import type { MetadataRoute } from "next";

const BASE = "https://vencedorespontemetalica.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const agora = new Date();
  return [
    {
      url: `${BASE}/`,
      lastModified: agora,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${BASE}/noticias`,
      lastModified: agora,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${BASE}/agenda`,
      lastModified: agora,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${BASE}/historias`,
      lastModified: agora,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${BASE}/voluntariado`,
      lastModified: agora,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${BASE}/parceiros`,
      lastModified: agora,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${BASE}/ajuda`,
      lastModified: agora,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${BASE}/responsaveis`,
      lastModified: agora,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${BASE}/cadastro`,
      lastModified: agora,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${BASE}/doacoes`,
      lastModified: agora,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${BASE}/atletas`,
      lastModified: agora,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${BASE}/creditos`,
      lastModified: agora,
      changeFrequency: "yearly",
      priority: 0.2,
    },
  ];
}
