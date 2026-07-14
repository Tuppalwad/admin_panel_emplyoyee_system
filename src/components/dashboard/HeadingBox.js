import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const HeadingBox = ({
  title,
  count,
  icon = 'fas fa-chart-bar',
  color = 'from-blue-500 to-indigo-600',
  link = ''
}) => {
  const [displayCount, setDisplayCount] = useState(0);

  useEffect(() => {
    let start = 0;

    if (!count) {
      setDisplayCount(0);
      return;
    }

    const increment = Math.ceil(count / 50);

    const timer = setInterval(() => {
      start += increment;

      if (start >= count) {
        setDisplayCount(count);
        clearInterval(timer);
      } else {
        setDisplayCount(start);
      }
    }, 20);

    return () => clearInterval(timer);
  }, [count]);

  return (
    <Link
      to={link}
      className="
        relative overflow-hidden
        bg-white
        rounded-2xl
        shadow-md
        hover:shadow-xl
        border border-gray-100
        p-6
        transition-all duration-300
        hover:-translate-y-1
        cursor-pointer
        w-full 
      "
    >
      {/* Top Gradient Line */}
      <div
        className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${color}`}
      />

      <div className="flex justify-between items-center">
        <div>
          <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">
            {title}
          </p>

          <h2 className="text-4xl font-bold text-gray-800 mt-3">
            {displayCount.toLocaleString()}
          </h2>

          <p className="text-xs text-gray-400 mt-2">
            {/* Updated just now */}
          </p>
        </div>

        <div
          className={`w-16 h-12 rounded-2xl bg-gradient-to-r ${color}
          flex items-center justify-center shadow-lg`}
        >
          <i className={`${icon} text-white text-2xl`} />
        </div>
      </div>
    </Link>
  );
};

export default HeadingBox;