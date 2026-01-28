"use client";

import { PageType } from "../types";
import { USER_AVATAR_URL } from "../constants";

interface HeaderProps {
  currentPage: PageType;
  setCurrentPage: (page: PageType) => void;
}

export default function Header({ currentPage, setCurrentPage }: HeaderProps) {
  return (
    <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-[#233f48] px-6 py-3 sticky top-0 z-50" style={{ background: '#000' }}>
      <div className="flex items-center gap-8">
        <div className="flex items-center gap-3 text-primary">
          <div className="size-8 bg-primary/20 rounded-lg flex items-center justify-center">
            <span className="material-symbols-outlined text-primary">grid_view</span>
          </div>
          <h2 className="text-white text-xl font-bold leading-tight tracking-tight">Tessera</h2>
        </div>
        <nav className="hidden md:flex items-center gap-6">
          <button 
            onClick={() => setCurrentPage("matrix")}
            className={`text-sm font-medium pb-1 transition-colors ${currentPage === "matrix" ? "text-primary font-bold border-b-2 border-primary" : "text-[#92bbc9] hover:text-white"}`}
          >
            Matrix
          </button>
          <button 
            onClick={() => setCurrentPage("analytics")}
            className={`text-sm font-medium pb-1 transition-colors ${currentPage === "analytics" ? "text-primary font-bold border-b-2 border-primary" : "text-[#92bbc9] hover:text-white"}`}
          >
            Analytics
          </button>
          <button 
            onClick={() => setCurrentPage("goals")}
            className={`text-sm font-medium pb-1 transition-colors ${currentPage === "goals" ? "text-primary font-bold border-b-2 border-primary" : "text-[#92bbc9] hover:text-white"}`}
          >
            Goals
          </button>
          <button 
            onClick={() => setCurrentPage("friends")}
            className={`text-sm font-medium pb-1 transition-colors ${currentPage === "friends" ? "text-primary font-bold border-b-2 border-primary" : "text-[#92bbc9] hover:text-white"}`}
          >
            Friends
          </button>
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
          style={{ backgroundImage: `url("${USER_AVATAR_URL}")` }}
        />
      </div>
    </header>
  );
}
