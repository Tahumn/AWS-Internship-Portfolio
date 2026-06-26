function ActionBar() {
  const actions = [
    "Quan sát",
    "Lục soát",
    "Chạm Lam",
    "Chạm Đỏ",
    "Chạm Vàng",
  ];

  return (
    <div
      className="
        px-4
        pb-4
        flex
        gap-2
        overflow-x-auto
      "
    >
      {actions.map((action) => (
        <button
          onClick={() => onAction(action)}
          key={action}
          className="
            px-3
            py-2
            border
            border-cyan-500
            rounded-full
            whitespace-nowrap
          "
        >
          {action}
        </button>
      ))}
    </div>
  );
}

export default ActionBar;