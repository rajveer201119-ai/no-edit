import { useState, useEffect } from "react";
import { X, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export const InstallPrompt = () => {
  const [showPrompt, setShowPrompt] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    // Show prompt after 10 seconds if app is installable
    const timer = setTimeout(() => {
      if (deferredPrompt && !localStorage.getItem("installPromptDismissed")) {
        setShowPrompt(true);
      }
    }, 10000);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      clearTimeout(timer);
    };
  }, [deferredPrompt]);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === "accepted") {
      setDeferredPrompt(null);
    }
    setShowPrompt(false);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem("installPromptDismissed", "true");
  };

  if (!showPrompt || !deferredPrompt) return null;

  return (
    <Dialog open={showPrompt} onOpenChange={(open) => !open && handleDismiss()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Download className="w-5 h-5 text-primary" />
            Install EPIC AI
          </DialogTitle>
          <DialogDescription className="pt-4">
            Install our app for a better experience! Get quick access from your home screen and enjoy:
            <ul className="list-disc list-inside mt-3 space-y-2">
              <li>Faster loading times</li>
              <li>Offline access to your generated images</li>
              <li>Native app-like experience</li>
              <li>No browser distractions</li>
            </ul>
          </DialogDescription>
        </DialogHeader>
        <div className="flex gap-3 mt-4">
          <Button onClick={handleInstall} className="flex-1">
            Install Now
          </Button>
          <Button onClick={handleDismiss} variant="outline" size="icon">
            <X className="w-4 h-4" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
