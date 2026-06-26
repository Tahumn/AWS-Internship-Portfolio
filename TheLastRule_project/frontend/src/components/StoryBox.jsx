function StoryBox({ story }) {
  return (
    <div
      className="
        h-full
        bg-black/40
        border
        border-cyan-500/30
        rounded-xl
        p-4
        overflow-y-auto
      "
    >
      <h2 className="text-xl font-bold mb-4">
        Câu chuyện
      </h2>

      <div className="space-y-4">
        {story.map((line, index) => (
          <div
            key={index}
            className="
        bg-slate-900/70
        p-3
        rounded-lg
        border
        border-cyan-500/20
      "
          >
            {line}
          </div>
        ))}
      </div>
    </div>
  );
}

export default StoryBox;