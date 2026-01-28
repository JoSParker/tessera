"use client";

import { Friend } from "../../types";
import { USER_AVATAR_URL } from "../../constants";

interface FriendsPageProps {
  friends: Friend[];
  totalHours: number;
}

export default function FriendsPage({ friends, totalHours }: FriendsPageProps) {
  // Create leaderboard with user included
  const leaderboard = [
    ...friends.map(f => ({ name: f.name, hours: f.hoursThisWeek, isUser: false, avatar: f.avatar })),
    { name: "You", hours: Math.round(totalHours / 52), isUser: true, avatar: USER_AVATAR_URL }
  ].sort((a, b) => b.hours - a.hours);

  return (
    <main className="flex-1 overflow-auto p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-black text-white tracking-tight">Friends</h1>
          <p className="text-[#92bbc9] text-sm mt-1">Compare and compete with friends</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Leaderboard */}
          <div className="glass-panel p-6 rounded-2xl">
            <h3 className="text-lg font-bold text-white mb-6">Weekly Leaderboard</h3>
            <div className="space-y-3">
              {leaderboard.map((entry, i) => (
                <div 
                  key={entry.name}
                  className={`flex items-center gap-4 p-3 rounded-xl ${
                    entry.isUser ? 'bg-primary/20 border border-primary/30' : ''
                  }`}
                >
                  <div className={`size-8 rounded-full flex items-center justify-center font-bold ${
                    i === 0 ? 'bg-amber-500 text-black' :
                    i === 1 ? 'bg-gray-400 text-black' :
                    i === 2 ? 'bg-amber-700 text-white' :
                    'bg-[#233f48] text-[#92bbc9]'
                  }`}>
                    {i + 1}
                  </div>
                  <img 
                    src={entry.avatar} 
                    alt={entry.name}
                    className="size-10 rounded-full border-2 border-[#233f48]"
                  />
                  <span className={`flex-1 font-medium ${entry.isUser ? 'text-primary' : 'text-white'}`}>
                    {entry.name}
                  </span>
                  <span className="font-mono text-[#92bbc9]">{entry.hours}h</span>
                </div>
              ))}
            </div>
          </div>

          {/* Friends List */}
          <div className="glass-panel p-6 rounded-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-white">Friends</h3>
              <button className="text-sm text-primary hover:underline">+ Add Friend</button>
            </div>
            <div className="space-y-4">
              {friends.map((friend) => (
                <div 
                  key={friend.id}
                  className="flex items-center gap-4 p-3 rounded-xl hover:bg-[#233f48]/50 transition-colors"
                >
                  <div className="relative">
                    <img 
                      src={friend.avatar} 
                      alt={friend.name}
                      className="size-12 rounded-full border-2 border-[#233f48]"
                    />
                    <div className={`absolute -bottom-1 -right-1 size-4 rounded-full border-2 border-[#101d22] ${
                      friend.status === 'online' ? 'bg-emerald-500' :
                      friend.status === 'away' ? 'bg-amber-500' : 'bg-gray-500'
                    }`} />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-white">{friend.name}</p>
                    <p className="text-xs text-[#92bbc9]">
                      {friend.status === 'online' ? 'Online now' :
                       friend.status === 'away' ? 'Away' : 'Offline'}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-mono text-primary">{friend.hoursThisWeek}h</p>
                    <p className="text-xs text-[#92bbc9]">this week</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
