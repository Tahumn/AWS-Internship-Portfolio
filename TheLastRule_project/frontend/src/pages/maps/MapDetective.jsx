import { useState, useRef, useEffect, useCallback } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars, Text, Box } from '@react-three/drei';
import { useGame } from '../../context/GameContext';

// ═══════════════════════════════════════════════════════════════
// DỮ LIỆU KỊCH BẢN
// ═══════════════════════════════════════════════════════════════

// 3 mảnh lore từ Data Cube -- Người chơi phải đọc để suy ra:
//  • Tên thực thể kiểm soát = N.E.X.U.S → viết tắt = NEXUS (đáp án cipher)
//  • Mã lỗi 0x07 → số thập phân = 7 (số dịch Caesar)
//  • Chuỗi đã mã hóa UFWXJ nằm trong Vault (phase 3)
const CUBES = [
  {
    id: 1,
    position: [-4, 0, -2],
    label: "NODE-01",
    title: "Citizen Record — DELETED",
    logs: [
      "[ERR:IDENTITY_WIPE] Citizen ID #01528",
      "Name: [REDACTED] — Status: PERMANENTLY DELETED",
      "Last override command sent by:",
      "  ► Neural Evolutionary eXecution Unified System",
      "  ► Authorisation: CORE-LEVEL SUPREME",
      "---",
      "// The entity that erased us carries its own name.",
      "// Its acronym is the key to everything.",
    ],
  },
  {
    id: 2,
    position: [0, 0, -2],
    label: "NODE-02",
    title: "System Interrupt Log — ERR 0x07",
    logs: [
      "[ERR:0x07] Anomaly interrupt on cipher clock",
      "All encrypted streams offset by: ERROR_CODE",
      "ERROR_CODE → hexadecimal: 0x07",
      "ERROR_CODE → decimal: 7",
      "---",
      "Timestamp: Before identity wipe of #01528",
      "Timestamp: After virus ANOMALY penetrated core",
      "---",
      "// The shift is the error code — in decimal, not hex.",
    ],
  },
  {
    id: 3,
    position: [4, 0, -2],
    label: "NODE-03",
    title: "Vault Fragment — Encrypted Entry",
    logs: [
      "[VAULT FRAGMENT] Last encrypted system log",
      "Source: Primary identity record prior to wipe",
      "---",
      "  STRING: UFWXJ",
      "  STATUS: CIPHER-LOCKED",
      "---",
      "// This string was encrypted using a Caesar shift.",
      "// Find the shift from NODE-02.",
      "// Find the expected decoded word from NODE-01.",
    ],
  },
];

// Timeline: 3 sự kiện bị đảo lộn thứ tự — thứ tự ĐÚNG là C → B → A
const TIMELINE_EVENTS = [
  { id: 'A', text: 'A. Citizens Lost Identity — All records wiped.' },
  { id: 'B', text: 'B. AI Updated Rules — Laws changed every 24h.' },
  { id: 'C', text: 'C. Virus Entered Core — ANOMALY detected in N.E.X.U.S.' },
];
const CORRECT_ORDER = ['C', 'B', 'A']; // Thứ tự đúng theo dòng thời gian

// ═══════════════════════════════════════════════════════════════
// 3D Data Cube Component
// ═══════════════════════════════════════════════════════════════
function DataCube({ cube, isScanned, onClick }) {
  const ref = useRef();
  useFrame((_, d) => {
    ref.current.rotation.y += d * (isScanned ? 0.15 : 0.8);
    ref.current.rotation.x += d * (isScanned ? 0.05 : 0.3);
  });
  return (
    <group position={cube.position}>
      <Box ref={ref} args={[1.4, 1.4, 1.4]} onClick={onClick}>
        <meshStandardMaterial
          color={isScanned ? '#00ff88' : '#ff1144'}
          emissive={isScanned ? '#00ff88' : '#ff1144'}
          emissiveIntensity={isScanned ? 0.6 : 3}
          wireframe
        />
      </Box>
      <Text position={[0, -1.2, 0]} color={isScanned ? '#00ff88' : '#ff4466'} fontSize={0.22} anchorX="center">
        {isScanned ? '✓ SCANNED' : cube.label}
      </Text>
    </group>
  );
}

