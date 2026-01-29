"use client";

import { Task, CellData, PieChartSegment } from "../../types";

interface AnalyticsPageProps {
  tasks: Task[];
  cellData: CellData;
  timeDistribution: { [taskId: string]: number };
  totalHours: number;
  pieChartSegments: PieChartSegment[];
  weeklyData: { week: string; hours: number }[];
}

export default function AnalyticsPage({
  tasks,
  cellData,
  timeDistribution,
  totalHours,
  pieChartSegments,
  weeklyData,
}: AnalyticsPageProps) {
  const daysActive = new Set(Object.keys(cellData).map(k => k.split('-')[0])).size;
  const dailyAverage = (totalHours / Math.max(1, daysActive)).toFixed(1);
  const deepWorkRatio = totalHours > 0 ? Math.round((timeDistribution["deep-work"] || 0) / totalHours * 100) : 0;

  return (
    <main className="flex-1 overflow-auto p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-black text-white tracking-tight">Analytics</h1>
          <p className="text-[#92bbc9] text-sm mt-1">Deep insights into your time allocation</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          <div className="glass-panel p-6 rounded-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="size-10 bg-primary/20 rounded-xl flex items-center justify-center">
                <span className="material-symbols-outlined text-primary">schedule</span>
              </div>
              <p className="text-[#92bbc9] text-sm">Total Hours</p>
            </div>
            <p className="text-4xl font-black text-white">{totalHours}</p>
            <p className="text-xs text-[#92bbc9] mt-1">hours logged</p>
          </div>

          

          <div className="glass-panel p-6 rounded-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="size-10 bg-purple-500/20 rounded-xl flex items-center justify-center">
                <span className="material-symbols-outlined text-purple-500">calendar_month</span>
              </div>
              <p className="text-[#92bbc9] text-sm">Days Active</p>
            </div>
            <p className="text-4xl font-black text-white">{daysActive}</p>
            <p className="text-xs text-[#92bbc9] mt-1">out of 366 days</p>
          </div>

          {/* Daily Average removed as requested */}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Pie Chart */}
          <div className="glass-panel p-6 rounded-2xl">
            <h3 className="text-lg font-bold text-white mb-6">Time Distribution</h3>
            <div className="flex items-center gap-8">
              <div className="relative size-48 flex items-center justify-center">
                <svg className="size-full -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" fill="transparent" r="40" stroke="#233f48" strokeWidth="10"></circle>
                  {pieChartSegments.map((segment) => (
                    <circle
                      key={segment.task.id}
                      cx="50"
                      cy="50"
                      fill="transparent"
                      r="40"
                      stroke={segment.task.color}
                      strokeWidth="10"
                      strokeDasharray={`${segment.dashArray} ${2 * Math.PI * 40}`}
                      strokeDashoffset={segment.dashOffset}
                      strokeLinecap="butt"
                      style={{ filter: `drop-shadow(0 0 6px ${segment.task.color}80)` }}
                    />
                  ))}
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className="text-2xl font-black text-white">{totalHours}h</span>
                </div>
              </div>
              <div className="flex flex-col gap-3 flex-1">
                {tasks
                  .slice()
                  .sort((a, b) => (timeDistribution[b.id] || 0) - (timeDistribution[a.id] || 0))
                  .map((task) => {
                    const hours = timeDistribution[task.id] || 0;
                    const percent = totalHours > 0 ? Math.round((hours / totalHours) * 100) : 0;
                    return (
                      <div key={task.id} className="flex items-center gap-3">
                        <div 
                          className="size-3 rounded-full"
                          style={{ backgroundColor: task.color }}
                        />
                        <span className="text-sm text-white flex-1">{task.name}</span>
                        <span className="text-sm font-mono text-[#92bbc9]">{hours}h ({percent}%)</span>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>

          {/* Weekly Bar Chart */}
          <div className="glass-panel p-6 rounded-2xl">
            <h3 className="text-lg font-bold text-white mb-6">Weekly Activity</h3>
            <div className="flex items-end gap-1 h-48">
              {weeklyData.slice(0, 26).map((week, i) => {
                const maxHours = Math.max(...weeklyData.map(w => w.hours), 1);
                const height = (week.hours / maxHours) * 100;
                return (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <div 
                      className="w-full bg-primary/60 rounded-t-sm transition-all hover:bg-primary"
                      style={{ height: `${Math.max(height, 2)}%` }}
                    />
                    {i % 4 === 0 && (
                      <span className="text-[8px] text-[#92bbc9]">{week.week}</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Task Breakdown */}
        <div className="glass-panel p-6 rounded-2xl">
          <h3 className="text-lg font-bold text-white mb-6">Task Breakdown</h3>
            <div className="space-y-4">
            {tasks
              .slice()
              .sort((a, b) => (timeDistribution[b.id] || 0) - (timeDistribution[a.id] || 0))
              .map((task) => {
                const hours = timeDistribution[task.id] || 0;
                const percent = totalHours > 0 ? (hours / totalHours) * 100 : 0;
                return (
                  <div key={task.id} className="flex items-center gap-4">
                    <div 
                      className="size-4 rounded-full shrink-0"
                      style={{ backgroundColor: task.color }}
                    />
                    <span className="text-sm text-white w-32">{task.name}</span>
                    <div className="flex-1 h-3 bg-[#233f48] rounded-full overflow-hidden">
                      <div 
                        className="h-full rounded-full transition-all"
                        style={{ width: `${percent}%`, backgroundColor: task.color }}
                      />
                    </div>
                    <span className="text-sm font-mono text-[#92bbc9] w-20 text-right">{hours}h</span>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </main>
  );
}
