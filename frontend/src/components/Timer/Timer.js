import React, { useState, useEffect, useRef } from 'react';
export default function Timer({ totalSeconds, onEnd }) {
  const [seconds, setSeconds] = useState(totalSeconds);
  const interval = useRef();

  useEffect(()=>{
    interval.current = setInterval(()=>{
      setSeconds(s => s-1);
    }, 1000);
    return ()=>clearInterval(interval.current);
  },[]);

  useEffect(()=>{
    if (seconds <= 0) {
      clearInterval(interval.current);
      onEnd && onEnd();
    }
  },[seconds, onEnd]);

  const mins = Math.max(0, Math.floor(seconds/60));
  const secs = Math.max(0, (seconds)%60);

  return (
    <div className="font-bold text-lg px-4 py-2 bg-indigo-50 rounded shadow inline-block min-w-[4.5rem] text-center">
      {mins.toString().padStart(2,'0')}:{secs.toString().padStart(2,'0')}
    </div>
  );
}
