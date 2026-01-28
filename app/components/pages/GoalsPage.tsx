"use client";

import { GoalItem } from "../../types";
import { ACHIEVEMENTS } from "../../constants";

interface GoalsPageProps {
  goals: GoalItem[];
  setGoals: React.Dispatch<React.SetStateAction<GoalItem[]>>;
}

export default function GoalsPage({ goals, setGoals }: GoalsPageProps) {
  const toggleGoalComplete = (goalId: string) => {
    setGoals(prev => prev.map(g => 
      g.id === goalId ? { ...g, completed: !g.completed } : g
    ));
  };

  return (
    <main className="flex-1 overflow-auto p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-black text-white tracking-tight">Goals</h1>
          <p className="text-[#92bbc9] text-sm mt-1">Track your yearly objectives</p>
        </div>

        {/* Goals List */}
        <div className="glass-panel p-6 rounded-2xl mb-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-white">2025 Goals</h3>
            <span className="text-sm text-[#92bbc9]">
              {goals.filter(g => g.completed).length}/{goals.length} completed
            </span>
          </div>
          <div className="space-y-4">
            {goals.map((goal) => (
              <div 
                key={goal.id}
                className={`flex items-center gap-4 p-4 rounded-xl border transition-all cursor-pointer ${
                  goal.completed 
                    ? 'border-emerald-500/30 bg-emerald-500/10' 
                    : 'border-[#233f48] hover:border-primary/30'
                }`}
                onClick={() => toggleGoalComplete(goal.id)}
              >
                <div className={`size-6 rounded-full border-2 flex items-center justify-center transition-all ${
                  goal.completed 
                    ? 'border-emerald-500 bg-emerald-500' 
                    : 'border-[#92bbc9]'
                }`}>
                  {goal.completed && (
                    <span className="material-symbols-outlined text-white text-sm">check</span>
                  )}
                </div>
                <div className="flex-1">
                  <p className={`font-medium ${goal.completed ? 'text-emerald-400 line-through' : 'text-white'}`}>
                    {goal.title}
                  </p>
                  <p className="text-xs text-[#92bbc9] mt-1">{goal.category}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-mono text-primary">{goal.progress}%</p>
                  <div className="w-24 h-1.5 bg-[#233f48] rounded-full mt-1">
                    <div 
                      className="h-full rounded-full bg-primary"
                      style={{ width: `${goal.progress}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Achievements */}
        <div className="glass-panel p-6 rounded-2xl">
          <h3 className="text-lg font-bold text-white mb-6">Achievements</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {ACHIEVEMENTS.map((achievement) => (
              <div 
                key={achievement.id}
                className={`p-4 rounded-xl border text-center transition-all ${
                  achievement.unlocked 
                    ? 'border-amber-500/30 bg-amber-500/10' 
                    : 'border-[#233f48] opacity-50'
                }`}
              >
                <div className={`text-4xl mb-2 ${achievement.unlocked ? '' : 'grayscale'}`}>
                  {achievement.icon}
                </div>
                <p className={`text-sm font-medium ${achievement.unlocked ? 'text-white' : 'text-[#92bbc9]'}`}>
                  {achievement.name}
                </p>
                <p className="text-xs text-[#92bbc9] mt-1">{achievement.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
