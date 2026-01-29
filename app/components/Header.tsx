"use client";

import { PageType } from "../types";
import { USER_AVATAR_URL, APP_NAME, LOGO_URL } from "../constants";
import { useAuth } from "../contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useState, useRef } from "react";

interface HeaderProps {
  currentPage: PageType;
  setCurrentPage: (page: PageType) => void;
}

export default function Header({ currentPage, setCurrentPage }: HeaderProps) {
  const { signOut } = useAuth();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    await signOut();
    router.replace('/auth');
  };

  const closeTimer = useRef<number | null>(null);

  const openMenu = () => {
    if (closeTimer.current) {
      window.clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
    setMenuOpen(true);
  };

  const closeMenu = () => {
    // delay closing slightly so quick mouse moves don't hide the menu
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => {
      setMenuOpen(false);
      closeTimer.current = null;
    }, 150);
  };
  return (
    <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-[#233f48] px-6 py-3 sticky top-0 z-50" style={{ background: '#000' }}>
      <div className="flex items-center gap-8">
        <div className="flex items-center gap-3 text-primary">
          <img src={LOGO_URL} alt={APP_NAME} className="size-8 rounded-lg object-cover" />
          <h2 className="text-white text-xl font-bold leading-tight tracking-tight">{APP_NAME}</h2>
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
        <div className="relative" onMouseEnter={openMenu} onMouseLeave={closeMenu}>
          <div
            className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 border-2 border-primary/30 cursor-pointer"
            style={{ backgroundImage: `url("${USER_AVATAR_URL}")` }}
            onClick={() => setMenuOpen(v => !v)}
          />

          {/* Hover/menu - stays open while hovered because of mouse events on wrapper */}
          <div className={`absolute right-0 mt-2 w-40 bg-[#081016] border border-[#233f48] rounded shadow-lg transition-opacity ${menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
            <button
              onClick={handleLogout}
              className="w-full text-left px-3 py-2 text-sm text-[#92bbc9] hover:bg-primary/10"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
