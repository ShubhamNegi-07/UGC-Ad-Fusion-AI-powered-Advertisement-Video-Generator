import { chromium } from "playwright";
import { spawn } from "child_process";
import { mkdirSync } from "fs";
import http from "http";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const clientRoot = join(dirname(fileURLToPath(import.meta.url)), "..");

const outDir = "baseline-screenshots/studio-states";
mkdirSync(outDir, { recursive: true });
const port = Number(process.env.CAPTURE_PORT || 5173);
const base = `http://127.0.0.1:${port}/dev/studio-states`;

const states = [
  "gen-empty",
  "gen-files",
  "gen-validation",
  "gen-submitting",
  "gen-credits",
  "result-loading",
  "result-image",
  "result-video-gen",
  "result-video-ready",
  "result-error",
  "mygen-loading",
  "mygen-empty",
  "mygen-image",
  "mygen-video",
  "mygen-mixed",
  "mygen-error",
  "community-loading",
  "community-empty",
  "community-feed",
  "community-error",
];

function waitForServer(maxMs = 90_000) {
  const start = Date.now();
  return new Promise((resolve, reject) => {
    const tick = () => {
      http
        .get(`http://127.0.0.1:${port}/`, (res) => {
          res.resume();
          resolve();
        })
        .on("error", () => {
          if (Date.now() - start > maxMs) reject(new Error("timeout"));
          else setTimeout(tick, 500);
        });
    };
    tick();
  });
}

const skipDev = process.env.SKIP_DEV_SERVER === "1";
let dev = null;
if (!skipDev) {
  dev = spawn("npm", ["run", "dev", "--", "--host", "127.0.0.1", "--port", String(port)], {
    shell: true,
    stdio: "ignore",
    cwd: clientRoot,
  });
  await waitForServer();
}

try {
  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext();
  for (const w of [375, 768, 1440]) {
    const page = await ctx.newPage();
    await page.setViewportSize({ width: w, height: w === 375 ? 900 : 1000 });
    await page.goto(base, { waitUntil: "networkidle", timeout: 120_000 });
    await page.waitForFunction(() => document.querySelector('section[data-state="gen-empty"]'), undefined, {
      timeout: 60_000,
    });
    await page.waitForTimeout(w === 375 ? 2000 : 1200);
    for (const id of states) {
      const el = page.locator(`section[data-state="${id}"]`);
      await el.scrollIntoViewIfNeeded();
      await page.waitForTimeout(300);
      await el.screenshot({ path: `${outDir}/${id}-${w}.png` });
    }
    await page.close();
  }
  await browser.close();
  console.log(`Saved ${states.length * 3} studio state screenshots to ${outDir}`);
} finally {
  dev?.kill();
}
