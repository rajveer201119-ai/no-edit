import { useMemo } from "react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, CheckCircle, Info, TrendingUp, X, Lock, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PageNode {
  id: string;
  pageId: string;
  label: string;
  sections?: { id: string; label: string; color: string }[];
  pageType?: string;
}

interface Connection {
  id: string;
  fromId: string;
  toId: string;
  label: string;
}

interface UXScorePanelProps {
  nodes: PageNode[];
  connections: Connection[];
  visible: boolean;
  onClose: () => void;
  isPremium?: boolean;
  onUpgrade?: () => void;
}

interface ScoreBreakdown {
  total: number;
  depth: number;
  hierarchy: number;
  redundancy: number;
  flow: number;
  cta: number;
  balance: number;
  suggestions: string[];
}

function calculateUXScore(nodes: PageNode[], connections: Connection[]): ScoreBreakdown {
  if (nodes.length === 0) {
    return { total: 0, depth: 0, hierarchy: 0, redundancy: 0, flow: 0, cta: 0, balance: 0, suggestions: ["Add pages to your sitemap to get a UX score."] };
  }

  const suggestions: string[] = [];
  let depth = 20, hierarchy = 20, redundancy = 20, flow = 15, cta = 10, balance = 15;

  const incomingMap = new Map<string, string[]>();
  const outgoingMap = new Map<string, string[]>();
  nodes.forEach(n => { incomingMap.set(n.id, []); outgoingMap.set(n.id, []); });
  connections.forEach(c => {
    incomingMap.get(c.toId)?.push(c.fromId);
    outgoingMap.get(c.fromId)?.push(c.toId);
  });

  const roots = nodes.filter(n => (incomingMap.get(n.id)?.length || 0) === 0);
  let maxDepth = 0;
  if (roots.length > 0) {
    const visited = new Set<string>();
    const queue: { id: string; d: number }[] = roots.map(r => ({ id: r.id, d: 0 }));
    while (queue.length > 0) {
      const { id, d } = queue.shift()!;
      if (visited.has(id)) continue;
      visited.add(id);
      maxDepth = Math.max(maxDepth, d);
      (outgoingMap.get(id) || []).forEach(child => queue.push({ id: child, d: d + 1 }));
    }
  }

  if (maxDepth > 4) {
    depth = Math.max(5, 20 - (maxDepth - 4) * 4);
    suggestions.push(`Navigation is ${maxDepth} levels deep. Keep it under 4 for better UX.`);
  } else if (maxDepth === 0 && nodes.length > 1) {
    depth = 10;
    suggestions.push("No connections between pages. Connect them to define the flow.");
  }

  if (roots.length === 0 && nodes.length > 0) {
    hierarchy = 8;
    suggestions.push("No clear root page (e.g. Home). Add a starting point.");
  } else if (roots.length > 3) {
    hierarchy = 12;
    suggestions.push("Too many root-level pages. Consider a single entry point.");
  }

  const orphans = nodes.filter(n => (incomingMap.get(n.id)?.length || 0) === 0 && (outgoingMap.get(n.id)?.length || 0) === 0);
  if (orphans.length > 0 && nodes.length > 1) {
    hierarchy = Math.max(5, hierarchy - orphans.length * 3);
    suggestions.push(`${orphans.length} orphan page(s) with no connections.`);
  }

  const labelCounts = new Map<string, number>();
  nodes.forEach(n => {
    const key = n.label.toLowerCase().trim();
    labelCounts.set(key, (labelCounts.get(key) || 0) + 1);
  });
  const duplicates = [...labelCounts.entries()].filter(([, count]) => count > 1);
  if (duplicates.length > 0) {
    redundancy = Math.max(5, 20 - duplicates.length * 5);
    suggestions.push(`Duplicate page names found: ${duplicates.map(([name]) => name).join(", ")}.`);
  }

  const deadEnds = nodes.filter(n => (outgoingMap.get(n.id)?.length || 0) === 0 && (incomingMap.get(n.id)?.length || 0) > 0);
  if (deadEnds.length > nodes.length * 0.5 && nodes.length > 2) {
    flow = Math.max(3, 15 - deadEnds.length * 2);
    suggestions.push("Many pages are dead ends. Add navigation paths from them.");
  }

  const pagesWithCTA = nodes.filter(n => n.sections?.some(s => s.label.toLowerCase().includes("cta")));
  const ctaRatio = nodes.length > 0 ? pagesWithCTA.length / nodes.length : 0;
  if (ctaRatio < 0.2 && nodes.length > 2) {
    cta = Math.max(2, Math.round(ctaRatio * 50));
    suggestions.push("Add CTA sections to more pages to drive conversions.");
  }

  if (nodes.length < 3) {
    balance = 8;
    suggestions.push("Add more pages for a complete sitemap.");
  } else if (nodes.length > 30) {
    balance = 10;
    suggestions.push("Consider simplifying — too many pages can overwhelm users.");
  }

  const total = Math.min(100, depth + hierarchy + redundancy + flow + cta + balance);

  if (suggestions.length === 0) {
    suggestions.push("Your sitemap structure looks great! Well done.");
  }

  return { total, depth, hierarchy, redundancy, flow, cta, balance, suggestions };
}

