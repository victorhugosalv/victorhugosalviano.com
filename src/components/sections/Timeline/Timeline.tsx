import { Period } from "@/components/ui/Period";
import { timeline } from "@/content/timeline";

import styles from "./Timeline.module.css";

/** Trajetória: lista ordenada, do mais recente ao mais antigo, com datas em <time>. */
export function Timeline() {
  return (
    <ol className={styles.list}>
      {timeline.map((item) => (
        <li key={item.title} className={styles.item}>
          <div className={styles.when}>
            {"period" in item ? <Period {...item.period} /> : <Period before={[item.label]} />}
          </div>
          <div className={styles.texts}>
            <h3 className={styles.title}>{item.title}</h3>
            {"detail" in item ? <p className={styles.detail}>{item.detail}</p> : null}
          </div>
        </li>
      ))}
    </ol>
  );
}
