// Gera as imagens do site em AVIF e WebP, em várias larguras, sem metadados (EXIF/GPS).
// As fontes (foto original, capas) ficam fora do repositório público; o resultado vai para
// public/images/ e é versionado.
// Uso: npx tsx scripts/optimize-images.ts [--src ../design]
import { mkdirSync } from "node:fs";
import { join } from "node:path";
import { parseArgs } from "node:util";

import sharp from "sharp";

const { values } = parseArgs({ options: { src: { type: "string", default: "../design" } } });
const OUT = "public/images";

interface Job {
  name: string;
  file: string;
  widths: number[];
  /** Recorte (em pixels da imagem já girada) antes de redimensionar. */
  crop?: { left: number; top: number; width: number; height: number };
}

const jobs: Job[] = [
  // Foto do iPhone (1536×2048), recortada no formato do Figma (500×580).
  {
    name: "foto",
    file: "foto/IMG_8543.JPEG",
    widths: [400, 700, 1000],
    crop: { left: 165, top: 280, width: 1150, height: 1334 },
  },
  { name: "rinha", file: "rinha/capa.png", widths: [600, 1200, 1800] },
  { name: "bichedin", file: "bichedin/capa.png", widths: [600, 1200] },
  // Telas do BichedIn (1280×800, capturadas com os bichos de exemplo).
  ...[1, 2, 3, 4].map((n) => ({
    name: `bichedin-tela-${n}`,
    file: `bichedin/telas/${["1-inicio", "2-galeria", "3-curriculo", "4-criar"][n - 1]}.png`,
    widths: [600, 1200],
  })),
];

mkdirSync(OUT, { recursive: true });
for (const job of jobs) {
  for (const width of job.widths) {
    // rotate() aplica a orientação do EXIF; sem withMetadata(), o sharp não copia metadados.
    let image = sharp(join(values.src, job.file)).rotate();
    if (job.crop) image = image.extract(job.crop);
    const resized = image.resize({ width, withoutEnlargement: true });
    const avif = await resized
      .clone()
      .avif({ quality: 55, effort: 6 })
      .toFile(join(OUT, `${job.name}-${width}.avif`));
    await resized
      .clone()
      .webp({ quality: 78 })
      .toFile(join(OUT, `${job.name}-${width}.webp`));
    console.log(
      `${job.name}-${width}: ${avif.width}×${avif.height}, avif ${Math.round(avif.size / 1024)} KB`,
    );
  }
}
