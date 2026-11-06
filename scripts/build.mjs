import { cp, mkdir, rm } from "node:fs/promises";
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
console.log("Sitio preparado en dist/. Solo contiene archivos públicos.");
