import { useEffect, useMemo, useState } from 'react';
import './EchoesOfTomorrow.css';

const MEMORIES = {
  station: { id: 'station', title: 'Lời hứa ở sân ga', pain: 'Sợ bị bỏ quên', meaning: 'Một lời hứa dẫn ta về nhà' },
  mother: { id: 'mother', title: 'Lá thư của mẹ', pain: 'Nỗi sợ mất một người', meaning: 'Tình yêu vẫn tồn tại sau chia lìa' },
  birthday: { id: 'birthday', title: 'Sinh nhật thiếu người', pain: 'Một chỗ ngồi trống', meaning: 'Sự vắng mặt chứng minh họ từng thuộc về nơi này' },
  school: { id: 'school', title: 'Tiếng chuông cuối', pain: 'Ngày học không bao giờ trở lại', meaning: 'Ta trưởng thành vì những ngày đã qua' },
  street: { id: 'street', title: 'Con đường biến mất', pain: 'Một nơi đang bị xóa', meaning: 'Nơi chốn sống trong người từng đi qua nó' },
};

const chapterNames = ['THE STATION', 'THE APARTMENT', 'THE SILENT SCHOOL', 'THE CITY THAT FORGOT ITSELF', 'TOMORROW'];

function TypeLine({ children, dim = false }) {
  return <p className={dim ? 'type-line dim' : 'type-line'}>{children}</p>;
}

export default function EchoesOfTomorrow() {
  const [screen, setScreen] = useState('TITLE');
  const [chapter, setChapter] = useState(0);
  const [echoOn, setEchoOn] = useState(false);
  const [clues, setClues] = useState([]);
  const [memories, setMemories] = useState([]);
  const [pendingMemory, setPendingMemory] = useState(null);
  const [notice, setNotice] = useState('');
  const [familyOrder, setFamilyOrder] = useState([]);
  const [heldStreet, setHeldStreet] = useState([]);
  const [finalLinks, setFinalLinks] = useState([]);
  const [ending, setEnding] = useState(null);
  const [trainClues, setTrainClues] = useState([]);
  const [trainTime, setTrainTime] = useState(90);
  const [trainFailed, setTrainFailed] = useState(false);
  const [trainHint, setTrainHint] = useState('');
  const [clockOn, setClockOn] = useState(false);
  const [trainSequence, setTrainSequence] = useState([]);
  const [trainLockSolved, setTrainLockSolved] = useState(false);
  const [trainFragments, setTrainFragments] = useState([]);
  const [titleIntroDone, setTitleIntroDone] = useState(false);
  const [soundOn, setSoundOn] = useState(true);
  const [soundUnlocked, setSoundUnlocked] = useState(false);

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
  }, [screen, titleIntroDone]);

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
      revealTrainHint('THỨ TỰ VỪA BỊ TỪ CHỐI. SƠ ĐỒ TRÊN VÉ CHỈ LOẠI DẤU VẾT CẦN ĐẶT TRƯỚC, KHÔNG CHỈ RA MÃ.');
      return;
    }
    setTrainSequence(next);
    if (next.length === target.length) setTrainLockSolved(true);
  };

  const collectTrainFragment = (symbol) => {
    setTrainFragments(prev => prev.includes(symbol) ? prev : [...prev, symbol]);
    revealTrainHint(`MẢNH “${symbol}” ĐÃ ĐƯỢC GIỮ LẠI. KHÔNG PHẢI MỌI MẢNH ĐỀU THUỘC VỀ LỐI RA.`);
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
  }, [screen, trainFailed]);

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
          <p className="beat beat-one"><small>HỒ SƠ 00.013 · NĂM 2189</small>AURELIA BIẾN MẤT TRONG MỘT ĐÊM.</p>
          <p className="beat beat-two">SÁNG HÔM SAU,<br />KHÔNG AI CÒN NHỚ THÀNH PHỐ ẤY.</p>
          <p className="beat beat-three"><small>MỘT TẤM VÉ KHÔNG CÓ TÊN.</small>VÀ MỘT TÍN HIỆU CHỈ MÌNH BẠN NGHE THẤY.</p>
          <p className="beat beat-signal">PLEASE<br />REMEMBER US.</p>
        </section>

        <section className="title-card">
          <span className="eyebrow">AURELIA RECOVERY SYSTEM · 2189</span>
          <div className="title-mark" aria-label="Echoes of Tomorrow">
            <span>ECHOES</span><i>OF TOMORROW</i>
          </div>
          <p>Một thành phố biến mất. Một thế giới đang quên.<br />Một tín hiệu vẫn cầu xin được nhớ.</p>
          <div className="title-actions">
            <button className="primary" onClick={() => setScreen('TRAIN')}>KHỞI ĐỘNG PROJECT ECHO</button>
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
          <p>ĐỪNG ĐỂ TOA TÀU NHỚ THAY BẠN</p>
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
          <button className={`hidden-clock train-clue ${clockOn ? 'clock-powered' : 'clock-off'} ${trainClues.includes('clock') ? 'found' : ''}`} onClick={() => clockOn && noticeTrainClue('clock')} aria-label="Quan sát chiếc đồng hồ bất thường">
            <span className="clock-face">
              <span className="clock-number n12">12</span><span className="clock-number n3">3</span><span className="clock-number n6">6</span><span className="clock-number n9">9</span>
              <i className="clock-hour" /><i className="clock-minute" /><i className="clock-second" /><b>17</b>
            </span>
          </button>
          <div className="train-story">
            {trainClues.length === 0 && <TypeLine>Đường ray vẫn lao ngược về phía sau, nhưng kim tốc độ đã đứng ở số không.</TypeLine>}
            {trainClues.includes('destination') && <TypeLine>Giờ đến lặp lại như một lời cầu cứu. 05:42 xuất hiện cả trên chiếc đồng hồ đã chết.</TypeLine>}
            {trainClues.includes('reflection') && <TypeLine dim>Bóng người trong kính nhìn về phía Đông, nơi một quầng sáng đang mọc dưới đường chân trời.</TypeLine>}
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
        {trainFailed && <div className="void-failure"><span>00:00</span><h2>TOA 07 KHÔNG CÒN TỒN TẠI</h2><p>Bạn nhớ mình từng ngồi trên một chuyến tàu, nhưng không còn nhớ đã xuống ở đâu.</p><button onClick={() => { setTrainTime(90); setTrainClues([]); setTrainFragments([]); setClockOn(false); setTrainSequence([]); setTrainLockSolved(false); setTrainFailed(false); }}>THỬ GHI NHỚ LẠI</button></div>}
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
            ? 'Thành phố không sống lại. Nhưng tên của nó, và những người từng yêu thương trong đó, đã trở về với ký ức thế giới.'
            : 'Một hành khách khác ngồi trên chuyến tàu. Tấm vé trong tay họ hoàn toàn trống.'}</p>
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

