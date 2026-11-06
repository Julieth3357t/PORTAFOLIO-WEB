import { readdir, mkdir, writeFile } from "node:fs/promises";
import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const ffmpeg = path.join(
  root,
  ".tools/node_modules/@ffmpeg-installer/win32-x64/ffmpeg.exe",
);
const ffprobe = path.join(
  root,
  ".tools/node_modules/ffprobe-static/bin/win32/x64/ffprobe.exe",
);
const source = path.join(root, "media/originales");
const target = path.join(root, ".tools/analysis");
await mkdir(target, { recursive: true });
const report = [];

for (const filename of (await readdir(source)).filter((name) =>
  name.endsWith(".mp4"),
)) {
  const input = path.join(source, filename);
  const probe = spawnSync(
    ffprobe,
    ["-v", "error", "-show_format", "-show_streams", "-of", "json", input],
    { encoding: "utf8" },
  );
  if (probe.status !== 0) throw new Error(probe.stderr || probe.error?.message);
  const metadata = JSON.parse(probe.stdout);
  const video = metadata.streams.find(
    (stream) => stream.codec_type === "video",
  );
  const duration = Number(metadata.format.duration);
  const entry = {
    filename,
    duration,
    bytes: Number(metadata.format.size),
    width: video.width,
    height: video.height,
    fps: video.avg_frame_rate,
    audio: metadata.streams.some((stream) => stream.codec_type === "audio"),
  };
  report.push(entry);
  const sheet = path.join(target, `${filename}.jpg`);
  const filter = `fps=${12 / duration},scale=360:224:force_original_aspect_ratio=decrease,pad=360:256:(ow-iw)/2:(oh-ih)/2:color=0x15151b,drawtext=fontfile=.tools/arial.ttf:text='%{pts\\:hms}':fontsize=15:fontcolor=white:x=10:y=h-24,tile=4x3`;
  const result = spawnSync(
    ffmpeg,
    [
      "-hide_banner",
      "-loglevel",
      "error",
      "-y",
      "-i",
      input,
      "-vf",
      filter,
      "-frames:v",
      "1",
      "-q:v",
      "3",
      sheet,
    ],
    { cwd: root, encoding: "utf8" },
  );
  if (result.status !== 0)
    throw new Error(result.stderr || result.error?.message);
  console.log(JSON.stringify(entry));
}
await writeFile(
  path.join(target, "metadata.json"),
  JSON.stringify(report, null, 2) + "\n",
);
