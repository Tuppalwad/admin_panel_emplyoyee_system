import React from "react";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-900">
      <h1 className="text-9xl text-white">404</h1>
      <h2 className="mb-4 text-2xl text-white">Page Not Found</h2>
      <img
        width={250}
        src="https://media.giphy.com/media/26gslbIw8P9j3VbFu/giphy.gif"
        alt="404"
        className="mb-3"
      />
    </div>
  );
}
