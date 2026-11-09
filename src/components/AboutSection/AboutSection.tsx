import { useRef, useState, type KeyboardEvent } from "react";
import { site } from "../../lib/content";
import { Icon } from "../ui/Ui";
import portrait420 from "../../assets/images/hero-person-420.webp";
import portrait760 from "../../assets/images/hero-person-760.webp";
import portrait1080 from "../../assets/images/hero-person-1080.webp";
import styles from "./AboutSection.module.css";

const tabs = [
  { id: "general", label: "Общая информация" },
  { id: "education", label: "Образование" },
  { id: "experience", label: "Опыт" },
] as const;
type TabId = (typeof tabs)[number]["id"];

export function AboutSection() {
  const [active, setActive] = useState<TabId>("general");
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const about = site.about;
  function handleTabKey(
    event: KeyboardEvent<HTMLButtonElement>,
    index: number,
  ) {
    let next = index;
    switch (event.key) {
      case "ArrowRight":
        next = (index + 1) % tabs.length;
        break;
      case "ArrowLeft":
        next = (index + tabs.length - 1) % tabs.length;
        break;
      case "Home":
        next = 0;
        break;
      case "End":
        next = tabs.length - 1;
        break;
      default:
        return;
    }
    event.preventDefault();
    setActive(tabs[next].id);
    tabRefs.current[next]?.focus();
  }
  const socials = [
    { label: "Telegram", icon: "telegram", href: site.footer.telegramUrl },
    { label: "Instagram", icon: "instagram", href: site.contacts.instagramUrl },
    { label: "Facebook", icon: "facebook", href: site.booking.facebookUrl },
  ];
  return (
    <section
      id="about"
      className={styles.section}
      aria-labelledby="about-title"
    >
      <div className={styles.container}>
        <h2 id="about-title" className={styles.heading}>
          {about.title}
        </h2>
        <p className={styles.introduction}>{about.introduction}</p>
        <div className={styles.layout}>
          <aside
            className={styles.profile}
            aria-label="Лилия Янушкевич, психолог"
          >
            <div className={styles.portraitFrame}>
              <img
                src={portrait760}
                srcSet={`${portrait420} 420w, ${portrait760} 760w, ${portrait1080} 1080w`}
                sizes="(min-width: 1024px) 860px, (min-width: 640px) 1080px, calc(265vw - 222px)"
                width="760"
                height="545"
                alt="Иллюстративный ИИ-портрет женщины в сиреневой блузе"
                loading="lazy"
                decoding="async"
              />
            </div>
            <h3>{site.brandName}</h3>
            <p className={styles.role}>ПСИХОЛОГ</p>
            <div
              className={styles.socials}
              role="group"
              aria-label="Социальные сети"
            >
              {socials.map(({ label, icon, href }) =>
                href ? (
                  <a
                    key={icon}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                  >
                    <Icon name={icon} />
                  </a>
                ) : (
                  <span key={icon} role="img" aria-label={label} title={label}>
                    <Icon name={icon} />
                  </span>
                ),
              )}
            </div>
            <p className={styles.portraitNote}>Иллюстративный ИИ-портрет</p>
          </aside>
          <div className={styles.content}>
            <div className={styles.toolbar}>
              <div
                className={styles.tabs}
                role="tablist"
                aria-label="Информация о психологе"
              >
                {tabs.map((tab, index) => (
                  <button
                    key={tab.id}
                    ref={(element) => {
                      tabRefs.current[index] = element;
                    }}
                    type="button"
                    id={`about-tab-${tab.id}`}
                    role="tab"
                    aria-selected={active === tab.id}
                    aria-controls={`about-panel-${tab.id}`}
                    tabIndex={active === tab.id ? 0 : -1}
                    onClick={() => setActive(tab.id)}
                    onKeyDown={(event) => handleTabKey(event, index)}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
              <a href="#booking" className={styles.bookingLink}>
                Записаться
                <Icon name="arrow" />
              </a>
            </div>
            <div
              className={styles.panel}
              id="about-panel-general"
              role="tabpanel"
              aria-labelledby="about-tab-general"
              tabIndex={0}
              hidden={active !== "general"}
            >
              <p className={styles.approachLabel}>{about.approachLabel}</p>
              <h3>{about.approachTitle}</h3>
              <ul className={styles.features}>
                {about.features.map((feature) => (
                  <li key={feature.title}>
                    <span className={styles.featureIcon}>
                      <Icon name={feature.icon} />
                    </span>
                    <div>
                      <h4>{feature.title}</h4>
                      <p>{feature.description}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div
              className={styles.panel}
              id="about-panel-education"
              role="tabpanel"
              aria-labelledby="about-tab-education"
              tabIndex={0}
              hidden={active !== "education"}
            >
              <h3>{about.educationTitle}</h3>
              <p className={styles.panelText}>{about.educationText}</p>
              <a
                className={styles.textLink}
                href={site.footer.telegramUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                Написать в Telegram
              </a>
            </div>
            <div
              className={styles.panel}
              id="about-panel-experience"
              role="tabpanel"
              aria-labelledby="about-tab-experience"
              tabIndex={0}
              hidden={active !== "experience"}
            >
              <h3>{about.experienceTitle}</h3>
              <dl className={styles.experienceStats}>
                <div>
                  <dt>{site.professional.experienceYears} года</dt>
                  <dd>практики консультаций</dd>
                </div>
                <div>
                  <dt>{about.sessionsLabel}</dt>
                  <dd>индивидуальной работы</dd>
                </div>
              </dl>
              <p className={styles.panelText}>{about.experienceText}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
