// Editor exports
export * from "./types";
export { useLayerManager } from "./useLayerManager";
export { useExportCanvas } from "./useExportCanvas";
export { useKeyboardShortcuts } from "./useKeyboardShortcuts";
export { LayerPanel } from "./LayerPanel";
export { TextToolPanel } from "./TextToolPanel";
export { ShapesToolPanel } from "./ShapesToolPanel";
export { CropToolPanel } from "./CropToolPanel";
export { BackgroundPanel } from "./BackgroundPanel";
export { CanvasRenderer } from "./CanvasRenderer";
export { ElementsToolPanel } from "./ElementsToolPanel";
export { HistoryPanel, useDesignHistory, type HistoryItem } from "./HistoryPanel";
export { UploadModal } from "./UploadModal";
export { QuickActions } from "./QuickActions";
export { SmartResizePopover } from "./SmartResizePopover";
export { IconLayerRenderer, getIconComponent, isValidIconName } from "./IconRenderer";

// New editor features
export { DesignScore, calculateScore, type ScoreBreakdown } from "./DesignScore";
export { PromptAnalyzer, analyzePrompt, type PromptAnalysis, type PromptDifficulty } from "./PromptAnalyzer";
export { DesignIntentSelector, getIntentRecommendations, type DesignIntent } from "./DesignIntentSelector";
export { ZeroEditMode, ZeroEditOutput } from "./ZeroEditMode";
export { AIReasoningOverlay, AIReasoningToggle } from "./AIReasoningOverlay";
export { RemixLineage, RemixBadge, useRemixHistory, type RemixNode } from "./RemixLineage";
export { DesignMistakeDetector, detectMistakes, type DesignMistake } from "./DesignMistakeDetector";

// Smart Automation Engine
export { getContrastTextColor, getPerceivedBrightness, autoContrastLayers } from "./AutoContrastEngine";
export { DesignWizard } from "./DesignWizard";
export { ExportSizePack } from "./ExportSizePack";
export { OnboardingGuide, OnboardingTrigger } from "./OnboardingGuide";
export { SketchToolPanel } from "./SketchTool";
export { BlankCanvasModal } from "./BlankCanvasModal";
