import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ChevronRight, Home } from "lucide-react";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

const baseUrl = "https://no-edit.lovable.app";

export const Breadcrumbs = ({ items }: BreadcrumbsProps) => {
  const schemaItems = [
    { "@type": "ListItem" as const, position: 1, name: "Home", item: baseUrl },
    ...items.map((item, i) => ({
      "@type": "ListItem" as const,
      position: i + 2,
      name: item.label,
      ...(item.href ? { item: `${baseUrl}${item.href}` } : {}),
    })),
  ];

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: schemaItems,
  };

  return (
    <>
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
      </Helmet>
      <nav aria-label="Breadcrumb" className="container mx-auto px-4 py-3">
        <ol className="flex items-center gap-1.5 text-sm text-muted-foreground flex-wrap">
          <li>
            <Link to="/" className="hover:text-foreground transition-colors inline-flex items-center gap-1">
              <Home className="h-3.5 w-3.5" /> Home
            </Link>
          </li>
          {items.map((item, i) => (
            <li key={i} className="inline-flex items-center gap-1.5">
              <ChevronRight className="h-3.5 w-3.5" />
              {item.href ? (
                <Link to={item.href} className="hover:text-foreground transition-colors">{item.label}</Link>
              ) : (
                <span className="text-foreground font-medium">{item.label}</span>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
};
