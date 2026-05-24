/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import CommandCenter from "./pages/CommandCenter";
import AgentNetwork from "./pages/AgentNetwork";
import Pipeline from "./pages/Pipeline";
import EscalationQueue from "./pages/EscalationQueue";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<CommandCenter />} />
          <Route path="network" element={<AgentNetwork />} />
          <Route path="pipeline" element={<Pipeline />} />
          <Route path="escalation" element={<EscalationQueue />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

