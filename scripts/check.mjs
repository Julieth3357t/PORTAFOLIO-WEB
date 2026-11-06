import assert from "node:assert/strict";
import { readFile, readdir, stat } from "node:fs/promises";
import { execFileSync } from "node:child_process";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const html = await readFile(path.join(root, "index.html"), "utf8");
const css = await readFile(path.join(root, "assets/css/styles.css"), "utf8");
const errors = [];
const validate = (condition, message) => {
  if (!condition) errors.push(message);
};
const textOf = (markup) =>
  markup
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

// GitHub Pages distingue mayúsculas y minúsculas; Windows no. Se compara cada
// segmento de la ruta con el nombre real del archivo en disco.
async function existsExactly(relative) {
  let current = root;
  for (const segment of relative.split("/").filter(Boolean)) {
    if (segment === ".") continue;
    let names;
    try {
      names = await readdir(current);
    } catch {
      return false;
    }
    if (!names.includes(segment)) return false;
    current = path.join(current, segment);
  }
  return true;
}
async function checkLocalUrl(url, from) {
  if (/^(?:https?:|mailto:|tel:|data:|#)/i.test(url)) return;
  validate(
    !url.startsWith("/"),
    `Ruta absoluta incompatible con GitHub Pages de proyecto: ${url}`,
  );
  const clean = decodeURI(url.split(/[?#]/)[0]);
  const relative = path.posix.normalize(path.posix.join(from, clean));
  validate(
    await existsExactly(relative),
    `Ruta local inexistente o con mayúsculas distintas: ${url}`,
  );
}

for (const match of html.matchAll(/\b(?:src|href)="([^"]+)"/g))
  await checkLocalUrl(match[1], ".");
for (const match of css.matchAll(/url\(["']?([^"')]+)["']?\)/g))
  await checkLocalUrl(match[1], "assets/css");

const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]);
validate(
  new Set(ids).size === ids.length,
  "Hay identificadores HTML repetidos.",
);
for (const match of html.matchAll(/href="#([^"]+)"/g))
  validate(ids.includes(match[1]), `Ancla sin destino: ${match[1]}`);
validate(
  ids.includes("inicio"),
  "Falta la sección #inicio usada en la URL publicada.",
);

// Hero: título, nombre y biografía exactos.
const hero = html.match(/<section class="hero"[\s\S]*?<\/section>/)?.[0] || "";
const heroTitle = textOf(hero.match(/<h1[\s\S]*?<\/h1>/)?.[0] || "");
validate(
  heroTitle === "Portafolio Julieth / Nicol Moya Quispe",
  `El encabezado debe leer «Portafolio Julieth / Nicol Moya Quispe» (dice «${heroTitle}»).`,
);
const bio =
  "Soy estudiante de diseño gráfico con habilidades en producción audiovisual. Me caracterizo por ser proactiva, creativa y con iniciativa para liderar proyectos. No importa si estoy en clase o trabajando en mi espacio personal, siempre estoy creando algo. Me apasiona diseñar, explorar ideas, contar historias, escribirlas y transformarlas en videos capaces de transmitir emociones, conectar con las personas y generar empatía.";
validate(textOf(hero).includes(bio), "La biografía del hero no coincide.");
for (const [label, href] of [
  ["WhatsApp", "https://wa.me/59175541660"],
  ["Instagram", "https://www.instagram.com/nabi__films/"],
  ["correo", "mailto:julieth3357t@gmail.com"],
])
  validate(hero.includes(href), `Falta el acceso rápido de ${label} en el hero.`);

// Habilidades técnicas con los niveles indicados.
for (const [skill, level] of [
  ["CapCut Pro", 5],
  ["Figma", 4],
  ["Photoshop", 3],
  ["Illustrator", 3],
]) {
  const item = html.match(
    new RegExp(`<li[^>]*data-skill="${skill}"[^>]*>[\\s\\S]*?</li>`),
  )?.[0];
  if (!item) {
    errors.push(`Falta la habilidad ${skill}.`);
    continue;
  }
  validate(
    item.includes(`data-level="${level}"`) &&
      (item.match(/<i class="on"/g) || []).length === level &&
      (item.match(/<i\b/g) || []).length === 5 &&
      item.includes(`Nivel ${level}</strong> de 5`),
    `Nivel incorrecto para ${skill}: debe ser ${level} de 5.`,
  );
}

// Catálogo y categorías.
const data = await readFile(path.join(root, "assets/js/data.js"), "utf8");
const context = { window: {} };
vm.runInNewContext(data, context);
const projects = context.window.PORTFOLIO_PROJECTS;
const categories = context.window.PORTFOLIO_CATEGORIES;
validate(
  JSON.stringify(categories.map((category) => category.label)) ===
    JSON.stringify(["Videos de Boda", "Videos de Proyectos", "Proyectos Universitarios"]),
  "Las categorías deben ser exactamente: Videos de Boda, Videos de Proyectos y Proyectos Universitarios.",
);
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
const totals = { todos: projects.length };
let mediaSize = 0;
for (const project of projects) {
  validate(
    /^[a-z0-9-]+$/.test(project.id),
    `Nombre de archivo no portable: ${project.id}`,
  );
  validate(
    categories.some((category) => category.id === project.category),
    `Categoría desconocida en ${project.id}: ${project.category}`,
  );
  validate(
    ["vertical", "horizontal"].includes(project.orientation),
    `Orientación no válida en ${project.id}`,
  );
  validate(
    manifest.some((entry) => entry.id === project.id),
    `Falta el origen de ${project.id}`,
  );
  validate(
    project.title &&
      project.subtitle &&
      project.description &&
      project.alt &&
      project.focus &&
      project.seconds > 0,
    `Ficha incompleta: ${project.id}`,
  );
  for (const relative of [
    `assets/videos/${project.id}.mp4`,
    `assets/posters/${project.id}.jpg`,
  ]) {
    if (!(await existsExactly(relative))) {
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
  totals[project.category] = (totals[project.category] || 0) + 1;
}
for (const filter of ["todos", ...categories.map((category) => category.id)]) {
  const count = html.match(
    new RegExp(
      `data-filter="${filter}"[\\s\\S]*?<span class="tab-count">(\\d+)</span>`,
    ),
  )?.[1];
  validate(
    Number(count) === (totals[filter] || 0),
    `Contador incorrecto en la pestaña ${filter}: ${count} en lugar de ${totals[filter] || 0}.`,
  );
}
for (const category of categories)
  validate(
    html.includes(`${category.label} <span class="tab-count">`),
    `Falta la pestaña «${category.label}».`,
  );
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
  try {
    validate(
      (await stat(path.join(root, relative))).size < 100 * 1024 * 1024,
      `Archivo incompatible con GitHub: ${relative}`,
    );
  } catch {
    // Archivo eliminado en el árbol de trabajo.
  }
}
for (const filename of await readdir(path.join(root, "assets/videos")))
  validate(
    !filename.endsWith(".tmp.mp4"),
    `Conversión incompleta: ${filename}`,
  );

// Contacto: WhatsApp (Bolivia +591), Instagram con doble guion bajo y correo.
validate(
  html.includes("https://wa.me/59175541660"),
  "Falta el enlace de WhatsApp.",
);
validate(
  html.includes("mailto:julieth3357t@gmail.com"),
  "Falta el enlace de correo.",
);
validate(
  html.includes("https://www.instagram.com/nabi__films/"),
  "Falta el Instagram @nabi__films.",
);
validate(
  !/instagram\.com\/nabi_films/.test(html),
  "El Instagram con un solo guion bajo (@nabi_films) es otra cuenta; usar @nabi__films.",
);
assert.equal(errors.length, 0, errors.join("\n"));
console.log(
  `OK: ${projects.length} proyectos en ${categories.length} categorías; hero, habilidades, contacto, rutas y JavaScript verificados.`,
);
console.log(
  `Videos y portadas: ${(mediaSize / 1024 / 1024).toFixed(1)} MiB. Los originales quedan fuera de Git.`,
);
