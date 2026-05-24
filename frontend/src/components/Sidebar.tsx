import { 
    LayoutDashboard, 
    Network, 
    Kanban, 
    AlertTriangle, 
    LineChart, 
    History, 
    Settings, 
    HelpCircle,
    Hexagon
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { cn } from "../lib/utils";

export default function Sidebar() {
    const navItems = [
        { path: "/", label: "Command Center", icon: LayoutDashboard },
        { path: "/network", label: "Agent Network", icon: Network },
        { path: "/pipeline", label: "Recruiting Pipeline", icon: Kanban },
        { path: "/escalation", label: "Escalation Queue", icon: AlertTriangle },
        { path: "/intelligence", label: "Workforce Intelligence", icon: LineChart },
        { path: "/memory", label: "Organizational Memory", icon: History },
    ];

    const bottomItems = [
        { path: "/settings", label: "Settings", icon: Settings },
        { path: "/support", label: "Support", icon: HelpCircle },
    ];

    return (
        <aside className="fixed left-0 top-0 h-full flex flex-col z-50 bg-surface-container-low border-r border-border-default w-64">
            <div className="p-6">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary rounded-sm flex items-center justify-center">
                        <Hexagon className="text-on-primary w-5 h-5 fill-current" />
                    </div>
                    <div>
                        <h1 className="font-headline-md text-xl font-bold tracking-tighter text-on-surface">ZETA</h1>
                        <p className="text-[10px] uppercase tracking-widest text-primary/70 font-bold font-mono-log">Autonomous OS</p>
                    </div>
                </div>
            </div>

            <nav className="flex-1 px-3 space-y-1 mt-4">
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                            cn(
                                "flex items-center gap-3 px-4 py-3 font-label-title text-sm transition-colors duration-200",
                                isActive
                                    ? "text-primary bg-secondary-container/20 border-r-2 border-primary"
                                    : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high"
                            )
                        }
                    >
                        <item.icon className="w-5 h-5" />
                        <span>{item.label}</span>
                    </NavLink>
                ))}
            </nav>

            <div className="p-3 border-t border-border-default space-y-1">
                {bottomItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className="flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors duration-200 font-label-title text-sm"
                    >
                        <item.icon className="w-5 h-5" />
                        <span>{item.label}</span>
                    </NavLink>
                ))}
            </div>
        </aside>
    );
}
