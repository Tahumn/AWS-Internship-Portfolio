// import { useState } from "react";
// import { BrowserRouter, Routes, Route } from "react-router-dom";

// import Home from "./pages/Home";
// import Setup from "./pages/Setup";
// import Game from "./pages/Game";
// import SplashScreen from "./pages/SplashScreen";

// function App() {
//   const [showSplash, setShowSplash] = useState(true);

//   return (
//     <>
//       {showSplash ? (
//         <SplashScreen onFinish={() => setShowSplash(false)} />
//       ) : (
//         <BrowserRouter>
//           <Routes>
//             <Route path="/" element={<Home />} />
//             <Route path="/setup" element={<Setup />} />
//             <Route path="/game" element={<Game />} />
//           </Routes>
//         </BrowserRouter>
//       )}
//     </>
//   );
// }

// export default App;





import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import SplashScreen from "./pages/SplashScreen";
import LandingPage from "./pages/LandingPage";
import GameEngine from "./pages/GameEngine";
import MapDetective from "./pages/maps/MapDetective";

function App() {
  const [showSplash, setShowSplash] = useState(true);

  if (showSplash) {
    return (
      <SplashScreen
        onFinish={() => setShowSplash(false)}
      />
    );
  }

  return (
    <BrowserRouter>
      <Routes>

        <Route
          path="/"
          element={<LandingPage />}
        />
        <Route
          path="/game"
          element={<GameEngine />}
        />
        <Route
          path="/game/detective"
          element={<MapDetective />}
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;