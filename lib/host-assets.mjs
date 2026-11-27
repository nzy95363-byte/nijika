/** 静态音频资源：精确路由 + 字节范围（支持播放器拖动进度）+ HTTP 缓存。 */
import { createReadStream, statSync } from "node:fs";
import { pipeline } from "node:stream/promises";

const audioRoot = new URL("../assets/audio/", import.meta.url);
export const ASSET_BASE = "/dsh-nijika/assets/";

// 歌单：新增歌曲时在这里加一行即可（file 必须是 assets/audio/ 下的文件名）
export const TRACKS = Object.freeze([
  { id: "track-01", file: "track-01.mp3", title: "结束乐队 · Track 01" },
  { id: "track-02", file: "track-02.mp3", title: "结束乐队 · Track 02" },
  { id: "track-03", file: "track-03.mp3", title: "结束乐队 · Track 03" },
  { id: "track-04", file: "track-04.mp3", title: "结束乐队 · Track 04" },
  { id: "track-05", file: "track-05.mp3", title: "结束乐队 · Track 05" },
]);

export function assetRoutes() {
  return TRACKS.map((track) => {
    const path = ASSET_BASE + "audio/" + track.file;
    const full = new URL(track.file, audioRoot);
    let bytes = 0;
    try { bytes = statSync(full).size; } catch { /* 文件缺失时仍注册，请求返回 404 */ }
    return { path, full, bytes, track };
  });
}

/** 歌单 JSON：客户端据此渲染播放列表；新增歌曲只需改上面的 TRACKS。 */
export function playlistHandler(req, res) {
  const list = TRACKS.map((t) => ({ id: t.id, title: t.title, url: ASSET_BASE + "audio/" + t.file }));
  res.writeHead(200, { "content-type": "application/json; charset=utf-8", "cache-control": "no-cache" });
  res.end(JSON.stringify(list));
}

export async function serveAsset(req, res, entry) {
  const headers = {
    "content-type": "audio/mpeg",
    "cache-control": "public, max-age=86400",
    "accept-ranges": "bytes",
    "x-content-type-options": "nosniff",
  };
  if (!entry.bytes) { res.writeHead(404, headers); res.end(); return; }
  if (!["GET", "HEAD"].includes(req.method)) {
    res.writeHead(405, { ...headers, allow: "GET, HEAD" }); res.end(); return;
  }
  const etag = '"' + entry.track.id + '-' + entry.bytes + '"';
  headers.etag = etag;
  if (req.headers["if-none-match"]?.split(/\s*,\s*/).some((v) => v === etag || v === "W/" + etag || v === "*")) {
    res.writeHead(304, headers); res.end(); return;
  }
  let start = 0, end = entry.bytes - 1, status = 200;
  const range = req.headers.range;
  if (range && (!req.headers["if-range"] || req.headers["if-range"] === etag)) {
    const match = /^bytes=(\d*)-(\d*)$/.exec(range);
    if (match && (match[1] || match[2])) {
      start = match[1] ? Number(match[1]) : Math.max(0, entry.bytes - Number(match[2]));
      end = match[1] && match[2] ? Math.min(end, Number(match[2])) : end;
    }
    if (!match || !(match[1] || match[2]) || !Number.isSafeInteger(start) || !Number.isSafeInteger(end) || start > end || start >= entry.bytes) {
      res.writeHead(416, { ...headers, "content-range": "bytes */" + entry.bytes, "content-length": 0 }); res.end(); return;
    }
    status = 206;
    headers["content-range"] = `bytes ${start}-${end}/${entry.bytes}`;
  }
  headers["content-length"] = end - start + 1;
  res.writeHead(status, headers);
  if (req.method === "HEAD") { res.end(); return; }
  try { await pipeline(createReadStream(entry.full, { start, end }), res); }
  catch (error) { if (!res.destroyed) res.destroy(error); }
}
