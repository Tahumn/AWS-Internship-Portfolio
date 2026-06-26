function InventoryPanel({ inventory }) {
  return (
    <div
      className="
        bg-black/40
        border
        border-yellow-500/30
        rounded-xl
        p-4
      "
    >
      <h3 className="text-yellow-400 font-bold mb-3">
        Túi đồ
      </h3>

      <div className="flex flex-wrap gap-2">
        {inventory.map((item, index) => (
          <span
            key={index}
            className="
              px-2
              py-1
              bg-slate-800
              rounded-full
              text-xs
            "
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

export default InventoryPanel;