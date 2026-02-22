import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X, Crown, Check, Zap } from "lucide-react";

interface ProPlanDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ProPlanDialog = ({ open, onOpenChange }: ProPlanDialogProps) => {
  const navigate = useNavigate();
  const handleClose = () => onOpenChange(false);

  const handleViewPricing = (region: "india" | "international") => {
    onOpenChange(false);
    navigate(region === "india" ? "/pricing-india" : "/pricing-international");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md glass-card border-2 border-primary/50 p-0 overflow-hidden">
        <div className="bg-gradient-to-br from-primary/20 via-primary/10 to-transparent p-6 pb-4">
          <button onClick={handleClose} className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100">
            <X className="h-4 w-4" /><span className="sr-only">Close</span>
          </button>
          <DialogHeader className="space-y-3">
            <div className="flex items-center gap-2">
              <Crown className="h-6 w-6 text-primary" />
              <span className="text-xs font-medium text-primary uppercase tracking-wider">Upgrade</span>
            </div>
            <DialogTitle className="text-2xl font-bold">Unlock Your Creative Power</DialogTitle>
            <DialogDescription className="text-base text-muted-foreground">
              Choose Student Helper or Pro Lifetime
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="space-y-1 p-3 rounded-lg border border-border/30">
              <div className="text-xs font-semibold text-muted-foreground">Free</div>
              <div className="font-bold">₹0</div>
              <div className="text-[10px] text-muted-foreground">2/day</div>
            </div>
            <div className="space-y-1 p-3 rounded-lg border-2 border-primary">
              <div className="text-xs font-semibold text-primary">Student</div>
              <div className="font-bold">₹10/mo</div>
              <div className="text-[10px] text-muted-foreground">10/day</div>
            </div>
            <div className="space-y-1 p-3 rounded-lg border-2 border-yellow-500">
              <div className="text-xs font-semibold text-yellow-500">Pro</div>
              <div className="font-bold">₹299</div>
              <div className="text-[10px] text-muted-foreground">Unlimited</div>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <div className="grid grid-cols-2 gap-3">
              <Button onClick={() => handleViewPricing("india")} className="gradient-epic hover:opacity-90 h-auto py-3">
                <div className="text-center">
                  <span className="text-lg">🇮🇳</span>
                  <div className="font-semibold">India</div>
                </div>
              </Button>
              <Button onClick={() => handleViewPricing("international")} className="gradient-epic hover:opacity-90 h-auto py-3">
                <div className="text-center">
                  <span className="text-lg">🌍</span>
                  <div className="font-semibold">International</div>
                </div>
              </Button>
            </div>
          </div>

          <Button variant="ghost" onClick={handleClose} className="w-full text-muted-foreground">
            Maybe Later
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
