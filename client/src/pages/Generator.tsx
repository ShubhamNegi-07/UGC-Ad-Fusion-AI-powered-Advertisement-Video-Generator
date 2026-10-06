import { useMemo, useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth, useClerk, useUser } from "@clerk/clerk-react";
import toast from "react-hot-toast";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  AiMagicIcon,
  Coins01Icon,
  ComputerIcon,
  SmartPhone01Icon,
  SquareIcon,
} from "@hugeicons/core-free-icons";
import api from "@/configs/axios";
import Title from "@/components/Title";
import UploadZone from "@/components/UploadZone";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { Label, FieldHint } from "@/components/ui/label";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { fadeUp, stagger } from "@/components/ui/motion";
import { errorMessage } from "@/lib/utils";

const ratios = [
  { value: "9:16", label: "Portrait", hint: "Reels · Shorts", icon: SmartPhone01Icon },
  { value: "1:1", label: "Square", hint: "Feed", icon: SquareIcon },
  { value: "16:9", label: "Landscape", hint: "YouTube", icon: ComputerIcon },
];

const steps = [
  { n: "01", title: "Upload", desc: "Product and model photos" },
  { n: "02", title: "Describe", desc: "Name, details, optional prompt" },
  { n: "03", title: "Generate", desc: "Image now, video after" },
];

