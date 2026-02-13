import { useState } from "react";
import { cn } from "@/lib/utils";
import { Palette, Library, Lightbulb, Menu, Home, Sparkles, Shield, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";

export type MainTab = "home" | "create" | "library";

interface MainNavigationProps {
  activeTab: MainTab;
  onTabChange: (tab: MainTab) => void;
  isAdmin?: boolean;
  onAdminClick?: () => void;
  onProClick?: () => void;
}

export const MainNavigation = ({ 
  activeTab, 
  onTabChange,
  isAdmin,
  onAdminClick,
  onProClick,
}: MainNavigationProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isMobile = useIsMobile();

  const tabs = [
    { id: "home" as const, label: "Home", icon: Home },
    { id: "create" as const, label: "Create", icon: Palette },
    { id: "library" as const, label: "Library", icon: Library },
  ];

  const handleTabChange = (tab: MainTab) => {
    onTabChange(tab);
    setMobileMenuOpen(false);
  };

  // Desktop navigation
  const DesktopNav = () => (
    <div className="hidden md:flex items-center gap-1 bg-muted/30 rounded-full p-1">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            onClick={() => handleTabChange(tab.id)}
            className={cn(
              "flex items-center gap-2 px-5 py-2.5 rounded-full transition-all duration-300",
              "text-sm font-medium min-h-[44px]",
              isActive
                ? "bg-primary text-primary-foreground shadow-lg"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
            )}
          >
            <Icon className="h-4 w-4" />
            <span>{tab.label}</span>
          </button>
        );
      })}
    </div>
  );

  // Mobile navigation (hamburger menu)
  const MobileNav = () => (
    <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden h-10 w-10 shrink-0"
          aria-label="Open navigation menu"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[280px] p-0">
        <SheetHeader className="p-4 border-b border-border/30">
          <SheetTitle className="text-xl font-bold gradient-epic-text text-left">EPIC</SheetTitle>
        </SheetHeader>
        <nav className="flex flex-col p-4 gap-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={cn(
                  "flex items-center gap-3 px-4 py-4 rounded-xl transition-all duration-200",
                  "text-base font-medium min-h-[56px] w-full text-left",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-foreground hover:bg-muted/50"
                )}
              >
                <Icon className="h-5 w-5 flex-shrink-0" />
                <span>{tab.label}</span>
              </button>
            );
          })}
          
          {/* Divider */}
          <div className="h-px bg-border/50 my-2" />
          
          {/* Pro Plan Button - Mobile */}
          <button
            onClick={() => {
              onProClick?.();
              setMobileMenuOpen(false);
            }}
            className={cn(
              "flex items-center gap-3 px-4 py-4 rounded-xl transition-all duration-200",
              "text-base font-medium min-h-[56px] w-full text-left",
              "text-amber-500 hover:bg-amber-500/10 border border-amber-500/30"
            )}
          >
            <Crown className="h-5 w-5 flex-shrink-0" />
            <span>Upgrade to Pro</span>
            <Sparkles className="h-4 w-4 ml-auto" />
          </button>
          
          {/* Admin Button - Mobile (only if admin) */}
          {isAdmin && (
            <button
              onClick={() => {
                onAdminClick?.();
                setMobileMenuOpen(false);
              }}
              className={cn(
                "flex items-center gap-3 px-4 py-4 rounded-xl transition-all duration-200",
                "text-base font-medium min-h-[56px] w-full text-left",
                "text-foreground hover:bg-muted/50"
              )}
            >
              <Shield className="h-5 w-5 flex-shrink-0" />
              <span>Admin Panel</span>
            </button>
          )}
        </nav>
      </SheetContent>
    </Sheet>
  );

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/30">
      <div className="container mx-auto px-4">
        <div className="flex items-center h-16 gap-4">
          {/* Mobile Navigation (hamburger trigger) - LEFT */}
          <div className="md:hidden shrink-0">
            <MobileNav />
          </div>

          {/* Logo - LEFT on desktop, CENTER on mobile */}
          <div className={cn(
            "flex items-center gap-2 shrink-0",
            isMobile && "flex-1 justify-center"
          )}>
            <div className="relative">
              <div className="absolute inset-0 bg-primary/30 blur-xl rounded-full animate-pulse" />
              <h1 className="relative text-xl font-bold gradient-epic-text tracking-tight">
                EPIC
              </h1>
            </div>
          </div>

          {/* Desktop Navigation - CENTER */}
          <div className="hidden md:flex flex-1 justify-center">
            <DesktopNav />
          </div>

          {/* Spacer for mobile to balance the logo in center */}
          <div className="md:hidden w-10 shrink-0" />

          {/* Empty space for user menu on desktop */}
          <div className="hidden md:block w-[200px] shrink-0" />
        </div>
      </div>
    </nav>
  );
};
