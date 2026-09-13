// EPIC is free for lifetime — paywall disabled.
interface CreatorModePaywallProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  triggerReason?: string;
  featureName?: string;
}

export const CreatorModePaywall = (_props: CreatorModePaywallProps) => null;
