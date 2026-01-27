import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { Type, Plus, Palette, Sparkles, Zap } from "lucide-react";

export interface TextOverlay {
  id: string;
  text: string;
  x: number;
  y: number;
  fontSize: number;
  fontFamily: string;
  fontWeight: string;
  fontStyle: string;
  color: string;
  gradient: string | null;
  textShadow: string;
  opacity: number;
}

interface TextToolPanelProps {
  onAddText: (text: TextOverlay) => void;
  selectedText: TextOverlay | null;
  onUpdateText: (id: string, updates: Partial<TextOverlay>) => void;
}

const FONT_FAMILIES = [
  { value: "Inter, sans-serif", label: "Inter" },
  { value: "Arial, sans-serif", label: "Arial" },
  { value: "Georgia, serif", label: "Georgia" },
  { value: "Times New Roman, serif", label: "Times" },
  { value: "Courier New, monospace", label: "Courier" },
  { value: "Verdana, sans-serif", label: "Verdana" },
  { value: "Impact, sans-serif", label: "Impact" },
  { value: "Comic Sans MS, cursive", label: "Comic Sans" },
  { value: "Trebuchet MS, sans-serif", label: "Trebuchet" },
  { value: "Palatino, serif", label: "Palatino" },
];

const FONT_WEIGHTS = [
  { value: "300", label: "Light" },
  { value: "400", label: "Regular" },
  { value: "500", label: "Medium" },
  { value: "600", label: "Semi Bold" },
  { value: "700", label: "Bold" },
  { value: "800", label: "Extra Bold" },
  { value: "900", label: "Black" },
];

const PRESET_COLORS = [
  "#FFFFFF", "#000000", "#EB8530", "#E04724", 
  "#3B82F6", "#10B981", "#8B5CF6", "#EC4899",
  "#F59E0B", "#EF4444", "#06B6D4", "#84CC16",
];

const PRESET_GRADIENTS = [
  { value: "none", label: "None", css: "" },
  { value: "orange-red", label: "Epic", css: "linear-gradient(135deg, #EB8530, #E04724)" },
  { value: "purple-pink", label: "Purple Pink", css: "linear-gradient(135deg, #8B5CF6, #EC4899)" },
  { value: "blue-cyan", label: "Ocean", css: "linear-gradient(135deg, #3B82F6, #06B6D4)" },
  { value: "green-teal", label: "Forest", css: "linear-gradient(135deg, #10B981, #14B8A6)" },
  { value: "gold", label: "Gold", css: "linear-gradient(135deg, #F59E0B, #FCD34D)" },
  { value: "sunset", label: "Sunset", css: "linear-gradient(135deg, #F97316, #EF4444, #EC4899)" },
  { value: "rainbow", label: "Rainbow", css: "linear-gradient(90deg, #EF4444, #F59E0B, #84CC16, #06B6D4, #8B5CF6)" },
];

const TEXT_SHADOWS = [
  { value: "none", label: "None", css: "none" },
  { value: "subtle", label: "Subtle", css: "1px 1px 2px rgba(0,0,0,0.3)" },
  { value: "medium", label: "Medium", css: "2px 2px 4px rgba(0,0,0,0.5)" },
  { value: "strong", label: "Strong", css: "3px 3px 6px rgba(0,0,0,0.7)" },
  { value: "glow-white", label: "White Glow", css: "0 0 10px rgba(255,255,255,0.8), 0 0 20px rgba(255,255,255,0.6)" },
  { value: "glow-color", label: "Color Glow", css: "0 0 10px currentColor, 0 0 20px currentColor" },
];

const TEXT_PRESETS = [
  { text: "SALE 50% OFF", gradient: "linear-gradient(135deg, #EB8530, #E04724)", fontWeight: "900", shadow: "3px 3px 6px rgba(0,0,0,0.7)" },
  { text: "COMING SOON", gradient: "linear-gradient(135deg, #8B5CF6, #EC4899)", fontWeight: "800", shadow: "2px 2px 4px rgba(0,0,0,0.5)" },
  { text: "NEW ARRIVAL", gradient: "linear-gradient(135deg, #10B981, #14B8A6)", fontWeight: "700", shadow: "2px 2px 4px rgba(0,0,0,0.5)" },
  { text: "LIMITED TIME", color: "#F59E0B", fontWeight: "800", shadow: "2px 2px 4px rgba(0,0,0,0.5)" },
  { text: "SHOP NOW", gradient: "linear-gradient(135deg, #3B82F6, #06B6D4)", fontWeight: "700", shadow: "2px 2px 4px rgba(0,0,0,0.5)" },
  { text: "FREE SHIPPING", color: "#10B981", fontWeight: "700", shadow: "1px 1px 2px rgba(0,0,0,0.3)" },
  { text: "BUY 1 GET 1", gradient: "linear-gradient(135deg, #F97316, #EF4444, #EC4899)", fontWeight: "900", shadow: "3px 3px 6px rgba(0,0,0,0.7)" },
  { text: "BEST SELLER", gradient: "linear-gradient(135deg, #F59E0B, #FCD34D)", fontWeight: "800", shadow: "2px 2px 4px rgba(0,0,0,0.5)" },
  { text: "HOT DEAL", color: "#EF4444", fontWeight: "900", shadow: "3px 3px 6px rgba(0,0,0,0.7)" },
  { text: "JOIN US", gradient: "linear-gradient(90deg, #EF4444, #F59E0B, #84CC16, #06B6D4, #8B5CF6)", fontWeight: "700", shadow: "2px 2px 4px rgba(0,0,0,0.5)" },
];

