import { Filter, AlertCircle, Search, Link as LinkIcon, Timer, UserSearch, Cpu, ChevronRight, Check } from "lucide-react";

export default function EscalationQueue() {
  return (
    <div className="p-8 max-w-7xl mx-auto h-full overflow-y-auto">
      <section className="mb-10 flex justify-between items-end">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <span className="w-2 h-2 rounded-full bg-accent-warning animate-pulse"></span>
            <h2 className="font-headline-md text-3xl text-on-surface font-bold">Escalation Queue</h2>
          </div>
          <p className="text-on-surface-variant font-body-main mt-2">Intervention required for <span className="text-primary font-bold">3 pending</span> anomalies across Zeta-Net.</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex bg-surface-container-low border border-border-default rounded-sm p-1">
            <button className="px-3 py-1 bg-surface-container-highest text-on-surface text-xs font-label-title rounded">All Tasks</button>
            <button className="px-3 py-1 text-on-surface-variant hover:text-on-surface text-xs font-label-title transition-colors rounded">Critical</button>
            <button className="px-3 py-1 text-on-surface-variant hover:text-on-surface text-xs font-label-title transition-colors rounded">Waitlisted</button>
          </div>
          <button className="flex items-center gap-2 px-3 py-1.5 border border-border-default rounded-sm text-on-surface-variant hover:bg-surface-container-high transition-colors">
            <Filter className="w-4 h-4" />
            <span className="text-xs font-label-title">Filters</span>
          </button>
        </div>
      </section>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* CARD 1: HARD ESCALATION */}
        <div className="group bg-surface-container border border-accent-warning/40 rounded-sm p-6 relative overflow-hidden animate-amber-pulse shadow-lg">
          <div className="absolute top-0 right-0 p-3">
            <span className="flex items-center gap-1 bg-accent-warning/10 text-accent-warning px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest border border-accent-warning/20">
              CRITICAL INTERVENTION
            </span>
          </div>
          <div className="flex gap-5">
            <div className="flex-shrink-0">
              <div className="w-14 h-14 rounded-sm bg-bg-primary border border-border-default flex items-center justify-center relative">
                <AlertCircle className="text-accent-warning w-8 h-8" />
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-accent-warning rounded-full border-2 border-surface-container flex items-center justify-center text-on-secondary">
                  <span className="font-bold text-[10px]">!</span>
                </div>
              </div>
            </div>
            <div className="flex-1">
              <div className="mb-4">
                <h3 className="text-primary font-headline-md text-xl font-bold tracking-tight mb-1 mt-6">PAYROLL MISMATCH — John Davidson</h3>
                <p className="text-on-surface-variant text-sm flex items-center gap-2">
                  <span className="font-mono-log text-xs">ID: PAY-8842-AX</span>
                  <span className="w-1 h-1 rounded-full bg-outline"></span>
                  <span>Reported by: Payroll-Sentinel Agent</span>
                </p>
              </div>
              
              <div className="bg-bg-primary/50 border-l-2 border-primary p-4 mb-6">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center">
                       <Cpu className="text-primary w-3 h-3" />
                    </div>
                    <span className="text-primary font-label-title text-xs font-semibold">Agent Recommendation</span>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-[10px] text-on-surface-variant uppercase font-bold tracking-wider">Confidence Score</span>
                    <span className="text-tertiary font-mono-log font-bold text-lg">0.91</span>
                  </div>
                </div>
                <p className="text-on-surface text-sm mb-4 leading-relaxed">
                  System detected a $1,240 variance against regional tax ledger. Recommended course: <span className="bg-primary/10 text-primary px-1 rounded">Route to Senior Compliance</span> for secondary audit before batch release.
                </p>
                <div className="flex gap-3">
                  <a className="text-xs text-primary underline underline-offset-4 hover:text-on-surface transition-colors flex items-center gap-1" href="#">
                    <LinkIcon className="w-3 h-3" /> Audit Log
                  </a>
                  <a className="text-xs text-primary underline underline-offset-4 hover:text-on-surface transition-colors flex items-center gap-1" href="#">
                    <LinkIcon className="w-3 h-3" /> Ledger Comparison
                  </a>
                </div>
              </div>

              <div className="flex gap-3">
                <button className="flex-1 bg-primary text-on-primary py-2.5 font-label-title text-sm font-semibold rounded-sm hover:opacity-90 active:scale-95 transition-all">
                  Approve & Route
                </button>
                <button className="px-6 border border-border-default text-on-surface-variant font-label-title text-sm rounded-sm hover:border-accent-danger hover:text-accent-danger transition-all">
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* CARD 2: SOFT ESCALATION */}
        <div className="group bg-surface-container border border-border-default rounded-sm p-6 relative hover:border-primary/50 transition-colors">
          <div className="absolute top-0 right-0 p-3">
            <span className="flex items-center gap-1 bg-surface-container-highest text-on-surface-variant px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest border border-border-default">
              SOFT ESCALATION
            </span>
          </div>
          <div className="flex gap-5">
            <div className="flex-shrink-0">
              <div className="w-14 h-14 rounded-full border border-border-default overflow-hidden relative p-0.5 bg-gradient-to-tr from-secondary/40 to-primary/40">
                <div className="w-full h-full bg-bg-primary rounded-full flex items-center justify-center">
                   <UserSearch className="text-on-surface w-6 h-6"/>
                </div>
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-secondary-container rounded-full border-2 border-surface-container flex items-center justify-center">
                  <Search className="text-on-secondary-container w-3 h-3" />
                </div>
              </div>
            </div>
            <div className="flex-1">
              <div className="mb-4">
                <h3 className="text-on-surface font-headline-md text-xl font-bold tracking-tight mb-1 mt-6">UNUSUAL CANDIDATE — Maya Patel</h3>
                <p className="text-on-surface-variant text-sm flex items-center gap-2">
                  <span className="font-mono-log text-xs">Role: Lead Systems Architect</span>
                  <span className="w-1 h-1 rounded-full bg-outline"></span>
                  <span>Agent: Talent-Scout v4</span>
                </p>
              </div>
              
              <div className="bg-surface-container-low border border-border-default rounded-sm p-4 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2 text-on-surface-variant">
                    <Timer className="w-4 h-4" />
                    <span className="text-xs font-label-title">Auto-proceeds in <span className="text-on-surface font-mono-log">3h 28m</span></span>
                  </div>
                  <div className="w-24 h-1 bg-bg-primary rounded-full overflow-hidden">
                    <div className="h-full bg-secondary-container w-[70%]"></div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-on-surface-variant">Profile Match</span>
                    <span className="text-on-surface font-bold">94%</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-on-surface-variant">Cultural Alignment</span>
                    <span className="text-on-surface font-bold">High (Agent Inference)</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <button className="flex-1 bg-surface-container-highest border border-border-default text-on-surface py-2 font-label-title text-sm rounded-sm hover:bg-secondary-container/30 hover:border-secondary transition-all">
                  Approve Shortlist
                </button>
                <button className="px-4 border border-border-default text-on-surface-variant py-2 font-label-title text-sm rounded-sm hover:border-accent-danger hover:text-accent-danger transition-all">
                  Reject
                </button>
                <button className="px-4 border border-border-default text-primary py-2 font-label-title text-sm rounded-sm hover:bg-primary/10 transition-all flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Review Resume
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* CARD 3: SYSTEM ALERT */}
        <div className="group bg-surface-container border border-border-default rounded-sm p-6 relative hover:border-primary/50 transition-colors">
          <div className="absolute top-0 right-0 p-3">
            <span className="flex items-center gap-1 bg-surface-container-highest text-on-surface-variant px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest border border-border-default">
              SYSTEM ALERT
            </span>
          </div>
          <div className="flex gap-5">
            <div className="flex-shrink-0">
              <div className="w-14 h-14 rounded-sm bg-bg-primary border border-border-default flex items-center justify-center relative">
                <Cpu className="text-primary w-8 h-8" />
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-primary rounded-full border-2 border-surface-container flex items-center justify-center">
                  <AlertCircle className="text-on-primary w-3 h-3" />
                </div>
              </div>
            </div>
            <div className="flex-1">
              <div className="mb-4">
                <h3 className="text-on-surface font-headline-md text-xl font-bold tracking-tight mb-1 mt-6">NODE OVERLOAD — North-East Cluster</h3>
                <p className="text-on-surface-variant text-sm flex items-center gap-2">
                  <span className="font-mono-log text-xs">RESOURCE: GPU-V100-FARM</span>
                  <span className="w-1 h-1 rounded-full bg-outline"></span>
                  <span>Impact: High Latency</span>
                </p>
              </div>
              
              <div className="p-4 bg-error-container/10 border border-error/20 rounded-sm mb-6">
                <p className="text-error text-sm italic">"Autonomous balancing failed 3 times. Human oversight requested to manually re-route non-critical tasks to Backup-Sector-B."</p>
              </div>

              <div className="flex gap-3">
                <button className="flex-1 bg-surface-container-highest border border-border-default text-on-surface py-2.5 font-label-title text-sm rounded-sm hover:border-primary transition-all">
                  Initialize Re-route
                </button>
                <button className="px-6 border border-border-default text-on-surface-variant font-label-title text-sm rounded-sm hover:bg-surface-container-high transition-all">
                  Ignore
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* CARD 4: EMPTY SLOT */}
        <div className="bg-bg-primary/30 border border-dashed border-border-default rounded-sm flex flex-col items-center justify-center p-8 text-center opacity-60">
          <div className="w-12 h-12 rounded-full bg-surface-container flex items-center justify-center mb-4">
            <Filter className="text-outline w-5 h-5" />
          </div>
          <h4 className="font-label-title font-semibold text-on-surface-variant mb-1">Predictive Queue</h4>
          <p className="text-xs text-outline max-w-[200px]">ZETA is monitoring 4 potential drifts. No immediate action required.</p>
        </div>
      </div>

      <section className="mt-12 border-t border-border-default pt-8 pb-12">
        <h3 className="font-headline-md text-lg text-on-surface font-bold mb-6 flex items-center gap-2">
          <Terminal className="text-primary w-5 h-5"/>
          Intervention Audit Trail
        </h3>
        <div className="space-y-4 max-h-64 overflow-y-auto custom-scrollbar pr-4">
           <div className="flex gap-4 items-start">
             <span className="font-mono-log text-[11px] text-outline mt-1 shrink-0">14:22:01</span>
             <div className="w-2 h-2 rounded-full bg-tertiary mt-2"></div>
             <div className="bg-surface-container-low border border-border-default p-3 rounded-sm flex-1">
                <p className="font-mono-log text-sm text-on-surface-variant">
                   <span className="text-tertiary">USER_ACTION:</span> Approved [PROVISION_OVERRIDE] for project 'Aether'.
                </p>
             </div>
           </div>
           
           <div className="flex gap-4 items-start">
             <span className="font-mono-log text-[11px] text-outline mt-1 shrink-0">14:18:45</span>
             <div className="w-2 h-2 rounded-full bg-primary mt-2"></div>
             <div className="bg-surface-container-low border border-border-default p-3 rounded-sm flex-1">
                <p className="font-mono-log text-sm text-on-surface-variant">
                   <span className="text-primary">SYSTEM:</span> Escalation Queue refreshed. 2 new anomalies detected in [PAYROLL_MONITOR].
                </p>
             </div>
           </div>

           <div className="flex gap-4 items-start">
             <span className="font-mono-log text-[11px] text-outline mt-1 shrink-0">13:55:12</span>
             <div className="w-2 h-2 rounded-full bg-outline mt-2"></div>
             <div className="bg-surface-container-low border border-border-default p-3 rounded-sm flex-1">
                <p className="font-mono-log text-sm text-on-surface-variant">
                   <span className="text-on-surface">AGENT_04:</span> Auto-resolved soft-escalation [BENEFITS_OPT_IN] after 4h timeout.
                </p>
             </div>
           </div>
        </div>
      </section>

      <div className="fixed bottom-6 left-[280px] text-outline text-[10px] font-mono-log uppercase tracking-widest bg-background/80 px-2 py-1 border border-border-default rounded-sm backdrop-blur-sm z-50">
        [TAB] Navigate • [ENTER] Resolve • [ESC] Dismiss
      </div>
    </div>
  );
}
