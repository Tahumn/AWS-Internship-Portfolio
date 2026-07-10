import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useGame } from "../context/GameContext";

export default function GameEngine() {
  const { sessionId, currentRole, roleSequence, hp, resetGame } = useGame();
  const navigate = useNavigate();

  // If no session, redirect to landing page
  useEffect(() => {
    if (!sessionId) {
      navigate("/");
    }
  }, [sessionId, navigate]);

  if (!sessionId) return null;

  return (
    <div className="min-h-screen bg-black text-green-400 p-8 font-mono">
      <div className="border border-green-500 p-6 rounded-lg max-w-4xl mx-auto shadow-[0_0_15px_rgba(0,255,128,0.3)]">
        <h1 className="text-3xl font-bold mb-4 text-white uppercase tracking-widest text-center">
          Terminal Status
        </h1>
        
        <div className="mb-6 bg-gray-900 p-4 rounded border border-gray-700">
           <p className="mb-2"><span className="text-gray-400">Subject ID:</span> {sessionId}</p>
           <p className="mb-2"><span className="text-gray-400">System Integrity (HP):</span> {hp}%</p>
           <p className="mb-2"><span className="text-gray-400">Decrypted Path:</span> {roleSequence.join(" -> ")}</p>
        </div>

        <div className="text-center py-10 bg-cyan-900/20 border border-cyan-800 rounded animate-pulse">
           <h2 className="text-2xl text-cyan-400 mb-2">Current Override Protocol</h2>
           <p className="text-5xl font-black text-white tracking-widest">
              {currentRole || "INITIALIZING..."}
           </p>
        </div>

        <div className="mt-8 flex justify-between">
           <button 
             onClick={() => {
                resetGame();
                navigate("/");
             }}
             className="px-6 py-2 bg-red-900/50 text-red-300 border border-red-500 hover:bg-red-800 transition"
           >
             ABORT MISSION
           </button>
           <button 
             onClick={() => {
               const roleMap = {
                 detective: 'detective',
                 datacrypt: 'datacrypt',
               };
               const slug = roleMap[currentRole?.toLowerCase()] || currentRole?.toLowerCase() || 'datacrypt';
               navigate(`/game/${slug}`);
             }}
             className="px-6 py-2 bg-green-900/50 text-green-300 border border-green-500 hover:bg-green-800 transition"
           >
             PROCEED TO MAP
           </button>
        </div>
      </div>
    </div>
  );
}
