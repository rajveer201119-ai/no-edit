import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";
import { ImageVersion } from "./types";
import { VersionHistory } from "./VersionHistory";
import { EditorToolbar } from "./EditorToolbar";
import { CanvasOverlays, ImageOverlay } from "./CanvasOverlays";
import { MaskCanvas } from "./MaskCanvas";
import { InpaintingPanel } from "./InpaintingPanel";
import { TextToolPanel, TextOverlay } from "@/components/TextToolPanel";
import { 
  Download, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Maximize2,
  Lock,
  Loader2,
  Check,
  X,
  Wand2,
  Trash2,
  Sparkles,
  Send
} from "lucide-react";

// Mobile-specific inpaint form component
const MobileInpaintForm = ({ 
  maskDataUrl, 
  onInpaint, 
  isProcessing 
}: { 
  maskDataUrl: string; 
  onInpaint: (prompt: string, mask: string) => void; 
  isProcessing: boolean;
}) => {
  const [prompt, setPrompt] = useState("");
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    onInpaint(prompt.trim(), maskDataUrl);
    setPrompt("");
  };
  
  return (
    <div className="space-y-2">
      <span className="text-xs text-muted-foreground">Custom Edit</span>
      <form onSubmit={handleSubmit} className="space-y-2">
        <Input
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe what to put here..."
          className="text-sm"
          disabled={isProcessing}
        />
        <Button
          type="submit"
          className="w-full"
          size="sm"
          disabled={!prompt.trim() || isProcessing}
        >
          {isProcessing ? (
            <>Processing...</>
          ) : (
            <>
              <Send className="h-4 w-4 mr-2" />
              Apply Edit
            </>
          )}
        </Button>
      </form>
    </div>
  );
};

interface CropArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface PreviewPanelProps {
  versions: ImageVersion[];
  currentVersion: ImageVersion;
  isPremium: boolean;
  isProcessing: boolean;
  onSelectVersion: (version: ImageVersion) => void;
  onDownload: () => void;
  onUpgradeClick: () => void;
  // Manual editing props
  isCropping: boolean;
  cropArea: CropArea | null;
  overlays: ImageOverlay[];
  textOverlays: TextOverlay[];
  activeOverlayId: string | null;
  activeTextId: string | null;
  showTextTool: boolean;
  selectedText: TextOverlay | null;
  onCropToggle: () => void;
  onCancelCrop: () => void;
  onApplyCrop: () => void;
  onCropPointerDown: (e: React.MouseEvent | React.TouchEvent) => void;
  onCropPointerMove: (e: React.MouseEvent | React.TouchEvent) => void;
  onCropPointerUp: () => void;
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onTextToolToggle: () => void;
  onOverlayPointerDown: (e: React.MouseEvent | React.TouchEvent, overlayId: string) => void;
  onResizeOverlay: (overlayId: string, delta: number) => void;
  onRemoveOverlay: (overlayId: string) => void;
  onTextPointerDown: (e: React.MouseEvent | React.TouchEvent, textId: string) => void;
  onResizeText: (textId: string, delta: number) => void;
  onRemoveText: (textId: string) => void;
  onAddText: (text: TextOverlay) => void;
  onUpdateText: (id: string, updates: Partial<TextOverlay>) => void;
  imageContainerRef: React.RefObject<HTMLDivElement>;
  // Inpainting props
  onInpaintEdit: (prompt: string, maskDataUrl: string) => void;
}

