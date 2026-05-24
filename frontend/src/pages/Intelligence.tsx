import { useState, useEffect } from "react";
import { LineChart, Users, TrendingUp, Cpu, Network, User, ShieldAlert } from "lucide-react";
import { api } from "../lib/api";

export default function Intelligence() {
  const [employees, setEmployees] = useState<any[]>([]);
  const [selectedEmp, setSelectedEmp] = useState<any | null>(null);
  const [graphData, setGraphData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadEmployees = async () => {
      try {
        const data = await api.getEmployees();
        setEmployees(data);
        if (data.length > 0) {
          setSelectedEmp(data[0]);
        }
      } catch (err) {
        console.error("Failed to load employees", err);
      } finally {
        setLoading(false);
      }
    };
    loadEmployees();
  }, []);

  useEffect(() => {
    if (!selectedEmp) return;
    const loadGraph = async () => {
      try {
        const graph = await api.getEmployeeGraph(selectedEmp.id);
        setGraphData(graph);
      } catch (err) {
        console.error("Failed to load employee relationship graph", err);
        setGraphData(null);
      }
    };
    loadGraph();
  }, [selectedEmp]);

  if (loading) return <div className="p-8 text-on-surface">Initializing Intelligence Systems...</div>;

  return (
    <div className="p-8 max-w-7xl mx-auto h-full overflow-y-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
        <div>
          <div className="flex items-center gap-2 text-primary font-mono-log text-xs uppercase tracking-widest mb-2">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse-glow"></span>
            Workforce System
          </div>
          <h2 className="font-headline-md text-3xl font-bold text-on-surface tracking-tight">Workforce Intelligence</h2>
          <p className="text-on-surface-variant font-body-main mt-1">Real-time mapping of corporate hierarchy, reports, and connection nodes.</p>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Left pane: Employee List */}
        <div className="col-span-12 lg:col-span-5 bg-surface-container border border-border-default rounded-sm flex flex-col h-[550px]">
          <div className="p-4 border-b border-border-default flex items-center gap-2">
            <Users className="text-primary w-5 h-5" />
            <h3 className="font-label-title text-sm uppercase tracking-wider text-on-surface-variant font-semibold">Active Profiles</h3>
          </div>
          <div className="flex-1 overflow-y-auto custom-scrollbar divide-y divide-border-default">
            {employees.map((emp) => (
              <div 
                key={emp.id}
                onClick={() => setSelectedEmp(emp)}
                className={`p-4 flex items-center justify-between cursor-pointer transition-colors hover:bg-surface-container-high ${
                  selectedEmp?.id === emp.id ? "bg-secondary-container/20 border-r-2 border-primary" : ""
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded bg-surface-container-high border border-border-default flex items-center justify-center">
                    <User className="text-outline w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-label-title text-sm text-on-surface font-semibold">{emp.name}</h4>
                    <p className="text-on-surface-variant font-caption text-xs">{emp.role}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="bg-primary/10 text-primary text-[10px] px-2 py-0.5 rounded font-mono-log uppercase">{emp.department}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right pane: Hierarchy Graph mapping */}
        <div className="col-span-12 lg:col-span-7 bg-surface-container border border-border-default rounded-sm p-6 flex flex-col h-[550px]">
          {selectedEmp ? (
            <div className="flex flex-col h-full">
              <div className="flex justify-between items-start border-b border-border-default pb-4 mb-6">
                <div>
                  <h3 className="font-headline-md text-2xl text-on-surface font-bold">{selectedEmp.name}</h3>
                  <p className="text-on-surface-variant font-body-main text-sm">{selectedEmp.role} — <span className="text-primary font-bold">{selectedEmp.department}</span></p>
                </div>
                <span className="text-tertiary font-mono-log text-xs bg-tertiary/10 px-3 py-1 rounded">Performance Checked</span>
              </div>

              {/* Relationship map */}
              <div className="flex-1 bg-surface-container-lowest border border-border-default rounded p-4 flex flex-col justify-between overflow-y-auto custom-scrollbar">
                <div>
                  <h4 className="font-label-title text-xs uppercase tracking-wider text-on-surface-variant mb-4 font-bold flex items-center gap-2">
                    <Network className="w-4 h-4 text-primary" /> Manager Relation
                  </h4>
                  {graphData?.manager ? (
                    <div className="p-4 bg-surface-container border border-border-default rounded-sm flex items-center justify-between max-w-md">
                      <div>
                        <p className="text-sm font-semibold text-on-surface">{graphData.manager.name}</p>
                        <p className="text-xs text-on-surface-variant">{graphData.manager.role}</p>
                      </div>
                      <span className="text-[10px] uppercase font-mono-log px-2 py-0.5 bg-primary/10 text-primary rounded">Reports To</span>
                    </div>
                  ) : (
                    <p className="text-xs text-outline italic">No direct manager registered in graph node.</p>
                  )}
                </div>

                <div className="my-8">
                  <div className="h-0.5 bg-border-default border-dashed relative">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-surface-container-lowest px-4 py-1 text-[10px] uppercase font-bold text-primary font-mono-log border border-border-default rounded-full">Hierarchy Spacing</div>
                  </div>
                </div>

                <div>
                  <h4 className="font-label-title text-xs uppercase tracking-wider text-on-surface-variant mb-4 font-bold flex items-center gap-2">
                    <Users className="w-4 h-4 text-secondary" /> Direct Reports ({graphData?.direct_reports?.length || 0})
                  </h4>
                  {graphData?.direct_reports && graphData.direct_reports.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {graphData.direct_reports.map((rep: any) => (
                        <div key={rep.id} className="p-4 bg-surface-container border border-border-default rounded-sm">
                          <p className="text-sm font-semibold text-on-surface">{rep.name}</p>
                          <p className="text-xs text-on-surface-variant">{rep.role}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-outline italic">No direct reports registered under this node.</p>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center opacity-60">
              <ShieldAlert className="text-outline w-12 h-12 mb-4" />
              <h4 className="font-label-title text-on-surface mb-1 font-semibold">No Employee Selected</h4>
              <p className="text-xs text-outline max-w-xs">Select an employee from the left panel to load hierarchy hierarchy relations.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
