import { build } from "vite";
import { readFile, mkdir, writeFile, rm } from "node:fs/promises";
import { resolve } from "node:path";
await build();
await build({
  build: { ssr: "src/app/server.tsx", outDir: ".ssr", emptyOutDir: true },
});
const { routes, render } = await import("../.ssr/server.js");
const template = await readFile("dist/index.html", "utf8");
const sitemap = [];
for (const path of [...routes, "/404/"]) {
  const result = render(path);
  const target =
    path === "/404/"
      ? "dist/404.html"
      : resolve("dist", `.${path}`, "index.html");
  await mkdir(resolve(target, ".."), { recursive: true });
  await writeFile(
    target,
    template
      .replace("<!--app-html-->", result.html)
      .replace("<!--page-head-->", result.head + result.structuredHead),
  );
  if (result.indexable) sitemap.push(result.canonical);
}
await writeFile(
  "dist/sitemap.xml",
  `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${sitemap.map((url) => `<url><loc>${url}</loc></url>`).join("")}</urlset>`,
);
await writeFile(
  "dist/robots.txt",
  `User-agent: *\nAllow: /\n${sitemap.length ? `Sitemap: ${new URL("/sitemap.xml", sitemap[0]).href}\n` : ""}`,
);
await writeFile(
  "dist/_headers",
  "/*\n  X-Content-Type-Options: nosniff\n  Referrer-Policy: strict-origin-when-cross-origin\n" +
    (!sitemap.length ? "  X-Robots-Tag: noindex, follow\n" : ""),
);
await rm(".ssr", { recursive: true, force: true });
console.log(
  `SSG: ${routes.length} страниц + 404; sitemap: ${sitemap.length} URL. Черновики исключены.`,
);