export const PreviewPanel = ({
  versions,
  currentVersion,
  isPremium,
  isProcessing,
  onSelectVersion,
  onDownload,
  onUpgradeClick,
  // Manual editing props
  isCropping,
  cropArea,
  overlays,
  textOverlays,
  activeOverlayId,
  activeTextId,
  showTextTool,
  selectedText,
  onCropToggle,
  onCancelCrop,
  onApplyCrop,
  onCropPointerDown,
  onCropPointerMove,
  onCropPointerUp,
  onFileUpload,
  onTextToolToggle,
  onOverlayPointerDown,
  onResizeOverlay,
  onRemoveOverlay,
  onTextPointerDown,
  onResizeText,
  onRemoveText,
  onAddText,
  onUpdateText,
  imageContainerRef,
  onInpaintEdit,
}: PreviewPanelProps) => {
  const [zoom, setZoom] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const isMobile = useIsMobile();
  
  // Inpainting state
  const [isInpainting, setIsInpainting] = useState(false);
  const [isDrawingMask, setIsDrawingMask] = useState(false);
  const [maskDataUrl, setMaskDataUrl] = useState<string | null>(null);
  const [imageDimensions, setImageDimensions] = useState({ width: 1024, height: 1024 });
  const imageRef = useRef<HTMLImageElement>(null);

  // Get image dimensions when loaded
  useEffect(() => {
    const img = imageRef.current;
    if (img && img.complete) {
      setImageDimensions({ width: img.naturalWidth, height: img.naturalHeight });
    }
  }, [currentVersion.imageUrl]);

  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    setImageDimensions({ width: img.naturalWidth, height: img.naturalHeight });
  };

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 0.25, 3));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 0.25, 0.5));
  const handleResetZoom = () => setZoom(1);

  const handleInpaintToggle = () => {
    if (isInpainting) {
      setIsInpainting(false);
      setIsDrawingMask(false);
      setMaskDataUrl(null);
    } else {
      setIsInpainting(true);
      setIsDrawingMask(true);
    }
  };

  const handleMaskComplete = (mask: string) => {
    setMaskDataUrl(mask);
    setIsDrawingMask(false);
  };

  const handleClearMask = () => {
    setMaskDataUrl(null);
    setIsDrawingMask(true);
  };

  const handleInpaint = (prompt: string, mask: string) => {
    onInpaintEdit(prompt, mask);
    // Close inpainting mode after submitting
    setIsInpainting(false);
    setIsDrawingMask(false);
    setMaskDataUrl(null);
  };

  const currentIndex = versions.findIndex(v => v.id === currentVersion.id) + 1;

  return (
    <div className="flex flex-col h-full w-full bg-[#0a0a0a] overflow-hidden">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-2 sm:px-4 py-2 sm:py-3 border-b border-border/10 bg-background/40 backdrop-blur-sm flex-wrap gap-2">
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Manual Tools */}
          <EditorToolbar
            isCropping={isCropping}
            showTextTool={showTextTool}
            isInpainting={isInpainting}
            onCropToggle={onCropToggle}
            onTextToolToggle={onTextToolToggle}
            onInpaintToggle={handleInpaintToggle}
            onFileUpload={onFileUpload}
            onCancelCrop={onCancelCrop}
            isDisabled={isProcessing}
          />
          
          <div className="hidden sm:block w-px h-6 bg-border/20" />
          
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-muted/30 border border-border/20">
            <span className="text-xs font-mono text-muted-foreground">v{currentIndex}</span>
            <span className="text-border/50">|</span>
            <span className="text-xs font-mono text-primary">{Math.round(zoom * 100)}%</span>
          </div>
        </div>
        
        <div className="flex items-center gap-1">
          {/* Crop Apply Button */}
          {isCropping && cropArea && cropArea.width > 0 && (
            <Button
              variant="default"
              size="sm"
              className="h-8 rounded-lg text-xs font-medium mr-2"
              onClick={onApplyCrop}
            >
              <Check className="h-3.5 w-3.5 mr-1.5" />
              Apply Crop
            </Button>
          )}
          
          <div className="hidden sm:flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-lg hover:bg-muted/50"
              onClick={handleZoomOut}
            >
              <ZoomOut className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-lg hover:bg-muted/50"
              onClick={handleZoomIn}
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-lg hover:bg-muted/50"
              onClick={handleResetZoom}
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
            
            <div className="w-px h-5 bg-border/20 mx-1" />
            
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-lg hover:bg-muted/50"
              onClick={() => setIsFullscreen(!isFullscreen)}
            >
              <Maximize2 className="h-4 w-4" />
            </Button>
          </div>
          
          <Button
            variant="outline"
            size="sm"
            className={cn(
              "h-8 rounded-lg text-xs font-medium border-border/30",
              !isPremium && "opacity-70"
            )}
            onClick={isPremium ? onDownload : onUpgradeClick}
          >
            {!isPremium && <Lock className="h-3 w-3 mr-1.5" />}
            <Download className="h-3.5 w-3.5 mr-1.5" />
            Download
          </Button>
        </div>
      </div>

      {/* Main Area with Canvas and Text Tool */}
      <div className="flex-1 flex min-h-0 overflow-hidden">
        {/* Canvas Area */}
        <div className="flex-1 relative overflow-auto flex items-center justify-center p-4 sm:p-6">
          {/* Grid background */}
          <div 
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `
                linear-gradient(to right, hsl(var(--foreground)) 1px, transparent 1px),
                linear-gradient(to bottom, hsl(var(--foreground)) 1px, transparent 1px)
              `,
              backgroundSize: '32px 32px'
            }}
          />
          
          {/* Processing overlay */}
          {isProcessing && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/60 backdrop-blur-sm">
              <div className="flex flex-col items-center gap-4">
                <div className="relative">
                  <div className="w-16 h-16 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
                  <Loader2 className="absolute inset-0 m-auto h-6 w-6 text-primary animate-pulse" />
                </div>
                <p className="text-sm font-medium text-foreground">Creating new version...</p>
              </div>
            </div>
          )}

          {/* Image container with overlays - centered */}
          <div
            ref={imageContainerRef}
            className={cn(
              "relative transition-transform duration-300 ease-out select-none mx-auto",
              isProcessing && "opacity-50",
              isCropping && "cursor-crosshair"
            )}
            style={{ transform: `scale(${zoom})` }}
            onMouseDown={isCropping ? onCropPointerDown : undefined}
            onMouseMove={isCropping ? onCropPointerMove : undefined}
            onMouseUp={isCropping ? onCropPointerUp : undefined}
            onTouchStart={isCropping ? onCropPointerDown : undefined}
            onTouchMove={isCropping ? onCropPointerMove : undefined}
            onTouchEnd={isCropping ? onCropPointerUp : undefined}
          >
            <img
              ref={imageRef}
              src={currentVersion.imageUrl}
              alt="Current version"
              className="max-w-full max-h-full rounded-lg shadow-2xl shadow-black/50 object-contain block mx-auto"
              style={{ maxHeight: 'calc(100vh - 200px)' }}
              draggable={false}
              onLoad={handleImageLoad}
            />
            
            {/* Mask Drawing Canvas */}
            {isDrawingMask && (
              <MaskCanvas
                imageUrl={currentVersion.imageUrl}
                imageWidth={imageDimensions.width}
                imageHeight={imageDimensions.height}
                onMaskComplete={handleMaskComplete}
                onCancel={handleInpaintToggle}
              />
            )}
            
            {/* Overlays */}
            <CanvasOverlays
              overlays={overlays}
              textOverlays={textOverlays}
              activeOverlayId={activeOverlayId}
              activeTextId={activeTextId}
              cropArea={cropArea}
              isCropping={isCropping}
              onOverlayPointerDown={onOverlayPointerDown}
              onTextPointerDown={onTextPointerDown}
              onResizeOverlay={onResizeOverlay}
              onRemoveOverlay={onRemoveOverlay}
              onResizeText={onResizeText}
              onRemoveText={onRemoveText}
            />
            
            {/* Cinematic vignette */}
            <div className="absolute inset-0 rounded-lg pointer-events-none shadow-[inset_0_0_100px_rgba(0,0,0,0.3)]" />
          </div>
        </div>

        {/* Text Tool Panel - Desktop Sidebar */}
        {showTextTool && !isMobile && (
          <div className="w-72 border-l border-border/10 bg-background/40 backdrop-blur-sm">
            <div className="flex items-center justify-between px-3 py-2 border-b border-border/10">
              <span className="text-sm font-medium">Text Tool</span>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={onTextToolToggle}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <ScrollArea className="h-[calc(100%-40px)]">
              <TextToolPanel
                onAddText={onAddText}
                selectedText={selectedText}
                onUpdateText={onUpdateText}
              />
            </ScrollArea>
          </div>
        )}

        {/* Inpainting Panel - Desktop Sidebar */}
        {isInpainting && !isDrawingMask && !isMobile && (
          <InpaintingPanel
            maskDataUrl={maskDataUrl}
            onInpaint={handleInpaint}
            onClearMask={handleClearMask}
            onClose={handleInpaintToggle}
            isProcessing={isProcessing}
          />
        )}
      </div>

      {/* Mobile Text Tool Sheet */}
      <Sheet open={showTextTool && isMobile} onOpenChange={(open) => !open && onTextToolToggle()}>
        <SheetContent side="bottom" className="h-[70vh] rounded-t-2xl">
          <SheetHeader className="pb-2">
            <SheetTitle>Text Tool</SheetTitle>
          </SheetHeader>
          <ScrollArea className="h-[calc(100%-60px)]">
            <TextToolPanel
              onAddText={onAddText}
              selectedText={selectedText}
              onUpdateText={onUpdateText}
            />
          </ScrollArea>
        </SheetContent>
      </Sheet>

      {/* Mobile Inpainting Sheet */}
      <Sheet open={isInpainting && !isDrawingMask && isMobile} onOpenChange={(open) => !open && handleInpaintToggle()}>
        <SheetContent side="bottom" className="h-[70vh] rounded-t-2xl flex flex-col p-0">
          <div className="flex items-center justify-between px-4 py-3 border-b border-border/10 shrink-0">
            <div className="flex items-center gap-2">
              <Wand2 className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">Inpainting</span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={handleInpaintToggle}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <ScrollArea className="flex-1">
            <div className="p-4 space-y-4">
              {/* Mask preview */}
              {maskDataUrl && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Mask Preview</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 text-xs text-destructive hover:text-destructive"
                      onClick={handleClearMask}
                    >
                      Clear mask
                    </Button>
                  </div>
                  <div className="relative rounded-lg overflow-hidden border border-border/30 bg-muted/20">
                    <img
                      src={maskDataUrl}
                      alt="Mask preview"
                      className="w-full h-auto max-h-32 object-contain"
                    />
                  </div>
                </div>
              )}

              {/* No mask state */}
              {!maskDataUrl && (
                <div className="text-center py-6">
                  <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-muted/50 flex items-center justify-center">
                    <Wand2 className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Draw a mask on the image to select the area you want to edit
                  </p>
                </div>
              )}

              {/* Quick prompts */}
              {maskDataUrl && (
                <div className="space-y-2">
                  <span className="text-xs text-muted-foreground">Quick Actions</span>
                  <div className="grid grid-cols-2 gap-2">
                    <Button variant="outline" size="sm" className="h-auto py-2 px-3 flex flex-col items-center gap-1 text-xs" onClick={() => handleInpaint("Remove the object completely, fill with natural background", maskDataUrl)} disabled={isProcessing}>
                      <Trash2 className="h-4 w-4" />
                      Remove object
                    </Button>
                    <Button variant="outline" size="sm" className="h-auto py-2 px-3 flex flex-col items-center gap-1 text-xs" onClick={() => handleInpaint("Enhance and improve the details in this area, make it sharper and more refined", maskDataUrl)} disabled={isProcessing}>
                      <Sparkles className="h-4 w-4" />
                      Enhance details
                    </Button>
                  </div>
                </div>
              )}

              {/* Custom prompt */}
              {maskDataUrl && (
                <MobileInpaintForm
                  maskDataUrl={maskDataUrl}
                  onInpaint={handleInpaint}
                  isProcessing={isProcessing}
                />
              )}

              {/* Tips */}
              <div className="space-y-2 pt-2 border-t border-border/10">
                <span className="text-xs text-muted-foreground">Tips</span>
                <ul className="text-xs text-muted-foreground space-y-1.5">
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    Be specific about what you want
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    Mention lighting and style to match
                  </li>
                </ul>
              </div>

              {/* Text Warning */}
              <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
                <p className="text-xs text-amber-500/90">
                  <strong>Note:</strong> AI models struggle with text. Use the <strong>Text Tool</strong> instead.
                </p>
              </div>
            </div>
          </ScrollArea>
        </SheetContent>
      </Sheet>

      {/* Version History */}
      <VersionHistory
        versions={versions}
        currentVersionId={currentVersion.id}
        onSelectVersion={onSelectVersion}
      />
    </div>
  );
};
