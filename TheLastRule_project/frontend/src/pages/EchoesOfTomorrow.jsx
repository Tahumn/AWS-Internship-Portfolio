import { useEffect, useMemo, useRef, useState } from 'react';
import './EchoesOfTomorrow.css';

const MEMORIES = {
  station: { id: 'station', title: 'Lời hứa ở sân ga', pain: 'Sợ bị bỏ quên', meaning: 'Một lời hứa dẫn ta về nhà' },
  mother: { id: 'mother', title: 'Lá thư của mẹ', pain: 'Nỗi sợ mất một người', meaning: 'Tình yêu vẫn tồn tại sau chia lìa' },
  birthday: { id: 'birthday', title: 'Sinh nhật thiếu người', pain: 'Một chỗ ngồi trống', meaning: 'Sự vắng mặt chứng minh họ từng thuộc về nơi này' },
  school: { id: 'school', title: 'Tiếng chuông cuối', pain: 'Ngày học không bao giờ trở lại', meaning: 'Ta trưởng thành vì những ngày đã qua' },
  street: { id: 'street', title: 'Con đường biến mất', pain: 'Một nơi đang bị xóa', meaning: 'Nơi chốn sống trong người từng đi qua nó' },
};

const chapterNames = ['THE STATION', 'THE APARTMENT', 'THE SILENT SCHOOL', 'THE CITY THAT FORGOT ITSELF', 'TOMORROW'];
const SAVE_PREFIX = 'echoes-of-tomorrow:';

