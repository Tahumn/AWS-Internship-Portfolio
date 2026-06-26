function StatusBar({ hp, turn, playerName }) {
  return (
    <div className="p-4 border-b border-cyan-500/20">

      <div className="flex justify-between items-center mb-3">

        <h1 className="text-xl font-bold text-cyan-400">
          THE LAST RULE
        </h1>

        <span className="text-cyan-400 text-sm">
          {playerName}
        </span>

      </div>

      <div className="flex items-center gap-3">

        <div className="flex-1">

          <div className="bg-slate-800 rounded-full h-6 overflow-hidden">

            <div
              className="
                bg-gradient-to-r
                from-red-700
                to-red-400
                h-full
                flex
                items-center
                justify-center
                text-xs
                font-bold
                transition-all
                duration-500
              "
              style={{
                width: `${hp}%`,
              }}
            >
              HP: {hp}/100
            </div>

          </div>

        </div>

        <div
          className="
            px-3
            py-1
            bg-slate-800
            rounded-full
            text-sm
          "
        >
          Turn {turn}/15
        </div>

      </div>

    </div>
  );
}

export default StatusBar;