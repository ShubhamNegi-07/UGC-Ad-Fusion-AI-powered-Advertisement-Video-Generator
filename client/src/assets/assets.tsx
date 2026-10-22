import logo from "./logo.svg";
import product7 from "./product7.webp";
import model1 from "./model1.webp";
import product7Thumb from "./product7-thumb.webp";
import model1Thumb from "./model1-thumb.webp";

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
  generatorUi: "/marketing/generator-ui.webp?v=3",
  generatorUiWidth: 1200,
  generatorUiHeight: 958,
};

export const assets = {
  logo,
  product7,
  model1,
  product7Thumb,
  model1Thumb,
  generated1,
  generated2,
  generated3,
  generated4,
  generatedVideo1,
  generatedVideo2,
  headphonesPoster,
};
