import { readFile, mkdir, stat, rename } from "node:fs/promises";
import { spawn } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const windows = process.platform === "win32";
const ffmpeg =
  process.env.FFMPEG_PATH ||
  (windows
    ? path.join(
        root,
        ".tools/node_modules/@ffmpeg-installer/win32-x64/ffmpeg.exe",
      )
    : "ffmpeg");
const originals = path.join(root, "media/originales");
const manifest = JSON.parse(
  await readFile(path.join(root, "scripts/media-manifest.json"), "utf8"),
);
await mkdir(path.join(root, "assets/videos"), { recursive: true });
await mkdir(path.join(root, "assets/posters"), { recursive: true });
await mkdir(path.join(root, "assets/images"), { recursive: true });

function run(args) {
  return new Promise((resolve, reject) => {
    const process = spawn(
      ffmpeg,
      ["-hide_banner", "-loglevel", "error", "-y", ...args],
      { cwd: root, windowsHide: true },
    );
    let errors = "";
    process.stderr.on("data", (chunk) => {
      errors += chunk.toString();
    });
    process.on("error", reject);
    process.on("close", (code) =>
      code === 0
        ? resolve()
        : reject(new Error(errors || `FFmpeg terminó con código ${code}`)),
    );
  });
}

async function prepare(entry) {
  const input = path.join(originals, entry.source);
  const video = path.join(root, `assets/videos/${entry.id}.mp4`);
  const temporary = path.join(root, `assets/videos/${entry.id}.tmp.mp4`);
  const poster = path.join(root, `assets/posters/${entry.id}.jpg`);
  const scale =
    "scale=w='if(gte(iw,ih),min(1280,iw),-2)':h='if(gte(iw,ih),-2,min(1280,ih))'";
  await run([
    "-i",
    input,
    "-map",
    "0:v:0",
    "-map",
    "0:a:0?",
    "-vf",
    scale,
    "-c:v",
    "libx264",
    "-preset",
    "medium",
    "-crf",
    "23",
    "-maxrate",
    "2300k",
    "-bufsize",
    "4600k",
    "-threads",
    "4",
    "-pix_fmt",
    "yuv420p",
    "-c:a",
    "aac",
    "-b:a",
    "128k",
    "-movflags",
    "+faststart",
    "-map_metadata",
    "-1",
    temporary,
  ]);
  const size = (await stat(temporary)).size;
  if (size > 24 * 1024 * 1024)
    throw new Error(
      `${entry.id} supera 24 MiB. Ajustar compresión antes de publicarlo.`,
    );
  await rename(temporary, video);
  await run([
    "-ss",
    String(entry.posterAt),
    "-i",
    input,
    "-frames:v",
    "1",
    "-vf",
    scale,
    "-q:v",
    "2",
    poster,
  ]);
  console.log(`${entry.id}: ${(size / 1024 / 1024).toFixed(2)} MiB`);
}

// Dos trabajos simultáneos; los originales nunca se sobrescriben.
const queue = [...manifest];
await Promise.all(
  Array.from({ length: 2 }, async () => {
    while (queue.length) await prepare(queue.shift());
  }),
);
await run([
  "-i",
  path.join(originals, "Jhulieth.jpeg"),
  "-vf",
  "scale=768:-2",
  "-c:v",
  "libwebp",
  "-quality",
  "87",
  path.join(root, "assets/images/jhulieth.webp"),
]);
console.log(
  "Medios web preparados. Originales conservados en media/originales/.",
);
