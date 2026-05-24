import { TrendingUp, Verified, UserSearch, BrainCircuit, Calendar, Mic, FileText, Shield, ArrowRight, Filter, AlignJustify, Grip, Terminal } from "lucide-react";
import { cn } from "../lib/utils";

export default function AgentNetwork() {
  const stats = [
    { label: "Active Threads", value: "128", delta: "+12%", color: "text-tertiary", icon: TrendingUp },
    { label: "Network Load", value: "64.2%", progress: 64.2, color: "text-on-surface" },
    { label: "Avg Success Rate", value: "98.4%", color: "text-tertiary", icon: Verified },
    { label: "Memory Pressure", value: "14.8 GB", sub: "Stable", color: "text-on-surface" }
  ];

  const agents = [
    { name: "Talent Scout", role: "HR & Sourcing", status: "Running", icon: UserSearch, iconColor: "text-primary", bgCore: "bg-primary", statusColor: "text-primary", statusBg: "bg-primary-container/10 border-primary/20", tasks: "1,422", rate: "99.2%", time: "1.2s", activity: "Active: Scoping LinkedIn...", pulse: true },
    { name: "Screening AI", role: "Evaluation", status: "Learning", icon: BrainCircuit, iconColor: "text-secondary", bgCore: "bg-secondary", statusColor: "text-secondary", statusBg: "bg-secondary-container/10 border-secondary/20", tasks: "845", rate: "94.8%", time: "4.5s", activity: "Refining Resume Model..." },
    { name: "Scheduling Ops", role: "Logistics", status: "Idle", icon: Calendar, iconColor: "text-on-surface-variant", bgCore: "bg-outline-variant", statusColor: "text-on-surface-variant", statusBg: "bg-surface-container-highest border-outline-variant", tasks: "2,810", rate: "99.9%", time: "0.4s", activity: "Standby Mode" },
    { name: "Interview Bot", role: "Interaction", status: "Running", icon: Mic, iconColor: "text-primary", bgCore: "bg-primary", statusColor: "text-primary", statusBg: "bg-primary-container/10 border-primary/20", tasks: "42", rate: "91.5%", time: "1,800s", activity: "Active: 4 Live Calls...", pulse: true },
    { name: "Offer Engine", role: "Legal & Finance", status: "Running", icon: FileText, iconColor: "text-primary", bgCore: "bg-primary", statusColor: "text-primary", statusBg: "bg-primary-container/10 border-primary/20", tasks: "118", rate: "98.1%", time: "12.8s", activity: "Generating Equity Matrix...", pulse: true },
    { name: "Compliance Shield", role: "Security", status: "Running", icon: Shield, iconColor: "text-primary", bgCore: "bg-primary", statusColor: "text-primary", statusBg: "bg-primary-container/10 border-primary/20", tasks: "12,400+", rate: "100%", time: "0.1s", activity: "Scanning API Traffic...", pulse: true },
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto h-full overflow-y-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
        <div>
          <div className="flex items-center gap-2 text-primary font-mono-log text-xs uppercase tracking-widest mb-2">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse-glow"></span>
            Network Topology
          </div>
          <h2 className="font-headline-md text-3xl font-bold text-on-surface tracking-tight">Agent Network</h2>
          <p className="text-on-surface-variant font-body-main mt-1">Real-time supervision of 12 autonomous entities in the ZETA swarm.</p>
        </div>
        <div className="flex gap-3">
          <div className="bg-surface-container p-1 rounded-sm border border-border-default flex items-center">
            <button className="px-4 py-1.5 text-on-primary bg-primary-container rounded font-label-title text-sm transition-all flex items-center gap-2"><Grip className="w-4 h-4"/> Grid View</button>
            <button className="px-4 py-1.5 text-on-surface-variant hover:text-on-surface font-label-title text-sm transition-all flex items-center gap-2"><AlignJustify className="w-4 h-4"/> List View</button>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-surface-container border border-border-default rounded-sm text-on-surface font-label-title text-sm hover:bg-surface-container-high transition-colors">
            <Filter className="w-4 h-4" /> All Departments
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {stats.map((s, i) => (
          <div key={i} className="bg-surface-container border border-border-default p-4 rounded-xl">
            <p className="text-[11px] font-mono-log text-on-surface-variant uppercase tracking-widest">{s.label}</p>
            <div className="flex items-end justify-between mt-2">
              <h3 className={`font-headline-md text-2xl ${s.color}`}>{s.value}</h3>
              {s.icon && <s.icon className={`w-4 h-4 ${s.color} ${s.label === 'Avg Success Rate' ? 'opacity-50' : ''}`} />}
              {s.sub && <span className="text-on-surface-variant text-caption italic">{s.sub}</span>}
              {s.delta && <span className="text-tertiary text-xs flex items-center gap-1">{s.delta}</span>}
              {s.progress && (
                <div className="w-20 h-1 bg-surface-container-lowest rounded-full overflow-hidden mb-2">
                  <div className="h-full bg-primary" style={{ width: `${s.progress}%` }}></div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {agents.map((agent, i) => (
          <div key={i} className="group bg-surface-container border border-border-default rounded-xl overflow-hidden hover:border-primary/50 transition-all duration-300 flex flex-col">
            <div className="p-5 flex-1">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-surface-container-highest border border-border-default rounded-lg flex items-center justify-center relative overflow-hidden">
                    <agent.icon className={`w-7 h-7 ${agent.iconColor}`} />
                    {agent.pulse ? (
                      <div className="absolute bottom-1 right-1 w-2.5 h-2.5 bg-primary rounded-full animate-pulse-blue border-2 border-surface-container"></div>
                    ) : agent.status === 'Learning' ? (
                      <div className="absolute inset-0 flex items-center justify-center">
                         <div className="w-10 h-10 border-2 border-transparent border-t-secondary rounded-full animate-spin"></div>
                      </div>
                    ) : (
                      <div className="absolute bottom-1 right-1 w-2.5 h-2.5 bg-outline-variant rounded-full border-2 border-surface-container"></div>
                    )}
                  </div>
                  <div>
                    <h4 className={`font-label-title text-base text-on-surface group-hover:${agent.iconColor} transition-colors`}>{agent.name}</h4>
                    <p className="text-xs text-on-surface-variant">{agent.role}</p>
                  </div>
                </div>
                <div className={`px-2 py-0.5 rounded border ${agent.statusBg} ${agent.statusColor} font-mono-log font-bold text-[10px] uppercase`}>{agent.status}</div>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center px-3 py-2 bg-surface-container-lowest rounded border border-border-default">
                  <span className="text-xs text-on-surface-variant">Tasks Today</span>
                  <span className="font-mono-log text-on-surface">{agent.tasks}</span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-surface-container-low rounded border border-border-default">
                    <span className="text-[10px] text-on-surface-variant uppercase tracking-tighter">Success Rate</span>
                    <div className="text-sm font-medium text-tertiary mt-1">{agent.rate}</div>
                  </div>
                  <div className="p-3 bg-surface-container-low rounded border border-border-default">
                    <span className="text-[10px] text-on-surface-variant uppercase tracking-tighter">Avg Task Time</span>
                    <div className="text-sm font-medium text-on-surface mt-1">{agent.time}</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="px-5 py-3 bg-surface-container-high border-t border-border-default flex justify-between items-center">
              <span className="text-xs text-on-surface-variant font-mono-log italic">{agent.activity}</span>
              <button className={`${agent.statusColor} font-label-title text-xs flex items-center gap-1 group/btn hover:underline`}>
                View Details
                <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
              </button>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-8 bg-surface-container border border-border-default rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-headline-md text-lg text-on-surface flex items-center gap-2">
            <Terminal className="text-primary w-5 h-5"/>
            Global Activity Log
          </h3>
          <div className="flex items-center gap-4 text-xs font-mono-log text-on-surface-variant">
             <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-primary"></span> Info</span>
             <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-accent-warning"></span> Warn</span>
             <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-accent-danger"></span> Error</span>
          </div>
        </div>
        <div className="space-y-3 font-mono-log text-sm overflow-hidden h-[200px]">
           <div className="flex items-start gap-4 text-on-surface-variant border-l border-primary/30 pl-4 py-1">
              <span className="text-primary opacity-50 shrink-0">14:22:01.44</span>
              <span>[NETWORK] <span className="text-primary">Talent Scout</span> successfully parsed 42 GitHub repositories in cluster-west-1.</span>
           </div>
           <div className="flex items-start gap-4 text-on-surface-variant border-l border-primary/30 pl-4 py-1">
              <span className="text-primary opacity-50 shrink-0">14:22:04.12</span>
              <span>[LEARNING] <span className="text-secondary">Screening AI</span> weights updated for "Node.js Architect" persona. Loss: 0.0024.</span>
           </div>
           <div className="flex items-start gap-4 text-on-surface-variant border-l border-accent-warning/30 pl-4 py-1">
              <span className="text-accent-warning opacity-50 shrink-0">14:22:08.55</span>
              <span>[SCHEDULER] Rate-limit hit on Google Calendar API. Throttling requests for 60s.</span>
           </div>
           <div className="flex items-start gap-4 text-on-surface-variant border-l border-primary/30 pl-4 py-1">
              <span className="text-primary opacity-50 shrink-0">14:22:12.89</span>
              <span>[SECURITY] Identity verified for user <span className="text-on-surface">@j.smith</span>. Session hash validated.</span>
           </div>
           <div className="flex items-start gap-4 text-on-surface-variant border-l border-primary/30 pl-4 py-1">
              <span className="text-primary opacity-50 shrink-0">14:22:15.02</span>
              <span>[INTERVIEW] Bot initialized for candidate CID-4412. Audio latency: 14ms.</span>
           </div>
        </div>
      </div>
    </div>
  );
}
