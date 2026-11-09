import styles from "./RequestsSection.module.css";
import icon1 from "../../assets/icons/requests/01-circle.svg?url";
import icon2 from "../../assets/icons/requests/02-rounded-square.svg?url";
import icon3 from "../../assets/icons/requests/03-triangle.svg?url";
import icon4 from "../../assets/icons/requests/04-hexagon.svg?url";
import icon5 from "../../assets/icons/requests/05-overlapping-circles.svg?url";
import icon6 from "../../assets/icons/requests/06-overlapping-triangles.svg?url";
import icon7 from "../../assets/icons/requests/07-diamond.svg?url";
import icon8 from "../../assets/icons/requests/08-circle-square.svg?url";

type RequestItem = {
  title: string;
  description: string;
  icon: string;
};

/** Content can be updated later without changing card layout. */
const items: readonly RequestItem[] = [
  { title: "Тревога и страхи", description: "Постоянное беспокойство, навязчивые мысли, панические атаки, страхи и фобии, повышенная тревожность, внутреннее напряжение.", icon: icon1 },
  { title: "Апатия и выгорание", description: "Эмоциональное истощение, хронический стресс, упадок сил, подавленное настроение, потеря интереса к жизни, депрессивные переживания.", icon: icon2 },
  { title: "Травмы и прошлый опыт", description: "Детские травмы, болезненные воспоминания, последствия тяжёлых событий, старые обиды, переживания, которые продолжают влиять на настоящее.", icon: icon3 },
  { title: "Эмоции и привычки", description: "Перепады настроения, раздражительность, импульсивность, вредные привычки, сложности с управлением эмоциями и повторяющимися реакциями.", icon: icon4 },
  { title: "Самооценка и уверенность", description: "Неуверенность в себе, самокритика, перфекционизм, страх ошибок, зависимость от чужого мнения, трудности с принятием решений.", icon: icon5 },
  { title: "Отношения и семья", description: "Конфликты с близкими, эмоциональная зависимость, несчастная любовь, сложности в общении, расставания, развод, проблемы с личными границами.", icon: icon6 },
  { title: "Кризисы и перемены", description: "Потеря близкого человека, жизненные кризисы, ощущение пустоты, потеря смысла жизни, сложности с адаптацией, поиск новых ориентиров.", icon: icon7 },
  { title: "Поиск себя и развитие", description: "Личностный рост, самоопределение, профориентация, поиск своего пути, трудности подросткового возраста, желание изменить привычный образ жизни.", icon: icon8 },
];

export function RequestsSection() {
  return (
    <section className={styles.section} id="requests" aria-labelledby="requests-title">
      <div className={styles.container}>
        <div className={styles.headingWrap}>
          <h2 className={styles.heading} id="requests-title">С какими запросами я работаю</h2>
          <span className={styles.underline} aria-hidden="true" />
        </div>
        <div className={styles.grid}>
          {items.map((item) => (
            <article className={styles.card} key={item.title}>
              <div className={styles.iconWrap} aria-hidden="true">
                <img className={styles.icon} src={item.icon} alt="" width={64} height={64} decoding="async" />
              </div>
              <h3 className={styles.cardTitle}>{item.title}</h3>
              <p className={styles.description}>{item.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