function Station({ echoOn, clues, discover, onSolve }) {
  const symbols = ['☀', '☂', '△', '○', '◇', '☾'];
  return <div className="location station"><div className="depth-layer depth-a" /><div className="depth-layer depth-b" />
    <div className="environment"><span className="clock">05:42:17</span><h3>GA AURELIA CENTRAL</h3><p>Đoàn tàu vẫn nằm đó, lạnh và nguyên vẹn. Không có dấu chân nào dẫn đến nó.</p></div>
    <div className="evidence-grid spatial-hotspots station-hotspots">
      <button className="hotspot booth" onClick={() => echoOn ? discover('father') : null}><i /><b>QUẦY VÉ BỎ HOANG</b><span>{echoOn ? 'Sau lớp kính, bóng một người cha cúi xuống: “Nếu lạc đường, con cứ đi theo nơi mặt trời...” Giọng nói tan vào tiếng bánh tàu không tồn tại.' : 'Hai dấu tay trẻ con còn in trên kính. Lớp bụi quanh chúng chưa từng bị thời gian chạm tới.'}</span></button>
      <button className="hotspot poster" onClick={() => discover('poster')}><i /><b>TẤM POSTER BONG TRÓC</b><span>{clues.includes('poster') ? 'Dưới lớp giấy mục: MORNING LINE · EASTBOUND. Mực vẫn còn ấm như vừa được in sáng nay.' : 'Một góc poster tự lay dù nhà ga không có gió.'}</span></button>
      <button className="hotspot map" onClick={() => discover('map')}><i /><b>BẢN ĐỒ ĐỨNG</b><span>{clues.includes('map') ? 'Tuyến phía Đông kết thúc tại Platform 03. Trên đó chỉ còn một biểu tượng mặt trời.' : 'Mọi con đường đã phai trắng, trừ một vệt mực hướng về phía Đông.'}</span></button>
    </div>
    <div className="answer-row">{symbols.map((s, i) => <button key={s} onClick={() => onSolve(s)}><small>0{i + 1}</small>{s}</button>)}</div>
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
