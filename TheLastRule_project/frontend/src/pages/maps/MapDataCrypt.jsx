import React, {
  useState, useRef, useEffect, useMemo, useCallback, Suspense
} from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Text } from '@react-three/drei';
import * as THREE from 'three';
import { useGame } from '../../context/GameContext';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

// ─────────────────────────────────────────────
//  CONSTANTS & PALETTE
// ─────────────────────────────────────────────
const C = {
  bg:        '#03030f',
  neonBlue:  '#00d4ff',
  neonRed:   '#ff1144',
  neonPurple:'#9b00ff',
  neonGreen: '#00ff88',
  dark:      '#060620',
};

// AI dialogue lines
const AI_LINES = {
  start:    'Hãy tìm lại những gì đã bị hệ thống xóa bỏ.',
  task1Done:'Ký ức đầu tiên đã được khôi phục. Tiếp tục đồng bộ dữ liệu.',
  task2Done:'Tín hiệu đã ổn định... nhưng hệ thống đã phát hiện sự hiện diện của bạn.',
  glitch:   'Thanh lọc các dữ liệu lỗi trước khi chúng nuốt chửng ký ức của bạn.',
  done:     'Hai mảnh ký ức đã trở về. Con đường phía trước đã được mở.',
};

// ─────────────────────────────────────────────
//  FLOATING NEON BLOCKS (ambient decoration)
// ─────────────────────────────────────────────
function FloatingBlock({ position, color, speed, size }) {
  const ref = useRef();
  const offset = useRef(Math.random() * Math.PI * 2);
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() * speed + offset.current;
    ref.current.position.y = position[1] + Math.sin(t) * 0.4;
    ref.current.rotation.x += 0.004;
    ref.current.rotation.y += 0.006;
  });
  return (
    <mesh ref={ref} position={position}>
      <boxGeometry args={size} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.6} transparent opacity={0.55} />
    </mesh>
  );
}

function AmbientBlocks({ redMode }) {
  const blocks = useMemo(() => {
    const arr = [];
    for (let i = 0; i < 60; i++) {
      const angle = Math.random() * Math.PI * 2;
      const r = 6 + Math.random() * 8;
      const x = Math.cos(angle) * r;
      const z = Math.sin(angle) * r;
      const y = (Math.random() - 0.5) * 10;
      const s = 0.12 + Math.random() * 0.3;
      arr.push({ pos: [x, y, z], size: [s, s, s], idx: i });
    }
    return arr;
  }, []);

  const colors = useMemo(() => {
    if (redMode) return [C.neonRed, '#ff6600'];
    return [C.neonBlue, C.neonPurple, '#3300ff'];
  }, [redMode]);

  return (
    <>
      {blocks.map((b, i) => (
        <FloatingBlock
          key={i}
          position={b.pos}
          size={b.size}
          color={colors[i % colors.length]}
          speed={0.3 + Math.random() * 0.4}
        />
      ))}
    </>
  );
}

// ─────────────────────────────────────────────
//  SCAN LIGHT (sweeping red beam)
// ─────────────────────────────────────────────
function ScanLight({ onAngle }) {
  const lightRef = useRef();
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const angle = (t * 0.4) % (Math.PI * 2);
    const x = Math.cos(angle) * 12;
    const z = Math.sin(angle) * 12;
    lightRef.current.position.set(x, 5, z);
    lightRef.current.target.position.set(0, 0, 0);
    lightRef.current.target.updateMatrixWorld();
    onAngle(angle);
  });
  return (
    <spotLight
      ref={lightRef}
      color={C.neonRed}
      intensity={80}
      distance={30}
      angle={0.35}
      penumbra={0.2}
      castShadow
    />
  );
}

// ─────────────────────────────────────────────
//  GIANT CARD (Shadow Puzzle)
// ─────────────────────────────────────────────
const CARD_SYMBOLS = ['♠', '♥', '♦', '♣'];
const CARD_TARGET_IDX = 1; // the card that casts the correct shadow = Hearts
const CORRECT_ROTATION_Y = Math.PI * 0.25; // 45°

