import { useRef } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Crop, Type, Upload, X, Wand2 } from "lucide-react";

interface EditorToolbarProps {
  isCropping: boolean;
  showTextTool: boolean;
  isInpainting: boolean;
  onCropToggle: () => void;
  onTextToolToggle: () => void;
  onInpaintToggle: () => void;
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCancelCrop: () => void;
  isDisabled?: boolean;
}

export const EditorToolbar = ({
  isCropping,
  showTextTool,
  isInpainting,
  onCropToggle,
  onTextToolToggle,
  onInpaintToggle,
  onFileUpload,
  onCancelCrop,
  isDisabled = false,
}: EditorToolbarProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <TooltipProvider delayDuration={300}>
      <div className="flex items-center gap-1 px-2 py-1.5 rounded-lg bg-muted/30 border border-border/20">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={onFileUpload}
          className="hidden"
        />

        {/* Crop Tool */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "h-8 w-8 rounded-lg transition-all",
                isCropping 
                  ? "bg-primary/20 text-primary ring-1 ring-primary/30" 
                  : "hover:bg-muted/50"
              )}
              onClick={isCropping ? onCancelCrop : onCropToggle}
              disabled={isDisabled}
            >
              {isCropping ? <X className="h-4 w-4" /> : <Crop className="h-4 w-4" />}
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom" className="text-xs">
            {isCropping ? "Cancel Crop" : "Crop Image"}
          </TooltipContent>
        </Tooltip>

        {/* Text Tool */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "h-8 w-8 rounded-lg transition-all",
                showTextTool 
                  ? "bg-primary/20 text-primary ring-1 ring-primary/30" 
                  : "hover:bg-muted/50"
              )}
              onClick={onTextToolToggle}
              disabled={isDisabled || isInpainting}
            >
              <Type className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom" className="text-xs">
            Add Text
          </TooltipContent>
        </Tooltip>

        {/* Inpainting Tool */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "h-8 w-8 rounded-lg transition-all",
                isInpainting 
                  ? "bg-primary/20 text-primary ring-1 ring-primary/30" 
                  : "hover:bg-muted/50"
              )}
              onClick={onInpaintToggle}
              disabled={isDisabled}
            >
              <Wand2 className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom" className="text-xs">
            {isInpainting ? "Exit Inpainting" : "Inpaint / Object Removal"}
          </TooltipContent>
        </Tooltip>

        {/* Upload Image */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-lg hover:bg-muted/50"
              onClick={handleUploadClick}
              disabled={isDisabled}
            >
              <Upload className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom" className="text-xs">
            Upload Image Overlay
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
};
