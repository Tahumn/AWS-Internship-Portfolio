import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Setup from "./pages/Setup";
import Game from "./pages/Game";
import SplashScreen from "./pages/SplashScreen";

function App() {
  const [showSplash, setShowSplash] = useState(true);

  return (
    <>
      {showSplash ? (
        <SplashScreen onFinish={() => setShowSplash(false)} />
      ) : (
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/setup" element={<Setup />} />
            <Route path="/game" element={<Game />} />
          </Routes>
        </BrowserRouter>
      )}
    </>
  );
}

export default App;