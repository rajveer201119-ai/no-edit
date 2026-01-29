import { cn } from "@/lib/utils";
import { Palette, Library, Lightbulb } from "lucide-react";

export type MainTab = "create" | "library" | "inspire";

interface MainNavigationProps {
  activeTab: MainTab;
  onTabChange: (tab: MainTab) => void;
}

export const MainNavigation = ({ activeTab, onTabChange }: MainNavigationProps) => {
  const tabs = [
    { id: "create" as const, label: "Create", icon: Palette },
    { id: "library" as const, label: "Library", icon: Library },
    { id: "inspire" as const, label: "Inspire", icon: Lightbulb },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/30">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/30 blur-xl rounded-full animate-pulse" />
              <h1 className="relative text-xl font-bold gradient-epic-text tracking-tight">
                EPIC
              </h1>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-1 bg-muted/30 rounded-full p-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() => onTabChange(tab.id)}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300",
                    "text-sm font-medium",
                    isActive
                      ? "bg-primary text-primary-foreground shadow-lg"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Spacer for balance */}
          <div className="w-16" />
        </div>
      </div>
    </nav>
  );
};
