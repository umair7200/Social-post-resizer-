
export type AspectRatio = "1:1" | "3:4" | "4:3" | "9:16" | "16:9";
export type DesignTheme = "light" | "dark" | "original";

export interface SocialPlatform {
  id: string;
  name: string;
  type: string;
  aspectRatio: AspectRatio;
  dimensions: string;
  icon: string;
  description: string;
}

export interface GeneratedResult {
  id: string;
  platform: SocialPlatform;
  imageUrl: string;
  caption: string;
  hashtags: string[];
  creativeReasoning: string;
  theme: DesignTheme;
  timestamp: number;
  isRegenerating?: boolean;
}

export interface GenerationStatus {
  loading: boolean;
  error: string | null;
  progress: number;
}
