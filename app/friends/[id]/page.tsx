"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import AnalyticsPage from "../../components/pages/AnalyticsPage";

export default function FriendDashboardPage() {
  const params = useParams();
  const id = params?.id as string | undefined;
  const router = useRouter();
  const [data, setData] = useState<any | null>(null);

  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
        const res = await fetch(`/api/friends/${id}`, { headers: token ? { Authorization: `Bearer ${token}` } : undefined });
        if (res.status === 403) {
          alert('You must be friends to view this dashboard');
          router.back();
          return;
        }
        if (!res.ok) throw new Error('Failed to load');
        const json = await res.json();
        setData(json);
      } catch (err) {
        console.error(err);
      }
    })();
  }, [id]);

  if (!data) return <div className="min-h-screen flex items-center justify-center bg-obsidian"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"/></div>;

  return (
    <AnalyticsPage
      tasks={data.tasks}
      cellData={data.cellData}
      timeDistribution={data.timeDistribution}
      totalHours={data.totalHours}
      pieChartSegments={data.pieChartSegments}
      weeklyData={data.weeklyData}
    />
  );
}
