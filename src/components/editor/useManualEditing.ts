import { useState, useCallback, useEffect, useRef, RefObject } from "react";
import { toast } from "sonner";
import { TextOverlay } from "@/components/TextToolPanel";
import { ImageOverlay } from "./CanvasOverlays";

interface CropArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface UseManualEditingProps {
  imageContainerRef: RefObject<HTMLDivElement>;
  currentImageUrl: string;
  onImageUpdate: (newImageUrl: string) => void;
}

export const useManualEditing = ({
  imageContainerRef,
  currentImageUrl,
  onImageUpdate,
}: UseManualEditingProps) => {
  // Cropping state
  const [isCropping, setIsCropping] = useState(false);
  const [cropArea, setCropArea] = useState<CropArea | null>(null);
  const [isDraggingCrop, setIsDraggingCrop] = useState(false);
  const [cropDragStart, setCropDragStart] = useState({ x: 0, y: 0 });

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

  // File input ref
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle file upload for overlays
  const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
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
    
    if (e.target) {
      e.target.value = '';
    }
  }, []);

  // Overlay drag handlers
  const handleOverlayPointerDown = useCallback((e: React.MouseEvent | React.TouchEvent, overlayId: string) => {
    e.stopPropagation();
    if (isCropping) return;
    
    const overlay = overlays.find(o => o.id === overlayId);
    if (!overlay) return;

    setActiveOverlayId(overlayId);
    setActiveTextId(null);
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
  }, [isCropping, overlays, imageContainerRef]);

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
  }, [isDraggingOverlay, activeOverlayId, overlayDragOffset, imageContainerRef]);

  const handleOverlayPointerUp = useCallback(() => {
    setIsDraggingOverlay(false);
  }, []);

  // Overlay resize and remove
  const resizeOverlay = useCallback((overlayId: string, delta: number) => {
    setOverlays(prev => prev.map(o => {
      if (o.id !== overlayId) return o;
      const aspectRatio = o.originalWidth / o.originalHeight;
      const newWidth = Math.max(30, Math.min(800, o.width + delta));
      const newHeight = newWidth / aspectRatio;
      return { ...o, width: newWidth, height: newHeight };
    }));
  }, []);

  const removeOverlay = useCallback((overlayId: string) => {
    setOverlays(prev => prev.filter(o => o.id !== overlayId));
    if (activeOverlayId === overlayId) {
      setActiveOverlayId(null);
    }
  }, [activeOverlayId]);

  // Text overlay handlers
  const handleAddTextOverlay = useCallback((text: TextOverlay) => {
    setTextOverlays(prev => [...prev, text]);
    setActiveTextId(text.id);
    setShowTextTool(false);
    toast.success("Text added! Drag to position it.");
  }, []);

  const handleUpdateTextOverlay = useCallback((id: string, updates: Partial<TextOverlay>) => {
    setTextOverlays(prev => prev.map(t => 
      t.id === id ? { ...t, ...updates } : t
    ));
  }, []);

  const handleTextPointerDown = useCallback((e: React.MouseEvent | React.TouchEvent, textId: string) => {
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
  }, [isCropping, textOverlays, imageContainerRef]);

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
  }, [isDraggingText, activeTextId, textDragOffset, imageContainerRef]);

  const handleTextPointerUp = useCallback(() => {
    setIsDraggingText(false);
  }, []);

  const resizeText = useCallback((textId: string, delta: number) => {
    setTextOverlays(prev => prev.map(t => {
      if (t.id !== textId) return t;
      const newSize = Math.max(12, Math.min(200, t.fontSize + delta));
      return { ...t, fontSize: newSize };
    }));
  }, []);

  const removeTextOverlay = useCallback((textId: string) => {
    setTextOverlays(prev => prev.filter(t => t.id !== textId));
    if (activeTextId === textId) {
      setActiveTextId(null);
    }
  }, [activeTextId]);

  // Crop handlers
  const startCropping = useCallback(() => {
    setIsCropping(true);
    setCropArea(null);
    setActiveOverlayId(null);
    setActiveTextId(null);
  }, []);

  const cancelCrop = useCallback(() => {
    setIsCropping(false);
    setCropArea(null);
  }, []);

  const getPointerPosition = useCallback((e: React.MouseEvent | React.TouchEvent) => {
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
  }, [imageContainerRef]);

  const handleCropPointerDown = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (!isCropping || !imageContainerRef.current) return;
    e.preventDefault();
    
    const { x, y } = getPointerPosition(e);
    setCropDragStart({ x, y });
    setIsDraggingCrop(true);
    setCropArea({ x, y, width: 0, height: 0 });
  }, [isCropping, imageContainerRef, getPointerPosition]);

  const handleCropPointerMove = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (!isDraggingCrop || !isCropping || !imageContainerRef.current) return;
    e.preventDefault();
    
    const { x: currentX, y: currentY } = getPointerPosition(e);
    setCropArea({
      x: Math.min(cropDragStart.x, currentX),
      y: Math.min(cropDragStart.y, currentY),
      width: Math.abs(currentX - cropDragStart.x),
      height: Math.abs(currentY - cropDragStart.y)
    });
  }, [isDraggingCrop, isCropping, imageContainerRef, cropDragStart, getPointerPosition]);

  const handleCropPointerUp = useCallback(() => {
    setIsDraggingCrop(false);
  }, []);

  // Apply crop
  const applyCrop = useCallback(async () => {
    if (!cropArea || !imageContainerRef.current) return;

    const imgElement = imageContainerRef.current.querySelector('img');
    if (!imgElement) return;

    try {
      toast.loading("Applying crop...", { id: "crop" });
      
      const response = await fetch(currentImageUrl);
      const imageBlob = await response.blob();
      const blobUrl = URL.createObjectURL(imageBlob);
      
      const img = new Image();
      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => reject(new Error("Failed to load image"));
        img.src = blobUrl;
      });
      URL.revokeObjectURL(blobUrl);

      const imgRect = imgElement.getBoundingClientRect();
      const containerRect = imageContainerRef.current.getBoundingClientRect();
      
      const imgOffsetX = imgRect.left - containerRect.left;
      const imgOffsetY = imgRect.top - containerRect.top;
      
      const scaleX = img.naturalWidth / imgRect.width;
      const scaleY = img.naturalHeight / imgRect.height;

      const cropX = Math.max(0, (cropArea.x - imgOffsetX) * scaleX);
      const cropY = Math.max(0, (cropArea.y - imgOffsetY) * scaleY);
      const cropW = Math.min(img.naturalWidth - cropX, cropArea.width * scaleX);
      const cropH = Math.min(img.naturalHeight - cropY, cropArea.height * scaleY);

      const canvas = document.createElement('canvas');
      canvas.width = cropW;
      canvas.height = cropH;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error("Canvas context unavailable");

      ctx.drawImage(img, cropX, cropY, cropW, cropH, 0, 0, cropW, cropH);

      const croppedDataUrl = canvas.toDataURL('image/png');
      onImageUpdate(croppedDataUrl);
      
      setIsCropping(false);
      setCropArea(null);
      toast.success("Crop applied!", { id: "crop" });
    } catch (error) {
      console.error("Crop error:", error);
      toast.error("Failed to apply crop", { id: "crop" });
    }
  }, [cropArea, imageContainerRef, currentImageUrl, onImageUpdate]);

  // Event listeners for drag operations
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

  return {
    // Crop state
    isCropping,
    cropArea,
    startCropping,
    cancelCrop,
    applyCrop,
    handleCropPointerDown,
    handleCropPointerMove,
    handleCropPointerUp,
    
    // Overlay state
    overlays,
    activeOverlayId,
    handleFileUpload,
    handleOverlayPointerDown,
    resizeOverlay,
    removeOverlay,
    
    // Text state
    textOverlays,
    activeTextId,
    showTextTool,
    setShowTextTool,
    handleAddTextOverlay,
    handleUpdateTextOverlay,
    handleTextPointerDown,
    resizeText,
    removeTextOverlay,
    
    // Utilities
    fileInputRef,
    selectedText: textOverlays.find(t => t.id === activeTextId) || null,
  };
};
