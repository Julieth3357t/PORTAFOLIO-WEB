// Genera el reel de fondo del inicio: tres pantallas verticales con cortes
// escalonados, en rojo y negro, sin audio y en bucle de 10 segundos.
// Usa solo videos ya publicados; excluye la pieza sensible y el montaje con
// fragmentos de terceros. Uso: node scripts/make-reel.mjs
import { spawn } from "node:child_process";
import { stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const ffmpeg =
  process.env.FFMPEG_PATH ||
  (process.platform === "win32"
    ? path.join(root, ".tools/node_modules/@ffmpeg-installer/win32-x64/ffmpeg.exe")
    : "ffmpeg");

// [video, segundo de inicio, duración]. Cada columna suma 10 s; los cortes no coinciden.
const columns = [
  [
    ["rosa-andrea", 12, 2.5],
    ["cosmetica", 9, 2.5],
    ["sofia-equipo", 30, 2.5],
    ["cambia", 14, 2.5],
  ],
  [
    ["cosmetica", 24, 1.7],
    ["rosa-andrea", 44, 2.5],
    ["expocruz", 15, 2.5],
    ["sofia-voces", 40, 2.5],
    ["cambia", 26, 0.8],
  ],
  [
    ["cabana-mucarzel", 2, 0.9],
    ["sofia-logistica", 20, 2.5],
    ["rosa-andrea", 27, 2.5],
    ["cosmetica", 30, 2.5],
    ["cabana-mucarzel", 14, 1.6],
  ],
];
const tile = { width: 405, height: 720, gap: 32 };

const inputs = [];
const filters = [];
const tiles = [];
let index = 0;
columns.forEach((clips, column) => {
  const labels = clips.map(([id, start, duration]) => {
    inputs.push("-ss", String(start), "-t", String(duration), "-i", `assets/videos/${id}.mp4`);
    const label = `c${index}`;
    filters.push(
      `[${index}:v]scale=${tile.width}:${tile.height}:force_original_aspect_ratio=increase,` +
        `crop=${tile.width}:${tile.height},setsar=1,fps=24,setpts=PTS-STARTPTS[${label}]`,
    );
    index += 1;
    return `[${label}]`;
  });
  const out = `t${column}`;
  filters.push(`${labels.join("")}concat=n=${labels.length}:v=1:a=0[${out}]`);
  tiles.push(out);
});
filters.push(
  `[${tiles[0]}]pad=${tile.width + tile.gap}:${tile.height}:0:0:black[p0]`,
  `[${tiles[1]}]pad=${tile.width + tile.gap}:${tile.height}:0:0:black[p1]`,
  // Rojo y negro: blanco y negro con las luces llevadas al rojo.
  `[p0][p1][${tiles[2]}]hstack=inputs=3,pad=1280:720:0:0:black,hue=s=0,` +
    "colorchannelmixer=rr=0.82:gg=0.1:bb=0.12,eq=contrast=1.28:brightness=-0.05,format=yuv420p[reel]",
);

function run(args) {
  return new Promise((resolve, reject) => {
    const child = spawn(ffmpeg, ["-hide_banner", "-loglevel", "error", "-y", ...args], {
      cwd: root,
      windowsHide: true,
    });
    let errors = "";
    child.stderr.on("data", (chunk) => (errors += chunk));
    child.on("error", reject);
    child.on("close", (code) => (code === 0 ? resolve() : reject(new Error(errors))));
  });
}

await run([
  ...inputs,
  "-filter_complex",
  filters.join(";"),
  "-map",
  "[reel]",
  "-an",
  "-r",
  "24",
  "-c:v",
  "libx264",
  "-preset",
  "slow",
  "-crf",
  "30",
  "-movflags",
  "+faststart",
  "assets/videos/reel.mp4",
]);
await run(["-ss", "1.2", "-i", "assets/videos/reel.mp4", "-frames:v", "1", "-q:v", "5", "assets/images/reel-poster.jpg"]);
const { size } = await stat(path.join(root, "assets/videos/reel.mp4"));
console.log(`Reel listo: assets/videos/reel.mp4 (${(size / 1024 / 1024).toFixed(2)} MiB) y su portada.`);
