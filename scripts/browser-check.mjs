import { chromium } from "playwright";
import AxeBuilder from "@axe-core/playwright";
import { mkdir, writeFile } from "node:fs/promises";
import { loadContent } from "./content.mjs";

const devOrigin = process.env.PREVIEW_URL || "http://127.0.0.1:51073";
const staticOrigin = process.env.STATIC_PREVIEW_URL || "http://127.0.0.1:51074";
const qaDirectory = ".local/qa/browser";
const widths = [320, 375, 390, 768, 1024, 1440];
const content = loadContent({ preview: true });
const browser = await chromium.launch({
  executablePath:
    process.env.CHROME_PATH ||
    "C:/Program Files/Google/Chrome/Application/chrome.exe",
  headless: true,
});
const context = await browser.newContext();
const page = await context.newPage();
const errors = [];
page.on("pageerror", (error) => errors.push(error.message));
await mkdir(qaDirectory, { recursive: true });

async function open(path = "/") {
  await page.goto(new URL(path, devOrigin).href);
  await page.evaluate(() => document.fonts.ready);
  await page.locator("h1").waitFor();
}
async function checkOverflow(label) {
  if (
    await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)
  ) {
    throw new Error(`Horizontal overflow: ${label}`);
  }
}

try {
  for (const width of widths) {
    await page.setViewportSize({ width, height: 1000 });
    await open();
    await checkOverflow(`home ${width}`);
    const sectionIds = await page
      .locator("main > section")
      .evaluateAll((elements) => elements.map((element) => element.id));
    if (
      sectionIds.join(",") !==
      "hero,about,requests,process,articles,faq,booking"
    )
      throw new Error("Homepage order changed");
    if (
      (await page.locator("#requests article").count()) !== 8 ||
      (await page.locator("#process ol > li").count()) !== 4
    )
      throw new Error("Card count changed");
    if (
      (await page.locator("#faq details").count()) !== content.faqHomeIds.length
    )
      throw new Error("Homepage FAQ count");
    if (await page.locator("#hero a,#hero button").count())
      throw new Error("Unexpected hero buttons");
    const navigation = await page
      .locator("header nav a")
      .evaluateAll((links) => links.map((link) => link.getAttribute("href")));
    if (navigation.join(",") !== "#about,#requests,#process,#articles,#booking")
      throw new Error("Navigation anchors changed");
    const brokenImages = await page
      .locator("img")
      .evaluateAll(async (images) => {
        await Promise.all(
          images.map((image) => {
            image.loading = "eager";
            return image.decode().catch(() => undefined);
          }),
        );
        return images
          .filter((image) => !image.naturalWidth)
          .map((image) => image.src);
      });
    if (brokenImages.length)
      throw new Error(`Broken images: ${brokenImages.join(", ")}`);
    await page.screenshot({ path: `${qaDirectory}/home-${width}.png` });
  }

  await page.setViewportSize({ width: 390, height: 844 });
  await open();
  const menu = page.locator('header button[aria-controls="mobile-menu"]');
  await menu.click();
  if ((await menu.getAttribute("aria-expanded")) !== "true")
    throw new Error("Menu did not open");
  const mobileMenu = page.locator("#mobile-menu");
  if (
    (await mobileMenu.locator("nav a").count()) !== 5 ||
    (await mobileMenu.locator('[role="group"] > *').count()) !== 3
  )
    throw new Error("Mobile menu content");
  await page.keyboard.press("Escape");
  if (!(await menu.evaluate((element) => element === document.activeElement)))
    throw new Error("Menu focus was not restored");
  await menu.click();
  await mobileMenu.locator('nav a[href="#about"]').click();
  await page.waitForFunction(() => !document.querySelector("dialog").open);
  await page.waitForURL("**/#about");

  const tabs = page.locator('#about [role="tab"]');
  if ((await tabs.count()) !== 3) throw new Error("About tabs");
  await tabs.first().focus();
  await page.keyboard.press("End");
  if ((await tabs.last().getAttribute("aria-selected")) !== "true")
    throw new Error("About keyboard tabs");
  await page.keyboard.press("Home");

  const summary = page.locator("#faq summary").first();
  await summary.focus();
  await summary.press("Enter");
  if (
    !(await page
      .locator("#faq details")
      .first()
      .evaluate((element) => element.open))
  )
    throw new Error("FAQ keyboard toggle");

  await open("/faq/");
  const question = content.faq.find(
    (item) => item.id === content.faqHomeIds[0],
  );
  await page.getByRole("searchbox").fill(question.question);
  if ((await page.locator("details").count()) !== 1)
    throw new Error("FAQ search");

  await open();
  await page.locator('#articles a[href="/articles/"]').click();
  await page.waitForURL("**/articles/");
  if (
    (await page.locator('#articles a[href^="/articles/"] h3').count()) !==
    content.articles.length
  )
    throw new Error("Article catalogue");
  const category = content.articles[0]?.category;
  if (category) {
    await page.getByRole("button", { name: category, exact: true }).click();
    if (
      (await page.locator('#articles a[href^="/articles/"] h3').count()) !==
      content.articles.filter((article) => article.category === category).length
    )
      throw new Error("Article category filter");
  }

  const paths = [
    "/about/",
    "/approach/",
    "/topics/",
    "/services/",
    "/fees/",
    "/online/",
    "/reviews/",
    "/faq/",
    "/articles/",
    "/contacts/",
    "/terms/",
    "/privacy/",
    ...content.topics.map((topic) => `/topics/${topic.slug}/`),
    ...content.articles.map((article) => `/articles/${article.slug}/`),
  ];
  for (const width of [320, 768, 1440]) {
    await page.setViewportSize({ width, height: 1000 });
    for (const path of paths) {
      await open(path);
      await checkOverflow(`${path} at ${width}`);
    }
  }

  for (const path of ["/", "/faq/", `/articles/${content.articles[0].slug}/`]) {
    await open(path);
    const audit = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
      .analyze();
    if (audit.violations.length) {
      await writeFile(
        `${qaDirectory}/axe.json`,
        JSON.stringify(audit.violations, null, 2),
      );
      throw new Error(
        `Axe ${path}: ${audit.violations.map((violation) => violation.id).join(", ")}`,
      );
    }
  }

  const staticHome = await fetch(new URL("/", staticOrigin));
  const html = await staticHome.text();
  if (
    staticHome.status !== 200 ||
    !html.includes('id="requests"') ||
    !html.includes('id="work-process-title"') ||
    !html.includes("noindex,follow")
  )
    throw new Error("Static HTML missing or not a preview");
  for (const path of [
    "/does-not-exist/",
    `/articles/${content.articles[0].slug}/`,
    `/topics/${content.topics[0].slug}/`,
  ]) {
    if ((await fetch(new URL(path, staticOrigin))).status !== 404)
      throw new Error(`Static 404/draft isolation failed: ${path}`);
  }
  if (errors.length) throw new Error(errors.join("\n"));
  await writeFile(
    `${qaDirectory}/report.json`,
    JSON.stringify(
      {
        widths,
        pathsChecked: paths.length,
        navigation: "passed",
        images: "passed",
        tabs: "passed",
        faq: "passed",
        articleFilters: "passed",
        accessibility: "passed",
        staticHtml: "passed",
        draftIsolation: "passed",
        errors,
      },
      null,
      2,
    ),
  );
  console.log(
    "Browser checks passed: six homepage widths, all routes, assets, anchors, tabs, FAQ, articles, axe, static HTML and HTTP 404.",
  );
} finally {
  await browser.close();
}
