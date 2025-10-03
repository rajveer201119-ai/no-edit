import { memo } from "react";
import { Download, Heart, Trash2 } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { toast } from "sonner";

interface FeedCardProps {
  post: {
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
    favorites: { id: string; user_id: string }[];
    tags: string[];
  };
  currentUser: string | null;
  onLike: (postId: string) => void;
  onFavorite: (postId: string) => void;
  onDelete: (postId: string) => void;
}

const FeedCardComponent = ({ post, currentUser, onLike, onFavorite, onDelete }: FeedCardProps) => {
  const hasLiked = currentUser ? post.likes.some(like => like.user_id === currentUser) : false;
  const hasFavorited = currentUser ? post.favorites.some(fav => fav.user_id === currentUser) : false;

  const handleDownload = async () => {
    try {
      const response = await fetch(post.image_url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `ai-image-${post.id}.png`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success("Image downloaded!");
    } catch (error) {
      console.error("Download error:", error);
      toast.error("Failed to download image");
    }
  };

  return (
    <Card className="glass-card overflow-hidden animate-fade-in">
      <div className="p-4 flex items-center gap-3">
        <Avatar>
          <AvatarImage src={post.profiles.avatar_url} />
          <AvatarFallback>{post.profiles.username[0].toUpperCase()}</AvatarFallback>
        </Avatar>
        <div>
          <p className="font-semibold">{post.profiles.username}</p>
          <p className="text-xs text-muted-foreground">
            {new Date(post.created_at).toLocaleDateString()}
          </p>
        </div>
      </div>

      <div className="relative group">
        <img
          src={post.image_url}
          alt={post.content}
          className="w-full aspect-square object-cover"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
      </div>

      <div className="p-4 space-y-3">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onLike(post.id)}
            disabled={!currentUser}
            className={hasLiked ? "text-red-500" : ""}
          >
            <Heart className={hasLiked ? "fill-current" : ""} />
          </Button>
          <span className="text-sm text-muted-foreground">
            {post.likes.length} {post.likes.length === 1 ? "like" : "likes"}
          </span>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onFavorite(post.id)}
            disabled={!currentUser}
            className={hasFavorited ? "text-yellow-500" : ""}
            title="Add to favorites"
          >
            <Heart className={hasFavorited ? "fill-current" : ""} />
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={handleDownload}
            className="ml-auto"
          >
            <Download />
          </Button>

          {currentUser === post.user_id && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDelete(post.id)}
              className="text-destructive hover:text-destructive"
              title="Delete post"
            >
              <Trash2 />
            </Button>
          )}
        </div>

        <p className="text-sm">{post.content}</p>
        
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
};

export const FeedCard = memo(FeedCardComponent);
