import { renderToString } from "react-dom/server";
import { App } from "./App";
import { getPage, routes, site, preview } from "../lib/content";
export { routes };
function escape(s: string) {
  return s.replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ] ?? c,
  );
}
export function render(path: string) {
  const page = getPage(path);
  const canonical = site.siteUrl ? new URL(path, site.siteUrl).href : null;
  const indexable =
    !preview &&
    Boolean(canonical) &&
    page.found &&
    !["/terms/", "/privacy/", "/reviews/", "/fees/"].includes(path);
  const title = path === "/" ? page.title : `${page.title} — ${site.brandName}`;
  const structured =
    indexable && canonical
      ? [
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              {
                "@type": "ListItem",
                position: 1,
                name: "Главная",
                item: site.siteUrl,
              },
              ...(path === "/"
                ? []
                : [
                    {
                      "@type": "ListItem",
                      position: 2,
                      name: page.title,
                      item: canonical,
                    },
                  ]),
            ],
          },
          ...(page.article
            ? [
                {
                  "@context": "https://schema.org",
                  "@type": "Article",
                  headline: page.article.title,
                  description: page.article.description,
                  datePublished: page.article.publishedAt,
                  ...(page.article.updatedAt
                    ? { dateModified: page.article.updatedAt }
                    : {}),
                  author: { "@type": "Person", name: page.article.author },
                  mainEntityOfPage: canonical,
                },
              ]
            : []),
        ]
      : [];
  return {
    html: renderToString(<App path={path} />),
    head: `<title>${escape(title)}</title><meta name="description" content="${escape(page.description)}"/><meta name="robots" content="${indexable ? "index,follow" : "noindex,follow"}"/><meta property="og:title" content="${escape(title)}"/><meta property="og:description" content="${escape(page.description)}"/><meta property="og:type" content="${page.article ? "article" : "website"}"/>${canonical && indexable ? `<link rel="canonical" href="${escape(canonical)}"/><meta property="og:url" content="${escape(canonical)}"/>` : ""}`,
    structuredHead: structured.length
      ? `<script type="application/ld+json">${JSON.stringify(structured).replace(/</g, "\\u003c")}</script>`
      : "",
    indexable,
    canonical,
  };
}
