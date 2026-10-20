import { useEffect, useRef, useState } from 'react';
import { SCENARIOS } from '../components/AgentDemo.jsx';

// The scripted WhatsApp-style demo for the 3D homepage. While its stop is on
// screen the flight pauses and your scrolling plays the conversation instead,
// one message per step, with the agent typing in between.
export default function ChatPlayback({ step }) {
  const [active, setActive] = useState(0);
  const listRef = useRef(null);
  const chat = SCENARIOS[active].chat;

  const still = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const pos = still ? chat.length : step * chat.length;
  const shown = Math.max(1, Math.min(chat.length, 1 + Math.floor(pos)));
  const frac = pos - Math.floor(pos);
  const typing = !still && shown < chat.length && chat[shown].from === 'bot' && frac > 0.35;

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
        <p className="sub">Pick a business, then keep scrolling to play the conversation.</p>
      </div>
      <div className="demo">
        <div className="demo-tabs" role="tablist" aria-label="Example businesses">
          {SCENARIOS.map((s, i) => (
            <button key={s.id} type="button" role="tab" aria-selected={i === active}
              className={i === active ? 'demo-tab active' : 'demo-tab'} onClick={() => setActive(i)}>
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
            <span className="demo-progress">{done ? 'Done ✓' : <>Scroll <span className="demo-arrow">↓</span> {shown}/{chat.length}</>}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