function GiantCard({ idx, pos, onSelect, selected, rotY, onRotate }) {
  const ref = useRef();
  useFrame(() => {
    ref.current.rotation.y = THREE.MathUtils.lerp(ref.current.rotation.y, rotY, 0.08);
    if (selected) {
      ref.current.position.y = THREE.MathUtils.lerp(ref.current.position.y, pos[1] + 0.4, 0.1);
    } else {
      ref.current.position.y = THREE.MathUtils.lerp(ref.current.position.y, pos[1], 0.1);
    }
  });

  const color = selected ? C.neonGreen : C.neonBlue;
  return (
    <group ref={ref} position={pos}>
      {/* Card face */}
      <mesh
        castShadow
        onClick={(e) => { e.stopPropagation(); onSelect(idx); }}
      >
        <boxGeometry args={[0.8, 1.2, 0.06]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={selected ? 0.9 : 0.35} />
      </mesh>
      <Text
        position={[0, 0, 0.04]}
        fontSize={0.5}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
      >
        {CARD_SYMBOLS[idx]}
      </Text>
    </group>
  );
}

// Shadow-receiving wall  
function ShadowWall() {
  return (
    <mesh receiveShadow position={[0, 0, -9]} rotation={[0, 0, 0]}>
      <planeGeometry args={[20, 14]} />
      <meshStandardMaterial color="#08083a" roughness={1} />
    </mesh>
  );
}

// Constellation target outline on wall
function ConstellationTarget() {
  // A simple star-like shape using lines
  const points = useMemo(() => {
    const pts = [];
    const star = [
      [0, 0.8], [0.22, 0.28], [0.75, 0.25],
      [0.36, -0.1], [0.47, -0.65], [0, -0.35],
      [-0.47, -0.65], [-0.36, -0.1], [-0.75, 0.25],
      [-0.22, 0.28], [0, 0.8]
    ];
    star.forEach(([x, y]) => pts.push(new THREE.Vector3(x * 1.4, y * 1.4, 0)));
    return pts;
  }, []);

  const geometry = useMemo(() => {
    const g = new THREE.BufferGeometry().setFromPoints(points);
    return g;
  }, [points]);

  return (
    <line geometry={geometry} position={[0, 0.5, -8.9]}>
      <lineBasicMaterial color={C.neonRed} opacity={0.45} transparent />
    </line>
  );
}

// ─────────────────────────────────────────────
//  GLITCH ENEMY
// ─────────────────────────────────────────────
function GlitchEnemy({ id, startPos, onHit, onReach }) {
  const ref = useRef();
  const alive = useRef(true);

  useFrame((_, delta) => {
    if (!ref.current || !alive.current) return;
    const pos = ref.current.position;
    const dir = new THREE.Vector3(0, 0, 0).sub(pos).normalize();
    pos.addScaledVector(dir, 5 * delta);
    ref.current.rotation.x += delta * 3;
    ref.current.rotation.z += delta * 2;
    if (pos.length() < 2.0) {
      alive.current = false;
      onReach(id);
    }
  });

  return (
    <mesh
      ref={ref}
      position={startPos}
      onClick={(e) => {
        e.stopPropagation();
        if (alive.current) { alive.current = false; onHit(id); }
      }}
    >
      <octahedronGeometry args={[0.45, 0]} />
      <meshStandardMaterial
        color={C.neonRed}
        emissive={C.neonRed}
        emissiveIntensity={3}
        wireframe
      />
    </mesh>
  );
}

// ─────────────────────────────────────────────
//  PARTICLES (on glitch kill)
// ─────────────────────────────────────────────
function Particles({ position, onDone }) {
  const ref = useRef();
  const life = useRef(0);
  const vels = useMemo(() => {
    const arr = [];
    for (let i = 0; i < 20; i++) {
      arr.push(new THREE.Vector3(
        (Math.random() - 0.5) * 5,
        (Math.random() - 0.5) * 5,
        (Math.random() - 0.5) * 5
      ));
    }
    return arr;
  }, []);
  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const pos = new Float32Array(20 * 3);
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    return g;
  }, []);

  useFrame((_, delta) => {
    life.current += delta;
    const positions = geo.attributes.position.array;
    for (let i = 0; i < 20; i++) {
      const v = vels[i];
      positions[i * 3]     = position[0] + v.x * life.current;
      positions[i * 3 + 1] = position[1] + v.y * life.current;
      positions[i * 3 + 2] = position[2] + v.z * life.current;
    }
    geo.attributes.position.needsUpdate = true;
    if (ref.current) ref.current.material.opacity = Math.max(0, 1 - life.current);
    if (life.current > 1) onDone();
  });

  return (
    <points ref={ref} geometry={geo}>
      <pointsMaterial color={C.neonRed} size={0.12} transparent opacity={1} />
    </points>
  );
}

// ─────────────────────────────────────────────
//  OPENING GATE (Map end)
// ─────────────────────────────────────────────
function DataGate({ open }) {
  const leftRef = useRef();
  const rightRef = useRef();
  useFrame(() => {
    if (!open) return;
    leftRef.current.position.x = THREE.MathUtils.lerp(leftRef.current.position.x, -5, 0.02);
    rightRef.current.position.x = THREE.MathUtils.lerp(rightRef.current.position.x, 5, 0.02);
  });
  return (
    <group position={[0, 0, -8]}>
      <mesh ref={leftRef} position={[-1.5, 0, 0]}>
        <boxGeometry args={[3, 6, 0.2]} />
        <meshStandardMaterial color={C.neonBlue} emissive={C.neonBlue} emissiveIntensity={0.6} transparent opacity={0.8} />
      </mesh>
      <mesh ref={rightRef} position={[1.5, 0, 0]}>
        <boxGeometry args={[3, 6, 0.2]} />
        <meshStandardMaterial color={C.neonBlue} emissive={C.neonBlue} emissiveIntensity={0.6} transparent opacity={0.8} />
      </mesh>
    </group>
  );
}

