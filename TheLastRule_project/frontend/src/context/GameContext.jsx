import { createContext, useContext, useState } from "react";
import { v4 as uuidv4 } from "uuid"; // We will need to install uuid later

const GameContext = createContext();

export function GameProvider({ children }) {
  // Try to load from LocalStorage to keep state after F5
  const [sessionId, setSessionId] = useState(localStorage.getItem("tlr_session_id") || null);
  const [roleSequence, setRoleSequence] = useState(
    JSON.parse(localStorage.getItem("tlr_roles")) || []
  );
  const [currentStageIndex, setCurrentStageIndex] = useState(
    parseInt(localStorage.getItem("tlr_stage_index")) || 0
  );
  const [fragments, setFragments] = useState(
    JSON.parse(localStorage.getItem("tlr_fragments")) || []
  );
  const [hp, setHp] = useState(100);

  // Helper to persist state
  const saveState = (session, roles, stage, frags) => {
    localStorage.setItem("tlr_session_id", session);
    localStorage.setItem("tlr_roles", JSON.stringify(roles));
    localStorage.setItem("tlr_stage_index", stage);
    localStorage.setItem("tlr_fragments", JSON.stringify(frags));
  };

  // Start Game: Call to Mock API (Later AWS Lambda)
  const startNewGame = async (playerName = "Unknown") => {
    try {
      // TODO: Replace with real AWS API Gateway POST /v1/game/start
      console.log(`Starting game for ${playerName}...`);
      
      // Force Detective as first role for testing
      const baseRoles = ["Engineer", "Courier", "Archivist", "Arbiter"].sort(() => Math.random() - 0.5);
      const mockRoles = ["Detective", ...baseRoles];
      const mockSession = uuidv4(); // Generate unique session

      setSessionId(mockSession);
      setRoleSequence(mockRoles);
      setCurrentStageIndex(0);
      setFragments([]);
      setHp(100);

      saveState(mockSession, mockRoles, 0, []);
      return true;
    } catch (error) {
      console.error("Failed to boot game session", error);
      return false;
    }
  };

  // Next Stage logic
  const nextStage = (fragmentCode) => {
    if (fragmentCode) {
      const newFragments = [...fragments, fragmentCode];
      setFragments(newFragments);
      const newStageIndex = currentStageIndex + 1;
      setCurrentStageIndex(newStageIndex);
      saveState(sessionId, roleSequence, newStageIndex, newFragments);
    }
  };
  
  // Clear game data
  const resetGame = () => {
      localStorage.removeItem("tlr_session_id");
      localStorage.removeItem("tlr_roles");
      localStorage.removeItem("tlr_stage_index");
      localStorage.removeItem("tlr_fragments");
      setSessionId(null);
      setRoleSequence([]);
      setCurrentStageIndex(0);
      setFragments([]);
  };

  return (
    <GameContext.Provider
      value={{
        sessionId,
        roleSequence,
        currentStageIndex,
        currentRole: roleSequence[currentStageIndex],
        fragments,
        hp,
        setHp,
        startNewGame,
        nextStage,
        resetGame
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

export const useGame = () => useContext(GameContext);
