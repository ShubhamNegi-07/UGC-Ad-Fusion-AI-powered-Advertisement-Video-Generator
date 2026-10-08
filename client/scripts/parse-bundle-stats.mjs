import { readFileSync } from "fs";

const file = process.argv[2] || "bundle-stats.html";
const html = readFileSync(file, "utf8");
const marker = "const data = ";
const start = html.indexOf(marker);
if (start < 0) throw new Error(`no data in ${file}`);
const jsonStart = start + marker.length;
let depth = 0;
let end = jsonStart;
for (; end < html.length; end++) {
  const ch = html[end];
  if (ch === "{") depth++;
  if (ch === "}") {
    depth--;
    if (depth === 0) {
      end++;
      break;
    }
  }
}
const data = JSON.parse(html.slice(jsonStart, end));
const metas = data.nodeMetas || {};

function walk(node, acc) {
  if (node.uid && metas[node.uid]) {
    const m = metas[node.uid];
    const id = (node.name || "").replace(/.*node_modules[/\\]/, "");
    if (id && m.gzipSize) acc.push({ id, gzip: m.gzipSize, raw: m.renderedLength || 0 });
  }
  for (const c of node.children || []) walk(c, acc);
}

const acc = [];
for (const c of data.tree?.children || []) walk(c, acc);
const merged = new Map();
for (const row of acc) {
  const pkg = row.id.split("/").slice(0, row.id.startsWith("@") ? 2 : 1).join("/");
  const prev = merged.get(pkg) || { gzip: 0, raw: 0 };
  merged.set(pkg, { gzip: prev.gzip + row.gzip, raw: prev.raw + row.raw });
}
const top = [...merged.entries()].sort((a, b) => b[1].gzip - a[1].gzip);
console.log(`File: ${file}`);
top.slice(0, 10).forEach(([id, s], i) => console.log(`${i + 1}. gzip ${s.gzip} raw ${s.raw} — ${id}`));