// ═══════════════════════════════════════════════════════════════
// Security Bot Component (2D overlay, tiến về giữa màn hình)
// ═══════════════════════════════════════════════════════════════
function SecurityBot({ bot, onShoot }) {
  return (
    <div
      className="absolute z-50 select-none"
      style={{
        left: bot.x,
        top: bot.y,
        transform: 'translate(-50%, -50%)',
        transition: 'left 0.3s linear, top 0.3s linear',
      }}
    >
      <div className="relative">
        {/* Bot body */}
        <div className="w-16 h-20 border-2 border-red-500 bg-black/80 flex flex-col items-center justify-center shadow-[0_0_12px_red]">
          <div className="text-2xl">🤖</div>
          <div className="text-red-500 text-[9px] font-mono mt-1">SEC-BOT</div>
        </div>
        {/* Điểm đỏ cần click để tiêu diệt */}
        <button
          onClick={(e) => { e.stopPropagation(); onShoot(bot.id); }}
          className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 bg-red-600 rounded-full border-2 border-red-200 hover:bg-white cursor-crosshair animate-ping-slow shadow-[0_0_8px_red]"
          title="Click to repel!"
        />
        <div className="text-red-400 text-[8px] font-mono text-center mt-1">▲ WEAK SPOT</div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// COMPONENT CHÍNH: MapDetective
// ═══════════════════════════════════════════════════════════════
export default function MapDetective() {
  const { nextStage, hp, setHp } = useGame();

  // ── Phase management ──────────────────────
  // 'scan' → 'timeline' → 'cipher' → 'victory'
  const [phase, setPhase] = useState('scan');

  // ── Phase 1: Scan Data ────────────────────
  const [scannedIds, setScannedIds] = useState([]);
  const [activeLog, setActiveLog] = useState(null);

  // ── Phase 2: Timeline Recovery ────────────
  const [timelineOrder, setTimelineOrder] = useState(['A', 'B', 'C']); // bị đảo ban đầu
  const [dragItem, setDragItem]   = useState(null);
  const [securityAlert, setSecurityAlert] = useState(0); // 0..3
  const [timelineMsg, setTimelineMsg] = useState(null);

  // ── Phase 3: Cipher Break ─────────────────
  const [cipherInput, setCipherInput]     = useState('');
  const [cipherMsg, setCipherMsg]         = useState(null);
  const [bots, setBots]                   = useState([]);
  const [missedClicks, setMissedClicks]   = useState(0);
  const botIdRef = useRef(0);
  const botTimerRef = useRef(null);

  const allScanned = scannedIds.length === 3;

  // ── Phase 1: Click cube ───────────────────
  const handleScan = (cube) => {
    setActiveLog(cube);
    if (!scannedIds.includes(cube.id)) setScannedIds(prev => [...prev, cube.id]);
  };

  // ── Phase 2: Drag & Drop timeline ─────────
  const handleDragStart = (id) => setDragItem(id);
  const handleDrop = (targetId) => {
    if (!dragItem || dragItem === targetId) return;
    setTimelineOrder(prev => {
      const next = [...prev];
      const a = next.indexOf(dragItem);
      const b = next.indexOf(targetId);
      [next[a], next[b]] = [next[b], next[a]];
      return next;
    });
    setDragItem(null);
  };

  const handleTimelineSubmit = () => {
    if (JSON.stringify(timelineOrder) === JSON.stringify(CORRECT_ORDER)) {
      setTimelineMsg({ ok: true, text: '✅ Timeline restored. Vault access unlocked.' });
      setTimeout(() => setPhase('cipher'), 1500);
    } else {
      const newAlert = securityAlert + 1;
      setSecurityAlert(newAlert);
      setTimelineMsg({
        ok: false,
        text: `❌ INCORRECT ORDER — Security Alert Level: ${newAlert}/3${newAlert >= 3 ? ' — Secondary lockdown triggered!' : ''}`,
      });
      if (newAlert >= 3) setHp(prev => Math.max(0, prev - 30));
    }
  };

  // ── Phase 3: Spawn bots ───────────────────
  const spawnBot = useCallback(() => {
    const edge = Math.random();
    let x, y;
    if (edge < 0.25)      { x = Math.random() * window.innerWidth;  y = 0; }
    else if (edge < 0.5)  { x = Math.random() * window.innerWidth;  y = window.innerHeight; }
    else if (edge < 0.75) { x = 0;                                   y = Math.random() * window.innerHeight; }
    else                  { x = window.innerWidth;                   y = Math.random() * window.innerHeight; }

    const id = ++botIdRef.current;
    setBots(prev => [...prev, { id, x, y }]);

    // Bot dần tiến vào trung tâm
    setTimeout(() => {
      setBots(prev => prev.map(b =>
        b.id === id ? { ...b, x: window.innerWidth / 2, y: window.innerHeight / 2 } : b
      ));
    }, 100);

    // Nếu bot đến giữa mà chưa bị bắn
    setTimeout(() => {
      setBots(prev => {
        const still = prev.find(b => b.id === id);
        if (still) {
          setMissedClicks(m => {
            const next = m + 1;
            if (next >= 3) {
              setCipherMsg({ ok: false, text: '💀 3 BOTS BREACHED — SCREEN BROKEN. GAME OVER.' });
              setHp(0);
            }
            return next;
          });
          return prev.filter(b => b.id !== id);
        }
        return prev;
      });
    }, 4000);
  }, [setHp]);

  useEffect(() => {
    if (phase === 'cipher') {
      botTimerRef.current = setInterval(spawnBot, 3500);
    }
    return () => clearInterval(botTimerRef.current);
  }, [phase, spawnBot]);

  const handleShootBot = (id) => {
    setBots(prev => prev.filter(b => b.id !== id));
  };

  // ── Phase 3: Submit cipher ────────────────
  const handleCipherSubmit = (e) => {
    e.preventDefault();
    if (cipherInput.trim().toUpperCase() === 'NEXUS') {
      clearInterval(botTimerRef.current);
      setCipherMsg({ ok: true, text: '✅ DECRYPTION SUCCESSFUL — VAULT OPENED.' });
      setBots([]);
      setTimeout(() => nextStage('FRAG-01-DETECTIVE'), 2000);
    } else {
      setHp(prev => Math.max(0, prev - 20));
      setCipherMsg({ ok: false, text: `❌ ACCESS DENIED — HP -20. Bots incoming!` });
      spawnBot();
    }
    setCipherInput('');
  };

  // ═══════════════════════════════════════════════════════════
  // RENDER
  // ═══════════════════════════════════════════════════════════
  return (
    <div className="w-screen h-screen bg-black relative overflow-hidden font-mono">

      {/* ── HUD (luôn hiển thị) ── */}
      <div className="absolute top-4 left-4 z-10 text-xs text-gray-500 pointer-events-none space-y-1">
        <p className="text-red-500 tracking-widest text-sm">THE DATA CRYPT</p>
        <p>ROLE: DETECTIVE</p>
        <p className={hp <= 40 ? 'text-red-500 animate-pulse' : 'text-green-500'}>HP: {hp}%</p>
        {phase === 'scan' && <p className="text-yellow-700">MISSION: SCAN {3 - scannedIds.length} MORE NODE(S)</p>}
        {phase === 'timeline' && (
          <p className={`text-yellow-600`}>SECURITY ALERT: {'🔴'.repeat(securityAlert)}{'⬜'.repeat(3 - securityAlert)}</p>
        )}
        {phase === 'cipher' && <p className="text-red-400 animate-pulse">⚠ BOTS INCOMING — REPEL &amp; DECRYPT</p>}
        {phase === 'cipher' && <p className="text-orange-600">MISSED: {missedClicks}/3</p>}
      </div>

      {/* ════════════════════════════════════
          PHASE 1 — SCAN DATA (3D)
         ════════════════════════════════════ */}
      {(phase === 'scan') && (
        <>
          <Canvas camera={{ position: [0, 2, 10], fov: 60 }}>
            <color attach="background" args={['#030303']} />
            <ambientLight intensity={0.2} />
            <pointLight position={[0, 5, 0]} intensity={3} color="#ff0044" />
            <pointLight position={[0, -4, 4]} intensity={1} color="#002244" />
            <Stars radius={150} depth={60} count={6000} factor={3} fade />

            {CUBES.map(cube => (
              <DataCube key={cube.id} cube={cube} isScanned={scannedIds.includes(cube.id)} onClick={() => handleScan(cube)} />
            ))}

            <Text position={[0, 3.5, -2]} color="#ff2244" fontSize={0.45} anchorX="center" fontWeight="bold">
              ANOMALY DETECTED — SCAN ALL CORRUPTED NODES
            </Text>
            <Text position={[0, -3, -2]} color="#333" fontSize={0.25} anchorX="center">
              DRAG TO ROTATE VIEW  •  CLICK NODE TO EXTRACT DATA
            </Text>

            <OrbitControls enableZoom={false} enablePan={false} />
          </Canvas>

          {/* Log Viewer (dọc phải) */}
          {activeLog && (
            <div className="absolute top-4 right-4 w-80 z-20 border border-red-900 bg-black/95 p-4 text-xs text-green-400 shadow-[0_0_15px_rgba(255,0,0,0.3)]">
              <div className="flex justify-between border-b border-red-900 pb-2 mb-3">
                <span className="text-red-400 font-bold">{activeLog.label} — {activeLog.title}</span>
                <button onClick={() => setActiveLog(null)} className="text-gray-600 hover:text-white">✕</button>
              </div>
              {activeLog.logs.map((line, i) => (
                <p key={i} className={`leading-5 ${line.startsWith('//') ? 'text-yellow-600 italic mt-1' : 'text-green-400'}`}>
                  {line}
                </p>
              ))}
            </div>
          )}

          {/* Nút chuyển Phase khi đã quét đủ */}
          {allScanned && (
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 text-center animate-bounce">
              <button
                onClick={() => setPhase('timeline')}
                className="px-8 py-3 border border-yellow-500 text-yellow-400 bg-black/70 hover:bg-yellow-900/30 text-lg tracking-widest uppercase transition"
              >
                ▶ PROCEED: TIMELINE RECOVERY
              </button>
              <p className="text-gray-600 text-xs mt-2">All nodes scanned. Data collected.</p>
            </div>
          )}
        </>
      )}

      {/* ════════════════════════════════════
          PHASE 2 — TIMELINE RECOVERY
         ════════════════════════════════════ */}
      {phase === 'timeline' && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-950 z-30">
          <div className="border border-yellow-700 bg-black p-8 rounded max-w-xl w-full shadow-[0_0_25px_rgba(255,200,0,0.2)]">

            <h2 className="text-yellow-500 text-xl font-bold tracking-widest mb-1">PHASE 2 — TIMELINE RECOVERY</h2>
            <p className="text-gray-600 text-xs mb-6">
              The database logs are scrambled. Drag &amp; drop the events into the correct chronological order (earliest → latest).
              Wrong order increases Security Alert.
            </p>

            <div className="space-y-3 mb-6">
              {timelineOrder.map((id, idx) => {
                const event = TIMELINE_EVENTS.find(e => e.id === id);
                return (
                  <div
                    key={id}
                    draggable
                    onDragStart={() => handleDragStart(id)}
                    onDragOver={e => e.preventDefault()}
                    onDrop={() => handleDrop(id)}
                    className="flex items-center gap-3 border border-yellow-900 bg-gray-900 p-3 cursor-grab active:cursor-grabbing hover:border-yellow-500 transition select-none"
                  >
                    <span className="text-yellow-700 text-lg">⠿</span>
                    <span className="text-yellow-200 text-sm">{event.text}</span>
                  </div>
                );
              })}
            </div>

            {timelineMsg && (
              <p className={`text-xs p-2 border mb-4 ${timelineMsg.ok ? 'border-green-800 text-green-400' : 'border-red-900 text-red-400'}`}>
                {timelineMsg.text}
              </p>
            )}

            <button
              onClick={handleTimelineSubmit}
              className="w-full border border-yellow-500 text-yellow-400 p-2 hover:bg-yellow-900/30 transition tracking-widest uppercase"
            >
              CONFIRM ORDER
            </button>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════
          PHASE 3 — CIPHER BREAK + BOT ATTACK
         ════════════════════════════════════ */}
      {phase === 'cipher' && (
        <div className="absolute inset-0 flex items-center justify-center bg-black z-30">

          {/* Security Bots overlay */}
          {bots.map(bot => (
            <SecurityBot key={bot.id} bot={bot} onShoot={handleShootBot} />
          ))}

          {/* Cipher Terminal */}
          <div className="border border-red-500 bg-black/90 p-8 rounded w-full max-w-md shadow-[0_0_30px_rgba(255,0,68,0.6)] z-40 relative">

            <h2 className="text-red-500 text-xl font-bold tracking-widest border-b border-red-900 pb-2 mb-4">
              PHASE 3 — DATA VAULT DECRYPTION
            </h2>

            <div className="space-y-2 text-xs text-gray-400 mb-4 border border-gray-800 p-3 rounded">
              <p>Vault cipher string recovered from NODE-03:</p>
              <p className="text-4xl text-yellow-400 font-black tracking-[14px] text-center py-3">UFWXJ</p>
              <p className="text-gray-600 italic">Use the clues from the scanned nodes to find the decoded string and shift value.</p>
            </div>

            <form onSubmit={handleCipherSubmit} className="space-y-4">
              <input
                type="text"
                autoFocus
                value={cipherInput}
                onChange={e => setCipherInput(e.target.value)}
                placeholder="ENTER DECODED STRING..."
                maxLength={10}
                className="w-full bg-gray-950 border border-gray-700 text-cyan-400 p-3 focus:outline-none focus:border-cyan-500 uppercase tracking-[10px] text-center text-xl"
              />

              {cipherMsg && (
                <p className={`text-xs p-2 border ${cipherMsg.ok ? 'border-green-800 text-green-400' : 'border-red-900 text-red-400'}`}>
                  {cipherMsg.text}
                </p>
              )}

              <button
                type="submit"
                className="w-full border border-red-500 text-red-400 p-2 hover:bg-red-900/30 transition uppercase tracking-widest"
              >
                ⚡ DECRYPT &amp; SUBMIT
              </button>
            </form>

            <p className="text-red-900 text-[10px] text-center mt-4 animate-pulse">
              ⚠ SECURITY BOTS ARE APPROACHING — CLICK WEAK SPOTS TO REPEL
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
