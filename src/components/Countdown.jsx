import React, { useState, useEffect } from 'react';

function msToUnits(ms) {
  const total = Math.max(0, Math.floor(ms / 1000));
  return {
    d: Math.floor(total / 86400),
    h: Math.floor((total % 86400) / 3600),
    m: Math.floor((total % 3600) / 60),
    s: total % 60
  };
}

function pad(n) {
  return String(n).padStart(2, '0');
}

export default function Countdown({ endTime }) {
  const [timeLeft, setTimeLeft] = useState(endTime - Date.now());

  useEffect(() => {
    setTimeLeft(endTime - Date.now());
    
    const interval = setInterval(() => {
      const diff = endTime - Date.now();
      setTimeLeft(diff);
      if (diff <= 0) {
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [endTime]);

  if (timeLeft <= 0) {
    return <span className="cd-num" style={{ color: 'var(--green)' }}>LIVE</span>;
  }

  const { d, h, m, s } = msToUnits(timeLeft);

  return (
    <>
      <div className="cd-unit"><span className="cd-num">{pad(d)}</span><span className="cd-lbl">d</span></div>
      <span className="cd-sep">:</span>
      <div className="cd-unit"><span className="cd-num">{pad(h)}</span><span className="cd-lbl">h</span></div>
      <span className="cd-sep">:</span>
      <div className="cd-unit"><span className="cd-num">{pad(m)}</span><span className="cd-lbl">m</span></div>
      <span className="cd-sep">:</span>
      <div className="cd-unit"><span className="cd-num">{pad(s)}</span><span className="cd-lbl">s</span></div>
    </>
  );
}
