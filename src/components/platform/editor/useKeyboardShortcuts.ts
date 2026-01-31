import { useEffect, useCallback } from "react";

interface ShortcutHandlers {
  onUndo: () => void;
  onRedo: () => void;
  onCopy: () => void;
  onPaste: () => void;
  onDelete: () => void;
  onDuplicate: () => void;
  onSelectAll: () => void;
  onDeselect: () => void;
  onBringForward: () => void;
  onSendBackward: () => void;
  onSave: () => void;
  onZoomIn?: () => void;
  onZoomOut?: () => void;
  onZoomReset?: () => void;
}

export function useKeyboardShortcuts(handlers: ShortcutHandlers, enabled: boolean = true) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!enabled) return;
      
      // Ignore if typing in an input
      const target = e.target as HTMLElement;
      if (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable
      ) {
        // Allow Escape to blur
        if (e.key === "Escape") {
          target.blur();
        }
        return;
      }

      const isMac = navigator.platform.toUpperCase().indexOf("MAC") >= 0;
      const cmdOrCtrl = isMac ? e.metaKey : e.ctrlKey;

      // Undo - Cmd/Ctrl + Z
      if (cmdOrCtrl && e.key.toLowerCase() === "z" && !e.shiftKey) {
        e.preventDefault();
        handlers.onUndo();
        return;
      }

      // Redo - Cmd/Ctrl + Shift + Z or Cmd/Ctrl + Y
      if (
        (cmdOrCtrl && e.shiftKey && e.key.toLowerCase() === "z") ||
        (cmdOrCtrl && e.key.toLowerCase() === "y")
      ) {
        e.preventDefault();
        handlers.onRedo();
        return;
      }

      // Copy - Cmd/Ctrl + C
      if (cmdOrCtrl && e.key.toLowerCase() === "c") {
        e.preventDefault();
        handlers.onCopy();
        return;
      }

      // Paste - Cmd/Ctrl + V
      if (cmdOrCtrl && e.key.toLowerCase() === "v") {
        e.preventDefault();
        handlers.onPaste();
        return;
      }

      // Duplicate - Cmd/Ctrl + D
      if (cmdOrCtrl && e.key.toLowerCase() === "d") {
        e.preventDefault();
        handlers.onDuplicate();
        return;
      }

      // Select All - Cmd/Ctrl + A
      if (cmdOrCtrl && e.key.toLowerCase() === "a") {
        e.preventDefault();
        handlers.onSelectAll();
        return;
      }

      // Save - Cmd/Ctrl + S
      if (cmdOrCtrl && e.key.toLowerCase() === "s") {
        e.preventDefault();
        handlers.onSave();
        return;
      }

      // Bring Forward - Cmd/Ctrl + ]
      if (cmdOrCtrl && e.key === "]") {
        e.preventDefault();
        handlers.onBringForward();
        return;
      }

      // Send Backward - Cmd/Ctrl + [
      if (cmdOrCtrl && e.key === "[") {
        e.preventDefault();
        handlers.onSendBackward();
        return;
      }

      // Zoom In - Cmd/Ctrl + =
      if (cmdOrCtrl && (e.key === "=" || e.key === "+")) {
        e.preventDefault();
        handlers.onZoomIn?.();
        return;
      }

      // Zoom Out - Cmd/Ctrl + -
      if (cmdOrCtrl && e.key === "-") {
        e.preventDefault();
        handlers.onZoomOut?.();
        return;
      }

      // Zoom Reset - Cmd/Ctrl + 0
      if (cmdOrCtrl && e.key === "0") {
        e.preventDefault();
        handlers.onZoomReset?.();
        return;
      }

      // Delete - Delete or Backspace
      if (e.key === "Delete" || e.key === "Backspace") {
        e.preventDefault();
        handlers.onDelete();
        return;
      }

      // Deselect - Escape
      if (e.key === "Escape") {
        e.preventDefault();
        handlers.onDeselect();
        return;
      }
    },
    [handlers, enabled]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);
}
