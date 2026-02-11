// Auto-Contrast Text Engine
// Computes perceived brightness and returns optimal text color

export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return null;
  return {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16),
  };
}

export function getPerceivedBrightness(hex: string): number {
  const rgb = hexToRgb(hex);
  if (!rgb) return 128;
  return 0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b;
}

export function getContrastTextColor(bgColor: string): string {
  return getPerceivedBrightness(bgColor) < 128 ? "#ffffff" : "#000000";
}

export function getContrastAccentColor(bgColor: string): string {
  const brightness = getPerceivedBrightness(bgColor);
  if (brightness < 60) return "#94a3b8";   // very dark → light gray
  if (brightness < 128) return "#e2e8f0";  // dark → lighter
  if (brightness < 200) return "#475569";  // light → dark gray
  return "#64748b";                         // very light → medium gray
}

// Apply auto-contrast to all text layers when background changes
export function autoContrastLayers(
  layers: any[],
  bgColor: string
): any[] {
  const textColor = getContrastTextColor(bgColor);
  const accentColor = getContrastAccentColor(bgColor);

  return layers.map((layer) => {
    if (layer.type === "text") {
      // Only auto-adjust if the text would be invisible against bg
      const currentBrightness = getPerceivedBrightness(layer.color || "#000000");
      const bgBrightness = getPerceivedBrightness(bgColor);
      const contrast = Math.abs(currentBrightness - bgBrightness);
      
      // If contrast is too low (text invisible), fix it
      if (contrast < 50) {
        return { ...layer, color: textColor };
      }
    }
    return layer;
  });
}
