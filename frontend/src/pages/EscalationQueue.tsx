import { useState, useEffect } from "react";
import { Filter, AlertCircle, Search, Link as LinkIcon, Timer, UserSearch, Cpu, ChevronRight, Check, Terminal } from "lucide-react";
import { api } from "../lib/api";

export default function EscalationQueue() {
  const [escalations, setEscalations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchEscalations = async () => {
    try {
      const data = await api.getEscalations();
      setEscalations(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEscalations();
    const interval = setInterval(fetchEscalations, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleResolve = async (id: number, status: "Approved" | "Dismissed") => {
    try {
      await api.resolveEscalation(id, status);
      fetchEscalations();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="p-8 text-on-surface">Loading escalations...</div>;

  return (
    <div className="p-8 max-w-7xl mx-auto h-full overflow-y-auto">
      <section className="mb-10 flex justify-between items-end">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <span className="w-2 h-2 rounded-full bg-accent-warning animate-pulse"></span>
            <h2 className="font-headline-md text-3xl text-on-surface font-bold">Escalation Queue</h2>
          </div>
          <p className="text-on-surface-variant font-body-main mt-2">Intervention required for <span className="text-primary font-bold">{escalations.length} pending</span> anomalies across Zeta-Net.</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-3 py-1.5 border border-border-default rounded-sm text-on-surface-variant hover:bg-surface-container-high transition-colors">
            <Filter className="w-4 h-4" />
            <span className="text-xs font-label-title">Filters</span>
          </button>
        </div>
      </section>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {escalations.length === 0 ? (
          <div className="bg-bg-primary/30 border border-dashed border-border-default rounded-sm flex flex-col items-center justify-center p-8 text-center opacity-60 col-span-2">
            <Check className="text-secondary w-8 h-8 mb-4" />
            <h4 className="font-label-title font-semibold text-on-surface-variant mb-1">All clear</h4>
            <p className="text-xs text-outline max-w-[200px]">No pending escalations in queue.</p>
          </div>
        ) : escalations.map(esc => (
          <div key={esc.id} className="group bg-surface-container border border-accent-warning/40 rounded-sm p-6 relative shadow-lg">
            <div className="absolute top-0 right-0 p-3">
              <span className="flex items-center gap-1 bg-accent-warning/10 text-accent-warning px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest border border-accent-warning/20">
                {esc.severity_level} ESCALATION
              </span>
            </div>
            <div className="flex gap-5">
              <div className="flex-shrink-0">
                <div className="w-14 h-14 rounded-sm bg-bg-primary border border-border-default flex items-center justify-center relative">
                  <AlertCircle className="text-accent-warning w-8 h-8" />
                </div>
              </div>
              <div className="flex-1">
                <div className="mb-4">
                  <h3 className="text-primary font-headline-md text-xl font-bold tracking-tight mb-1 mt-6">{esc.context_summary}</h3>
                  <p className="text-on-surface-variant text-sm flex items-center gap-2">
                    <span className="font-mono-log text-xs">ID: {esc.id}</span>
                    <span className="w-1 h-1 rounded-full bg-outline"></span>
                    <span>Created: {new Date(esc.created_at).toLocaleTimeString()}</span>
                  </p>
                </div>
                
                <div className="bg-bg-primary/50 border-l-2 border-primary p-4 mb-6">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-2">
                      <Cpu className="text-primary w-3 h-3" />
                      <span className="text-primary font-label-title text-xs font-semibold">Agent Recommendation</span>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-[10px] text-on-surface-variant uppercase font-bold tracking-wider">Confidence</span>
                      <span className="text-tertiary font-mono-log font-bold text-lg">{esc.confidence_score}</span>
                    </div>
                  </div>
                  <p className="text-on-surface text-sm mb-4 leading-relaxed">{esc.recommendation}</p>
                </div>

                <div className="flex gap-3">
                  <button onClick={() => handleResolve(esc.id, "Approved")} className="flex-1 bg-primary text-on-primary py-2.5 font-label-title text-sm font-semibold rounded-sm hover:opacity-90 active:scale-95 transition-all">
                    Approve
                  </button>
                  <button onClick={() => handleResolve(esc.id, "Dismissed")} className="px-6 border border-border-default text-on-surface-variant font-label-title text-sm rounded-sm hover:border-accent-danger hover:text-accent-danger transition-all">
                    Dismiss
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
