import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useInstallPrompt } from "@/hooks/useInstallPrompt";

export const InstallButton = () => {
  const { isInstallable, promptInstall } = useInstallPrompt();

  if (!isInstallable) return null;

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={promptInstall}
      className="border-primary/50 hover:bg-primary/10"
    >
      <Download className="mr-2 h-4 w-4" />
      Install App
    </Button>
  );
};
