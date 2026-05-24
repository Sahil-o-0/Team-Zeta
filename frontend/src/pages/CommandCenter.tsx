import { useState, useEffect } from "react";
import { Users, CheckCircle2, AlertTriangle, Network, MoreVertical, Terminal } from "lucide-react";
import { api } from "../lib/api";

export default function CommandCenter() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [agents, setAgents] = useState<any[]>([]);
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const tasksData = await api.getTasks();
        setTasks(tasksData);
        
        // Group by agent to find latest status
        const agentMap = new Map();
        tasksData.forEach((task: any) => {
          if (!agentMap.has(task.assigned_agent) || new Date(task.created_at) > new Date(agentMap.get(task.assigned_agent).created_at)) {
            agentMap.set(task.assigned_agent, task);
          }
        });
        
        const activeAgents = Array.from(agentMap.values()).map(task => ({
          name: task.assigned_agent,
          desc: "Active processing node",
          status: task.status,
          subStatus: task.agent_sub_status || "Online",
          iconColor: task.status === "Failed" ? "text-error" : "text-primary",
          dim: task.status === "Completed"
        }));
        setAgents(activeAgents.length ? activeAgents : [
          { name: "System Node", desc: "Awaiting tasks...", status: "Idle", subStatus: "Online", iconColor: "text-on-surface-variant", dim: true }
        ]);

        // Map logs
        const recentLogs = tasksData.slice(0, 15).map((task: any) => ({
          time: new Date(task.created_at).toLocaleTimeString(),
          source: task.assigned_agent.toUpperCase(),
          msg: task.status === "Failed" ? task.error_message : `Task processed: ${task.input_data ? JSON.stringify(task.input_data).substring(0, 50) : "No details"}`,
          color: task.status === "Failed" ? "text-error" : task.status === "Completed" ? "text-secondary" : "text-primary",
          bg: task.status === "InProgress"
        }));
        setLogs(recentLogs);
      } catch (err) {
        console.error("Failed to fetch data", err);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
    const interval = setInterval(loadData, 5000);
    return () => clearInterval(interval);
  }, []);

  if (loading) return <div className="p-6 text-on-surface">Initializing Systems...</div>;
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
