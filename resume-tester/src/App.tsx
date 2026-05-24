import { useState, useRef } from "react";
import { UploadCloud, FileText, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

export default function App() {
  const [file, setFile] = useState<File | null>(null);
  const [dragging, setDragging] = useState(false);
  const [status, setStatus] = useState<"idle" | "uploading" | "success" | "error">("idle");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = () => {
    setDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setStatus("uploading");
    
    try {
      const formData = new FormData();
      formData.append("file", file);
      
      const response = await fetch("http://localhost:8000/api/v1/candidates/upload-resume", {
        method: "POST",
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error("Upload failed");
      }
      
      setStatus("success");
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center py-20 px-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="w-full max-w-2xl z-10">
        <header className="mb-12 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-white mb-3">
            ZETA<span className="text-primary">NET</span> Candidate Engine
          </h1>
          <p className="text-gray-400">Upload candidate resumes for comprehensive autonomous testing.</p>
        </header>

        <div className="bg-surface border border-gray-800 rounded-xl p-8 shadow-2xl backdrop-blur-sm relative overflow-hidden">
          {/* Status Overlay */}
          {status === "uploading" && (
             <div className="absolute inset-0 bg-surface/80 backdrop-blur-md z-20 flex flex-col items-center justify-center">
               <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
               <p className="text-white font-medium">Processing Resume Data...</p>
             </div>
          )}

          {status === "success" && (
             <div className="absolute inset-0 bg-surface/90 backdrop-blur-md z-20 flex flex-col items-center justify-center">
               <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mb-4">
                 <CheckCircle2 className="w-8 h-8 text-green-500" />
               </div>
               <p className="text-white font-medium text-lg">Upload Successful</p>
               <p className="text-gray-400 text-sm mt-2 mb-6 text-center max-w-xs">The document has been securely routed to the analysis engine.</p>
               <button 
                 onClick={() => { setStatus("idle"); setFile(null); }}
                 className="px-6 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors"
               >
                 Upload Another
               </button>
             </div>
          )}

          {status === "error" && (
             <div className="absolute inset-0 bg-surface/90 backdrop-blur-md z-20 flex flex-col items-center justify-center">
               <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mb-4">
                 <AlertCircle className="w-8 h-8 text-red-500" />
               </div>
               <p className="text-white font-medium text-lg">Upload Failed</p>
               <p className="text-gray-400 text-sm mt-2 mb-6 text-center max-w-xs">Failed to communicate with ZETANET candidate core API.</p>
               <button 
                 onClick={() => setStatus("idle")}
                 className="px-6 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors"
               >
                 Retry
               </button>
             </div>
          )}

          <div 
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-xl p-12 text-center transition-all ${
              dragging ? "border-primary bg-primary/5" : "border-gray-700 hover:border-gray-600 bg-gray-900/30"
            }`}
          >
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileSelect} 
              className="hidden" 
              accept=".pdf,.doc,.docx"
            />
            
            <div className="flex justify-center mb-4">
               <div className={`p-4 rounded-full ${dragging ? "bg-primary/20" : "bg-gray-800"}`}>
                 <UploadCloud className={`w-8 h-8 ${dragging ? "text-primary" : "text-gray-400"}`} />
               </div>
            </div>
            
            <h3 className="text-lg font-medium text-white mb-2">Drag & Drop Resume Here</h3>
            <p className="text-sm text-gray-400 mb-6">Supports PDF, DOCX, and TXT (Max 10MB)</p>
            
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="px-6 py-2.5 bg-gray-800 hover:bg-gray-700 text-white text-sm font-medium rounded-lg transition-colors"
            >
              Browse Files
            </button>
          </div>

          {file && (
            <div className="mt-6 space-y-4">
              <div>
                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Selected File</h4>
                <div className="flex items-center justify-between p-4 bg-gray-900/50 border border-gray-800 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gray-800 rounded-md">
                      <FileText className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white line-clamp-1">{file.name}</p>
                      <p className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setFile(null)}
                    className="p-2 text-gray-500 hover:text-red-400 transition-colors"
                  >
                    <AlertCircle className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <button 
                onClick={handleUpload}
                className="w-full bg-primary hover:bg-primary-hover text-white font-medium py-3 rounded-lg transition-colors shadow-lg shadow-primary/20"
              >
                Start Autonomous Analysis
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