export const TextToolPanel = ({ onAddText, selectedText, onUpdateText }: TextToolPanelProps) => {
  const [newText, setNewText] = useState("Your Text Here");
  const [fontSize, setFontSize] = useState(48);
  const [fontFamily, setFontFamily] = useState("Inter, sans-serif");
  const [fontWeight, setFontWeight] = useState("700");
  const [fontStyle, setFontStyle] = useState("normal");
  const [color, setColor] = useState("#FFFFFF");
  const [gradient, setGradient] = useState<string | null>(null);
  const [textShadow, setTextShadow] = useState("2px 2px 4px rgba(0,0,0,0.5)");
  const [opacity, setOpacity] = useState(100);

  const handleAddText = () => {
    if (!newText.trim()) return;
    
    const textOverlay: TextOverlay = {
      id: Date.now().toString(),
      text: newText,
      x: 50,
      y: 50,
      fontSize,
      fontFamily,
      fontWeight,
      fontStyle,
      color,
      gradient,
      textShadow,
      opacity: opacity / 100,
    };
    
    onAddText(textOverlay);
  };

  const currentText = selectedText || {
    fontSize,
    fontFamily,
    fontWeight,
    fontStyle,
    color,
    gradient,
    textShadow,
    opacity: opacity / 100,
  };

  const updateCurrentValue = (key: string, value: any) => {
    if (selectedText) {
      onUpdateText(selectedText.id, { [key]: value });
    } else {
      switch (key) {
        case "fontSize": setFontSize(value); break;
        case "fontFamily": setFontFamily(value); break;
        case "fontWeight": setFontWeight(value); break;
        case "fontStyle": setFontStyle(value); break;
        case "color": setColor(value); break;
        case "gradient": setGradient(value); break;
        case "textShadow": setTextShadow(value); break;
        case "opacity": setOpacity(value * 100); break;
      }
    }
  };

  return (
    <div className="space-y-4 p-3">
      {/* Preset Templates */}
      {!selectedText && (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Zap className="h-3.5 w-3.5 text-muted-foreground" />
            <Label className="text-xs text-muted-foreground">Quick Templates</Label>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {TEXT_PRESETS.map((preset, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setNewText(preset.text);
                  setFontWeight(preset.fontWeight);
                  setTextShadow(preset.shadow);
                  if (preset.gradient) {
                    setGradient(preset.gradient);
                  } else if (preset.color) {
                    setColor(preset.color);
                    setGradient(null);
                  }
                }}
                className="px-2 py-1 text-[10px] rounded-md bg-muted/50 hover:bg-muted border border-border/50 transition-colors truncate max-w-[100px]"
                title={preset.text}
              >
                {preset.text}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Add New Text Section */}
      {!selectedText && (
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">Add Text</Label>
          <div className="flex gap-2">
            <Input
              value={newText}
              onChange={(e) => setNewText(e.target.value)}
              placeholder="Enter your text..."
              className="text-sm h-9"
            />
            <Button size="sm" onClick={handleAddText} className="h-9 shrink-0">
              <Plus className="h-3.5 w-3.5 mr-1" />
              Add
            </Button>
          </div>
        </div>
      )}

      {/* Text Content Edit (when selected) */}
      {selectedText && (
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">Edit Text</Label>
          <Input
            value={selectedText.text}
            onChange={(e) => onUpdateText(selectedText.id, { text: e.target.value })}
            className="text-sm h-9"
          />
        </div>
      )}

      {/* Font Family */}
      <div className="space-y-2">
        <Label className="text-xs text-muted-foreground">Font Family</Label>
        <Select 
          value={currentText.fontFamily} 
          onValueChange={(v) => updateCurrentValue("fontFamily", v)}
        >
          <SelectTrigger className="h-9 text-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-popover border-border">
            {FONT_FAMILIES.map((font) => (
              <SelectItem 
                key={font.value} 
                value={font.value}
                style={{ fontFamily: font.value }}
              >
                {font.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Font Size */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-xs text-muted-foreground">Font Size</Label>
          <span className="text-xs text-muted-foreground">{currentText.fontSize}px</span>
        </div>
        <Slider
          value={[currentText.fontSize]}
          onValueChange={([v]) => updateCurrentValue("fontSize", v)}
          min={12}
          max={200}
          step={1}
          className="w-full"
        />
      </div>

      {/* Font Weight & Style */}
      <div className="grid grid-cols-2 gap-2">
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">Weight</Label>
          <Select 
            value={currentText.fontWeight} 
            onValueChange={(v) => updateCurrentValue("fontWeight", v)}
          >
            <SelectTrigger className="h-9 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-popover border-border">
              {FONT_WEIGHTS.map((weight) => (
                <SelectItem key={weight.value} value={weight.value}>
                  {weight.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">Style</Label>
          <Select 
            value={currentText.fontStyle} 
            onValueChange={(v) => updateCurrentValue("fontStyle", v)}
          >
            <SelectTrigger className="h-9 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-popover border-border">
              <SelectItem value="normal">Normal</SelectItem>
              <SelectItem value="italic">Italic</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Colors Section */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Palette className="h-3.5 w-3.5 text-muted-foreground" />
          <Label className="text-xs text-muted-foreground">Text Color</Label>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {PRESET_COLORS.map((c) => (
            <button
              key={c}
              onClick={() => {
                updateCurrentValue("color", c);
                updateCurrentValue("gradient", null);
              }}
              className={cn(
                "w-7 h-7 rounded-md border-2 transition-all hover:scale-110",
                currentText.color === c && !currentText.gradient
                  ? "border-primary ring-2 ring-primary/30"
                  : "border-border/50"
              )}
              style={{ backgroundColor: c }}
            />
          ))}
          <input
            type="color"
            value={currentText.color}
            onChange={(e) => {
              updateCurrentValue("color", e.target.value);
              updateCurrentValue("gradient", null);
            }}
            className="w-7 h-7 rounded-md cursor-pointer border-2 border-border/50"
          />
        </div>
      </div>

      {/* Gradients Section */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Sparkles className="h-3.5 w-3.5 text-muted-foreground" />
          <Label className="text-xs text-muted-foreground">Gradient</Label>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {PRESET_GRADIENTS.map((g) => (
            <button
              key={g.value}
              onClick={() => updateCurrentValue("gradient", g.value === "none" ? null : g.css)}
              className={cn(
                "w-7 h-7 rounded-md border-2 transition-all hover:scale-110",
                currentText.gradient === g.css || (g.value === "none" && !currentText.gradient)
                  ? "border-primary ring-2 ring-primary/30"
                  : "border-border/50"
              )}
              style={{ 
                background: g.css || "#272727",
              }}
              title={g.label}
            />
          ))}
        </div>
      </div>

      {/* Text Shadow */}
      <div className="space-y-2">
        <Label className="text-xs text-muted-foreground">Text Shadow</Label>
        <Select 
          value={TEXT_SHADOWS.find(s => s.css === currentText.textShadow)?.value || "medium"} 
          onValueChange={(v) => {
            const shadow = TEXT_SHADOWS.find(s => s.value === v);
            updateCurrentValue("textShadow", shadow?.css || "none");
          }}
        >
          <SelectTrigger className="h-9 text-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-popover border-border">
            {TEXT_SHADOWS.map((shadow) => (
              <SelectItem key={shadow.value} value={shadow.value}>
                {shadow.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Opacity */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-xs text-muted-foreground">Opacity</Label>
          <span className="text-xs text-muted-foreground">{Math.round(currentText.opacity * 100)}%</span>
        </div>
        <Slider
          value={[currentText.opacity * 100]}
          onValueChange={([v]) => updateCurrentValue("opacity", v / 100)}
          min={10}
          max={100}
          step={5}
          className="w-full"
        />
      </div>

      {/* Preview */}
      <div className="mt-4 p-4 bg-muted/30 rounded-lg border border-border/50">
        <Label className="text-xs text-muted-foreground mb-2 block">Preview</Label>
        <div 
          className="min-h-[60px] flex items-center justify-center overflow-hidden"
          style={{
            fontFamily: currentText.fontFamily,
            fontSize: Math.min(currentText.fontSize, 32),
            fontWeight: currentText.fontWeight,
            fontStyle: currentText.fontStyle,
            color: currentText.gradient ? "transparent" : currentText.color,
            background: currentText.gradient || "transparent",
            backgroundClip: currentText.gradient ? "text" : "unset",
            WebkitBackgroundClip: currentText.gradient ? "text" : "unset",
            textShadow: currentText.gradient ? "none" : currentText.textShadow,
            opacity: currentText.opacity,
          }}
        >
          {selectedText?.text || newText || "Preview Text"}
        </div>
      </div>
    </div>
  );
};