export default function Generator() {
  const { user, isLoaded } = useUser();
  const { getToken } = useAuth();
  const { openSignIn } = useClerk();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [productName, setProductName] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [aspectRatio, setAspectRatio] = useState("9:16");
  const [productImage, setProductImage] = useState<File | null>(null);
  const [modelImage, setModelImage] = useState<File | null>(null);
  const [userPrompt, setUserPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const isValid = useMemo(
    () => Boolean(productImage && modelImage && name.trim() && productName.trim() && aspectRatio),
    [productImage, modelImage, name, productName, aspectRatio],
  );

  const handleGenerate = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) {
      toast("Sign in to generate", { icon: "🔐" });
      openSignIn();
      return;
    }
    if (!isValid) {
      toast.error("Add both images, a project name and a product name.");
      return;
    }

    try {
      setIsGenerating(true);
      const formData = new FormData();
      formData.append("name", name.trim());
      formData.append("productName", productName.trim());
      formData.append("productDescription", productDescription.trim());
      formData.append("userPrompt", userPrompt.trim());
      formData.append("aspectRatio", aspectRatio);
      formData.append("images", productImage as File);
      formData.append("images", modelImage as File);

      const token = await getToken();
      const { data } = await api.post("/api/project/create", formData, {
        headers: { Authorization: `Bearer ${token}` },
        timeout: 180000,
      });

      toast.success(data.message || "Image generated");
      navigate(`/result/${data.projectId}`);
    } catch (error) {
      setIsGenerating(false);
      toast.error(errorMessage(error, "Generation failed"));
    }
  };

  return (
    <div className="px-4 pb-16 pt-nav sm:px-6">
      <div className="mx-auto max-w-6xl">
        <Title
          as="h1"
          heading="Generate an in-context product image"
          description="Upload your product and a model. We produce a photoreal still first, then you can turn it into a talking video on the result page."
          className="mb-8"
        />

        <motion.ol
          variants={stagger(0.1, 0.06)}
          initial="hidden"
          animate="show"
          className="mx-auto mb-10 grid max-w-3xl grid-cols-3 gap-2 sm:gap-3"
        >
          {steps.map((s) => (
            <motion.li key={s.n} variants={fadeUp} className="glass flex items-center gap-3 rounded-xl px-3 py-2.5 sm:px-4">
              <span className="font-mono text-[11px] text-zinc-500">{s.n}</span>
              <div className="min-w-0 leading-tight">
                <p className="truncate text-xs font-medium sm:text-sm">{s.title}</p>
                <p className="hidden truncate text-[11px] text-muted-foreground sm:block">{s.desc}</p>
              </div>
            </motion.li>
          ))}
        </motion.ol>

        <motion.form
          onSubmit={handleGenerate}
          variants={stagger(0.15, 0.08)}
          initial="hidden"
          animate="show"
          className="grid gap-6 lg:grid-cols-[minmax(0,320px)_1fr] lg:items-start"
          aria-busy={isGenerating}
        >
          <motion.div variants={fadeUp}>
            <Card>
              <CardHeader>
                <CardTitle>Source images</CardTitle>
                <CardDescription>Clear, well-lit photos give the best fusion.</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-5 pb-6 sm:grid-cols-2 lg:grid-cols-1">
                <UploadZone
                  id="product-image"
                  label="Product image"
                  hint="Required"
                  file={productImage}
                  onFile={setProductImage}
                  onClear={() => setProductImage(null)}
                  disabled={isGenerating}
                />
                <UploadZone
                  id="model-image"
                  label="Model image"
                  hint="Required"
                  file={modelImage}
                  onFile={setModelImage}
                  onClear={() => setModelImage(null)}
                  disabled={isGenerating}
                />
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={fadeUp} className="flex flex-col gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Details</CardTitle>
                <CardDescription>Tell the model what it is looking at.</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-5 pb-6">
                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Project name</Label>
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Summer launch · Reel 01"
                      autoComplete="off"
                      required
                      disabled={isGenerating}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="productName">Product name</Label>
                    <Input
                      id="productName"
                      value={productName}
                      onChange={(e) => setProductName(e.target.value)}
                      placeholder="Mango candy pack"
                      autoComplete="off"
                      required
                      disabled={isGenerating}
                    />
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="productDescription" className="justify-between">
                    Product description
                    <FieldHint>Optional</FieldHint>
                  </Label>
                  <Textarea
                    id="productDescription"
                    value={productDescription}
                    onChange={(e) => setProductDescription(e.target.value)}
                    placeholder="Material, colour, size, key selling points…"
                    maxLength={500}
                    disabled={isGenerating}
                  />
                  <p className="text-right font-mono text-[11px] text-muted-foreground">{productDescription.length}/500</p>
                </div>

                <div className="grid gap-2.5">
                  <Label id="aspect-label">Aspect ratio</Label>
                  <ToggleGroup
                    type="single"
                    value={aspectRatio}
                    onValueChange={(v) => v && setAspectRatio(v)}
                    aria-labelledby="aspect-label"
                    className="grid w-full grid-cols-3"
                    disabled={isGenerating}
                  >
                    {ratios.map((r) => (
                      <ToggleGroupItem key={r.value} value={r.value} aria-label={`${r.label} ${r.value}`} className="h-auto flex-col gap-1 py-2.5">
                        <HugeiconsIcon icon={r.icon} size={18} strokeWidth={1.8} />
                        <span className="text-xs font-medium">{r.label}</span>
                        <span className="font-mono text-[10px] text-muted-foreground">{r.value}</span>
                      </ToggleGroupItem>
                    ))}
                  </ToggleGroup>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="userPrompt" className="justify-between">
                    Creative direction
                    <FieldHint>Optional</FieldHint>
                  </Label>
                  <Textarea
                    id="userPrompt"
                    value={userPrompt}
                    onChange={(e) => setUserPrompt(e.target.value)}
                    placeholder="e.g. Bright kitchen, morning light, model smiling and holding the pack near the face."
                    maxLength={400}
                    disabled={isGenerating}
                  />
                </div>
              </CardContent>
            </Card>

            <motion.div variants={fadeUp} className="glass flex flex-col gap-4 rounded-2xl p-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3 text-sm">
                <span className="flex size-9 items-center justify-center rounded-lg bg-amber-400/15 text-amber-300">
                  <HugeiconsIcon icon={Coins01Icon} size={18} strokeWidth={2} />
                </span>
                <div className="leading-tight">
                  <p className="font-medium text-zinc-100">Costs 5 credits</p>
                  <p className="text-xs text-zinc-500">Refunded automatically if the generation fails.</p>
                </div>
              </div>
              <Button
                type="submit"
                variant="gradient"
                size="lg"
                className="w-full sm:w-auto"
                loading={isGenerating}
                loadingText="Generating image…"
                disabled={isLoaded && !!user && !isValid}
              >
                <HugeiconsIcon icon={AiMagicIcon} size={18} strokeWidth={2} />
                {user ? "Generate image" : "Sign in to generate"}
              </Button>
            </motion.div>
          </motion.div>
        </motion.form>
      </div>
    </div>
  );
}
