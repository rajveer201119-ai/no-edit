import { useState, useEffect } from "react";
import { 
  MessageSquare, 
  Image, 
  Download, 
  Menu, 
  X, 
  Sparkles, 
  Shield, 
  LogOut, 
  LogIn,
  FolderOpen,
  Plus,
  Trash2,
  PanelLeftClose,
  PanelLeft
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useInstallPrompt } from "@/hooks/useInstallPrompt";
import { supabase } from "@/integrations/supabase/client";

export interface Project {
  id: string;
  name: string;
  prompt: string;
  image_url: string | null;
  created_at: string;
  updated_at: string;
}

export type TabType = "chat" | "feed" | { type: "project"; project: Project };

interface GlassSidebarProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  isAuthed: boolean;
  isAdmin: boolean;
  currentUserId: string | null;
  onSignOut: () => void;
  onSignIn: () => void;
  onViewPlans: () => void;
  onAdminClick: () => void;
  projects: Project[];
  onProjectsChange: () => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
  /** When a full-screen overlay (e.g. editor) is open, hide/disable sidebar UI to prevent overlap. */
  isOverlayActive?: boolean;
}

export const GlassSidebar = ({
  activeTab,
  onTabChange,
  isAuthed,
  isAdmin,
  currentUserId,
  onSignOut,
  onSignIn,
  onViewPlans,
  onAdminClick,
  projects,
  onProjectsChange,
  isCollapsed = false,
  onToggleCollapse,
  isOverlayActive = false,
}: GlassSidebarProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { isInstallable, promptInstall } = useInstallPrompt();

  useEffect(() => {
    if (isOverlayActive) setIsOpen(false);
  }, [isOverlayActive]);

  const navItems = [
    { id: "chat" as const, label: "AI Chat", icon: MessageSquare },
    { id: "feed" as const, label: "AI Gallery", icon: Image },
  ];

  const isTabActive = (tabId: "chat" | "feed") => {
    if (typeof activeTab === "string") {
      return activeTab === tabId;
    }
    return false;
  };

  const isProjectActive = (projectId: string) => {
    if (typeof activeTab === "object" && activeTab.type === "project") {
      return activeTab.project.id === projectId;
    }
    return false;
  };

  const handleDeleteProject = async (projectId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    const { error } = await supabase
      .from("projects")
      .delete()
      .eq("id", projectId);
    
    if (!error) {
      onProjectsChange();
      if (isProjectActive(projectId)) {
        onTabChange("chat");
      }
    }
  };

  return (
    <>
      {/* Toggle Button - visible when sidebar is collapsed or on mobile */}
      <button
        onClick={() => {
          if (window.innerWidth < 768) {
            setIsOpen(!isOpen);
          } else {
            onToggleCollapse?.();
          }
        }}
        className={cn(
          "fixed top-4 z-40 p-2 rounded-xl",
          "backdrop-blur-md bg-background/60 border border-white/20",
          "shadow-lg hover:bg-background/80 transition-all duration-300",
          isCollapsed || isOverlayActive ? "left-4" : "left-4 md:left-[76px] lg:left-[220px]",
          // Hide toggle when editor is active (signal lights take precedence)
          isOverlayActive && "md:opacity-0 md:pointer-events-none"
        )}
        aria-label="Toggle sidebar"
      >
        {/* Desktop icon */}
        {isCollapsed ? (
          <PanelLeft className="h-5 w-5 hidden md:block" />
        ) : (
          <PanelLeftClose className="h-5 w-5 hidden md:block" />
        )}

        {/* Mobile icons */}
        {isOpen ? (
          <X className="h-5 w-5 md:hidden" />
        ) : (
          <Menu className="h-5 w-5 md:hidden" />
        )}
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
          "fixed left-0 top-0 h-full z-30 transition-all duration-300 ease-out",
          "backdrop-blur-md bg-background/90 border-r border-border/30",
          "shadow-xl",
          // Mobile: slide in/out (higher z-index when open)
          isOpen ? "translate-x-0 z-50" : "-translate-x-full",
          // Desktop: always visible unless collapsed or overlay active
          "md:translate-x-0",
          // Collapsed or overlay active - hide sidebar on desktop
          (isCollapsed || isOverlayActive) ? "md:-translate-x-full" : "w-64 md:w-20 lg:w-64"
        )}
      >
        {/* Glass effect overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/5 via-transparent to-black/10 pointer-events-none" />
        
        <div className="relative h-full flex flex-col p-4 overflow-hidden">
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
          <nav className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = isTabActive(item.id);
              
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

          {/* Projects Section */}
          {isAuthed && projects.length > 0 && (
            <div className="mt-4 flex-1 overflow-hidden flex flex-col">
              <div className="flex items-center gap-2 px-2 py-2 text-xs text-muted-foreground uppercase tracking-wider">
                <FolderOpen className="h-3 w-3" />
                <span className="md:hidden lg:inline">Projects</span>
              </div>
              
              <div className="flex-1 overflow-y-auto space-y-1 scrollbar-thin scrollbar-thumb-white/10">
                {projects.map((project) => {
                  const isActive = isProjectActive(project.id);
                  
                  return (
                    <div
                      key={project.id}
                      onClick={() => {
                        onTabChange({ type: "project", project });
                        setIsOpen(false);
                      }}
                      className={cn(
                        "w-full flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 cursor-pointer",
                        "hover:bg-white/10 group relative text-left",
                        isActive && [
                          "bg-primary/20 border border-primary/30"
                        ]
                      )}
                    >
                      {project.image_url ? (
                        <img 
                          src={project.image_url} 
                          alt="" 
                          className="w-8 h-8 rounded object-cover shrink-0"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded bg-muted/50 shrink-0" />
                      )}
                      
                      <span className={cn(
                        "text-sm truncate flex-1 md:hidden lg:inline",
                        isActive ? "text-foreground" : "text-muted-foreground"
                      )}>
                        {project.name}
                      </span>
                      
                      <button
                        onClick={(e) => handleDeleteProject(project.id, e)}
                        className="opacity-0 group-hover:opacity-100 p-1 hover:bg-destructive/20 rounded transition-opacity md:hidden lg:flex"
                      >
                        <Trash2 className="h-3 w-3 text-destructive" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Bottom Actions */}
          <div className="space-y-2 pt-4 border-t border-white/10 mt-auto">
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
