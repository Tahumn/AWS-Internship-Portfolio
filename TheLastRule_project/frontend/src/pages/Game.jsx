import { useState } from "react";

import bgImage from "../assets/game-bg.jpg";

import StatusBar from "../components/StatusBar";
import ObjectArea from "../components/ObjectArea";
import StoryBox from "../components/StoryBox";
import JournalPanel from "../components/JournalPanel";
import InventoryPanel from "../components/InventoryPanel";
import CommandInput from "../components/CommandInput";
import ActionBar from "../components/ActionBar";

function Game() {
  const player =
    JSON.parse(localStorage.getItem("player")) || {
      name: "Unknown",
      origin: "Unknown",
    };

  const [hp] = useState(100);
  const [turn] = useState(0);

  const [story, setStory] = useState([
    "Bạn tỉnh dậy giữa một hầm ngục cổ xưa.",
    "Không khí lạnh buốt bao trùm khắp nơi.",
    "Ba vật thể kỳ lạ xuất hiện trước mặt.",
  ]);

  const [journal] = useState([
    "Có 3 vật thể phát sáng.",
  ]);

  const [inventory] = useState([
    "Phù chú cổ",
    "Mảnh ngọc",
  ]);

  const [action, setAction] = useState("");

  const handleShortcut = (text) => {
    setAction(text);
  };

  const handleObjectClick = (objectName) => {
    setAction(`Chạm ${objectName}`);
  };

  const handleSend = () => {
    if (!action.trim()) return;

    let response =
      "Bạn nghe thấy tiếng động kỳ lạ trong bóng tối...";

    if (action.includes("Quan sát")) {
      response =
        "Bạn phát hiện ngọn lửa Lam nhấp nháy mạnh hơn các vật thể còn lại.";
    }

    if (action.includes("Lục soát")) {
      response =
        "Bạn tìm thấy một mảnh giấy ghi dòng chữ: 'Khởi đầu từ ánh sáng lạnh nhất'.";
    }

    if (action.includes("Lam")) {
      response =
        "Ngọn lửa Lam rung động và phát ra tiếng ngân vang.";
    }

    if (action.includes("Đỏ")) {
      response =
        "Phù điêu Đỏ phát sáng trong chốc lát.";
    }

    if (action.includes("Vàng")) {
      response =
        "Đồng hồ Vàng bắt đầu chuyển động.";
    }

    setStory((prev) => [
      ...prev,
      `> ${action}`,
      response,
    ]);

    setAction("");
  };

  return (
    <div className="relative min-h-screen overflow-hidden text-white">

      {/* BACKGROUND IMAGE */}
      <div
        className="absolute inset-0 bg-cover bg-center scale-105"
        style={{
          backgroundImage: `url(${bgImage})`,
        }}
      />

      {/* DARK OVERLAY (QUAN TRỌNG) */}
      <div className="absolute inset-0 bg-black/50" />

      {/* GAME UI */}
      <div className="relative z-10 min-h-screen p-4 flex items-center justify-center">

        <div
          className="
w-full
max-w-[900px]
h-screen
            bg-black/60
            backdrop-blur-md
            border
            border-cyan-500/20
            rounded-2xl
            overflow-hidden
            flex
            flex-col
          "
        >
          <StatusBar
            hp={hp}
            turn={turn}
            playerName={player.name}
          />

          <ObjectArea
            onObjectClick={handleObjectClick}
          />

          <div
            className="
              flex-1
              p-4
              grid
              grid-cols-1
              lg:grid-cols-3
              gap-4
              overflow-hidden
            "
          >
            <div className="lg:col-span-2">
              <StoryBox story={story} />
            </div>

            <div className="flex flex-col gap-4">
              <JournalPanel journal={journal} />

              <InventoryPanel inventory={inventory} />
            </div>
          </div>

          <CommandInput
            action={action}
            setAction={setAction}
            handleSend={handleSend}
          />

          <ActionBar onAction={handleShortcut} />
        </div>

      </div>
    </div>
  );
}

export default Game;