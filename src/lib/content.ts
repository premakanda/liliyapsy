import content from "virtual:content";
export const {
  site,
  articles,
  topics,
  faq,
  faqIntroduction,
  faqHomeIds,
  preview,
} = content;
export const navigation = [
  ["about", "Обо мне"],
  ["requests", "С чем работаю"],
  ["process", "Как работаю"],
  ["articles", "Блог"],
  ["booking", "Контакты"],
];
export const pageTitles: Record<string, string> = {
  "/": "Психолог Лилия Янушкевич",
  "/about/": "Обо мне",
  "/approach/": "Мой подход",
  "/topics/": "С чем я работаю",
  "/services/": "Услуги и формат консультаций",
  "/fees/": "Стоимость консультаций",
  "/online/": "Онлайн-консультация",
  "/reviews/": "Отзывы",
  "/faq/": "Частые вопросы",
  "/articles/": "Статьи",
  "/contacts/": "Контакты и запись",
  "/terms/": "Условия работы",
  "/privacy/": "Политика данных",
};
export function getPage(path: string) {
  const article = articles.find((a) => path === `/articles/${a.slug}/`);
  const topic = topics.find((t) => path === `/topics/${t.slug}/`);
  return {
    title:
      article?.title ??
      topic?.title ??
      pageTitles[path] ??
      "Страница не найдена",
    description:
      article?.description ??
      topic?.description ??
      "Психолог Лилия Янушкевич. Знакомство, подход к работе и ответы на вопросы о психологической поддержке.",
    article,
    topic,
    found: Boolean(pageTitles[path] || article || topic),
  };
}
export const routes = [
  ...Object.keys(pageTitles),
  ...topics.map((t) => `/topics/${t.slug}/`),
  ...articles.map((a) => `/articles/${a.slug}/`),
];
