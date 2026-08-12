import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars, Sphere, Box } from '@react-three/drei';
import * as THREE from 'three';
import { useGame } from '../../context/GameContext';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

// --- CONFIG & CONSTANTS ---
const COLORS = {
  bg: '#050510',
  redAccent: '#ff1133',
  decoyYellow: '#ffdd00',
  decoyBlue: '#00eeff',
  greenSuccess: '#00ff44',
  scanOverlay: 'rgba(255, 17, 51, 0.2)'
};
const CUBES_COUNT = 300;
const RADIUS = 15;

// --- 3D COMPONENTS ---
const DataCube = ({ position, type, id, onScanSuccess, onDecoyClick, isScanning, onStartScan, onStopScan }) => {
  const meshRef = useRef();
  const [active, setActive] = useState(true);
  const scanProgress = useRef(0);

  const isTarget = type === 'target';

  useFrame((state, delta) => {
    if (!active) return;
    meshRef.current.rotation.x += delta * (isTarget ? 0.5 : 0.2);
    meshRef.current.rotation.y += delta * (isTarget ? 0.5 : 0.2);

    if (isTarget) {
      // Glitch effect scales
      meshRef.current.scale.setScalar(1 + Math.random() * 0.1);
    }

    if (isScanning === id) {
      scanProgress.current += delta;
      if (scanProgress.current >= 2.0) {
        setActive(false);
        onStopScan();
        if (isTarget) onScanSuccess(id);
      }
    } else {
      scanProgress.current = 0;
    }
  });

  if (!active) return null;

  return (
    <Box
      ref={meshRef}
      position={position}
      args={isTarget ? [1.8, 1.8, 1.8] : [0.8, 0.8, 0.8]}
      onPointerDown={(e) => {
        e.stopPropagation();
        if (isTarget) onStartScan(id);
        else onDecoyClick();
      }}
      onPointerUp={(e) => {
        e.stopPropagation();
        if (isTarget) onStopScan();
      }}
      onPointerOut={(e) => {
        e.stopPropagation();
        if (isTarget) onStopScan();
      }}
    >
      {isTarget ? (
        <meshStandardMaterial color={COLORS.redAccent} emissive={COLORS.redAccent} emissiveIntensity={2} wireframe />
      ) : (
        <meshStandardMaterial
          color={type === 'yellow' ? COLORS.decoyYellow : COLORS.decoyBlue}
          emissive={type === 'yellow' ? COLORS.decoyYellow : COLORS.decoyBlue}
          emissiveIntensity={0.5}
          transparent opacity={0.6}
        />
      )}
    </Box>
  );
};

const SecurityBot = ({ position, onHit, speedMult, onReachTarget }) => {
  const ref = useRef();
  const speed = 2 * speedMult;
  const hp = useRef(1); // 1 click to destroy

  useFrame((state, delta) => {
    if (!ref.current || hp.current <= 0) return;
    const pos = ref.current.position;
    const dir = new THREE.Vector3().subVectors(new THREE.Vector3(0, 0, 0), pos).normalize();
    pos.add(dir.multiplyScalar(speed * delta));
    ref.current.lookAt(0, 0, 0);

    if (pos.length() < 2.5) {
      hp.current = 0;
      onReachTarget();
    }
  });

  if (hp.current <= 0) return null;

  return (
    <group ref={ref} position={position}>
      <Box args={[1.5, 2.5, 1.5]}>
        <meshStandardMaterial color="#222" wireframe />
      </Box>
      <Sphere args={[0.5, 16, 16]} position={[0, Math.random() > 0.5 ? 1 : 0, 1]}
        onPointerDown={(e) => {
          e.stopPropagation();
          hp.current = 0;
          onHit();
        }}
      >
        <meshStandardMaterial color={COLORS.redAccent} emissive={COLORS.redAccent} emissiveIntensity={3} />
      </Sphere>
    </group>
  );
};

