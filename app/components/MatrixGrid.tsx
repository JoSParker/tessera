"use client";

import { Task, YearDay, CellData } from "../types";

interface MatrixGridProps {
  yearDays: YearDay[];
  cellData: CellData;
  pendingCells: Set<string>;
  selectedTaskId: string | null;
  selectedTask: Task | null | undefined;
  clearMode: boolean;
  getTaskById: (taskId: string | null) => Task | undefined;
  onCellMouseDown: (cellKey: string) => void;
  onCellMouseEnter: (cellKey: string) => void;
  onCellRightClick: (e: React.MouseEvent, cellKey: string) => void;
}

export default function MatrixGrid({
  yearDays,
  cellData,
  pendingCells,
  selectedTaskId,
  selectedTask,
  clearMode,
  getTaskById,
  onCellMouseDown,
  onCellMouseEnter,
  onCellRightClick,
}: MatrixGridProps) {
  return (
    <div className="flex-1 min-w-0 overflow-auto px-6 pb-6" style={{ background: '#000' }}>
      {/* Time Labels */}
      <div className="matrix-grid mb-2 sticky top-0 z-10 py-2 border-b border-[#233f48]" style={{ background: '#000' }}>
        <div className="text-[10px] text-[#92bbc9] font-bold uppercase tracking-wider flex items-end">DATE</div>
        {Array.from({ length: 24 }, (_, i) => (
          <div key={i} className="text-[10px] text-center text-[#92bbc9] font-mono">
            {i.toString().padStart(2, '0')}
          </div>
        ))}
      </div>

      {/* Matrix Rows - All days of the year */}
      <div className="flex flex-col gap-[2px]">
        {yearDays.map((day, dayIndex) => (
          <div key={dayIndex} className="matrix-grid group">
            <div className="text-xs text-[#92bbc9] flex items-center h-8 font-medium">
              {day.label}
            </div>
            {Array.from({ length: 24 }, (_, hour) => {
              const cellKey = `${dayIndex}-${hour}`;
              const taskId = cellData[cellKey];
              const task = taskId ? getTaskById(taskId) : null;
              const isPending = pendingCells.has(cellKey);
              const isPendingClear = isPending && clearMode;
              
              return (
                <div
                  key={hour}
                  className={`h-8 rounded-sm border transition-all ${
                    selectedTaskId ? "cursor-crosshair" : task ? "cursor-pointer" : "cursor-default"
                  } ${
                    isPending 
                      ? "ring-2 ring-offset-1 ring-offset-background-dark animate-pulse" 
                      : ""
                  } ${
                    isPendingClear
                      ? "ring-red-500"
                      : ""
                  } ${
                    selectedTaskId && !task && !isPending
                      ? "hover:border-primary/50 hover:bg-primary/10"
                      : ""
                  } ${
                    !selectedTaskId && task && !isPending
                      ? "hover:ring-2 hover:ring-red-500/50 hover:ring-offset-1 hover:ring-offset-background-dark"
                      : ""
                  }`}
                  style={{
                    backgroundColor: isPendingClear
                      ? "rgba(239, 68, 68, 0.3)"
                      : isPending && selectedTask
                      ? `${selectedTask.color}60`
                      : task 
                      ? `${task.color}60` 
                      : "rgba(35, 63, 72, 0.2)",
                    borderColor: isPendingClear
                      ? "rgba(239, 68, 68, 0.6)"
                      : isPending && selectedTask
                      ? `${selectedTask.color}80`
                      : task 
                      ? `${task.color}40` 
                      : "rgba(35, 63, 72, 0.3)",
                    boxShadow: isPendingClear
                      ? "0 0 12px rgba(239, 68, 68, 0.4)"
                      : isPending && selectedTask
                      ? `0 0 12px ${selectedTask.color}60`
                      : task 
                      ? `0 0 8px ${task.color}40` 
                      : undefined,
                  }}
                  onMouseDown={() => onCellMouseDown(cellKey)}
                  onMouseEnter={() => onCellMouseEnter(cellKey)}
                  onContextMenu={(e) => onCellRightClick(e, cellKey)}
                />
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
