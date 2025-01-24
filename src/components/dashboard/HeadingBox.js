import React, { useEffect, useState } from 'react';
import './HeadingBox.css'; // Optional for additional styles

const HeadingBox = ({ title, count }) => {
  const [displayCount, setDisplayCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 1000; // Animation duration in ms
    const stepTime = Math.abs(Math.floor(duration / count));
    const timer = setInterval(() => {
      start += 1;
      if (start > count) {
        clearInterval(timer);
        setDisplayCount(count);
      } else {
        setDisplayCount(start);
      }
    }, stepTime);
    return () => clearInterval(timer);
  }, [count]);

  return (
    <div className="w-full md:w-1/4 bg-white shadow-lg rounded-lg p-8 m-3 text-center">
      <h1 className="text-xl font-bold text-gray-700">{title}</h1>
      <p className="text-4xl font-extrabold text-indigo-600">{displayCount}</p>
    </div>
  );
};

export default HeadingBox;
