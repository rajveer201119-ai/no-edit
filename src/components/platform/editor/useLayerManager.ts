import { useState, useCallback, useRef, useEffect } from "react";
import { Layer, CanvasState, HistoryEntry, ProjectFile } from "./types";
import { toast } from "sonner";

const MAX_HISTORY = 50;
const AUTOSAVE_INTERVAL = 3000;
const LOCAL_STORAGE_KEY = "epic_project_state";

export function useLayerManager(initialState?: Partial<CanvasState>) {
  const [canvasState, setCanvasState] = useState<CanvasState>({
    width: initialState?.width || 800,
    height: initialState?.height || 600,
    layers: initialState?.layers || [],
    selectedLayerIds: [],
    clipboard: [],
  });

  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"saved" | "saving" | "unsaved">("saved");
  const lastSavedRef = useRef<string>("");
  const autosaveTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Check if undo/redo is possible
  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < history.length - 1;

  // Save to history
  const saveToHistory = useCallback((layers: Layer[]) => {
    const entry: HistoryEntry = {
      layers: JSON.parse(JSON.stringify(layers)),
      timestamp: Date.now(),
    };

    setHistory((prev) => {
      const newHistory = prev.slice(0, historyIndex + 1);
      newHistory.push(entry);
      if (newHistory.length > MAX_HISTORY) {
        newHistory.shift();
        return newHistory;
      }
      return newHistory;
    });
    setHistoryIndex((prev) => Math.min(prev + 1, MAX_HISTORY - 1));
  }, [historyIndex]);

  // Undo
  const undo = useCallback(() => {
    if (!canUndo) return;
    const prevIndex = historyIndex - 1;
    const prevState = history[prevIndex];
    if (prevState) {
      setCanvasState((prev) => ({
        ...prev,
        layers: JSON.parse(JSON.stringify(prevState.layers)),
      }));
      setHistoryIndex(prevIndex);
    }
  }, [canUndo, history, historyIndex]);

  // Redo
  const redo = useCallback(() => {
    if (!canRedo) return;
    const nextIndex = historyIndex + 1;
    const nextState = history[nextIndex];
    if (nextState) {
      setCanvasState((prev) => ({
        ...prev,
        layers: JSON.parse(JSON.stringify(nextState.layers)),
      }));
      setHistoryIndex(nextIndex);
    }
  }, [canRedo, history, historyIndex]);

  // Add layer
  const addLayer = useCallback((layer: Layer) => {
    setCanvasState((prev) => {
      const newLayers = [...prev.layers, { ...layer, zIndex: prev.layers.length }];
      saveToHistory(newLayers);
      setSaveStatus("unsaved");
      return { ...prev, layers: newLayers };
    });
  }, [saveToHistory]);

  // Update layer
  const updateLayer = useCallback((id: string, updates: Partial<Layer>) => {
    setCanvasState((prev) => {
      const newLayers = prev.layers.map((l) =>
        l.id === id ? { ...l, ...updates } as Layer : l
      );
      setSaveStatus("unsaved");
      return { ...prev, layers: newLayers };
    });
  }, []);

  // Commit layer changes (saves to history)
  const commitLayerChanges = useCallback(() => {
    saveToHistory(canvasState.layers);
  }, [canvasState.layers, saveToHistory]);

  // Delete layer
  const deleteLayer = useCallback((id: string) => {
    setCanvasState((prev) => {
      const newLayers = prev.layers.filter((l) => l.id !== id);
      saveToHistory(newLayers);
      setSaveStatus("unsaved");
      return {
        ...prev,
        layers: newLayers,
        selectedLayerIds: prev.selectedLayerIds.filter((sid) => sid !== id),
      };
    });
  }, [saveToHistory]);

  // Duplicate layer
  const duplicateLayer = useCallback((id: string) => {
    setCanvasState((prev) => {
      const layer = prev.layers.find((l) => l.id === id);
      if (!layer) return prev;
      
      const newLayer: Layer = {
        ...JSON.parse(JSON.stringify(layer)),
        id: `${layer.type}-${Date.now()}`,
        name: `${layer.name} Copy`,
        x: layer.x + 20,
        y: layer.y + 20,
        zIndex: prev.layers.length,
      };
      
      const newLayers = [...prev.layers, newLayer];
      saveToHistory(newLayers);
      setSaveStatus("unsaved");
      return { ...prev, layers: newLayers, selectedLayerIds: [newLayer.id] };
    });
  }, [saveToHistory]);

  // Lock/unlock layer
  const toggleLayerLock = useCallback((id: string) => {
    setCanvasState((prev) => {
      const newLayers = prev.layers.map((l) =>
        l.id === id ? { ...l, locked: !l.locked } as Layer : l
      );
      setSaveStatus("unsaved");
      return { ...prev, layers: newLayers };
    });
  }, []);

  // Toggle layer visibility
  const toggleLayerVisibility = useCallback((id: string) => {
    setCanvasState((prev) => {
      const newLayers = prev.layers.map((l) =>
        l.id === id ? { ...l, visible: !l.visible } as Layer : l
      );
      setSaveStatus("unsaved");
      return { ...prev, layers: newLayers };
    });
  }, []);

  // Reorder layers
  const reorderLayers = useCallback((fromIndex: number, toIndex: number) => {
    setCanvasState((prev) => {
      const newLayers = [...prev.layers];
      const [movedLayer] = newLayers.splice(fromIndex, 1);
      newLayers.splice(toIndex, 0, movedLayer);
      
      // Update zIndex for all layers
      const reindexed = newLayers.map((l, i) => ({ ...l, zIndex: i })) as Layer[];
      saveToHistory(reindexed);
      setSaveStatus("unsaved");
      return { ...prev, layers: reindexed };
    });
  }, [saveToHistory]);

  // Bring forward
  const bringForward = useCallback((id: string) => {
    setCanvasState((prev) => {
      const index = prev.layers.findIndex((l) => l.id === id);
      if (index === -1 || index === prev.layers.length - 1) return prev;
      
      const newLayers = [...prev.layers];
      [newLayers[index], newLayers[index + 1]] = [newLayers[index + 1], newLayers[index]];
      const reindexed = newLayers.map((l, i) => ({ ...l, zIndex: i })) as Layer[];
      saveToHistory(reindexed);
      setSaveStatus("unsaved");
      return { ...prev, layers: reindexed };
    });
  }, [saveToHistory]);

  // Send backward
  const sendBackward = useCallback((id: string) => {
    setCanvasState((prev) => {
      const index = prev.layers.findIndex((l) => l.id === id);
      if (index <= 0) return prev;
      
      const newLayers = [...prev.layers];
      [newLayers[index], newLayers[index - 1]] = [newLayers[index - 1], newLayers[index]];
      const reindexed = newLayers.map((l, i) => ({ ...l, zIndex: i })) as Layer[];
      saveToHistory(reindexed);
      setSaveStatus("unsaved");
      return { ...prev, layers: reindexed };
    });
  }, [saveToHistory]);

  // Bring to front
  const bringToFront = useCallback((id: string) => {
    setCanvasState((prev) => {
      const index = prev.layers.findIndex((l) => l.id === id);
      if (index === -1 || index === prev.layers.length - 1) return prev;
      
      const newLayers = [...prev.layers];
      const [layer] = newLayers.splice(index, 1);
      newLayers.push(layer);
      const reindexed = newLayers.map((l, i) => ({ ...l, zIndex: i })) as Layer[];
      saveToHistory(reindexed);
      setSaveStatus("unsaved");
      return { ...prev, layers: reindexed };
    });
  }, [saveToHistory]);

  // Send to back
  const sendToBack = useCallback((id: string) => {
    setCanvasState((prev) => {
      const index = prev.layers.findIndex((l) => l.id === id);
      if (index <= 0) return prev;
      
      const newLayers = [...prev.layers];
      const [layer] = newLayers.splice(index, 1);
      newLayers.unshift(layer);
      const reindexed = newLayers.map((l, i) => ({ ...l, zIndex: i })) as Layer[];
      saveToHistory(reindexed);
      setSaveStatus("unsaved");
      return { ...prev, layers: reindexed };
    });
  }, [saveToHistory]);

  // Select layer
  const selectLayer = useCallback((id: string, multiSelect = false) => {
    setCanvasState((prev) => {
      if (multiSelect) {
        const isSelected = prev.selectedLayerIds.includes(id);
        return {
          ...prev,
          selectedLayerIds: isSelected
            ? prev.selectedLayerIds.filter((sid) => sid !== id)
            : [...prev.selectedLayerIds, id],
        };
      }
      return { ...prev, selectedLayerIds: [id] };
    });
  }, []);

  // Clear selection
  const clearSelection = useCallback(() => {
    setCanvasState((prev) => ({ ...prev, selectedLayerIds: [] }));
  }, []);

  // Copy selected layers
  const copySelectedLayers = useCallback(() => {
    setCanvasState((prev) => {
      const selectedLayers = prev.layers.filter((l) =>
        prev.selectedLayerIds.includes(l.id)
      );
      return { ...prev, clipboard: JSON.parse(JSON.stringify(selectedLayers)) };
    });
    toast.success("Copied to clipboard");
  }, []);

  // Paste from clipboard
  const pasteFromClipboard = useCallback(() => {
    setCanvasState((prev) => {
      if (prev.clipboard.length === 0) return prev;
      
      const newLayers = prev.clipboard.map((l, i) => ({
        ...l,
        id: `${l.type}-${Date.now()}-${i}`,
        name: `${l.name} Copy`,
        x: l.x + 20,
        y: l.y + 20,
        zIndex: prev.layers.length + i,
      })) as Layer[];
      
      const allLayers = [...prev.layers, ...newLayers];
      saveToHistory(allLayers);
      setSaveStatus("unsaved");
      return {
        ...prev,
        layers: allLayers,
        selectedLayerIds: newLayers.map((l) => l.id),
      };
    });
    toast.success("Pasted from clipboard");
  }, [saveToHistory]);

  // Resize canvas
  const resizeCanvas = useCallback((width: number, height: number) => {
    setCanvasState((prev) => ({ ...prev, width, height }));
    setSaveStatus("unsaved");
  }, []);

  // Set background color
  const setBackgroundColor = useCallback((color: string) => {
    setCanvasState((prev) => {
      const bgLayerIndex = prev.layers.findIndex((l) => l.type === "background");
      if (bgLayerIndex === -1) {
        // Create background layer
        const bgLayer: Layer = {
          id: "background-0",
          type: "background",
          name: "Background",
          x: 0,
          y: 0,
          width: prev.width,
          height: prev.height,
          rotation: 0,
          opacity: 1,
          locked: false,
          visible: true,
          zIndex: 0,
          backgroundColor: color,
        };
        const newLayers = [bgLayer, ...prev.layers.map((l) => ({ ...l, zIndex: l.zIndex + 1 }))];
        saveToHistory(newLayers as Layer[]);
        setSaveStatus("unsaved");
        return { ...prev, layers: newLayers as Layer[] };
      }
      
      const newLayers = prev.layers.map((l, i) =>
        i === bgLayerIndex ? { ...l, backgroundColor: color } : l
      ) as Layer[];
      saveToHistory(newLayers);
      setSaveStatus("unsaved");
      return { ...prev, layers: newLayers };
    });
  }, [saveToHistory]);

  // Autosave to localStorage
  useEffect(() => {
    if (saveStatus === "unsaved") {
      if (autosaveTimerRef.current) {
        clearTimeout(autosaveTimerRef.current);
      }
      
      autosaveTimerRef.current = setTimeout(() => {
        setSaveStatus("saving");
        setIsSaving(true);
        
        const stateJson = JSON.stringify(canvasState);
        if (stateJson !== lastSavedRef.current) {
          localStorage.setItem(LOCAL_STORAGE_KEY, stateJson);
          lastSavedRef.current = stateJson;
        }
        
        setTimeout(() => {
          setSaveStatus("saved");
          setIsSaving(false);
        }, 500);
      }, AUTOSAVE_INTERVAL);
    }
    
    return () => {
      if (autosaveTimerRef.current) {
        clearTimeout(autosaveTimerRef.current);
      }
    };
  }, [canvasState, saveStatus]);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved && !initialState?.layers?.length) {
      try {
        const parsed = JSON.parse(saved);
        setCanvasState((prev) => ({ ...prev, ...parsed }));
        lastSavedRef.current = saved;
        // Initialize history with loaded state
        setHistory([{ layers: parsed.layers || [], timestamp: Date.now() }]);
        setHistoryIndex(0);
      } catch (e) {
        console.error("Failed to load saved state:", e);
      }
    }
  }, []);

  // Export project file
  const exportProject = useCallback((): ProjectFile => {
    return {
      version: "1.0.0",
      name: "EPIC Project",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      canvas: canvasState,
    };
  }, [canvasState]);

  // Import project file
  const importProject = useCallback((project: ProjectFile) => {
    setCanvasState(project.canvas);
    saveToHistory(project.canvas.layers);
    setSaveStatus("unsaved");
    toast.success("Project imported successfully");
  }, [saveToHistory]);

  // Save as .epic file
  const saveProjectFile = useCallback(() => {
    const project = exportProject();
    const blob = new Blob([JSON.stringify(project, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${project.name.replace(/\s+/g, "-").toLowerCase()}.epic`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("Project saved as .epic file");
  }, [exportProject]);

  return {
    canvasState,
    setCanvasState,
    isSaving,
    saveStatus,
    canUndo,
    canRedo,
    undo,
    redo,
    addLayer,
    updateLayer,
    commitLayerChanges,
    deleteLayer,
    duplicateLayer,
    toggleLayerLock,
    toggleLayerVisibility,
    reorderLayers,
    bringForward,
    sendBackward,
    bringToFront,
    sendToBack,
    selectLayer,
    clearSelection,
    copySelectedLayers,
    pasteFromClipboard,
    resizeCanvas,
    setBackgroundColor,
    exportProject,
    importProject,
    saveProjectFile,
  };
}
