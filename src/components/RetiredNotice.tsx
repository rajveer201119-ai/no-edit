import { useEffect, useState } from "react";
import { Archive, X } from "lucide-react";

const KEY = "epic-retired-notice-dismissed";

export const RetiredNotice = () => {
  const [hidden, setHidden] = useState(true);

  useEffect(() => {
    setHidden(localStorage.getItem(KEY) === "1");
  }, []);

  if (hidden) return null;

  return (
    <div
      role="status"
      className="sticky top-0 z-[90] w-full border-b border-amber-500/30 bg-amber-500/10 backdrop-blur-xl"
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-3 sm:flex-row sm:items-center sm:gap-3 sm:py-2.5">
        <div className="flex min-w-0 flex-1 items-start gap-3 sm:items-center">
          <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-amber-500/40 bg-amber-500/15 sm:mt-0">
            <Archive className="h-4 w-4 text-amber-600 dark:text-amber-400" aria-hidden="true" />
          </span>
          <p className="min-w-0 flex-1 text-sm leading-snug text-foreground">
            <span className="mr-2 inline-flex items-center rounded-full border border-amber-500/40 bg-amber-500/15 px-2 py-0.5 align-middle text-[10px] font-bold uppercase tracking-widest text-amber-700 dark:text-amber-300">
              Legacy
            </span>
            <strong className="font-semibold">EPIC is retired — now free for lifetime.</strong>{" "}
            <span className="text-muted-foreground">
              Every Pro feature is unlocked for everyone. No plans, no payments, no limits.
            </span>
          </p>
        </div>
        <button
          onClick={() => {
            localStorage.setItem(KEY, "1");
            setHidden(true);
          }}
          aria-label="Dismiss notice"
          className="inline-flex shrink-0 items-center gap-1.5 self-end rounded-xl border border-amber-500/30 bg-background/60 px-3 py-1.5 text-xs font-medium text-muted-foreground transition-all duration-200 hover:border-amber-500/50 hover:text-foreground active:scale-95 sm:self-auto"
        >
          <X className="h-3.5 w-3.5" aria-hidden="true" />
          Dismiss
        </button>
      </div>
    </div>
  );
};
