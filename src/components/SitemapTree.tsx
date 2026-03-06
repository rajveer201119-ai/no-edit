import { useState } from "react";
import { ChevronRight, ChevronDown, Globe, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import type { SitemapNode } from "@/data/seedSitemaps";

interface SitemapTreeProps {
  nodes: SitemapNode[];
  level?: number;
}

const TreeNode = ({ node, level = 0 }: { node: SitemapNode; level: number }) => {
  const [expanded, setExpanded] = useState(level < 2);
  const hasChildren = node.children && node.children.length > 0;

  return (
    <div className="select-none">
      <div
        className={cn(
          "flex items-center gap-2 py-1.5 px-2 rounded-md cursor-pointer transition-colors hover:bg-accent/50 group",
          level === 0 && "font-semibold text-base",
          level === 1 && "font-medium text-sm",
          level >= 2 && "text-sm text-muted-foreground"
        )}
        style={{ paddingLeft: `${level * 20 + 8}px` }}
        onClick={() => hasChildren && setExpanded(!expanded)}
      >
        {hasChildren ? (
          expanded ? (
            <ChevronDown className="h-4 w-4 shrink-0 text-primary" />
          ) : (
            <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
          )
        ) : (
          <FileText className="h-3.5 w-3.5 shrink-0 text-muted-foreground/60" />
        )}
        {level === 0 ? (
          <Globe className="h-4 w-4 shrink-0 text-primary" />
        ) : null}
        <span className="truncate">{node.name}</span>
        <span className="text-xs text-muted-foreground/50 ml-auto opacity-0 group-hover:opacity-100 transition-opacity truncate max-w-[150px]">
          {node.url}
        </span>
      </div>
      {hasChildren && expanded && (
        <div className="border-l border-border/40 ml-4" style={{ marginLeft: `${level * 20 + 18}px` }}>
          {node.children!.map((child, i) => (
            <TreeNode key={`${child.url}-${i}`} node={child} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  );
};

export const SitemapTree = ({ nodes, level = 0 }: SitemapTreeProps) => {
  return (
    <div className="rounded-lg border border-border bg-card p-4 font-mono">
      {nodes.map((node, i) => (
        <TreeNode key={`${node.url}-${i}`} node={node} level={level} />
      ))}
    </div>
  );
};
