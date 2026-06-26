function CommandInput({
  action,
  setAction,
  handleSend,
}) {
  return (
    <div className="p-4 flex gap-2">
      <input
        value={action}
        onChange={(e) =>
          setAction(e.target.value)
        }
        placeholder="Nhập lệnh..."
        className="
          flex-1
          bg-slate-900
          border
          border-slate-700
          rounded-xl
          p-3
        "
      />

      <button
        onClick={handleSend}
        className="
          px-5
          bg-yellow-400
          text-black
          rounded-xl
          font-bold
        "
      >
        Gửi
      </button>
    </div>
  );
}

export default CommandInput;