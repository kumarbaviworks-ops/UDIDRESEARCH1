
import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="text-center my-8 md:my-12">
      <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">
        UDIDRESEARCH
      </h1>
      <p className="mt-4 text-lg text-slate-400">
        Your AI-powered research assistant. Ask anything.
      </p>
    </header>
  );
};
