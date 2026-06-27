// import { useEffect, useState } from "react";

// function SplashScreen({ onFinish }) {
//   const [fade, setFade] = useState(false);

//   useEffect(() => {
//     const timer1 = setTimeout(() => {
//       setFade(true); // bắt đầu fade out
//     }, 3000);

//     const timer2 = setTimeout(() => {
//       onFinish(); // vào game
//     }, 4000);

//     return () => {
//       clearTimeout(timer1);
//       clearTimeout(timer2);
//     };
//   }, []);

//   return (
//     <div
//       className={`
//         fixed inset-0 flex items-center justify-center
//         bg-black text-white transition-opacity duration-1000
//         ${fade ? "opacity-0" : "opacity-100"}
//       `}
//     >
//       {/* BACKGROUND ANIMATION */}
//       <div className="absolute inset-0 overflow-hidden">
//         <div className="w-[200%] h-[200%] bg-gradient-to-br from-cyan-900 via-black to-purple-900 animate-pulse opacity-60" />
//       </div>

//       {/* FLOATING LIGHTS */}
//       <div className="absolute inset-0">
//         <div className="w-2 h-2 bg-cyan-400 rounded-full absolute top-1/3 left-1/4 animate-bounce"></div>
//         <div className="w-2 h-2 bg-purple-400 rounded-full absolute top-2/3 left-2/3 animate-pulse"></div>
//         <div className="w-2 h-2 bg-yellow-400 rounded-full absolute top-1/2 left-1/2 animate-ping"></div>
//       </div>

//       {/* TEXT INTRO */}
//       <div className="text-center z-10">
//         <h1 className="text-4xl font-bold tracking-widest animate-pulse">
//           THE LAST RULE
//         </h1>

//         <p className="mt-3 text-gray-300 animate-bounce">
//           Awakening the world...
//         </p>

//         {/* TYPE EFFECT SIMULATION */}
//         <p className="mt-6 text-sm text-cyan-300 animate-pulse">
//           "2026... the world begins to fall apart..."
//         </p>
//       </div>
//     </div>
//   );
// }

// export default SplashScreen;




import splashBg from "../assets/backgrounds/splash-bg.jpg";

import SplashLogo from "../components/SplashLogo";
import PressAnyKey from "../components/PressAnyKey";

function SplashScreen({ onFinish }) {
  return (
    <div
      onClick={onFinish}
      className="relative min-h-screen cursor-pointer overflow-hidden"
    >
      {/* Background */}
      <div
        className="
                  absolute
                  inset-0
                  bg-cover
                  bg-center
                  scale-105
                  animate-background
                "
        style={{
          backgroundImage: `url(${splashBg})`,
        }}
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60" />

      {/* Content */}
      <div
        className="
                  relative
                  z-10
                  flex
                  h-screen
                  flex-col
                  items-center
                  justify-center
                  -translate-y-28
                  gap-6
                "
      >
        <SplashLogo />

        <PressAnyKey />
      </div>
    </div>
  );
}

export default SplashScreen;