function getScoreColor(score: number): string {
  if (score >= 80) return "#22c55e";
  if (score >= 60) return "#f59e0b";
  return "#ef4444";
}

function getScoreLabel(score: number): string {
  if (score >= 80) return "Excellent";
  if (score >= 60) return "Good";
  if (score >= 40) return "Needs Work";
  return "Poor";
}

export const UXScorePanel = ({ nodes, connections, visible, onClose, isPremium = true, onUpgrade }: UXScorePanelProps) => {
  const score = useMemo(() => calculateUXScore(nodes, connections), [nodes, connections]);
  const color = getScoreColor(score.total);
  const label = getScoreLabel(score.total);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="absolute top-16 right-4 z-50 w-72 rounded-xl bg-card border border-border shadow-xl overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-muted/30">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-foreground" />
              <span className="text-sm font-semibold text-foreground">UX Score</span>
            </div>
            <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Score Circle */}
          <div className="flex flex-col items-center py-5 px-4">
            <div className="relative w-24 h-24">
              <svg className="w-24 h-24 -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="42" fill="none" stroke="hsl(var(--border))" strokeWidth="8" />
                <circle
                  cx="50" cy="50" r="42" fill="none"
                  stroke={color}
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={`${(score.total / 100) * 264} 264`}
                  className="transition-all duration-700"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold" style={{ color }}>{score.total}</span>
                <span className="text-[10px] text-muted-foreground font-medium">/100</span>
              </div>
            </div>
            <span className="text-sm font-semibold mt-2" style={{ color }}>{label}</span>
          </div>

          {/* Blurred results for free users */}
          <div className={cn("relative", !isPremium && "select-none")}>
            {!isPremium && (
              <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-card/80 backdrop-blur-sm rounded-b-xl">
                <Lock className="h-6 w-6 text-muted-foreground mb-2" />
                <p className="text-xs font-semibold text-foreground mb-1">Pro Feature</p>
                <p className="text-[10px] text-muted-foreground mb-3 text-center px-4">Upgrade to see detailed breakdown & suggestions</p>
                <Button size="sm" onClick={onUpgrade} className="gap-1.5 text-xs">
                  <Crown className="h-3 w-3" /> Upgrade to Pro
                </Button>
              </div>
            )}

            <div className={cn(!isPremium && "blur-md pointer-events-none")}>
              {/* Breakdown bars */}
              <div className="px-4 pb-3 space-y-2">
                {[
                  { label: "Depth", val: score.depth, max: 20 },
                  { label: "Hierarchy", val: score.hierarchy, max: 20 },
                  { label: "Redundancy", val: score.redundancy, max: 20 },
                  { label: "Flow", val: score.flow, max: 15 },
                  { label: "CTA", val: score.cta, max: 10 },
                  { label: "Balance", val: score.balance, max: 15 },
                ].map(b => (
                  <div key={b.label} className="flex items-center gap-2">
                    <span className="text-[10px] text-muted-foreground w-16 shrink-0">{b.label}</span>
                    <div className="flex-1 h-1.5 rounded-full bg-border overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${(b.val / b.max) * 100}%`,
                          backgroundColor: getScoreColor((b.val / b.max) * 100),
                        }}
                      />
                    </div>
                    <span className="text-[10px] text-muted-foreground w-8 text-right">{b.val}/{b.max}</span>
                  </div>
                ))}
              </div>

              {/* Suggestions */}
              <div className="px-4 pb-4 space-y-1.5">
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mb-1">Suggestions</p>
                {score.suggestions.slice(0, 3).map((s, i) => (
                  <div key={i} className="flex items-start gap-2 text-[11px] text-foreground/80 leading-snug">
                    {score.total >= 80 ? (
                      <CheckCircle className="h-3 w-3 mt-0.5 shrink-0 text-green-500" />
                    ) : score.total >= 60 ? (
                      <Info className="h-3 w-3 mt-0.5 shrink-0 text-amber-500" />
                    ) : (
                      <AlertTriangle className="h-3 w-3 mt-0.5 shrink-0 text-red-500" />
                    )}
                    {s}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
