import styles from "./NsxCruise.module.css";

/**
 * NSX em movimento no cartão "Fora do código" (só no desktop, decorativo):
 * as faixas da pista andam para a esquerda e o carro balança 1 px. Parado com movimento reduzido.
 */
export function NsxCruise() {
  return (
    <div className={styles.scene} aria-hidden="true">
      <img src="/images/nsx-fechado.svg" alt="" className={styles.car} />
      <span className={styles.road} />
      <span className={styles.lanes} />
    </div>
  );
}
