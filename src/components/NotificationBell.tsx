import { useState, useEffect } from "react";
import { Bell, X, Info, AlertTriangle, CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from "@/integrations/supabase/client";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";

interface Announcement {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'alert';
  created_at: string;
}

export const NotificationBell = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [readIds, setReadIds] = useState<Set<string>>(new Set());
  const [isOpen, setIsOpen] = useState(false);

  // Load read notifications from localStorage
  useEffect(() => {
    const savedReadIds = localStorage.getItem("epic_read_notifications");
    if (savedReadIds) {
      try {
        setReadIds(new Set(JSON.parse(savedReadIds)));
      } catch {
        // Ignore parse errors
      }
    }
  }, []);

  // Fetch announcements
  useEffect(() => {
    fetchAnnouncements();

    // Subscribe to real-time changes
    const channel = supabase
      .channel('announcements-bell')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'announcements',
        },
        () => {
          fetchAnnouncements();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchAnnouncements = async () => {
    try {
      const { data, error } = await supabase
        .from('announcements')
        .select('id, title, message, type, created_at')
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      setAnnouncements((data || []) as Announcement[]);
    } catch (error) {
      console.error("Error fetching announcements:", error);
    }
  };

  // Mark all as read when opening
  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (open && announcements.length > 0) {
      const allIds = new Set([...readIds, ...announcements.map(a => a.id)]);
      setReadIds(allIds);
      localStorage.setItem("epic_read_notifications", JSON.stringify([...allIds]));
    }
  };

  // Clear a single notification
  const dismissNotification = (id: string) => {
    const newReadIds = new Set([...readIds, id]);
    setReadIds(newReadIds);
    localStorage.setItem("epic_read_notifications", JSON.stringify([...newReadIds]));
  };

  // Count unread notifications
  const unreadCount = announcements.filter(a => !readIds.has(a.id)).length;

  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'alert':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Info className="h-4 w-4 text-blue-500" />;
    }
  };

  const getTypeStyles = (type: string) => {
    switch (type) {
      case 'success':
        return "border-l-green-500 bg-green-500/5";
      case 'warning':
        return "border-l-yellow-500 bg-yellow-500/5";
      case 'alert':
        return "border-l-red-500 bg-red-500/5";
      default:
        return "border-l-blue-500 bg-blue-500/5";
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative h-9 w-9"
          title="Notifications"
        >
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-red-500 text-[10px] font-bold text-white flex items-center justify-center animate-pulse">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="p-3 border-b border-border/50">
          <h3 className="font-semibold text-sm flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Notifications
          </h3>
        </div>
        <ScrollArea className="h-[300px]">
          {announcements.length === 0 ? (
            <div className="p-6 text-center">
              <Bell className="h-8 w-8 mx-auto text-muted-foreground/30 mb-2" />
              <p className="text-sm text-muted-foreground">No notifications yet</p>
              <p className="text-xs text-muted-foreground mt-1">
                You'll see updates here
              </p>
            </div>
          ) : (
            <div className="divide-y divide-border/30">
              {announcements.map((announcement) => (
                <div
                  key={announcement.id}
                  className={cn(
                    "p-3 border-l-2 transition-colors relative",
                    getTypeStyles(announcement.type),
                    !readIds.has(announcement.id) && "bg-muted/30"
                  )}
                >
                  <div className="flex items-start gap-2">
                    <div className="mt-0.5 flex-shrink-0">
                      {getIcon(announcement.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium text-sm truncate">
                          {announcement.title}
                        </h4>
                        {!readIds.has(announcement.id) && (
                          <span className="h-2 w-2 rounded-full bg-primary flex-shrink-0" />
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                        {announcement.message}
                      </p>
                      <p className="text-[10px] text-muted-foreground/70 mt-1">
                        {formatDistanceToNow(new Date(announcement.created_at), { addSuffix: true })}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 flex-shrink-0 opacity-50 hover:opacity-100"
                      onClick={() => dismissNotification(announcement.id)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
};
