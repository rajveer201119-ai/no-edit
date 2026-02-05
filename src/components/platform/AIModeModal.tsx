 import { useState, useCallback } from "react";
 import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
 import { Button } from "@/components/ui/button";
 import { Label } from "@/components/ui/label";
 import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
 import { cn } from "@/lib/utils";
 import { toast } from "sonner";
 import { 
   Zap, 
   Square, 
   RectangleVertical, 
   RectangleHorizontal, 
   Smartphone,
   Image,
   FileText,
   Video,
   Megaphone,
   Award,
   Palette,
   Sparkles,
   Wand2
 } from "lucide-react";
 import type { Template, TemplateElement } from "./templates";
 import type { DesignCategory } from "./DesignTypeModal";
 
 interface AIModeModalProps {
   open: boolean;
   onOpenChange: (open: boolean) => void;
   onGenerate: (template: Template) => void;
 }
 
 // Ratio options
 const ratioOptions = [
   { id: "square", label: "Square", aspect: "1:1", width: 1080, height: 1080, icon: Square },
   { id: "portrait", label: "Portrait", aspect: "4:5", width: 1080, height: 1350, icon: RectangleVertical },
   { id: "story", label: "Story", aspect: "9:16", width: 1080, height: 1920, icon: Smartphone },
   { id: "landscape", label: "Landscape", aspect: "16:9", width: 1920, height: 1080, icon: RectangleHorizontal },
 ];
 
 // Design type options
 const designTypeOptions = [
   { id: "poster", label: "Poster", icon: FileText, category: "poster" as DesignCategory },
   { id: "logo", label: "Logo", icon: Award, category: "logo" as DesignCategory },
   { id: "instagram", label: "Instagram Post", icon: Image, category: "instagram" as DesignCategory },
   { id: "youtube", label: "YouTube Thumbnail", icon: Video, category: "youtube" as DesignCategory },
   { id: "flyer", label: "Flyer", icon: Megaphone, category: "poster" as DesignCategory },
   { id: "banner", label: "Ad Banner", icon: RectangleHorizontal, category: "presentation" as DesignCategory },
 ];
 
 // Theme options
 const themeOptions = [
   { id: "minimal", label: "Minimal", colors: ["#ffffff", "#f5f5f5", "#1a1a1a"], fontWeight: "normal" },
   { id: "professional", label: "Professional", colors: ["#1e293b", "#3b82f6", "#ffffff"], fontWeight: "bold" },
   { id: "bold", label: "Bold", colors: ["#dc2626", "#fbbf24", "#1a1a1a"], fontWeight: "bold" },
   { id: "fun", label: "Fun", colors: ["#ec4899", "#8b5cf6", "#22d3ee"], fontWeight: "bold" },
 ];
 
 // Background color presets
 const colorPresets = [
   "#ffffff", "#f5f5f5", "#1a1a1a", "#0f172a", 
   "#3b82f6", "#8b5cf6", "#ec4899", "#22c55e",
   "#f59e0b", "#ef4444", "#667eea", "#14b8a6",
 ];
 
 // Gradient presets
 const gradientPresets = [
   { id: "purple-blue", colors: ["#667eea", "#764ba2"] },
   { id: "pink-orange", colors: ["#ec4899", "#f59e0b"] },
   { id: "blue-cyan", colors: ["#3b82f6", "#22d3ee"] },
   { id: "dark-purple", colors: ["#1a1a2e", "#7c3aed"] },
 ];
 
 export const AIModeModal = ({ open, onOpenChange, onGenerate }: AIModeModalProps) => {
   const [selectedRatio, setSelectedRatio] = useState("square");
   const [selectedType, setSelectedType] = useState("poster");
   const [selectedTheme, setSelectedTheme] = useState("professional");
   const [selectedColor, setSelectedColor] = useState("#1a1a1a");
   const [useGradient, setUseGradient] = useState(false);
   const [selectedGradient, setSelectedGradient] = useState("purple-blue");
   const [isGenerating, setIsGenerating] = useState(false);
 
   // Generate template based on selections
   const handleGenerate = useCallback(() => {
     setIsGenerating(true);
 
     // Get dimensions from ratio
     const ratio = ratioOptions.find(r => r.id === selectedRatio) || ratioOptions[0];
     const designType = designTypeOptions.find(d => d.id === selectedType) || designTypeOptions[0];
     const theme = themeOptions.find(t => t.id === selectedTheme) || themeOptions[0];
     const gradient = gradientPresets.find(g => g.id === selectedGradient);
 
     // Determine background color
     const bgColor = useGradient && gradient ? gradient.colors[0] : selectedColor;
     const secondaryColor = useGradient && gradient ? gradient.colors[1] : theme.colors[1];
     const textColor = isLightColor(bgColor) ? "#1a1a1a" : "#ffffff";
     const accentColor = theme.colors[1];
 
     // Build template elements based on design type
     const elements: TemplateElement[] = [];
 
     // Background
     elements.push({
       id: "bg",
       type: "shape",
       x: 0,
       y: 0,
       width: ratio.width,
       height: ratio.height,
       backgroundColor: bgColor,
     });
 
     // Gradient overlay if using gradient
     if (useGradient && gradient) {
       elements.push({
         id: "gradient-overlay",
         type: "shape",
         x: 0,
         y: ratio.height / 2,
         width: ratio.width,
         height: ratio.height / 2,
         backgroundColor: secondaryColor,
       });
     }
 
     // Add design-type-specific elements
     const padding = Math.min(ratio.width, ratio.height) * 0.08;
     const headlineSize = Math.min(ratio.width, ratio.height) * 0.1;
     const bodySize = headlineSize * 0.35;
 
     // Headline
     elements.push({
       id: "headline",
       type: "text",
       x: padding,
       y: ratio.height * 0.25,
       width: ratio.width - padding * 2,
       height: headlineSize * 2,
       content: getHeadlineText(selectedType),
       fontSize: headlineSize,
       fontWeight: theme.fontWeight,
       color: textColor,
     });
 
     // Subheadline
     elements.push({
       id: "subhead",
       type: "text",
       x: padding,
       y: ratio.height * 0.25 + headlineSize * 2.2,
       width: ratio.width - padding * 2,
       height: bodySize * 2,
       content: getSubheadText(selectedType),
       fontSize: bodySize,
       color: adjustOpacity(textColor, 0.8),
     });
 
     // Accent element
     elements.push({
       id: "accent",
       type: "shape",
       x: padding,
       y: ratio.height * 0.25 + headlineSize * 2.2 + bodySize * 2.5,
       width: ratio.width * 0.15,
       height: 6,
       backgroundColor: accentColor,
       borderRadius: 3,
     });
 
     // CTA for social/marketing types
     if (["instagram", "youtube", "flyer", "banner"].includes(selectedType)) {
       elements.push({
         id: "cta",
         type: "text",
         x: padding,
         y: ratio.height * 0.85,
         width: ratio.width - padding * 2,
         height: bodySize,
         content: getCtaText(selectedType),
         fontSize: bodySize * 0.7,
         color: accentColor,
       });
     }
 
     // Build the template
     const template: Template = {
       id: `ai-mode-${Date.now()}`,
       name: `${designType.label} - ${theme.label}`,
       category: designType.category,
       thumbnailUrl: "",
       canvasWidth: ratio.width,
       canvasHeight: ratio.height,
       elements,
     };
 
     // Simulate a short delay for "generation"
     setTimeout(() => {
       setIsGenerating(false);
       onGenerate(template);
       onOpenChange(false);
       toast.success("Smart template ready. Customize it your way.", { duration: 3000 });
     }, 800);
   }, [selectedRatio, selectedType, selectedTheme, selectedColor, useGradient, selectedGradient, onGenerate, onOpenChange]);
 
   return (
     <Dialog open={open} onOpenChange={onOpenChange}>
       <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
         <DialogHeader>
           <DialogTitle className="flex items-center gap-2 text-xl">
             <Zap className="h-5 w-5 text-primary" />
             AI Mode
           </DialogTitle>
           <p className="text-sm text-muted-foreground">
             Select your preferences and we'll generate a smart starter template
           </p>
         </DialogHeader>
 
         <div className="space-y-6 py-4">
           {/* Ratio Selector */}
           <div className="space-y-3">
             <Label className="text-sm font-medium">Canvas Ratio</Label>
             <div className="grid grid-cols-4 gap-2">
               {ratioOptions.map((ratio) => {
                 const Icon = ratio.icon;
                 return (
                   <button
                     key={ratio.id}
                     onClick={() => setSelectedRatio(ratio.id)}
                     className={cn(
                       "flex flex-col items-center gap-1 p-3 rounded-lg border transition-all min-h-[72px]",
                       selectedRatio === ratio.id
                         ? "border-primary bg-primary/10 text-primary"
                         : "border-border hover:border-primary/50"
                     )}
                   >
                     <Icon className="h-5 w-5" />
                     <span className="text-xs font-medium">{ratio.label}</span>
                     <span className="text-[10px] text-muted-foreground">{ratio.aspect}</span>
                   </button>
                 );
               })}
             </div>
           </div>
 
           {/* Design Type */}
           <div className="space-y-3">
             <Label className="text-sm font-medium">Design Type</Label>
             <div className="grid grid-cols-3 gap-2">
               {designTypeOptions.map((type) => {
                 const Icon = type.icon;
                 return (
                   <button
                     key={type.id}
                     onClick={() => setSelectedType(type.id)}
                     className={cn(
                       "flex flex-col items-center gap-1 p-3 rounded-lg border transition-all min-h-[64px]",
                       selectedType === type.id
                         ? "border-primary bg-primary/10 text-primary"
                         : "border-border hover:border-primary/50"
                     )}
                   >
                     <Icon className="h-5 w-5" />
                     <span className="text-xs font-medium">{type.label}</span>
                   </button>
                 );
               })}
             </div>
           </div>
 
           {/* Background Color */}
           <div className="space-y-3">
             <div className="flex items-center justify-between">
               <Label className="text-sm font-medium">Background</Label>
               <button
                 onClick={() => setUseGradient(!useGradient)}
                 className={cn(
                   "text-xs px-2 py-1 rounded-full transition-colors",
                   useGradient ? "bg-primary text-primary-foreground" : "bg-muted"
                 )}
               >
                 {useGradient ? "Gradient" : "Solid"}
               </button>
             </div>
 
             {!useGradient ? (
               <div className="flex flex-wrap gap-2">
                 {colorPresets.map((color) => (
                   <button
                     key={color}
                     onClick={() => setSelectedColor(color)}
                     className={cn(
                       "w-8 h-8 rounded-lg border-2 transition-all",
                       selectedColor === color ? "border-primary scale-110" : "border-transparent"
                     )}
                     style={{ backgroundColor: color }}
                   />
                 ))}
               </div>
             ) : (
               <div className="flex gap-2">
                 {gradientPresets.map((gradient) => (
                   <button
                     key={gradient.id}
                     onClick={() => setSelectedGradient(gradient.id)}
                     className={cn(
                       "flex-1 h-10 rounded-lg border-2 transition-all",
                       selectedGradient === gradient.id ? "border-primary scale-105" : "border-transparent"
                     )}
                     style={{
                       background: `linear-gradient(135deg, ${gradient.colors[0]}, ${gradient.colors[1]})`,
                     }}
                   />
                 ))}
               </div>
             )}
           </div>
 
           {/* Theme */}
           <div className="space-y-3">
             <Label className="text-sm font-medium">Theme Style</Label>
             <div className="grid grid-cols-4 gap-2">
               {themeOptions.map((theme) => (
                 <button
                   key={theme.id}
                   onClick={() => setSelectedTheme(theme.id)}
                   className={cn(
                     "flex flex-col items-center gap-1 p-3 rounded-lg border transition-all",
                     selectedTheme === theme.id
                       ? "border-primary bg-primary/10"
                       : "border-border hover:border-primary/50"
                   )}
                 >
                   <div className="flex gap-0.5">
                     {theme.colors.slice(0, 3).map((color, i) => (
                       <div
                         key={i}
                         className="w-3 h-3 rounded-full"
                         style={{ backgroundColor: color }}
                       />
                     ))}
                   </div>
                   <span className="text-xs font-medium">{theme.label}</span>
                 </button>
               ))}
             </div>
           </div>
         </div>
 
         {/* Generate Button */}
         <Button
           onClick={handleGenerate}
           disabled={isGenerating}
           className="w-full gap-2 h-12 text-base"
           size="lg"
         >
           {isGenerating ? (
             <>
               <Sparkles className="h-5 w-5 animate-spin" />
               Generating...
             </>
           ) : (
             <>
               <Wand2 className="h-5 w-5" />
               Generate Smart Template
             </>
           )}
         </Button>
       </DialogContent>
     </Dialog>
   );
 };
 
 // Helper functions
 function isLightColor(hex: string): boolean {
   const c = hex.replace("#", "");
   const r = parseInt(c.substring(0, 2), 16);
   const g = parseInt(c.substring(2, 4), 16);
   const b = parseInt(c.substring(4, 6), 16);
   const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
   return luminance > 0.5;
 }
 
 function adjustOpacity(hex: string, opacity: number): string {
   // For simplicity, return the hex as-is (CSS handles text opacity differently)
   return hex;
 }
 
 function getHeadlineText(type: string): string {
   const texts: Record<string, string> = {
     poster: "YOUR\nHEADLINE",
     logo: "BRAND\nNAME",
     instagram: "MAKE IT\nHAPPEN",
     youtube: "WATCH\nTHIS!",
     flyer: "BIG\nEVENT",
     banner: "SPECIAL\nOFFER",
   };
   return texts[type] || "YOUR TITLE";
 }
 
 function getSubheadText(type: string): string {
   const texts: Record<string, string> = {
     poster: "Add your message here",
     logo: "Your tagline goes here",
     instagram: "Double-tap if you agree 💪",
     youtube: "You won't believe what happens next...",
     flyer: "Date • Time • Location",
     banner: "Limited time only!",
   };
   return texts[type] || "Add your message";
 }
 
 function getCtaText(type: string): string {
   const texts: Record<string, string> = {
     instagram: "@yourbrand • Link in Bio",
     youtube: "Subscribe for more →",
     flyer: "RSVP Now • yourdomain.com",
     banner: "Shop Now →",
   };
   return texts[type] || "Learn More →";
 }