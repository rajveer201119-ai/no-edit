import type { DesignCategory } from "./DesignTypeModal";

export interface Template {
  id: string;
  name: string;
  category: DesignCategory;
  thumbnailUrl: string;
  canvasWidth: number;
  canvasHeight: number;
  elements: TemplateElement[];
}

export interface TemplateElement {
  id: string;
  type: "text" | "shape" | "image";
  x: number;
  y: number;
  width: number;
  height: number;
  content?: string;
  fontSize?: number;
  fontWeight?: string;
  color?: string;
  backgroundColor?: string;
  borderRadius?: number;
}

// Pre-built templates with realistic content
export const templates: Template[] = [
  // Poster Templates
  {
    id: "poster-startup-launch",
    name: "Startup Launch",
    category: "poster",
    thumbnailUrl: "",
    canvasWidth: 800,
    canvasHeight: 1200,
    elements: [
      {
        id: "bg",
        type: "shape",
        x: 0,
        y: 0,
        width: 800,
        height: 1200,
        backgroundColor: "#1a1a2e",
      },
      {
        id: "headline",
        type: "text",
        x: 50,
        y: 200,
        width: 700,
        height: 100,
        content: "Launch Your Vision",
        fontSize: 64,
        fontWeight: "bold",
        color: "#ffffff",
      },
      {
        id: "subhead",
        type: "text",
        x: 50,
        y: 320,
        width: 700,
        height: 60,
        content: "Join 10,000+ founders building the future",
        fontSize: 24,
        color: "#a0a0a0",
      },
      {
        id: "cta",
        type: "shape",
        x: 50,
        y: 450,
        width: 200,
        height: 50,
        backgroundColor: "#6366f1",
        borderRadius: 25,
      },
      {
        id: "cta-text",
        type: "text",
        x: 70,
        y: 460,
        width: 160,
        height: 30,
        content: "Get Started Free",
        fontSize: 16,
        fontWeight: "bold",
        color: "#ffffff",
      },
    ],
  },
  {
    id: "poster-sale-event",
    name: "Sale Event",
    category: "poster",
    thumbnailUrl: "",
    canvasWidth: 800,
    canvasHeight: 1200,
    elements: [
      {
        id: "bg",
        type: "shape",
        x: 0,
        y: 0,
        width: 800,
        height: 1200,
        backgroundColor: "#dc2626",
      },
      {
        id: "headline",
        type: "text",
        x: 50,
        y: 300,
        width: 700,
        height: 150,
        content: "50% OFF",
        fontSize: 120,
        fontWeight: "bold",
        color: "#ffffff",
      },
      {
        id: "subhead",
        type: "text",
        x: 50,
        y: 480,
        width: 700,
        height: 60,
        content: "Everything Must Go",
        fontSize: 36,
        color: "#fecaca",
      },
      {
        id: "date",
        type: "text",
        x: 50,
        y: 600,
        width: 700,
        height: 40,
        content: "This Weekend Only • Jan 25-26",
        fontSize: 20,
        color: "#ffffff",
      },
    ],
  },

  // Instagram Templates
  {
    id: "instagram-promo",
    name: "Product Promo",
    category: "instagram",
    thumbnailUrl: "",
    canvasWidth: 1080,
    canvasHeight: 1080,
    elements: [
      {
        id: "bg",
        type: "shape",
        x: 0,
        y: 0,
        width: 1080,
        height: 1080,
        backgroundColor: "#0f172a",
      },
      {
        id: "headline",
        type: "text",
        x: 80,
        y: 200,
        width: 920,
        height: 100,
        content: "New Arrivals",
        fontSize: 72,
        fontWeight: "bold",
        color: "#ffffff",
      },
      {
        id: "subhead",
        type: "text",
        x: 80,
        y: 320,
        width: 920,
        height: 60,
        content: "Fresh styles for the new season",
        fontSize: 28,
        color: "#94a3b8",
      },
      {
        id: "cta",
        type: "text",
        x: 80,
        y: 900,
        width: 920,
        height: 40,
        content: "Shop Now → Link in Bio",
        fontSize: 20,
        fontWeight: "bold",
        color: "#f472b6",
      },
    ],
  },
  {
    id: "instagram-quote",
    name: "Inspirational Quote",
    category: "instagram",
    thumbnailUrl: "",
    canvasWidth: 1080,
    canvasHeight: 1080,
    elements: [
      {
        id: "bg",
        type: "shape",
        x: 0,
        y: 0,
        width: 1080,
        height: 1080,
        backgroundColor: "#fef3c7",
      },
      {
        id: "quote",
        type: "text",
        x: 100,
        y: 350,
        width: 880,
        height: 200,
        content: '"The best time to start was yesterday. The next best time is now."',
        fontSize: 42,
        fontWeight: "bold",
        color: "#1f2937",
      },
      {
        id: "author",
        type: "text",
        x: 100,
        y: 600,
        width: 880,
        height: 40,
        content: "— Unknown",
        fontSize: 24,
        color: "#6b7280",
      },
    ],
  },

  // YouTube Thumbnail Templates
  {
    id: "youtube-tutorial",
    name: "Tutorial Style",
    category: "youtube",
    thumbnailUrl: "",
    canvasWidth: 1280,
    canvasHeight: 720,
    elements: [
      {
        id: "bg",
        type: "shape",
        x: 0,
        y: 0,
        width: 1280,
        height: 720,
        backgroundColor: "#1e293b",
      },
      {
        id: "headline",
        type: "text",
        x: 60,
        y: 200,
        width: 800,
        height: 120,
        content: "How to Build\nAnything",
        fontSize: 72,
        fontWeight: "bold",
        color: "#ffffff",
      },
      {
        id: "badge",
        type: "shape",
        x: 60,
        y: 400,
        width: 180,
        height: 45,
        backgroundColor: "#ef4444",
        borderRadius: 8,
      },
      {
        id: "badge-text",
        type: "text",
        x: 75,
        y: 408,
        width: 150,
        height: 30,
        content: "FULL GUIDE",
        fontSize: 18,
        fontWeight: "bold",
        color: "#ffffff",
      },
    ],
  },
  {
    id: "youtube-reaction",
    name: "Reaction Style",
    category: "youtube",
    thumbnailUrl: "",
    canvasWidth: 1280,
    canvasHeight: 720,
    elements: [
      {
        id: "bg",
        type: "shape",
        x: 0,
        y: 0,
        width: 1280,
        height: 720,
        backgroundColor: "#7c3aed",
      },
      {
        id: "headline",
        type: "text",
        x: 60,
        y: 150,
        width: 700,
        height: 150,
        content: "I CAN'T\nBELIEVE IT!",
        fontSize: 84,
        fontWeight: "bold",
        color: "#ffffff",
      },
      {
        id: "subhead",
        type: "text",
        x: 60,
        y: 380,
        width: 700,
        height: 50,
        content: "You won't believe what happened...",
        fontSize: 28,
        color: "#e9d5ff",
      },
    ],
  },

  // Logo Templates
  {
    id: "logo-minimal",
    name: "Minimal Brand",
    category: "logo",
    thumbnailUrl: "",
    canvasWidth: 800,
    canvasHeight: 800,
    elements: [
      {
        id: "bg",
        type: "shape",
        x: 0,
        y: 0,
        width: 800,
        height: 800,
        backgroundColor: "#ffffff",
      },
      {
        id: "icon",
        type: "shape",
        x: 300,
        y: 250,
        width: 200,
        height: 200,
        backgroundColor: "#000000",
        borderRadius: 40,
      },
      {
        id: "brand",
        type: "text",
        x: 200,
        y: 500,
        width: 400,
        height: 80,
        content: "BRAND",
        fontSize: 56,
        fontWeight: "bold",
        color: "#000000",
      },
    ],
  },
  {
    id: "logo-modern",
    name: "Modern Tech",
    category: "logo",
    thumbnailUrl: "",
    canvasWidth: 800,
    canvasHeight: 800,
    elements: [
      {
        id: "bg",
        type: "shape",
        x: 0,
        y: 0,
        width: 800,
        height: 800,
        backgroundColor: "#0f172a",
      },
      {
        id: "icon",
        type: "shape",
        x: 275,
        y: 225,
        width: 250,
        height: 250,
        backgroundColor: "#3b82f6",
        borderRadius: 60,
      },
      {
        id: "brand",
        type: "text",
        x: 200,
        y: 520,
        width: 400,
        height: 80,
        content: "techflow",
        fontSize: 48,
        fontWeight: "bold",
        color: "#ffffff",
      },
    ],
  },
];

export const getTemplatesByCategory = (category: DesignCategory): Template[] => {
  return templates.filter((t) => t.category === category);
};

export const getRandomTemplate = (category: DesignCategory): Template | null => {
  const categoryTemplates = getTemplatesByCategory(category);
  if (categoryTemplates.length === 0) return null;
  return categoryTemplates[Math.floor(Math.random() * categoryTemplates.length)];
};
