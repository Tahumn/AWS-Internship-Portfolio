import { useNavigate } from "react-router-dom";

function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <div className="text-center">

        <h1 className="text-7xl font-bold mb-6">
          THE LAST RULE
        </h1>

        <p className="text-gray-400 mb-10">
          Read the clues. Every mistake is the last.
        </p>

        <button
          onClick={() => navigate("/character")}
          className="
            px-10
            py-4
            rounded-xl
            bg-cyan-500
            text-black
            font-bold
          "
        >
          START GAME
        </button>

      </div>
    </div>
  );
}

export default LandingPage;