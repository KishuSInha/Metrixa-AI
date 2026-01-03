import { useState, useEffect, useRef } from "react";
import "./App.css";

function App() {
  const [prompt, setPrompt] = useState("");
  const [status, setStatus] = useState("Ready for your command...");
  const [isProcessing, setIsProcessing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Focus input on load
    inputRef.current?.focus();
  }, []);

  const handleProcess = async (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && prompt.trim() && !isProcessing) {
      setIsProcessing(true);
      setStatus("Thinking...");

      try {
        const response = await fetch("http://localhost:8000/process", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ prompt }),
        });

        if (!response.ok) throw new Error("Backend unreachable");

        const data = await response.json();

        if (data.status === "error") {
          setStatus(`Error: ${data.message}`);
        } else {
          setStatus(`Done: ${data.intent.intent || "Processed"}`);
          setPrompt("");
        }
      } catch (err: any) {
        setStatus(`Error: ${err.message}`);
      } finally {
        setIsProcessing(false);
      }
    }
  };

  return (
    <div className={`container ${isProcessing ? 'glow' : ''}`}>
      <div className="input-wrapper">
        <div className="ai-icon">
          <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M8 32V8L20 20L32 8V32"
              stroke="black"
              strokeWidth="3.5"
              strokeLinecap="square"
            />
          </svg>
        </div>
        <input
          ref={inputRef}
          type="text"
          placeholder="What can I do for you?"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={handleProcess}
          disabled={isProcessing}
        />
      </div>
      <div className="status-bar" style={{ opacity: status ? 1 : 0 }}>
        {status}
      </div>
    </div>
  );
}

export default App;
