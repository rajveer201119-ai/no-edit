import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download, FileImage, FileText, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface ExportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onExport: (format: "png" | "jpg" | "pdf") => Promise<void>;
  requiresSignup?: boolean;
  onSignup?: () => void;
}

export const ExportDialog = ({
  open,
  onOpenChange,
  onExport,
  requiresSignup = false,
  onSignup,
}: ExportDialogProps) => {
  const [exporting, setExporting] = useState<string | null>(null);

  const handleExport = async (format: "png" | "jpg" | "pdf") => {
    if (requiresSignup) {
      onSignup?.();
      return;
    }

    setExporting(format);
    try {
      await onExport(format);
      toast.success(`Design exported as ${format.toUpperCase()}!`);
      onOpenChange(false);
    } catch (err) {
      toast.error("Export failed. Please try again.");
    } finally {
      setExporting(null);
    }
  };

  const formats = [
    { id: "png" as const, label: "PNG", description: "High quality, transparent background", icon: FileImage },
    { id: "jpg" as const, label: "JPG", description: "Smaller file size, no transparency", icon: FileImage },
    { id: "pdf" as const, label: "PDF", description: "Print-ready format", icon: FileText },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Export Design
          </DialogTitle>
          <DialogDescription>
            {requiresSignup
              ? "Create a free account to download your design"
              : "Choose your preferred format"}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-3 py-4">
          {requiresSignup ? (
            <div className="text-center py-4">
              <p className="text-muted-foreground mb-4">
                Sign up to export unlimited designs
              </p>
              <Button onClick={onSignup} className="w-full">
                Create Free Account
              </Button>
            </div>
          ) : (
            formats.map((format) => {
              const Icon = format.icon;
              const isExporting = exporting === format.id;

              return (
                <Button
                  key={format.id}
                  variant="outline"
                  className="w-full justify-start h-auto py-3 px-4"
                  onClick={() => handleExport(format.id)}
                  disabled={!!exporting}
                >
                  {isExporting ? (
                    <Loader2 className="h-5 w-5 mr-3 animate-spin" />
                  ) : (
                    <Icon className="h-5 w-5 mr-3" />
                  )}
                  <div className="text-left">
                    <div className="font-medium">{format.label}</div>
                    <div className="text-xs text-muted-foreground">
                      {format.description}
                    </div>
                  </div>
                </Button>
              );
            })
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
