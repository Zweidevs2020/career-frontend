import React, { useState, useEffect } from "react";

export function AnalogClock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const seconds = time.getSeconds();
  const minutes = time.getMinutes();
  const hours = time.getHours() % 12;

  const secondDegrees = (seconds / 60) * 360;
  const minuteDegrees = ((minutes + seconds / 60) / 60) * 360;
  const hourDegrees = ((hours + minutes / 60) / 12) * 360;

  return (
    <div className="w-24 h-24 relative">
      <svg className="w-full h-full" viewBox="0 0 100 100">
        {/* Clock face */}
        <circle
          cx="50"
          cy="50"
          r="48"
          fill="white"
          stroke="currentColor"
          strokeWidth="2"
        />

        {/* Hour markers */}
        {[...Array(12)].map((_, i) => (
          <line
            key={i}
            x1="50"
            y1="10"
            x2="50"
            y2="15"
            transform={`rotate(${i * 30} 50 50)`}
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        ))}

        {/* Hour hand */}
        <line
          x1="50"
          y1="50"
          x2="50"
          y2="24"
          transform={`rotate(${hourDegrees} 50 50)`}
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
        />

        {/* Minute hand */}
        <line
          x1="50"
          y1="50"
          x2="50"
          y2="16"
          transform={`rotate(${minuteDegrees} 50 50)`}
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />

        {/* Second hand */}
        <line
          x1="50"
          y1="50"
          x2="50"
          y2="14"
          transform={`rotate(${secondDegrees} 50 50)`}
          stroke="red"
          strokeWidth="1"
          strokeLinecap="round"
        />

        {/* Center dot */}
        <circle cx="50" cy="50" r="2" fill="red" />
      </svg>
    </div>
  );
}
