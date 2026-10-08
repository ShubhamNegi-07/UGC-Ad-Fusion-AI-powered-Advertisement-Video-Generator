import { execFileSync } from "node:child_process";
import ffmpeg from "ffmpeg-static";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const video = "c:/Users/rajen/Downloads/buttons.mp4";
const outDir = path.join(__dirname, "../public");

for (const [i, s] of [0.2, 1, 2, 4, 6, 8, 10, 12].entries()) {
  const out = path.join(outDir, `btn-ref-${i}.png`);
  execFileSync(
    ffmpeg,
    ["-y", "-i", video, "-ss", String(s), "-vframes", "1", "-update", "1", out],
    { stdio: "ignore" },
  );
  console.log("wrote", out);
}
