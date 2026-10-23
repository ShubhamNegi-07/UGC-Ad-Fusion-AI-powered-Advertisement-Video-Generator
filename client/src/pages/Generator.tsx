import { useMemo, useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth, useClerk, useUser } from "@clerk/clerk-react";
import toast from "react-hot-toast";
import { HugeiconsIcon } from "@hugeicons/react";
import { LockIcon } from "@/icons";
import api from "@/configs/axios";
import GeneratorStudioView from "@/components/studio/GeneratorStudioView";
import { writeCachedProject } from "@/lib/studio-cache";
import { errorMessage } from "@/lib/utils";

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
      toast("Sign in to generate", {
        icon: <HugeiconsIcon icon={LockIcon} size={18} strokeWidth={2} aria-hidden />,
      });
      openSignIn();
      return;
    }
    if (!isValid) {
      toast.error("Add both images, a project name and a product name.");
      return;
    }

    try {
      setIsGenerating(true);
      const token = await getToken();
      const { data } = await api.post(
        "/api/project/create",
        {
          name: name.trim(),
          productName: productName.trim(),
          productDescription: productDescription.trim(),
          userPrompt: userPrompt.trim(),
          aspectRatio,
        },
        { headers: { Authorization: `Bearer ${token}` }, timeout: 20000 },
      );

      if (!data.projectId) {
        throw new Error(data.message || "Generation did not start");
      }

      writeCachedProject({
        id: data.projectId,
        name: name.trim(),
        productName: productName.trim(),
        productDescription: productDescription.trim(),
        userPrompt: userPrompt.trim(),
        aspectRatio,
        isGenerating: true,
        isPublished: false,
        publishedImage: false,
        publishedVideo: false,
        uploadedImages: [],
        createdAt: new Date().toISOString(),
      });
      navigate(`/result/${data.projectId}`);

      const formData = new FormData();
      formData.append("images", productImage as File);
      formData.append("images", modelImage as File);
      void api.post(`/api/project/${data.projectId}/start-image`, formData, {
        headers: { Authorization: `Bearer ${token}` },
        timeout: 180000,
      }).catch((error) => {
        toast.error(errorMessage(error));
      });
    } catch (error) {
      setIsGenerating(false);
      toast.error(errorMessage(error));
    }
  };

  return (
    <GeneratorStudioView
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
      isGenerating={isGenerating}
      isValid={isValid}
      isLoaded={isLoaded}
      signedIn={Boolean(user)}
      onSubmit={handleGenerate}
    />
  );
}
