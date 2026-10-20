import { useEffect, useRef, useState } from 'react';
import { SCENARIOS } from '../components/AgentDemo.jsx';

// The scripted WhatsApp-style demo, for the 3D homepage. The main site's
// version is driven by page scroll (it pins in place); inside the flight the
// panel is already fixed on screen, so this one plays on its own timer while
// its stop is in view, and restarts when you switch business.
export default function ChatPlayback({ playing }) {
  const [active, setActive] = useState(0);
  const [shown, setShown] = useState(0);
  const [typing, setTyping] = useState(false);
  const [run, setRun] = useState(0);
  const listRef = useRef(null);
  const chat = SCENARIOS[active].chat;

  useEffect(() => {
    if (!playing) return undefined;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { setShown(chat.length); return undefined; }
    setShown(0);
    setTyping(false);
    const timers = [];
    let t = 400;
    chat.forEach((m, i) => {
      if (m.from === 'bot') {
        timers.push(setTimeout(() => setTyping(true), t));
        t += 700 + Math.min(1400, m.text.length * 18);
      } else {
        t += m.from === 'note' ? 500 : 900;
      }
      timers.push(setTimeout(() => { setTyping(false); setShown(i + 1); }, t));
    });
    return () => timers.forEach(clearTimeout);
  }, [playing, active, run, chat]);

  useEffect(() => {
    const el = listRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
  }, [shown, typing]);

  const done = shown >= chat.length;

  return (
    <div className="section">
      <div className="section-head">
        <p className="eyebrow">See it work</p>
        <h2>Your customers message. The agent handles it.</h2>
        <p className="sub">Pick a business and watch, any hour of the day.</p>
      </div>
      <div className="demo">
        <div className="demo-tabs" role="tablist" aria-label="Example businesses">
          {SCENARIOS.map((s, i) => (
            <button key={s.id} type="button" role="tab" aria-selected={i === active}
              className={i === active ? 'demo-tab active' : 'demo-tab'}
              onClick={() => { setActive(i); setRun((r) => r + 1); }}>
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
              <div key={active + '-' + run + '-' + i} className={'bubble bubble-' + m.from}>{m.text}</div>
            ))}
            {typing && <div className="bubble bubble-bot bubble-typing" aria-label="typing"><span /><span /><span /></div>}
          </div>
          <div className="phone-foot">
            <span className="demo-label">Example conversation</span>
            <button type="button" className="demo-replay" disabled={!done} onClick={() => setRun((r) => r + 1)}>↻ Replay</button>
          </div>
        </div>
      </div>
    </div>
  );
}
