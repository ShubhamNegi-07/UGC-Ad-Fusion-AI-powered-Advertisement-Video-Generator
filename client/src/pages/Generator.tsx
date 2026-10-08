import { useMemo, useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth, useClerk, useUser } from "@clerk/clerk-react";
import toast from "react-hot-toast";
import { HugeiconsIcon } from "@hugeicons/react";
import { LockIcon } from "@hugeicons/core-free-icons";
import api from "@/configs/axios";
import GeneratorStudioView from "@/components/studio/GeneratorStudioView";
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
