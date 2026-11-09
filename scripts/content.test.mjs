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
  assert.equal(c.articles.length, 0);
  assert.equal(c.topics.length, 0);
  assert(c.faq.every((q) => q.publish));
});
test("Редактор видит 9 статей, 6 тем и 22 вопроса; для главной выбрано 11", () => {
  const c = loadContent({ preview: true });
  assert.equal(c.articles.length, 9);
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
    const file = join(root, "articles/kak-vybrat-psihologa.yaml");
    const a = parse(readFileSync(file, "utf8"));
    a.published = true;
    writeFileSync(file, stringify(a));
    assert.throws(
      () => loadContent({ root }),
      /kak-vybrat-psihologa.yaml → publishedAt/,
    );
  }));
test("Повтор slug останавливает сборку", () =>
  fixture((root) => {
    cpSync(
      join(root, "articles/kak-vybrat-psihologa.yaml"),
      join(root, "articles/duplicate.yaml"),
    );
    assert.throws(() => loadContent({ root }), /slug: повтор/);
  }));
test("Утверждённая статья попадает в единую публичную модель", () =>
  fixture((root) => {
    const file = join(root, "articles/kak-vybrat-psihologa.yaml");
    const a = parse(readFileSync(file, "utf8"));
    a.published = true;
    a.publishedAt = "2026-01-01";
    a.author = "Лилия Янушкевич";
    writeFileSync(file, stringify(a));
    assert.equal(loadContent({ root }).articles.length, 1);
  }));
