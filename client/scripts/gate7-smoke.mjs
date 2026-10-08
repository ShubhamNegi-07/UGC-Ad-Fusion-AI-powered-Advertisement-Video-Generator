import { chromium } from "playwright";
import http from "http";

const port = Number(process.env.CAPTURE_PORT || 5173);
const base = `http://127.0.0.1:${port}`;
const paths = ["/", "/plans", "/generate", "/my-generations", "/community", "/does-not-exist"];

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
let failed = false;
for (const path of paths) {
  const page = await browser.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(String(e)));
  page.on("console", (msg) => {
    if (msg.type() === "error") errors.push(msg.text());
  });
  const res = await page.goto(`${base}${path}`, { waitUntil: "networkidle", timeout: 120_000 });
  const ok = res?.ok() || path === "/does-not-exist";
  if (!ok || errors.length) {
    failed = true;
    console.error("FAIL", path, { status: res?.status(), errors });
  } else {
    console.log("OK", path);
  }
  await page.close();
}
await browser.close();
process.exit(failed ? 1 : 0);
