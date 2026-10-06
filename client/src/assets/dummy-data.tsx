import type { IconSvgElement } from "@hugeicons/react";
import {
  AiMagicIcon,
  AiVideoIcon,
  ImageUpload01Icon,
  Mic01Icon,
  SmartPhone01Icon,
  Rocket01Icon,
} from "@hugeicons/core-free-icons";

export interface Feature {
  icon: IconSvgElement;
  title: string;
  desc: string;
}

export const featuresData: Feature[] = [
  {
    icon: ImageUpload01Icon,
    title: "Smart upload",
    desc: "Drop a product shot and a model photo. We clean, resize and optimise both before fusion.",
  },
  {
    icon: AiMagicIcon,
    title: "Scene fusion",
    desc: "The model holds your product in a photoreal scene while lighting, hands and reflections stay consistent.",
  },
  {
    icon: AiVideoIcon,
    title: "Talking video",
    desc: "Turn the frame into a short UGC ad where the creator speaks to camera and shows the product.",
  },
  {
    icon: Mic01Icon,
    title: "Natural speech",
    desc: "Audio is generated with the clip, so every ad arrives ready to post without a voice-over pass.",
  },
  {
    icon: SmartPhone01Icon,
    title: "Built for feeds",
    desc: "Pick 9:16, 1:1 or 16:9 and get an output framed for Reels, Shorts, TikTok or in-feed placements.",
  },
  {
    icon: Rocket01Icon,
    title: "Publish & share",
    desc: "Download, publish to the community wall or share a link from the same screen in one tap.",
  },
];

export interface Plan {
  id: string;
  name: string;
  price: string;
  desc: string;
  credits: number;
  features: string[];
  popular?: boolean;
}

export const plansData: Plan[] = [
  {
    id: "starter",
    name: "Starter",
    price: "$10",
    desc: "Try the platform with a light workload.",
    credits: 30,
    features: ["30 credits", "Standard quality", "No watermark", "Standard queue", "Email support"],
  },
  {
    id: "pro",
    name: "Pro",
    price: "$30",
    desc: "Creators and small teams shipping weekly.",
    credits: 80,
    features: ["80 credits", "HD quality", "No watermark", "Video generation", "Priority support"],
    popular: true,
  },
  {
    id: "ultra",
    name: "Ultra",
    price: "$99",
    desc: "Scale across brands and agencies.",
    credits: 300,
    features: ["300 credits", "FHD quality", "No watermark", "Fast generation", "Chat + email support"],
  },
];

export const faqData = [
  {
    question: "How does the AI generation work?",
    answer:
      "We use diffusion models trained on millions of product images to blend your product into a realistic scene while preserving details, lighting and reflections. The video step animates that frame with speech.",
  },
  {
    question: "Do I own the generated images and videos?",
    answer:
      "Yes. You receive full commercial rights to anything generated on the platform. Use it for ads, e-commerce, social media and more.",
  },
  {
    question: "How are credits consumed?",
    answer:
      "An image costs 5 credits and a video costs 10. If a generation fails, the credits are returned to your balance automatically.",
  },
  {
    question: "What input formats do you support?",
    answer:
      "JPG, PNG and WEBP up to 10 MB each. Outputs are high-resolution PNGs and MP4s framed for social platforms.",
  },
  {
    question: "Can I cancel anytime?",
    answer:
      "Yes. Cancel from your dashboard and you keep access through the end of the billing period.",
  },
];

export const footerLinks = [
  {
    title: "Product",
    links: [
      { name: "Home", url: "/" },
      { name: "Generate", url: "/generate" },
      { name: "Community", url: "/community" },
      { name: "Pricing", url: "/plans" },
    ],
  },
  {
    title: "Legal",
    links: [
      { name: "Privacy Policy", url: "#" },
      { name: "Terms of Service", url: "#" },
    ],
  },
  {
    title: "Connect",
    links: [
      { name: "Twitter", url: "#" },
      { name: "LinkedIn", url: "https://www.linkedin.com/in/shubham-singh2006/" },
      { name: "GitHub", url: "https://github.com/shubhamsingh206" },
    ],
  },
];
