import { spawnSync } from "child_process";
import { readFileSync, existsSync } from "fs";

const url = process.argv[2];
const prefix = process.argv[3] || "lh";
if (!url) {
  console.error("Usage: node run-lh-mobile.mjs <url> <prefix>");
  process.exit(1);
}

const results = [];
for (let i = 1; i <= 3; i++) {
  const out = `${prefix}-${i}.json`;
  let attempt = 0;
  while (attempt < 2) {
    attempt++;
    spawnSync(
      "npx",
      [
        "lighthouse",
        url,
        "--preset=perf",
        "--only-categories=performance",
        "--output=json",
        `--output-path=${out}`,
        "--quiet",
        "--chrome-flags=--headless",
        "--form-factor=mobile",
      ],
      { stdio: "inherit", shell: true },
    );
    if (!existsSync(out)) continue;
    const j = JSON.parse(readFileSync(out, "utf8"));
    const perf = j.categories?.performance;
    const a = j.audits;
    if (perf?.score == null || a["total-blocking-time"]?.scoreDisplayMode === "error") {
      console.warn(`Run ${i} invalid, retrying...`);
      continue;
    }
    results.push({
      run: i,
      score: Math.round(perf.score * 100),
      fcp: Math.round(a["first-contentful-paint"].numericValue),
      lcp: Math.round(a["largest-contentful-paint"].numericValue),
      tbt: Math.round(a["total-blocking-time"].numericValue),
    });
    break;
  }
}

console.log(JSON.stringify(results, null, 2));
