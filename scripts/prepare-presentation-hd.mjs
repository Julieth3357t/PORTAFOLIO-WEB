// Prepara una copia de alta calidad solo para la presentación del inicio.
// Uso: node scripts/prepare-presentation-hd.mjs
import { mkdir, rename, stat } from "node:fs/promises";
import { spawn } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const ffmpeg =
  process.env.FFMPEG_PATH ||
  (process.platform === "win32"
    ? path.join(root, ".tools/node_modules/@ffmpeg-installer/win32-x64/ffmpeg.exe")
    : "ffmpeg");
const original = path.join(root, "media/originales/Portafolio 2026.mp4");
const temporary = path.join(root, ".tools/presentacion-2026-hd.tmp.mp4");
const output = path.join(root, "assets/videos/presentacion-2026-hd.mp4");
const poster = path.join(root, "assets/posters/presentacion-2026-hd.jpg");

function run(args) {
  return new Promise((resolve, reject) => {
    const process = spawn(ffmpeg, ["-hide_banner", "-loglevel", "error", "-y", ...args], {
      cwd: root,
      windowsHide: true,
    });
    let errors = "";
    process.stderr.on("data", (chunk) => (errors += chunk.toString()));
    process.on("error", reject);
    process.on("close", (code) =>
      code === 0 ? resolve() : reject(new Error(errors || `FFmpeg terminó con código ${code}`)),
    );
  });
}

await mkdir(path.join(root, ".tools"), { recursive: true });
await mkdir(path.dirname(output), { recursive: true });
await mkdir(path.dirname(poster), { recursive: true });
await run([
  "-i", original,
  "-map", "0:v:0", "-map", "0:a:0?",
  "-c:v", "libx264", "-preset", "slow", "-crf", "19",
  "-maxrate", "3400k", "-bufsize", "6800k", "-pix_fmt", "yuv420p",
  "-profile:v", "high", "-level:v", "4.1", "-refs", "4",
  "-color_primaries", "bt709", "-color_trc", "bt709", "-colorspace", "bt709",
  "-c:a", "aac", "-b:a", "160k",
  "-movflags", "+faststart", "-map_metadata", "-1", temporary,
]);
const { size } = await stat(temporary);
if (size >= 24 * 1024 * 1024) {
  throw new Error("La presentación supera 24 MiB; se conserva el original y se debe ajustar la compresión.");
}
await rename(temporary, output);
await run(["-ss", "2.8", "-i", original, "-frames:v", "1", "-q:v", "2", "-map_metadata", "-1", poster]);
console.log(`Presentación HD: ${(size / 1024 / 1024).toFixed(2)} MiB. El original se conserva.`);
