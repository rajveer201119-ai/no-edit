import { useState } from "react";
import { ChevronDown, ChevronUp, List } from "lucide-react";

interface TOCProps {
  headings: string[];
}

const slugify = (text: string) =>
  text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

export const TableOfContents = ({ headings }: TOCProps) => {
  const [open, setOpen] = useState(false);

  if (headings.length < 3) return null;

  return (
    <nav className="mb-10 border border-border rounded-xl overflow-hidden" aria-label="Table of contents">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-4 font-semibold text-sm hover:bg-muted/30 transition-colors"
      >
        <span className="flex items-center gap-2"><List className="h-4 w-4" /> Table of Contents</span>
        {open ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
      </button>
      {open && (
        <ol className="px-4 pb-4 space-y-2">
          {headings.map((h, i) => (
            <li key={i}>
              <a
                href={`#${slugify(h)}`}
                className="text-sm text-primary hover:underline"
              >
                {i + 1}. {h}
              </a>
            </li>
          ))}
        </ol>
      )}
    </nav>
  );
};

export { slugify };
