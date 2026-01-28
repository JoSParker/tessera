"use client";

import { Task, UndoItem } from "../types";

interface LegendBarProps {
  tasks: Task[];
  showUndo: boolean;
  undoStack: UndoItem[];
  onUndo: () => void;
}

export default function LegendBar({ tasks, showUndo, undoStack, onUndo }: LegendBarProps) {
  const canUndo = undoStack.length > 0;
  
  return (
    <div className="p-4 bg-obsidian/90 backdrop-blur-lg border-t border-[#233f48] flex items-center justify-between gap-6 overflow-x-auto shrink-0">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs font-bold text-[#92bbc9] uppercase">Legend:</span>
        </div>
        <div className="flex gap-4 flex-wrap">
          {tasks.map((task) => (
            <div key={task.id} className="flex items-center gap-2">
              <div 
                className="size-3 rounded-full"
                style={{ backgroundColor: task.color, boxShadow: `0 0 8px ${task.color}` }}
              />
              <span className="text-xs text-white">{task.shortcut}: {task.name}</span>
            </div>
          ))}
        </div>
      </div>
      
      {/* Undo Button - always show when there's something to undo */}
      {canUndo && (
        <button
          onClick={onUndo}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all shrink-0 border ${
            showUndo 
              ? "bg-amber-500/20 text-amber-400 border-amber-500/30 hover:bg-amber-500/30 animate-pulse" 
              : "bg-[#233f48]/50 text-[#92bbc9] border-[#233f48] hover:bg-[#233f48]"
          }`}
        >
          <span className="material-symbols-outlined text-sm">undo</span>
          Undo ({undoStack.length})
        </button>
      )}
    </div>
  );
}
