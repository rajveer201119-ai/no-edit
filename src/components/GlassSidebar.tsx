import { useState } from "react";
import { MessageSquare, Image, Download, Menu, X, Sparkles, Shield, LogOut, LogIn } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useInstallPrompt } from "@/hooks/useInstallPrompt";

interface GlassSidebarProps {
  activeTab: "chat" | "feed";
  onTabChange: (tab: "chat" | "feed") => void;
  isAuthed: boolean;
  isAdmin: boolean;
  onSignOut: () => void;
  onSignIn: () => void;
  onViewPlans: () => void;
  onAdminClick: () => void;
}

export const GlassSidebar = ({
  activeTab,
  onTabChange,
  isAuthed,
  isAdmin,
  onSignOut,
  onSignIn,
  onViewPlans,
  onAdminClick,
}: GlassSidebarProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { isInstallable, promptInstall } = useInstallPrompt();

  const navItems = [
    { id: "chat" as const, label: "AI Chat", icon: MessageSquare },
    { id: "feed" as const, label: "AI Gallery", icon: Image },
  ];

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 p-2 rounded-xl md:hidden
          backdrop-blur-xl bg-background/20 border border-white/10
          shadow-[0_8px_32px_rgba(0,0,0,0.12),inset_0_1px_0_rgba(255,255,255,0.1)]
          hover:bg-background/30 transition-all duration-300"
        aria-label="Toggle menu"
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 h-full z-40 transition-transform duration-300 ease-out",
          "w-64 md:w-20 lg:w-64",
          "backdrop-blur-2xl bg-background/10 border-r border-white/10",
          "shadow-[0_0_60px_-15px_rgba(139,92,246,0.3),inset_0_1px_0_rgba(255,255,255,0.05)]",
          "md:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        {/* Glass effect overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/5 via-transparent to-black/10 pointer-events-none" />
        
        <div className="relative h-full flex flex-col p-4">
          {/* Logo Section */}
          <div className="flex items-center justify-center py-6 mb-4">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/30 blur-xl rounded-full animate-pulse" />
              <h1 className="relative text-2xl font-bold gradient-epic-text tracking-tight">
                <span className="md:hidden lg:inline">EPIC</span>
                <span className="hidden md:inline lg:hidden">E</span>
              </h1>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onTabChange(item.id);
                    setIsOpen(false);
                  }}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300",
                    "hover:bg-white/10 group relative overflow-hidden",
                    isActive && [
                      "bg-gradient-to-r from-primary/20 to-secondary/20",
                      "border border-primary/30",
                      "shadow-[0_0_20px_-5px_rgba(139,92,246,0.5),inset_0_1px_0_rgba(255,255,255,0.1)]"
                    ]
                  )}
                >
                  {/* Active indicator glow */}
                  {isActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary rounded-r-full shadow-[0_0_10px_rgba(139,92,246,0.8)]" />
                  )}
                  
                  <Icon className={cn(
                    "h-5 w-5 transition-colors shrink-0",
                    isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                  )} />
                  
                  <span className={cn(
                    "font-medium transition-colors md:hidden lg:inline",
                    isActive ? "text-foreground" : "text-muted-foreground group-hover:text-foreground"
                  )}>
                    {item.label}
                  </span>
                </button>
              );
            })}
          </nav>

          {/* Bottom Actions */}
          <div className="space-y-2 pt-4 border-t border-white/10">
            {/* Install Button - Always show if installable */}
            {isInstallable && (
              <button
                onClick={promptInstall}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl
                  bg-gradient-to-r from-accent/20 to-accent/30
                  border border-accent/30 hover:border-accent/50
                  transition-all duration-300 group"
              >
                <Download className="h-5 w-5 text-accent-foreground shrink-0" />
                <span className="font-medium text-accent-foreground md:hidden lg:inline">Install App</span>
              </button>
            )}

            {/* View Plans */}
            <button
              onClick={onViewPlans}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl
                hover:bg-white/10 transition-all duration-300 group"
            >
              <Sparkles className="h-5 w-5 text-muted-foreground group-hover:text-primary shrink-0" />
              <span className="font-medium text-muted-foreground group-hover:text-foreground md:hidden lg:inline">
                View Plans
              </span>
            </button>

            {/* Admin Button */}
            {isAdmin && (
              <button
                onClick={onAdminClick}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl
                  hover:bg-white/10 transition-all duration-300 group"
              >
                <Shield className="h-5 w-5 text-muted-foreground group-hover:text-secondary shrink-0" />
                <span className="font-medium text-muted-foreground group-hover:text-foreground md:hidden lg:inline">
                  Admin
                </span>
              </button>
            )}

            {/* Theme Toggle */}
            <div className="flex items-center gap-3 px-4 py-3">
              <ThemeToggle />
              <span className="font-medium text-muted-foreground md:hidden lg:inline">Theme</span>
            </div>

            {/* Auth Button */}
            {isAuthed ? (
              <button
                onClick={onSignOut}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl
                  hover:bg-destructive/10 transition-all duration-300 group"
              >
                <LogOut className="h-5 w-5 text-muted-foreground group-hover:text-destructive shrink-0" />
                <span className="font-medium text-muted-foreground group-hover:text-destructive md:hidden lg:inline">
                  Sign Out
                </span>
              </button>
            ) : (
              <button
                onClick={onSignIn}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl
                  bg-gradient-to-r from-primary/20 to-secondary/20
                  border border-primary/30 hover:border-primary/50
                  transition-all duration-300 group"
              >
                <LogIn className="h-5 w-5 text-primary shrink-0" />
                <span className="font-medium text-primary md:hidden lg:inline">
                  Sign In
                </span>
              </button>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};
