import assert from "node:assert/strict";
import { access, readFile, readdir, stat } from "node:fs/promises";
import { execFileSync } from "node:child_process";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const html = await readFile(path.join(root, "index.html"), "utf8");
const errors = [];
const validate = (condition, message) => {
  if (!condition) errors.push(message);
};
async function fileExists(relative) {
  try {
    await access(path.join(root, relative));
    return true;
  } catch {
    return false;
  }
}
for (const match of html.matchAll(/\b(?:src|href)="([^"#]+)"/g)) {
  const url = match[1];
  if (/^(?:https?:|mailto:|tel:|data:)/i.test(url)) continue;
  validate(
    !url.startsWith("/"),
    `Ruta absoluta incompatible con Pages de proyecto: ${url}`,
  );
  validate(
    await fileExists(url.split(/[?#]/)[0]),
    `Enlace local inexistente: ${url}`,
  );
}
const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]);
validate(
  new Set(ids).size === ids.length,
  "Hay identificadores HTML repetidos.",
);
for (const match of html.matchAll(/href="#([^"]+)"/g))
  validate(ids.includes(match[1]), `Ancla sin destino: ${match[1]}`);

const data = await readFile(path.join(root, "assets/js/data.js"), "utf8");
const context = { window: {} };
vm.runInNewContext(data, context);
const projects = context.window.NABI_PROJECTS;
validate(
  Array.isArray(projects) && projects.length === 10,
  "El catálogo debe incluir los diez videos entregados.",
);
validate(
  new Set(projects.map((project) => project.id)).size === projects.length,
  "Hay proyectos repetidos.",
);
const manifest = JSON.parse(
  await readFile(path.join(root, "scripts/media-manifest.json"), "utf8"),
);
const categoryTotals = {};
let mediaSize = 0;
for (const project of projects) {
  validate(
    /^[a-z0-9-]+$/.test(project.id),
    `Nombre de archivo no portable: ${project.id}`,
  );
  validate(
    manifest.some((entry) => entry.id === project.id),
    `Falta el origen de ${project.id}`,
  );
  validate(
    project.title && project.description && project.alt && project.focus,
    `Ficha incompleta: ${project.id}`,
  );
  for (const relative of [
    `assets/videos/${project.id}.mp4`,
    `assets/posters/${project.id}.jpg`,
  ]) {
    if (!(await fileExists(relative))) {
      errors.push(`Falta ${relative}`);
      continue;
    }
    const { size } = await stat(path.join(root, relative));
    validate(size > 0, `Archivo vacío: ${relative}`);
    validate(
      size < 24 * 1024 * 1024,
      `El archivo supera el límite preventivo de 24 MiB: ${relative}`,
    );
    mediaSize += size;
  }
  categoryTotals[project.category] =
    (categoryTotals[project.category] || 0) + 1;
}
for (const [category, total] of Object.entries(categoryTotals)) {
  validate(
    new RegExp(
      `data-filter="${category}"[^>]*>[^<]*<span>0?${total}</span>`,
    ).test(html),
    `Contador incorrecto para ${category}`,
  );
}
for (const file of ["assets/js/app.js", "assets/js/data.js"])
  new vm.Script(await readFile(path.join(root, file), "utf8"), {
    filename: file,
  });

// Evitar que git add . incluya originales o binarios demasiado grandes.
const candidates = execFileSync(
  "git",
  ["ls-files", "--cached", "--others", "--exclude-standard", "-z"],
  { cwd: root, encoding: "utf8" },
)
  .split("\0")
  .filter(Boolean);
for (const relative of candidates) {
  validate(
    !relative.startsWith("media/originales/"),
    `Original incluido en Git: ${relative}`,
  );
  if (await fileExists(relative))
    validate(
      (await stat(path.join(root, relative))).size < 100 * 1024 * 1024,
      `Archivo incompatible con GitHub: ${relative}`,
    );
}
for (const filename of await readdir(path.join(root, "assets/videos")))
  validate(
    !filename.endsWith(".tmp.mp4"),
    `Conversión incompleta: ${filename}`,
  );
validate(
  html.includes("https://wa.me/59175541660"),
  "Falta el WhatsApp confirmado.",
);
validate(
  html.includes("mailto:julieth3357t@gmail.com"),
  "Falta el correo confirmado.",
);
validate(
  html.includes("https://www.instagram.com/nabi__films/"),
  "Falta el Instagram confirmado.",
);
assert.equal(errors.length, 0, errors.join("\n"));
console.log(
  `OK: ${projects.length} proyectos; enlaces, anclas, categorías, JavaScript y límites de Git verificados.`,
);
console.log(
  `Videos y portadas: ${(mediaSize / 1024 / 1024).toFixed(1)} MiB. Los originales quedan fuera de Git.`,
);
