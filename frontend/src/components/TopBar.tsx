import { useState, useEffect } from "react";
import { Search, Bell, ShieldAlert, Plus, User } from "lucide-react";
import { api } from "../lib/api";

export default function TopBar() {
  const [escalationsCount, setEscalationsCount] = useState(0);

  useEffect(() => {
    const fetchCount = async () => {
      try {
        const escalations = await api.getEscalations();
        setEscalationsCount(escalations.length);
      } catch (err) {
        console.error("Failed to fetch escalations count in TopBar", err);
      }
    };
    fetchCount();
    const interval = setInterval(fetchCount, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="fixed top-0 right-0 left-64 h-16 flex items-center justify-between px-6 z-40 bg-surface/80 backdrop-blur-md border-b border-border-default">
      <div className="flex items-center gap-4 flex-1 max-w-xl">
        <div className="relative w-full group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant group-focus-within:text-primary transition-colors" />
          <input
            className="w-full bg-surface-container-lowest border border-border-default text-on-surface py-2 pl-10 pr-4 focus:border-primary focus:ring-0 font-mono-log text-sm rounded outline-none transition-all placeholder:text-outline"
            placeholder="Search autonomous entities or logs... (CMD+K)"
            type="text"
          />
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-4 border-r border-border-default pr-6">
          <button className="relative text-on-surface-variant hover:text-primary transition-all duration-200 active:scale-95">
            <Bell className="w-5 h-5" />
            {escalationsCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-error text-on-error flex items-center justify-center rounded-full text-[9px] font-bold">
                {escalationsCount}
              </span>
            )}
          </button>
          <button className="text-on-surface-variant hover:text-primary transition-all duration-200 active:scale-95">
            <ShieldAlert className="w-5 h-5" />
          </button>
        </div>

        <button className="bg-primary text-on-primary px-4 py-2 rounded-sm font-label-title text-sm hover:opacity-90 active:scale-95 transition-all flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Deploy Agent
        </button>

        <div className="w-8 h-8 rounded-full border border-primary/30 p-0.5 ml-2 cursor-pointer">
          <div className="w-full h-full bg-surface-container-high rounded-full flex items-center justify-center overflow-hidden">
             <User className="text-outline w-5 h-5" />
          </div>
        </div>
      </div>
    </header>
  );
}
