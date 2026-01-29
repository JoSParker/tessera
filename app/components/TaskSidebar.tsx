"use client";

import { Task } from "../types";

interface TaskSidebarProps {
  tasks: Task[];
  selectedTaskId: string | null;
  editingTaskId: string | null;
  editingTaskName: string;
  showAddTask: boolean;
  newTaskName: string;
  onSelectTask: (taskId: string) => void;
  onStartEditing: (task: Task, e: React.MouseEvent) => void;
  onSaveEdit: () => void;
  onCancelEdit: () => void;
  onEditingNameChange: (name: string) => void;
  onShowAddTask: (show: boolean) => void;
  onNewTaskNameChange: (name: string) => void;
  onAddTask: () => void;
}

export default function TaskSidebar({
  tasks,
  selectedTaskId,
  editingTaskId,
  editingTaskName,
  showAddTask,
  newTaskName,
  onSelectTask,
  onStartEditing,
  onSaveEdit,
  onCancelEdit,
  onEditingNameChange,
  onShowAddTask,
  onNewTaskNameChange,
  onAddTask,
}: TaskSidebarProps) {
  return (
    <aside className="w-16 lg:w-64 border-r border-[#233f48] p-4 hidden md:flex flex-col overflow-y-auto shrink-0" style={{ background: '#000' }}>
      <div className="flex flex-col gap-6 flex-1">
        <div className="flex flex-col gap-2">
          <p className="text-[10px] uppercase tracking-widest text-[#92bbc9] font-bold px-3">Select Task</p>
          <p className="text-[10px] text-[#92bbc9]/60 px-3 hidden lg:block">Click a task to start entry</p>
          
          {tasks.map((task) => (
            editingTaskId === task.id ? (
              <div key={task.id} className="flex flex-col gap-2 p-3 rounded-xl bg-[#233f48]/30 border border-[#233f48]">
                <input
                  type="text"
                  value={editingTaskName}
                  onChange={(e) => onEditingNameChange(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") onSaveEdit();
                    if (e.key === "Escape") onCancelEdit();
                  }}
                  className="w-full px-3 py-2 rounded-lg bg-[#233f48] text-white text-sm border-none focus:ring-1 focus:ring-primary focus:outline-none"
                  autoFocus
                  aria-label="Edit task name"
                />
                <div className="flex gap-2">
                  <button
                    onClick={onSaveEdit}
                    className="flex-1 px-3 py-1.5 rounded-lg bg-primary text-white text-xs font-bold hover:bg-primary/90 transition-colors"
                    aria-label="Save task name"
                  >
                    Save
                  </button>
                  <button
                    onClick={onCancelEdit}
                    className="flex-1 px-3 py-1.5 rounded-lg bg-[#233f48] text-[#92bbc9] text-xs font-bold hover:bg-[#233f48]/80 transition-colors"
                    aria-label="Cancel editing"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <button
                key={task.id}
                onClick={() => onSelectTask(task.id)}
                disabled={selectedTaskId !== null && selectedTaskId !== task.id}
                className={`group/task flex items-center gap-3 px-3 py-3 rounded-xl transition-all relative focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                  selectedTaskId === task.id
                    ? "border-2"
                    : selectedTaskId !== null
                    ? "opacity-40 cursor-not-allowed border border-transparent"
                    : "border border-transparent hover:bg-[#233f48]/30"
                }`}
                style={{
                  backgroundColor: selectedTaskId === task.id ? `${task.color}20` : undefined,
                  borderColor: selectedTaskId === task.id ? `${task.color}50` : undefined,
                  color: selectedTaskId === task.id ? task.color : "#92bbc9",
                }}
                aria-label={`Select ${task.name} task`}
                aria-pressed={selectedTaskId === task.id}
              >
                <div 
                  className="w-4 h-4 rounded-full shrink-0"
                  style={{ backgroundColor: task.color, boxShadow: `0 0 8px ${task.color}` }}
                  aria-hidden="true"
                />
                <p className="text-sm font-medium hidden lg:block truncate">{task.name}</p>
                <span className="bg-[#233f48] px-1.5 py-0.5 rounded text-white font-mono text-xs ml-auto hidden lg:block group-hover/task:hidden">
                  {task.shortcut}
                </span>
                {/* Edit button - shows on hover */}
                <button
                  onClick={(e) => onStartEditing(task, e)}
                  className="absolute right-2 hidden lg:group-hover/task:flex items-center justify-center w-7 h-7 rounded-lg bg-[#233f48] text-[#92bbc9] hover:bg-primary/20 hover:text-primary transition-all focus:outline-none focus:ring-2 focus:ring-primary/50"
                  title="Edit task"
                  aria-label={`Edit ${task.name}`}
                >
                  {/* Using SVG icon instead of Material Symbols */}
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                  </svg>
                </button>
              </button>
            )
          ))}

          {/* Add Task Button */}
          {!showAddTask && !selectedTaskId ? (
            <button
              onClick={() => onShowAddTask(true)}
              className="flex items-center gap-3 px-3 py-3 rounded-xl text-[#92bbc9] hover:bg-[#233f48]/30 hover:text-white transition-all border border-dashed border-[#233f48] focus:outline-none focus:ring-2 focus:ring-primary/50"
              aria-label="Add new task"
            >
              {/* Using SVG icon instead of Material Symbols */}
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              <p className="text-sm font-medium hidden lg:block">Add Task</p>
            </button>
          ) : showAddTask ? (
            <div className="flex flex-col gap-2 p-3 rounded-xl bg-[#233f48]/30 border border-[#233f48]">
              <input
                type="text"
                value={newTaskName}
                onChange={(e) => onNewTaskNameChange(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") onAddTask();
                  if (e.key === "Escape") { onShowAddTask(false); onNewTaskNameChange(""); }
                }}
                placeholder="Task name..."
                className="w-full px-3 py-2 rounded-lg bg-[#233f48] text-white text-sm border-none focus:ring-1 focus:ring-primary focus:outline-none placeholder:text-[#92bbc9]/40"
                autoFocus
                aria-label="New task name"
              />
              <div className="flex gap-2">
                <button
                  onClick={onAddTask}
                  disabled={!newTaskName.trim()}
                  className="flex-1 px-3 py-1.5 rounded-lg bg-primary text-white text-xs font-bold hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Add task"
                >
                  Add
                </button>
                <button
                  onClick={() => { onShowAddTask(false); onNewTaskNameChange(""); }}
                  className="flex-1 px-3 py-1.5 rounded-lg bg-[#233f48] text-[#92bbc9] text-xs font-bold hover:bg-[#233f48]/80 transition-colors"
                  aria-label="Cancel adding task"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : null}
        </div>
      </div>

      <div className="glass-panel p-4 rounded-xl hidden lg:block mt-4">
        <p className="text-xs text-primary font-bold mb-1">PRO PLAN</p>
        <p className="text-xs text-white mb-3">Syncing across 4 devices</p>
        <div className="w-full bg-[#233f48] h-1.5 rounded-full overflow-hidden">
          <div className="bg-primary h-full w-3/4" role="progressbar" aria-valuenow={75} aria-valuemin={0} aria-valuemax={100} aria-label="Device sync progress"></div>
        </div>
      </div>
    </aside>
  );
}