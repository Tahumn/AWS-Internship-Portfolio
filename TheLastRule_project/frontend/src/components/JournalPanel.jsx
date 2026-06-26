function JournalPanel({ journal }) {
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
        Sổ tay
      </h3>

      {journal.map((clue, index) => (
        <p key={index}>
          • {clue}
        </p>
      ))}
    </div>
  );
}

export default JournalPanel;