export interface UploadZoneProps {
  id: string;
  label: string;
  hint?: string;
  file: File | null;
  onClear: () => void;
  onFile: (file: File | null) => void;
  disabled?: boolean;
}

export interface User {
  id?: string;
  name?: string;
  email?: string;
}

export interface Project {
  id: string;
  name?: string;
  userId?: string;
  user?: User;
  productName?: string;
  productDescription?: string;
  userPrompt?: string;
  aspectRatio: string;
  targetLength?: number;
  generatedImage?: string;
  generatedVideo?: string;
  isGenerating: boolean;
  isPublished: boolean;
  error?: string;
  createdAt: Date | string;
  updatedAt?: Date | string;
  uploadedImages: string[];
}
