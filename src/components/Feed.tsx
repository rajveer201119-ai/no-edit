import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { FeedCard } from "./FeedCard";
import { Loader2 } from "lucide-react";

interface Post {
  id: string;
  image_url: string;
  content: string;
  created_at: string;
  user_id: string;
  profiles: {
    username: string;
    avatar_url: string;
  };
  likes: { id: string; user_id: string }[];
}

export const Feed = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<string | null>(null);

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

          return {
            ...post,
            profiles: profile || { username: "Unknown", avatar_url: "" },
            likes: likes || [],
          };
        })
      );

      setPosts(postsWithDetails);
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
        {posts.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            No images yet. Be the first to generate!
          </div>
        ) : (
          posts.map((post) => (
            <FeedCard
              key={post.id}
              post={post}
              currentUser={currentUser}
              onLike={handleLike}
            />
          ))
        )}
      </div>
    </section>
  );
};