// ─────────────────────────────────────────────
//  3D SCENE COMPONENT
// ─────────────────────────────────────────────
function Scene({
  stage, cardRotations, selectedCard, onSelectCard, onRotateCard,
  onGlitchHit, onGlitchReach, glitches, particles, onParticleDone,
  onScanAngle, gateOpen
}) {
  return (
    <>
      <color attach="background" args={[C.bg]} />
      <fog attach="fog" args={[C.bg, 8, 35]} />
      <ambientLight intensity={0.25} color="#1a0a3a" />
      <pointLight position={[0, 6, 0]} intensity={1.5} color="#2200ff" />
      <pointLight position={[0, -3, 0]} intensity={0.8} color={C.neonBlue} />

      <AmbientBlocks redMode={stage === 'GLITCH'} />

      {/* Shadow puzzle floor */}
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, -4, 0]}>
        <planeGeometry args={[60, 60]} />
        <meshStandardMaterial color="#06062a" />
      </mesh>

      {stage === 'SHADOW' && (
        <>
          <ScanLight onAngle={onScanAngle} />
          <ShadowWall />
          <ConstellationTarget />
          {[0, 1, 2, 3].map(i => (
            <GiantCard
              key={i}
              idx={i}
              pos={[-4.5 + i * 3, 0, 0]}
              rotY={cardRotations[i]}
              selected={selectedCard === i}
              onSelect={onSelectCard}
              onRotate={onRotateCard}
            />
          ))}
        </>
      )}

      {stage === 'GLITCH' && (
        <>
          {glitches.map(g => (
            <GlitchEnemy
              key={g.id}
              id={g.id}
              startPos={g.pos}
              onHit={onGlitchHit}
              onReach={onGlitchReach}
            />
          ))}
          {particles.map(p => (
            <Particles
              key={p.id}
              position={p.pos}
              onDone={() => onParticleDone(p.id)}
            />
          ))}
        </>
      )}

      <DataGate open={gateOpen} />

      <OrbitControls
        enableZoom={false}
        enablePan={false}
        maxPolarAngle={Math.PI * 0.65}
        minPolarAngle={Math.PI * 0.3}
      />
    </>
  );
}

