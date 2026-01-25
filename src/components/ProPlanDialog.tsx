import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Sparkles, X } from "lucide-react";

interface ProPlanDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ProPlanDialog = ({ open, onOpenChange }: ProPlanDialogProps) => {
  const navigate = useNavigate();

  const handleClose = () => {
    onOpenChange(false);
  };

  const handleViewPricing = (region: "india" | "international") => {
    onOpenChange(false);
    navigate(region === "india" ? "/pricing-india" : "/pricing-international");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md glass-card border-2 border-primary/50">
        <button
          onClick={handleClose}
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </button>

        <DialogHeader className="space-y-3">
          <div className="mx-auto">
            <Sparkles className="h-12 w-12 text-primary" />
          </div>
          <DialogTitle className="text-2xl gradient-epic-text text-center">
            Unlock Pro Features!
          </DialogTitle>
          <DialogDescription className="text-center text-base">
            Generate up to 25 images per day with our Pro plan
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="glass-card p-4 border border-primary/30 rounded-lg">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Free Plan:</span>
                <span className="font-semibold">2 images/day</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Pro Plan:</span>
                <span className="font-semibold gradient-epic-text">25 images/day</span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-sm text-center text-muted-foreground">
              Choose your region for pricing:
            </p>
            <div className="grid grid-cols-2 gap-3">
              <Button
                onClick={() => handleViewPricing("india")}
                className="gradient-epic hover:opacity-90"
              >
                🇮🇳 India
                <br />
                <span className="text-xs">₹10/month</span>
              </Button>
              <Button
                onClick={() => handleViewPricing("international")}
                className="gradient-epic hover:opacity-90"
              >
                🌍 International
                <br />
                <span className="text-xs">$1/month</span>
              </Button>
            </div>
          </div>

          <Button
            variant="outline"
            onClick={handleClose}
            className="w-full"
          >
            Maybe Later
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
