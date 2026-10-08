import { useEffect, useMemo, useState, type FormEvent, type ReactNode } from "react";
import type { Project } from "@/Types";
import GeneratorStudioView from "@/components/studio/GeneratorStudioView";
import ResultStudioView from "@/components/studio/ResultStudioView";
import MyGenerationsStudioView from "@/components/studio/MyGenerationsStudioView";
import CommunityStudioView from "@/components/studio/CommunityStudioView";

const MOCK_IMAGE = "/generated/generated1.webp";
const MOCK_IMAGE_B = "/generated/generated2.webp";
const MOCK_VIDEO = "/videos/generatedVideo1.mp4";

async function urlToFile(url: string, filename: string): Promise<File> {
  const res = await fetch(url);
  const blob = await res.blob();
  return new File([blob], filename, { type: blob.type || "image/webp" });
}

function noopSubmit(e: FormEvent<HTMLFormElement>) {
  e.preventDefault();
}

function DevSection({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <section id={id} data-state={id} className="border-b border-border py-10">
      <div className="studio-shell mb-6">
        <p className="font-mono text-[11px] uppercase tracking-wider text-brand">Dev preview</p>
        <h2 className="studio-page-title mt-1 text-lg font-semibold text-foreground">{title}</h2>
      </div>
      {children}
    </section>
  );
}

function GeneratorEmptyMock() {
  const [name, setName] = useState("");
  const [productName, setProductName] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [aspectRatio, setAspectRatio] = useState("9:16");
  const [productImage, setProductImage] = useState<File | null>(null);
  const [modelImage, setModelImage] = useState<File | null>(null);
  const [userPrompt, setUserPrompt] = useState("");
  const isValid = useMemo(
    () => Boolean(productImage && modelImage && name.trim() && productName.trim() && aspectRatio),
    [productImage, modelImage, name, productName, aspectRatio],
  );

  return (
    <GeneratorStudioView
      idPrefix="gen-empty-"
      rootId="gen-empty"
      hideStickyBar
      name={name}
      setName={setName}
      productName={productName}
      setProductName={setProductName}
      productDescription={productDescription}
      setProductDescription={setProductDescription}
      aspectRatio={aspectRatio}
      setAspectRatio={setAspectRatio}
      productImage={productImage}
      setProductImage={setProductImage}
      modelImage={modelImage}
      setModelImage={setModelImage}
      userPrompt={userPrompt}
      setUserPrompt={setUserPrompt}
      isGenerating={false}
      isValid={isValid}
      isLoaded
      signedIn
      onSubmit={noopSubmit}
    />
  );
}

