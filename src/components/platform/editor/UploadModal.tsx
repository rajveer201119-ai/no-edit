import { useState, useRef, useCallback } from "react";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Upload, Image as ImageIcon, X, AlertCircle, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

interface UploadModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onImageUpload: (imageData: string, fileName: string, dimensions: { width: number; height: number }) => void;
}

type UploadStatus = "idle" | "dragging" | "uploading" | "success" | "error";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_TYPES = ["image/png", "image/jpeg", "image/jpg", "image/webp"];

export const UploadModal = ({ open, onOpenChange, onImageUpload }: UploadModalProps) => {
  const [status, setStatus] = useState<UploadStatus>("idle");
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const resetState = () => {
    setStatus("idle");
    setProgress(0);
    setError(null);
    setPreview(null);
  };

  const validateFile = (file: File): string | null => {
    if (!ALLOWED_TYPES.includes(file.type)) {
      return "Please upload PNG, JPG, or WEBP files only";
    }
    if (file.size > MAX_FILE_SIZE) {
      return "File size must be less than 10MB";
    }
    return null;
  };

  const processFile = useCallback(
    async (file: File) => {
      const validationError = validateFile(file);
      if (validationError) {
        setError(validationError);
        setStatus("error");
        return;
      }

      setStatus("uploading");
      setProgress(0);

      // Simulate progress for better UX
      const progressInterval = setInterval(() => {
        setProgress((prev) => Math.min(prev + 10, 90));
      }, 100);

      try {
        const reader = new FileReader();

        reader.onload = (e) => {
          clearInterval(progressInterval);
          const result = e.target?.result as string;
          setPreview(result);

          // Get image dimensions
          const img = new window.Image();
          img.onload = () => {
            setProgress(100);
            setStatus("success");

            setTimeout(() => {
              onImageUpload(result, file.name, {
                width: img.width,
                height: img.height,
              });
              onOpenChange(false);
              resetState();
              toast.success("Image uploaded successfully!");
            }, 500);
          };
          img.onerror = () => {
            clearInterval(progressInterval);
            setError("Failed to load image");
            setStatus("error");
          };
          img.src = result;
        };

        reader.onerror = () => {
          clearInterval(progressInterval);
          setError("Failed to read file");
          setStatus("error");
        };

        reader.readAsDataURL(file);
      } catch (err) {
        clearInterval(progressInterval);
        setError("An unexpected error occurred");
        setStatus("error");
      }
    },
    [onImageUpload, onOpenChange]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setStatus("idle");

      const file = e.dataTransfer.files[0];
      if (file) {
        processFile(file);
      }
    },
    [processFile]
  );

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setStatus("dragging");
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setStatus("idle");
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        onOpenChange(open);
        if (!open) resetState();
      }}
    >
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Upload Image
          </DialogTitle>
          <DialogDescription>
            Upload an image from your device to add to your design
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Drop Zone */}
          <div
            className={cn(
              "relative border-2 border-dashed rounded-xl transition-all",
              "flex flex-col items-center justify-center p-8 text-center",
              status === "idle" && "border-muted-foreground/25 hover:border-primary/50 cursor-pointer",
              status === "dragging" && "border-primary bg-primary/5",
              status === "uploading" && "border-primary/50",
              status === "success" && "border-green-500 bg-green-50",
              status === "error" && "border-destructive bg-destructive/5"
            )}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => status === "idle" && fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept={ALLOWED_TYPES.join(",")}
              onChange={handleFileSelect}
              className="hidden"
            />

            {status === "idle" || status === "dragging" ? (
              <>
                <div
                  className={cn(
                    "w-16 h-16 rounded-full flex items-center justify-center mb-4 transition-colors",
                    status === "dragging" ? "bg-primary/20" : "bg-muted"
                  )}
                >
                  <Upload
                    className={cn(
                      "h-8 w-8 transition-colors",
                      status === "dragging" ? "text-primary" : "text-muted-foreground"
                    )}
                  />
                </div>
                <p className="font-medium mb-1">
                  {status === "dragging" ? "Drop your image here" : "Drag & drop your image here"}
                </p>
                <p className="text-sm text-muted-foreground mb-4">or click to browse</p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>PNG, JPG, WEBP</span>
                  <span>•</span>
                  <span>Max 10MB</span>
                </div>
              </>
            ) : status === "uploading" ? (
              <>
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <ImageIcon className="h-8 w-8 text-primary animate-pulse" />
                </div>
                <p className="font-medium mb-3">Processing image...</p>
                <Progress value={progress} className="w-48 h-2" />
                <p className="text-sm text-muted-foreground mt-2">{progress}%</p>
              </>
            ) : status === "success" ? (
              <>
                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
                  <CheckCircle2 className="h-8 w-8 text-green-600" />
                </div>
                <p className="font-medium text-green-700 mb-1">Upload successful!</p>
                <p className="text-sm text-muted-foreground">Adding to canvas...</p>
                {preview && (
                  <img
                    src={preview}
                    alt="Preview"
                    className="mt-4 max-w-32 max-h-24 rounded-lg object-contain"
                  />
                )}
              </>
            ) : status === "error" ? (
              <>
                <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
                  <AlertCircle className="h-8 w-8 text-destructive" />
                </div>
                <p className="font-medium text-destructive mb-1">Upload failed</p>
                <p className="text-sm text-muted-foreground mb-4">{error}</p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    resetState();
                  }}
                >
                  Try Again
                </Button>
              </>
            ) : null}
          </div>

          {/* Tips */}
          <div className="bg-muted/50 rounded-lg p-4">
            <h4 className="text-sm font-medium mb-2">Tips for best results:</h4>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>• Use high-resolution images for better quality</li>
              <li>• PNG files support transparency</li>
              <li>• Images will maintain their aspect ratio</li>
            </ul>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => {
                onOpenChange(false);
                resetState();
              }}
            >
              Cancel
            </Button>
            <Button onClick={() => fileInputRef.current?.click()} disabled={status === "uploading"}>
              <Upload className="h-4 w-4 mr-2" />
              Browse Files
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
