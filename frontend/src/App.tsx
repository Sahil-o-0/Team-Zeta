/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import CommandCenter from "./pages/CommandCenter";
import AgentNetwork from "./pages/AgentNetwork";
import Pipeline from "./pages/Pipeline";
import EscalationQueue from "./pages/EscalationQueue";
import Intelligence from "./pages/Intelligence";
import Memory from "./pages/Memory";
import Login from "./pages/Login";
import { getToken } from "./lib/api";

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(!!getToken());

  // Listen to storage events to handle logout across tabs if needed
  useEffect(() => {
    const handleStorageChange = () => {
      setIsAuthenticated(getToken());
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  if (!isAuthenticated) {
    return <Login onLogin={() => setIsAuthenticated(true)} />;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<CommandCenter />} />
          <Route path="network" element={<AgentNetwork />} />
          <Route path="pipeline" element={<Pipeline />} />
          <Route path="escalation" element={<EscalationQueue />} />
          <Route path="intelligence" element={<Intelligence />} />
          <Route path="memory" element={<Memory />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
