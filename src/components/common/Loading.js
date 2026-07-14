import React from 'react';
import { useSelector } from 'react-redux';

const Loading = () => {
  const { isLoading } = useSelector((state) => state.loading);

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-[9999]">
      <div className="absolute inset-0 bg-black/5 backdrop-blur-[2px]" />

      <div className="relative">
        <div className="w-14 h-14 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin" />
      </div>
    </div>
  );
};

export default Loading;