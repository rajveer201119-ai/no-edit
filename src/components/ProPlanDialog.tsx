import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X, Crown } from "lucide-react";

interface ProPlanDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ProPlanDialog = ({ open, onOpenChange }: ProPlanDialogProps) => {
  const navigate = useNavigate();
  const [isIndia, setIsIndia] = useState(true);
  const handleClose = () => onOpenChange(false);

  const handleViewPricing = () => {
    onOpenChange(false);
    navigate(isIndia ? "/pricing-india" : "/pricing-international");
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
          <div className="flex justify-center bg-muted p-1 rounded-md">
            <Button onClick={() => setIsIndia(true)} variant={isIndia ? "secondary" : "ghost"} className="flex-1 text-sm">🇮🇳 India</Button>
            <Button onClick={() => setIsIndia(false)} variant={!isIndia ? "secondary" : "ghost"} className="flex-1 text-sm">🌍 International</Button>
          </div>

          {isIndia ? (
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="space-y-1 p-3 rounded-lg border border-border/30">
                <div className="text-xs font-semibold text-muted-foreground">Free</div>
                <div className="font-bold">₹0</div>
                <div className="text-[10px] text-muted-foreground">2/day</div>
              </div>
              <div className="space-y-1 p-3 rounded-lg border-2 border-primary">
                <div className="text-xs font-semibold text-primary">Student</div>
                <div className="font-bold">₹299/mo</div>
                <div className="text-[10px] text-muted-foreground">10/day</div>
              </div>
              <div className="space-y-1 p-3 rounded-lg border-2 border-yellow-500">
                <div className="text-xs font-semibold text-yellow-500">Pro</div>
                <div className="font-bold">₹999</div>
                <div className="text-[10px] text-muted-foreground">Unlimited</div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="space-y-1 p-3 rounded-lg border border-border/30">
                <div className="text-xs font-semibold text-muted-foreground">Free</div>
                <div className="font-bold">$0</div>
                <div className="text-[10px] text-muted-foreground">2/day</div>
              </div>
              <div className="space-y-1 p-3 rounded-lg border-2 border-primary">
                <div className="text-xs font-semibold text-primary">Student</div>
                <div className="font-bold">$15/mo</div>
                <div className="text-[10px] text-muted-foreground">10/day</div>
              </div>
              <div className="space-y-1 p-3 rounded-lg border-2 border-yellow-500">
                <div className="text-xs font-semibold text-yellow-500">Pro</div>
                <div className="font-bold">$79</div>
                <div className="text-[10px] text-muted-foreground">Unlimited</div>
              </div>
            </div>
          )}

          <div className="space-y-3 pt-2">
            <Button onClick={handleViewPricing} className="w-full gradient-epic hover:opacity-90 h-auto py-3 font-semibold">
              View Full Pricing Details
            </Button>
          </div>

          <Button variant="ghost" onClick={handleClose} className="w-full text-muted-foreground">
            Maybe Later
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
