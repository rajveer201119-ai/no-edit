import { useState, useRef, useCallback, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Download, 
  Crop, 
  Send, 
  Loader2, 
  RotateCcw,
  ZoomIn,
  ZoomOut,
  X,
  MessageSquare,
  Image as ImageIcon,
  Sparkles,
  Zap,
  Upload,
  Move,
  Trash2,
  Plus,
  Minus,
  Type,
  Terminal,
  Activity,
  Wifi,
  Circle,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { TextToolPanel, TextOverlay } from "./TextToolPanel";

interface ImageEditorProps {
  projectId: string;
  projectName: string;
  imageUrl: string;
  onImageUpdate: (newImageUrl: string) => void;
  onClose: () => void;
}

interface CropArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface ImageOverlay {
  id: string;
  src: string;
  x: number;
  y: number;
  width: number;
  height: number;
  originalWidth: number;
  originalHeight: number;
}

export const ImageEditor = ({ 
  projectId, 
  projectName, 
  imageUrl, 
  onImageUpdate,
  onClose 
}: ImageEditorProps) => {
  const [currentImage, setCurrentImage] = useState(imageUrl);
  const [editPrompt, setEditPrompt] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [isCropping, setIsCropping] = useState(false);
  const [cropArea, setCropArea] = useState<CropArea | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [activeTab, setActiveTab] = useState<"chat" | "preview">("preview");
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content: `Welcome to the editor! Describe any changes you'd like to make to "${projectName}". For example: "make it darker", "add a border", or "change the background to blue".`,
      timestamp: new Date()
    }
  ]);
  const [remainingCredits, setRemainingCredits] = useState<number | null>(null);
  const [isPremium, setIsPremium] = useState(false);
  
  // Overlay state
  const [overlays, setOverlays] = useState<ImageOverlay[]>([]);
  const [activeOverlayId, setActiveOverlayId] = useState<string | null>(null);
  const [isDraggingOverlay, setIsDraggingOverlay] = useState(false);
  const [overlayDragOffset, setOverlayDragOffset] = useState({ x: 0, y: 0 });
  
  // Text overlay state
  const [textOverlays, setTextOverlays] = useState<TextOverlay[]>([]);
  const [activeTextId, setActiveTextId] = useState<string | null>(null);
  const [isDraggingText, setIsDraggingText] = useState(false);
  const [textDragOffset, setTextDragOffset] = useState({ x: 0, y: 0 });
  const [showTextTool, setShowTextTool] = useState(false);
  
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const chatScrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch edit credits on mount and after edits
  const fetchCredits = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase.rpc("check_edit_limit", {
          user_id_param: user.id
        });
        if (data?.[0]) {
          setRemainingCredits(data[0].remaining_edits);
          setIsPremium(data[0].is_premium);
        }
      }
    } catch (error) {
      console.error("Failed to fetch credits:", error);
    }
  }, []);

  useEffect(() => {
    fetchCredits();
  }, [fetchCredits]);

  useEffect(() => {
    setCurrentImage(imageUrl);
  }, [imageUrl]);

  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [chatMessages]);

  // Handle file upload for overlays
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error("Please upload an image file");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        // Scale down if too large (max 200px initial size)
        const maxSize = 200;
        let width = img.width;
        let height = img.height;
        
        if (width > maxSize || height > maxSize) {
          const ratio = Math.min(maxSize / width, maxSize / height);
          width = width * ratio;
          height = height * ratio;
        }

        const newOverlay: ImageOverlay = {
          id: Date.now().toString(),
          src: event.target?.result as string,
          x: 50,
          y: 50,
          width,
          height,
          originalWidth: img.width,
          originalHeight: img.height
        };
        
        setOverlays(prev => [...prev, newOverlay]);
        setActiveOverlayId(newOverlay.id);
        toast.success("Image added! Drag to position it.");
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
    
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Overlay drag handlers
  const handleOverlayPointerDown = (e: React.MouseEvent | React.TouchEvent, overlayId: string) => {
    e.stopPropagation();
    if (isCropping) return;
    
    const overlay = overlays.find(o => o.id === overlayId);
    if (!overlay) return;

    setActiveOverlayId(overlayId);
    setIsDraggingOverlay(true);

    const rect = imageContainerRef.current?.getBoundingClientRect();
    if (!rect) return;

    let clientX: number, clientY: number;
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    setOverlayDragOffset({
      x: clientX - rect.left - overlay.x,
      y: clientY - rect.top - overlay.y
    });
  };

  const handleOverlayPointerMove = useCallback((e: MouseEvent | TouchEvent) => {
    if (!isDraggingOverlay || !activeOverlayId || !imageContainerRef.current) return;

    const rect = imageContainerRef.current.getBoundingClientRect();
    let clientX: number, clientY: number;
    
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    const newX = clientX - rect.left - overlayDragOffset.x;
    const newY = clientY - rect.top - overlayDragOffset.y;

    setOverlays(prev => prev.map(o => 
      o.id === activeOverlayId 
        ? { ...o, x: Math.max(-o.width/2, newX), y: Math.max(-o.height/2, newY) }
        : o
    ));
  }, [isDraggingOverlay, activeOverlayId, overlayDragOffset]);

  const handleOverlayPointerUp = useCallback(() => {
    setIsDraggingOverlay(false);
  }, []);

  useEffect(() => {
    if (isDraggingOverlay) {
      window.addEventListener('mousemove', handleOverlayPointerMove);
      window.addEventListener('mouseup', handleOverlayPointerUp);
      window.addEventListener('touchmove', handleOverlayPointerMove);
      window.addEventListener('touchend', handleOverlayPointerUp);
      return () => {
        window.removeEventListener('mousemove', handleOverlayPointerMove);
        window.removeEventListener('mouseup', handleOverlayPointerUp);
        window.removeEventListener('touchmove', handleOverlayPointerMove);
        window.removeEventListener('touchend', handleOverlayPointerUp);
      };
    }
  }, [isDraggingOverlay, handleOverlayPointerMove, handleOverlayPointerUp]);

  const resizeOverlay = (overlayId: string, delta: number) => {
    setOverlays(prev => prev.map(o => {
      if (o.id !== overlayId) return o;
      const aspectRatio = o.originalWidth / o.originalHeight;
      const newWidth = Math.max(30, Math.min(800, o.width + delta));
      const newHeight = newWidth / aspectRatio;
      return { ...o, width: newWidth, height: newHeight };
    }));
  };

  const removeOverlay = (overlayId: string) => {
    setOverlays(prev => prev.filter(o => o.id !== overlayId));
    if (activeOverlayId === overlayId) {
      setActiveOverlayId(null);
    }
  };

  // Text overlay handlers
  const handleAddTextOverlay = (text: TextOverlay) => {
    setTextOverlays(prev => [...prev, text]);
    setActiveTextId(text.id);
    setShowTextTool(false);
    toast.success("Text added! Drag to position it.");
  };

  const handleUpdateTextOverlay = (id: string, updates: Partial<TextOverlay>) => {
    setTextOverlays(prev => prev.map(t => 
      t.id === id ? { ...t, ...updates } : t
    ));
  };

  const handleTextPointerDown = (e: React.MouseEvent | React.TouchEvent, textId: string) => {
    e.stopPropagation();
    if (isCropping) return;
    
    const text = textOverlays.find(t => t.id === textId);
    if (!text) return;

    setActiveTextId(textId);
    setActiveOverlayId(null);
    setIsDraggingText(true);

    const rect = imageContainerRef.current?.getBoundingClientRect();
    if (!rect) return;

    let clientX: number, clientY: number;
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    setTextDragOffset({
      x: clientX - rect.left - text.x,
      y: clientY - rect.top - text.y
    });
  };

  const handleTextPointerMove = useCallback((e: MouseEvent | TouchEvent) => {
    if (!isDraggingText || !activeTextId || !imageContainerRef.current) return;

    const rect = imageContainerRef.current.getBoundingClientRect();
    let clientX: number, clientY: number;
    
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    const newX = clientX - rect.left - textDragOffset.x;
    const newY = clientY - rect.top - textDragOffset.y;

    setTextOverlays(prev => prev.map(t => 
      t.id === activeTextId 
        ? { ...t, x: Math.max(0, newX), y: Math.max(0, newY) }
        : t
    ));
  }, [isDraggingText, activeTextId, textDragOffset]);

  const handleTextPointerUp = useCallback(() => {
    setIsDraggingText(false);
  }, []);

  useEffect(() => {
    if (isDraggingText) {
      window.addEventListener('mousemove', handleTextPointerMove);
      window.addEventListener('mouseup', handleTextPointerUp);
      window.addEventListener('touchmove', handleTextPointerMove);
      window.addEventListener('touchend', handleTextPointerUp);
      return () => {
        window.removeEventListener('mousemove', handleTextPointerMove);
        window.removeEventListener('mouseup', handleTextPointerUp);
        window.removeEventListener('touchmove', handleTextPointerMove);
        window.removeEventListener('touchend', handleTextPointerUp);
      };
    }
  }, [isDraggingText, handleTextPointerMove, handleTextPointerUp]);

  const removeTextOverlay = (textId: string) => {
    setTextOverlays(prev => prev.filter(t => t.id !== textId));
    if (activeTextId === textId) {
      setActiveTextId(null);
    }
  };

  const resizeText = (textId: string, delta: number) => {
    setTextOverlays(prev => prev.map(t => {
      if (t.id !== textId) return t;
      const newSize = Math.max(12, Math.min(200, t.fontSize + delta));
      return { ...t, fontSize: newSize };
    }));
  };

  const getPointerPosition = (e: React.MouseEvent | React.TouchEvent) => {
    const rect = imageContainerRef.current!.getBoundingClientRect();
    if ('touches' in e) {
      const touch = e.touches[0] || e.changedTouches[0];
      return {
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top
      };
    }
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  };

  const handlePointerDown = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isCropping || !imageContainerRef.current) return;
    e.preventDefault();
    
    const { x, y } = getPointerPosition(e);
    setDragStart({ x, y });
    setIsDragging(true);
    setCropArea({ x, y, width: 0, height: 0 });
  };

  const handlePointerMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging || !isCropping || !imageContainerRef.current) return;
    e.preventDefault();
    
    const { x: currentX, y: currentY } = getPointerPosition(e);
    setCropArea({
      x: Math.min(dragStart.x, currentX),
      y: Math.min(dragStart.y, currentY),
      width: Math.abs(currentX - dragStart.x),
      height: Math.abs(currentY - dragStart.y)
    });
  };

  const handlePointerUp = () => {
    setIsDragging(false);
  };

  // Composite and flatten layers for saving/downloading
  const flattenLayers = async (): Promise<Blob> => {
    const imgElement = imageContainerRef.current?.querySelector('img');
    if (!imgElement) throw new Error("Image not found");

    // Fetch base image
    const response = await fetch(currentImage);
    const imageBlob = await response.blob();
    const blobUrl = URL.createObjectURL(imageBlob);
    
    const baseImg = new Image();
    await new Promise<void>((resolve, reject) => {
      baseImg.onload = () => resolve();
      baseImg.onerror = () => reject(new Error("Failed to load base image"));
      baseImg.src = blobUrl;
    });
    URL.revokeObjectURL(blobUrl);

    // Create canvas at base image size
    const canvas = document.createElement('canvas');
    canvas.width = baseImg.naturalWidth;
    canvas.height = baseImg.naturalHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error("Canvas context unavailable");

    // Draw base image
    ctx.drawImage(baseImg, 0, 0);

    // Calculate scale from display to natural size
    const imgRect = imgElement.getBoundingClientRect();
    const scaleX = baseImg.naturalWidth / imgRect.width;
    const scaleY = baseImg.naturalHeight / imgRect.height;

    // Draw image overlays
    for (const overlay of overlays) {
      const overlayImg = new Image();
      await new Promise<void>((resolve) => {
        overlayImg.onload = () => resolve();
        overlayImg.onerror = () => resolve(); // Skip failed overlays
        overlayImg.src = overlay.src;
      });

      const containerRect = imageContainerRef.current!.getBoundingClientRect();
      const imgOffsetX = imgRect.left - containerRect.left;
      const imgOffsetY = imgRect.top - containerRect.top;

      // Calculate overlay position on the natural image
      const overlayX = (overlay.x - imgOffsetX) * scaleX;
      const overlayY = (overlay.y - imgOffsetY) * scaleY;
      const overlayW = overlay.width * scaleX;
      const overlayH = overlay.height * scaleY;

      ctx.drawImage(overlayImg, overlayX, overlayY, overlayW, overlayH);
    }

    // Draw text overlays
    const containerRect = imageContainerRef.current!.getBoundingClientRect();
    const imgOffsetX = imgRect.left - containerRect.left;
    const imgOffsetY = imgRect.top - containerRect.top;

    for (const text of textOverlays) {
      const textX = (text.x - imgOffsetX) * scaleX;
      const textY = (text.y - imgOffsetY) * scaleY;
      const scaledFontSize = text.fontSize * scaleX;

      ctx.save();
      ctx.globalAlpha = text.opacity;
      ctx.font = `${text.fontStyle} ${text.fontWeight} ${scaledFontSize}px ${text.fontFamily}`;
      ctx.textBaseline = "top";

      if (text.gradient) {
        // Parse gradient and create canvas gradient
        const gradient = ctx.createLinearGradient(textX, textY, textX + ctx.measureText(text.text).width, textY);
        // Simple gradient parsing for common gradients
        if (text.gradient.includes("#EB8530") && text.gradient.includes("#E04724")) {
          gradient.addColorStop(0, "#EB8530");
          gradient.addColorStop(1, "#E04724");
        } else if (text.gradient.includes("#8B5CF6") && text.gradient.includes("#EC4899")) {
          gradient.addColorStop(0, "#8B5CF6");
          gradient.addColorStop(1, "#EC4899");
        } else if (text.gradient.includes("#3B82F6") && text.gradient.includes("#06B6D4")) {
          gradient.addColorStop(0, "#3B82F6");
          gradient.addColorStop(1, "#06B6D4");
        } else if (text.gradient.includes("#10B981")) {
          gradient.addColorStop(0, "#10B981");
          gradient.addColorStop(1, "#14B8A6");
        } else if (text.gradient.includes("#F59E0B") && text.gradient.includes("#FCD34D")) {
          gradient.addColorStop(0, "#F59E0B");
          gradient.addColorStop(1, "#FCD34D");
        } else if (text.gradient.includes("rainbow") || text.gradient.includes("90deg")) {
          gradient.addColorStop(0, "#EF4444");
          gradient.addColorStop(0.25, "#F59E0B");
          gradient.addColorStop(0.5, "#84CC16");
          gradient.addColorStop(0.75, "#06B6D4");
          gradient.addColorStop(1, "#8B5CF6");
        } else {
          // Fallback sunset gradient
          gradient.addColorStop(0, "#F97316");
          gradient.addColorStop(0.5, "#EF4444");
          gradient.addColorStop(1, "#EC4899");
        }
        ctx.fillStyle = gradient;
      } else {
        ctx.fillStyle = text.color;
      }

      // Apply shadow if not gradient
      if (!text.gradient && text.textShadow !== "none") {
        const shadowMatch = text.textShadow.match(/(\d+)px\s+(\d+)px\s+(\d+)px/);
        if (shadowMatch) {
          ctx.shadowOffsetX = parseInt(shadowMatch[1]) * scaleX;
          ctx.shadowOffsetY = parseInt(shadowMatch[2]) * scaleY;
          ctx.shadowBlur = parseInt(shadowMatch[3]) * scaleX;
          ctx.shadowColor = "rgba(0,0,0,0.5)";
        }
      }

      ctx.fillText(text.text, textX, textY);
      ctx.restore();
    }

    return new Promise((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (blob) resolve(blob);
        else reject(new Error("Failed to create blob"));
      }, "image/png");
    });
  };

  const applyCrop = useCallback(async () => {
    if (!cropArea || !imageContainerRef.current || cropArea.width < 10 || cropArea.height < 10) {
      toast.error("Please select a valid crop area");
      return;
    }

    toast.loading("Applying crop...", { id: "crop" });

    try {
      const imgElement = imageContainerRef.current!.querySelector('img');
      if (!imgElement) {
        throw new Error("Image element not found");
      }
      
      const containerRect = imageContainerRef.current!.getBoundingClientRect();
      const imgRect = imgElement.getBoundingClientRect();
      
      const response = await fetch(currentImage);
      if (!response.ok) throw new Error("Failed to fetch image");
      const imageBlob = await response.blob();
      
      const blobUrl = URL.createObjectURL(imageBlob);
      const img = new Image();
      
      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => reject(new Error("Failed to load image"));
        img.src = blobUrl;
      });
      
      const scaleX = img.naturalWidth / imgRect.width;
      const scaleY = img.naturalHeight / imgRect.height;
      
      const offsetX = imgRect.left - containerRect.left;
      const offsetY = imgRect.top - containerRect.top;
      
      const cropX = Math.max(0, (cropArea.x - offsetX) * scaleX);
      const cropY = Math.max(0, (cropArea.y - offsetY) * scaleY);
      const cropWidth = Math.min(cropArea.width * scaleX, img.naturalWidth - cropX);
      const cropHeight = Math.min(cropArea.height * scaleY, img.naturalHeight - cropY);
      
      URL.revokeObjectURL(blobUrl);
      
      if (cropWidth < 10 || cropHeight < 10) {
        throw new Error("Crop area too small");
      }
      
      const canvas = document.createElement('canvas');
      canvas.width = Math.floor(cropWidth);
      canvas.height = Math.floor(cropHeight);
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        throw new Error("Failed to create canvas context");
      }
      
      ctx.drawImage(
        img, 
        Math.floor(cropX), 
        Math.floor(cropY), 
        Math.floor(cropWidth), 
        Math.floor(cropHeight), 
        0, 
        0, 
        Math.floor(cropWidth), 
        Math.floor(cropHeight)
      );
      
      const blob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob((b) => {
          if (b) resolve(b);
          else reject(new Error("Failed to create blob"));
        }, "image/png");
      });
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error("You must be logged in to crop images");
      }
      
      const fileName = `${user.id}/${Date.now()}-cropped.png`;
      const { error: uploadError } = await supabase.storage
        .from("post-images")
        .upload(fileName, blob, { contentType: "image/png" });
      
      if (uploadError) throw uploadError;
      
      const { data: { publicUrl } } = supabase.storage
        .from("post-images")
        .getPublicUrl(fileName);
      
      await supabase
        .from("projects")
        .update({ image_url: publicUrl, updated_at: new Date().toISOString() })
        .eq("id", projectId);
      
      setCurrentImage(publicUrl);
      onImageUpdate(publicUrl);
      setIsCropping(false);
      setCropArea(null);
      
      setChatMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: "assistant",
        content: "✅ Image cropped successfully!",
        timestamp: new Date()
      }]);
      
      toast.success("Image cropped successfully!");
    } catch (error: any) {
      console.error("Crop error:", error);
      toast.error(error?.message || "Failed to apply crop");
    } finally {
      toast.dismiss("crop");
    }
  }, [cropArea, currentImage, projectId, onImageUpdate]);

  // Merge overlays and save
  const handleMergeAndSave = async () => {
    if (overlays.length === 0 && textOverlays.length === 0) {
      toast.error("No overlays to merge");
      return;
    }

    toast.loading("Merging layers...", { id: "merge" });

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("You must be logged in");

      const blob = await flattenLayers();
      
      const fileName = `${user.id}/${Date.now()}-merged.png`;
      const { error: uploadError } = await supabase.storage
        .from("post-images")
        .upload(fileName, blob, { contentType: "image/png" });
      
      if (uploadError) throw uploadError;
      
      const { data: { publicUrl } } = supabase.storage
        .from("post-images")
        .getPublicUrl(fileName);
      
      await supabase
        .from("projects")
        .update({ image_url: publicUrl, updated_at: new Date().toISOString() })
        .eq("id", projectId);
      
      setCurrentImage(publicUrl);
      onImageUpdate(publicUrl);
      setOverlays([]);
      setActiveOverlayId(null);
      setTextOverlays([]);
      setActiveTextId(null);
      setShowTextTool(false);
      
      toast.success("Layers merged and saved!");
    } catch (error: any) {
      console.error("Merge error:", error);
      toast.error(error?.message || "Failed to merge layers");
    } finally {
      toast.dismiss("merge");
    }
  };

  const handleAIEdit = async () => {
    if (!editPrompt.trim()) {
      toast.error("Please describe what you want to change");
      return;
    }

    // Check edit limit before proceeding
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast.error("You must be logged in to edit images");
      return;
    }

    const { data: limitData } = await supabase.rpc("check_edit_limit", {
      user_id_param: user.id
    });

    if (!limitData?.[0]?.can_edit) {
      toast.error(
        isPremium 
          ? "You've used all 10 daily edit credits. Come back tomorrow!" 
          : "You've used your 1 free daily edit. Upgrade to Pro for 10 edits/day!",
        { duration: 5000 }
      );
      return;
    }

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: editPrompt,
      timestamp: new Date()
    };
    setChatMessages(prev => [...prev, userMessage]);
    
    const processingMessage: ChatMessage = {
      id: (Date.now() + 1).toString(),
      role: "assistant",
      content: "✨ Processing your edit...",
      timestamp: new Date()
    };
    setChatMessages(prev => [...prev, processingMessage]);
    
    setIsEditing(true);
    const prompt = editPrompt;
    setEditPrompt("");

    try {
      
      const { data, error } = await supabase.functions.invoke("edit-image", {
        body: {
          imageUrl: currentImage,
          prompt: prompt,
          projectId,
          userId: user.id
        }
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      if (!data?.imageUrl) throw new Error("No image returned");

      setCurrentImage(data.imageUrl);
      onImageUpdate(data.imageUrl);
      
      setChatMessages(prev => prev.filter(m => m.id !== processingMessage.id).concat({
        id: Date.now().toString(),
        role: "assistant",
        content: `✅ Done! I've applied "${prompt}" to your design. Want any more changes?`,
        timestamp: new Date()
      }));
      
      // Increment edit usage after successful edit
      await supabase.rpc("increment_edit_usage", { user_id_param: user.id });
      
      // Refresh credits after successful edit
      fetchCredits();
      
      toast.success("Image edited successfully!");
    } catch (error: any) {
      console.error("AI edit error:", error);
      setChatMessages(prev => prev.filter(m => m.id !== processingMessage.id).concat({
        id: Date.now().toString(),
        role: "assistant",
        content: `❌ Sorry, I couldn't apply that edit: ${error?.message || "Unknown error"}. Please try again.`,
        timestamp: new Date()
      }));
      toast.error(error?.message || "Failed to edit image");
    } finally {
      setIsEditing(false);
    }
  };

  const handleDownload = async () => {
    try {
      // Check if user is premium before allowing download
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Please sign in to download images");
        return;
      }

      const { data: limitData } = await supabase.rpc("check_daily_limit", {
        user_id_param: user.id
      });

      if (!limitData?.[0]?.is_premium) {
        toast.error("Upgrade to Pro to download your designs!", {
          description: "Pro users get unlimited downloads and 10 edits per day.",
          action: {
            label: "Upgrade",
            onClick: () => window.location.href = "/pricing"
          }
        });
        return;
      }

      toast.loading("Preparing download...", { id: "download" });
      
      let blob: Blob;
      
      // If there are overlays or text overlays, flatten them first
      if (overlays.length > 0 || textOverlays.length > 0) {
        blob = await flattenLayers();
      } else {
        const response = await fetch(currentImage);
        blob = await response.blob();
      }
      
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement("a");
      link.href = url;
      link.download = `${projectName.replace(/\s+/g, "-")}-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      toast.success("Downloaded!");
    } catch (error) {
      toast.error("Failed to download");
    } finally {
      toast.dismiss("download");
    }
  };

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.25, 3));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.25, 0.5));
  const handleResetZoom = () => setZoom(1);

  const activeOverlay = overlays.find(o => o.id === activeOverlayId);
  const activeText = textOverlays.find(t => t.id === activeTextId);

  return (
    <div className="h-[calc(100vh-3.5rem)] md:h-screen flex flex-col overflow-hidden bg-background relative">
      {/* Liquid Glass Background Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/5 pointer-events-none" />
      <div className="absolute inset-0 backdrop-blur-[100px] pointer-events-none opacity-50" />
      
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileUpload}
      />

      {/* Terminal-Style Header */}
      <div className="relative flex items-center justify-between px-3 py-2 md:px-4 md:py-3 border-b border-border/30 bg-background/80 backdrop-blur-xl flex-shrink-0">
        {/* Terminal Window Controls */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-destructive/80 hover:bg-destructive transition-colors cursor-pointer" onClick={onClose} />
            <div className="w-3 h-3 rounded-full bg-yellow-500/80 hover:bg-yellow-500 transition-colors cursor-pointer" />
            <div className="w-3 h-3 rounded-full bg-green-500/80 hover:bg-green-500 transition-colors cursor-pointer" />
          </div>
          <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-muted/50 border border-border/30">
            <Terminal className="h-3 w-3 text-primary" />
            <span className="text-xs font-mono text-muted-foreground">epic-editor</span>
          </div>
        </div>
        
        <h2 className="text-sm md:text-base font-mono font-semibold truncate max-w-[180px] md:max-w-none flex items-center gap-2 text-foreground">
          <span className="text-primary">~</span>/{projectName}
        </h2>
        
        {/* Status Signals */}
        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-1.5 px-2 py-1 rounded-full bg-muted/50 border border-border/30">
            <Wifi className="h-3 w-3 text-green-500" />
            <Activity className="h-3 w-3 text-primary animate-pulse" />
          </div>
          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-destructive/10 hover:text-destructive" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Mobile Tab Toggle - Terminal Style */}
      <div className="md:hidden flex border-b border-border/30 bg-background/80 backdrop-blur-xl">
        <button
          onClick={() => setActiveTab("chat")}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-mono font-medium transition-all",
            activeTab === "chat" 
              ? "text-primary border-b-2 border-primary bg-primary/5" 
              : "text-muted-foreground hover:text-foreground hover:bg-muted/30"
          )}
        >
          <Terminal className="h-4 w-4" />
          <span className="flex items-center gap-1.5">
            Terminal
            {isEditing && <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />}
          </span>
        </button>
        <button
          onClick={() => setActiveTab("preview")}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-mono font-medium transition-all",
            activeTab === "preview" 
              ? "text-primary border-b-2 border-primary bg-primary/5" 
              : "text-muted-foreground hover:text-foreground hover:bg-muted/30"
          )}
        >
          <ImageIcon className="h-4 w-4" />
          Canvas
        </button>
      </div>

      {/* Split Screen Layout */}
      <div className="flex-1 flex min-h-0 relative">
        {/* Chat Panel - Liquid Glass Terminal */}
        <div className={cn(
          "w-full md:w-80 lg:w-96 md:border-r border-border/30 flex-shrink-0 flex flex-col",
          activeTab === "chat" ? "flex" : "hidden md:flex"
        )}>
          <div className="flex flex-col h-full bg-background/60 backdrop-blur-xl relative overflow-hidden">
            {/* Subtle glass refraction effect */}
            <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
            
            {/* Terminal Header with Status */}
            <div className="relative flex items-center justify-between p-3 border-b border-border/30 bg-muted/20">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-black/30 border border-border/30">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-[10px] font-mono text-green-500 uppercase tracking-wider">Live</span>
                </div>
                <Terminal className="h-4 w-4 text-primary" />
                <span className="text-sm font-mono font-medium">AI Terminal</span>
              </div>
              {remainingCredits !== null && (
                <div className={cn(
                  "flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-mono border",
                  remainingCredits > 0 
                    ? "bg-primary/10 text-primary border-primary/30" 
                    : "bg-destructive/10 text-destructive border-destructive/30"
                )}>
                  <Zap className="h-3 w-3" />
                  <span>{remainingCredits}/{isPremium ? "10" : "1"}</span>
                </div>
              )}
            </div>
            
            {/* Terminal Messages */}
            <ScrollArea className="flex-1 p-3 relative">
              <div className="space-y-3" ref={chatScrollRef}>
                {chatMessages.map((message, index) => (
                  <div
                    key={message.id}
                    className={cn(
                      "flex",
                      message.role === "user" ? "justify-end" : "justify-start"
                    )}
                  >
                    <div
                      className={cn(
                        "max-w-[85%] rounded-lg px-3 py-2 text-sm font-mono relative",
                        message.role === "user"
                          ? "bg-primary/20 text-foreground border border-primary/30 rounded-br-sm"
                          : "bg-muted/50 text-foreground border border-border/30 rounded-bl-sm"
                      )}
                    >
                      {message.role === "assistant" && (
                        <div className="flex items-center gap-1.5 mb-1.5 text-[10px] text-muted-foreground">
                          <CheckCircle2 className="h-3 w-3 text-green-500" />
                          <span>EPIC_AI</span>
                          <span className="text-border">|</span>
                          <span>{message.timestamp.toLocaleTimeString()}</span>
                        </div>
                      )}
                      {message.role === "user" && (
                        <div className="flex items-center gap-1.5 mb-1.5 text-[10px] text-primary/70 justify-end">
                          <span>{message.timestamp.toLocaleTimeString()}</span>
                          <span className="text-border">|</span>
                          <span>you</span>
                          <Circle className="h-2 w-2 fill-primary text-primary" />
                        </div>
                      )}
                      <span className="whitespace-pre-wrap">{message.content}</span>
                    </div>
                  </div>
                ))}
                {isEditing && (
                  <div className="flex justify-start">
                    <div className="bg-muted/50 border border-border/30 rounded-lg rounded-bl-sm px-3 py-2 font-mono">
                      <div className="flex items-center gap-2 text-sm">
                        <Loader2 className="h-3 w-3 animate-spin text-primary" />
                        <span className="text-muted-foreground">Processing</span>
                        <span className="animate-pulse">...</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>
            
            {/* Terminal Input */}
            <div className="relative p-3 border-t border-border/30 bg-muted/10">
              <div className="flex items-center gap-2 mb-2 text-[10px] font-mono text-muted-foreground">
                <span className="text-primary">$</span>
                <span>enter command or describe edit</span>
                <span className="ml-auto flex items-center gap-1">
                  <Activity className="h-3 w-3 text-green-500" />
                  <span className="text-green-500">ready</span>
                </span>
              </div>
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-primary font-mono text-sm">&gt;</span>
                  <Textarea
                    value={editPrompt}
                    onChange={(e) => setEditPrompt(e.target.value)}
                    placeholder="describe your edit..."
                    className="min-h-[44px] max-h-[120px] resize-none bg-black/30 border-border/30 text-sm font-mono rounded-lg pl-7 focus:border-primary/50 focus:ring-primary/20"
                    disabled={isEditing}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleAIEdit();
                      }
                    }}
                  />
                </div>
                <Button 
                  onClick={handleAIEdit} 
                  disabled={isEditing || !editPrompt.trim()}
                  size="icon"
                  className="h-11 w-11 rounded-lg shrink-0 bg-primary/20 border border-primary/30 hover:bg-primary/30 text-primary"
                >
                  {isEditing ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              </div>
              <p className="text-[10px] font-mono text-muted-foreground mt-2 text-center">
                <span className="text-primary">Enter</span> to execute • <span className="text-primary">Shift+Enter</span> for newline
              </p>
            </div>
          </div>
        </div>

        {/* Preview Panel - Liquid Glass Canvas */}
        <div className={cn(
          "flex-1 min-w-0 flex flex-col",
          activeTab === "preview" ? "flex" : "hidden md:flex"
        )}>
          <div className="flex flex-col h-full bg-card/30 backdrop-blur-sm relative">
            {/* Glass overlay effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-transparent via-primary/5 to-transparent pointer-events-none" />
            
            {/* Preview Header with Tools - Terminal Style */}
            <div className="relative flex items-center justify-between p-2 md:p-3 border-b border-border/30 bg-background/60 backdrop-blur-xl">
              <div className="flex items-center gap-1 md:gap-2 overflow-x-auto">
                {/* Tool Status Indicator */}
                <div className="hidden sm:flex items-center gap-1.5 px-2 py-1 mr-2 rounded bg-muted/50 border border-border/30">
                  <span className={cn(
                    "w-2 h-2 rounded-full",
                    isCropping ? "bg-yellow-500 animate-pulse" : showTextTool ? "bg-blue-500 animate-pulse" : "bg-green-500"
                  )} />
                  <span className="text-[10px] font-mono text-muted-foreground uppercase">
                    {isCropping ? "crop" : showTextTool ? "text" : "ready"}
                  </span>
                </div>

                <Button
                  variant={isCropping ? "default" : "outline"}
                  size="sm"
                  className="text-xs h-8 shrink-0 font-mono border-border/30"
                  onClick={() => {
                    setIsCropping(!isCropping);
                    setCropArea(null);
                    setActiveOverlayId(null);
                  }}
                >
                  <Crop className="h-3 w-3 mr-1" />
                  crop
                </Button>
                
                {/* Add Image Button */}
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs h-8 shrink-0 font-mono border-border/30"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isCropping}
                >
                  <Upload className="h-3 w-3 mr-1" />
                  +img
                </Button>

                {/* Add Text Button */}
                <Button
                  variant={showTextTool ? "default" : "outline"}
                  size="sm"
                  className="text-xs h-8 shrink-0 font-mono border-border/30"
                  onClick={() => {
                    setShowTextTool(!showTextTool);
                    setActiveTextId(null);
                  }}
                  disabled={isCropping}
                >
                  <Type className="h-3 w-3 mr-1" />
                  +txt
                </Button>

                {isCropping && cropArea && cropArea.width > 10 && (
                  <Button size="sm" className="text-xs h-8 shrink-0 font-mono" onClick={applyCrop}>
                    <CheckCircle2 className="h-3 w-3 mr-1" />
                    apply
                  </Button>
                )}
                {isCropping && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-xs h-8 shrink-0 font-mono text-destructive hover:bg-destructive/10"
                    onClick={() => {
                      setIsCropping(false);
                      setCropArea(null);
                    }}
                  >
                    <X className="h-3 w-3 mr-1" />
                    cancel
                  </Button>
                )}

                {/* Overlay Controls */}
                {(overlays.length > 0 || textOverlays.length > 0) && !isCropping && (
                  <>
                    <div className="w-px h-6 bg-border/30 mx-1" />
                    <Button
                      variant="default"
                      size="sm"
                      className="text-xs h-8 shrink-0 font-mono bg-green-600/80 hover:bg-green-600 border-green-500/30"
                      onClick={handleMergeAndSave}
                    >
                      <Move className="h-3 w-3 mr-1" />
                      merge
                    </Button>
                  </>
                )}
              </div>
              
              <div className="flex items-center gap-1">
                <div className="hidden sm:flex items-center gap-1 mr-2 px-2 py-0.5 rounded bg-muted/50 border border-border/30">
                  <span className="text-[10px] font-mono text-muted-foreground">zoom:</span>
                </div>
                <Button variant="ghost" size="icon" className="h-7 w-7 rounded border border-border/30" onClick={handleZoomOut}>
                  <ZoomOut className="h-3.5 w-3.5" />
                </Button>
                <span className="text-xs font-mono text-muted-foreground w-12 text-center">
                  {Math.round(zoom * 100)}%
                </span>
                <Button variant="ghost" size="icon" className="h-7 w-7 rounded border border-border/30" onClick={handleZoomIn}>
                  <ZoomIn className="h-3.5 w-3.5" />
                </Button>
                <Button variant="ghost" size="icon" className="h-7 w-7 rounded border border-border/30" onClick={handleResetZoom}>
                  <RotateCcw className="h-3.5 w-3.5" />
                </Button>
                <Button variant="outline" size="sm" className="text-xs h-7 ml-1 font-mono border-border/30" onClick={handleDownload}>
                  <Download className="h-3 w-3 mr-1" />
                  <span className="hidden sm:inline">save</span>
                </Button>
              </div>
            </div>

            {/* Active Overlay Controls - Terminal Style */}
            {activeOverlay && !isCropping && !showTextTool && (
              <div className="relative flex items-center justify-center gap-2 p-2 bg-primary/5 border-b border-primary/20 backdrop-blur-sm">
                <div className="flex items-center gap-1.5 text-xs font-mono text-primary">
                  <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                  <span>overlay selected</span>
                </div>
                <div className="w-px h-4 bg-border/30" />
                <Button
                  variant="outline"
                  size="icon"
                  className="h-7 w-7 border-border/30"
                  onClick={() => resizeOverlay(activeOverlay.id, -20)}
                >
                  <Minus className="h-3 w-3" />
                </Button>
                <span className="text-xs font-mono w-16 text-center text-muted-foreground">
                  {Math.round(activeOverlay.width)}px
                </span>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-7 w-7 border-border/30"
                  onClick={() => resizeOverlay(activeOverlay.id, 20)}
                >
                  <Plus className="h-3 w-3" />
                </Button>
                <Button
                  variant="destructive"
                  size="icon"
                  className="h-7 w-7 ml-2"
                  onClick={() => removeOverlay(activeOverlay.id)}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            )}

            {/* Active Text Controls - Terminal Style */}
            {activeText && !isCropping && !showTextTool && (
              <div className="relative flex items-center justify-center gap-2 p-2 bg-blue-500/5 border-b border-blue-500/20 backdrop-blur-sm">
                <div className="flex items-center gap-1.5 text-xs font-mono text-blue-500">
                  <Type className="h-3 w-3" />
                  <span>text selected</span>
                </div>
                <div className="w-px h-4 bg-border/30" />
                <Button
                  variant="outline"
                  size="icon"
                  className="h-7 w-7 border-border/30"
                  onClick={() => resizeText(activeText.id, -4)}
                >
                  <Minus className="h-3 w-3" />
                </Button>
                <span className="text-xs font-mono w-16 text-center text-muted-foreground">
                  {activeText.fontSize}px
                </span>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-7 w-7 border-border/30"
                  onClick={() => resizeText(activeText.id, 4)}
                >
                  <Plus className="h-3 w-3" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 text-xs font-mono border-border/30"
                  onClick={() => {
                    setShowTextTool(true);
                  }}
                >
                  edit
                </Button>
                <Button
                  variant="destructive"
                  size="icon"
                  className="h-7 w-7 ml-2"
                  onClick={() => removeTextOverlay(activeText.id)}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            )}

            {/* Text Tool Panel */}
            {showTextTool && !isCropping && (
              <div className="relative border-b border-border/30 bg-background/80 backdrop-blur-xl max-h-[40vh] overflow-y-auto">
                <TextToolPanel
                  onAddText={handleAddTextOverlay}
                  selectedText={activeText}
                  onUpdateText={handleUpdateTextOverlay}
                />
              </div>
            )}

            {/* Image Canvas - Dark Terminal Style */}
            <div className="flex-1 overflow-auto p-4 flex items-center justify-center bg-[#080808] relative">
              {/* Grid pattern overlay */}
              <div 
                className="absolute inset-0 opacity-20 pointer-events-none"
                style={{
                  backgroundImage: `linear-gradient(to right, hsl(var(--border) / 0.3) 1px, transparent 1px),
                                    linear-gradient(to bottom, hsl(var(--border) / 0.3) 1px, transparent 1px)`,
                  backgroundSize: '40px 40px'
                }}
              />
              <div 
                ref={imageContainerRef}
                className={cn(
                  "relative inline-block",
                  isCropping && "cursor-crosshair select-none touch-none"
                )}
                onMouseDown={handlePointerDown}
                onMouseMove={handlePointerMove}
                onMouseUp={handlePointerUp}
                onMouseLeave={handlePointerUp}
                onTouchStart={handlePointerDown}
                onTouchMove={handlePointerMove}
                onTouchEnd={handlePointerUp}
                onTouchCancel={handlePointerUp}
                onClick={() => {
                  if (!isDraggingOverlay && !isDraggingText && !isCropping) {
                    setActiveOverlayId(null);
                    setActiveTextId(null);
                  }
                }}
              >
                <img
                  src={currentImage}
                  alt={projectName}
                  className="max-w-full max-h-[60vh] md:max-h-[70vh] h-auto rounded-lg shadow-2xl transition-transform object-contain"
                  style={{ transform: `scale(${zoom})`, transformOrigin: "center" }}
                  draggable={false}
                />
                
                {/* Overlay Images */}
                {overlays.map((overlay) => (
                  <div
                    key={overlay.id}
                    className={cn(
                      "absolute cursor-move select-none",
                      overlay.id === activeOverlayId && "ring-2 ring-primary ring-offset-2 ring-offset-transparent"
                    )}
                    style={{
                      left: overlay.x,
                      top: overlay.y,
                      width: overlay.width,
                      height: overlay.height,
                      transform: `scale(${zoom})`,
                      transformOrigin: "top left"
                    }}
                    onMouseDown={(e) => handleOverlayPointerDown(e, overlay.id)}
                    onTouchStart={(e) => handleOverlayPointerDown(e, overlay.id)}
                  >
                    <img
                      src={overlay.src}
                      alt="Overlay"
                      className="w-full h-full object-contain pointer-events-none"
                      draggable={false}
                    />
                  </div>
                ))}

                {/* Text Overlays */}
                {textOverlays.map((text) => (
                  <div
                    key={text.id}
                    className={cn(
                      "absolute cursor-move select-none whitespace-nowrap",
                      text.id === activeTextId && "ring-2 ring-primary ring-offset-2 ring-offset-transparent rounded"
                    )}
                    style={{
                      left: text.x,
                      top: text.y,
                      fontFamily: text.fontFamily,
                      fontSize: text.fontSize,
                      fontWeight: text.fontWeight,
                      fontStyle: text.fontStyle,
                      color: text.gradient ? "transparent" : text.color,
                      background: text.gradient || "transparent",
                      backgroundClip: text.gradient ? "text" : "unset",
                      WebkitBackgroundClip: text.gradient ? "text" : "unset",
                      textShadow: text.gradient ? "none" : text.textShadow,
                      opacity: text.opacity,
                      transform: `scale(${zoom})`,
                      transformOrigin: "top left",
                      padding: "2px 4px",
                    }}
                    onMouseDown={(e) => handleTextPointerDown(e, text.id)}
                    onTouchStart={(e) => handleTextPointerDown(e, text.id)}
                  >
                    {text.text}
                  </div>
                ))}
                
                {/* Crop overlay */}
                {isCropping && cropArea && (
                  <>
                    <div 
                      className="absolute inset-0 bg-black/60 pointer-events-none"
                      style={{
                        clipPath: `polygon(
                          0 0, 100% 0, 100% 100%, 0 100%, 0 0,
                          ${cropArea.x}px ${cropArea.y}px,
                          ${cropArea.x}px ${cropArea.y + cropArea.height}px,
                          ${cropArea.x + cropArea.width}px ${cropArea.y + cropArea.height}px,
                          ${cropArea.x + cropArea.width}px ${cropArea.y}px,
                          ${cropArea.x}px ${cropArea.y}px
                        )`
                      }}
                    />
                    <div 
                      className="absolute border-2 border-primary border-dashed pointer-events-none"
                      style={{
                        left: cropArea.x,
                        top: cropArea.y,
                        width: cropArea.width,
                        height: cropArea.height
                      }}
                    />
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
