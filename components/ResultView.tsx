
import React, { useState } from 'react';
import { GeneratedResult } from '../types';

interface ResultViewProps {
  result: GeneratedResult;
  onRegenerate: () => void;
}

export const ResultView: React.FC<ResultViewProps> = ({ result, onRegenerate }) => {
  const [copied, setCopied] = useState(false);

  const handleCopyCaption = () => {
    const textToCopy = `${result.caption}\n\n${result.hashtags.join(' ')}`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = result.imageUrl;
    link.download = `kit-${result.platform.id}-${result.theme}.png`;
    link.click();
  };

  const isInstagram = result.platform.name.toLowerCase() === 'instagram';

  return (
    <div className={`bg-white rounded-[2.5rem] shadow-xl shadow-indigo-100/20 border border-gray-100 overflow-hidden group hover:shadow-2xl hover:shadow-indigo-200/30 transition-all duration-500 relative ${result.isRegenerating ? 'opacity-70 grayscale-[0.5]' : ''}`}>
      {result.isRegenerating && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-white/40 backdrop-blur-sm">
          <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-indigo-900 font-black uppercase tracking-widest text-sm">Perfecting Visuals...</p>
        </div>
      )}
      
      <div className="flex flex-col xl:flex-row">
        {/* Preview Area */}
        <div className="xl:w-[48%] bg-gray-50/50 flex items-center justify-center p-6 sm:p-10 relative">
          <div 
            className="relative bg-white shadow-2xl rounded-3xl overflow-hidden transition-all duration-700 group-hover:scale-[1.02] ring-1 ring-black/5"
            style={{ 
              aspectRatio: result.platform.aspectRatio.replace(':', '/'), 
              maxHeight: '500px',
              maxWidth: '100%'
            }}
          >
            <img 
              src={result.imageUrl} 
              alt={result.platform.name} 
              className="w-full h-full object-cover"
            />
            
            {/* Overlay Badges */}
            <div className="absolute top-4 left-4 flex flex-wrap gap-1.5 max-w-[90%]">
              <div className="bg-black/80 backdrop-blur-md px-3 py-1.5 rounded-full text-[8px] text-white font-black uppercase tracking-widest border border-white/20">
                {result.platform.dimensions}
              </div>
              <div className={`px-3 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest border ${
                result.theme === 'dark' ? 'bg-indigo-900 text-white border-indigo-700' : 'bg-white text-gray-900 border-gray-200 shadow-sm'
              }`}>
                {result.theme} mode
              </div>
              {isInstagram && (
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 px-3 py-1.5 rounded-full text-[8px] text-white font-black uppercase tracking-widest border border-white/20 shadow-lg">
                  Policy Approved
                </div>
              )}
            </div>
          </div>
          
          {/* Subtle Decorative Elements */}
          <div className="absolute top-0 left-0 w-32 h-32 bg-indigo-50 rounded-full -translate-x-16 -translate-y-16 blur-3xl opacity-50"></div>
          <div className="absolute bottom-0 right-0 w-32 h-32 bg-purple-50 rounded-full translate-x-16 translate-y-16 blur-3xl opacity-50"></div>
        </div>

        {/* Content Area */}
        <div className="xl:w-[52%] p-8 sm:p-10 flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gray-900 rounded-2xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-500">
                <i className={`${result.platform.icon} text-lg`}></i>
              </div>
              <div>
                <h4 className="text-xl font-black text-gray-900 tracking-tight leading-none mb-1">{result.platform.name}</h4>
                <div className="flex items-center gap-2">
                  <span className="text-[9px] font-black text-indigo-600 uppercase tracking-widest">{result.platform.type}</span>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={onRegenerate}
                disabled={result.isRegenerating}
                className="w-10 h-10 flex items-center justify-center rounded-xl bg-gray-50 text-gray-400 hover:bg-indigo-600 hover:text-white transition-all shadow-sm active:scale-90"
                title="Regenerate Design"
              >
                <i className={`fa-solid fa-arrows-rotate ${result.isRegenerating ? 'fa-spin' : ''} text-sm`}></i>
              </button>
              <button 
                onClick={handleDownload}
                className="w-10 h-10 flex items-center justify-center rounded-xl bg-gray-50 text-gray-400 hover:bg-black hover:text-white transition-all shadow-sm active:scale-90"
                title="Download Design"
              >
                <i className="fa-solid fa-download text-sm"></i>
              </button>
            </div>
          </div>

          <div className="space-y-6 flex-grow">
            {/* AI Reasoning Section */}
            <div className="relative pl-4 border-l-2 border-indigo-50">
              <h5 className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2">Strategy Alignment</h5>
              <p className="text-xs text-gray-600 leading-relaxed font-medium">
                {result.creativeReasoning}
              </p>
            </div>

            {/* Caption Section */}
            <div className="bg-gray-50/80 rounded-3xl p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-3">
                <h5 className="text-[9px] font-black text-indigo-400 uppercase tracking-widest">Post Caption</h5>
                <button 
                  onClick={handleCopyCaption}
                  className={`text-[8px] font-black px-3 py-1 rounded-full transition-all border ${
                    copied ? 'bg-green-500 text-white border-green-500' : 'bg-white text-gray-600 border-gray-200 hover:border-indigo-600 hover:text-indigo-600 shadow-sm'
                  }`}
                >
                  {copied ? 'COPIED' : 'COPY'}
                </button>
              </div>
              
              <p className="text-gray-900 leading-relaxed font-bold text-sm mb-4 line-clamp-4">
                {result.caption}
              </p>
              
              <div className="flex flex-wrap gap-1.5">
                {result.hashtags.map((tag, i) => (
                  <span key={i} className="text-[10px] font-black text-indigo-600/70 bg-white px-2.5 py-1 rounded-lg border border-indigo-50 shadow-sm">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-50 flex items-center justify-between">
             <div className="flex items-center gap-2">
               <div className="flex -space-x-2">
                 {[1,2].map(i => (
                   <div key={i} className="w-6 h-6 rounded-full border-2 border-white bg-gray-200 overflow-hidden shadow-sm">
                     <img src={`https://i.pravatar.cc/100?u=${result.id}${i}`} alt="curator" />
                   </div>
                 ))}
               </div>
               <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">AI Verified</span>
             </div>
             <button 
                onClick={handleDownload}
                className="bg-black text-white px-6 py-3 rounded-xl text-[10px] font-black hover:bg-indigo-600 transition-all shadow-xl active:scale-95 flex items-center gap-2 uppercase tracking-widest"
              >
                Download Kit
              </button>
          </div>
        </div>
      </div>
    </div>
  );
};
