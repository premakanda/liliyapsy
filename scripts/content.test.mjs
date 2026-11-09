import { test } from "node:test";
import assert from "node:assert/strict";
import {
  mkdtempSync,
  mkdirSync,
  cpSync,
  readFileSync,
  writeFileSync,
  rmSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { parse, stringify } from "yaml";
import { loadContent } from "./content.mjs";
test("Публичная модель не раскрывает черновики и скрытые FAQ", () => {
  const c = loadContent();
  assert.equal(c.articles.length, 35);
  assert(c.articles.every((a) => a.published));
  assert.equal(c.topics.length, 0);
  assert(c.faq.every((q) => q.publish));
});
test("Редактор видит 35 статей, 6 тем и 22 вопроса; для главной выбрано 11", () => {
  const c = loadContent({ preview: true });
  assert.equal(c.articles.length, 35);
  assert.equal(c.topics.length, 6);
  assert.equal(c.faq.length, 22);
  assert.equal(c.faqHomeIds.length, 11);
});
function fixture(fn) {
  const root = mkdtempSync(join(tmpdir(), "liliapsi-content-"));
  try {
    mkdirSync(join(root, "content"));
    cpSync("src/content", join(root, "content"), { recursive: true });
    fn(join(root, "content"));
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
}
test("Публикация без реальной даты отклоняется с путём поля", () =>
  fixture((root) => {
    const file = join(root, "articles/11-privychek-razvitiya.yaml");
    const a = parse(readFileSync(file, "utf8"));
    a.published = true;
    a.publishedAt = null;
    writeFileSync(file, stringify(a));
    assert.throws(
      () => loadContent({ root }),
      /11-privychek-razvitiya.yaml → publishedAt/,
    );
  }));
test("Повтор slug останавливает сборку", () =>
  fixture((root) => {
    cpSync(
      join(root, "articles/11-privychek-razvitiya.yaml"),
      join(root, "articles/duplicate.yaml"),
    );
    assert.throws(() => loadContent({ root }), /slug: повтор/);
  }));
test("Утверждённая статья попадает в единую публичную модель", () =>
  fixture((root) => {
    const file = join(root, "articles/11-privychek-razvitiya.yaml");
    const a = parse(readFileSync(file, "utf8"));
    a.published = true;
    a.publishedAt = "2026-01-01";
    a.author = "Лилия Янушкевич";
    writeFileSync(file, stringify(a));
    assert.equal(loadContent({ root }).articles.length, 35);
  }));
test("Скрытая статья исключается из публичной модели", () =>
  fixture((root) => {
    const file = join(root, "articles/11-privychek-razvitiya.yaml");
    const a = parse(readFileSync(file, "utf8"));
    a.published = false;
    writeFileSync(file, stringify(a));
    assert.equal(loadContent({ root }).articles.length, 34);
    assert.equal(loadContent({ root, preview: true }).articles.length, 35);
  }));
