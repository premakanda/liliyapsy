import { useState } from "react";
import {
  articles,
  faq,
  faqIntroduction,
  faqHomeIds,
  preview,
  site,
  topics,
} from "../../lib/content";
import type { FaqItem } from "../../lib/types";
import { Button, Icon, Section } from "../ui/Ui";
import person420 from "../../assets/images/hero-person-420.webp";
import person760 from "../../assets/images/hero-person-760.webp";
import person1080 from "../../assets/images/hero-person-1080.webp";
import styles from "./Sections.module.css";
import { AboutSection } from "../AboutSection/AboutSection";
export function Portrait({ hero = false }: { hero?: boolean }) {
  return (
    <img
      className={styles.portrait}
      src={person760}
      srcSet={`${person420} 420w, ${person760} 760w, ${person1080} 1080w`}
      sizes={
        hero
          ? "(min-width: 1024px) 52vw, 100vw"
          : "(min-width: 768px) 40vw, 100vw"
      }
      width="760"
      height="545"
      alt="Иллюстративный ИИ-портрет женщины в сиреневой блузе"
      loading={hero ? "eager" : "lazy"}
      fetchPriority={hero ? "high" : "auto"}
    />
  );
}
export function Hero() {
  return (
    <section id="hero" className={styles.hero}>
      <div className={styles.heroPhoto}>
        <Portrait hero />
      </div>
      <div className={`container ${styles.heroInner}`}>
        <div className={styles.heroCopy}>
          <p className="eyebrow">{site.hero.eyebrow}</p>
          <h1>
            {site.hero.headline.map((line, i) => (
              <span key={line} className={i === 2 ? styles.brush : undefined}>
                {line}
              </span>
            ))}
          </h1>
          <p className={styles.heroDescription}>
            {site.hero.description
              .split(/ (?=с трудностями|больше опоры)/)
              .map((part) => (
                <span key={part}>{part} </span>
              ))}
          </p>
        </div>
      </div>
    </section>
  );
}
const benefits = [
  ["sprout", "Безопасное пространство", "Где можно быть собой"],
  ["heart", "Индивидуальный подход", "Учитываю ваши задачи и ритм жизни"],
  ["bolt", "Реальные изменения", "В мышлении, чувствах и действиях"],
];
export function Benefits() {
  return (
    <div className={`container ${styles.benefits}`}>
      {benefits.map(([icon, title, text]) => (
        <div key={title} className={styles.benefit}>
          <span className={styles.iconTile}>
            <Icon name={icon} />
          </span>
          <div>
            <h3>{title}</h3>
            <p>{text}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
const featured = [
  ["trevoga-i-stress", "knot", "Тревога и стресс"],
  ["otnosheniya", "hearts", "Отношения и близость"],
  ["samootsenka", "sprout", "Самооценка и уверенность"],
  ["emotsionalnoe-vygoranie", "battery", "Ресурс и выгорание"],
];
export function TopicsGrid({ all = false }: { all?: boolean }) {
  const cards = all
    ? topics.map((t) => [
        t.slug,
        featured.find((f) => f[0] === t.slug)?.[1] ?? "heart",
        t.cardTitle,
      ])
    : featured;
  return (
    <Section
      id="topics"
      className={`${styles.topicsSection} ${!all ? styles.featuredTopics : ""}`}
    >
      <div className={styles.sectionHeading}>
        <h2 className={styles.underlined}>
          {all ? "Найдите близкую вам тему" : "С чем я помогаю"}
        </h2>
        <p>
          Здесь можно узнать больше о переживаниях, которые мешают чувствовать
          себя спокойно и уверенно.
        </p>
      </div>
      <div className={styles.topicGrid}>
        {cards.map(([slug, icon, title]) => {
          const available = topics.some((t) => t.slug === slug);
          return (
            <a
              href={available ? `/topics/${slug}/` : "/topics/"}
              className={styles.topicCard}
              key={slug}
            >
              <Icon name={icon} />
              <h3>
                {!all ? (
                  <>
                    {title.split(" ")[0]}
                    <br />
                    {title.split(" ").slice(1).join(" ")}
                  </>
                ) : (
                  title
                )}
              </h3>
              <span className={styles.cardArrow} aria-hidden="true">
                <Icon name="arrow" />
              </span>
              {all && <p>{topics.find((t) => t.slug === slug)?.description}</p>}
            </a>
          );
        })}
      </div>
      {!all && (
        <div className={styles.center}>
          <Button href="/topics/" secondary>
            Все запросы
          </Button>
        </div>
      )}
      {(preview || !topics.length) && (
        <p className={styles.caption}>
          Темы подготовлены для знакомства. Возможность работы с конкретным
          запросом необходимо уточнить до записи.
          {preview ? " Детальные тексты — черновики для проверки." : ""}
        </p>
      )}
    </Section>
  );
}
const steps = [
  [
    "Знакомство",
    "Обсуждаем ожидания и то, что важно знать о совместной работе.",
  ],
  [
    "Ваш запрос",
    "Проясняем, что беспокоит сейчас и чему хочется уделить внимание.",
  ],
  [
    "Исследование",
    "Замечаем повторяющиеся реакции, чувства и привычные способы действовать.",
  ],
  [
    "Новые шаги",
    "Ищем посильные изменения и обсуждаем, как они проявляются в жизни.",
  ],
];
export function Process() {
  return (
    <Section id="process" eyebrow="ШАГ ЗА ШАГОМ" title="Как проходит работа">
      <div className={styles.processGrid}>
        {steps.map(([title, text], i) => (
          <div key={title} className={styles.step}>
            <span className={styles.stepNumber}>0{i + 1}</span>
            <h3>{title}</h3>
            <p>{text}</p>
          </div>
        ))}
      </div>
      <p className={styles.caption}>
        Это общий ориентир: темп и содержание встреч зависят от вашей ситуации.
      </p>
    </Section>
  );
}
export function About() {
  return <AboutSection />;
}
export function Approach() {
  return (
    <Section
      id="approach"
      eyebrow="МОЙ ПОДХОД"
      title="С вниманием к вам. В вашем ритме."
    >
      <div className={styles.approachGrid}>
        <p className={styles.largeText}>
          Понимание себя начинается с любопытства к собственному опыту. В
          совместной работе есть место и чувствам, и осмыслению, и небольшим
          практическим шагам.
        </p>
        <div>
          {[
            [
              "Совместная работа",
              "Ваш опыт и обратная связь помогают определять направление разговора.",
            ],
            [
              "Уважение к вашему ритму",
              "Можно задавать вопросы, обсуждать сомнения и говорить о своих границах.",
            ],
            [
              "От понимания к действию",
              "Исследуем повторяющиеся сценарии и ищем новые способы реагировать.",
            ],
          ].map(([title, text]) => (
            <div className={styles.approachItem} key={title}>
              <Icon name="sprout" />
              <div>
                <h3>{title}</h3>
                <p>{text}</p>
              </div>
            </div>
          ))}
          <Button href="/approach/" secondary>
            Подробнее о подходе
          </Button>
        </div>
      </div>
    </Section>
  );
}
export function Services() {
  const c = site.consultations;
  return (
    <Section
      id="services"
      className={styles.services}
      eyebrow="ВРЕМЯ ДЛЯ СЕБЯ"
      title="Услуги и формат консультаций"
    >
      <div className={styles.serviceCard}>
        <Icon name="heart" />
        <div>
          <h3>Индивидуальная консультация</h3>
          <p>
            Пространство для разговора о том, что важно вам: переживаниях,
            отношениях и изменениях в жизни.
          </p>
          {c.format && <p>{c.format}</p>}
          {c.durationMinutes && <p>{c.durationMinutes} минут</p>}
          {c.priceAmount !== null && (
            <p>
              {c.priceAmount} {c.currency}
            </p>
          )}
          <p className={styles.caption}>
            Формат, длительность и стоимость пока не опубликованы.
          </p>
          <a href="/fees/">Условия и стоимость →</a>
        </div>
        <Button />
      </div>
    </Section>
  );
}
const principles = [
  [
    "Без оценок",
    "Ваши чувства не нужно оправдывать. Можно говорить о сложном и искать собственные ответы.",
  ],
  [
    "С уважением к границам",
    "Вы выбираете, чем готовы делиться. Пределы конфиденциальности обсуждаются до начала работы.",
  ],
  [
    "С правом на вопросы",
    "Сомнения и обратную связь можно обсуждать. Важно понимать, как устроена совместная работа.",
  ],
];
export function Principles() {
  const [index, setIndex] = useState(0);
  return (
    <Section id="reviews" title="Что важно в нашей работе">
      <div className={styles.principle}>
        <Icon name="hearts" />
        <div aria-live="polite">
          <h3>{principles[index][0]}</h3>
          <p>{principles[index][1]}</p>
        </div>
        <div className={styles.sliderControls}>
          <button
            aria-label="Предыдущий принцип"
            onClick={() => setIndex((index + 2) % 3)}
          >
            ←
          </button>
          <span>{index + 1} / 3</span>
          <button
            aria-label="Следующий принцип"
            onClick={() => setIndex((index + 1) % 3)}
          >
            →
          </button>
        </div>
      </div>
    </Section>
  );
}
export function ArticlesPreview({ full = false }: { full?: boolean }) {
  const articleIcons = [
    "sprout",
    "hearts",
    "brain",
    "layers",
    "people",
    "bolt",
    "knot",
    "battery",
  ];
  const excerpt = (content: string) =>
    content
      .replace(/^#{1,6}\s+.*$/gm, "")
      .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
      .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
      .replace(/[*_`>]/g, "")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 1200);
  return (
    <Section
      id="articles"
      title={full ? undefined : "Лучше понимать себя"}
      className={!full ? styles.articlesSection : undefined}
    >
      <div className={styles.articleGrid}>
        {(full ? articles : articles.slice(0, 3)).map((a, i) => (
          <a
            key={a.slug}
            className={styles.articleCard}
            href={`/articles/${a.slug}/`}
          >
            <div className={styles.articleArt}>
              <Icon name={articleIcons[i % articleIcons.length]} />
            </div>
            <div className={styles.articleBody}>
              <h3>{a.title}</h3>
              <p>{excerpt(a.content)}</p>
              <span className={styles.readMore}>
                Читать статью <span aria-hidden="true">↗</span>
              </span>
            </div>
          </a>
        ))}
      </div>
      {!articles.length && (
        <p>
          Здесь появятся материалы о психологической поддержке после авторской
          проверки.
        </p>
      )}
      {!full && articles.length > 0 && (
        <div className={styles.center}>
          <Button href="/articles/">
            Все статьи
          </Button>
        </div>
      )}
    </Section>
  );
}
export function Faq({
  full = false,
  items = faq,
}: {
  full?: boolean;
  items?: FaqItem[];
}) {
  const [filter, setFilter] = useState("");
  const shown = items.filter((q) =>
    q.question.toLocaleLowerCase("ru").includes(filter.toLocaleLowerCase("ru")),
  );
  const homeItems = faqHomeIds
    .map((id) => items.find((q) => q.id === id))
    .filter((q): q is FaqItem => Boolean(q?.publish));
  return (
    <Section id="faq" title="Частые вопросы">
      <p className={styles.faqIntroduction}>
        {faqIntroduction.split(/(Telegram)/).map((part, index) =>
          part === "Telegram" ? (
            <a
              key={index}
              href={site.footer.telegramUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              Telegram
            </a>
          ) : (
            part
          ),
        )}
      </p>
      {full && (
        <label className={styles.searchLabel}>
          Найти вопрос
          <input
            type="search"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder="Например, первая встреча"
          />
        </label>
      )}
      <div className={styles.faq}>
        {(full ? shown : homeItems).map((q) => (
          <details id={q.id} key={q.id}>
            <summary>
              {q.question}
              {!q.publish && <small>Черновик</small>}
              <span aria-hidden="true">+</span>
            </summary>
            <p>{q.answer}</p>
            <a href={`/faq/#${q.id}`} className={styles.questionLink}>
              Ссылка на вопрос
            </a>
          </details>
        ))}
      </div>
      {full && !shown.length && (
        <p role="status">Таких вопросов пока нет. Попробуйте другое слово.</p>
      )}
    </Section>
  );
}
export function FinalCTA() {
  const booking = site.booking;
  return (
    <section
      id="booking"
      className={styles.finalCta}
      aria-labelledby="booking-title"
    >
      <div className="container">
        <div className={styles.bookingGrid}>
          <div className={styles.bookingIntro}>
            <h2 id="booking-title" className={styles.bookingHeading}>
              {booking.title}
            </h2>
            <p>{booking.description}</p>
            <div className={styles.bookingActions}>
              <a
                className={styles.contactButton}
                href={site.footer.telegramUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Icon name="telegram" />
                {booking.telegramLabel}
              </a>
              {booking.facebookUrl ? (
                <a
                  className={`${styles.contactButton} ${styles.contactSecondary}`}
                  href={booking.facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Icon name="facebook" />
                  {booking.facebookLabel}
                </a>
              ) : (
                <button
                  className={`${styles.contactButton} ${styles.contactSecondary}`}
                  disabled
                  title="Ссылка на Facebook пока не добавлена"
                >
                  <Icon name="facebook" />
                  {booking.facebookLabel}
                </button>
              )}
              {site.contacts.instagramUrl ? (
                <a
                  className={`${styles.contactButton} ${styles.contactSecondary}`}
                  href={site.contacts.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Icon name="instagram" />
                  {booking.instagramLabel}
                </a>
              ) : (
                <button
                  className={`${styles.contactButton} ${styles.contactSecondary}`}
                  disabled
                  title="Ссылка на Instagram пока не добавлена"
                >
                  <Icon name="instagram" />
                  {booking.instagramLabel}
                </button>
              )}
            </div>
          </div>
          <div className={styles.consultationDetails}>
            <h3>{booking.detailsTitle}</h3>
            <dl>
              <div>
                <dt>Формат</dt>
                <dd>{booking.format}</dd>
              </div>
              <div>
                <dt>Продолжительность</dt>
                <dd>{booking.durationMinutes} минут</dd>
              </div>
              <div>
                <dt>Язык</dt>
                <dd>{booking.language}</dd>
              </div>
            </dl>
            <p>{booking.paymentNote}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
