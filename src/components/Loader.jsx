import React, { useEffect, useRef } from 'react';
import './Loader.css';

const Loader = () => {
  const path1Ref = useRef(null);
  const path2Ref = useRef(null);
  const path3Ref = useRef(null);
  const rafRef = useRef(null);
  const t0Ref = useRef(null);

  useEffect(() => {
    const paths = [path1Ref.current, path2Ref.current, path3Ref.current].filter(Boolean);
    if (paths.length !== 3) return;

    const lens = paths.map(p => p.getTotalLength());
    const totalLen = lens.reduce((a, b) => a + b, 0);

    const startOffset = [];
    let acc = 0;
    lens.forEach(l => {
      startOffset.push(acc);
      acc += l;
    });

    paths.forEach((p, i) => {
      p.style.strokeDasharray = lens[i];
      p.style.strokeDashoffset = lens[i];
    });

    const DURATION = 4200; // ms 
    const HOLD = 900;  // ms

    const ease = (t) => 1 - Math.pow(1 - t, 3);

    const frame = (ts) => {
      if (t0Ref.current === null) t0Ref.current = ts;
      const elapsed = ts - t0Ref.current;
      const rawT = Math.min(elapsed / DURATION, 1);
      const t = ease(rawT);
      const drawn = t * totalLen;

      paths.forEach((p, i) => {
        let local = drawn - startOffset[i];
        local = Math.max(0, Math.min(local, lens[i]));
        p.style.strokeDashoffset = lens[i] - local;
      });

      if (rawT < 1) {
        rafRef.current = requestAnimationFrame(frame);
      } else {
        // loop for preview
        setTimeout(() => {
          t0Ref.current = null;
          paths.forEach((p, i) => { p.style.strokeDashoffset = lens[i]; });
          rafRef.current = requestAnimationFrame(frame);
        }, HOLD);
      }
    };

    rafRef.current = requestAnimationFrame(frame);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', backgroundColor: '#ffffff' }}>
      <div className="nl-loader">
        <div className="nl-mark">
          <svg viewBox="0 0 1114 1114" xmlns="http://www.w3.org/2000/svg">
            <path className="nl-ghost" d="M 52,52 L 52,179 L 444,179 L 445,256 L 670,519 L 671,179 L 1061,179 L 1061,52 Z" />
            <path className="nl-ghost" d="M 1061,237 L 774,237 L 773,734 L 348,238 L 53,238 L 53,361 L 117,362 L 118,842 L 54,843 L 54,969 L 340,969 L 341,448 L 791,969 L 1061,969 L 1061,844 L 996,843 L 996,362 L 1061,361 Z" />
            <path className="nl-ghost" d="M 444,675 L 444,1018 L 670,1018 L 670,933 Z" />

            <path ref={path1Ref} className="nl-draw" d="M 52,52 L 52,179 L 444,179 L 445,256 L 670,519 L 671,179 L 1061,179 L 1061,52 Z" />
            <path ref={path2Ref} className="nl-draw" d="M 1061,237 L 774,237 L 773,734 L 348,238 L 53,238 L 53,361 L 117,362 L 118,842 L 54,843 L 54,969 L 340,969 L 341,448 L 791,969 L 1061,969 L 1061,844 L 996,843 L 996,362 L 1061,361 Z" />
            <path ref={path3Ref} className="nl-draw" d="M 444,675 L 444,1018 L 670,1018 L 670,933 Z" />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default Loader;