function useSavedState(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const saved = window.localStorage.getItem(`${SAVE_PREFIX}${key}`);
      return saved === null ? initialValue : JSON.parse(saved);
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    window.localStorage.setItem(`${SAVE_PREFIX}${key}`, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
}

function clearStationDetailSave() {
  [
    'station-booth-open', 'station-active-area', 'station-hands', 'station-machine-inspected',
    'station-cleaner', 'station-answers', 'station-case-unlocked', 'station-filter-stored',
    'station-poster-open', 'station-poster-order', 'station-filter-position',
    'station-filter-angle', 'station-coordinate', 'station-map-open', 'station-glyph-order',
  ].forEach(key => window.localStorage.removeItem(`${SAVE_PREFIX}${key}`));
}

function clearSavedGame() {
  Object.keys(window.localStorage)
    .filter(key => key.startsWith(SAVE_PREFIX))
    .forEach(key => window.localStorage.removeItem(key));
  window.location.reload();
}

function TypeLine({ children, dim = false }) {
  return <p className={dim ? 'type-line dim' : 'type-line'}>{children}</p>;
}

export default function EchoesOfTomorrow() {
  const [screen, setScreen] = useSavedState('screen', 'TITLE');
  const [chapter, setChapter] = useSavedState('chapter', 0);
  const [echoOn, setEchoOn] = useSavedState('echo-on', false);
  const [clues, setClues] = useSavedState('clues', []);
  const [memories, setMemories] = useSavedState('memories', []);
  const [pendingMemory, setPendingMemory] = useState(null);
  const [notice, setNotice] = useState('');
  const [familyOrder, setFamilyOrder] = useState([]);
  const [heldStreet, setHeldStreet] = useState([]);
  const [finalLinks, setFinalLinks] = useState([]);
  const [ending, setEnding] = useState(null);
  const [trainClues, setTrainClues] = useSavedState('train-clues', []);
  const [trainTime, setTrainTime] = useSavedState('train-time', 90);
  const [trainFailed, setTrainFailed] = useSavedState('train-failed', false);
  const [trainHint, setTrainHint] = useState('');
  const [clockOn, setClockOn] = useSavedState('train-clock', false);
  const [trainSequence, setTrainSequence] = useSavedState('train-sequence', []);
  const [trainLockSolved, setTrainLockSolved] = useSavedState('train-lock', false);
  const [trainFragments, setTrainFragments] = useSavedState('train-fragments', []);
  const [titleIntroDone, setTitleIntroDone] = useSavedState('title-intro', false);
  const [soundOn, setSoundOn] = useSavedState('sound-on', true);
  const [soundUnlocked, setSoundUnlocked] = useState(false);

  useEffect(() => {
    clearStationDetailSave();
  }, []);

  const corrupt = chapter >= 3;
  const trainElapsed = 90 - trainTime;
  const trainPhase = trainElapsed < 9 ? 'normal' : trainElapsed < 17 ? 'accelerating' : 'void';
  const objective = useMemo(() => [
    'Tìm sân ga dẫn ra khỏi nhà ga.',
    'Khôi phục thứ tự gia đình và mở két.',
    'Xác định thời gian thật để rung chuông.',
    'Giữ con đường tồn tại bằng ký ức.',
    'Chứng minh ký ức đau buồn vẫn có ý nghĩa.',
  ][chapter], [chapter]);

  const flash = (text) => {
    setNotice(text);
    window.setTimeout(() => setNotice(''), 2200);
  };

  const discover = (id) => {
    if (!clues.includes(id)) setClues(prev => [...prev, id]);
  };

  const noticeTrainClue = (id) => {
    setTrainClues(prev => prev.includes(id) ? prev : [...prev, id]);
  };

  const revealTrainHint = (text) => {
    setTrainHint(text);
    window.setTimeout(() => setTrainHint(''), 3200);
  };

  useEffect(() => {
    if (screen !== 'TITLE' || titleIntroDone) return undefined;
    const introTimer = window.setTimeout(() => setTitleIntroDone(true), 9200);
    return () => window.clearTimeout(introTimer);
  }, [screen, titleIntroDone, setTitleIntroDone]);

  useEffect(() => {
    if (!soundOn) return undefined;
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return undefined;

    const audio = new AudioContextClass();
    const master = audio.createGain();
    const lowPass = audio.createBiquadFilter();
    master.gain.value = 0.0001;
    lowPass.type = 'lowpass';
    lowPass.frequency.value = 920;
    lowPass.Q.value = 1.2;
    lowPass.connect(master).connect(audio.destination);

    const railDrone = audio.createOscillator();
    const carriageHum = audio.createOscillator();
    const pulseGain = audio.createGain();
    railDrone.type = 'sine';
    railDrone.frequency.value = 43;
    carriageHum.type = 'triangle';
    carriageHum.frequency.value = 112;
    pulseGain.gain.value = 0.68;
    railDrone.connect(lowPass);
    carriageHum.connect(pulseGain).connect(lowPass);
    railDrone.start();
    carriageHum.start();

    let railTimer;
    const beginSound = () => {
      audio.resume().then(() => {
        setSoundUnlocked(true);
        master.gain.cancelScheduledValues(audio.currentTime);
        master.gain.exponentialRampToValueAtTime(0.14, audio.currentTime + 0.45);
        if (!railTimer) {
          railTimer = window.setInterval(() => {
            const click = audio.createOscillator();
            const clickGain = audio.createGain();
            click.type = 'square';
            click.frequency.setValueAtTime(185, audio.currentTime);
            click.frequency.exponentialRampToValueAtTime(108, audio.currentTime + 0.075);
            clickGain.gain.setValueAtTime(0.11, audio.currentTime);
            clickGain.gain.exponentialRampToValueAtTime(0.0001, audio.currentTime + 0.09);
            click.connect(clickGain).connect(lowPass);
            click.start();
            click.stop(audio.currentTime + 0.1);
          }, 640);
        }
      }).catch(() => {});
    };

    beginSound();
    window.addEventListener('pointerdown', beginSound, { once: true });
    window.addEventListener('keydown', beginSound, { once: true });
    return () => {
      window.removeEventListener('pointerdown', beginSound);
      window.removeEventListener('keydown', beginSound);
      window.clearInterval(railTimer);
      railDrone.stop();
      carriageHum.stop();
      audio.close();
    };
  }, [soundOn]);

  const enterTrainSymbol = (symbol) => {
    const target = ['03', 'E', '◒', '17'];
    const next = [...trainSequence, symbol];
    if (target[next.length - 1] !== symbol) {
      setTrainSequence([]);
      revealTrainHint('THỨ TỰ VỪA BỊ TỪ CHỐI. HÃY KIỂM TRA LẠI TRƯỚC KHI TOA TÀU BIẾN MẤT');
      return;
    }
    setTrainSequence(next);
    if (next.length === target.length) setTrainLockSolved(true);
  };

  const collectTrainFragment = (symbol) => {
    setTrainFragments(prev => prev.includes(symbol) ? prev : [...prev, symbol]);
    revealTrainHint(`MẢNH “${symbol}” ĐÃ ĐƯỢC GIỮ LẠI. LƯU Ý VỀ SỰ XUẤT HIỆN TRÊN VÉ TÀU!`);
  };

  useEffect(() => {
    if (screen !== 'TRAIN' || trainFailed) return undefined;
    const timer = window.setInterval(() => {
      setTrainTime(value => {
        if (value <= 1) {
          setTrainFailed(true);
          return 0;
        }
        return value - 1;
      });
    }, 1000);
    return () => window.clearInterval(timer);
  }, [screen, trainFailed, setTrainFailed, setTrainTime]);

  useEffect(() => {
    if (screen !== 'TRAIN' || trainPhase !== 'void' || trainFailed || !soundOn) return undefined;
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return undefined;
    const audio = new AudioContextClass();
    const master = audio.createGain();
    master.gain.value = 0.045;
    master.connect(audio.destination);
    const drone = audio.createOscillator();
    const droneGain = audio.createGain();
    drone.type = 'sine';
    drone.frequency.value = 46;
    droneGain.gain.value = 0.22;
    drone.connect(droneGain).connect(master);
    drone.start();
    const alarm = window.setInterval(() => {
      const osc = audio.createOscillator();
      const gain = audio.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(730, audio.currentTime);
      osc.frequency.exponentialRampToValueAtTime(410, audio.currentTime + 0.32);
      gain.gain.setValueAtTime(0.0001, audio.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.7, audio.currentTime + 0.025);
      gain.gain.exponentialRampToValueAtTime(0.0001, audio.currentTime + 0.38);
      osc.connect(gain).connect(master);
      osc.start();
      osc.stop(audio.currentTime + 0.4);
    }, 1450);
    return () => {
      window.clearInterval(alarm);
      drone.stop();
      audio.close();
    };
  }, [screen, trainPhase, trainFailed, soundOn]);

  const offerMemory = (id, after) => {
    const memory = MEMORIES[id];
    if (memories.some(m => m.id === id)) {
      after?.();
      return;
    }
    setPendingMemory({ memory, after });
  };

  const storeMemory = (dropId = null) => {
    const { memory, after } = pendingMemory;
    setMemories(prev => [...prev.filter(m => m.id !== dropId), memory]);
    setPendingMemory(null);
    after?.();
  };

  const skipMemory = () => {
    const after = pendingMemory?.after;
    setPendingMemory(null);
    after?.();
  };

  const goChapter = (next) => {
    setChapter(next);
    setEchoOn(false);
    setClues([]);
    setScreen('GAME');
  };

  if (screen === 'TITLE') {
    return (
      <main className={`echo-game title-screen story-overture ${titleIntroDone ? 'intro-complete' : ''}`}>
        <div className="overture-image" aria-hidden="true" />
        <div className="overture-erasure" aria-hidden="true"><i /><i /><i /><i /><i /></div>
        <div className="overture-grain" aria-hidden="true" />

        <section className="prologue-beats" aria-label="Lời mở đầu">
          <p className="beat beat-one"><small>HỒ SƠ 00.013 · NĂM 2103</small>AURELIA ĐÃ BIẾN MẤT TRONG MỘT ĐÊM</p>
          <p className="beat beat-two">...<br />CHU KỲ ĐANG MUỐN RESET LẠI?</p>
          <p className="beat beat-three"><small>TẤM VÉ DUY NHẤT CÒN TỒN TẠI</small>VÀ MỘT TÍN HIỆU LIÊN TỤC CẢNH BÁO</p>
          <p className="beat beat-signal">PLEASE<br />REMEMBER US</p>
        </section>

        <section className="title-card">
          <span className="eyebrow">AURELIA RECOVERY SYSTEM · 2103</span>
          <div className="title-mark" aria-label="Echoes of Tomorrow">
            <span>ECHOES</span><i>OF TOMORROW</i>
          </div>
          <p>Thành phố biến mất khỏi bản đồ, dòng hồi tưởng đang bắt đầu...<br />Tín hiệu phát ra từ trung tâm...</p>
          <div className="title-actions">
            <button className="primary" onClick={() => setScreen('TRAIN')}>RESET ECHO</button>
            <span>RECOVERY SIGNAL // 00.013</span>
          </div>
        </section>

        {!titleIntroDone && (
          <button className="skip-overture" onClick={() => setTitleIntroDone(true)}>BỎ QUA ĐOẠN MỞ ĐẦU ↗</button>
        )}
        <button
          className={`title-sound ${soundOn ? 'on' : ''}`}
          onClick={() => {
            if (soundUnlocked) setSoundOn(value => !value);
          }}
          aria-pressed={soundOn}
        >
          <i aria-hidden="true" /><span>{soundOn ? (soundUnlocked ? 'ÂM THANH · ON' : 'CHẠM ĐỂ NGHE · ON') : 'ÂM THANH · OFF'}</span>
        </button>
        <div className="overture-progress" aria-hidden="true" />
      </main>
    );
  }

  if (screen === 'TRAIN') {
    return (
      <main className={`echo-game train-screen train-phase-${trainPhase} clue-step-${Math.min(trainClues.length, 3)} ${trainTime <= 15 ? 'time-critical' : ''}`}>
        <div className="chaos-debris" aria-hidden="true">
          <i /><i /><i /><i /><i /><i /><i /><i />
        </div>
        <div className="blackout-transmission" aria-hidden="true">
          <p>XIN HÃY TÌM LỐI RA<br />VÀ MANG ĐI HẾT NHỮNG GÌ THUỘC VỀ QUÝ KHÁCH</p>
          <p>THỨ THUỘC VỀ BẠN KHÔNG CHỈ NẰM TRONG HÀNH LÝ</p>
          <p>XIN NHẮC LẠI ĐỪNG ĐỂ QUÊN BẤT KỲ THỨ GÌ TRÊN TOA TÀU NÀY!</p>
        </div>
        <div className="cabin-chaos">
          <i className="debris paper p1" /><i className="debris paper p2" /><i className="debris paper p3" />
          <i className="debris shard s1" /><i className="debris shard s2" /><i className="debris shard s3" />
          <i className="debris luggage" /><i className="debris cable" />
          <span className="spark sp1" /><span className="spark sp2" /><span className="spark sp3" />
          {[
            ['03', 'cf1'], ['E', 'cf2'], ['◒', 'cf3'], ['17', 'cf4'], ['07', 'cf5'], ['W', 'cf6'], ['☾', 'cf7'],
          ].map(([symbol, cls]) => <button key={symbol} className={`code-fragment ${cls} ${trainFragments.includes(symbol) ? 'collected' : ''}`} aria-label={`Mảnh mã ${symbol}`} onClick={() => collectTrainFragment(symbol)}><span>{symbol}</span></button>)}
        </div>
        <div className="train-window">
          <div className="rail-world rail-far" />
          <div className="rail-world rail-mid" />
          <div className="track-streaks" />
          <div className="power-poles"><i /><i /><i /></div>
          <div className="window-rain" />
          <div className="tunnel-flash" />
          <button className={`passenger-reflection train-clue ${trainClues.includes('reflection') ? 'found' : ''}`} onClick={() => noticeTrainClue('reflection')} aria-label="Quan sát bóng phản chiếu"><span /></button>
          <button className={`window-signal train-clue ${trainClues.includes('signal') ? 'found' : ''}`} onClick={() => noticeTrainClue('signal')}><i /> SIGNAL // 00.013</button>
        </div>
        <section className="train-copy">
          <div className="train-meta"><span className="eyebrow">TOA 07 · KHÔNG CÓ HÀNH KHÁCH KHÁC</span><b>{String(Math.floor(trainTime / 60)).padStart(2, '0')}:{String(trainTime % 60).padStart(2, '0')}</b><button className={clockOn ? 'powered' : ''} onClick={() => setClockOn(v => !v)}>CLOCK {clockOn ? 'ON' : 'OFF'}</button></div>
          <button className={`destination train-clue ${trainClues.includes('destination') ? 'found' : ''}`} onClick={() => noticeTrainClue('destination')}>DESTINATION <strong><s>AURELIA</s> <em>UNKNOWN</em></strong><small>ARRIVAL 05:42:17 · ARRIVAL 05:42:17 · ARRIVAL ———</small><span className="destination-ghost">PL_TF_RM&nbsp;&nbsp;0_</span></button>
          <button className={`ticket train-clue ${trainClues.includes('ticket') ? 'found flipped' : ''}`} onClick={() => noticeTrainClue('ticket')} aria-label="Lật và quan sát tấm vé">
            <span className="ticket-front"><small>PROJECT ECHO // ONE WAY</small><b>Passenger: <span>██████</span></b><i>05:41:58</i></span>
            <span className="ticket-back"><small>NO RETURN // 2189</small><span className="route-order" aria-label="Một sơ đồ gồm sân ga, la bàn, đường chân trời và đồng hồ"><i className="route-platform" /><b>→</b><i className="route-compass" /><b>→</b><i className="route-horizon" /><b>→</b><i className="route-clock" /></span></span>
          </button>
          <button className={`hidden-clock train-clue ${clockOn ? 'clock-powered' : 'clock-off'} ${trainClues.includes('clock') ? 'found' : ''}`} onClick={() => clockOn && noticeTrainClue('clock')} aria-label="Quan sát chiếc đồng hồ kim đang chỉ năm giờ">
            <span className="clock-face">
              <span className="clock-number n12">12</span><span className="clock-number n3">3</span><span className="clock-number n6">6</span><span className="clock-number n9">9</span>
              <i className="clock-hour" /><i className="clock-minute" /><i className="clock-second" />
            </span>
          </button>
          <div className="train-story">
            {trainClues.length === 0 && <TypeLine>Đường ray đang lao ngược về phía sau và kim tốc độ đã đứng ở vạch số không.</TypeLine>}
            {trainClues.includes('destination') && <TypeLine>Vòng lặp thời gian như một lời cầu cứu. 05:42 xuất hiện cả trên chiếc đồng hồ đã chết.</TypeLine>}
            {trainClues.includes('reflection') && <TypeLine dim>Bóng người thấp thoáng nhìn về phía Đông, nơi một quầng sáng đang mọc dưới đường chân trời.</TypeLine>}
            {trainClues.includes('signal') && <TypeLine dim>Nhịp thứ ba khiến dấu E trên vé sáng lên. Những nhịp còn lại không tác động đến bất cứ thứ gì.</TypeLine>}
          </div>
          {trainClues.includes('ticket') && !trainLockSolved && <div className="train-symbol-lock">
            <div className="lock-slots">{[0, 1, 2, 3].map(i => <i key={i}>{trainSequence[i] || '·'}</i>)}</div>
            <div className="lock-symbols">{trainFragments.map(symbol => <button key={symbol} onClick={() => enterTrainSymbol(symbol)}>{symbol}</button>)}</div>
            <small>CAPTURED FRAGMENTS // {trainFragments.length}/7</small>
          </div>}
          <button className={`carriage-door train-exit ${trainLockSolved ? 'revealed' : ''}`} disabled={!trainLockSolved} onClick={() => trainLockSolved && setScreen('GAME')}>
            <i>07</i><span>{trainLockSolved ? 'RỜI KHỎI TOA TÀU' : 'RỜ_ K_ỎI T_A T_U'}</span><small>{trainLockSolved ? 'EMERGENCY RELEASE' : 'MEMORY SEQUENCE REQUIRED'}</small>
          </button>
          <small className="observation-count">OBSERVATIONS // {String(trainClues.length).padStart(2, '0')} · FRAGMENTS // {trainFragments.length}/7 · Một số mảnh chỉ thuộc về toa tàu, không thuộc về lối ra.</small>
        </section>
        {trainFailed && <div className="void-failure"><span>00:00</span><h2>TOA 07 KHÔNG CÒN TỒN TẠI</h2><p>Trên chuyến tàu đã xảy ra điều gì đó, mớ ký ức mơ hồ cứ tiếp tục tiếp diễn...</p><button onClick={() => { setTrainTime(90); setTrainClues([]); setTrainFragments([]); setClockOn(false); setTrainSequence([]); setTrainLockSolved(false); setTrainFailed(false); }}>THỬ GHI NHỚ LẠI</button></div>}
        {trainHint && <div className="fleeting-hint"><span>TRANSIENT MEMORY</span><p>{trainHint}</p></div>}
      </main>
    );
  }

  if (ending) {
    const restore = ending === 'RESTORE';
    return (
      <main className={`echo-game ending ${restore ? 'restored' : 'erased'}`}>
        <section>
          <span className="eyebrow">{restore ? 'AURELIA // SIGNAL RESTORED' : 'DESTINATION // UNKNOWN'}</span>
          <h1>{restore ? 'SOME THINGS HURT' : 'PLEASE'}</h1>
          <h2>{restore ? 'BECAUSE THEY MATTERED.' : 'REMEMBER US.'}</h2>
          <p>{restore
            ? 'Thành phố dường như đã biến mất. Nhưng tên của nó vẫn tồn tại xoay vòng cùng thời gian.'
            : 'Một hành khách khác ngồi trên chuyến tàu. Tấm vé trong tay cũng trở nên kỳ lạ'}</p>
          <button className="primary" onClick={() => window.location.reload()}>CHƠI LẠI</button>
        </section>
      </main>
    );
  }

  return (
    <main className={`echo-game game-shell chapter-${chapter + 1} ${echoOn ? 'echo-active' : ''} ${corrupt ? 'corrupt' : ''}`}>
      <header className="system-bar">
        <div><b>{corrupt ? 'AUREL_A REC_VERY SYS__M' : 'AURELIA RECOVERY SYSTEM'}</b><span>PROJECT ECHO</span></div>
        <nav>
          <span>{corrupt ? 'MEM...' : 'MEMORIES'} {memories.length}/3</span>
          <span>{corrupt ? 'M_P' : 'MAP'}</span>
          <span>{corrupt ? 'OBJECT___' : 'OBJECTIVE'}</span>
          <span>{corrupt ? 'SYS' : 'SYSTEM'}</span>
          <button className="reset-checkpoint" onClick={clearSavedGame}>RESET SAVE</button>
        </nav>
      </header>

      <section className="chapter-heading">
        <span>CHAPTER {String(chapter + 1).padStart(2, '0')}</span>
        <h1>{corrupt ? chapterNames[chapter].replace(/[AEIOU]/g, '_') : chapterNames[chapter]}</h1>
        <p>{objective}</p>
      </section>

      <section className="scene-panel">
        <div className="scene-atmosphere" aria-hidden="true">
          <i /><i /><i /><i /><i /><i />
        </div>
        <div className="light-sweep" aria-hidden="true" />
        {chapter === 0 && <Station echoOn={echoOn} clues={clues} discover={discover} onSolve={(symbol) => {
          if (symbol !== '☀') return flash('Đường ray im lặng. Đây không phải tuyến cần tìm.');
          offerMemory('station', () => goChapter(1));
        }} />}
        {chapter === 1 && <Apartment echoOn={echoOn} clues={clues} discover={discover} order={familyOrder} setOrder={setFamilyOrder} onSolve={() => {
          if (familyOrder.join('') !== '○△◇☀') return flash('Két không mở. Thứ tự ký ức chưa đúng.');
          offerMemory('mother', () => offerMemory('birthday', () => goChapter(2)));
        }} />}
        {chapter === 2 && <School echoOn={echoOn} clues={clues} discover={discover} onSolve={(time) => {
          if (time !== '12:00') return flash('Tiếng chuông méo đi. Thời gian này không khớp với hiện tại.');
          offerMemory('school', () => goChapter(3));
        }} />}
        {chapter === 3 && <VanishingStreet echoOn={echoOn} held={heldStreet} setHeld={setHeldStreet} onSolve={() => {
          const valid = ['BRIDGE', 'LAMP', 'DOOR'].every(x => heldStreet.includes(x));
          if (!valid) return flash('Con đường sụp khỏi ký ức. Hãy giữ ba điểm tạo thành lối đi.');
          offerMemory('street', () => goChapter(4));
        }} />}
        {chapter === 4 && <Tomorrow memories={memories} links={finalLinks} setLinks={setFinalLinks} onSolve={() => {
          if (finalLinks.length < 3) return flash('CONTRADICTION INSUFFICIENT. Cần ba ký ức có ý nghĩa.');
          setScreen('CHOICE');
        }} />}
      </section>

      {chapter < 4 && (
        <button className={`lens ${echoOn ? 'on' : ''}`} onClick={() => setEchoOn(v => !v)}>
          <span>◉</span> ECHO LENS <b>{echoOn ? 'ACTIVE' : 'OFFLINE'}</b>
        </button>
      )}

      <aside className="memory-dock">
        {memories.map(m => <div key={m.id}><b>{m.title}</b><small>{m.meaning}</small></div>)}
        {Array.from({ length: 3 - memories.length }).map((_, i) => <div className="empty" key={i}>EMPTY FRAGMENT</div>)}
      </aside>

      {notice && <div className="notice">{notice}</div>}

      {pendingMemory && (
        <div className="modal-backdrop">
          <section className="memory-modal">
            <span className="eyebrow">MEMORY FRAGMENT DETECTED</span>
            <h2>{pendingMemory.memory.title}</h2>
            <p><b>PAIN</b> — {pendingMemory.memory.pain}</p>
            <p><b>MEANING</b> — {pendingMemory.memory.meaning}</p>
            {memories.length < 3 ? (
              <button className="primary" onClick={() => storeMemory()}>LƯU KÝ ỨC</button>
            ) : (
              <><p className="warning">ECHO LENS đã đầy. Chọn một ký ức để thay thế:</p>
              <div className="replace-list">{memories.map(m => <button key={m.id} onClick={() => storeMemory(m.id)}>BỎ “{m.title}”</button>)}</div></>
            )}
            <button className="text-button" onClick={skipMemory}>ĐỂ KÝ ỨC NÀY BIẾN MẤT</button>
          </section>
        </div>
      )}

      {screen === 'CHOICE' && (
        <div className="modal-backdrop final-choice">
          <section>
            <span className="eyebrow">CREATOR_ID // PASSENGER ██████ // DIRECTIVE: MAKE ME FORGET</span>
            <h2>Bạn đã tạo ra TOMORROW.</h2>
            <p>Nó chỉ mở rộng yêu cầu của bạn từ một con người ra toàn thành phố.</p>
            <div><button onClick={() => setEnding('RESTORE')}>RESTORE<small>Khôi phục ký ức và cả nỗi đau</small></button><button onClick={() => setEnding('ERASE')}>ERASE<small>Hoàn thành Tomorrow Project</small></button></div>
          </section>
        </div>
      )}
    </main>
  );
}

function Station({ onSolve }) {
  const [boothOpen, setBoothOpen] = useState(false);
  const [activeArea, setActiveArea] = useState(null);
  const [handsSeen, setHandsSeen] = useState([]);
  const [machineInspected, setMachineInspected] = useState(false);
  const [cleaner, setCleaner] = useState(false);
  const [answers, setAnswers] = useState([]);
  const [caseUnlocked, setCaseUnlocked] = useState(false);
  const [filterStored, setFilterStored] = useState(false);
  const [posterOpen, setPosterOpen] = useState(false);
  const [posterOrder, setPosterOrder] = useState([4, 1, 5, 0, 3, 2]);
  const [selectedPosterPiece, setSelectedPosterPiece] = useState(null);
  const [filterPlaced, setFilterPlaced] = useState(false);
  const [filterPosition, setFilterPosition] = useState({ x: 12, y: 14 });
  const [filterAngle, setFilterAngle] = useState(0);
  const posterBoardRef = useRef(null);
  const [coordinate, setCoordinate] = useState('');
  const [mapOpen, setMapOpen] = useState(false);
  const [glyphOrder, setGlyphOrder] = useState([]);
  const posterTarget = [0, 1, 2, 3, 4, 5];
  const caseFound = handsSeen.length === 2;
  const posterSolved = posterOrder.join('') === posterTarget.join('');
  const normalizedAngle = ((filterAngle % 360) + 360) % 360;
  const filterAligned = posterSolved && filterPosition.x >= 39 && filterPosition.x <= 45 && filterPosition.y >= 35 && filterPosition.y <= 41 && normalizedAngle === 0;
  const glyphs = [{ glyph: '⌁', digit: '4' }, { glyph: '◒', digit: '0' }, { glyph: '⌬', digit: '7' }, { glyph: '△', digit: '2' }, { glyph: '⊙', digit: '5' }, { glyph: '⋔', digit: '1' }];
  const glyphTarget = ['◒', '⊙', '⌁', '△', '⋔', '⌬'];

  const chooseAnswer = (value) => {
    const target = ['4', '2', '1'];
    const next = [...answers, value];
    if (target[next.length - 1] !== value) return setAnswers([]);
    setAnswers(next);
  };

  const chooseGlyph = (glyph) => {
    const next = [...glyphOrder, glyph];
    if (glyphTarget[next.length - 1] !== glyph) return setGlyphOrder([]);
    setGlyphOrder(next);
    if (next.length === glyphTarget.length) window.setTimeout(() => onSolve('☀'), 550);
  };

  const swapPosterPiece = (index) => {
    if (selectedPosterPiece === null) return setSelectedPosterPiece(index);
    if (selectedPosterPiece === index) return setSelectedPosterPiece(null);
    setPosterOrder(order => {
      const next = [...order];
      [next[selectedPosterPiece], next[index]] = [next[index], next[selectedPosterPiece]];
      return next;
    });
    setSelectedPosterPiece(null);
  };

  const dragGrille = (event) => {
    if (!posterBoardRef.current) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    const rect = posterBoardRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(68, ((event.clientX - rect.left) / rect.width) * 100 - 16));
    const y = Math.max(0, Math.min(74, ((event.clientY - rect.top) / rect.height) * 100 - 13));
    setFilterPosition({ x, y });
  };

  const settleGrille = () => {
    const nearTarget = filterPosition.x >= 34 && filterPosition.x <= 50 && filterPosition.y >= 30 && filterPosition.y <= 46;
    if (nearTarget && normalizedAngle === 0) setFilterPosition({ x: 42, y: 38 });
  };

  return <div className={`location station station-investigation ${boothOpen ? 'booth-is-open' : ''}`}><div className="depth-layer depth-a" /><div className="depth-layer depth-b" />
    <div className="station-fog" aria-hidden="true"><i /><i /><i /></div>
    <div className="environment"><span className="clock station-master-clock"><small>LOCAL TIME</small>05:42:17</span><h3>GA AURELIA CENTRAL</h3><p>Ba khu vực vẫn còn điện: quầy vé, poster tuyến tàu và bản đồ thành phố.</p></div>

    <div className="physical-station-scene" aria-label="Không gian điều tra nhà ga">
      <button className={`physical-booth-door ${boothOpen ? 'open' : ''}`} onClick={() => !boothOpen && setBoothOpen(true)} aria-label="Mở cửa quầy vé"><span>CỬA QUẦY VÉ</span></button>
      <div className={`booth-interior ${boothOpen ? 'accessible' : ''}`}>
        <button className={`handprint hand-a ${handsSeen.includes('left') ? 'seen' : ''}`} onClick={() => setHandsSeen(prev => prev.includes('left') ? prev : [...prev, 'left'])} aria-label="Dấu bàn tay trái"><span>{handsSeen.includes('left') ? '01 ✓' : ''}</span></button>
        <button className={`handprint hand-b ${handsSeen.includes('right') ? 'seen' : ''}`} onClick={() => setHandsSeen(prev => prev.includes('right') ? prev : [...prev, 'right'])} aria-label="Dấu bàn tay phải"><span>{handsSeen.includes('right') ? '02 ✓' : ''}</span></button>
        <button className={`physical-ticket-machine ${caseFound ? 'awake' : ''}`} onClick={() => { if (caseFound) { setMachineInspected(true); setActiveArea('machine'); } }} aria-label="Máy bán vé"><i /><span>MÁY BÁN VÉ</span></button>
        <button className={`physical-lamp ${machineInspected ? 'available' : ''} ${cleaner ? 'taken' : ''}`} onClick={() => machineInspected && setCleaner(true)} aria-label="Bóng đèn trong quầy"><i /></button>
      </div>
      <button className={`physical-locked-case scene-case ${caseFound ? 'visible' : ''} ${caseUnlocked ? 'open' : ''}`} onClick={() => caseUnlocked && setActiveArea('case')} aria-label="Vật thể bị khóa"><i /><b>PROPERTY<br />00.013</b><small>{caseUnlocked ? 'UNLOCKED' : 'LOCKED'}</small></button>
      <button className={`physical-poster ${filterStored ? 'next-objective' : ''} ${posterSolved ? 'restored' : ''}`} onClick={() => { setPosterOpen(true); setActiveArea('poster'); }} aria-label="Poster rách trên cột"><i /><span>POSTER RÁCH</span></button>
      <button className={`physical-map ${coordinate ? 'coordinate-ready' : ''}`} onClick={() => { setMapOpen(true); setActiveArea('map'); }} aria-label="Bản đồ Aurelia"><i /><span>BẢN ĐỒ THÀNH PHỐ</span></button>
      <div className="scene-instruction">CLICK TRỰC TIẾP VÀO VẬT THỂ · GIỮ CHUỘT ĐỂ QUAN SÁT</div>
      {boothOpen && !caseFound && <div className="hand-progress">HANDPRINT RECOVERY // {handsSeen.length}/2</div>}
      {caseFound && !caseUnlocked && <div className="case-reveal-signal"><i />VẬT THỂ 00.013 ĐÃ PHẢN HỒI · MÁY BÁN VÉ ĐANG CHỜ</div>}
      {machineInspected && !cleaner && activeArea !== 'machine' && <div className="case-reveal-signal lamp-signal"><i />LỚP NHÒE PHẢN XẠ ÁNH ĐÈN · KIỂM TRA BÓNG ĐÈN TRONG QUẦY</div>}
      {caseUnlocked && !filterStored && <div className="case-reveal-signal unlocked"><i />KHÓA ĐÃ NHẢ · CLICK VÀO HỘP TRONG QUẦY</div>}
      {filterStored && !posterSolved && activeArea === null && <div className="case-reveal-signal poster-signal"><i />TẤM LỌC PHẢN ỨNG VỚI POSTER TRÊN CỘT GIỮA</div>}
    </div>

    {activeArea === 'machine' && <section className="station-puzzle ticket-booth-puzzle inspection-overlay"><button className="close-inspection" onClick={() => setActiveArea(null)}>×</button>
      <div className={`ticket-machine ${cleaner ? 'clean' : 'blurred'}`}>
        <header>MÁY BÁN VÉ // LOGIC RECOVERY</header>
        {!cleaner && <p className="machine-smear">Ký tự bị nhòe bởi lớp dầu quang học. Một quầng sáng từ bóng đèn phản chiếu trên màn hình.</p>}
        <div className="logic-question"><span>Ⅰ. Số sân ga đứng sau 3 nhưng trước 5.</span><div>{['3','4','6'].map(x => <button key={x} onClick={() => cleaner && chooseAnswer(x)}>{x}</button>)}</div></div>
        <div className="logic-question"><span>Ⅱ. Một đoàn tàu có hai đầu nhưng không có…</span><div>{['1','2','4'].map(x => <button key={x} onClick={() => cleaner && chooseAnswer(x)}>{x}</button>)}</div></div>
        <div className="logic-question"><span>Ⅲ. Chỉ một đường ray rời khỏi Aurelia.</span><div>{['1','3','5'].map(x => <button key={x} onClick={() => cleaner && chooseAnswer(x)}>{x}</button>)}</div></div>
        <div className="machine-code">INPUT // {answers.join('') || '···'} <button disabled={!cleaner || answers.length !== 3} onClick={() => { if (answers.join('') === '421') { setCaseUnlocked(true); setActiveArea(null); } }}>MỞ KHÓA VẬT THỂ</button></div>
      </div>
    </section>}

    {activeArea === 'case' && caseUnlocked && <section className="station-puzzle case-inspection inspection-overlay"><button className="close-inspection" onClick={() => setActiveArea(null)}>×</button><div className="opened-case-object"><i /><span>VÉ KIM LOẠI ĐỤC LỖ // AURELIA<br />PROPERTY OF PASSENGER 00.013</span></div>{!filterStored ? <button className="collect-filter" onClick={() => { setFilterStored(true); setActiveArea(null); }}><i />LƯU VÉ ĐỤC LỖ VÀO HÀNH LÝ</button> : <p>Vật thể này đã nằm trong hành lý.</p>}</section>}

    {posterOpen && activeArea === 'poster' && <section className="station-puzzle poster-puzzle inspection-overlay"><button className="close-inspection" onClick={() => setActiveArea(null)}>×</button>
      {!posterSolved ? <><p className="puzzle-label">Chọn một mảnh rồi chọn mảnh thứ hai để đổi chỗ. Các đường ray, mặt trời và đường chân trời phải nối liền.</p><div className="real-poster-grid">{posterOrder.map((piece, index) => <button key={index} onClick={() => swapPosterPiece(index)} className={`real-poster-piece piece-${piece} ${selectedPosterPiece === index ? 'selected' : ''}`} aria-label={`Mảnh poster ${index + 1}`}><i /></button>)}</div><button className="puzzle-reset" onClick={() => { setPosterOrder([4, 1, 5, 0, 3, 2]); setSelectedPosterPiece(null); }}>XÁO LẠI POSTER</button></> : <div ref={posterBoardRef} className="assembled-poster real-assembled-poster">
        <div className="poster-art real-poster-art"><div className="cipher-noise" aria-hidden="true">Q7 MA 2⌁ R9 K4 DC 8H 3X N6 T1 · LQ 84 P7 AX 08 RQ 6M 89</div><div className="grille-coordinate" aria-label="Tọa độ ẩn trong poster"><span>48P</span><span>—</span><span>XQ</span><span>8689</span></div></div>
        {!filterStored && <p className="locked-note">Mật mã vẫn chứa quá nhiều nét thừa. Vật thể trong hộp 00.013 có cùng kích thước với vùng trung tâm.</p>}
        {filterStored && !filterPlaced && <button className="place-filter" onClick={() => setFilterPlaced(true)}>LẤY VÉ ĐỤC LỖ TỪ HÀNH LÝ VÀ ĐẶT LÊN POSTER</button>}
        {filterStored && filterPlaced && <div className={`cardan-grille ${filterAligned ? 'aligned' : ''}`} style={{ left: `${filterPosition.x}%`, top: `${filterPosition.y}%`, transform: `rotate(${filterAngle}deg)` }} onPointerDown={dragGrille} onPointerMove={event => event.buttons === 1 && dragGrille(event)} onPointerUp={settleGrille} onDoubleClick={() => setFilterAngle(angle => angle + 90)} role="application" aria-label="Vé kim loại đục lỗ có thể kéo và nhấp đúp để xoay"><svg viewBox="0 0 420 150" preserveAspectRatio="none" aria-hidden="true"><defs><mask id="cardan-holes"><rect width="420" height="150" fill="white" /><rect x="28" y="48" width="80" height="48" rx="4" fill="black" /><rect x="125" y="48" width="45" height="48" rx="4" fill="black" /><rect x="187" y="48" width="75" height="48" rx="4" fill="black" /><rect x="279" y="48" width="112" height="48" rx="4" fill="black" /></mask><linearGradient id="grille-metal" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#59615d" /><stop offset=".5" stopColor="#151b1a" /><stop offset="1" stopColor="#373e3b" /></linearGradient></defs><rect width="420" height="150" rx="7" fill="url(#grille-metal)" mask="url(#cardan-holes)" /><rect x="4" y="4" width="412" height="142" rx="6" fill="none" stroke="#9b8658" strokeWidth="8" /></svg></div>}
        {filterStored && filterPlaced && !filterAligned && <div className="grille-instruction">KÉO TẤM GRILLE · NHẤP ĐÚP ĐỂ XOAY</div>}
        {filterAligned && <button className="coordinate-found" onClick={() => { setCoordinate('48P-XQ8689'); setMapOpen(true); }}>GHI TỌA ĐỘ VỪA ĐỌC LÊN VÉ</button>}
      </div>}
    </section>}

    {mapOpen && activeArea === 'map' && <section className="station-puzzle map-puzzle inspection-overlay"><button className="close-inspection" onClick={() => setActiveArea(null)}>×</button>
      <div className="aurelia-grid">{['48P','17K','63M','82R','XQ','AL','TZ','BN','8689','2401','7310','5942','ECHO','VOID','AUR','013'].map(cell => <button key={cell} className={coordinate.includes(cell) ? 'marked' : ''} onClick={() => coordinate === '48P-XQ8689' && cell === '8689' && setCoordinate('48P-XQ8689-OPEN')}>{cell}<i /></button>)}</div>
      {coordinate !== '48P-XQ8689-OPEN' ? <p className="map-status">{coordinate ? 'Tọa độ đã được ghi trên vé. Đối chiếu lần lượt ba vùng trên lưới.' : 'Không có tọa độ. Bản đồ không biết phải khôi phục khu vực nào.'}</p> : <div className="glyph-lock">
        <p>Sáu tượng hình mang sáu chữ số. Đồng hồ nhà ga quyết định thứ tự.</p>
        <div className="glyph-slots">{[0,1,2,3,4,5].map(i => <i key={i}>{glyphOrder[i] || '·'}</i>)}</div>
        <div className="glyph-bank">{glyphs.map(item => <button key={item.glyph} onClick={() => chooseGlyph(item.glyph)}><b>{item.glyph}</b><small>{item.digit}</small></button>)}</div>
        <button className="puzzle-reset" onClick={() => setGlyphOrder([])}>XÓA THỨ TỰ</button>
      </div>}
    </section>}

    {(cleaner || filterStored) && <aside className="station-inventory"><span>HÀNH LÝ {filterStored ? '02' : '01'}/04</span>{cleaner && <b>◉ KÍNH PHÂN CỰC</b>}{filterStored && <b>▣ VÉ KIM LOẠI ĐỤC LỖ</b>}</aside>}
  </div>;
}

function Apartment({ echoOn, clues, discover, order, setOrder, onSolve }) {
  const tokens = ['☀', '◇', '○', '△'];
  return <div className="location apartment"><div className="depth-layer depth-a" /><div className="depth-layer depth-b" />
    <div className="environment"><h3>CĂN HỘ 17B</h3><p>Bữa tối còn ấm. Mưa vẫn trượt trên cửa kính. Căn hộ đang chờ một gia đình không còn tồn tại.</p></div>
    <div className="evidence-grid four spatial-hotspots apartment-hotspots">
      {[
        ['kitchen', 'CĂN BẾP', '○ Một người mẹ bước ra từ ánh đèn bếp, đặt chiếc bánh xuống trước tất cả. Nồi thức ăn vẫn sôi nhưng không tỏa hơi.'],
        ['hall', 'HÀNH LANG TỐI', '△ Tiếng khóa cửa vang lên. Một đứa trẻ chạy qua hành lang, nhưng con gấu bông dưới sàn không hề dịch chuyển.'],
        ['window', 'KHUNG CỬA MƯA', '◇ Người cha đứng bên cửa sổ và kéo rèm. Trong kính phản chiếu năm người, còn trong phòng chỉ có bốn ghế.'],
        ['table', 'BÀN SINH NHẬT', '☀ Một bàn tay không thuộc về ai thắp ngọn nến cuối cùng. Bức ảnh bên cạnh mất đúng một khuôn mặt.'],
      ].map(([id, name, text]) => <button className={`hotspot ${id}`} key={id} onClick={() => echoOn && discover(id)}><i /><b>{name}</b><span>{echoOn && clues.includes(id) ? text : echoOn ? 'Một lớp bụi vàng đang tụ lại. Chạm để ổn định Echo.' : 'Vật thể im lặng, nhưng bóng của nó chậm hơn ánh sáng một nhịp.'}</span></button>)}
    </div>
    <div className="safe"><b>KÉT KÝ ỨC</b><div>{order.map((x, i) => <button key={i} onClick={() => setOrder(order.filter((_, n) => n !== i))}>{x}</button>)}{Array.from({ length: 4 - order.length }).map((_, i) => <i key={i}>—</i>)}</div><div>{tokens.map(t => <button disabled={order.includes(t)} key={t} onClick={() => setOrder([...order, t])}>{t}</button>)}</div><button className="primary" onClick={onSolve}>MỞ KÉT</button></div>
  </div>;
}

function School({ echoOn, clues, discover, onSolve }) {
  const times = ['10:15', '08:30', '12:00', '09:45', '11:20'];
  return <div className="location school"><div className="depth-layer depth-a" /><div className="depth-layer depth-b" />
    <div className="environment"><h3>EXAM IN PROGRESS</h3><p>Năm đồng hồ chỉ năm thời điểm. Chuông chỉ chấp nhận một hiện tại.</p></div>
    <div className="evidence-grid">
      <button onClick={() => discover('lunch')}><b>HỘP CƠM</b><span>{clues.includes('lunch') ? 'Vẫn còn nóng. Đây là giờ nghỉ trưa.' : 'Kiểm tra nhiệt độ'}</span></button>
      <button onClick={() => echoOn && discover('students')}><b>SÂN TRƯỜNG</b><span>{echoOn && clues.includes('students') ? 'Học sinh tràn khỏi lớp khi mặt trời ở đỉnh.' : 'Những chiếc bóng đều rất ngắn.'}</span></button>
      <button onClick={() => discover('schedule')}><b>THỜI KHÓA BIỂU</b><span>{clues.includes('schedule') ? 'LUNCH BREAK — 12:00' : 'Một trang bị gấp lại'}</span></button>
    </div>
    <div className="clock-row">{times.map(t => <button key={t} onClick={() => onSolve(t)}>{t}</button>)}</div>
  </div>;
}

function VanishingStreet({ echoOn, held, setHeld, onSolve }) {
  const points = [['BRIDGE', 'CẦU'], ['TREE', 'CÂY'], ['LAMP', 'ĐÈN'], ['SIGN', 'BIỂN'], ['DOOR', 'CỬA']];
  const toggle = id => setHeld(prev => prev.includes(id) ? prev.filter(x => x !== id) : prev.length < 3 ? [...prev, id] : prev);
  return <div className="location street"><div className="depth-layer depth-a" /><div className="depth-layer depth-b" />
    <div className="environment"><h3>ĐƯỜNG KHÔNG CÒN TÊN</h3><p>“Một nơi tồn tại chừng nào còn ai nhớ mình từng ở đó.”</p></div>
    <div className="vanishing-path">{points.map(([id, name], i) => <button className={held.includes(id) ? 'held' : (!echoOn && i % 2 ? 'faded' : '')} key={id} onClick={() => echoOn && toggle(id)}><b>{name}</b><small>{held.includes(id) ? 'HELD IN MEMORY' : echoOn ? 'GIỮ KÝ ỨC' : '...'}</small></button>)}</div>
    <p className="hint">Echo Lens chỉ giữ được 3 điểm. Hãy tạo một lối liên tục: điểm bắt đầu, ánh sáng dẫn đường và lối ra.</p>
    <button className="primary" onClick={onSolve}>BƯỚC VÀO CON ĐƯỜNG</button>
  </div>;
}

function Tomorrow({ memories, links, setLinks, onSolve }) {
  const toggle = id => setLinks(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  return <div className="location tomorrow"><div className="depth-layer depth-a" /><div className="depth-layer depth-b" />
    <div className="tomorrow-core"><span>TOMORROW</span><p>“Tôi đã xóa đau khổ. Hãy cho tôi thấy vì sao ký ức đau buồn nên tồn tại.”</p></div>
    <div className="meaning-chain"><b>PAIN</b><i>→</i><b>MEMORY</b><i>→</i><b>MEANING</b></div>
    <div className="final-memories">{memories.map(m => <button className={links.includes(m.id) ? 'linked' : ''} key={m.id} onClick={() => toggle(m.id)}><span>{m.pain}</span><b>{m.title}</b><small>{m.meaning}</small></button>)}</div>
    <button className="primary" onClick={onSolve}>GỬI MÂU THUẪN CHO TOMORROW</button>
  </div>;
}
