import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

// O eslint-config-next já registra o plugin jsx-a11y, mas liga só algumas regras.
// Aqui ligamos o conjunto "strict" inteiro, reaproveitando o mesmo plugin.
const a11yPlugin = nextVitals.find((c) => c.plugins?.["jsx-a11y"])?.plugins["jsx-a11y"];
if (!a11yPlugin) throw new Error("plugin jsx-a11y não encontrado no eslint-config-next");

export default defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    files: ["**/*.{ts,tsx}"],
    rules: {
      ...a11yPlugin.flatConfigs.strict.rules,
      "@typescript-eslint/consistent-type-imports": "error",
      "@typescript-eslint/no-explicit-any": "error",
      "no-console": ["error", { allow: ["warn", "error"] }],
      "react/jsx-no-useless-fragment": "error",
      "react/no-danger": "error",
      // Exportação estática: o next/image não otimiza nada aqui (images.unoptimized).
      // As imagens já saem otimizadas do scripts/optimize-images.ts, em <picture>.
      "@next/next/no-img-element": "off",
    },
  },
  {
    files: ["scripts/**/*", "tests/**/*", "*.config.*"],
    rules: { "no-console": "off" },
  },
  globalIgnores([
    ".next/**",
    "out/**",
    "node_modules/**",
    "next-env.d.ts",
    "test-results/**",
    "playwright-report/**",
    ".lighthouseci/**",
  ]),
]);
