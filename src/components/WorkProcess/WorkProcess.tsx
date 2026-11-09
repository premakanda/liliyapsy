import styles from "./WorkProcess.module.css";

type WorkStep = {
  number: "01" | "02" | "03" | "04";
  title: string;
  description: string;
};

const steps: readonly WorkStep[] = [
  {
    number: "01",
    title: "Первая встреча",
    description:
      "Знакомимся, обсуждаем вашу ситуацию и то, что привело вас на консультацию. Вы можете задать любые вопросы. Вместе определяем, подходит ли нам дальнейшая совместная работа.",
  },
  {
    number: "02",
    title: "Определение цели",
    description:
      "На первых 1–3 встречах уточняем ваш запрос и формулируем желаемый результат. Определяем, какие изменения будут для вас важны и по каким признакам вы сможете их заметить.",
  },
  {
    number: "03",
    title: "Регулярные консультации",
    description:
      "Встречаемся обычно раз в неделю онлайн, в Google Meet. Продолжительность консультации — 75 минут. Между встречами могут быть небольшие практические задания для самостоятельной работы.",
  },
  {
    number: "04",
    title: "Завершение работы",
    description:
      "Когда вы достигаете поставленных целей, мы подводим итоги, обсуждаем произошедшие изменения и способы их поддержания. Важно, чтобы вы могли самостоятельно применять полученный опыт в повседневной жизни.",
  },
];

export function WorkProcess() {
  return (
    <section
      id="process"
      className={styles.section}
      aria-labelledby="work-process-title"
    >
      <div className={styles.container}>
        <h2 id="work-process-title" className={styles.heading}>
          Как проходит работа
        </h2>
        <ol className={styles.steps} role="list">
          {steps.map((step) => (
            <li className={styles.card} key={step.number}>
              <span className={styles.number} aria-hidden="true">
                {step.number}
              </span>
              <h3 className={styles.title}>{step.title}</h3>
              <p className={styles.description}>{step.description}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
