import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { SEO } from "@/components/SEO";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useUserPlan } from "@/hooks/useUserPlan";
import { toast } from "sonner";
import { Plus, Trash2, ArrowLeft, Clock, FolderOpen, Crown } from "lucide-react";
import { format } from "date-fns";

interface SitemapProject {
  id: string;
  name: string;
  nodes: any[];
  connections: any[];
  created_at: string;
  updated_at: string;
}

const MyProjects = () => {
  const navigate = useNavigate();
  const { isPremium, userId, isLoading: planLoading } = useUserPlan();
  const [projects, setProjects] = useState<SitemapProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  const fetchProjects = async () => {
    if (!userId) return;
    const { data } = await supabase
      .from("sitemap_projects" as any)
      .select("*")
      .eq("user_id", userId)
      .order("updated_at", { ascending: false });
    if (data) setProjects(data as any as SitemapProject[]);
    setLoading(false);
  };

  useEffect(() => {
    if (planLoading) return;
    if (!userId) { setLoading(false); return; }
    fetchProjects();
  }, [userId, planLoading]);

  const deleteProject = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    setDeleting(id);
    const { error } = await supabase.from("sitemap_projects" as any).delete().eq("id", id);
    if (error) { toast.error("Failed to delete"); } else {
      setProjects(prev => prev.filter(p => p.id !== id));
      toast.success(`"${name}" deleted`);
    }
    setDeleting(null);
  };

  const limit = isPremium ? Infinity : 3;
  const canCreate = projects.length < limit;

  return (
    <>
      <SEO title="My Projects — EPIC" description="Manage your saved sitemap projects." noIndex />

      <header className="sticky top-0 z-50 h-14 bg-background/80 backdrop-blur-xl border-b border-border/40 flex items-center px-5 gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate("/")} className="h-9 w-9 rounded-lg">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <FolderOpen className="h-4 w-4 text-primary" />
        <h1 className="text-sm font-semibold">My Projects</h1>
        <div className="flex-1" />
        {!isPremium && (
          <span className="text-xs text-muted-foreground">{projects.length}/3 projects</span>
        )}
        <Button
          size="sm"
          disabled={!canCreate}
          onClick={() => navigate("/navigation-maker")}
          className="gap-1.5 h-8 text-xs rounded-lg"
        >
          <Plus className="h-3.5 w-3.5" /> New Project
        </Button>
      </header>

      <main className="min-h-[calc(100vh-3.5rem)] bg-background p-6">
        <div className="max-w-4xl mx-auto">
          {!userId && !loading && (
            <div className="text-center py-20">
              <h2 className="text-xl font-bold mb-2">Sign in to save projects</h2>
              <p className="text-muted-foreground text-sm mb-4">Your sitemap projects are stored in the cloud so you can access them anywhere.</p>
              <Button onClick={() => navigate("/auth")}>Sign In</Button>
            </div>
          )}

          {loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3].map(i => (
                <Skeleton key={i} className="h-36 rounded-xl" />
              ))}
            </div>
          )}

          {!loading && userId && projects.length === 0 && (
            <div className="text-center py-20">
              <FolderOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h2 className="text-xl font-bold mb-2">No projects yet</h2>
              <p className="text-muted-foreground text-sm mb-4">Create your first sitemap project to get started.</p>
              <Button onClick={() => navigate("/navigation-maker")} className="gap-1.5">
                <Plus className="h-4 w-4" /> Create Project
              </Button>
            </div>
          )}

          {!loading && projects.length > 0 && (
            <>
              {!isPremium && !canCreate && (
                <div className="mb-6 p-4 rounded-xl border border-amber-500/30 bg-amber-500/5 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Free plan limit reached (3/3)</p>
                    <p className="text-xs text-muted-foreground">Upgrade to Pro for unlimited projects.</p>
                  </div>
                  <Button size="sm" variant="outline" onClick={() => navigate("/pricing-international")} className="gap-1.5">
                    <Crown className="h-3.5 w-3.5 text-amber-500" /> Upgrade
                  </Button>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {projects.map(project => (
                  <Card key={project.id} className="p-5 flex flex-col gap-3 hover:shadow-md transition-shadow group">
                    <div className="flex items-start justify-between">
                      <div className="min-w-0 flex-1">
                        <h3 className="font-semibold text-sm truncate">{project.name}</h3>
                        <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                          <Clock className="h-3 w-3" />
                          {format(new Date(project.updated_at), "MMM d, yyyy · h:mm a")}
                        </p>
                      </div>
                    </div>

                    <div className="text-xs text-muted-foreground">
                      {Array.isArray(project.nodes) ? project.nodes.length : 0} pages · {Array.isArray(project.connections) ? project.connections.length : 0} connections
                    </div>

                    <div className="flex items-center gap-2 mt-auto pt-2 border-t border-border/40">
                      <Button
                        size="sm"
                        className="flex-1 h-8 text-xs rounded-lg"
                        onClick={() => navigate(`/navigation-maker?project=${project.id}`)}
                      >
                        Open
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                        disabled={deleting === project.id}
                        onClick={() => deleteProject(project.id, project.name)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </>
          )}
        </div>
      </main>
    </>
  );
};

export default MyProjects;
