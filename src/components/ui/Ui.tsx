import type { ReactNode } from "react";
import styles from "./Ui.module.css";
const icons = import.meta.glob<string>("../../assets/icons/*.svg", {
  eager: true,
  query: "?url",
  import: "default",
});
export function Icon({
  name,
  className = "",
}: {
  name: string;
  className?: string;
}) {
  return (
    <img
      className={`${styles.icon} ${className}`}
      src={icons[`../../assets/icons/${name}.svg`]}
      width="48"
      height="48"
      alt=""
      aria-hidden="true"
    />
  );
}
export function Button({
  children = "Записаться на консультацию",
  href = "/contacts/",
  secondary = false,
}: {
  children?: ReactNode;
  href?: string;
  secondary?: boolean;
}) {
  return (
    <a
      href={href}
      className={`${styles.button} ${secondary ? styles.secondary : ""}`}
    >
      {children}
      <Icon name="arrow" />
    </a>
  );
}
export function Section({
  id,
  eyebrow,
  title,
  children,
  className = "",
}: {
  id?: string;
  eyebrow?: string;
  title?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section id={id} className={`${styles.section} ${className}`}>
      <div className="container">
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        {title && <h2 className={styles.sectionTitle}>{title}</h2>}
        {children}
      </div>
    </section>
  );
}
export function Notice({ children }: { children: ReactNode }) {
  return <div className={styles.notice}>{children}</div>;
}
