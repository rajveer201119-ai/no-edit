import { useState, useEffect, useRef, useCallback } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Sparkles, Loader2, AlertCircle, Wand2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { generateSitemap } from "@/lib/sitemap/generate";
import type { AiSitemap } from "@/lib/sitemap/schema";
import { toast } from "sonner";

interface AISitemapModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onGenerated: (sitemap: AiSitemap) => void;
  hasExistingSitemap: boolean;
}

const SAMPLE_DESCRIPTION =
  "A SaaS product for freelance designers. Landing page, features, pricing, blog, help center, login, dashboard with projects and clients, invoicing, settings and account.";

const PROGRESS_MESSAGES = [
  "Understanding your website…",
  "Planning the information architecture…",
  "Organising pages and hierarchy…",
  "Preparing the visual sitemap…",
];

export const AISitemapModal = ({ open, onOpenChange, onGenerated, hasExistingSitemap }: AISitemapModalProps) => {
  const [description, setDescription] = useState("");
  const [websiteType, setWebsiteType] = useState("");
  const [audience, setAudience] = useState("");
  const [size, setSize] = useState<"small" | "medium" | "large">("medium");
  const [includeUtility, setIncludeUtility] = useState(true);
  const [includeSeoLanding, setIncludeSeoLanding] = useState(false);
  const [language, setLanguage] = useState("English");

  const [loading, setLoading] = useState(false);
  const [progressIdx, setProgressIdx] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (!loading) return;
    setProgressIdx(0);
    const id = setInterval(() => {
      setProgressIdx((i) => (i + 1) % PROGRESS_MESSAGES.length);
    }, 1500);
    return () => clearInterval(id);
  }, [loading]);

  useEffect(() => {
    if (!open) {
      // Cancel any in-flight request when closing
      abortRef.current?.abort();
      abortRef.current = null;
      setLoading(false);
      setError(null);
    }
  }, [open]);

  const canSubmit = description.trim().length >= 10 && !loading;

  const handleGenerate = useCallback(async () => {
    if (!canSubmit) return;
    if (hasExistingSitemap) {
      const confirmed = window.confirm(
        "Generating will replace the current sitemap on the canvas. You can undo with Ctrl/Cmd+Z. Continue?",
      );
      if (!confirmed) return;
    }
    setError(null);
    setLoading(true);
    const ctrl = new AbortController();
    abortRef.current = ctrl;
    const result = await generateSitemap(
      {
        description: description.trim(),
        websiteType: websiteType.trim() || undefined,
        audience: audience.trim() || undefined,
        size,
        includeUtility,
        includeSeoLanding,
        language,
      },
      { signal: ctrl.signal },
    ).catch((e) => {
      if ((e as { name?: string })?.name === "AbortError") return null;
      return { ok: false as const, message: "Something went wrong." };
    });
    abortRef.current = null;
    setLoading(false);
    if (!result) return; // aborted
    if (!result.ok || !result.sitemap) {
      setError(result.message || "We couldn't generate a valid sitemap. Please try again.");
      return;
    }
    onGenerated(result.sitemap);
    onOpenChange(false);
    toast.success("AI sitemap ready — every page is editable.");
  }, [canSubmit, description, websiteType, audience, size, includeUtility, includeSeoLanding, language, hasExistingSitemap, onGenerated, onOpenChange]);

  const handleCancel = () => {
    abortRef.current?.abort();
    abortRef.current = null;
    setLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Generate sitemap with AI
          </DialogTitle>
          <DialogDescription>
            Describe your website and we'll draft a hierarchical sitemap. Every page stays fully editable on the canvas.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 py-2" aria-live="polite">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="ai-desc" className="text-sm font-medium">Describe your website</Label>
              <button
                type="button"
                onClick={() => setDescription(SAMPLE_DESCRIPTION)}
                className="text-xs text-muted-foreground hover:text-foreground underline-offset-2 hover:underline"
              >
                Use example
              </button>
            </div>
            <Textarea
              id="ai-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={SAMPLE_DESCRIPTION}
              rows={5}
              maxLength={2000}
              disabled={loading}
              className="resize-none"
            />
            <div className="flex justify-between text-[11px] text-muted-foreground">
              <span>Aim for a full paragraph — the more detail, the better the sitemap.</span>
              <span>{description.length}/2000</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="ai-type" className="text-xs font-medium">Website type <span className="text-muted-foreground">(optional)</span></Label>
              <Input id="ai-type" value={websiteType} onChange={(e) => setWebsiteType(e.target.value)} placeholder="SaaS, e-commerce, agency…" disabled={loading} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="ai-audience" className="text-xs font-medium">Target audience <span className="text-muted-foreground">(optional)</span></Label>
              <Input id="ai-audience" value={audience} onChange={(e) => setAudience(e.target.value)} placeholder="Freelancers, startups…" disabled={loading} />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-medium">Size</Label>
            <div className="grid grid-cols-3 gap-2">
              {(["small", "medium", "large"] as const).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSize(s)}
                  disabled={loading}
                  className={cn(
                    "px-3 py-2 rounded-lg border text-xs font-medium transition-all",
                    size === s ? "border-primary bg-primary/10 text-primary" : "border-border hover:border-primary/40",
                  )}
                >
                  <div className="capitalize">{s}</div>
                  <div className="text-[10px] text-muted-foreground mt-0.5">
                    {s === "small" ? "5-12 pages" : s === "medium" ? "12-25 pages" : "25-50 pages"}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <label className="flex items-center justify-between gap-3 rounded-lg border border-border/60 px-3 py-2">
              <span className="text-xs">Include legal & utility pages</span>
              <Switch checked={includeUtility} onCheckedChange={setIncludeUtility} disabled={loading} />
            </label>
            <label className="flex items-center justify-between gap-3 rounded-lg border border-border/60 px-3 py-2">
              <span className="text-xs">Add SEO landing pages</span>
              <Switch checked={includeSeoLanding} onCheckedChange={setIncludeSeoLanding} disabled={loading} />
            </label>
          </div>

          {error && (
            <div className="flex items-start gap-2 rounded-lg border border-destructive/40 bg-destructive/5 px-3 py-2 text-sm text-destructive">
              <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
              <div className="flex-1">
                <p>{error}</p>
                <div className="mt-2 flex gap-2">
                  <Button size="sm" variant="outline" onClick={handleGenerate} disabled={loading}>Try again</Button>
                  <Button size="sm" variant="ghost" onClick={() => setDescription(SAMPLE_DESCRIPTION)} disabled={loading}>Use example description</Button>
                </div>
              </div>
            </div>
          )}

          {loading && (
            <div className="flex items-center gap-2 rounded-lg bg-muted/40 px-3 py-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin text-primary" />
              <span>{PROGRESS_MESSAGES[progressIdx]}</span>
            </div>
          )}
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-2 pt-2">
          {loading ? (
            <Button variant="outline" onClick={handleCancel}>Cancel</Button>
          ) : (
            <Button variant="ghost" onClick={() => onOpenChange(false)}>Close</Button>
          )}
          <Button
            onClick={handleGenerate}
            disabled={!canSubmit}
            className="gap-2"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Wand2 className="h-4 w-4" />}
            {loading ? "Generating…" : "Generate Sitemap"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AISitemapModal;