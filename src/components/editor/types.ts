export interface ImageVersion {
  id: string;
  imageUrl: string;
  prompt: string;
  timestamp: Date;
  thumbnailUrl?: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export type ActionType = "enhance" | "style-remix" | "fix-details" | "upscale";

export interface ActionButton {
  type: ActionType;
  label: string;
  icon: string;
  prompt: string;
  isPremium: boolean;
}

export const ACTION_BUTTONS: ActionButton[] = [
  {
    type: "enhance",
    label: "Enhance",
    icon: "sparkles",
    prompt: "Enhance this image with better lighting, sharper details, and improved colors while preserving the original composition",
    isPremium: false,
  },
  {
    type: "style-remix",
    label: "Style Remix",
    icon: "palette",
    prompt: "Apply a creative artistic style transformation to this image while maintaining the core subject",
    isPremium: true,
  },
  {
    type: "fix-details",
    label: "Fix Details",
    icon: "wrench",
    prompt: "Fix any imperfections, artifacts, or inconsistencies in this image while preserving the overall look",
    isPremium: true,
  },
  {
    type: "upscale",
    label: "Upscale",
    icon: "maximize",
    prompt: "Upscale this image to higher resolution with enhanced details and clarity",
    isPremium: true,
  },
];
