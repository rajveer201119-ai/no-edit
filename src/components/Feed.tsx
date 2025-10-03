import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { FeedCard } from "./FeedCard";
import { Loader2, Search, Heart } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

interface Post {
  id: string;
  image_url: string;
  content: string;
  created_at: string;
  user_id: string;
  tags: string[];
  profiles: {
    username: string;
    avatar_url: string;
  };
  likes: { id: string; user_id: string }[];
  favorites: { id: string; user_id: string }[];
}

export const Feed = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [allTags, setAllTags] = useState<string[]>([]);

  useEffect(() => {
    fetchPosts();
    getCurrentUser();

    // Subscribe to new posts
    const channel = supabase
      .channel('posts-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'posts'
        },
        () => {
          fetchPosts();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const getCurrentUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setCurrentUser(user?.id || null);
  };

  const fetchPosts = async () => {
    try {
      const { data: postsData, error: postsError } = await supabase
        .from("posts")
        .select("*")
        .not("image_url", "is", null)
        .order("created_at", { ascending: false });

      if (postsError) throw postsError;

      const postsWithDetails = await Promise.all(
        (postsData || []).map(async (post) => {
          const { data: profile } = await supabase
            .from("profiles")
            .select("username, avatar_url")
            .eq("id", post.user_id)
            .single();

          const { data: likes } = await supabase
            .from("likes")
            .select("id, user_id")
            .eq("post_id", post.id);

          const { data: favorites } = await supabase
            .from("favorites")
            .select("id, user_id")
            .eq("post_id", post.id);

          return {
            ...post,
            profiles: profile || { username: "Unknown", avatar_url: "" },
            likes: likes || [],
            favorites: favorites || [],
            tags: post.tags || [],
          };
        })
      );

      setPosts(postsWithDetails);
      
      // Extract all unique tags
      const tags = new Set<string>();
      postsWithDetails.forEach(post => {
        post.tags?.forEach(tag => tags.add(tag));
      });
      setAllTags(Array.from(tags));
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (postId: string) => {
    if (!currentUser) return;

    const post = posts.find(p => p.id === postId);
    const hasLiked = post?.likes.some(like => like.user_id === currentUser);

    if (hasLiked) {
      const likeId = post?.likes.find(like => like.user_id === currentUser)?.id;
      await supabase.from("likes").delete().eq("id", likeId);
    } else {
      await supabase.from("likes").insert({ post_id: postId, user_id: currentUser });
    }

    fetchPosts();
  };

  const handleFavorite = async (postId: string) => {
    if (!currentUser) return;

    const post = posts.find(p => p.id === postId);
    const hasFavorited = post?.favorites.some(fav => fav.user_id === currentUser);

    if (hasFavorited) {
      const favId = post?.favorites.find(fav => fav.user_id === currentUser)?.id;
      await supabase.from("favorites").delete().eq("id", favId);
    } else {
      await supabase.from("favorites").insert({ post_id: postId, user_id: currentUser });
    }

    fetchPosts();
  };

  const handleDelete = async (postId: string) => {
    if (!currentUser) return;

    const { error } = await supabase.from("posts").delete().eq("id", postId);
    
    if (error) {
      toast.error("Failed to delete post");
      return;
    }

    toast.success("Post deleted successfully");
    fetchPosts();
  };

  const filteredPosts = posts.filter(post => {
    const matchesSearch = searchQuery === "" || 
      post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesTag = !selectedTag || post.tags?.includes(selectedTag);
    
    return matchesSearch && matchesTag;
  });

  const favoritePosts = posts.filter(post => 
    post.favorites.some(fav => fav.user_id === currentUser)
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <section className="py-12">
      <div className="text-center mb-8">
        <h2 className="text-4xl font-bold mb-2 gradient-epic-text">
          AI Gallery
        </h2>
        <p className="text-muted-foreground">
          Discover mind-blowing AI-generated masterpieces
        </p>
      </div>

      <div className="max-w-2xl mx-auto space-y-6">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search images by keywords or tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Tags Filter */}
        {allTags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedTag === null ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedTag(null)}
            >
              All
            </Button>
            {allTags.map((tag) => (
              <Badge
                key={tag}
                variant={selectedTag === tag ? "default" : "outline"}
                className="cursor-pointer hover:bg-primary/80"
                onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
              >
                {tag}
              </Badge>
            ))}
          </div>
        )}

        {/* Tabs for All Posts and Favorites */}
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="all">All Images</TabsTrigger>
            <TabsTrigger value="favorites" className="flex items-center gap-2">
              <Heart className="h-4 w-4" />
              Favorites
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-6 mt-6">
            {filteredPosts.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                {searchQuery || selectedTag ? "No images match your search" : "No images yet. Be the first to generate!"}
              </div>
            ) : (
              filteredPosts.map((post) => (
                <FeedCard
                  key={post.id}
                  post={post}
                  currentUser={currentUser}
                  onLike={handleLike}
                  onFavorite={handleFavorite}
                  onDelete={handleDelete}
                />
              ))
            )}
          </TabsContent>

          <TabsContent value="favorites" className="space-y-6 mt-6">
            {favoritePosts.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                No favorite images yet. Click the heart icon to save your favorites!
              </div>
            ) : (
              favoritePosts.map((post) => (
                <FeedCard
                  key={post.id}
                  post={post}
                  currentUser={currentUser}
                  onLike={handleLike}
                  onFavorite={handleFavorite}
                  onDelete={handleDelete}
                />
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
};
