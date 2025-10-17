import { Home, Image, Sparkles, User, Settings } from "lucide-react";
import { NavLink } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

const items = [
  { title: "Home", url: "/", icon: Home },
  { title: "Generate", url: "#generate", icon: Image },
  { title: "Feed", url: "#feed", icon: Sparkles },
  { title: "Profile", url: "/auth", icon: User },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  return (
    <Sidebar className="border-r border-border/50 bg-card/50 backdrop-blur-lg">
      <SidebarContent className="p-4 md:p-6">
        <div className="mb-6 md:mb-8">
          <h2 className="text-xl md:text-2xl font-bold gradient-epic-text">EPIC AI</h2>
          {!isCollapsed && (
            <div className="hidden lg:block mt-8 -rotate-90 origin-left translate-y-32 whitespace-nowrap">
              <span className="text-xs font-medium tracking-[0.3em] text-muted-foreground">
                CREATIVE STUDIO
              </span>
            </div>
          )}
        </div>

        <SidebarGroup className="mt-8 lg:mt-20">
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className="h-11 md:h-12 mb-2">
                    <a
                      href={item.url}
                      className="flex items-center gap-3 px-3 rounded-xl hover:bg-primary/10 transition-all"
                    >
                      <item.icon className="h-5 w-5 flex-shrink-0" />
                      {!isCollapsed && (
                        <span className="font-medium">{item.title}</span>
                      )}
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
