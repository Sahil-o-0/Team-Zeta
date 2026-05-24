import { Users, CheckCircle2, AlertTriangle, Network, MoreVertical, Terminal } from "lucide-react";

export default function CommandCenter() {
  const agents = [
    { name: "Talent Scout", desc: "Sourcing across LinkedIn & Github", status: "Active Journey", subStatus: "4s latency", iconColor: "text-primary" },
    { name: "Screening", desc: "Analyzing technical assessments", status: "Processing Batch 92", subStatus: "12ms response", iconColor: "text-secondary" },
    { name: "Scheduling", desc: "No active invites pending", status: "Idle", subStatus: "Ready", iconColor: "text-on-surface-variant", dim: true },
    { name: "Interview", desc: "Conducting Tier-1 Screening", status: "In Call: ID-882", subStatus: "Live Transcript", iconColor: "text-tertiary" },
    { name: "Onboarding", desc: "Verifying compliance docs", status: "Queue: 12 New", subStatus: "Auto-verify active", iconColor: "text-primary" },
  ];

  const logs = [
    { time: "14:22:01", source: "TALENT_SCOUT", msg: "Sourced 3 candidates from LinkedIn (Role: Sr. Eng)", color: "text-primary" },
    { time: "14:21:45", source: "SCREENING", msg: "Completed technical review for candidate #8812", color: "text-secondary" },
    { time: "14:20:12", source: "POLICY", msg: "System state changed to IDLE", color: "text-tertiary", highlight: "IDLE" },
    { time: "14:18:50", source: "COMMAND_CENTER", msg: "Auto-deploying additional screening instances...", color: "text-primary", bg: true },
    { time: "14:15:22", source: "ESCALATION_QUEUE", msg: "Flag: Candidate #771 conflict in background check", color: "text-error" },
    { time: "14:12:09", source: "ONBOARDING", msg: "Documents verified for employee 'Sarah Jenkins'", color: "text-on-secondary-container" },
    { time: "14:10:01", source: "TALENT_SCOUT", msg: "Scanning internal database for referrals", color: "text-primary" },
    { time: "14:08:44", source: "SYSTEM", msg: "Memory kernel optimized. 1.2GB reclaimed.", color: "text-on-surface" },
    { time: "14:05:00", source: "CRON_JOB", msg: "Daily summary report generated.", color: "text-on-surface-variant", dim: true },
  ];

  return (
    <div className="p-6 grid grid-cols-12 gap-6 h-full">
      {/* SECTION 1: Metrics Overview */}
      <div className="col-span-12 grid grid-cols-3 gap-6">
        <div className="bg-surface border border-border-default p-5 flex flex-col justify-between hover:border-border-active transition-colors group rounded-sm">
          <div className="flex justify-between items-start">
            <span className="text-on-surface-variant font-label-title text-sm">Candidates Sourced</span>
            <Users className="text-primary w-5 h-5 group-hover:scale-110 transition-transform" />
          </div>
          <div className="mt-4">
            <div className="flex items-end gap-2">
              <span className="font-headline-md text-4xl leading-none text-on-surface">47</span>
              <span className="text-tertiary font-label-title text-sm mb-1">+23%</span>
            </div>
            <div className="w-full h-1 bg-surface-container mt-4 overflow-hidden rounded-full">
              <div className="h-full bg-primary w-[70%]"></div>
            </div>
          </div>
        </div>

        <div className="bg-surface border border-border-default p-5 flex flex-col justify-between hover:border-border-active transition-colors group rounded-sm">
          <div className="flex justify-between items-start">
            <span className="text-on-surface-variant font-label-title text-sm">Tasks Completed</span>
            <CheckCircle2 className="text-secondary w-5 h-5 group-hover:scale-110 transition-transform" />
          </div>
          <div className="mt-4">
            <div className="flex items-end gap-2">
              <span className="font-headline-md text-4xl leading-none text-on-surface">312</span>
              <span className="text-on-surface-variant font-caption text-xs mb-1">98.7% auto</span>
            </div>
            <div className="w-full h-1 bg-surface-container mt-4 overflow-hidden rounded-full">
              <div className="h-full bg-secondary w-[98.7%]"></div>
            </div>
          </div>
        </div>

        <div className="bg-surface border border-border-default p-5 flex flex-col justify-between hover:border-border-active transition-colors group rounded-sm">
          <div className="flex justify-between items-start">
            <span className="text-on-surface-variant font-label-title text-sm">Escalations Pending</span>
            <AlertTriangle className="text-error w-5 h-5 group-hover:scale-110 transition-transform" />
          </div>
          <div className="mt-4">
            <div className="flex items-end gap-2">
              <span className="font-headline-md text-4xl leading-none text-on-surface">3</span>
              <span className="text-error font-label-title text-sm mb-1">Critical</span>
            </div>
            <div className="w-full h-1 bg-surface-container mt-4 overflow-hidden rounded-full">
              <div className="h-full bg-error w-[10%]"></div>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 2: Agent Network Status */}
      <section className="col-span-8 flex flex-col gap-4">
        <div className="bg-surface border border-border-default h-full rounded-sm">
          <div className="p-4 border-b border-border-default flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Network className="text-primary w-5 h-5" />
              <h3 className="font-label-title text-sm uppercase tracking-wider text-on-surface-variant">Agent Network Status</h3>
            </div>
            <span className="text-tertiary font-mono-log text-xs">System Healthy</span>
          </div>
          <div className="divide-y divide-border-default">
            {agents.map((agent, i) => (
              <div key={i} className={`p-4 flex items-center justify-between hover:bg-surface-container-low transition-colors group ${agent.dim ? "opacity-60" : ""}`}>
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="w-10 h-10 rounded bg-surface-container-high border border-border-default flex items-center justify-center">
                       <Network className={`w-5 h-5 ${agent.iconColor}`} />
                    </div>
                    {!agent.dim && <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-tertiary rounded-full border-2 border-surface animate-pulse-blue"></div>}
                  </div>
                  <div>
                    <h4 className="font-label-title text-sm text-on-surface">{agent.name}</h4>
                    <p className="text-on-surface-variant font-caption text-xs">{agent.desc}</p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <div className="text-on-surface font-mono-log text-sm">{agent.status}</div>
                    <div className="text-on-surface-variant font-caption text-xs">{agent.subStatus}</div>
                  </div>
                  <MoreVertical className="text-on-surface-variant cursor-pointer hover:text-primary w-5 h-5" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 3: Live Activity Feed */}
      <section className="col-span-4 flex flex-col gap-4">
        <div className="bg-surface border border-border-default h-full flex flex-col rounded-sm">
          <div className="p-4 border-b border-border-default flex items-center gap-2">
            <Terminal className="text-secondary w-5 h-5" />
            <h3 className="font-label-title text-sm uppercase tracking-wider text-on-surface-variant">Live Agent Activity</h3>
          </div>
          <div className="flex-1 overflow-y-auto p-4 custom-scrollbar space-y-4 font-mono-log text-xs">
            {logs.map((log, i) => (
              <div key={i} className={`flex gap-3 ${log.bg ? 'border-l-2 border-primary pl-3 bg-primary/5 py-2 -ml-4 pl-4' : ''} ${log.dim ? 'opacity-50' : ''}`}>
                <span className={`${log.bg ? 'text-primary' : 'text-on-surface-variant opacity-60'} shrink-0`}>{log.time}</span>
                <div className="flex flex-col">
                  <span className={`${log.color} font-bold`}>{log.source}</span>
                  <span className={log.color === 'text-error' ? 'text-error' : 'text-on-surface-variant'}>
                    {log.highlight ? (
                      <>
                        {log.msg.split(log.highlight)[0]}
                        <span className="bg-surface-container px-1 text-on-surface">{log.highlight}</span>
                        {log.msg.split(log.highlight)[1]}
                      </>
                    ) : (
                      log.msg
                    )}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <div className="p-3 bg-surface-container-lowest border-t border-border-default">
            <div className="flex items-center justify-between text-[10px] uppercase font-bold text-on-surface-variant">
              <span>Terminal v2.4.0-stable</span>
              <span className="flex items-center gap-1"><span className="w-1 h-1 bg-tertiary rounded-full"></span> Live Feed Active</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
