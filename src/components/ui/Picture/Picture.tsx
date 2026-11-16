import styles from "./Picture.module.css";

interface PictureProps {
  /** base do arquivo em /images: <name>-<largura>.(avif|webp) */
  name: string;
  widths: readonly number[];
  width: number;
  height: number;
  alt: string;
  /** atributo sizes do srcset */
  sizes: string;
  /** imagem da primeira tela: carrega antes e sem lazy */
  priority?: boolean;
  fit?: "cover" | "contain";
  /** onde o recorte se apoia quando a imagem não cabe inteira */
  focus?: "center" | "top";
}

const srcSet = (name: string, widths: readonly number[], ext: string) =>
  widths.map((w) => `/images/${name}-${w}.${ext} ${w}w`).join(", ");

/** Imagem responsiva em AVIF com WebP de reserva. Preenche o pai (que define o tamanho). */
export function Picture({
  name,
  widths,
  width,
  height,
  alt,
  sizes,
  priority = false,
  fit = "cover",
  focus = "center",
}: PictureProps) {
  const largest = widths[widths.length - 1] ?? width;
  return (
    <picture className={styles.picture}>
      <source type="image/avif" srcSet={srcSet(name, widths, "avif")} sizes={sizes} />
      <img
        src={`/images/${name}-${largest}.webp`}
        srcSet={srcSet(name, widths, "webp")}
        sizes={sizes}
        width={width}
        height={height}
        alt={alt}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : "auto"}
        decoding="async"
        className={`${styles.img} ${styles[fit]} ${focus === "top" ? styles.top : ""}`}
      />
    </picture>
  );
}
