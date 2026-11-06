import { cp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const output = path.resolve(root, "dist");
if (path.dirname(output) !== root || path.basename(output) !== "dist")
  throw new Error("Directorio de salida no válido.");
// Solamente se reemplaza dist/, nunca los archivos fuente ni los originales.
await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });
for (const name of [
  "index.html",
  "assets",
  ".nojekyll",
  "robots.txt",
  "sitemap.xml",
]) {
  await cp(path.join(root, name), path.join(output, name), { recursive: true });
}

// GitHub Pages guarda los archivos en caché unos minutos. Cada publicación pide
// el CSS y el JavaScript con una huella de su contenido (?v=…), para que nunca
// se mezcle un HTML nuevo con estilos o scripts antiguos.
const page = path.join(output, "index.html");
let html = await readFile(page, "utf8");
const assets = [...html.matchAll(/(?:href|src)="(\.\/assets\/(?:css|js|vendor)\/[^"?]+\.(?:css|js))"/g)];
for (const [, url] of new Set(assets.map((match) => match))) {
  const content = await readFile(path.join(root, url));
  const version = createHash("sha256").update(content).digest("hex").slice(0, 10);
  html = html.replaceAll(`"${url}"`, `"${url}?v=${version}"`);
}
await writeFile(page, html);
console.log(
  `Sitio preparado en dist/ (${assets.length} archivos CSS/JS con huella de versión). Solo contiene archivos públicos.`,
);
