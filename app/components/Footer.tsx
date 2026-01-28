"use client";

import { Task, YearDay } from "../types";

interface FooterProps {
  selectedTask: Task | null | undefined;
  totalHours: number;
  yearDays: YearDay[];
}

export default function Footer({ selectedTask, totalHours, yearDays }: FooterProps) {
  return (
    <footer className="border-t border-[#233f48] px-6 py-2 flex items-center justify-between text-[10px] text-[#92bbc9] uppercase font-bold tracking-widest" style={{ background: '#000' }}>
      <div className="flex items-center gap-4">
        <span className="flex items-center gap-1">
          <span 
            className="size-1.5 rounded-full animate-pulse"
            style={{ backgroundColor: selectedTask ? selectedTask.color : "#13b6ec" }}
          ></span> 
          {selectedTask ? `Entry Mode: ${selectedTask.name}` : "System Ready"}
        </span>
        <span className="hidden sm:block">Total logged: {totalHours} Hours</span>
      </div>
      <div className="flex items-center gap-4">
        <span className="hidden sm:block">Days: {yearDays.length} | Cells: {yearDays.length * 24}</span>
        <span>V 1.0.4-OBSIDIAN</span>
      </div>
    </footer>
  );
}
