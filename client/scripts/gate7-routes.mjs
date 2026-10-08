import { chromium } from "playwright";
import { mkdirSync } from "fs";
import http from "http";

const port = Number(process.env.CAPTURE_PORT || 5173);
const base = `http://127.0.0.1:${port}`;
const outDir = "baseline-screenshots/gate7-routes";
mkdirSync(outDir, { recursive: true });

const routes = [
  { path: "/", name: "home" },
  { path: "/plans", name: "plans" },
  { path: "/generate", name: "generate" },
  { path: "/dev/studio-states", name: "result-mock", scrollTo: "result-image" },
  { path: "/my-generations", name: "my-generations" },
  { path: "/community", name: "community" },
  { path: "/does-not-exist", name: "404" },
];

function waitForServer() {
  return new Promise((resolve, reject) => {
    const start = Date.now();
    const tick = () => {
      http
        .get(base, (r) => {
          r.resume();
          resolve();
        })
        .on("error", () => {
          if (Date.now() - start > 60_000) reject(new Error("timeout"));
          else setTimeout(tick, 400);
        });
    };
    tick();
  });
}

await waitForServer();
const browser = await chromium.launch({ headless: true });
const ctx = await browser.newContext();
for (const w of [375, 768, 1440]) {
  const page = await ctx.newPage();
  await page.setViewportSize({ width: w, height: w === 375 ? 900 : 1100 });
  for (const route of routes) {
    await page.goto(`${base}${route.path}`, { waitUntil: "networkidle", timeout: 120_000 });
    if (route.scrollTo) {
      await page.locator(`section[data-state="${route.scrollTo}"]`).scrollIntoViewIfNeeded().catch(() => {});
      await page.waitForTimeout(400);
    }
    await page.screenshot({ path: `${outDir}/${route.name}-${w}.png`, fullPage: true });
  }
  await page.close();
}
await browser.close();
console.log(`Saved ${routes.length * 3} route screenshots to ${outDir}`);
