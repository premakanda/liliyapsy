import { readFileSync, readdirSync } from "node:fs";
import { resolve } from "node:path";
import { parse } from "yaml";
import { z } from "zod";
const text = z.string().trim().min(1);
const slug = text.regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
const date = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/)
  .refine(
    (v) =>
      !Number.isNaN(Date.parse(v)) &&
      new Date(v).toISOString().slice(0, 10) === v &&
      v <= new Date().toISOString().slice(0, 10),
    "Нужна реальная дата, не в будущем",
  );
export const articleSchema = z
  .object({
    slug,
    title: text,
    description: text,
    category: text,
    coverImage: z.string().nullable(),
    coverAlt: z.string().nullable(),
    published: z.boolean(),
    publishedAt: date.nullable(),
    updatedAt: date.nullable(),
    author: text,
    content: text,
  })
  .superRefine((a, ctx) => {
    if (a.published && !a.publishedAt)
      ctx.addIssue({
        code: "custom",
        path: ["publishedAt"],
        message: "Опубликованной статье нужна дата",
      });
    if (a.published && a.author.includes("подтвердить"))
      ctx.addIssue({
        code: "custom",
        path: ["author"],
        message: "Подтвердите авторство",
      });
    if (a.coverImage && !a.coverAlt)
      ctx.addIssue({
        code: "custom",
        path: ["coverAlt"],
        message: "Нужен alt обложки",
      });
  });
const topicSchema = z.object({
  slug,
  title: text,
  description: text,
  cardTitle: text,
  intro: text,
  workProcess: text,
  important: text,
  published: z.boolean(),
});
const faqSchema = z.object({
  introduction: text,
  homeIds: z.array(slug).min(1),
  items: z.array(
    z.object({ id: slug, question: text, answer: text, publish: z.boolean() }),
  ),
});
const nullableText = text.nullable();
const siteSchema = z.object({
  brandName: text,
  role: text,
  domain: text,
  siteUrl: z.url().nullable(),
  siteLanguage: z.literal("ru"),
  hero: z.object({
    eyebrow: text,
    headline: z.array(text).length(3),
    description: text,
    primaryCta: text,
    secondaryCta: text,
  }),
  contacts: z.object({
    phone: nullableText,
    email: z.email().nullable(),
    telegramUrl: z.url().nullable(),
    instagramUrl: z.url().nullable(),
    whatsappUrl: z.url().nullable(),
    viberUrl: nullableText,
  }),
  about: z.object({
    title: text,
    introduction: text,
    approachLabel: text,
    approachTitle: text,
    features: z
      .array(z.object({ icon: text, title: text, description: text }))
      .length(3),
    educationTitle: text,
    educationText: text,
    experienceTitle: text,
    experienceText: text,
    sessionsLabel: text,
  }),
  booking: z.object({
    title: text,
    description: text,
    telegramLabel: text,
    facebookLabel: text,
    instagramLabel: text,
    facebookUrl: z.url().nullable(),
    detailsTitle: text,
    format: text,
    durationMinutes: z.number().int().positive(),
    language: text,
    paymentNote: text,
  }),
  footer: z.object({
    legalIdentity: text,
    taxId: z.string().regex(/^\d{12}$/, "ИНН должен содержать 12 цифр"),
    consultationNote: text,
    schedule: text,
    telegramHandle: text,
    telegramUrl: z.url(),
    email: z.email(),
    copyright: text,
    informationNotice: text,
    topics: z.array(text).min(1),
  }),
  consultations: z.object({
    format: nullableText,
    durationMinutes: z.number().positive().nullable(),
    priceAmount: z.number().nonnegative().nullable(),
    currency: nullableText,
    bookingUrl: z.url().nullable(),
    timeZone: nullableText,
    availability: nullableText,
  }),
  professional: z.object({
    education: z.unknown(),
    credentials: z.unknown(),
    experienceYears: z.number().nullable(),
    jurisdiction: nullableText,
    worksWithMinors: z.boolean().nullable(),
    offersCouples: z.boolean().nullable(),
  }),
  publication: z.object({
    servicesVerified: z.boolean(),
    legalReviewed: z.boolean(),
    portraitIsAuthentic: z.boolean(),
    reviewsApproved: z.boolean(),
  }),
});
export function readValidated(file, schema) {
  let raw;
  try {
    raw = parse(readFileSync(file, "utf8"));
  } catch (e) {
    throw new Error(`${file}: YAML: ${e.message}`);
  }
  const result = schema.safeParse(raw);
  if (!result.success)
    throw new Error(
      result.error.issues
        .map((i) => `${file} → ${i.path.join(".")}: ${i.message}`)
        .join("\n"),
    );
  return result.data;
}
export function loadContent({
  preview = false,
  root = resolve("src/content"),
} = {}) {
  const readFolder = (folder, schema) => {
    const seen = new Set();
    return readdirSync(resolve(root, folder))
      .filter((f) => f.endsWith(".yaml"))
      .sort()
      .map((f) => {
        const file = resolve(root, folder, f);
        const item = readValidated(file, schema);
        if (seen.has(item.slug))
          throw new Error(`${file} → slug: повтор ${item.slug}`);
        seen.add(item.slug);
        return item;
      });
  };
  const articles = readFolder("articles", articleSchema);
  const topics = readFolder("topics", topicSchema);
  const faqDocument = readValidated(resolve(root, "faq.yaml"), faqSchema);
  const faq = faqDocument.items;
  const ids = new Set();
  for (const q of faq) {
    if (ids.has(q.id)) throw new Error(`${root}/faq.yaml → id: повтор ${q.id}`);
    ids.add(q.id);
  }
  const homeIds = new Set();
  for (const [index, id] of faqDocument.homeIds.entries()) {
    if (!ids.has(id))
      throw new Error(
        `${root}/faq.yaml → homeIds.${index}: вопрос ${id} не найден`,
      );
    if (homeIds.has(id))
      throw new Error(`${root}/faq.yaml → homeIds.${index}: повтор ${id}`);
    homeIds.add(id);
  }
  return {
    site: readValidated(resolve(root, "site.yaml"), siteSchema),
    articles: articles
      .filter((a) => preview || a.published)
      .sort((a, b) => (b.publishedAt ?? "").localeCompare(a.publishedAt ?? "")),
    topics: topics.filter((t) => preview || t.published),
    faq: faq.filter((q) => preview || q.publish),
    faqIntroduction: faqDocument.introduction,
    faqHomeIds: faqDocument.homeIds,
    preview,
  };
}
