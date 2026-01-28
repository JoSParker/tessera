"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "./contexts/AuthContext";

// Types
import { Task, CellData, GoalItem, Friend, UndoItem, PageType } from "./types";

// Constants
import { DEFAULT_TASKS, DEFAULT_GOALS, DEFAULT_FRIENDS, TASK_COLORS, generateYearDays } from "./constants";

// Components
import {
  Header,
  TaskSidebar,
  MatrixGrid,
  RightPanel,
  LegendBar,
  Footer,
  AnalyticsPage,
  GoalsPage,
  FriendsPage,
} from "./components";


export default function Home() {
  // All hooks must be called unconditionally and at the top
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  // Page state
  const [currentPage, setCurrentPage] = useState<PageType>("matrix");

  // Task state
  const [tasks, setTasks] = useState<Task[]>(DEFAULT_TASKS);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editingTaskName, setEditingTaskName] = useState("");
  const [showAddTask, setShowAddTask] = useState(false);
  const [newTaskName, setNewTaskName] = useState("");

  // Matrix state
  const [cellData, setCellData] = useState<CellData>({});
  const [isSelecting, setIsSelecting] = useState(false);
  const [pendingCells, setPendingCells] = useState<Set<string>>(new Set());
  const [clearMode, setClearMode] = useState(false); // When selecting filled cells to clear

  // Undo state
  const [undoStack, setUndoStack] = useState<UndoItem[]>([]);
  const [showUndo, setShowUndo] = useState(false);

  // Goals & Friends state
  const [goals, setGoals] = useState<GoalItem[]>(DEFAULT_GOALS);
  const [friends] = useState<Friend[]>(DEFAULT_FRIENDS);

  // Generate year days
  const yearDays = useMemo(() => generateYearDays(2024), []);

  // Calculate time distribution for pie chart
  const timeDistribution = useMemo(() => {
    const distribution: { [taskId: string]: number } = {};
    tasks.forEach(task => {
      distribution[task.id] = 0;
    });
    Object.values(cellData).forEach(taskId => {
      if (taskId && distribution[taskId] !== undefined) {
        distribution[taskId]++;
      }
    });
    return distribution;
  }, [cellData, tasks]);

  const totalHours = useMemo(() => {
    return Object.values(timeDistribution).reduce((a, b) => a + b, 0);
  }, [timeDistribution]);

  // Calculate pie chart segments
  const pieChartSegments = useMemo(() => {
    if (totalHours === 0) return [];
    const circumference = 2 * Math.PI * 40;
    let offset = 0;
    return tasks.map(task => {
      const hours = timeDistribution[task.id] || 0;
      const percentage = (hours / totalHours) * 100;
      const dashArray = (percentage / 100) * circumference;
      const segment = {
        task,
        hours,
        percentage,
        dashArray,
        dashOffset: -offset,
      };
      offset += dashArray;
      return segment;
    }).filter(s => s.hours > 0);
  }, [tasks, timeDistribution, totalHours]);

  // Weekly data for analytics
  const weeklyData = useMemo(() => {
    const weeks: { week: string; hours: number }[] = [];
    for (let i = 0; i < 52; i++) {
      weeks.push({ week: `W${i + 1}`, hours: Math.floor(Math.random() * 40) });
    }
    return weeks;
  }, []);

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace("/auth");
    }
  }, [user, authLoading, router]);

  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-obsidian">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Get task by id
  const getTaskById = useCallback((taskId: string | null) => {
    return tasks.find(t => t.id === taskId);
  }, [tasks]);

  const selectedTask = selectedTaskId ? getTaskById(selectedTaskId) : null;

  // Cell interaction handlers
  const handleCellMouseDown = useCallback((cellKey: string) => {
    if (selectedTaskId) {
      // Entry mode - selecting cells to fill
      setIsSelecting(true);
      setPendingCells(new Set([cellKey]));
    } else if (cellData[cellKey]) {
      // Clear mode - selecting filled cells to clear
      setClearMode(true);
      setIsSelecting(true);
      setPendingCells(new Set([cellKey]));
    }
  }, [selectedTaskId, cellData]);

  const handleCellMouseEnter = useCallback((cellKey: string) => {
    if (!isSelecting) return;
    
    if (selectedTaskId) {
      // Entry mode - can select any cell
      setPendingCells(prev => new Set([...prev, cellKey]));
    } else if (clearMode && cellData[cellKey]) {
      // Clear mode - only select filled cells
      setPendingCells(prev => new Set([...prev, cellKey]));
    }
  }, [isSelecting, selectedTaskId, clearMode, cellData]);

  const handleMouseUp = useCallback(() => {
    setIsSelecting(false);
  }, []);

  // Entry confirmation handlers
  const confirmEntry = useCallback(() => {
    if (selectedTaskId && pendingCells.size > 0) {
      setCellData(prev => {
        const newData = { ...prev };
        pendingCells.forEach(cellKey => {
          newData[cellKey] = selectedTaskId;
        });
        return newData;
      });
    }
    setPendingCells(new Set());
    setSelectedTaskId(null);
  }, [selectedTaskId, pendingCells]);

  const cancelEntry = useCallback(() => {
    setPendingCells(new Set());
    setSelectedTaskId(null);
    setClearMode(false);
  }, []);

  // Confirm clear - remove all pending cells
  const confirmClear = useCallback(() => {
    if (pendingCells.size > 0) {
      // Add all to undo stack
      const removedItems: UndoItem[] = [];
      pendingCells.forEach(cellKey => {
        const taskId = cellData[cellKey];
        if (taskId) {
          removedItems.push({ cellKey, taskId });
        }
      });
      setUndoStack(prev => [...prev, ...removedItems]);
      setShowUndo(true);
      
      // Remove cells
      setCellData(prev => {
        const newData = { ...prev };
        pendingCells.forEach(cellKey => {
          delete newData[cellKey];
        });
        return newData;
      });
    }
    setPendingCells(new Set());
    setClearMode(false);
  }, [pendingCells, cellData]);

  // Right-click to remove cell
  const handleCellRightClick = useCallback((e: React.MouseEvent, cellKey: string) => {
    e.preventDefault();
    if (selectedTaskId) {
      setPendingCells(prev => {
        const newSet = new Set(prev);
        newSet.delete(cellKey);
        return newSet;
      });
    } else {
      const existingTaskId = cellData[cellKey];
      if (existingTaskId) {
        setUndoStack(prev => [...prev, { cellKey, taskId: existingTaskId }]);
        setShowUndo(true);
        setCellData(prev => {
          const newData = { ...prev };
          delete newData[cellKey];
          return newData;
        });
      }
    }
  }, [selectedTaskId, cellData]);

  // Undo last removal
  const undoLastRemoval = useCallback(() => {
    if (undoStack.length === 0) return;
    
    const lastRemoved = undoStack[undoStack.length - 1];
    setCellData(prev => ({
      ...prev,
      [lastRemoved.cellKey]: lastRemoved.taskId
    }));
    setUndoStack(prev => prev.slice(0, -1));
    
    if (undoStack.length <= 1) {
      setShowUndo(false);
    }
  }, [undoStack]);

  // Task management handlers
  const selectTask = useCallback((taskId: string) => {
    if (selectedTaskId === taskId) {
      cancelEntry();
    } else {
      setPendingCells(new Set());
      setSelectedTaskId(taskId);
    }
  }, [selectedTaskId, cancelEntry]);

  const startEditingTask = useCallback((task: Task, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingTaskId(task.id);
    setEditingTaskName(task.name);
  }, []);

  const saveEditedTask = useCallback(() => {
    if (!editingTaskId || !editingTaskName.trim()) return;
    
    setTasks(prev => prev.map(task => 
      task.id === editingTaskId 
        ? { ...task, name: editingTaskName.trim() }
        : task
    ));
    setEditingTaskId(null);
    setEditingTaskName("");
  }, [editingTaskId, editingTaskName]);

  const cancelEditingTask = useCallback(() => {
    setEditingTaskId(null);
    setEditingTaskName("");
  }, []);

  const addNewTask = useCallback(() => {
    if (!newTaskName.trim()) return;
    
    const newTask: Task = {
      id: `task-${Date.now()}`,
      name: newTaskName.trim(),
      color: TASK_COLORS[tasks.length % TASK_COLORS.length],
      shortcut: (tasks.length + 1).toString(),
    };
    
    setTasks(prev => [...prev, newTask]);
    setNewTaskName("");
    setShowAddTask(false);
  }, [newTaskName, tasks.length]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      
      // Undo with Ctrl+Z
      if ((e.ctrlKey || e.metaKey) && e.key === "z" && undoStack.length > 0) {
        e.preventDefault();
        undoLastRemoval();
        return;
      }
      
      const hasActiveMode = selectedTaskId !== null || clearMode;
      if (!hasActiveMode) return;
      
      if (e.key === "Enter" && pendingCells.size > 0) {
        e.preventDefault();
        if (clearMode) {
          confirmClear();
        } else {
          confirmEntry();
        }
      } else if (e.key === "Escape") {
        e.preventDefault();
        cancelEntry();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedTaskId, clearMode, pendingCells, undoStack, confirmEntry, confirmClear, cancelEntry, undoLastRemoval]);

  // Auto-hide undo after 5 seconds
  useEffect(() => {
    if (showUndo) {
      const timer = setTimeout(() => setShowUndo(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [showUndo]);

  return (
    <div
      className="relative flex h-screen flex-col bg-obsidian overflow-hidden"
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <Header currentPage={currentPage} setCurrentPage={setCurrentPage} />

      {currentPage === "matrix" ? (
        <div className="flex flex-1 min-h-0 overflow-hidden">
          {/* Left Sidebar - Task Selection */}
          <TaskSidebar
            tasks={tasks}
            selectedTaskId={selectedTaskId}
            editingTaskId={editingTaskId}
            editingTaskName={editingTaskName}
            showAddTask={showAddTask}
            newTaskName={newTaskName}
            onSelectTask={selectTask}
            onStartEditing={startEditingTask}
            onSaveEdit={saveEditedTask}
            onCancelEdit={cancelEditingTask}
            onEditingNameChange={setEditingTaskName}
            onShowAddTask={setShowAddTask}
            onNewTaskNameChange={setNewTaskName}
            onAddTask={addNewTask}
          />

          {/* Main Matrix */}
          <MatrixGrid
            yearDays={yearDays}
            cellData={cellData}
            pendingCells={pendingCells}
            selectedTaskId={selectedTaskId}
            selectedTask={selectedTask}
            clearMode={clearMode}
            getTaskById={getTaskById}
            onCellMouseDown={handleCellMouseDown}
            onCellMouseEnter={handleCellMouseEnter}
            onCellRightClick={handleCellRightClick}
          />

          {/* Right Panel - Entry Confirmation / Analytics */}
          <RightPanel
            selectedTask={selectedTask}
            pendingCells={pendingCells}
            clearMode={clearMode}
            tasks={tasks}
            timeDistribution={timeDistribution}
            totalHours={totalHours}
            pieChartSegments={pieChartSegments}
            onConfirmEntry={confirmEntry}
            onConfirmClear={confirmClear}
            onCancelEntry={cancelEntry}
            onClearSelection={() => setPendingCells(new Set())}
          />
        </div>
      ) : currentPage === "analytics" ? (
        <AnalyticsPage
          tasks={tasks}
          cellData={cellData}
          timeDistribution={timeDistribution}
          totalHours={totalHours}
          pieChartSegments={pieChartSegments}
          weeklyData={weeklyData}
        />
      ) : currentPage === "goals" ? (
        <GoalsPage goals={goals} setGoals={setGoals} />
      ) : (
        <FriendsPage friends={friends} totalHours={totalHours} />
      )}

      {/* Legend Bar - Only on Matrix page */}
      {currentPage === "matrix" && (
        <LegendBar
          tasks={tasks}
          showUndo={showUndo}
          undoStack={undoStack}
          onUndo={undoLastRemoval}
        />
      )}

      <Footer selectedTask={selectedTask} totalHours={totalHours} yearDays={yearDays} />
    </div>
  );
}
