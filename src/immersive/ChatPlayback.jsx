import { useEffect, useRef, useState } from 'react';
import { SCENARIOS } from '../components/AgentDemo.jsx';

// The scripted WhatsApp-style demo. Two ways to drive it:
//  - step (0-1): the 3D homepage passes how far you've scrolled through its
//    stop, and the conversation plays one message per bit of scroll.
//  - no step: on ordinary pages it plays by itself once it's on screen.
export default function ChatPlayback({ step, heading = true }) {
  const [active, setActive] = useState(0);
  const [auto, setAuto] = useState(0);         // autoplay position, in messages
  const [run, setRun] = useState(0);
  const listRef = useRef(null);
  const boxRef = useRef(null);
  const chat = SCENARIOS[active].chat;
  const scrollDriven = typeof step === 'number';

  const still = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  useEffect(() => {
    if (scrollDriven || still) return undefined;
    let timers = [];
    const play = () => {
      timers.forEach(clearTimeout);
      timers = [];
      setAuto(0);
      let t = 500;
      chat.forEach((m, i) => {
        t += m.from === 'bot' ? 900 + Math.min(1400, m.text.length * 18) : m.from === 'note' ? 600 : 1000;
        timers.push(setTimeout(() => setAuto(i + 0.99), t - 500));   // typing shows for the last moment
        timers.push(setTimeout(() => setAuto(i + 1), t));
      });
    };
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { play(); io.disconnect(); } }, { threshold: 0.4 });
    if (boxRef.current) io.observe(boxRef.current);
    return () => { io.disconnect(); timers.forEach(clearTimeout); };
  }, [scrollDriven, still, chat, run]);

  const pos = still ? chat.length : scrollDriven ? step * chat.length : auto;
  const shown = Math.max(1, Math.min(chat.length, 1 + Math.floor(pos)));
  const frac = pos - Math.floor(pos);
  const typing = !still && shown < chat.length && chat[shown].from === 'bot' && frac > 0.35;

  useEffect(() => {
    const el = listRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
  }, [shown, typing]);

  const done = shown >= chat.length;

  return (
    <div className="section" ref={boxRef}>
      {heading && (
        <div className="section-head">
          <p className="eyebrow">See it work</p>
          <h2>Your customers message. The agent handles it.</h2>
          <p className="sub">{scrollDriven ? 'Pick a business, then keep scrolling to play the conversation.' : 'Pick a business and watch, any hour of the day.'}</p>
        </div>
      )}
      <div className="demo">
        <div className="demo-tabs" role="tablist" aria-label="Example businesses">
          {SCENARIOS.map((s, i) => (
            <button key={s.id} type="button" role="tab" aria-selected={i === active}
              className={i === active ? 'demo-tab active' : 'demo-tab'} onClick={() => { setActive(i); setRun((n) => n + 1); }}>
              {s.tab}
            </button>
          ))}
        </div>
        <div className="phone">
          <div className="phone-top">
            <span className="phone-avatar">{SCENARIOS[active].name[0]}</span>
            <div>
              <div className="phone-name">{SCENARIOS[active].name}</div>
              <div className="phone-status">{typing ? 'typing…' : 'AI assistant · online 24/7'}</div>
            </div>
          </div>
          <div className="phone-chat" ref={listRef}>
            {chat.slice(0, shown).map((m, i) => (
              <div key={active + '-' + i} className={'bubble bubble-' + m.from}>{m.text}</div>
            ))}
            {typing && <div className="bubble bubble-bot bubble-typing" aria-label="typing"><span /><span /><span /></div>}
          </div>
          <div className="phone-foot">
            <span className="demo-label">Example conversation</span>
            {scrollDriven
              ? <span className="demo-progress">{done ? 'Done ✓' : <>Scroll <span className="demo-arrow">↓</span> {shown}/{chat.length}</>}</span>
              : <button type="button" className="demo-replay" disabled={!done} onClick={() => setRun((n) => n + 1)}>↻ Replay</button>}
          </div>
        </div>
      </div>
    </div>
  );
}
