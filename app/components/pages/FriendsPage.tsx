"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { USER_AVATAR_URL } from "../../constants";

export default function FriendsPage({ totalHours }: { totalHours?: number }) {
  const { user } = useAuth();
  const [friends, setFriends] = useState<any[]>([]);
  const [incoming, setIncoming] = useState<any[]>([]);
  const [outgoing, setOutgoing] = useState<any[]>([]);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [pendingRequests, setPendingRequests] = useState<Set<string>>(new Set());

  const fetchAll = async () => {
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      const getHeaders = token ? new Headers({ Authorization: `Bearer ${token}` }) : undefined;
      const res = await fetch('/api/friends', { headers: getHeaders });
      if (!res.ok) return;
      const json = await res.json();
      setFriends(json.friends || []);
      setIncoming(json.incoming || []);
      setOutgoing(json.outgoing || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (!user) return;
    fetchAll();
  }, [user]);

  const doSearch = async () => {
    if (!query.trim()) return setResults([]);
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      const headers = new Headers();
      headers.append('Content-Type', 'application/json');
      if (token) headers.append('Authorization', `Bearer ${token}`);
      const res = await fetch('/api/friends', {
        method: 'POST',
        headers,
        body: JSON.stringify({ action: 'search', query })
      });
      if (!res.ok) return;
      const json = await res.json();
      setResults(json.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const sendRequest = async (userId: string) => {
    if (!userId) return;
    setPendingRequests(prev => new Set(prev).add(String(userId)));
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      const headers = new Headers();
      headers.append('Content-Type', 'application/json');
      if (token) headers.append('Authorization', `Bearer ${token}`);
      const res = await fetch('/api/friends', {
        method: 'POST',
        headers,
        body: JSON.stringify({ action: 'request', addresseeId: userId })
      });
      if (!res.ok) return;
      await fetchAll();
    } catch (err) {
      console.error(err);
    } finally {
      setPendingRequests(prev => {
        const copy = new Set(prev);
        copy.delete(String(userId));
        return copy;
      });
      await fetchAll();
    }
  };

  const respond = async (friendshipId: string, status: 'accepted' | 'declined') => {
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      const headers = new Headers();
      headers.append('Content-Type', 'application/json');
      if (token) headers.append('Authorization', `Bearer ${token}`);
      const res = await fetch('/api/friends', {
        method: 'POST',
        headers,
        body: JSON.stringify({ action: 'respond', friendshipId, status })
      });
      if (!res.ok) return;
      await fetchAll();
    } catch (err) {
      console.error(err);
    }
  };

  // Leaderboard composition
  const leaderboard = [
    ...friends.map(f => ({ name: f.name, hours: f.hoursThisWeek || 0, isUser: false, avatar: f.avatar || USER_AVATAR_URL })),
    { name: 'You', hours: Math.round((totalHours || 0) / 52), isUser: true, avatar: USER_AVATAR_URL }
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
                  key={entry.name + i}
                  className={`flex items-center gap-4 p-3 rounded-xl ${entry.isUser ? 'bg-primary/20 border border-primary/30' : ''}`}
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

          {/* Friends List and Search */}
          <div className="glass-panel p-6 rounded-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white">Friends</h3>
              <div className="flex items-center gap-2">
                <input className="bg-[#0f1b1e] px-3 py-2 rounded-md text-sm text-white" placeholder="Search by email" value={query} onChange={e => setQuery(e.target.value)} />
                <button className="text-sm text-primary hover:underline" onClick={doSearch}>Search</button>
              </div>
            </div>

            <div className="mb-4">
              <h4 className="text-sm text-[#92bbc9] mb-2">Search Results</h4>
              <div className="space-y-2">
                {results.map(r => {
                  const uid = r._id || r.id || r.email;
                  const isSelf = user && (String(user.id) === String(uid) || String(user.email) === String(r.email));
                  const alreadyFriend = friends.some(f => String(f.id) === String(uid));
                  const alreadyOutgoing = outgoing.some(o => String(o.addressee_id) === String(uid));
                  const isPending = pendingRequests.has(String(uid));
                  return (
                    <div key={uid} className="flex items-center justify-between p-2 rounded-md bg-[#071617]/20">
                      <div>
                        <p className="text-white font-medium">{r.full_name || r.email}</p>
                        <p className="text-xs text-[#92bbc9]">{r.email}</p>
                      </div>
                      <div>
                        <button
                          type="button"
                          className="text-sm text-primary"
                          onClick={() => sendRequest(String(uid))}
                          disabled={isSelf || alreadyFriend || alreadyOutgoing || isPending}
                        >
                          {isSelf ? 'You' : alreadyFriend ? 'Friends' : alreadyOutgoing ? 'Requested' : isPending ? 'Sending...' : 'Send Request'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="mb-4">
              <h4 className="text-sm text-[#92bbc9] mb-2">Incoming Requests</h4>
              <div className="space-y-2">
                {incoming.map(req => (
                  <div key={req._id} className="flex items-center justify-between p-2 rounded-md bg-[#071617]/20">
                    <div>
                      <p className="text-white font-medium">{req.user?.full_name || req.user?.email || 'Unknown'}</p>
                      <p className="text-xs text-[#92bbc9]">Requested by</p>
                    </div>
                    <div className="flex gap-2">
                      <button className="text-sm text-primary" onClick={() => respond(req._id, 'accepted')}>Accept</button>
                      <button className="text-sm text-[#92bbc9]" onClick={() => respond(req._id, 'declined')}>Decline</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-sm text-[#92bbc9] mb-2">Your Friends</h4>
              <div className="space-y-3">
                {friends.map((friend) => (
                  <div 
                    key={friend.id}
                    className="flex items-center gap-4 p-3 rounded-xl hover:bg-[#233f48]/50 transition-colors"
                  >
                    <img src={friend.avatar || USER_AVATAR_URL} alt={friend.name} className="size-12 rounded-full border-2 border-[#233f48]" />
                    <div className="flex-1">
                      <p className="font-medium text-white">{friend.name}</p>
                      <p className="text-xs text-[#92bbc9]">Friend</p>
                    </div>
                    <div className="text-right flex flex-col items-end gap-2">
                      <div>
                        <p className="text-sm font-mono text-primary">{friend.hoursThisWeek || 0}h</p>
                        <p className="text-xs text-[#92bbc9]">this week</p>
                      </div>
                      <div>
                        <a href={`/friends/${friend.id}`} className="text-sm text-primary hover:underline">View Dashboard</a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
