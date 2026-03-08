import { useState } from "react";
import { cn } from "@/lib/utils";
import { Palette, Library, Menu, Home, Shield, Crown, Network } from "lucide-react";
import { useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();

  const tabs = [
    { id: "home" as const, label: "Home", icon: Home },
    { id: "create" as const, label: "Create", icon: Palette },
    { id: "library" as const, label: "Library", icon: Library },
  ];

  const handleTabChange = (tab: MainTab) => {
    onTabChange(tab);
    setMobileMenuOpen(false);
  };

  const DesktopNav = () => (
    <div className="hidden md:flex items-center gap-0.5 bg-muted/40 backdrop-blur-lg rounded-lg p-1 border border-border/50">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => handleTabChange(tab.id)}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-md transition-all duration-200",
              "text-sm font-medium",
              isActive
                ? "bg-foreground text-background shadow-sm"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
            )}
          >
            <Icon className="h-4 w-4" />
            <span>{tab.label}</span>
          </button>
        );
      })}
    </div>
  );

  const MobileNav = () => (
    <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden h-10 w-10 shrink-0" aria-label="Open navigation menu">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[280px] p-0">
        <SheetHeader className="p-4 border-b border-border">
          <SheetTitle className="text-xl font-semibold text-left">EPIC</SheetTitle>
        </SheetHeader>
        <nav className="flex flex-col p-4 gap-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200",
                  "text-sm font-medium w-full text-left",
                  isActive ? "bg-foreground text-background" : "text-foreground hover:bg-muted"
                )}
              >
                <Icon className="h-4 w-4 flex-shrink-0" />
                <span>{tab.label}</span>
              </button>
            );
          })}
          
          <div className="h-px bg-border my-2" />

          <button
            onClick={() => { navigate("/navigation-maker"); setMobileMenuOpen(false); }}
            className="flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 text-sm font-medium w-full text-left text-foreground hover:bg-muted border border-border"
          >
            <Network className="h-4 w-4 flex-shrink-0" />
            <span>Navigation Maker</span>
          </button>
          
          <button
            onClick={() => { onProClick?.(); setMobileMenuOpen(false); }}
            className="flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 text-sm font-medium w-full text-left text-foreground hover:bg-muted"
          >
            <Crown className="h-4 w-4 flex-shrink-0" />
            <span>Upgrade to Pro</span>
          </button>
          
          {isAdmin && (
            <button
              onClick={() => { onAdminClick?.(); setMobileMenuOpen(false); }}
              className="flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 text-sm font-medium w-full text-left text-foreground hover:bg-muted"
            >
              <Shield className="h-4 w-4 flex-shrink-0" />
              <span>Admin Panel</span>
            </button>
          )}
        </nav>
      </SheetContent>
    </Sheet>
  );

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/40">
      <div className="container mx-auto px-4">
        <div className="flex items-center h-14 gap-4">
          <div className="md:hidden shrink-0"><MobileNav /></div>

          <div className={cn("flex items-center gap-2 shrink-0", isMobile && "flex-1 justify-center")}>
            <h1 className="text-base font-semibold text-foreground tracking-tight">EPIC</h1>
          </div>

          <div className="hidden md:flex flex-1 justify-center"><DesktopNav /></div>

          <div className="md:hidden w-10 shrink-0" />

          <div className="hidden md:flex items-center gap-2 shrink-0">
            <button
              onClick={() => navigate("/analyzer")}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-[0.625rem] text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors duration-200"
            >
              <Globe className="h-3.5 w-3.5" />
              Analyzer
            </button>
            <button
              onClick={() => navigate("/sitemaps")}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-[0.625rem] text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors duration-200"
            >
              <Library className="h-3.5 w-3.5" />
              Sitemaps
            </button>
            <button
              onClick={() => navigate("/navigation-maker")}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-[0.625rem] text-xs font-medium bg-primary/10 text-primary border border-primary/20 hover:bg-primary/15 transition-colors duration-200"
            >
              <Network className="h-3.5 w-3.5" />
              Nav Maker
              <span className="text-[9px] font-semibold bg-primary text-primary-foreground px-1.5 py-0.5 rounded-full ml-1">NEW</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};
