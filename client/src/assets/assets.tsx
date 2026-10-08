import logo from "./logo.svg";
import type { Project } from "../Types";
import product1 from "./product1.jpg"; // white watch
import product2 from "./product2.jpg"; // polaroid camera
import product3 from "./product3.jpg"; // sunglasses
import product4 from "./product4.jpg"; // headphone
import product5 from "./product5.jpg"; // speaker
import product6 from "./product6.jpg"; // sneakers
import product7 from "./product7.png"; // trolly bag
import model1 from "./model1.png"; // model men
import model2 from "./model2.jpg"; // model women

/** Marketing hero outputs — static files in /public (not in JS bundle). */
const generated1 = "/generated/generated1.webp";
const generated2 = "/generated/generated2.webp";
const generated3 = "/generated/generated3.webp";
const generated4 = "/generated/generated4.webp";
const generatedVideo1 = "/videos/generatedVideo1.mp4";
const generatedVideo2 = "/videos/generatedVideo2.mp4";

export const generatedImageMeta = {
  generated1: { width: 768, height: 1376 },
  generated2: { width: 768, height: 1376 },
  generated3: { width: 768, height: 1376 },
  generated4: { width: 768, height: 1376 },
} as const;

export const marketingAssets = {
  generatorUi: "/marketing/generator-ui.webp",
  generatorUiWidth: 1440,
  generatorUiHeight: 1198,
};

export const assets = {
  logo,
  product1,
  product2,
  product3,
  product4,
  product5,
  product6,
  product7,
  model1,
  model2,
  generated1,
  generated2,
  generated3,
  generated4,
  generatedVideo1,
  generatedVideo2,
};

export const dummyGenerations: Project[] = [
  {
    id: "gen_1",
    aspectRatio: "9:16",
    productDescription: "Sky Colored Trolly Bag",
    productName: "Trolly Bag",
    targetLength: 5,
    uploadedImages: [product7, model1],
    userId: "user_1",
    userPrompt: "Create the video where center of attraction is a trolly bag",
    generatedImage: generated1,
    generatedVideo: generatedVideo1,
    isGenerating: false,
    isPublished: false,
    createdAt: "2023-03-15T00:00:00.000Z",
    updatedAt: "",
  },
  {
    id: "gen_2",
    aspectRatio: "16:9",
    productDescription: "Stylish White Sneakers",
    productName: "Sneakers",
    targetLength: 10,
    uploadedImages: [product6, model2],
    userId: "user_1",
    userPrompt: "Create an ad showcasing the sneakers",
    generatedImage: generated2,
    generatedVideo: generatedVideo2,
    isGenerating: false,
    isPublished: true,
    createdAt: "2023-03-16T00:00:00.000Z",
    updatedAt: "",
  },
  {
    id: "gen_3",
    aspectRatio: "9:16",
    productDescription: "Stylish White Sneakers",
    productName: "Sneakers",
    targetLength: 5,
    uploadedImages: [product6, model1],
    userId: "user_2",
    userPrompt: "Showcase sneakers in a dynamic way",
    generatedImage: generated3,
    generatedVideo: generatedVideo1,
    isGenerating: false,
    isPublished: false,
    createdAt: "2023-03-17T00:00:00.000Z",
    updatedAt: "",
  },
  {
    id: "gen_4",
    aspectRatio: "9:16",
    productDescription: "Stylish White Sneakers",
    productName: "Sneakers",
    targetLength: 5,
    uploadedImages: [product6, model2],
    userId: "user_2",
    userPrompt: "Create an engaging ad for sneakers",
    generatedImage: generated4,
    generatedVideo: generatedVideo2,
    isGenerating: false,
    isPublished: false,
    createdAt: "2023-03-18T00:00:00.000Z",
    updatedAt: "",
  },
  {
    id: "gen_5",
    aspectRatio: "9:16",
    productDescription: "Sky Colored Trolly Bag",
    productName: "Trolly Bag",
    targetLength: 5,
    uploadedImages: [product7, model1],
    userId: "user_3",
    userPrompt: "Highlight the trolly bag features",
    generatedImage: generated1,
    generatedVideo: generatedVideo1,
    isGenerating: false,
    isPublished: true,
    createdAt: "2023-03-19T00:00:00.000Z",
    updatedAt: "",
  },
  {
    id: "gen_6",
    aspectRatio: "16:9",
    productDescription: "Sky Colored Trolly Bag",
    productName: "Trolly Bag",
    targetLength: 10,
    uploadedImages: [product7, model2],
    userId: "user_3",
    userPrompt: "Create a wide format ad for the trolly bag",
    generatedImage: generated2,
    generatedVideo: generatedVideo2,
    isGenerating: false,
    isPublished: false,
    createdAt: "2023-03-20T00:00:00.000Z",
    updatedAt: "",
  },
  {
    id: "gen_7",
    aspectRatio: "9:16",
    productDescription: "Stylish White Sneakers",
    productName: "Sneakers",
    targetLength: 5,
    uploadedImages: [product6, model1],
    userId: "user_4",
    userPrompt: "Focus on sneaker details",
    generatedImage: generated3,
    generatedVideo: generatedVideo1,
    isGenerating: false,
    isPublished: false,
    createdAt: "2023-03-21T00:00:00.000Z",
    updatedAt: "",
  },
  {
    id: "gen_8",
    aspectRatio: "9:16",
    productDescription: "Stylish White Sneakers",
    productName: "Sneakers",
    targetLength: 5,
    uploadedImages: [product6, model2],
    userId: "user_4",
    userPrompt: "Create a trendy sneaker ad",
    generatedImage: generated4,
    generatedVideo: generatedVideo2,
    isGenerating: false,
    isPublished: true,
    createdAt: "2023-03-22T00:00:00.000Z",
    updatedAt: "",
  },
];