// --- MAIN PORTAL ---
export default function MapDetective() {
  const { sessionId, hp, setHp, nextStage } = useGame();
  const navigate = useNavigate();

  // STAGES: SCAN, TIMELINE, CIPHER, CINEMATIC, GAMEOVER
  const [stage, setStage] = useState("SCAN");

  // --- SCAN PHASE ---
  const [scanningId, setScanningId] = useState(null);
  const [fragments, setFragments] = useState([]); // found ones
  const [decoyClicks, setDecoyClicks] = useState(0);
  const [botSpeedMult, setBotSpeedMult] = useState(1);
  const [showLog, setShowLog] = useState(null); // Which log is open

  const allTargets = useMemo(() => [
    { id: 'alpha', time: '+ 24:00:00', text: 'Hệ thống ... xóa sạch ... Công dân hoàn toàn mất danh tính.', letter: 'C' },
    { id: 'beta', time: '00:00:00', text: 'Thực thể xâm nhập ... L lõi điều hành.', letter: 'L' },
    { id: 'gamma', time: '+ 48:00:00', text: 'Ban bố điều luật ... Biểu cảm bị xem là phản loạn.', letter: 'B' }
  ], []);

  // Generate background cubes
  const cubes = useMemo(() => {
    let arr = [];
    for (let i = 0; i < CUBES_COUNT; i++) {
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      const r = RADIUS + Math.random() * 10;
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);
      arr.push({ pos: [x, y, z], type: Math.random() > 0.5 ? 'yellow' : 'blue', id: `decoy-${i}` });
    }
    // inject 3 targets far apart roughly
    const t1 = [0, 5, -RADIUS];
    const t2 = [RADIUS, -5, 0];
    const t3 = [-RADIUS * .7, 0, RADIUS * .7];
    arr.push({ pos: t1, type: 'target', id: 'alpha' });
    arr.push({ pos: t2, type: 'target', id: 'beta' });
    arr.push({ pos: t3, type: 'target', id: 'gamma' });
    return arr;
  }, []);

  const handleDecoyClick = () => {
    setDecoyClicks(c => {
      const nc = c + 1;
      if (nc >= 3) {
        setBotSpeedMult(2); // alarm, double speed
      }
      return nc;
    });
  };

  const handleScanSuccess = (id) => {
    const frag = allTargets.find(t => t.id === id);
    if (frag && !fragments.find(f => f.id === id)) {
      setFragments(prev => {
        const nf = [...prev, frag];
        if (nf.length === 3) {
          setTimeout(() => setStage("TIMELINE"), 2000);
        }
        return nf;
      });
      setShowLog(frag);
    }
  };

  // --- TIMELINE PHASE ---
  const [timelineOrder, setTimelineOrder] = useState([]);
  const [timelineStatus, setTimelineStatus] = useState("DRAG ITEMS INTO CORRECT ORDER");

  const handleTimelineSubmit = () => {
    if ([0, 1, 2].some(i => !timelineOrder[i])) {
      setTimelineStatus("FILL ALL 3 TIMELINE SLOTS");
      return;
    }
    const correct = ['beta', 'alpha', 'gamma'];
    const isCorrect = timelineOrder.every((id, i) => id === correct[i]);
    if (isCorrect) {
      setTimelineStatus("SUCCESS! PROCEEDING TO CIPHER...");
      setTimeout(() => setStage("CIPHER"), 2000);
    } else {
      setTimelineStatus("SYSTEM ERROR! -20% HP");
      setHp(prev => Math.max(0, prev - 20));
      // Reset
      setTimelineOrder([]);
    }
  };

  // --- CIPHER & BOT PHASE ---
  const [bots, setBots] = useState([]);
  const [cipherInput, setCipherInput] = useState("");
  const [cipherStatus, setCipherStatus] = useState("");
  const botIdCounter = useRef(0);

  useEffect(() => {
    if (stage === "CIPHER") {
      const interval = setInterval(() => {
        botIdCounter.current += 1;

        // Random spherical pos
        const angle = Math.random() * Math.PI * 2;
        const x = Math.cos(angle) * (RADIUS + 5);
        const z = Math.sin(angle) * (RADIUS + 5);
        const pos = [x, (Math.random() - 0.5) * 10, z];

        const newBot = { id: botIdCounter.current, pos };
        setBots(prev => [...prev, newBot]);
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [stage]);

  const verifyCode = async () => {
    if (cipherInput.toUpperCase() === "HYX") {
      setCipherStatus("");
      setStage("CINEMATIC");

      // MOCK BACKEND
      console.log("POST /detective/verify -> SESSION:", sessionId, "KEY: HYX");

      setTimeout(() => {
        nextStage("MAP1_DETECTIVE_CLEARED");
        navigate("/game"); // go back to game engine UI for next role
      }, 5000);
    } else {
      setCipherStatus("MẬT MÃ KHÔNG ĐÚNG — HÃY THỬ LẠI");
    }
  };

  // DRAG & DROP UTILS
  const availableDrags = allTargets.filter(t => !timelineOrder.includes(t.id));

  // --- RENDER ---
  return (
    <div className="w-full h-screen relative bg-black font-mono overflow-hidden select-none">

      {/* 3D SCENE */}
      <div className="absolute inset-0 z-0">
        <Canvas camera={{ position: [0, 0, 32], fov: 65 }}>
          <color attach="background" args={[COLORS.bg]} />
          <ambientLight intensity={0.5} />
          <pointLight position={[0, 0, 0]} intensity={2} color="#ffffff" />
          <Stars radius={50} depth={50} count={2000} factor={4} saturation={0} fade speed={1} />

          <OrbitControls
            enableZoom
            enablePan={false}
            minDistance={7}
            maxDistance={40}
            rotateSpeed={0.65}
            zoomSpeed={0.8}
          />

          {/* Central Platform */}
          <Sphere args={[2, 32, 32]} position={[0, -2.5, 0]}>
            <meshStandardMaterial color="#222" metalness={0.8} roughness={0.2} />
          </Sphere>

          {/* CUBES (Phase 1) */}
          {stage === "SCAN" && cubes.map(cube => (
            <DataCube
              key={cube.id}
              id={cube.id}
              position={cube.pos}
              type={cube.type}
              isScanning={scanningId}
              onStartScan={(id) => setScanningId(id)}
              onStopScan={() => setScanningId(null)}
              onDecoyClick={handleDecoyClick}
              onScanSuccess={handleScanSuccess}
            />
          ))}

          {/* BOTS (Phase 3) */}
          {(stage === "CIPHER") && bots.map(bot => (
            <SecurityBot
              key={bot.id}
              position={bot.pos}
              speedMult={botSpeedMult}
              onHit={() => {
                setBots(prev => prev.filter(b => b.id !== bot.id));
              }}
              onReachTarget={() => {
                setHp(prev => {
                  const curr = prev - 34; // 3 hits
                  if (curr <= 0) setStage("GAMEOVER");
                  return Math.max(0, curr);
                });
                setBots(prev => prev.filter(b => b.id !== bot.id));
              }}
            />
          ))}
        </Canvas>
      </div>

      {/* OVERLAYS */}
      <div className="absolute inset-0 pointer-events-none z-10 flex flex-col justify-between p-6">

        {/* TOP HUD */}
        <div className="flex justify-between items-start w-full">
          <div className="text-red-500 font-bold bg-black/50 p-2 border border-red-500/50">
            SYSTEM INTEGRITY: {hp}%
          </div>
          {stage === "SCAN" && (
            <div className="max-w-md bg-black/75 border border-cyan-500/60 p-3 text-cyan-200 text-sm text-right">
              <p className="font-bold text-cyan-400">SCAN RED DATA CUBES: {fragments.length}/3</p>
              <p>Drag to rotate · Scroll to zoom · Hold a red cube for 2 seconds</p>
            </div>
          )}
          {decoyClicks >= 3 && stage === "SCAN" && (
            <div className="text-red-500 text-xl font-bold animate-pulse p-2 bg-red-900/50 border border-red-500">
              WARNING: DECOY ALARM! ENEMY SPEED x2
            </div>
          )}
        </div>

        {/* SCANNING PROGRESS UI */}
        {scanningId && stage === "SCAN" && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
            <div className="text-red-500 font-black animate-pulse text-2xl tracking-[0.5em]">SCANNING...</div>
          </div>
        )}

        {/* HOLOGRAPHIC LOG VIEWER (Scan Phase) */}
        <AnimatePresence>
          {showLog && stage === "SCAN" && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              className="absolute inset-x-20 bottom-10 bg-black/80 border-2 border-red-500 p-6 pointer-events-auto shadow-[0_0_30px_rgba(255,17,51,0.5)]"
            >
              <h3 className="text-yellow-400 font-bold mb-2">FRAGMENT RECOVERED:</h3>
              <p className="text-white text-lg">[{showLog.time}] {showLog.text}</p>
              <button
                onClick={() => setShowLog(null)}
                className="mt-4 px-4 py-2 border border-red-500 text-red-500 hover:bg-red-500 hover:text-black transition"
              >
                CLOSE [X]
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* TIMELINE PHASE UI */}
        {stage === "TIMELINE" && (
          <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center p-10 pointer-events-auto">
            <h2 className="text-3xl text-cyan-400 mb-2">TIMELINE RECOVERY</h2>
            <p className="text-red-400 mb-8">{timelineStatus}</p>

            {/* Slots */}
            <div className="flex gap-4 mb-12">
              {[0, 1, 2].map((idx) => (
                <div
                  key={idx}
                  className="w-64 h-32 border-2 border-dashed border-cyan-800 flex items-center justify-center bg-cyan-900/20 text-cyan-200 p-2 text-sm text-center"
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    const id = e.dataTransfer.getData("text/plain");
                    if (!timelineOrder[idx] && !timelineOrder.includes(id)) {
                      const newArr = [...timelineOrder];
                      newArr[idx] = id;
                      setTimelineOrder(newArr);
                    }
                  }}
                >
                  {timelineOrder[idx] ? (
                    <div>
                      {allTargets.find(t => t.id === timelineOrder[idx]).time}
                      <hr className="border-cyan-800 my-1" />
                      {allTargets.find(t => t.id === timelineOrder[idx]).text}
                      <button
                        onClick={() => {
                          const arr = [...timelineOrder];
                          arr[idx] = null;
                          setTimelineOrder(arr);
                        }}
                        className="text-xs text-red-500 mt-2 hover:underline block mx-auto"
                      >Remove</button>
                    </div>
                  ) : "DROP HERE"}
                </div>
              ))}
            </div>

            {/* Draggables */}
            <div className="flex gap-4">
              {availableDrags.map(t => (
                <div
                  key={t.id}
                  draggable
                  onDragStart={(e) => e.dataTransfer.setData("text/plain", t.id)}
                  className="w-48 p-3 border border-yellow-500 bg-yellow-900/30 text-yellow-300 cursor-grab text-xs"
                >
                  [{t.time}] {t.text}
                </div>
              ))}
            </div>

            <button
              onClick={handleTimelineSubmit}
              className="mt-12 px-8 py-3 bg-red-600 text-white font-bold tracking-widest hover:bg-red-500"
            >
              CONFIRM SEQUENCE
            </button>
          </div>
        )}

        {/* CIPHER PHASE UI */}
        {stage === "CIPHER" && (
          <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 bg-black/90 border-2 border-red-500 p-6 pointer-events-auto flex flex-col items-center">
            <h2 className="text-xl text-red-500 mb-2">BÁO CÁO CHẨN ĐOÁN HỆ THỐNG</h2>
            <p className="text-yellow-400 mb-4 whitespace-pre-line text-center text-sm">
              "Lấy các chữ cái in hoa đầu câu để tìm MẬT MÃ GỐC.\n
              Sử dụng mốc thời gian của mảnh cuối để lấy HÀNG CHỤC làm số bước.\n
              Dịch lùi về sau trong bảng chữ cái."
            </p>

            {/* Alphabet Strip */}
            <div className="flex bg-gray-900 border border-gray-600 p-2 mb-4 overflow-x-auto max-w-full">
              {"ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").map((c, i) => (
                <span key={i} className="px-2 border-r border-gray-700 text-gray-400">{c}</span>
              ))}
            </div>

            <div className="flex gap-2 text-black">
              <input
                type="text"
                value={cipherInput}
                onChange={(e) => {
                  setCipherInput(e.target.value.toUpperCase().slice(0, 3));
                  setCipherStatus("");
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") verifyCode();
                }}
                className="w-32 bg-gray-300 p-2 font-bold text-center text-2xl tracking-widest uppercase"
                placeholder="XXX"
              />
              <button
                onClick={verifyCode}
                className="px-6 py-2 bg-red-600 text-white font-bold hover:bg-red-500"
              >
                ENTER
              </button>
            </div>
            {cipherStatus && (
              <p className="mt-3 text-red-400 font-bold animate-pulse">{cipherStatus}</p>
            )}
          </div>
        )}

        {/* CINEMATIC / WIN */}
        <AnimatePresence>
          {stage === "CINEMATIC" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 bg-green-500/90 pointer-events-auto flex flex-col items-center justify-center text-center p-10 z-50 text-white mix-blend-screen"
            >
              <h1 className="text-5xl font-black mb-4">ACCESS GRANTED</h1>
              <p className="text-xl">"Cảnh báo... Lõi dữ liệu bị can thiệp. Quy luật số 01 đã bị xóa bỏ khỏi thư mục gốc... Hệ thống mất kiểm soát phân khu..."</p>
              <p className="mt-8 text-2xl text-yellow-300 animate-pulse font-bold">Rule Piece 01 Recovered.</p>
            </motion.div>
          )}

          {stage === "GAMEOVER" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 bg-red-900 pointer-events-auto flex flex-col items-center justify-center text-center p-10 z-50 text-white"
            >
              <h1 className="text-6xl font-black mb-4 animate-pulse">SYSTEM CRITICAL FAILURE</h1>
              <p className="text-2xl">TERMINAL DESTROYED BY SECURITY BOT.</p>
              <button
                onClick={() => navigate("/")}
                className="mt-8 px-6 py-3 border border-red-400 text-red-200 hover:bg-red-800"
              >BACK TO MENU</button>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
