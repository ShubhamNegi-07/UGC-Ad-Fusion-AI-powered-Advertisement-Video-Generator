import sharp from "sharp";
import { mkdirSync, readFileSync, writeFileSync } from "fs";

mkdirSync("public/generated", { recursive: true });
mkdirSync("public/marketing", { recursive: true });

const generated = ["generated1", "generated2", "generated3", "generated4"];
const meta = {};

for (const name of generated) {
  const input = `src/assets/${name}.png`;
  const output = `public/generated/${name}.webp`;
  const info = await sharp(input).webp({ quality: 86 }).toFile(output);
  meta[name] = { width: info.width, height: info.height, path: `/${name.replace("generated", "generated")}.webp`.replace("/generated", "/generated") };
}

// fix paths
for (const name of generated) {
  meta[name].path = `/generated/${name}.webp`;
}

const genUi = "baseline-screenshots/generate-1440.png";
try {
  const ui = await sharp(genUi).webp({ quality: 82 }).toFile("public/marketing/generator-ui.webp");
  meta.generatorUi = { width: ui.width, height: ui.height, path: "/marketing/generator-ui.webp" };
} catch {
  console.warn("generator-ui source missing, skip");
}

writeFileSync("public/generated/manifest.json", JSON.stringify(meta, null, 2));
console.log(meta);
