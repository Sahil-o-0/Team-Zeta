import { useState, useEffect } from "react";
import { History, Search, BookOpen, Terminal, CheckCircle2, ShieldAlert } from "lucide-react";
import { api } from "../lib/api";

export default function Memory() {
  const [policies, setPolicies] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    const loadPolicies = async () => {
      try {
        const data = await api.getPolicies();
        setPolicies(data);
      } catch (err) {
        console.error("Failed to load compliance policies", err);
      } finally {
        setLoading(false);
      }
    };
    loadPolicies();
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }
    setSearching(true);
    try {
      const results = await api.searchPolicies(searchQuery);
      setSearchResults(results);
    } catch (err) {
      console.error("Vector search query failed", err);
    } finally {
      setSearching(false);
    }
  };

  if (loading) return <div className="p-8 text-on-surface">Accessing Episodic Knowledge base...</div>;

  return (
    <div className="p-8 max-w-7xl mx-auto h-full flex flex-col">
      <div className="mb-8 flex justify-between items-end">
        <div>
          <div className="flex items-center gap-2 text-primary font-mono-log text-xs uppercase tracking-widest mb-2">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse-glow"></span>
            Vector DB
          </div>
          <h2 className="font-headline-md text-3xl font-bold text-on-surface tracking-tight">Organizational Memory</h2>
          <p className="text-on-surface-variant font-body-main mt-1">Semantic index lookup across institutional compliance policies and standard operating guidelines.</p>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6 flex-1">
        {/* Semantic search section */}
        <div className="col-span-12 lg:col-span-8 flex flex-col gap-6">
          <div className="bg-surface-container border border-border-default rounded-sm p-6">
            <h3 className="font-label-title text-sm uppercase tracking-wider text-on-surface-variant mb-4 font-bold flex items-center gap-2">
              <Terminal className="text-primary w-4 h-4" /> Vector Search Engine (Semantic Query)
            </h3>
            
            <form onSubmit={handleSearch} className="flex gap-3 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant" />
                <input 
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Ask policy questions e.g. 'Can we hire candidates with 3 years experience?'"
                  className="w-full bg-surface-container-lowest border border-border-default text-on-surface py-3 pl-10 pr-4 focus:border-primary focus:ring-0 font-mono-log text-sm rounded outline-none transition-all"
                />
              </div>
              <button 
                type="submit"
                disabled={searching}
                className="bg-primary text-on-primary px-6 py-3 rounded-sm font-label-title text-sm hover:opacity-90 active:scale-95 transition-all flex items-center gap-2"
              >
                {searching ? "Searching..." : "Search Node"}
              </button>
            </form>

            {searchResults.length > 0 ? (
              <div className="space-y-4">
                <h4 className="font-label-title text-xs text-tertiary uppercase tracking-wider font-bold">Top Vector Matches</h4>
                {searchResults.map((res, i) => (
                  <div key={i} className="bg-surface-container-lowest border-l-2 border-primary p-4 border border-border-default rounded-r-sm">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-sm font-bold text-on-surface">{res.title}</span>
                      <span className="text-[10px] uppercase font-mono-log px-2 py-0.5 bg-primary/10 text-primary rounded">{res.relevance_rank} Relevance</span>
                    </div>
                    <p className="text-xs text-on-surface-variant leading-relaxed font-mono-log">{res.matching_text_snippet}</p>
                  </div>
                ))}
              </div>
            ) : searchQuery.trim() ? (
              <p className="text-xs text-outline italic">No semantic matches returned. Try typing other compliance keywords.</p>
            ) : (
              <div className="p-8 border border-dashed border-border-default rounded-sm flex flex-col items-center justify-center text-center opacity-60">
                <Search className="text-outline w-8 h-8 mb-4" />
                <h4 className="font-label-title font-semibold text-on-surface-variant mb-1">Enter Search Query</h4>
                <p className="text-xs text-outline max-w-[250px]">Submit queries to evaluate corporate alignment using episodic memory blocks.</p>
              </div>
            )}
          </div>
        </div>

        {/* Corporate Policies Index List */}
        <div className="col-span-12 lg:col-span-4 bg-surface-container border border-border-default rounded-sm flex flex-col h-[525px]">
          <div className="p-4 border-b border-border-default flex items-center gap-2">
            <BookOpen className="text-secondary w-5 h-5" />
            <h3 className="font-label-title text-sm uppercase tracking-wider text-on-surface-variant font-semibold">Handbooks Index ({policies.length})</h3>
          </div>
          <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-4">
            {policies.map((pol) => (
              <div key={pol.id} className="p-4 bg-surface-container-low border border-border-default rounded-sm hover:border-primary/50 transition-colors">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-label-title text-sm font-semibold text-on-surface">{pol.title}</h4>
                  <span className="text-[9px] uppercase font-mono-log px-1.5 py-0.5 bg-secondary-container/20 text-secondary border border-secondary/20 rounded">{pol.category}</span>
                </div>
                <p className="text-xs text-on-surface-variant line-clamp-3 font-mono-log mt-2 leading-relaxed">{pol.policy_text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
