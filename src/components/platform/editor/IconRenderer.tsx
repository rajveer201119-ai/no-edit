import { memo, useMemo } from "react";
import {
  Star, Heart, Circle, Square, Triangle, Hexagon, Pentagon, Octagon,
  ArrowRight, ArrowUp, ArrowDown, ArrowLeft, Check, X, Plus, Minus,
  AlertTriangle, Info, HelpCircle, MessageCircle, MessageSquare,
  Mail, Phone, MapPin, Calendar, Clock, User, Users, Home, Settings,
  Search, Bookmark, Flag, Award, Zap, Sun, Moon, Cloud, Flame,
  Droplet, Leaf, Music, Camera, Video, Mic, Headphones, Wifi,
  Battery, Globe, Lock, Unlock, Eye, EyeOff, Bell, Gift, ShoppingCart,
  CreditCard, DollarSign, TrendingUp, TrendingDown, BarChart, PieChart,
  Activity, Target, Crosshair, Compass, Navigation, Send, Share2,
  Download, Upload, ExternalLink, Link, Paperclip, File, FileText,
  Folder, Image, Type, Bold, Italic, Underline, AlignLeft, AlignCenter,
  AlignRight, List, CheckSquare, Smile, Frown, Meh, ThumbsUp, ThumbsDown,
  Coffee, Utensils, Briefcase, GraduationCap, Book, Lightbulb, Rocket,
  Sparkles, Crown, Trophy, LucideIcon,
} from "lucide-react";

// Map of icon names to components
const iconMap: Record<string, LucideIcon> = {
  Star, Heart, Circle, Square, Triangle, Hexagon, Pentagon, Octagon,
  ArrowRight, ArrowUp, ArrowDown, ArrowLeft, Check, X, Plus, Minus,
  AlertTriangle, Info, HelpCircle, MessageCircle, MessageSquare,
  Mail, Phone, MapPin, Calendar, Clock, User, Users, Home, Settings,
  Search, Bookmark, Flag, Award, Zap, Sun, Moon, Cloud, Flame,
  Droplet, Leaf, Music, Camera, Video, Mic, Headphones, Wifi,
  Battery, Globe, Lock, Unlock, Eye, EyeOff, Bell, Gift, ShoppingCart,
  CreditCard, DollarSign, TrendingUp, TrendingDown, BarChart, PieChart,
  Activity, Target, Crosshair, Compass, Navigation, Send, Share: Share2,
  Download, Upload, ExternalLink, Link, Paperclip, File, FileText,
  Folder, Image, Type, Bold, Italic, Underline, AlignLeft, AlignCenter,
  AlignRight, List, CheckSquare, Smile, Frown, Meh, ThumbsUp, ThumbsDown,
  Coffee, Utensils, Briefcase, GraduationCap, Book, Lightbulb, Rocket,
  Sparkles, Crown, Trophy,
};

interface IconLayerRendererProps {
  iconName: string;
  width: number;
  height: number;
  color?: string;
  strokeWidth?: number;
  rotation?: number;
  opacity?: number;
}

export const IconLayerRenderer = memo(({
  iconName,
  width,
  height,
  color = "#3b82f6",
  strokeWidth = 2,
  rotation = 0,
  opacity = 1,
}: IconLayerRendererProps) => {
  const IconComponent = useMemo(() => iconMap[iconName], [iconName]);
  
  if (!IconComponent) {
    // Fallback for unknown icons - render a placeholder
    return (
      <div
        style={{
          width,
          height,
          transform: `rotate(${rotation}deg)`,
          opacity,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: color,
          borderRadius: "8px",
        }}
      >
        <span style={{ color: "#fff", fontSize: Math.min(width, height) * 0.3 }}>?</span>
      </div>
    );
  }

  return (
    <div
      style={{
        width,
        height,
        transform: `rotate(${rotation}deg)`,
        opacity,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <IconComponent
        width={width * 0.8}
        height={height * 0.8}
        color={color}
        strokeWidth={strokeWidth}
      />
    </div>
  );
});

IconLayerRenderer.displayName = "IconLayerRenderer";

export const getIconComponent = (iconName: string): LucideIcon | null => {
  return iconMap[iconName] || null;
};

export const isValidIconName = (iconName: string): boolean => {
  return iconName in iconMap;
};
