import { useEffect, useRef, useState, type ReactNode } from "react";
import { navigation, site } from "../../lib/content";
import { Icon } from "../ui/Ui";
import logo from "../../assets/branding/logo-mobile.svg";
import styles from "./Layout.module.css";
function SocialLinks() {
  const socials = [
    { name: "Telegram", icon: "telegram", href: site.footer.telegramUrl },
    { name: "Instagram", icon: "instagram", href: site.contacts.instagramUrl },
    { name: "Facebook", icon: "facebook", href: site.booking.facebookUrl },
  ];
  return (
    <div className={styles.socials} role="group" aria-label="Социальные сети">
      {socials.map(({ name, icon, href }) =>
        href ? (
          <a
            key={icon}
            href={href}
            className={styles.socialIcon}
            aria-label={name}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Icon name={icon} />
          </a>
        ) : (
          <span
            key={icon}
            className={styles.socialIcon}
            role="img"
            aria-label={name}
            title={name}
          >
            <Icon name={icon} />
          </span>
        ),
      )}
    </div>
  );
}
export function Brand() {
  return (
    <a href="/" className={styles.brand} aria-label="Лилия Янушкевич — главная">
      <img src={logo} width="60" height="60" alt="" />
      <span>
        <strong>{site.brandName}</strong>
        <small>ПСИХОЛОГ</small>
      </span>
    </a>
  );
}
export function Layout({
  path,
  children,
}: {
  path: string;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (open) {
      dialog.current?.showModal();
      const old = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = old;
      };
    }
    dialog.current?.close();
  }, [open]);
  function closeMenu() {
    setOpen(false);
    trigger.current?.focus();
  }
  const sectionHref = (id: string) => `${path === "/" ? "" : "/"}#${id}`;
  const links = navigation.map(([id, label]) => (
    <a key={id} href={sectionHref(id)} onClick={closeMenu}>
      {label}
    </a>
  ));
  return (
    <>
      <a className="skip" href="#main">
        Перейти к содержимому
      </a>
      <header className={styles.header}>
        <div className={`container ${styles.headerInner}`}>
          <Brand />
          <nav className={styles.desktopNav} aria-label="Основная навигация">
            {links}
          </nav>
          <a className={styles.booking} href={sectionHref("booking")}>
            <Icon name="calendar" />
            <span>Записаться</span>
          </a>
          <button
            ref={trigger}
            className={styles.menuButton}
            aria-controls="mobile-menu"
            aria-expanded={open}
            onClick={() => setOpen(true)}
          >
            <span aria-hidden="true">☰</span>
            <span className="sr-only">Открыть меню</span>
          </button>
        </div>
      </header>
      <dialog
        id="mobile-menu"
        ref={dialog}
        className={styles.drawer}
        onCancel={(e) => {
          e.preventDefault();
          closeMenu();
        }}
        onClose={() => setOpen(false)}
        onClick={(e) => {
          if (e.target === e.currentTarget) closeMenu();
        }}
        aria-label="Меню сайта"
      >
        <div className={styles.drawerTop}>
          <Brand />
          <button onClick={closeMenu} autoFocus aria-label="Закрыть меню">
            ×
          </button>
        </div>
        <nav aria-label="Мобильная навигация">{links}</nav>
        <SocialLinks />
      </dialog>
      <main id="main">{children}</main>
      <footer className={styles.footer}>
        <div className={`container ${styles.footerGrid}`}>
          <div>
            <Brand />
            <p>
              {site.footer.legalIdentity}
              <br />
              ИНН {site.footer.taxId}
            </p>
            <p>{site.footer.consultationNote}</p>
            <p>{site.footer.schedule}</p>
            <div className={styles.footerContacts}>
              <p>
                Telegram —{" "}
                <a
                  href={site.footer.telegramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {site.footer.telegramHandle}
                </a>
              </p>
              <p>
                Email —{" "}
                <a href={`mailto:${site.footer.email}`}>{site.footer.email}</a>
              </p>
            </div>
            <SocialLinks />
          </div>
          <section
            className={styles.footerTopics}
            aria-labelledby="footer-topics-title"
          >
            <h2 id="footer-topics-title">С чем я работаю</h2>
            <ul>
              {site.footer.topics.map((topic) => (
                <li key={topic}>{topic}</li>
              ))}
            </ul>
          </section>
          <nav aria-label="Навигация в подвале">
            <h2>Навигация</h2>
            <ul className={styles.footerNavList}>
              {navigation.map(([id, label]) => (
                <li key={id}>
                  <a href={sectionHref(id)}>{label}</a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        <div className={styles.copyright}>
          <div className={`container ${styles.copyrightInner}`}>
            <p>{site.footer.copyright}</p>
            <p>{site.footer.informationNotice}</p>
          </div>
        </div>
      </footer>
    </>
  );
}
