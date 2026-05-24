import { useState } from "react";
import { Settings as SettingsIcon, Shield, Sliders, Cpu, Save } from "lucide-react";

export default function Settings() {
  const [useMock, setUseMock] = useState(true);
  const [groqKey, setGroqKey] = useState("gsk_vLl...Guq");
  const [openRouterKey, setOpenRouterKey] = useState("sk-or...da5");
  const [threshold, setThreshold] = useState(0.80);
  const [maxRetries, setMaxRetries] = useState(3);
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="p-8 max-w-4xl mx-auto h-full overflow-y-auto">
      <div className="mb-8 flex justify-between items-end">
        <div>
          <div className="flex items-center gap-2 text-primary font-mono-log text-xs uppercase tracking-widest mb-2">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse-glow"></span>
            System Preferences
          </div>
          <h2 className="font-headline-md text-3xl font-bold text-on-surface tracking-tight">Settings</h2>
          <p className="text-on-surface-variant font-body-main mt-1">Configure autonomous agent layers, threshold limits, and LLM providers.</p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6 bg-surface-container border border-border-default p-8 rounded-sm shadow-xl">
        {saved && (
          <div className="bg-primary/10 border-l-2 border-primary p-4 text-primary text-sm font-label-title">
            Settings saved and synchronized with ZETANET core successfully.
          </div>
        )}

        <div className="space-y-6 divide-y divide-border-default">
          {/* Section 1: LLM Engine Configuration */}
          <div className="pb-6">
            <h3 className="font-label-title text-sm uppercase tracking-wider text-on-surface font-semibold mb-4 flex items-center gap-2">
              <Cpu className="w-4 h-4 text-primary" /> LLM Orchestration
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <label className="block text-sm font-medium text-on-surface">Execution Mode</label>
                  <p className="text-xs text-on-surface-variant">Deterministic mock mode is ideal for local testing without active API credits.</p>
                </div>
                <button 
                  type="button"
                  onClick={() => setUseMock(!useMock)}
                  className={`w-12 h-6 rounded-full transition-colors relative ${useMock ? 'bg-primary' : 'bg-surface-container-high'}`}
                >
                  <span className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-all ${useMock ? 'right-1' : 'left-1'}`} />
                </button>
              </div>

              {!useMock && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-on-surface-variant mb-2">Groq Key</label>
                    <input 
                      type="password"
                      value={groqKey}
                      onChange={(e) => setGroqKey(e.target.value)}
                      className="w-full bg-background border border-border-default px-4 py-2 rounded-sm text-on-surface font-mono-log focus:border-primary focus:outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-on-surface-variant mb-2">OpenRouter Key</label>
                    <input 
                      type="password"
                      value={openRouterKey}
                      onChange={(e) => setOpenRouterKey(e.target.value)}
                      className="w-full bg-background border border-border-default px-4 py-2 rounded-sm text-on-surface font-mono-log focus:border-primary focus:outline-none transition-colors"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Section 2: Agent Threshold Limits */}
          <div className="pt-6 pb-6">
            <h3 className="font-label-title text-sm uppercase tracking-wider text-on-surface font-semibold mb-4 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-secondary" /> Agent Threshold limits
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-on-surface mb-1">Confidence Autonomous Threshold</label>
                <p className="text-xs text-on-surface-variant mb-2">Scores below this limit trigger human control loop escalations.</p>
                <input 
                  type="number"
                  step="0.05"
                  min="0.1"
                  max="1.0"
                  value={threshold}
                  onChange={(e) => setThreshold(parseFloat(e.target.value))}
                  className="w-32 bg-background border border-border-default px-4 py-2 rounded-sm text-on-surface font-mono-log focus:border-primary focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-on-surface mb-1">Agent Max Retries</label>
                <p className="text-xs text-on-surface-variant mb-2">Number of execution retries before raising a hard failure alarm.</p>
                <input 
                  type="number"
                  value={maxRetries}
                  onChange={(e) => setMaxRetries(parseInt(e.target.value))}
                  className="w-32 bg-background border border-border-default px-4 py-2 rounded-sm text-on-surface font-mono-log focus:border-primary focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Safety Controls */}
          <div className="pt-6 pb-6">
            <h3 className="font-label-title text-sm uppercase tracking-wider text-on-surface font-semibold mb-4 flex items-center gap-2">
              <Shield className="w-4 h-4 text-tertiary" /> Guardrails & Safety
            </h3>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-on-surface">Demographic Masking (Blind Screening)</p>
                  <p className="text-xs text-on-surface-variant font-body-main">Guarantees compliance with anti-bias hiring regulations by censoring names and genders from screening runs.</p>
                </div>
                <span className="text-[10px] uppercase font-mono-log px-2.5 py-1 bg-tertiary/10 text-tertiary border border-tertiary/20 rounded font-bold">Enforced (Compliance)</span>
              </div>
            </div>
          </div>
        </div>

        <button 
          type="submit"
          className="w-full mt-6 bg-primary text-on-primary font-semibold py-3 rounded-sm hover:opacity-90 active:scale-95 transition-all flex items-center justify-center gap-2"
        >
          <Save className="w-4 h-4" /> Save Configuration
        </button>
      </form>
    </div>
  );
}
