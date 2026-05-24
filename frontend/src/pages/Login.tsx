import { useState } from "react";
import { Terminal } from "lucide-react";
import { api } from "../lib/api";

export default function Login({ onLogin }: { onLogin: () => void }) {
  const [username, setUsername] = useState("admin@zeta.ai");
  const [password, setPassword] = useState("password123");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await api.login(username, password);
      onLogin();
    } catch (err) {
      setError("Authentication failed. Check credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[100px] pointer-events-none"></div>
      
      <div className="w-full max-w-md z-10 relative">
        <div className="mb-8 text-center flex flex-col items-center gap-4">
          <div className="w-16 h-16 bg-surface-container rounded-sm border border-border-default flex items-center justify-center">
            <Terminal className="text-primary w-8 h-8" />
          </div>
          <div>
            <h1 className="font-headline-md text-3xl font-bold tracking-tight text-on-surface">ZETA<span className="text-primary">NET</span></h1>
            <p className="text-on-surface-variant font-label-title text-sm tracking-widest uppercase mt-1">Operator Console Terminal</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="bg-surface-container border border-border-default p-8 rounded-sm shadow-xl">
          {error && (
            <div className="bg-error/10 border-l-2 border-error p-3 mb-6 text-error text-sm font-label-title">
              {error}
            </div>
          )}
          
          <div className="space-y-4 mb-8">
            <div>
              <label className="block text-on-surface-variant font-label-title text-xs uppercase tracking-wider mb-2">Operator ID</label>
              <input 
                type="email" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-background border border-border-default px-4 py-3 rounded-sm text-on-surface font-mono-log focus:border-primary focus:outline-none transition-colors"
                required
              />
            </div>
            <div>
              <label className="block text-on-surface-variant font-label-title text-xs uppercase tracking-wider mb-2">Passphrase</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-background border border-border-default px-4 py-3 rounded-sm text-on-surface font-mono-log focus:border-primary focus:outline-none transition-colors"
                required
              />
            </div>
          </div>
          
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-primary text-on-primary py-3 font-label-title font-semibold rounded-sm hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "INITIALIZING..." : "INITIATE HANDSHAKE"}
          </button>
        </form>
      </div>
    </div>
  );
}
