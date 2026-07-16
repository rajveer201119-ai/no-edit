// Thin wrapper — unified upgrade dialog lives in ProPaywall.
// Keeps existing imports/props working without duplicating UI.
import { ProPaywall } from "@/components/ProPaywall";

interface CreatorModePaywallProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  triggerReason?:
    | "export"
    | "limit"
    | "premium-feature"
    | "hd-export"
    | "json-export"
    | "pdf-export"
    | "png-export"
    | "ux-tester"
    | "analyzer"
    | "library";
  featureName?: string;
}

export const CreatorModePaywall = ({
  open,
  onOpenChange,
  triggerReason = "limit",
  featureName,
}: CreatorModePaywallProps) => (
  <ProPaywall
    open={open}
    onOpenChange={onOpenChange}
    featureName={featureName}
    reason={triggerReason}
  />
);
