import http from "node:http";
import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const built = process.argv.includes("--dist");
const directory = path.join(root, built ? "dist" : ".");
const prefix = "/PORTAFOLIO-WEB";
const port = Number(process.env.PORT || 4173);
const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".jpg": "image/jpeg",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".mp4": "video/mp4",
  ".xml": "application/xml; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
};

const server = http.createServer(async (request, response) => {
  try {
    if (!["GET", "HEAD"].includes(request.method)) {
      response.writeHead(405, { Allow: "GET, HEAD" }).end();
      return;
    }
    let pathname = decodeURIComponent(
      new URL(request.url, "http://localhost").pathname,
    );
    if (pathname === prefix) {
      response.writeHead(302, { Location: `${prefix}/` }).end();
      return;
    }
    if (pathname.startsWith(`${prefix}/`))
      pathname = pathname.slice(prefix.length);
    const relative =
      pathname === "/" ? "index.html" : pathname.replace(/^\/+/, "");
    if (
      !/^(index\.html|assets\/|robots\.txt|sitemap\.xml)/.test(relative) ||
      relative.includes("\\")
    ) {
      response.writeHead(404).end("No encontrado");
      return;
    }
    const absolute = path.resolve(directory, relative);
    if (!absolute.startsWith(directory + path.sep)) {
      response.writeHead(403).end();
      return;
    }
    const file = await stat(absolute);
    if (!file.isFile()) {
      response.writeHead(404).end();
      return;
    }
    const headers = {
      "Content-Type":
        types[path.extname(absolute)] || "application/octet-stream",
      "Cache-Control": "no-cache",
      "X-Content-Type-Options": "nosniff",
      "Accept-Ranges": "bytes",
    };
    let start = 0;
    let end = file.size - 1;
    let status = 200;
    const range = request.headers.range;
    if (range) {
      const match = /^bytes=(\d*)-(\d*)$/.exec(range);
      if (!match || (!match[1] && !match[2])) {
        response
          .writeHead(416, { "Content-Range": `bytes */${file.size}` })
          .end();
        return;
      }
      if (match[1]) {
        start = Number(match[1]);
        end = match[2] ? Math.min(Number(match[2]), end) : end;
      } else start = Math.max(0, file.size - Number(match[2]));
      if (start > end || start >= file.size) {
        response
          .writeHead(416, { "Content-Range": `bytes */${file.size}` })
          .end();
        return;
      }
      status = 206;
      headers["Content-Range"] = `bytes ${start}-${end}/${file.size}`;
    }
    headers["Content-Length"] = end - start + 1;
    response.writeHead(status, headers);
    if (request.method === "HEAD") {
      response.end();
      return;
    }
    const stream = createReadStream(absolute, { start, end });
    stream.on("error", () => response.destroy());
    response.on("close", () => stream.destroy());
    stream.pipe(response);
  } catch {
    if (!response.headersSent) response.writeHead(404);
    response.end("No encontrado");
  }
});
server.listen(port, "127.0.0.1", () => {
  console.log(`Nabi Films: http://127.0.0.1:${port}${prefix}/`);
  console.log(`Vista ${built ? "dist" : "fuente"}. Ctrl+C para detener.`);
});
