import { useState, useEffect } from "react";
import { Filter, History, MoreHorizontal, Code, Clock, CheckCircle2, Activity } from "lucide-react";
import { cn } from "../lib/utils";
import { api } from "../lib/api";

export default function Pipeline() {
  const [candidates, setCandidates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await api.getCandidates();
        setCandidates(data);
      } catch (error) {
        console.error("Failed to load candidates", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
    const interval = setInterval(loadData, 5000);
    return () => clearInterval(interval);
  }, []);

  const stages = ["Sourced", "Screening", "Shortlisted", "Interview", "Offer"];

  const columns = stages.map(stage => ({
    title: stage,
    count: candidates.filter(c => c.status === stage).length,
    items: candidates.filter(c => c.status === stage).map(c => ({
      name: c.name,
      match: `${c.score}% Fit`,
      badgeColor: c.score >= 90 ? "text-tertiary bg-tertiary/10" : "text-on-surface-variant bg-surface-container-high",
      tagIcon: c.score >= 90 ? "✦" : <Code className="w-3 h-3"/>,
      tag: c.recommendation_reason ? c.recommendation_reason.substring(0, 25) + "..." : "Processing...",
      tagColor: c.score >= 90 ? "text-primary" : "text-on-surface-variant",
      tags: c.skills ? c.skills.split(",").slice(0, 2).map((s: string) => s.trim()) : [],
      time: new Date(c.updated_at || c.created_at).toLocaleDateString(),
      activeBorder: c.status === "Shortlisted",
      glow: c.status === "Screening",
      fullProgress: c.status === "Offer",
      shadow: c.status === "Offer"
    }))
  }));

  const avgAccuracy = candidates.length 
    ? (candidates.reduce((acc, c) => acc + c.score, 0) / candidates.length).toFixed(1) 
    : "0.0";

  if (loading && candidates.length === 0) return <div className="p-8 text-on-surface">Loading pipeline...</div>;

  return (
    <div className="p-8 h-full flex flex-col relative">
      <div className="mb-8 flex justify-between items-end">
        <div>
          <div className="flex items-center gap-2 mb-1 text-primary font-mono-log text-xs tracking-widest uppercase">
            <span>System Operational</span>
            <div className="w-2 h-2 rounded-full bg-tertiary animate-pulse-glow"></div>
          </div>
          <h2 className="font-headline-md text-3xl text-on-surface tracking-tight font-bold">Recruiting Pipeline</h2>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 border border-border-default rounded-sm text-on-surface-variant hover:bg-surface-container transition-colors font-label-title text-sm">
            <Filter className="w-4 h-4" /> Filter Specs
          </button>
          <button className="flex items-center gap-2 px-4 py-2 border border-border-default rounded-sm text-on-surface-variant hover:bg-surface-container transition-colors font-label-title text-sm">
            <History className="w-4 h-4" /> Activity Log
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-x-auto custom-scrollbar px-6 pb-36 pt-2">
        <div className="grid grid-cols-5 gap-6 h-[calc(100vh-320px)] min-w-[1200px]">
          {columns.map((col, i) => (
            <div key={i} className="flex flex-col gap-4 h-full">
            <div className="flex items-center justify-between px-2 pb-2 border-b border-border-default">
              <div className="flex items-center gap-2">
                <span className="font-label-title text-sm text-on-surface font-semibold">{col.title}</span>
                <span className="font-mono-log text-xs text-outline-variant bg-surface-container-high px-2 py-0.5 rounded">{col.count}</span>
              </div>
              <button className="text-outline hover:text-on-surface"><MoreHorizontal className="w-4 h-4"/></button>
            </div>
            
            <div className="flex-1 space-y-3 overflow-y-auto custom-scrollbar pr-2 pb-20">
              {col.items.map((item, j) => (
                <div key={j} className={cn(
                  "bg-surface-container-low border p-4 transition-all cursor-grab active:cursor-grabbing group rounded-sm relative",
                  item.activeBorder ? "border-primary/50 border-2" : "border-border-default hover:border-primary/50",
                  item.shadow && "bg-surface-container-highest border-tertiary shadow-lg shadow-tertiary/10"
                )}>
                  {item.glow && <div className="absolute top-0 right-0 w-1 h-full bg-secondary animate-pulse-glow opacity-50"></div>}
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="font-label-title text-base text-on-surface group-hover:text-primary transition-colors">{item.name}</h4>
                    <span className={`font-mono-log font-bold text-[10px] px-1.5 py-0.5 rounded ${item.badgeColor}`}>{item.match}</span>
                  </div>
                  
                  <div className={cn("flex items-center gap-2 mb-4")}>
                    {typeof item.tagIcon === 'string' ? <span className="text-primary text-sm">{item.tagIcon}</span> : item.tagIcon}
                    <span className="font-caption text-xs text-on-surface-variant truncate" title={item.tag}>{item.tag}</span>
                  </div>

                  {item.fullProgress && (
                     <div className="h-1.5 w-full bg-surface-container rounded-full overflow-hidden mt-4">
                       <div className="h-full bg-tertiary w-full"></div>
                     </div>
                  )}

                   {item.tags && item.tags.length > 0 && (
                      <div className="flex gap-1 flex-wrap">
                        {item.tags.map((tag: string, tid: number) => (
                          <span key={tid} className="bg-primary/10 text-primary text-[9px] px-1 py-0.5 rounded uppercase font-mono-log">{tag}</span>
                        ))}
                      </div>
                   )}

                  {(item.time) && !item.fullProgress && (
                    <div className="flex items-center justify-between mt-2">
                       <div className="w-5 h-5 rounded-full bg-surface-container border border-bg-primary overflow-hidden flex items-center justify-center">
                         <Activity className="w-3 h-3 text-primary"/>
                       </div>
                       {item.time && <span className="font-mono-log text-[10px] text-outline">{item.time}</span>}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>

      <div className="absolute bottom-8 left-8 right-8 border border-border-default bg-surface-container-low p-4 rounded-sm flex flex-col pointer-events-none z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
             <Activity className="text-primary w-5 h-5" />
             <h3 className="font-label-title font-semibold text-on-surface">Pipeline Health</h3>
          </div>
          <div className="text-[10px] font-mono-log text-outline uppercase tracking-wider">Live Analysis Stream</div>
        </div>
        <div className="grid grid-cols-4 gap-8">
           <div className="space-y-1">
              <p className="text-xs text-on-surface-variant font-label-title">Avg. Time to Hire</p>
              <p className="font-headline-md text-2xl font-bold text-primary">12.4 Days</p>
           </div>
           <div className="space-y-1">
              <p className="text-xs text-on-surface-variant font-label-title">Active Candidates</p>
              <p className="font-headline-md text-2xl font-bold text-tertiary">{candidates.length}</p>
           </div>
           <div className="space-y-1">
              <p className="text-xs text-on-surface-variant font-label-title">Agent Accuracy</p>
              <p className="font-headline-md text-2xl font-bold text-on-surface">{avgAccuracy}%</p>
           </div>
           <div className="space-y-1">
              <p className="text-xs text-on-surface-variant font-label-title">Shortlisted %</p>
              <p className="font-headline-md text-2xl font-bold text-on-surface">{candidates.length ? Math.round((candidates.filter(c => c.status === "Shortlisted" || c.status === "Interview" || c.status === "Offer").length / candidates.length) * 100) : 0}%</p>
           </div>
        </div>
      </div>
      
      <div className="fixed bottom-0 right-0 p-8 opacity-5 pointer-events-none select-none z-0">
          <div className="font-mono-log text-[120px] leading-none font-bold tracking-tighter mix-blend-overlay">ZETA-RECRUIT</div>
      </div>
    </div>
  );
}
