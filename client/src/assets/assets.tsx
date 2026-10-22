import logo from "./logo.svg";
import product7 from "./product7.png"; // trolly bag
import model1 from "./model1.png"; // model men

/** Marketing hero outputs — static files in /public (not in JS bundle). */
const generated1 = "/generated/generated1.webp";
const generated2 = "/generated/generated2.webp";
const generated3 = "/generated/generated3.webp";
const generated4 = "/generated/generated4.webp";
const generatedVideo1 = "/videos/generatedVideo1.mp4";
const generatedVideo2 = "/videos/generatedVideo2.mp4";
const headphonesPoster = "/generated/headphones-poster.jpg";

export const generatedImageMeta = {
  generated1: { width: 768, height: 1376 },
  generated2: { width: 768, height: 1376 },
  generated3: { width: 768, height: 1376 },
  generated4: { width: 768, height: 1376 },
} as const;

export const marketingAssets = {
  generatorUi: "/marketing/generator-ui.webp?v=2",
  generatorUiWidth: 1440,
  generatorUiHeight: 1149,
};

export const assets = {
  logo,
  product7,
  model1,
  generated1,
  generated2,
  generated3,
  generated4,
  generatedVideo1,
  generatedVideo2,
  headphonesPoster,
};
