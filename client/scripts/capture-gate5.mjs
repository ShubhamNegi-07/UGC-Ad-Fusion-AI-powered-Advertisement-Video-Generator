/**
 * Gate 5 full-page screenshots. Run from client/:
 *   npx -y playwright install chromium
 *   node scripts/capture-gate5.mjs [baseUrl]
 */
import { chromium } from "playwright";
import { mkdirSync } from "fs";
import http from "http";

const base = process.argv[2] ?? "http://127.0.0.1:4182";
const outDir = "baseline-screenshots";
mkdirSync(outDir, { recursive: true });

async function waitForServer(url, maxMs = 60_000) {
  const start = Date.now();
  return new Promise((resolve, reject) => {
    const tick = () => {
      http
        .get(url, (res) => {
          res.resume();
          resolve();
        })
        .on("error", () => {
          if (Date.now() - start > maxMs) reject(new Error(`Server not ready: ${url}`));
          else setTimeout(tick, 400);
        });
    };
    tick();
  });
}

await waitForServer(`${base}/`);

const browser = await chromium.launch({ headless: true });
const ctx = await browser.newContext();

for (const path of ["/", "/plans"]) {
  const slug = path === "/" ? "home" : "plans";
  for (const w of [375, 768, 1440]) {
    const page = await ctx.newPage();
    await page.setViewportSize({ width: w, height: w === 375 ? 3200 : 4000 });
    await page.goto(`${base}${path}`, { waitUntil: "networkidle", timeout: 120_000 });
    const out = `${outDir}/${slug}-gate5-${w}.png`;
    await page.screenshot({ path: out, fullPage: true });
    console.log("wrote", out);
    await page.close();
  }
}

await browser.close();
