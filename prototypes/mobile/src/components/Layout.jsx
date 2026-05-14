import { useState, useEffect } from "react";
import AppBar from "./AppBar";
import Sidebar from "./Sidebar";
import BottomNav from "./BottomNav";

export default function Layout({ children, title, onBack }) {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") setMenuOpen(false); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  return (
    <div className="min-h-screen bg-[#FDFDFC] flex flex-col">
      <AppBar title={title} onBack={onBack} onMenuOpen={() => setMenuOpen(true)} />
      <Sidebar open={menuOpen} onClose={() => setMenuOpen(false)} />
      <main className="flex-1 px-4 pb-24 pt-4 max-w-lg mx-auto w-full page-enter">
        {children}
      </main>
      <BottomNav />
    </div>
  );
}
