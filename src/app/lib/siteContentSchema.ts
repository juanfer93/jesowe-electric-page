import { z } from "zod";
import {
  ABOUT,
  CONTACT,
  HERO,
  NAV,
  PROJECTS,
  REVIEWS,
  SERVICES,
  SITE,
  TEAM,
  VALUES
} from "@/src/app/lib/content";

const text = (max = 500) => z.string().trim().max(max);
const imageSource = z
  .string()
  .min(1)
  .max(2_000_000)
  .refine(
    (value) =>
      value.startsWith("/img/") ||
      /^\/admin-media\/project-[a-f0-9-]{36}\.(?:png|jpg|webp|avif)$/i.test(value) ||
      /^data:image\/(png|jpeg|webp|avif);base64,/i.test(value),
    "Use a local image path or a supported image."
  );
const optionalImageSource = z
  .string()
  .max(2_000_000)
  .refine(
    (value) =>
      value === "" ||
      value.startsWith("/img/") ||
      /^\/admin-media\/project-[a-f0-9-]{36}\.(?:png|jpg|webp|avif)$/i.test(value) ||
      /^data:image\/(png|jpeg|webp|avif);base64,/i.test(value),
  "Use a local image path or a supported image."
);

export const siteContentSchema = z.object({
  site: z.object({
    companyName: text(120),
    tagline: text(160),
    phoneDisplay: text(40),
    phoneTel: z.string().regex(/^tel:[0-9+().\-\s]+$/),
    toEmail: z.string().trim().email().max(254),
    locationLabel: text(120),
    mapsEmbedUrl: z.string().regex(/^https:\/\/www\.google\.com\/maps(?:[/?#]|$)/i).max(1000)
  }),
  nav: z.array(z.object({ label: text(50), href: z.string().regex(/^(#[-a-z0-9_]+|\/about|\/#[-a-z0-9_]+)$/i) })).max(16),
  hero: z.object({
    headline: text(180),
    subheadline: text(1000),
    primaryCta: text(60),
    secondaryCta: text(60)
  }),
  about: z.object({ title: text(100), body: text(2000), body2: text(2000), imageOne: imageSource, imageTwo: imageSource }),
  services: z.object({
    title: text(100),
    cards: z.array(z.object({
      emoji: text(8),
      title: text(100),
      description: text(500),
      img: imageSource,
      features: z.array(text(180)).max(20)
    })).max(16)
  }),
  values: z.object({
    title: text(180),
    items: z.array(z.object({ title: text(100), emoji: text(8), body: text(800) })).max(12)
  }),
  team: z.object({ title: text(100), body: text(1500) }),
  reviews: z.object({
    title: text(180),
    items: z.array(z.object({ quote: text(1500), author: text(80), source: text(100) })).max(24)
  }),
  projects: z.object({
    title: text(100),
    cards: z.array(z.object({
      title: text(120),
      img: optionalImageSource,
      description: text(800),
      features: z.array(text(180)).max(20),
      gallery: z.array(imageSource).max(30)
    })).max(32)
  }),
  contact: z.object({
    title: text(100),
    subtitle: text(1000),
    businessHours: z.array(text(100)).max(14)
  }),
  extraSections: z.array(z.object({
    id: z.string().regex(/^custom-[a-z0-9-]{4,48}$/),
    title: text(100),
    body: text(2000),
    image: optionalImageSource
  })).max(12)
});

export type SiteContent = z.infer<typeof siteContentSchema>;

export const DEFAULT_SITE_CONTENT: SiteContent = siteContentSchema.parse({
  site: { ...SITE },
  nav: NAV.map((item) => ({ ...item })),
  hero: { ...HERO },
  about: {
    ...ABOUT,
    body2: "We focus on safe, code-compliant work, clear communication, and long-lasting solutions. Your safety and satisfaction are always our priority.",
    imageOne: "/img/charger.avif",
    imageTwo: "/img/charger2.jpg"
  },
  services: {
    title: SERVICES.title,
    cards: SERVICES.cards.map((card) => ({ ...card, features: [...card.features] }))
  },
  values: {
    title: VALUES.title,
    items: VALUES.items.map((item) => ({ ...item }))
  },
  team: { ...TEAM },
  reviews: {
    title: REVIEWS.title,
    items: REVIEWS.items.map((item) => ({ ...item }))
  },
  projects: {
    title: PROJECTS.title,
    cards: PROJECTS.cards.map((card) => ({ ...card, features: [...card.features], gallery: [...card.gallery] }))
  },
  contact: {
    title: CONTACT.title,
    subtitle: CONTACT.subtitle,
    businessHours: [...CONTACT.businessHours]
  },
  extraSections: []
});
