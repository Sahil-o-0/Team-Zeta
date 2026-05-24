import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";

export default function Layout() {
  return (
    <div className="flex h-screen bg-background overflow-hidden relative">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 md:ml-64 relative">
        <TopBar />
        <main className="flex-1 overflow-y-auto custom-scrollbar pt-16">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
