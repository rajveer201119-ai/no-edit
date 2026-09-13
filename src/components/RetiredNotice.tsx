import { useEffect, useState } from "react";
import { Gift, X } from "lucide-react";

const KEY = "epic-retired-notice-dismissed";

export const RetiredNotice = () => {
  const [hidden, setHidden] = useState(true);

  useEffect(() => {
    setHidden(localStorage.getItem(KEY) === "1");
  }, []);

  if (hidden) return null;

  return (
    <div className="sticky top-0 z-[90] w-full border-b border-primary/25 bg-primary/10 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-2.5 text-sm text-foreground">
        <Gift className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
        <p className="flex-1 leading-snug">
          <strong className="font-semibold">EPIC is retired — and now FREE FOR LIFETIME.</strong>{" "}
          <span className="text-muted-foreground">
            Every Pro feature is unlocked for everyone. No plans, no payments, no limits.
          </span>
        </p>
        <button
          onClick={() => {
            localStorage.setItem(KEY, "1");
            setHidden(true);
          }}
          aria-label="Dismiss notice"
          className="rounded-md p-1 text-muted-foreground transition-colors hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};
