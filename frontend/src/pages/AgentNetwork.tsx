import { useState, useEffect } from "react";
import { TrendingUp, Verified, UserSearch, BrainCircuit, Calendar, Mic, FileText, Shield, ArrowRight, Filter, AlignJustify, Grip, Terminal, Network } from "lucide-react";
import { api } from "../lib/api";

const ICON_MAP: Record<string, any> = {
  "Talent Scout": UserSearch,
  "Screening Agent": BrainCircuit,
  "Scheduling Ops": Calendar,
  "Interview Agent": Mic,
  "Offer Engine": FileText,
  "Browser Agent": Shield,
  "Employee Support Agent": Network,
  "default": Terminal
};

export default function AgentNetwork() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await api.getTasks();
        setTasks(data);
      } catch (err) {
        console.error("Failed to load tasks", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
    const interval = setInterval(loadData, 3000);
    return () => clearInterval(interval);
  }, []);

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === "Completed").length;
  const successRate = totalTasks ? ((completedTasks / totalTasks) * 100).toFixed(1) : "0.0";
  const activeThreads = tasks.filter(t => t.status === "Running" || t.status === "Pending").length;
  const networkLoad = totalTasks ? Math.min((activeThreads / 20) * 100, 100).toFixed(1) : "0.0";

  const stats = [
    { label: "Active Threads", value: activeThreads.toString(), delta: "Live", color: "text-tertiary", icon: TrendingUp },
    { label: "Network Load", value: `${networkLoad}%`, progress: parseFloat(networkLoad), color: "text-on-surface" },
    { label: "Avg Success Rate", value: `${successRate}%`, color: "text-tertiary", icon: Verified },
    { label: "Memory Pressure", value: `${(14.8 + activeThreads * 0.2).toFixed(1)} GB`, sub: activeThreads > 5 ? "High" : "Stable", color: "text-on-surface" }
  ];

  const agentMap = new Map();
  tasks.forEach((task: any) => {
    if (!agentMap.has(task.assigned_agent)) {
      agentMap.set(task.assigned_agent, {
        name: task.assigned_agent,
        role: "Autonomous Node",
        icon: ICON_MAP[task.assigned_agent] || ICON_MAP.default,
        iconColor: "text-primary",
        bgCore: "bg-primary",
        statusColor: "text-primary",
        statusBg: "bg-primary-container/10 border-primary/20",
        tasks: 0,
        completed: 0,
        time: "1.2s",
        activity: "Standby",
        pulse: false,
        status: "Idle",
        lastTaskTime: null
      });
    }
    const agent = agentMap.get(task.assigned_agent);
    agent.tasks += 1;
    if (task.status === "Completed") agent.completed += 1;
    
    if (!agent.lastTaskTime || new Date(task.updated_at || task.created_at) > agent.lastTaskTime) {
      agent.lastTaskTime = new Date(task.updated_at || task.created_at);
      agent.activity = `Task: ${task.task_name.substring(0, 20)}...`;
      agent.status = task.status;
      agent.pulse = task.status === "Running" || task.status === "Pending";
      
      if (task.status === "Failed" || task.status === "Escalated") {
        agent.iconColor = "text-error";
        agent.statusColor = "text-error";
        agent.statusBg = "bg-error/10 border-error/20";
      } else if (task.status === "Completed") {
        agent.iconColor = "text-secondary";
        agent.statusColor = "text-secondary";
        agent.statusBg = "bg-secondary-container/10 border-secondary/20";
      } else {
        agent.iconColor = "text-primary";
        agent.statusColor = "text-primary";
        agent.statusBg = "bg-primary-container/10 border-primary/20";
      }
    }
  });

  const agents = Array.from(agentMap.values()).map(a => ({
    ...a,
    rate: a.tasks ? ((a.completed / a.tasks) * 100).toFixed(1) + "%" : "0%"
  }));

  const logs = tasks.slice(0, 15).map((task: any) => ({
    time: new Date(task.created_at).toLocaleTimeString('en-US', { hour12: false, hour: "numeric", minute: "numeric", second: "numeric" }) + "." + new Date(task.created_at).getMilliseconds(),
    agent: task.assigned_agent,
    msg: task.status === "Failed" ? `[ERROR] ${task.error_log || "Task execution failed"}` : 
         task.status === "Completed" ? `[SUCCESS] Output generated with ${(task.confidence_score*100).toFixed(0)}% confidence.` :
         `[RUNNING] Executing: ${task.task_name}`,
    type: task.status === "Failed" || task.status === "Escalated" ? "error" : 
          task.status === "Running" || task.status === "Pending" ? "warn" : "info"
  }));

  if (loading && tasks.length === 0) return <div className="p-8 text-on-surface">Loading network...</div>;

  return (
    <div className="p-8 max-w-7xl mx-auto h-full overflow-y-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
        <div>
          <div className="flex items-center gap-2 text-primary font-mono-log text-xs uppercase tracking-widest mb-2">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse-glow"></span>
            Network Topology
          </div>
          <h2 className="font-headline-md text-3xl font-bold text-on-surface tracking-tight">Agent Network</h2>
          <p className="text-on-surface-variant font-body-main mt-1">Real-time supervision of {agents.length} autonomous entities in the ZETA swarm.</p>
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
              {s.progress !== undefined && (
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
              <span className="text-xs text-on-surface-variant font-mono-log italic truncate mr-2" title={agent.activity}>{agent.activity}</span>
              <button className={`${agent.statusColor} font-label-title text-xs flex items-center gap-1 group/btn hover:underline whitespace-nowrap`}>
                View Details
                <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
              </button>
            </div>
          </div>
        ))}
        {agents.length === 0 && (
            <div className="col-span-full p-8 text-center text-on-surface-variant border border-dashed border-border-default rounded-xl">
                No active agent nodes found in the network.
            </div>
        )}
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
        <div className="space-y-3 font-mono-log text-sm overflow-hidden h-[200px] overflow-y-auto custom-scrollbar">
           {logs.map((log, i) => (
               <div key={i} className={`flex items-start gap-4 text-on-surface-variant border-l pl-4 py-1
                   ${log.type === 'error' ? 'border-error/50 text-error/90' : 
                     log.type === 'warn' ? 'border-accent-warning/50' : 'border-primary/30'}`}>
                  <span className={`${log.type === 'error' ? 'text-error' : log.type === 'warn' ? 'text-accent-warning' : 'text-primary'} opacity-50 shrink-0 w-24`}>{log.time}</span>
                  <span>[{log.agent.toUpperCase()}] <span className={log.type === 'error' ? 'text-error' : 'text-on-surface'}>{log.msg}</span></span>
               </div>
           ))}
        </div>
      </div>
    </div>
  );
}
