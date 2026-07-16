// Thin wrapper — unified upgrade dialog lives in ProPaywall.
import { ProPaywall } from "@/components/ProPaywall";

interface ProPlanDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ProPlanDialog = ({ open, onOpenChange }: ProPlanDialogProps) => (
  <ProPaywall open={open} onOpenChange={onOpenChange} />
);
