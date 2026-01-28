"use client";

import { Task, PieChartSegment } from "../types";

interface RightPanelProps {
  selectedTask: Task | null | undefined;
  pendingCells: Set<string>;
  clearMode: boolean;
  tasks: Task[];
  timeDistribution: { [taskId: string]: number };
  totalHours: number;
  pieChartSegments: PieChartSegment[];
  onConfirmEntry: () => void;
  onConfirmClear: () => void;
  onCancelEntry: () => void;
  onClearSelection: () => void;
}

export default function RightPanel({
  selectedTask,
  pendingCells,
  clearMode,
  tasks,
  timeDistribution,
  totalHours,
  pieChartSegments,
  onConfirmEntry,
  onConfirmClear,
  onCancelEntry,
  onClearSelection,
}: RightPanelProps) {
  return (
    <aside className="w-72 xl:w-80 border-l border-[#233f48] p-6 flex flex-col gap-6 overflow-y-auto shrink-0" style={{ background: '#000' }}>
      {clearMode ? (
        /* Clear Mode Panel - Shows when selecting cells to clear */
        <>
          <div className="p-4 rounded-2xl border-2 bg-red-500/10 border-red-500/40">
            <div className="flex items-center gap-3 mb-4">
              <div className="size-6 rounded-full bg-red-500 flex items-center justify-center">
                <span className="material-symbols-outlined text-white text-sm">delete</span>
              </div>
              <div>
                <p className="text-white font-bold">Clear Mode</p>
                <p className="text-xs text-[#92bbc9]">Select cells to remove</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#92bbc9]">Cells Selected</span>
                <span className="text-2xl font-black text-red-400">
                  {pendingCells.size}
                </span>
              </div>
            </div>
          </div>

          <div className="glass-panel p-4 rounded-xl">
            <p className="text-xs text-[#92bbc9] mb-3">
              <span className="text-white font-bold">Click and drag</span> on colored cells to select them for clearing.
            </p>
            <div className="flex flex-col gap-1 mt-3 text-xs text-[#92bbc9]">
              <div className="flex items-center gap-2">
                <span className="bg-[#233f48] px-2 py-0.5 rounded font-mono text-white">Enter</span>
                <span>to confirm clear</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="bg-[#233f48] px-2 py-0.5 rounded font-mono text-white">Esc</span>
                <span>to cancel</span>
              </div>
            </div>
          </div>

          <div className="mt-auto flex flex-col gap-3">
            <button
              onClick={onConfirmClear}
              disabled={pendingCells.size === 0}
              className={`w-full px-4 py-3 rounded-xl text-white text-sm font-bold shadow-lg transition-all flex items-center justify-center gap-2 ${
                pendingCells.size === 0 
                  ? "bg-[#233f48] cursor-not-allowed opacity-50" 
                  : "bg-red-500 hover:bg-red-600"
              }`}
              style={{
                boxShadow: pendingCells.size > 0 ? "0 4px 20px rgba(239, 68, 68, 0.4)" : undefined,
              }}
            >
              <span className="material-symbols-outlined text-sm">delete</span>
              Clear {pendingCells.size} cells
            </button>
            
            <button
              onClick={onCancelEntry}
              className="w-full px-4 py-3 rounded-xl bg-[#233f48] text-[#92bbc9] text-sm font-bold hover:bg-[#233f48]/80 transition-all flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-sm">close</span>
              Cancel
            </button>
          </div>
        </>
      ) : selectedTask ? (
        /* Entry Confirmation Panel - Shows when task is selected */
        <>
          <div 
            className="p-4 rounded-2xl border-2"
            style={{ 
              backgroundColor: `${selectedTask.color}10`,
              borderColor: `${selectedTask.color}40`
            }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div 
                className="size-6 rounded-full"
                style={{ backgroundColor: selectedTask.color, boxShadow: `0 0 12px ${selectedTask.color}` }}
              />
              <div>
                <p className="text-white font-bold">{selectedTask.name}</p>
                <p className="text-xs text-[#92bbc9]">Entry Mode Active</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#92bbc9]">Cells Selected</span>
                <span 
                  className="text-2xl font-black"
                  style={{ color: selectedTask.color }}
                >
                  {pendingCells.size}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#92bbc9]">Hours</span>
                <span className="text-lg font-bold text-white">
                  {pendingCells.size}h
                </span>
              </div>
            </div>
          </div>

          <div className="glass-panel p-4 rounded-xl">
            <p className="text-xs text-[#92bbc9] mb-3">
              <span className="text-white font-bold">Click and drag</span> on cells to select them. 
              <span className="text-white font-bold"> Right-click</span> to deselect.
            </p>
            <div className="flex flex-col gap-1 mt-3 text-xs text-[#92bbc9]">
              <div className="flex items-center gap-2">
                <span className="bg-[#233f48] px-2 py-0.5 rounded font-mono text-white">Enter</span>
                <span>to confirm</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="bg-[#233f48] px-2 py-0.5 rounded font-mono text-white">Esc</span>
                <span>to cancel</span>
              </div>
            </div>
          </div>

          {pendingCells.size > 0 && (
            <button
              onClick={onClearSelection}
              className="w-full px-4 py-2 rounded-xl bg-[#233f48] text-[#92bbc9] text-sm font-bold hover:bg-[#233f48]/80 transition-all"
            >
              Clear Selection
            </button>
          )}

          <div className="mt-auto flex flex-col gap-3">
            <button
              onClick={onConfirmEntry}
              disabled={pendingCells.size === 0}
              className={`w-full px-4 py-3 rounded-xl text-white text-sm font-bold shadow-lg transition-all flex items-center justify-center gap-2 ${
                pendingCells.size === 0 
                  ? "bg-[#233f48] cursor-not-allowed opacity-50" 
                  : ""
              }`}
              style={{
                backgroundColor: pendingCells.size > 0 ? selectedTask.color : undefined,
                boxShadow: pendingCells.size > 0 ? `0 4px 20px ${selectedTask.color}40` : undefined,
              }}
            >
              <span className="material-symbols-outlined text-sm">check</span>
              Confirm Entry ({pendingCells.size} cells)
            </button>
            
            <button
              onClick={onCancelEntry}
              className="w-full px-4 py-3 rounded-xl bg-[#233f48] text-[#92bbc9] text-sm font-bold hover:bg-red-500/20 hover:text-red-400 transition-all flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-sm">close</span>
              Cancel
            </button>
          </div>
        </>
      ) : (
        /* Analytics Panel - Shows when no task selected */
        <>
          <div className="flex flex-col gap-1">
            <h3 className="text-xl font-bold text-white tracking-tight">Time Distribution</h3>
            <p className="text-sm text-[#92bbc9]">Based on your assignments</p>
          </div>

          {/* Glowing Donut Chart */}
          <div className="relative size-56 mx-auto flex items-center justify-center">
            <svg className="size-full -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" fill="transparent" r="40" stroke="#233f48" strokeWidth="12"></circle>
              {pieChartSegments.map((segment) => (
                <circle
                  key={segment.task.id}
                  cx="50"
                  cy="50"
                  fill="transparent"
                  r="40"
                  stroke={segment.task.color}
                  strokeWidth="12"
                  strokeDasharray={`${segment.dashArray} ${2 * Math.PI * 40}`}
                  strokeDashoffset={segment.dashOffset}
                  strokeLinecap="round"
                  style={{ filter: `drop-shadow(0 0 6px ${segment.task.color}80)` }}
                />
              ))}
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-3xl font-black text-white">{totalHours}h</span>
              <span className="text-[10px] uppercase font-bold text-[#92bbc9]">Total Logged</span>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            {tasks.map((task) => {
              const hours = timeDistribution[task.id] || 0;
              return (
                <div key={task.id} className="flex items-center justify-between p-3 rounded-xl bg-[#233f48]/20 border border-[#233f48]/50">
                  <div className="flex items-center gap-3">
                    <div 
                      className="size-2 rounded-full"
                      style={{ backgroundColor: task.color }}
                    />
                    <span className="text-sm text-white font-medium">{task.name}</span>
                  </div>
                  <span 
                    className="text-sm font-mono font-bold"
                    style={{ color: task.color }}
                  >
                    {hours}h
                  </span>
                </div>
              );
            })}
          </div>

          <div className="mt-auto glass-panel p-4 rounded-2xl">
            <div className="flex items-center gap-2 mb-3">
              <span className="material-symbols-outlined text-primary">auto_awesome</span>
              <p className="text-sm font-bold text-white">Quick Tips</p>
            </div>
            <p className="text-xs text-[#92bbc9] leading-relaxed">
              Select a task from the left sidebar to start <span className="text-white font-bold">painting your time matrix</span>.
            </p>
          </div>
        </>
      )}
    </aside>
  );
}
