import { useEffect, useCallback } from 'react';
import { UndoItem, CellData, PageType } from '../types';

interface UseKeyboardShortcutsProps {
  currentPage: PageType;
  selectedTaskId: string | null;
  pendingCells: Set<string>;
  undoStack: UndoItem[];
  showUndo: boolean;
  confirmEntry: () => void;
  cancelEntry: () => void;
  undoLastRemoval: () => void;
}

export function useKeyboardShortcuts({
  currentPage,
  selectedTaskId,
  pendingCells,
  undoStack,
  showUndo,
  confirmEntry,
  cancelEntry,
  undoLastRemoval,
}: UseKeyboardShortcutsProps) {
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    // Only handle shortcuts on matrix page
    if (currentPage !== "matrix") return;

    // Enter to confirm
    if (e.key === "Enter" && selectedTaskId && pendingCells.size > 0) {
      e.preventDefault();
      confirmEntry();
    }
    
    // Escape to cancel
    if (e.key === "Escape" && selectedTaskId && pendingCells.size > 0) {
      e.preventDefault();
      cancelEntry();
    }

    // Ctrl+Z to undo
    if (e.key === "z" && (e.ctrlKey || e.metaKey) && undoStack.length > 0) {
      e.preventDefault();
      undoLastRemoval();
    }
  }, [currentPage, selectedTaskId, pendingCells, undoStack, confirmEntry, cancelEntry, undoLastRemoval]);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);
}

interface UseUndoTimerProps {
  showUndo: boolean;
  setShowUndo: React.Dispatch<React.SetStateAction<boolean>>;
}

export function useUndoTimer({ showUndo, setShowUndo }: UseUndoTimerProps) {
  useEffect(() => {
    if (showUndo) {
      const timer = setTimeout(() => {
        setShowUndo(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [showUndo, setShowUndo]);
}
