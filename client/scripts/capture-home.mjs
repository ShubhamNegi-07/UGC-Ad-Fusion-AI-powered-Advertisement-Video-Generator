import { chromium } from "playwright";
import { spawn } from "child_process";
import { mkdirSync } from "fs";
import http from "http";

const outDir = "baseline-screenshots";
mkdirSync(outDir, { recursive: true });
const port = 4179;
const url = `http://127.0.0.1:${port}/`;

function waitForServer(maxMs = 60_000) {
  const start = Date.now();
  return new Promise((resolve, reject) => {
    const tick = () => {
      http
        .get(url, (res) => {
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

const preview = spawn("npm", ["run", "preview", "--", "--host", "127.0.0.1", "--port", String(port)], {
  shell: true,
  stdio: "ignore",
});

try {
  await waitForServer();
  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext();
  for (const w of [375, 768, 1440]) {
    const page = await ctx.newPage();
    await page.setViewportSize({ width: w, height: w === 375 ? 2400 : 3200 });
    await page.goto(url, { waitUntil: "networkidle", timeout: 120_000 });
    await page.waitForTimeout(800);
    await page.screenshot({ path: `${outDir}/home-v2-${w}.png`, fullPage: true });
    await page.close();
  }
  await browser.close();
  console.log("home v2 screenshots saved");
} finally {
  preview.kill();
}
