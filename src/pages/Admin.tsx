import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Shield, ArrowLeft, Crown, Calendar, Users, Megaphone, X } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";

interface UserData {
  id: string;
  email: string;
  username: string;
  is_premium: boolean;
  premium_until: string | null;
}

interface Announcement {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'alert';
  is_active: boolean;
  created_at: string;
}

const Admin = () => {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<UserData[]>([]);
  const [premiumDates, setPremiumDates] = useState<Record<string, string>>({});
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [newAnnouncement, setNewAnnouncement] = useState({
    title: '',
    message: '',
    type: 'info' as 'info' | 'warning' | 'success' | 'alert'
  });

  useEffect(() => {
    checkAdminAccess();
  }, []);

  const checkAdminAccess = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error("Please sign in to access admin panel");
        navigate("/auth");
        return;
      }

      const { data: roleData, error: roleError } = await supabase.rpc('has_role', {
        _user_id: user.id,
        _role: 'admin'
      });

      if (roleError) throw roleError;

      if (!roleData) {
        toast.error("Unauthorized: Admin access required");
        navigate("/");
        return;
      }

      setIsAdmin(true);
      await Promise.all([fetchUsers(), fetchAnnouncements()]);
    } catch (error) {
      console.error("Error checking admin access:", error);
      toast.error("Error verifying admin access");
      navigate("/");
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      // Fetch profiles with auth users
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, username');

      if (profilesError) throw profilesError;

      // Fetch subscriptions
      const { data: subscriptions, error: subsError } = await supabase
        .from('user_subscriptions')
        .select('user_id, is_premium, premium_until');

      if (subsError) throw subsError;

      // Combine data - we'll get emails from a different approach
      // Since admin.listUsers is not available on client side, we'll show IDs
      const combinedUsers: UserData[] = profiles?.map(profile => {
        const subscription = subscriptions?.find(s => s.user_id === profile.id);
        
        return {
          id: profile.id,
          email: profile.id.substring(0, 8) + '...', // Show partial ID as placeholder
          username: profile.username,
          is_premium: subscription?.is_premium || false,
          premium_until: subscription?.premium_until || null,
        };
      }) || [];

      setUsers(combinedUsers);

      // Initialize premium dates with existing dates
      const dates: Record<string, string> = {};
      combinedUsers.forEach(user => {
        if (user.premium_until) {
          dates[user.id] = new Date(user.premium_until).toISOString().split('T')[0];
        }
      });
      setPremiumDates(dates);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to fetch users");
    }
  };

  const grantPremium = async (userId: string) => {
    try {
      const premiumDate = premiumDates[userId];
      
      if (!premiumDate) {
        toast.error("Please select a premium expiry date");
        return;
      }

      const premiumUntil = new Date(premiumDate);
      premiumUntil.setHours(23, 59, 59, 999);

      const { error } = await supabase.rpc('admin_set_premium', {
        target_user: userId,
        is_premium: true,
        premium_until: premiumUntil.toISOString(),
      });

      if (error) throw error;

      toast.success("Premium access granted successfully!");
      await fetchUsers();
    } catch (error) {
      console.error("Error granting premium:", error);
      toast.error("Failed to grant premium access");
    }
  };

  const revokePremium = async (userId: string) => {
    try {
      const { error } = await supabase.rpc('admin_set_premium', {
        target_user: userId,
        is_premium: false,
        premium_until: null,
      });

      if (error) throw error;

      toast.success("Premium access revoked successfully!");
      await fetchUsers();
    } catch (error) {
      console.error("Error revoking premium:", error);
      toast.error("Failed to revoke premium access");
    }
  };

  const fetchAnnouncements = async () => {
    try {
      const { data, error } = await supabase
        .from('announcements')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAnnouncements((data || []) as Announcement[]);
    } catch (error) {
      console.error("Error fetching announcements:", error);
      toast.error("Failed to fetch announcements");
    }
  };

  const createAnnouncement = async () => {
    if (!newAnnouncement.title || !newAnnouncement.message) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { error } = await supabase
        .from('announcements')
        .insert({
          title: newAnnouncement.title,
          message: newAnnouncement.message,
          type: newAnnouncement.type,
          created_by: user?.id
        });

      if (error) throw error;

      toast.success("Announcement created successfully!");
      setNewAnnouncement({ title: '', message: '', type: 'info' });
      await fetchAnnouncements();
    } catch (error) {
      console.error("Error creating announcement:", error);
      toast.error("Failed to create announcement");
    }
  };

  const toggleAnnouncementStatus = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('announcements')
        .update({ is_active: !currentStatus })
        .eq('id', id);

      if (error) throw error;

      toast.success(`Announcement ${!currentStatus ? 'activated' : 'deactivated'}`);
      await fetchAnnouncements();
    } catch (error) {
      console.error("Error toggling announcement:", error);
      toast.error("Failed to update announcement");
    }
  };

  const deleteAnnouncement = async (id: string) => {
    try {
      const { error } = await supabase
        .from('announcements')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast.success("Announcement deleted successfully!");
      await fetchAnnouncements();
    } catch (error) {
      console.error("Error deleting announcement:", error);
      toast.error("Failed to delete announcement");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Shield className="h-12 w-12 animate-pulse mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Verifying admin access...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={() => navigate("/")} size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-2">
                <Shield className="h-8 w-8 text-primary" />
                Admin Panel
              </h1>
              <div className="flex items-center gap-4 mt-2">
                <p className="text-muted-foreground">Manage users & announcements</p>
                <div className="flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full">
                  <Users className="h-4 w-4 text-primary" />
                  <span className="text-sm font-semibold">{users.length} users</span>
                </div>
              </div>
            </div>
          </div>
          <ThemeToggle />
        </div>

        {/* Announcements Section */}
        <Card className="p-6 mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Megaphone className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-bold">Announcements</h2>
          </div>
          
          <div className="space-y-4">
            <div className="grid gap-4">
              <div>
                <Label htmlFor="announcement-title">Title</Label>
                <Input
                  id="announcement-title"
                  value={newAnnouncement.title}
                  onChange={(e) => setNewAnnouncement(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter announcement title"
                />
              </div>
              
              <div>
                <Label htmlFor="announcement-message">Message</Label>
                <Textarea
                  id="announcement-message"
                  value={newAnnouncement.message}
                  onChange={(e) => setNewAnnouncement(prev => ({ ...prev, message: e.target.value }))}
                  placeholder="Enter announcement message"
                  rows={3}
                />
              </div>
              
              <div>
                <Label htmlFor="announcement-type">Type</Label>
                <Select
                  value={newAnnouncement.type}
                  onValueChange={(value) => setNewAnnouncement(prev => ({ ...prev, type: value as any }))}
                >
                  <SelectTrigger id="announcement-type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="info">Info</SelectItem>
                    <SelectItem value="success">Success</SelectItem>
                    <SelectItem value="warning">Warning</SelectItem>
                    <SelectItem value="alert">Alert</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Button onClick={createAnnouncement} className="gradient-epic">
                Create Announcement
              </Button>
            </div>

            <div className="space-y-2 mt-6">
              <h3 className="font-semibold mb-3">Active Announcements</h3>
              {announcements.length === 0 ? (
                <p className="text-muted-foreground text-sm">No announcements yet</p>
              ) : (
                announcements.map((announcement) => (
                  <Card key={announcement.id} className="p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold">{announcement.title}</h4>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${
                            announcement.type === 'info' ? 'bg-blue-500/20 text-blue-500' :
                            announcement.type === 'success' ? 'bg-green-500/20 text-green-500' :
                            announcement.type === 'warning' ? 'bg-yellow-500/20 text-yellow-500' :
                            'bg-red-500/20 text-red-500'
                          }`}>
                            {announcement.type}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">{announcement.message}</p>
                        <p className="text-xs text-muted-foreground mt-2">
                          {new Date(announcement.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant={announcement.is_active ? "secondary" : "default"}
                          size="sm"
                          onClick={() => toggleAnnouncementStatus(announcement.id, announcement.is_active)}
                        >
                          {announcement.is_active ? 'Deactivate' : 'Activate'}
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => deleteAnnouncement(announcement.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))
              )}
            </div>
          </div>
        </Card>

        {/* Users Section */}
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <Crown className="h-6 w-6 text-primary" />
          Premium Management
        </h2>
        
        <div className="space-y-4">
          {users.length === 0 ? (
            <Card className="p-8 text-center">
              <p className="text-muted-foreground">No users found</p>
            </Card>
          ) : (
            users.map((user) => (
              <Card key={user.id} className="p-6">
                <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-lg truncate">{user.username}</h3>
                      {user.is_premium && (
                        <Crown className="h-5 w-5 text-yellow-500 flex-shrink-0" />
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground truncate">{user.email}</p>
                    {user.is_premium && user.premium_until && (
                      <p className="text-xs text-muted-foreground mt-1">
                        Premium until: {new Date(user.premium_until).toLocaleDateString()}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                      <Input
                        type="date"
                        value={premiumDates[user.id] || ''}
                        onChange={(e) => setPremiumDates(prev => ({
                          ...prev,
                          [user.id]: e.target.value
                        }))}
                        className="w-full sm:w-auto"
                        min={new Date().toISOString().split('T')[0]}
                      />
                    </div>

                    {user.is_premium ? (
                      <Button
                        variant="destructive"
                        onClick={() => revokePremium(user.id)}
                        className="w-full sm:w-auto"
                      >
                        Revoke Premium
                      </Button>
                    ) : (
                      <Button
                        onClick={() => grantPremium(user.id)}
                        className="w-full sm:w-auto gradient-epic"
                      >
                        Grant Premium
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Admin;
