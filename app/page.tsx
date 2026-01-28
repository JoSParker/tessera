"use client";

import { useEffect, useRef } from "react";

export default function Home() {
  const matrixContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const matrixContainer = matrixContainerRef.current;
    if (!matrixContainer) return;

    // Clear any existing generated rows first
    const existingRows = matrixContainer.querySelectorAll('.generated-row');
    existingRows.forEach(row => row.remove());

    for (let i = 4; i <= 20; i++) {
      const row = document.createElement("div");
      row.className = "matrix-grid group generated-row";
      let cells = `<div class="text-xs text-[#92bbc9] flex items-center h-8 font-medium">JAN ${i
        .toString()
        .padStart(2, "0")}</div>`;
      for (let j = 0; j < 24; j++) {
        let style = "bg-glass border border-[#233f48]/30";
        if (j < 7 || j > 21) style = "bg-rest/20 border border-rest/10";
        cells += `<div class="h-8 rounded-sm ${style}"></div>`;
      }
      row.innerHTML = cells;
      matrixContainer.appendChild(row);
    }
  }, []);

  return (
    <div className="dark bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-white min-h-screen flex flex-col">
      {/* Top Navigation Bar */}
      <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-[#233f48] px-6 py-3 bg-obsidian/80 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-3 text-primary">
            <div className="size-8 bg-primary/20 rounded-lg flex items-center justify-center">
              <span className="material-symbols-outlined text-primary">grid_view</span>
            </div>
            <h2 className="text-white text-xl font-bold leading-tight tracking-tight">ChronosMatrix</h2>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <a className="text-primary text-sm font-bold border-b-2 border-primary pb-1" href="#">Matrix</a>
            <a className="text-[#92bbc9] hover:text-white transition-colors text-sm font-medium" href="#">Analytics</a>
            <a className="text-[#92bbc9] hover:text-white transition-colors text-sm font-medium" href="#">Goals</a>
            <a className="text-[#92bbc9] hover:text-white transition-colors text-sm font-medium" href="#">Vault</a>
          </nav>
        </div>
        <div className="flex flex-1 justify-end gap-4 items-center">
          <label className="hidden lg:flex items-center min-w-40 h-10 max-w-64 relative">
            <span className="material-symbols-outlined absolute left-3 text-[#92bbc9] text-xl">search</span>
            <input className="w-full h-full rounded-xl text-white border-none bg-[#233f48]/50 focus:ring-1 focus:ring-primary pl-10 pr-4 text-sm font-normal" placeholder="Search entries..." />
          </label>
          <div className="flex gap-2">
            <button className="flex items-center justify-center rounded-full size-10 bg-[#233f48] text-white hover:bg-primary/20 transition-all">
              <span className="material-symbols-outlined text-xl">notifications</span>
            </button>
            <button className="flex items-center justify-center rounded-full size-10 bg-[#233f48] text-white hover:bg-primary/20 transition-all">
              <span className="material-symbols-outlined text-xl">settings</span>
            </button>
          </div>
          <div
            className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 border-2 border-primary/30"
            style={{
              backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuDsQL-QGR_YHUwVB9uWyDy915x5dfjd3r1BPcFG2tnWaZbT_vl0Qwg5stFQeVUiE91HQTM9pKf29XNLMKoymeOj9RlyEp5oPAvEORxE2VKyXXvPOj2NV0PuyyUXMy5aD9eBi-8U3yrQ5vAvpJb5m-pf_BBw5ziNiI8oriMD9U1CHGybuXMtnbt2DCtqJWnrKpn-XCQnIaXviSiuFlJeO3tilrEfvR8VJJZx7XBEb7bO72MLxC45rba_d0HDO_BPDs94C9CzzMPZEwY")`
            }}
          />
        </div>
      </header>

      <main className="flex flex-1 overflow-hidden">
        {/* Left Side Bar */}
        <aside className="w-16 lg:w-64 border-r border-[#233f48] bg-obsidian p-4 hidden md:flex flex-col justify-between">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <p className="text-[10px] uppercase tracking-widest text-[#92bbc9] font-bold px-3">Main View</p>
              <div className="flex items-center gap-3 px-3 py-3 rounded-xl bg-primary/10 text-primary border border-primary/20">
                <span className="material-symbols-outlined">calendar_today</span>
                <p className="text-sm font-bold hidden lg:block">Yearly Matrix</p>
              </div>
              <div className="flex items-center gap-3 px-3 py-3 rounded-xl text-[#92bbc9] hover:bg-[#233f48]/30 hover:text-white transition-all">
                <span className="material-symbols-outlined">leaderboard</span>
                <p className="text-sm font-medium hidden lg:block">Trend Analysis</p>
              </div>
              <div className="flex items-center gap-3 px-3 py-3 rounded-xl text-[#92bbc9] hover:bg-[#233f48]/30 hover:text-white transition-all">
                <span className="material-symbols-outlined">schedule</span>
                <p className="text-sm font-medium hidden lg:block">Schedule</p>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <p className="text-[10px] uppercase tracking-widest text-[#92bbc9] font-bold px-3">Shortcuts</p>
              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between px-3 py-2 text-xs text-[#92bbc9]">
                  <span className="hidden lg:block">Deep Work</span>
                  <span className="bg-[#233f48] px-1.5 py-0.5 rounded text-white font-mono">1</span>
                </div>
                <div className="flex items-center justify-between px-3 py-2 text-xs text-[#92bbc9]">
                  <span className="hidden lg:block">Meetings</span>
                  <span className="bg-[#233f48] px-1.5 py-0.5 rounded text-white font-mono">2</span>
                </div>
                <div className="flex items-center justify-between px-3 py-2 text-xs text-[#92bbc9]">
                  <span className="hidden lg:block">Learning</span>
                  <span className="bg-[#233f48] px-1.5 py-0.5 rounded text-white font-mono">3</span>
                </div>
              </div>
            </div>
          </div>
          <div className="glass-panel p-4 rounded-xl hidden lg:block">
            <p className="text-xs text-primary font-bold mb-1">PRO PLAN</p>
            <p className="text-xs text-white mb-3">Syncing across 4 devices</p>
            <div className="w-full bg-[#233f48] h-1.5 rounded-full overflow-hidden">
              <div className="bg-primary h-full w-3/4"></div>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <section className="flex-1 flex flex-col bg-background-dark overflow-hidden">
          {/* Header Section */}
          <div className="p-6 flex flex-wrap justify-between items-end gap-4">
            <div>
              <h1 className="text-3xl font-black text-white tracking-tight">Yearly Time Matrix <span className="text-primary">2024</span></h1>
              <p className="text-[#92bbc9] text-sm mt-1">Painting your 8,760 hours. Use keys 1-9 to categorize cells.</p>
            </div>
            <div className="flex gap-3">
              <div className="flex bg-obsidian rounded-xl p-1 border border-[#233f48]">
                <button className="px-4 py-1.5 rounded-lg bg-[#233f48] text-white text-xs font-bold">Grid</button>
                <button className="px-4 py-1.5 rounded-lg text-[#92bbc9] text-xs font-bold">Heatmap</button>
              </div>
              <button className="flex items-center gap-2 bg-primary px-4 py-2 rounded-xl text-white text-sm font-bold shadow-lg shadow-primary/20">
                <span className="material-symbols-outlined text-sm">download</span>
                Export Matrix
              </button>
            </div>
          </div>

          {/* Matrix Scrollable Area */}
          <div className="flex-1 overflow-auto px-6 pb-6">
            {/* Time Labels */}
            <div className="matrix-grid mb-2 sticky top-0 bg-background-dark z-10 py-2 border-b border-[#233f48]">
              <div className="text-[10px] text-[#92bbc9] font-bold uppercase tracking-wider flex items-end">DATE</div>
              {/* Hour labels 00-23 */}
              <div className="text-[10px] text-center text-[#92bbc9] font-mono">00</div>
              <div className="text-[10px] text-center text-[#92bbc9] font-mono">01</div>
              <div className="text-[10px] text-center text-[#92bbc9] font-mono">02</div>
              <div className="text-[10px] text-center text-[#92bbc9] font-mono">03</div>
              <div className="text-[10px] text-center text-[#92bbc9] font-mono">04</div>
              <div className="text-[10px] text-center text-[#92bbc9] font-mono">05</div>
              <div className="text-[10px] text-center text-[#92bbc9] font-mono">06</div>
              <div className="text-[10px] text-center text-[#92bbc9] font-mono">07</div>
              <div className="text-[10px] text-center text-[#92bbc9] font-mono">08</div>
              <div className="text-[10px] text-center text-[#92bbc9] font-mono">09</div>
              <div className="text-[10px] text-center text-primary font-mono font-bold">10</div>
              <div className="text-[10px] text-center text-[#92bbc9] font-mono">11</div>
              <div className="text-[10px] text-center text-[#92bbc9] font-mono">12</div>
              <div className="text-[10px] text-center text-[#92bbc9] font-mono">13</div>
              <div className="text-[10px] text-center text-[#92bbc9] font-mono">14</div>
              <div className="text-[10px] text-center text-[#92bbc9] font-mono">15</div>
              <div className="text-[10px] text-center text-[#92bbc9] font-mono">16</div>
              <div className="text-[10px] text-center text-[#92bbc9] font-mono">17</div>
              <div className="text-[10px] text-center text-[#92bbc9] font-mono">18</div>
              <div className="text-[10px] text-center text-[#92bbc9] font-mono">19</div>
              <div className="text-[10px] text-center text-[#92bbc9] font-mono">20</div>
              <div className="text-[10px] text-center text-[#92bbc9] font-mono">21</div>
              <div className="text-[10px] text-center text-[#92bbc9] font-mono">22</div>
              <div className="text-[10px] text-center text-[#92bbc9] font-mono">23</div>
            </div>

            {/* Matrix Rows */}
            <div className="flex flex-col gap-[2px]" ref={matrixContainerRef}>
              {/* Row 1: Jan 1 */}
              <div className="matrix-grid group">
                <div className="text-xs text-[#92bbc9] flex items-center h-8 font-medium">JAN 01</div>
                <div className="h-8 rounded-sm bg-rest/40 border border-rest/20 cell-glow-orange"></div>
                <div className="h-8 rounded-sm bg-rest/40 border border-rest/20 cell-glow-orange"></div>
                <div className="h-8 rounded-sm bg-rest/40 border border-rest/20 cell-glow-orange"></div>
                <div className="h-8 rounded-sm bg-rest/40 border border-rest/20 cell-glow-orange"></div>
                <div className="h-8 rounded-sm bg-rest/40 border border-rest/20 cell-glow-orange"></div>
                <div className="h-8 rounded-sm bg-rest/40 border border-rest/20 cell-glow-orange"></div>
                <div className="h-8 rounded-sm bg-rest/20 border border-rest/10"></div>
                <div className="h-8 rounded-sm bg-learning/60 border border-learning/30 cell-glow-green"></div>
                <div className="h-8 rounded-sm bg-primary/80 border border-primary cell-glow-blue"></div>
                <div className="h-8 rounded-sm bg-primary/80 border border-primary cell-glow-blue"></div>
                <div className="h-8 rounded-sm bg-primary/80 border border-primary cell-glow-blue"></div>
                <div className="h-8 rounded-sm bg-primary/80 border border-primary cell-glow-blue"></div>
                <div className="h-8 rounded-sm bg-meetings/50 border border-meetings/20 cell-glow-purple"></div>
                <div className="h-8 rounded-sm bg-meetings/50 border border-meetings/20 cell-glow-purple"></div>
                <div className="h-8 rounded-sm bg-primary/80 border border-primary cell-glow-blue"></div>
                <div className="h-8 rounded-sm bg-primary/80 border border-primary cell-glow-blue"></div>
                <div className="h-8 rounded-sm bg-learning/40 border border-learning/20"></div>
                <div className="h-8 rounded-sm bg-glass border border-[#233f48]/30"></div>
                <div className="h-8 rounded-sm bg-glass border border-[#233f48]/30"></div>
                <div className="h-8 rounded-sm bg-creative/60 border border-creative/30"></div>
                <div className="h-8 rounded-sm bg-creative/60 border border-creative/30"></div>
                <div className="h-8 rounded-sm bg-rest/40 border border-rest/20"></div>
                <div className="h-8 rounded-sm bg-rest/40 border border-rest/20"></div>
                <div className="h-8 rounded-sm bg-rest/40 border border-rest/20"></div>
              </div>

              {/* Row 2: Jan 2 */}
              <div className="matrix-grid group">
                <div className="text-xs text-[#92bbc9] flex items-center h-8 font-medium">JAN 02</div>
                <div className="h-8 rounded-sm bg-rest/40 border border-rest/20"></div>
                <div className="h-8 rounded-sm bg-rest/40 border border-rest/20"></div>
                <div className="h-8 rounded-sm bg-rest/40 border border-rest/20"></div>
                <div className="h-8 rounded-sm bg-rest/40 border border-rest/20"></div>
                <div className="h-8 rounded-sm bg-rest/40 border border-rest/20"></div>
                <div className="h-8 rounded-sm bg-rest/40 border border-rest/20"></div>
                <div className="h-8 rounded-sm bg-glass border border-[#233f48]/30"></div>
                <div className="h-8 rounded-sm bg-learning/60 border border-learning/30 cell-glow-green"></div>
                <div className="h-8 rounded-sm bg-primary/80 border border-primary cell-glow-blue"></div>
                <div className="h-8 rounded-sm bg-primary/80 border border-primary cell-glow-blue"></div>
                <div className="h-8 rounded-sm bg-primary/80 border border-primary cell-glow-blue"></div>
                <div className="h-8 rounded-sm bg-primary/80 border border-primary cell-glow-blue"></div>
                <div className="h-8 rounded-sm bg-glass border border-[#233f48]/30"></div>
                <div className="h-8 rounded-sm bg-glass border border-[#233f48]/30"></div>
                <div className="h-8 rounded-sm bg-primary/80 border border-primary cell-glow-blue"></div>
                <div className="h-8 rounded-sm bg-primary/80 border border-primary cell-glow-blue"></div>
                <div className="h-8 rounded-sm bg-primary/80 border border-primary cell-glow-blue"></div>
                <div className="h-8 rounded-sm bg-meetings/50 border border-meetings/20 cell-glow-purple"></div>
                <div className="h-8 rounded-sm bg-meetings/50 border border-meetings/20 cell-glow-purple"></div>
                <div className="h-8 rounded-sm bg-rest/40 border border-rest/20"></div>
                <div className="h-8 rounded-sm bg-rest/40 border border-rest/20"></div>
                <div className="h-8 rounded-sm bg-rest/40 border border-rest/20"></div>
                <div className="h-8 rounded-sm bg-rest/40 border border-rest/20"></div>
                <div className="h-8 rounded-sm bg-rest/40 border border-rest/20"></div>
              </div>

              {/* Row 3: Jan 3 (Active Selection Mockup) */}
              <div className="matrix-grid group">
                <div className="text-xs text-primary flex items-center h-8 font-bold">JAN 03</div>
                <div className="h-8 rounded-sm bg-rest/40 border border-rest/20"></div>
                <div className="h-8 rounded-sm bg-rest/40 border border-rest/20"></div>
                <div className="h-8 rounded-sm bg-rest/40 border border-rest/20"></div>
                <div className="h-8 rounded-sm bg-rest/40 border border-rest/20"></div>
                <div className="h-8 rounded-sm bg-rest/40 border border-rest/20"></div>
                <div className="h-8 rounded-sm bg-rest/40 border border-rest/20"></div>
                <div className="h-8 rounded-sm bg-glass border border-primary ring-1 ring-primary/50 relative">
                  <div className="absolute inset-0 flex items-center justify-center text-[10px] font-mono text-white">4</div>
                </div>
                <div className="h-8 rounded-sm bg-glass border border-primary/20 hover:border-primary transition-all cursor-crosshair"></div>
                <div className="h-8 rounded-sm bg-glass border border-primary/20 hover:border-primary transition-all cursor-crosshair"></div>
                <div className="h-8 rounded-sm bg-glass border border-primary/20 hover:border-primary transition-all cursor-crosshair"></div>
                <div className="h-8 rounded-sm bg-glass border border-primary/20 hover:border-primary transition-all cursor-crosshair"></div>
                <div className="h-8 rounded-sm bg-glass border border-primary/20 hover:border-primary transition-all cursor-crosshair"></div>
                <div className="h-8 rounded-sm bg-glass border border-primary/20 hover:border-primary transition-all cursor-crosshair"></div>
                <div className="h-8 rounded-sm bg-glass border border-primary/20 hover:border-primary transition-all cursor-crosshair"></div>
                <div className="h-8 rounded-sm bg-glass border border-primary/20 hover:border-primary transition-all cursor-crosshair"></div>
                <div className="h-8 rounded-sm bg-glass border border-primary/20 hover:border-primary transition-all cursor-crosshair"></div>
                <div className="h-8 rounded-sm bg-glass border border-primary/20 hover:border-primary transition-all cursor-crosshair"></div>
                <div className="h-8 rounded-sm bg-glass border border-primary/20 hover:border-primary transition-all cursor-crosshair"></div>
                <div className="h-8 rounded-sm bg-glass border border-primary/20 hover:border-primary transition-all cursor-crosshair"></div>
                <div className="h-8 rounded-sm bg-glass border border-primary/20 hover:border-primary transition-all cursor-crosshair"></div>
                <div className="h-8 rounded-sm bg-glass border border-primary/20 hover:border-primary transition-all cursor-crosshair"></div>
                <div className="h-8 rounded-sm bg-glass border border-primary/20 hover:border-primary transition-all cursor-crosshair"></div>
                <div className="h-8 rounded-sm bg-glass border border-primary/20 hover:border-primary transition-all cursor-crosshair"></div>
                <div className="h-8 rounded-sm bg-glass border border-primary/20 hover:border-primary transition-all cursor-crosshair"></div>
              </div>
            </div>
          </div>

          {/* Bottom Floating Legend */}
          <div className="p-4 bg-obsidian/90 backdrop-blur-lg border-t border-[#233f48] flex items-center gap-6 overflow-x-auto">
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-xs font-bold text-[#92bbc9] uppercase">Legend:</span>
            </div>
            <div className="flex gap-4">
              <div className="flex items-center gap-2">
                <div className="size-3 rounded-full bg-deep-work shadow-[0_0_8px_#13b6ec]"></div>
                <span className="text-xs text-white">1: Deep Work</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="size-3 rounded-full bg-meetings shadow-[0_0_8px_#a855f7]"></div>
                <span className="text-xs text-white">2: Meetings</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="size-3 rounded-full bg-learning shadow-[0_0_8px_#10b981]"></div>
                <span className="text-xs text-white">3: Learning</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="size-3 rounded-full bg-rest shadow-[0_0_8px_#f59e0b]"></div>
                <span className="text-xs text-white">4: Rest</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="size-3 rounded-full bg-creative shadow-[0_0_8px_#ec4899]"></div>
                <span className="text-xs text-white">5: Creative</span>
              </div>
            </div>
          </div>
        </section>

        {/* Right Side Analysis Panel */}
        <aside className="w-80 border-l border-[#233f48] bg-obsidian p-6 hidden xl:flex flex-col gap-8">
          <div className="flex flex-col gap-1">
            <h3 className="text-xl font-bold text-white tracking-tight">Time Distribution</h3>
            <p className="text-sm text-[#92bbc9]">Visualizing current week output</p>
          </div>

          {/* Glowing Donut Chart Placeholder */}
          <div className="relative size-56 mx-auto flex items-center justify-center">
            {/* SVG Chart Mockup */}
            <svg className="size-full -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" fill="transparent" r="40" stroke="#233f48" strokeWidth="12"></circle>
              <circle className="drop-shadow-[0_0_6px_rgba(19,182,236,0.8)]" cx="50" cy="50" fill="transparent" r="40" stroke="#13b6ec" strokeDasharray="120 251.2" strokeLinecap="round" strokeWidth="12"></circle>
              <circle className="drop-shadow-[0_0_6px_rgba(168,85,247,0.8)]" cx="50" cy="50" fill="transparent" r="40" stroke="#a855f7" strokeDasharray="60 251.2" strokeDashoffset="-120" strokeLinecap="round" strokeWidth="12"></circle>
              <circle className="drop-shadow-[0_0_6px_rgba(16,185,129,0.8)]" cx="50" cy="50" fill="transparent" r="40" stroke="#10b981" strokeDasharray="40 251.2" strokeDashoffset="-180" strokeLinecap="round" strokeWidth="12"></circle>
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-3xl font-black text-white">68%</span>
              <span className="text-[10px] uppercase font-bold text-[#92bbc9]">Focus Rank</span>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between p-3 rounded-xl bg-[#233f48]/20 border border-[#233f48]/50">
              <div className="flex items-center gap-3">
                <div className="size-2 rounded-full bg-primary"></div>
                <span className="text-sm text-white font-medium">Deep Work</span>
              </div>
              <span className="text-sm font-mono text-primary font-bold">42.5h</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-[#233f48]/20 border border-[#233f48]/50">
              <div className="flex items-center gap-3">
                <div className="size-2 rounded-full bg-purple-500"></div>
                <span className="text-sm text-white font-medium">Meetings</span>
              </div>
              <span className="text-sm font-mono text-purple-400 font-bold">18.2h</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-[#233f48]/20 border border-[#233f48]/50">
              <div className="flex items-center gap-3">
                <div className="size-2 rounded-full bg-emerald-500"></div>
                <span className="text-sm text-white font-medium">Learning</span>
              </div>
              <span className="text-sm font-mono text-emerald-400 font-bold">12.0h</span>
            </div>
          </div>

          <div className="mt-auto glass-panel p-4 rounded-2xl">
            <div className="flex items-center gap-2 mb-3">
              <span className="material-symbols-outlined text-primary">auto_awesome</span>
              <p className="text-sm font-bold text-white">Matrix Insights</p>
            </div>
            <p className="text-xs text-[#92bbc9] leading-relaxed">
              Your focus peaks between <span className="text-white font-bold">09:00 - 11:30</span>. Consider scheduling your most difficult tasks during this window tomorrow.
            </p>
          </div>
        </aside>
      </main>

      {/* Footer Status */}
      <footer className="bg-obsidian border-t border-[#233f48] px-6 py-2 flex items-center justify-between text-[10px] text-[#92bbc9] uppercase font-bold tracking-widest">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1"><span className="size-1.5 rounded-full bg-primary animate-pulse"></span> System Ready</span>
          <span className="hidden sm:block">Total logged: 1,420 Hours</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="hidden sm:block">Shortcut: Press [?] for help</span>
          <span>V 1.0.4-OBSIDIAN</span>
        </div>
      </footer>
    </div>
  );
}