// ─────────────────────────────────────────────
//  MAIN MAP COMPONENT
// ─────────────────────────────────────────────
export default function MapDataCrypt() {
  const { sessionId, hp, setHp, nextStage } = useGame();
  const navigate = useNavigate();

  // STAGES: INTRO → SHADOW → SYNC → GLITCH → WIN → GAMEOVER
  const [stage, setStage] = useState('INTRO');
  const [aiText, setAiText] = useState(AI_LINES.start);
  const [showAi, setShowAi] = useState(true);

  // ── SHADOW PUZZLE ──
  const [cardRotations, setCardRotations] = useState([0, 0, 0, 0]);
  const [selectedCard, setSelectedCard] = useState(null);
  const [shadowMatch, setShadowMatch] = useState(0); // 0–100
  const shadowMatchRef = useRef(0);
  const scanAngleRef = useRef(0);
  const shadowHoldTimer = useRef(0);
  const [shadowStatus, setShadowStatus] = useState('Chọn một quân bài rồi xoay để bóng khớp với chòm sao');
  const [dragging, setDragging] = useState(false);
  const lastMouseX = useRef(0);
  const isDraggingCard = useRef(false);

  // ── SYNC ──
  const [sliders, setSliders] = useState([25, 75, 45]);
  const sliderOscRef = useRef([0, Math.PI * 0.66, Math.PI * 1.33]);
  const [syncHoldTimer, setSyncHoldTimer] = useState(0);
  const [syncStatus, setSyncStatus] = useState('Kéo các thanh về vùng trung tâm để đồng bộ tín hiệu');
  const syncHoldRef = useRef(0);
  const [noiseLevel, setNoiseLevel] = useState(100); // 0 = silent

  // ── GLITCH ──
  const [glitches, setGlitches] = useState([]);
  const [particles, setParticles] = useState([]);
  const glitchIdRef = useRef(0);
  const particleIdRef = useRef(0);
  const [waveInfo, setWaveInfo] = useState({ wave: 0, total: 3 });
  const [waveCleared, setWaveCleared] = useState(0);
  const waveRef = useRef(0);
  const glitchCountRef = useRef(0);

  // ── COLLECT ──
  const [collected, setCollected] = useState([]);
  const [gateOpen, setGateOpen] = useState(false);

  // ─────────────────────────────────────────────
  //  AI text helper
  // ─────────────────────────────────────────────
  const showAiMessage = useCallback((msg, duration = 4000) => {
    setAiText(msg);
    setShowAi(true);
    const timer = setTimeout(() => setShowAi(false), duration);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!sessionId) navigate('/');
  }, [sessionId, navigate]);

  // Show initial AI msg
  useEffect(() => {
    const t = setTimeout(() => setShowAi(false), 5000);
    return () => clearTimeout(t);
  }, []);

  // ─────────────────────────────────────────────
  //  STAGE TRANSITIONS
  // ─────────────────────────────────────────────
  const advanceToSync = useCallback(() => {
    setShadowStatus('✦ Ký ức đã khôi phục!');
    showAiMessage(AI_LINES.task1Done);
    setTimeout(() => setStage('SYNC'), 2200);
  }, [showAiMessage]);

  const advanceToGlitch = useCallback(() => {
    setSyncStatus('✦ Đồng bộ hoàn tất!');
    showAiMessage(AI_LINES.task2Done, 3000);
    setTimeout(() => {
      setStage('GLITCH');
      showAiMessage(AI_LINES.glitch, 4000);
    }, 2200);
  }, [showAiMessage]);

  // ─────────────────────────────────────────────
  //  SHADOW PUZZLE LOGIC
  // ─────────────────────────────────────────────
  const handleSelectCard = useCallback((idx) => {
    setSelectedCard(prev => prev === idx ? null : idx);
  }, []);

  const handleScanAngle = useCallback((angle) => {
    scanAngleRef.current = angle;
  }, []);

  // Mouse drag to rotate selected card
  useEffect(() => {
    if (stage !== 'SHADOW') return;
    const onDown = (e) => {
      if (selectedCard === null) return;
      isDraggingCard.current = true;
      lastMouseX.current = e.clientX;
    };
    const onMove = (e) => {
      if (!isDraggingCard.current || selectedCard === null) return;
      const dx = e.clientX - lastMouseX.current;
      lastMouseX.current = e.clientX;
      setCardRotations(prev => {
        const next = [...prev];
        next[selectedCard] += dx * 0.015;
        return next;
      });
    };
    const onUp = () => { isDraggingCard.current = false; };
    window.addEventListener('mousedown', onDown);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    return () => {
      window.removeEventListener('mousedown', onDown);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
  }, [stage, selectedCard]);

  // Shadow match evaluation
  const [shadowPct, setShadowPct] = useState(0);
  useEffect(() => {
    if (stage !== 'SHADOW') return;
    const interval = setInterval(() => {
      const card = selectedCard !== null ? selectedCard : CARD_TARGET_IDX;
      const rot = cardRotations[card] % (Math.PI * 2);
      const target = CORRECT_ROTATION_Y;
      const diff = Math.abs(rot - target) % (Math.PI * 2);
      const minDiff = Math.min(diff, Math.PI * 2 - diff);
      // Also factor in scan angle
      const scanFactor = 0.5 + 0.5 * Math.abs(Math.sin(scanAngleRef.current));
      const rawPct = Math.max(0, 1 - minDiff / (Math.PI * 0.5)) * scanFactor;
      const pct = Math.round(rawPct * 100);
      setShadowPct(pct);
      if (pct >= 88) {
        shadowHoldTimer.current += 0.25;
        setShadowStatus(`🔴 Khớp ${pct}% — Giữ nguyên...`);
        if (shadowHoldTimer.current >= 2.5) {
          clearInterval(interval);
          advanceToSync();
        }
      } else {
        shadowHoldTimer.current = 0;
        setShadowStatus(pct > 50
          ? `Tiếp tục xoay... ${pct}%`
          : 'Chọn đúng quân bài và xoay để bóng khớp chòm sao');
      }
    }, 250);
    return () => clearInterval(interval);
  }, [stage, cardRotations, selectedCard, advanceToSync]);

  // ─────────────────────────────────────────────
  //  SYNC MINI-GAME LOGIC
  // ─────────────────────────────────────────────
  // Oscillate sliders automatically
  useEffect(() => {
    if (stage !== 'SYNC') return;
    let raf;
    const tick = () => {
      sliderOscRef.current = sliderOscRef.current.map(o => o + 0.018);
      setSliders(prev => prev.map((v, i) => {
        // Slider drifts based on oscillation
        const drift = Math.sin(sliderOscRef.current[i]) * 18;
        const clamped = Math.max(0, Math.min(100, v + drift * 0.04));
        return clamped;
      }));
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [stage]);

  // Check sync completion
  useEffect(() => {
    if (stage !== 'SYNC') return;
    const zone = { min: 44, max: 56 };
    const allIn = sliders.every(s => s >= zone.min && s <= zone.max);
    const drift = sliders.reduce((acc, s) => acc + Math.abs(s - 50), 0) / 3;
    setNoiseLevel(Math.round(drift * 2));
    if (allIn) {
      syncHoldRef.current += 0.25;
      setSyncStatus(`✅ Đang đồng bộ... ${Math.round(syncHoldRef.current / 2.5 * 100)}%`);
      if (syncHoldRef.current >= 2.5) advanceToGlitch();
    } else {
      syncHoldRef.current = 0;
      setSyncStatus(drift < 15 ? `Gần rồi! Drift: ${Math.round(drift)}` : 'Kéo các thanh về vùng trung tâm (40–60)');
    }
  }, [sliders, stage, advanceToGlitch]);

  const handleSliderDrag = useCallback((idx, val) => {
    setSliders(prev => {
      const next = [...prev];
      next[idx] = val;
      return next;
    });
  }, []);

  // ─────────────────────────────────────────────
  //  GLITCH PURGE LOGIC
  // ─────────────────────────────────────────────
  const WAVES = [
    { count: 3, interval: 2000 },
    { count: 5, interval: 1600 },
    { count: 7, interval: 1200 },
  ];

  useEffect(() => {
    if (stage !== 'GLITCH') return;
    if (waveRef.current >= WAVES.length) return;

    const wave = WAVES[waveRef.current];
    setWaveInfo({ wave: waveRef.current + 1, total: WAVES.length });
    let spawned = 0;

    const spawnInterval = setInterval(() => {
      if (spawned >= wave.count) {
        clearInterval(spawnInterval);
        return;
      }
      const angle = Math.random() * Math.PI * 2;
      const r = 11 + Math.random() * 3;
      const pos = [
        Math.cos(angle) * r,
        (Math.random() - 0.5) * 6,
        Math.sin(angle) * r
      ];
      const id = ++glitchIdRef.current;
      setGlitches(prev => [...prev, { id, pos }]);
      spawned++;
      glitchCountRef.current++;
    }, wave.interval / wave.count);

    return () => clearInterval(spawnInterval);
  }, [stage, waveCleared]);

  const handleGlitchHit = useCallback((id) => {
    setGlitches(prev => {
      const glitch = prev.find(g => g.id === id);
      if (glitch) {
        setParticles(ps => [...ps, { id: ++particleIdRef.current, pos: glitch.pos }]);
        glitchCountRef.current--;
      }
      const remaining = prev.filter(g => g.id !== id);
      if (remaining.length === 0 && glitchCountRef.current <= 0) {
        // wave cleared
        if (waveRef.current < WAVES.length - 1) {
          waveRef.current++;
          setWaveCleared(c => c + 1);
        } else {
          setStage('WIN');
          showAiMessage(AI_LINES.done, 6000);
        }
      }
      return remaining;
    });
  }, [showAiMessage]);

  const handleGlitchReach = useCallback((id) => {
    setGlitches(prev => prev.filter(g => g.id !== id));
    glitchCountRef.current--;
    setHp(prev => {
      const next = Math.max(0, prev - 20);
      if (next <= 0) setStage('GAMEOVER');
      return next;
    });
  }, [setHp]);

  const handleParticleDone = useCallback((id) => {
    setParticles(prev => prev.filter(p => p.id !== id));
  }, []);

  // ─────────────────────────────────────────────
  //  WIN SEQUENCE
  // ─────────────────────────────────────────────
  useEffect(() => {
    if (stage !== 'WIN') return;
    // Collect rule pieces then open gate
    setTimeout(() => setCollected(['Identity', 'Memory']), 1500);
    setTimeout(() => setGateOpen(true), 3500);
    setTimeout(() => {
      nextStage('MAP1_DATACRYPT_CLEARED');
      navigate('/game');
    }, 7000);
  }, [stage, nextStage, navigate]);

  // ─────────────────────────────────────────────
  //  RENDER
  // ─────────────────────────────────────────────
  if (!sessionId) return null;

  return (
    <div
      id="map-datacrypt"
      className="w-full h-screen relative overflow-hidden select-none"
      style={{ background: C.bg, fontFamily: "'Share Tech Mono', monospace, monospace" }}
    >
      {/* ── 3D CANVAS ── */}
      <div className="absolute inset-0 z-0">
        <Canvas
          shadows
          camera={{ position: [0, 2, 10], fov: 65 }}
          gl={{ antialias: true }}
        >
          <Suspense fallback={null}>
            <Scene
              stage={stage}
              cardRotations={cardRotations}
              selectedCard={selectedCard}
              onSelectCard={handleSelectCard}
              onScanAngle={handleScanAngle}
              onGlitchHit={handleGlitchHit}
              onGlitchReach={handleGlitchReach}
              glitches={glitches}
              particles={particles}
              onParticleDone={handleParticleDone}
              gateOpen={gateOpen}
            />
          </Suspense>
        </Canvas>
      </div>

      {/* ── SCANLINE OVERLAY ── */}
      <div
        className="absolute inset-0 z-5 pointer-events-none"
        style={{
          background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.04) 2px, rgba(0,0,0,0.04) 4px)',
        }}
      />

      {/* ── NOISE OVERLAY (SYNC) ── */}
      {stage === 'SYNC' && noiseLevel > 10 && (
        <div
          className="absolute inset-0 z-5 pointer-events-none transition-opacity duration-300"
          style={{
            opacity: noiseLevel / 200,
            background: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E")`,
            backgroundSize: '200px 200px',
          }}
        />
      )}

      {/* ── HUD TOP ── */}
      <div className="absolute top-0 left-0 right-0 z-20 flex justify-between items-start p-4 pointer-events-none">
        {/* HP */}
        <div
          style={{ border: `1px solid ${C.neonRed}`, background: 'rgba(0,0,0,0.7)' }}
          className="px-3 py-1 text-sm"
        >
          <span style={{ color: '#888' }}>SYSTEM HP: </span>
          <span style={{ color: C.neonRed, fontWeight: 'bold' }}>{hp}%</span>
          <div
            className="mt-1 h-1 rounded-full"
            style={{ background: '#1a0010', width: '120px' }}
          >
            <div
              className="h-1 rounded-full transition-all duration-300"
              style={{ background: C.neonRed, width: `${hp}%` }}
            />
          </div>
        </div>

        {/* Map title */}
        <div
          style={{ border: `1px solid ${C.neonBlue}`, background: 'rgba(0,0,0,0.7)' }}
          className="px-3 py-1 text-center text-xs"
        >
          <div style={{ color: C.neonBlue, letterSpacing: '0.2em' }}>MAP 01</div>
          <div style={{ color: '#fff', letterSpacing: '0.15em', fontSize: '10px' }}>THE DATA CRYPT</div>
        </div>

        {/* Stage indicator */}
        <div
          style={{ border: `1px solid ${C.neonPurple}`, background: 'rgba(0,0,0,0.7)' }}
          className="px-3 py-1 text-xs"
        >
          {['INTRO','SHADOW','SYNC','GLITCH','WIN','GAMEOVER'].map((s, i) => (
            <span
              key={s}
              style={{
                color: stage === s ? C.neonGreen : '#333',
                marginRight: '8px',
                textDecoration: stage === s ? 'underline' : 'none'
              }}
            >
              {['✦','①','②','③','★','☠'][i]}
            </span>
          ))}
        </div>
      </div>

      {/* ── AI SUBTITLE ── */}
      <AnimatePresence>
        {showAi && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.5 }}
            className="absolute bottom-28 left-0 right-0 z-20 flex justify-center pointer-events-none"
          >
            <div
              style={{
                background: 'rgba(0,0,0,0.82)',
                border: `1px solid ${C.neonBlue}`,
                padding: '10px 24px',
                maxWidth: '700px',
                textAlign: 'center',
                boxShadow: `0 0 20px ${C.neonBlue}44`,
              }}
            >
              <span style={{ color: C.neonBlue, fontSize: '11px', letterSpacing: '0.2em' }}>N.E.X.U.S ▸ </span>
              <span style={{ color: '#cce', fontSize: '14px' }}>"{aiText}"</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══════════════════════════════════════
          STAGE: INTRO
      ═══════════════════════════════════════ */}
      {stage === 'INTRO' && (
        <div className="absolute inset-0 z-30 flex flex-col items-center justify-center pointer-events-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className="text-center px-8"
            style={{ maxWidth: '680px' }}
          >
            <div style={{ color: C.neonRed, letterSpacing: '0.5em', fontSize: '12px' }} className="mb-3">
              N.E.X.U.S — PHÂN KHU 01
            </div>
            <h1 style={{ color: '#fff', fontSize: '3rem', fontWeight: 900, letterSpacing: '0.15em', textShadow: `0 0 30px ${C.neonBlue}` }}>
              THE DATA CRYPT
            </h1>
            <div style={{ color: C.neonBlue, opacity: 0.7, marginTop: '8px', fontSize: '13px', letterSpacing: '0.3em' }}>
              KHO LƯU TRỮ KÝ ỨC
            </div>
            <p style={{ color: '#8899bb', marginTop: '24px', lineHeight: 1.8, fontSize: '14px' }}>
              Đây chỉ là khu lưu trữ dữ liệu lỗi...<br />
              Hãy tìm lại ký ức của chính mình.
            </p>
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: `0 0 30px ${C.neonBlue}` }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setStage('SHADOW')}
              style={{
                marginTop: '36px',
                padding: '12px 48px',
                background: 'transparent',
                border: `2px solid ${C.neonBlue}`,
                color: C.neonBlue,
                fontSize: '14px',
                letterSpacing: '0.3em',
                cursor: 'pointer',
              }}
            >
              KHỞI ĐỘNG HỆ THỐNG
            </motion.button>
          </motion.div>
        </div>
      )}

      {/* ═══════════════════════════════════════
          STAGE: SHADOW PUZZLE
      ═══════════════════════════════════════ */}
      {stage === 'SHADOW' && (
        <div className="absolute inset-0 z-10 pointer-events-none">
          {/* Status */}
          <div className="absolute bottom-8 left-0 right-0 flex flex-col items-center gap-3 pointer-events-none">
            <div
              style={{
                background: 'rgba(0,0,0,0.8)',
                border: `1px solid ${C.neonRed}44`,
                padding: '8px 24px',
                color: shadowPct >= 88 ? C.neonGreen : '#aab',
                fontSize: '13px',
                letterSpacing: '0.15em',
              }}
            >
              {shadowStatus}
            </div>

            {/* Shadow match bar */}
            <div style={{ width: '260px', background: '#111', height: '6px', borderRadius: '3px' }}>
              <div
                style={{
                  height: '100%',
                  borderRadius: '3px',
                  background: shadowPct >= 88 ? C.neonGreen : C.neonRed,
                  width: `${shadowPct}%`,
                  transition: 'width 0.25s, background 0.3s',
                  boxShadow: shadowPct >= 88 ? `0 0 12px ${C.neonGreen}` : 'none',
                }}
              />
            </div>
            <div style={{ color: '#555', fontSize: '11px', letterSpacing: '0.2em' }}>
              💡 Click chọn quân bài → Kéo chuột để xoay
            </div>
          </div>

          {/* Selected card indicator */}
          {selectedCard !== null && (
            <div
              className="absolute"
              style={{
                top: '80px',
                left: '50%',
                transform: 'translateX(-50%)',
                background: 'rgba(0,0,0,0.7)',
                border: `1px solid ${C.neonGreen}`,
                padding: '4px 16px',
                color: C.neonGreen,
                fontSize: '12px',
                letterSpacing: '0.2em',
              }}
            >
              ĐANG XỬ LÝ: Quân {['♠','♥','♦','♣'][selectedCard]}
            </div>
          )}
        </div>
      )}

      {/* ═══════════════════════════════════════
          STAGE: SYNCHRONIZATION (HTML overlay)
      ═══════════════════════════════════════ */}
      {stage === 'SYNC' && (
        <div
          className="absolute inset-0 z-20 flex flex-col items-center justify-center"
          style={{ background: 'rgba(0,0,20,0.88)', backdropFilter: 'blur(3px)' }}
        >
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ width: '100%', maxWidth: '700px', padding: '32px' }}
          >
            {/* Title */}
            <div style={{ textAlign: 'center', marginBottom: '32px' }}>
              <div style={{ color: C.neonBlue, letterSpacing: '0.4em', fontSize: '11px' }}>NHIỆM VỤ 02</div>
              <h2 style={{ color: '#fff', fontSize: '2rem', fontWeight: 900, letterSpacing: '0.2em', margin: '6px 0' }}>
                ĐỒNG BỘ HÓA
              </h2>
              <div
                style={{
                  color: syncHoldRef.current > 0 ? C.neonGreen : '#99aabb',
                  fontSize: '13px', letterSpacing: '0.1em'
                }}
              >
                {syncStatus}
              </div>
            </div>

            {/* Circuit board visual header */}
            <div
              style={{
                width: '100%',
                height: '4px',
                background: `linear-gradient(90deg, transparent, ${C.neonBlue}, transparent)`,
                marginBottom: '32px',
                animation: 'pulse 2s infinite',
              }}
            />

            {/* Sliders */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
              {sliders.map((val, i) => {
                const inZone = val >= 44 && val <= 56;
                const label = ['SIGNAL α', 'SIGNAL β', 'SIGNAL γ'][i];
                return (
                  <div key={i}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span style={{ color: inZone ? C.neonGreen : C.neonBlue, fontSize: '12px', letterSpacing: '0.2em' }}>
                        {label}
                      </span>
                      <span style={{ color: inZone ? C.neonGreen : '#777', fontSize: '12px' }}>
                        {Math.round(val)}% {inZone ? '✓' : ''}
                      </span>
                    </div>

                    {/* Track */}
                    <div
                      style={{
                        position: 'relative',
                        height: '32px',
                        background: '#060625',
                        border: `1px solid ${inZone ? C.neonGreen : '#1a1a4a'}`,
                        borderRadius: '4px',
                        cursor: 'ew-resize',
                        boxShadow: inZone ? `0 0 12px ${C.neonGreen}44` : 'none',
                        transition: 'border-color 0.3s, box-shadow 0.3s',
                      }}
                      onMouseDown={(e) => {
                        const rect = e.currentTarget.getBoundingClientRect();
                        const doMove = (ev) => {
                          const pct = Math.min(100, Math.max(0, ((ev.clientX - rect.left) / rect.width) * 100));
                          handleSliderDrag(i, pct);
                        };
                        const doUp = () => {
                          window.removeEventListener('mousemove', doMove);
                          window.removeEventListener('mouseup', doUp);
                        };
                        window.addEventListener('mousemove', doMove);
                        window.addEventListener('mouseup', doUp);
                        doMove(e);
                      }}
                    >
                      {/* Target zone */}
                      <div
                        style={{
                          position: 'absolute',
                          left: '44%',
                          width: '12%',
                          height: '100%',
                          background: `${C.neonGreen}22`,
                          borderLeft: `1px solid ${C.neonGreen}44`,
                          borderRight: `1px solid ${C.neonGreen}44`,
                        }}
                      />
                      {/* Center line */}
                      <div
                        style={{
                          position: 'absolute',
                          left: '50%',
                          width: '1px',
                          height: '100%',
                          background: `${C.neonGreen}66`,
                        }}
                      />
                      {/* Thumb */}
                      <div
                        style={{
                          position: 'absolute',
                          left: `${val}%`,
                          top: '50%',
                          transform: 'translate(-50%, -50%)',
                          width: '20px',
                          height: '24px',
                          background: inZone ? C.neonGreen : C.neonBlue,
                          boxShadow: `0 0 ${inZone ? 16 : 8}px ${inZone ? C.neonGreen : C.neonBlue}`,
                          borderRadius: '3px',
                          transition: 'background 0.2s, box-shadow 0.2s',
                          cursor: 'grab',
                        }}
                      />
                      {/* oscillation line */}
                      <div
                        style={{
                          position: 'absolute',
                          height: '2px',
                          left: 0,
                          right: 0,
                          top: '50%',
                          background: `linear-gradient(90deg, transparent ${val}%, ${inZone ? C.neonGreen : C.neonRed}44 ${val}%, transparent calc(${val}% + 4px))`,
                          opacity: 0.6,
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Noise meter */}
            <div style={{ marginTop: '28px', textAlign: 'center' }}>
              <div style={{ color: '#555', fontSize: '11px', letterSpacing: '0.2em', marginBottom: '6px' }}>
                MỨC NHIỄU TÍN HIỆU
              </div>
              <div style={{ width: '100%', height: '4px', background: '#111', borderRadius: '2px' }}>
                <div
                  style={{
                    height: '100%',
                    borderRadius: '2px',
                    background: noiseLevel < 20
                      ? C.neonGreen
                      : noiseLevel < 50 ? '#ffcc00' : C.neonRed,
                    width: `${Math.min(100, noiseLevel)}%`,
                    transition: 'width 0.1s, background 0.3s',
                  }}
                />
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* ═══════════════════════════════════════
          STAGE: GLITCH PURGE — HUD
      ═══════════════════════════════════════ */}
      {stage === 'GLITCH' && (
        <div className="absolute inset-0 z-10 pointer-events-none">
          {/* Crosshair */}
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '30px',
              height: '30px',
              border: `2px solid ${C.neonRed}88`,
              borderRadius: '50%',
            }}
          >
            <div style={{ position: 'absolute', top: '50%', left: '-8px', right: '-8px', height: '1px', background: `${C.neonRed}88` }} />
            <div style={{ position: 'absolute', left: '50%', top: '-8px', bottom: '-8px', width: '1px', background: `${C.neonRed}88` }} />
          </div>

          <div className="absolute bottom-8 left-0 right-0 flex flex-col items-center gap-2">
            <div
              style={{
                background: 'rgba(0,0,0,0.8)',
                border: `1px solid ${C.neonRed}`,
                padding: '6px 20px',
                color: C.neonRed,
                fontSize: '13px',
                letterSpacing: '0.2em',
                animation: 'pulse 1s infinite',
              }}
            >
              ⚠ GLITCH DETECTED — CLICK ENEMIES TO DESTROY
            </div>
            <div style={{ color: '#555', fontSize: '11px', letterSpacing: '0.15em' }}>
              WAVE {waveInfo.wave} / {waveInfo.total} — GLITCHES ACTIVE: {glitches.length}
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════
          STAGE: WIN
      ═══════════════════════════════════════ */}
      <AnimatePresence>
        {stage === 'WIN' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 z-50 flex flex-col items-center justify-center text-center"
            style={{ background: 'rgba(0,5,20,0.92)' }}
          >
            <motion.div
              initial={{ y: -40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              <div style={{ color: C.neonBlue, letterSpacing: '0.5em', fontSize: '11px', marginBottom: '10px' }}>
                MAP 01 COMPLETE
              </div>
              <h1
                style={{
                  fontSize: '3.5rem',
                  fontWeight: 900,
                  color: '#fff',
                  textShadow: `0 0 40px ${C.neonGreen}`,
                  letterSpacing: '0.15em',
                }}
              >
                KÝ ỨC ĐÃ ĐƯỢC GIẢI PHÓNG
              </h1>
            </motion.div>

            {/* Rule Pieces */}
            <div style={{ display: 'flex', gap: '24px', marginTop: '36px' }}>
              {['Identity', 'Memory'].map((piece, i) => (
                <motion.div
                  key={piece}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: collected.includes(piece) ? 1 : 0, opacity: collected.includes(piece) ? 1 : 0 }}
                  transition={{ delay: i * 0.4 + 0.8, type: 'spring' }}
                  style={{
                    padding: '16px 28px',
                    border: `2px solid ${C.neonGreen}`,
                    boxShadow: `0 0 24px ${C.neonGreen}66`,
                    color: C.neonGreen,
                    letterSpacing: '0.2em',
                    fontSize: '13px',
                    textAlign: 'center',
                  }}
                >
                  <div style={{ fontSize: '24px', marginBottom: '6px' }}>◈</div>
                  <div style={{ color: '#888', fontSize: '10px', marginBottom: '4px' }}>RULE PIECE</div>
                  <div style={{ fontWeight: 'bold' }}>{piece.toUpperCase()}</div>
                </motion.div>
              ))}
            </div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2 }}
              style={{ color: '#6688aa', marginTop: '28px', fontSize: '14px' }}
            >
              Đang mở cánh cổng dữ liệu...
            </motion.p>

            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 3.5, duration: 3 }}
              style={{
                marginTop: '16px',
                width: '300px',
                height: '2px',
                background: `linear-gradient(90deg, ${C.neonBlue}, ${C.neonGreen})`,
              }}
            />
          </motion.div>
        )}

        {/* ── GAMEOVER ── */}
        {stage === 'GAMEOVER' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 z-50 flex flex-col items-center justify-center text-center pointer-events-auto"
            style={{ background: '#0a0000' }}
          >
            <motion.h1
              animate={{ opacity: [1, 0.4, 1] }}
              transition={{ repeat: Infinity, duration: 1 }}
              style={{ fontSize: '4rem', fontWeight: 900, color: C.neonRed, letterSpacing: '0.2em' }}
            >
              SYSTEM FAILURE
            </motion.h1>
            <p style={{ color: '#884444', marginTop: '12px', fontSize: '15px' }}>
              HP归零 — Dữ liệu bị xóa bởi Glitch.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={() => navigate('/')}
              style={{
                marginTop: '36px',
                padding: '12px 40px',
                border: `2px solid ${C.neonRed}`,
                color: C.neonRed,
                background: 'transparent',
                fontSize: '14px',
                letterSpacing: '0.2em',
                cursor: 'pointer',
              }}
            >
              BACK TO MENU
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Google Font Link ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&display=swap');
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }
        * { box-sizing: border-box; }
      `}</style>
    </div>
  );
}
