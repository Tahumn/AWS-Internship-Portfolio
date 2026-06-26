import { useNavigate } from "react-router-dom";

function Home() {
    const navigate = useNavigate();

    return (
        <div
            className="
      h-screen
      bg-gradient-to-b
      from-black
      via-slate-900
      to-black
      text-white
      flex
      flex-col
      justify-center
      items-center
    "
        >

            <h1 className="text-7xl font-bold mb-4 tracking-widest">
                THE LAST RULE
            </h1>

            <p className="text-gray-400 mb-10">
                Read the clues - Every mistake is the last
            </p>

            <button
                onClick={() => navigate("/setup")}
                className="
        px-8
        py-4
        bg-cyan-500
        hover:bg-cyan-400
        rounded-xl
        font-bold
        transition
      "
            >
                START GAME
            </button>

        </div>
    );
}

export default Home;