function GeneratorFilesMock() {
  const [name, setName] = useState("Summer reel mock");
  const [productName, setProductName] = useState("Sample product");
  const [productDescription, setProductDescription] = useState("");
  const [aspectRatio, setAspectRatio] = useState("9:16");
  const [productImage, setProductImage] = useState<File | null>(null);
  const [modelImage, setModelImage] = useState<File | null>(null);
  const [userPrompt, setUserPrompt] = useState("");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      const [p, m] = await Promise.all([
        urlToFile(MOCK_IMAGE, "product.webp"),
        urlToFile(MOCK_IMAGE_B, "model.webp"),
      ]);
      if (!cancelled) {
        setProductImage(p);
        setModelImage(m);
        setReady(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const isValid = useMemo(
    () => Boolean(productImage && modelImage && name.trim() && productName.trim() && aspectRatio),
    [productImage, modelImage, name, productName, aspectRatio],
  );

  if (!ready) {
    return <p className="studio-shell text-sm text-muted-foreground">Loading mock files…</p>;
  }

  return (
    <GeneratorStudioView
      idPrefix="gen-files-"
      rootId="gen-files"
      hideStickyBar
      name={name}
      setName={setName}
      productName={productName}
      setProductName={setProductName}
      productDescription={productDescription}
      setProductDescription={setProductDescription}
      aspectRatio={aspectRatio}
      setAspectRatio={setAspectRatio}
      productImage={productImage}
      setProductImage={setProductImage}
      modelImage={modelImage}
      setModelImage={setModelImage}
      userPrompt={userPrompt}
      setUserPrompt={setUserPrompt}
      isGenerating={false}
      isValid={isValid}
      isLoaded
      signedIn
      onSubmit={noopSubmit}
    />
  );
}

function GeneratorValidationMock() {
  const [name, setName] = useState("");
  const [productName, setProductName] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [aspectRatio, setAspectRatio] = useState("9:16");
  const [productImage, setProductImage] = useState<File | null>(null);
  const [modelImage, setModelImage] = useState<File | null>(null);
  const [userPrompt, setUserPrompt] = useState("");

  return (
    <GeneratorStudioView
      idPrefix="gen-validation-"
      rootId="gen-validation"
      hideStickyBar
      name={name}
      setName={setName}
      productName={productName}
      setProductName={setProductName}
      productDescription={productDescription}
      setProductDescription={setProductDescription}
      aspectRatio={aspectRatio}
      setAspectRatio={setAspectRatio}
      productImage={productImage}
      setProductImage={setProductImage}
      modelImage={modelImage}
      setModelImage={setModelImage}
      userPrompt={userPrompt}
      setUserPrompt={setUserPrompt}
      isGenerating={false}
      isValid={false}
      isLoaded
      signedIn
      onSubmit={noopSubmit}
      statusBanner={{
        variant: "error",
        message: "Add both images, a project name and a product name.",
        live: "assertive",
      }}
    />
  );
}

function GeneratorSubmittingMock() {
  const [name, setName] = useState("Submitting mock");
  const [productName, setProductName] = useState("Product");
  const [productDescription, setProductDescription] = useState("");
  const [aspectRatio, setAspectRatio] = useState("9:16");
  const [productImage, setProductImage] = useState<File | null>(null);
  const [modelImage, setModelImage] = useState<File | null>(null);
  const [userPrompt, setUserPrompt] = useState("");

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      const [p, m] = await Promise.all([
        urlToFile(MOCK_IMAGE, "product.webp"),
        urlToFile(MOCK_IMAGE_B, "model.webp"),
      ]);
      if (!cancelled) {
        setProductImage(p);
        setModelImage(m);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <GeneratorStudioView
      idPrefix="gen-submitting-"
      rootId="gen-submitting"
      hideStickyBar
      name={name}
      setName={setName}
      productName={productName}
      setProductName={setProductName}
      productDescription={productDescription}
      setProductDescription={setProductDescription}
      aspectRatio={aspectRatio}
      setAspectRatio={setAspectRatio}
      productImage={productImage}
      setProductImage={setProductImage}
      modelImage={modelImage}
      setModelImage={setModelImage}
      userPrompt={userPrompt}
      setUserPrompt={setUserPrompt}
      isGenerating
      isValid={Boolean(productImage && modelImage && name.trim() && productName.trim())}
      isLoaded
      signedIn
      onSubmit={noopSubmit}
      statusBanner={{
        variant: "info",
        message: "Generating image… This can take up to a few minutes.",
        live: "polite",
      }}
    />
  );
}

function GeneratorCreditsMock() {
  const [name, setName] = useState("Credits mock");
  const [productName, setProductName] = useState("Product");
  const [productDescription, setProductDescription] = useState("");
  const [aspectRatio, setAspectRatio] = useState("9:16");
  const [productImage, setProductImage] = useState<File | null>(null);
  const [modelImage, setModelImage] = useState<File | null>(null);
  const [userPrompt, setUserPrompt] = useState("");

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      const [p, m] = await Promise.all([
        urlToFile(MOCK_IMAGE, "product.webp"),
        urlToFile(MOCK_IMAGE_B, "model.webp"),
      ]);
      if (!cancelled) {
        setProductImage(p);
        setModelImage(m);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <GeneratorStudioView
      idPrefix="gen-credits-"
      rootId="gen-credits"
      hideStickyBar
      name={name}
      setName={setName}
      productName={productName}
      setProductName={setProductName}
      productDescription={productDescription}
      setProductDescription={setProductDescription}
      aspectRatio={aspectRatio}
      setAspectRatio={setAspectRatio}
      productImage={productImage}
      setProductImage={setProductImage}
      modelImage={modelImage}
      setModelImage={setModelImage}
      userPrompt={userPrompt}
      setUserPrompt={setUserPrompt}
      isGenerating={false}
      isValid
      isLoaded
      signedIn
      onSubmit={noopSubmit}
      creditsHint="You have 2 credits — need 5 to generate."
      statusBanner={{
        variant: "warning",
        message: "Not enough credits to generate an image.",
        live: "assertive",
      }}
    />
  );
}

const LONG_TITLE =
  "Ultra-premium organic cold-pressed extra virgin avocado oil with rosemary and a very long product name for truncation testing in the community feed";

const baseProject = (): Project => ({
  id: "dev-mock",
  name: "Mock project",
  productName: "Studio mock product",
  productDescription: "Matte studio brief text for layout checks.",
  userPrompt: "Natural light, handheld product near face.",
  aspectRatio: "9:16",
  isGenerating: false,
  isPublished: false,
  uploadedImages: [],
  createdAt: new Date().toISOString(),
});

const mockImageOnly = (): Project => ({
  ...baseProject(),
  id: "mock-image",
  productName: "Image-only mock",
  generatedImage: MOCK_IMAGE,
});

const mockVideo = (): Project => ({
  ...baseProject(),
  id: "mock-video",
  productName: "Video mock",
  generatedImage: MOCK_IMAGE,
  generatedVideo: MOCK_VIDEO,
});

const mockMixed = (): Project[] => [
  mockImageOnly(),
  mockVideo(),
  { ...baseProject(), id: "mock-b", productName: "Second item", generatedImage: MOCK_IMAGE_B },
];

export default function StudioStates() {
  return (
    <div className="pb-16 pt-nav">
      <div className="studio-shell border-b border-border py-8">
        <h1 className="studio-page-title text-2xl font-semibold">Studio state board</h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          Development only — mock data from <code className="font-mono text-xs">/public</code>, no API or auth. Scroll
          sections for screenshots.
        </p>
      </div>

      <DevSection id="gen-empty" title="Generator · empty">
        <GeneratorEmptyMock />
      </DevSection>
      <DevSection id="gen-files" title="Generator · files selected">
        <GeneratorFilesMock />
      </DevSection>
      <DevSection id="gen-validation" title="Generator · validation error">
        <GeneratorValidationMock />
      </DevSection>
      <DevSection id="gen-submitting" title="Generator · submitting">
        <GeneratorSubmittingMock />
      </DevSection>
      <DevSection id="gen-credits" title="Generator · not enough credits">
        <GeneratorCreditsMock />
      </DevSection>

      <DevSection id="result-loading" title="Result · loading">
        <ResultStudioView
          rootId="result-loading"
          loading
          project={null}
          isGenerating={false}
          mediaReady={false}
          onMediaReady={() => {}}
          onGenerateVideo={() => {}}
          onShare={() => {}}
          hideStickyVideoBar
        />
      </DevSection>

      <DevSection id="result-image" title="Result · image ready">
        <ResultStudioView
          rootId="result-image"
          loading={false}
          project={{ ...baseProject(), generatedImage: MOCK_IMAGE }}
          isGenerating={false}
          mediaReady
          onMediaReady={() => {}}
          onGenerateVideo={() => {}}
          onShare={() => {}}
          hideStickyVideoBar
        />
      </DevSection>

      <DevSection id="result-video-gen" title="Result · video generating">
        <ResultStudioView
          rootId="result-video-gen"
          loading={false}
          project={{ ...baseProject(), generatedImage: MOCK_IMAGE }}
          isGenerating
          mediaReady
          onMediaReady={() => {}}
          onGenerateVideo={() => {}}
          onShare={() => {}}
          hideStickyVideoBar
        />
      </DevSection>

      <DevSection id="result-video-ready" title="Result · video ready">
        <ResultStudioView
          rootId="result-video-ready"
          loading={false}
          project={{
            ...baseProject(),
            generatedImage: MOCK_IMAGE,
            generatedVideo: MOCK_VIDEO,
          }}
          isGenerating={false}
          mediaReady
          onMediaReady={() => {}}
          onGenerateVideo={() => {}}
          onShare={() => {}}
          hideStickyVideoBar
        />
      </DevSection>

      <DevSection id="result-error" title="Result · error">
        <ResultStudioView
          rootId="result-error"
          loading={false}
          project={{
            ...baseProject(),
            generatedImage: MOCK_IMAGE,
            error: "Video generation failed — provider timeout. Try again in a moment.",
          }}
          isGenerating={false}
          mediaReady
          onMediaReady={() => {}}
          onGenerateVideo={() => {}}
          onShare={() => {}}
          hideStickyVideoBar
        />
      </DevSection>

      <DevSection id="mygen-loading" title="My generations · loading">
        <MyGenerationsStudioView
          rootId="mygen-loading"
          loading
          signedIn
          generations={[]}
          setGenerations={() => {}}
          onRefresh={() => {}}
          onSignIn={() => {}}
        />
      </DevSection>

      <DevSection id="mygen-empty" title="My generations · empty">
        <MyGenerationsStudioView
          rootId="mygen-empty"
          loading={false}
          signedIn
          generations={[]}
          setGenerations={() => {}}
          onRefresh={() => {}}
          onSignIn={() => {}}
        />
      </DevSection>

      <DevSection id="mygen-image" title="My generations · image only">
        <MyGenerationsStudioView
          rootId="mygen-image"
          loading={false}
          signedIn
          generations={[mockImageOnly()]}
          setGenerations={() => {}}
          onRefresh={() => {}}
          onSignIn={() => {}}
        />
      </DevSection>

      <DevSection id="mygen-video" title="My generations · video">
        <MyGenerationsStudioView
          rootId="mygen-video"
          loading={false}
          signedIn
          generations={[mockVideo()]}
          setGenerations={() => {}}
          onRefresh={() => {}}
          onSignIn={() => {}}
        />
      </DevSection>

      <DevSection id="mygen-aspects" title="My generations · aspect ratios (9:16, 1:1, 16:9)">
        <MyGenerationsStudioView
          rootId="mygen-aspects"
          loading={false}
          signedIn
          generations={[
            { ...mockImageOnly(), id: "aspect-916", aspectRatio: "9:16", productName: "Portrait 9:16" },
            { ...mockImageOnly(), id: "aspect-11", aspectRatio: "1:1", productName: "Square 1:1" },
            { ...mockImageOnly(), id: "aspect-169", aspectRatio: "16:9", productName: "Landscape 16:9" },
          ]}
          setGenerations={() => {}}
          onRefresh={() => {}}
          onSignIn={() => {}}
        />
      </DevSection>

      <DevSection id="mygen-mixed" title="My generations · mixed grid">
        <MyGenerationsStudioView
          rootId="mygen-mixed"
          loading={false}
          signedIn
          generations={mockMixed()}
          setGenerations={() => {}}
          onRefresh={() => {}}
          onSignIn={() => {}}
        />
      </DevSection>

      <DevSection id="mygen-error" title="My generations · error">
        <MyGenerationsStudioView
          rootId="mygen-error"
          loading={false}
          signedIn
          generations={[]}
          setGenerations={() => {}}
          onRefresh={() => {}}
          onSignIn={() => {}}
          errorMessage="Could not load your generations. Check your connection and try again."
        />
      </DevSection>

      <DevSection id="community-loading" title="Community · loading">
        <CommunityStudioView rootId="community-loading" loading projects={[]} setProjects={() => {}} />
      </DevSection>

      <DevSection id="community-empty" title="Community · empty">
        <CommunityStudioView rootId="community-empty" loading={false} projects={[]} setProjects={() => {}} />
      </DevSection>

      <DevSection id="community-feed" title="Community · feed (long titles)">
        <CommunityStudioView
          rootId="community-feed"
          loading={false}
          projects={[
            { ...mockVideo(), id: "c1", productName: LONG_TITLE, isPublished: true },
            { ...mockImageOnly(), id: "c2", productName: "Short title ad", isPublished: true },
          ]}
          setProjects={() => {}}
        />
      </DevSection>

      <DevSection id="community-error" title="Community · error">
        <CommunityStudioView
          rootId="community-error"
          loading={false}
          projects={[]}
          setProjects={() => {}}
          onRetry={() => {}}
          errorMessage="Could not load community projects. Try again in a moment."
        />
      </DevSection>
    </div>
  );
}
