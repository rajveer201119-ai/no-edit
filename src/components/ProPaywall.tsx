// EPIC is retired and free for lifetime — paywalls are disabled.
// Kept as a no-op so existing imports/props keep working.
interface ProPaywallProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  featureName?: string;
  reason?: string;
}

export const ProPaywall = (_props: ProPaywallProps) => null;
