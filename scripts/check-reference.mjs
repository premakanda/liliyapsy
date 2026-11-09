import { chromium } from "playwright";
import AxeBuilder from "@axe-core/playwright";
import { mkdir, writeFile } from "node:fs/promises";
const browser = await chromium.launch({
  executablePath:
    process.env.CHROME_PATH ||
    "C:/Program Files/Google/Chrome/Application/chrome.exe",
  headless: true,
});
const context = await browser.newContext();
const page = await context.newPage();
const errors = [];
page.on("pageerror", (e) => errors.push(e.message));
const origin = process.env.PREVIEW_URL || "http://127.0.0.1:51073";
await mkdir(".local/qa/reference", { recursive: true });
const report = [];
try {
  for (const width of [320, 375, 390, 768, 900, 933, 1024, 1280, 1440, 1536]) {
    await page.setViewportSize({
      width,
      height: width >= 900 ? Math.round((width * 2) / 3) : 1000,
    });
    await page.goto(origin);
    await page.evaluate(() => document.fonts.ready);
    const metrics = await page.evaluate(() => {
      const hero = document.querySelector("main>section");
      const title = hero.querySelector("h1");
      const topics = document.getElementById("requests");
      const rect = (e) => ({
        x: Math.round(e.getBoundingClientRect().x),
        y: Math.round(e.getBoundingClientRect().y),
        width: Math.round(e.getBoundingClientRect().width),
        height: Math.round(e.getBoundingClientRect().height),
      });
      return {
        viewport: innerWidth,
        scroll: document.documentElement.scrollWidth,
        hero: rect(hero),
        title: rect(title),
        topics: rect(topics),
        navigation: getComputedStyle(
          document.querySelector('nav[aria-label="Основная навигация"]'),
        ).display,
        lines: [...title.children].map((e) => rect(e)),
      };
    });
    if (metrics.scroll > width)
      throw new Error(`Overflow ${width}: ${metrics.scroll}`);
    if (width >= 900 && metrics.navigation === "none")
      throw new Error(`Desktop menu hidden: ${width}`);
    await page.screenshot({ path: `.local/qa/reference/home-${width}.png` });
    report.push(metrics);
  }
  for (const width of [390, 933, 1440]) {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto(origin);
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
      .analyze();
    if (results.violations.length) {
      await writeFile(
        ".local/qa/reference/axe.json",
        JSON.stringify(results.violations, null, 2),
      );
      throw new Error(
        `Axe ${width}: ${results.violations.map((v) => v.id).join(", ")}`,
      );
    }
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(origin);
  const menu = page.getByRole("button", { name: "Открыть меню" });
  await menu.click();
  await page.keyboard.press("Escape");
  if (!(await menu.evaluate((e) => e === document.activeElement)))
    throw new Error("Menu focus");
  if (errors.length) throw new Error(errors.join("\n"));
  await writeFile(
    ".local/qa/reference/report.json",
    JSON.stringify(
      { report, errors, accessibility: "passed", menu: "passed" },
      null,
      2,
    ),
  );
  console.log(
    "Reference checks passed: 10 widths, desktop menu, mobile menu, axe, no console errors.",
  );
} finally {
  await browser.close();
}
