"use client";
import { useState } from "react";
export default function Home() {
  const [transcript, setTranscript] = useState("");
  const [mode, setMode] = useState("discovery");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  async function analyze() {
    if (!transcript.trim()) return;
    setLoading(true);
    setResult("");
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transcript, mode }),
      });
      const data = await res.json();
      setResult(data.result ?? data.error);
    } catch {
      setResult("Erreur de connexion à l'API.");
    } finally {
      setLoading(false);
    }
  }
  return (
    <main style={{minHeight:"100vh",background:"#030712",color:"white",padding:"2rem",maxWidth:"48rem",margin:"0 auto",fontFamily:"Arial,sans-serif"}}>
      <h1 style={{fontSize:"1.5rem",fontWeight:"bold",marginBottom:"0.25rem"}}>Michca Demo — Consulting Data/IA</h1>
      <p style={{color:"#9ca3af",fontSize:"0.875rem",marginBottom:"1.5rem"}}>Analysez un transcript ou document en quelques secondes.</p>
      <div style={{display:"flex",gap:"0.75rem",marginBottom:"1rem"}}>
        {[{key:"discovery",label:"Agent Discovery"},{key:"veille",label:"Agent Veille"}].map(({key,label})=>(
          <button key={key} onClick={()=>setMode(key)} style={{padding:"0.5rem 1rem",borderRadius:"0.5rem",fontSize:"0.875rem",fontWeight:500,border:"none",cursor:"pointer",background:mode===key?"#7c3aed":"#1f2937",color:mode===key?"white":"#9ca3af"}}>{label}</button>
        ))}
      </div>
      <textarea
        style={{width:"100%",height:"12rem",background:"#111827",border:"1px solid #374151",borderRadius:"0.5rem",padding:"1rem",fontSize:"0.875rem",color:"white",resize:"none",marginBottom:"1rem",boxSizing:"border-box"}}
        placeholder={mode==="discovery"?"Collez ici le transcript de votre réunion client...":"Collez ici un article, rapport ou document sectoriel..."}
        value={transcript}
        onChange={e=>setTranscript(e.target.value)}
      />
      <button onClick={analyze} disabled={loading||!transcript.trim()} style={{width:"100%",padding:"0.75rem",background:loading||!transcript.trim()?"#374151":"#7c3aed",color:loading||!transcript.trim()?"#6b7280":"white",border:"none",borderRadius:"0.5rem",fontWeight:500,cursor:loading||!transcript.trim()?"not-allowed":"pointer",fontSize:"1rem"}}>
        {loading?"Analyse en cours...":"Analyser avec Claude"}
      </button>
      {result&&(
        <div style={{marginTop:"1.5rem",background:"#111827",border:"1px solid #374151",borderRadius:"0.5rem",padding:"1.25rem",fontSize:"0.875rem",whiteSpace:"pre-wrap",lineHeight:1.6}}>{result}</div>
      )}
    </main>
  );
}
