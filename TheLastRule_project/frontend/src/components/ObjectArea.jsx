function ObjectArea({ onObjectClick }) {
  return (
    <div className="flex justify-around py-6">
      <div className="text-center">
        <div className="text-5xl mb-2">🔵</div>

        <button
          onClick={() => onObjectClick("Lam")}
          className="
            px-4
            py-1
            border
            border-cyan-500
            rounded-full
            hover:bg-cyan-500/20
            transition
          "
        >
          Lam
        </button>
      </div>

      <div className="text-center">
        <div className="text-5xl mb-2">🔴</div>

        <button
          onClick={() => onObjectClick("Đỏ")}
          className="
            px-4
            py-1
            border
            border-red-500
            rounded-full
            hover:bg-red-500/20
            transition
          "
        >
          Đỏ
        </button>
      </div>

      <div className="text-center">
        <div className="text-5xl mb-2">🟡</div>

        <button
          onClick={() => onObjectClick("Vàng")}
          className="
            px-4
            py-1
            border
            border-yellow-500
            rounded-full
            hover:bg-yellow-500/20
            transition
          "
        >
          Vàng
        </button>
      </div>
    </div>
  );
}

export default ObjectArea;