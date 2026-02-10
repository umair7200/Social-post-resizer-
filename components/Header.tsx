
import React from 'react';

export type View = 'home' | 'how-it-works' | 'templates';

interface HeaderProps {
  activeView: View;
  onViewChange: (view: View) => void;
  onReset: () => void;
}

export const Header: React.FC<HeaderProps> = ({ activeView, onViewChange, onReset }) => {
  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 py-4">
      <div className="container mx-auto px-4 flex items-center justify-between">
        <div 
          className="flex items-center gap-2 cursor-pointer group" 
          onClick={() => {
            onReset();
            onViewChange('home');
          }}
        >
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center group-hover:rotate-6 transition-transform">
            <i className="fa-solid fa-crop-simple text-white text-xl"></i>
          </div>
          <div>
            <span className="text-xl font-extrabold text-gray-900 tracking-tight">Social<span className="text-indigo-600">Resizer</span></span>
          </div>
        </div>
        
        <div className="hidden md:flex items-center gap-8">
          <button 
            onClick={() => onViewChange('how-it-works')}
            className={`text-sm font-bold transition-colors ${activeView === 'how-it-works' ? 'text-indigo-600' : 'text-gray-500 hover:text-indigo-400'}`}
          >
            How it works
          </button>
          <button 
            onClick={() => onViewChange('templates')}
            className={`text-sm font-bold transition-colors ${activeView === 'templates' ? 'text-indigo-600' : 'text-gray-500 hover:text-indigo-400'}`}
          >
            Templates
          </button>
          <button 
            onClick={() => {
              onReset();
              onViewChange('home');
            }}
            className="text-sm font-black px-5 py-2.5 rounded-xl bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white transition-all active:scale-95 shadow-sm"
          >
            Start Fresh
          </button>
        </div>

        {/* Mobile Menu Icon (Visual Only) */}
        <div className="md:hidden text-gray-400">
          <i className="fa-solid fa-bars-staggered text-xl"></i>
        </div>
      </div>
    </header>
  );
};
