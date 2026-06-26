import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Setup() {
  const navigate = useNavigate();

  const [playerName, setPlayerName] = useState("");
  const [origin, setOrigin] = useState("");

  const handleStart = () => {
    if (!playerName) {
      alert("Please enter your name");
      return;
    }

    if (!origin) {
      alert("Please choose an origin");
      return;
    }

    localStorage.setItem(
      "player",
      JSON.stringify({
        name: playerName,
        origin: origin,
      })
    );

    navigate("/game");
  };

  return (
    <div
      className="
        min-h-screen
        bg-black
        text-white
        flex
        flex-col
        items-center
        justify-center
      "
    >
      <h1 className="text-5xl font-bold mb-10 text-cyan-400">
        CHARACTER SETUP
      </h1>

      <input
        type="text"
        placeholder="Enter your name..."
        value={playerName}
        onChange={(e) => setPlayerName(e.target.value)}
        className="
          w-80
          p-4
          rounded-xl
          bg-slate-900
          border
          border-cyan-500
          mb-8
        "
      />

      <div className="flex flex-col gap-4 mb-10">

        <button
          onClick={() => setOrigin("Dungeon")}
          className={`
            p-4 rounded-xl border
            ${origin === "Dungeon"
              ? "bg-cyan-500 text-black"
              : "border-cyan-500"}
          `}
        >
          Ancient Dungeon
        </button>

        <button
          onClick={() => setOrigin("Forest")}
          className={`
            p-4 rounded-xl border
            ${origin === "Forest"
              ? "bg-cyan-500 text-black"
              : "border-cyan-500"}
          `}
        >
          Dark Forest
        </button>

        <button
          onClick={() => setOrigin("Space Station")}
          className={`
            p-4 rounded-xl border
            ${origin === "Space Station"
              ? "bg-cyan-500 text-black"
              : "border-cyan-500"}
          `}
        >
          Abandoned Space Station
        </button>

      </div>

      <button
        onClick={handleStart}
        className="
          px-8
          py-4
          bg-cyan-500
          text-black
          rounded-xl
          font-bold
        "
      >
        EMBARK
      </button>
    </div>
  );
}

export default Setup;