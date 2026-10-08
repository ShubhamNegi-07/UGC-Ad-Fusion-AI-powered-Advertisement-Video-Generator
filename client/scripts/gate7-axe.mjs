import { chromium } from "playwright";
import axe from "axe-core";
import http from "http";

const port = Number(process.env.CAPTURE_PORT || 5173);
const base = `http://127.0.0.1:${port}`;

const targets = [
  "/",
  "/plans",
  "/generate",
  "/my-generations",
  "/community",
  "/dev/studio-states",
  "/does-not-exist",
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
const page = await browser.newPage();
const summary = [];

for (const path of targets) {
  await page.goto(`${base}${path}`, { waitUntil: "domcontentloaded", timeout: 120_000 });
  await page.waitForTimeout(800);
  const results = await page.evaluate(async (source) => {
    // eslint-disable-next-line no-eval
    eval(source);
    return await window.axe.run(document, { runOnly: { type: "tag", values: ["wcag2a", "wcag2aa"] } });
  }, axe.source);
  const bySev = { critical: 0, serious: 0, moderate: 0, minor: 0 };
  for (const v of results.violations) bySev[v.impact] = (bySev[v.impact] || 0) + 1;
  summary.push({ path, violations: results.violations.length, bySev, ids: results.violations.map((v) => v.id) });
}

await browser.close();
console.log(JSON.stringify(summary, null, 2));
