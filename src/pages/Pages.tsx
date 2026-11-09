import ReactMarkdown from "react-markdown";
import { RequestsSection } from "../components/RequestsSection/RequestsSection";
import { WorkProcess } from "../components/WorkProcess/WorkProcess";
import { getPage, preview, site, topics } from "../lib/content";
import {
  About,
  Approach,
  ArticlesPreview,
  Benefits,
  Faq,
  FinalCTA,
  Hero,
  Principles,
  Process,
  Services,
  TopicsGrid,
} from "../components/sections/Sections";
import { Button, Notice, Section } from "../components/ui/Ui";
import styles from "./Pages.module.css";
export function Page({ path }: { path: string }) {
  const page = getPage(path);
  if (path === "/")
    return (
      <>
        <Hero />
        <Benefits />
        <About />
        <RequestsSection />
        <WorkProcess />
        <ArticlesPreview />
        <Faq />
        <FinalCTA />
      </>
    );
  const { article, topic } = page;
  const isBlog = path === "/articles/" || Boolean(article);
  const isArticleCatalogue = path === "/articles/";
  return (
    <>
      <div
        className={`${styles.pageHero} ${isBlog ? styles.blogHero : ""} ${isArticleCatalogue ? styles.catalogueHero : ""}`}
      >
        <div className="container">
          <nav aria-label="Хлебные крошки" className={styles.breadcrumbs}>
            <a href="/">Главная</a>
            <span aria-hidden="true">/</span>
            {article && (
              <>
                <a href="/articles/">Статьи</a>
                <span aria-hidden="true">/</span>
              </>
            )}
            {topic && (
              <>
                <a href="/topics/">Темы</a>
                <span aria-hidden="true">/</span>
              </>
            )}
            <span aria-current="page">{page.title}</span>
          </nav>
          {!isBlog && <p className="eyebrow">ЛИЛИЯ ЯНУШКЕВИЧ · ПСИХОЛОГ</p>}
          {!isArticleCatalogue && <h1>{page.title}</h1>}
          {!isBlog && !article && !topic && <Button />}
        </div>
      </div>
      {!page.found ? (
        <Section>
          <p>Возможно, адрес изменился или страница ещё не опубликована.</p>
          <Button href="/">Вернуться на главную</Button>
        </Section>
      ) : article ? (
        <Section>
          <article className={styles.prose}>
            {!article.published && (
              <Notice>
                Черновик для редакторской проверки. Материал не опубликован;
                авторство и содержание требуют согласования.
              </Notice>
            )}
            <p className={styles.lead}>{article.description}</p>
            <nav aria-label="Содержание статьи" className={styles.toc}>
              <strong>В этой статье</strong>
              {article.content
                .split("\n")
                .filter((s) => s.startsWith("## "))
                .map((s) => (
                  <a key={s} href={`#${headingId(s.slice(3))}`}>
                    {s.slice(3)}
                  </a>
                ))}
            </nav>
            <ReactMarkdown
              skipHtml
              components={{
                h2: ({ children }) => (
                  <h2 id={headingId(String(children))}>{children}</h2>
                ),
              }}
            >
              {article.content}
            </ReactMarkdown>
          </article>
        </Section>
      ) : topic ? (
        <>
          <Section>
            <div className={styles.prose}>
              {!topic.published && (
                <Notice>
                  Черновая тематическая страница. Компетенции и возможность
                  работы с запросом требуют подтверждения.
                </Notice>
              )}
              <h2>Когда эта тема близка</h2>
              <p className={styles.lead}>{topic.description}</p>
              <p>{topic.intro}</p>
              <h2>Как может проходить работа</h2>
              <p>{topic.workProcess}</p>
              <h2>Когда важно участие врача</h2>
              <Notice>{topic.important}</Notice>
              <p>
                <a href="/services/">Формат консультаций</a> ·{" "}
                <a href="/faq/">Ответы на вопросы</a>
              </p>
            </div>
          </Section>
          <Faq />
        </>
      ) : (
        <PageSections path={path} />
      )}
      {page.found && <FinalCTA />}
    </>
  );
}
function headingId(s: string) {
  return s
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/^-|-$/g, "");
}
function PageSections({ path }: { path: string }) {
  switch (path) {
    case "/about/":
      return (
        <>
          <About />
          <Approach />
        </>
      );
    case "/approach/":
      return (
        <>
          <Approach />
          <Process />
          <Section title="Понятные границы">
            <div className={styles.prose}>
              <p>
                До начала работы важно обсудить формат, ожидания, правила связи
                и пределы конфиденциальности. Вы можете задавать вопросы и
                говорить, если предложенный формат вам не подходит.
              </p>
              <p>
                Психологическая консультация не заменяет медицинскую помощь. При
                необходимости обращение к врачу обсуждается отдельно.
              </p>
            </div>
          </Section>
          <Faq />
        </>
      );
    case "/topics/":
      return topics.length ? (
        <TopicsGrid all />
      ) : (
        <Section title="Темы психологической поддержки">
          <Notice>
            Каталог направлений находится на проверке. Перечень запросов
            появится после подтверждения компетенций.
          </Notice>
        </Section>
      );
    case "/services/":
      return (
        <>
          <Services />
          <Process />
          <Section>
            <div className={styles.related}>
              <a href="/fees/">Стоимость и условия →</a>
              <a href="/online/">Как подготовиться к онлайн-встрече →</a>
            </div>
          </Section>
        </>
      );
    case "/fees/":
      return (
        <Section title="Условия до начала работы">
          <div className={styles.prose}>
            <p>
              Стоимость, длительность, валюта и доступные форматы пока не
              опубликованы.
            </p>
            <p>
              Перед записью важно уточнить стоимость встречи, порядок оплаты и
              правила переноса или отмены. Эти договорённости должны быть
              понятны обеим сторонам.
            </p>
            <Notice>
              На сайте пока нет оплаты и подтверждённого канала записи.
            </Notice>
            <p>
              <a href="/services/">О консультации →</a>
            </p>
          </div>
        </Section>
      );
    case "/online/":
      return (
        <>
          <Section title="Подготовьте место для спокойного разговора">
            <div className={styles.prose}>
              <p>
                Эта памятка описывает общие особенности онлайн-консультации.
                Доступность онлайн-формата у Лилии ещё предстоит подтвердить.
              </p>
              <h2>Пространство и приватность</h2>
              <p>
                Выберите место, где вас не будут слышать и отвлекать. Наушники
                могут помочь сохранить разговор приватным.
              </p>
              <h2>Связь и устройство</h2>
              <p>
                Заранее проверьте интернет, камеру, микрофон и заряд устройства.
                Платформу и резервный способ связи нужно согласовать перед
                встречей.
              </p>
              <h2>Ваш комфорт</h2>
              <p>
                Оставьте немного времени до и после разговора. Можно приготовить
                воду и выбрать удобное место для сидения.
              </p>
              <h2>Границы формата</h2>
              <p>
                Онлайн-консультация подходит не для каждой ситуации.
                Безопасность и возможность работы в таком формате обсуждаются
                индивидуально.
              </p>
            </div>
          </Section>
          <Faq />
        </>
      );
    case "/reviews/":
      return (
        <>
          <Section>
            <Notice>
              Отзывы пока не опубликованы. Здесь могут появиться только
              согласованные материалы с разрешением на публикацию.
            </Notice>
          </Section>
          <Principles />
        </>
      );
    case "/faq/":
      return <Faq full />;
    case "/articles/":
      return <ArticlesPreview full />;
    case "/contacts/": {
      const c = site.contacts;
      return (
        <Section title="Запись на консультацию">
          <div className={styles.prose}>
            <Notice>
              Канал записи пока не подключён. Отправить заявку через этот сайт
              сейчас нельзя.
            </Notice>
            {c.phone && (
              <p>
                <a href={`tel:${c.phone}`}>{c.phone}</a>
              </p>
            )}
            {c.email && (
              <p>
                <a href={`mailto:${c.email}`}>{c.email}</a>
              </p>
            )}
            {c.telegramUrl && (
              <p>
                <a href={c.telegramUrl}>Telegram</a>
              </p>
            )}
            {site.consultations.bookingUrl && (
              <Button href={site.consultations.bookingUrl} />
            )}
            <h2>Что нужно для первого контакта</h2>
            <p>
              После появления подтверждённых контактов достаточно сообщить о
              желании записаться и удобном способе ответа. Подробности личной
              ситуации при записи не обязательны.
            </p>
            <h2>До начала встречи</h2>
            <p>
              Уточните формат, время, стоимость и условия консультации.
              Чувствительные подробности лучше обсуждать в заранее согласованном
              приватном формате.
            </p>
            <p>
              <a href="/faq/">Вопросы о первой встрече →</a>
            </p>
          </div>
        </Section>
      );
    }
    case "/terms/":
    case "/privacy/":
      return (
        <Section>
          <div className={styles.prose}>
            <Notice>
              Документ находится в подготовке и пока не является утверждённым
              юридическим текстом.
            </Notice>
            <p>
              {path === "/terms/"
                ? "Условия формата, оплаты, переноса и отмены встреч будут доступны после согласования."
                : "Сведения об операторе данных, целях и основаниях обработки, хранении и правах пользователя будут доступны после юридической проверки."}
            </p>
            <p>
              Сайт не содержит формы сбора заявок, платёжных инструментов или
              подключённой аналитики.
            </p>
            <h2>Экстренные ситуации</h2>
            <p>
              Консультации и материалы сайта не заменяют экстренную помощь. При
              непосредственной угрозе жизни или здоровью обращайтесь в местные
              экстренные службы.
            </p>
          </div>
        </Section>
      );
    default:
      return preview ? (
        <Section>
          <p>Страница готовится.</p>
        </Section>
      ) : null;
  }
}
