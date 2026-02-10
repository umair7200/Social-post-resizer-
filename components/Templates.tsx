
import React, { useState } from 'react';

interface TemplatesProps {
  onSelectTemplate: (base64: string) => void;
}

export const Templates: React.FC<TemplatesProps> = ({ onSelectTemplate }) => {
  const [loadingSeed, setLoadingSeed] = useState<string | null>(null);

  const categories = [
    { name: 'Ecommerce', seed: 'store', tag: 'Sales Focus' },
    { name: 'Lifestyle', seed: 'fashion', tag: 'Aesthetic' },
    { name: 'Corporate', seed: 'business', tag: 'Pro' },
    { name: 'Creative', seed: 'art', tag: 'Bold' },
    { name: 'Tech', seed: 'tech', tag: 'Modern' },
    { name: 'Food', seed: 'food', tag: 'Delicious' }
  ];

  const handleTemplateClick = async (seed: string) => {
    setLoadingSeed(seed);
    try {
      const response = await fetch(`https://picsum.photos/seed/${seed}/1200/800`);
      const blob = await response.blob();
      const reader = new FileReader();
      reader.onloadend = () => {
        onSelectTemplate(reader.result as string);
        setLoadingSeed(null);
      };
      reader.readAsDataURL(blob);
    } catch (err) {
      console.error("Failed to load template", err);
      setLoadingSeed(null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-16 px-4 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="text-center mb-16">
        <h2 className="text-5xl font-black text-gray-900 mb-6 tracking-tight">Inspiration <span className="text-indigo-600">Library</span></h2>
        <p className="text-xl text-gray-500 max-w-2xl mx-auto font-medium leading-relaxed">
          Can't decide where to start? Choose a baseline template and our AI will reimagine it for every platform.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
        {categories.map((cat, i) => (
          <div 
            key={i} 
            className="group cursor-pointer bg-white rounded-[3rem] overflow-hidden border border-gray-100 shadow-sm hover:shadow-2xl transition-all duration-500 flex flex-col h-full relative"
            onClick={() => !loadingSeed && handleTemplateClick(cat.seed)}
          >
            {loadingSeed === cat.seed && (
              <div className="absolute inset-0 z-20 bg-white/60 backdrop-blur-md flex flex-col items-center justify-center">
                <i className="fa-solid fa-spinner fa-spin text-indigo-600 text-3xl mb-4"></i>
                <span className="font-black text-[10px] uppercase tracking-widest text-indigo-900">Fetching Template...</span>
              </div>
            )}
            
            <div className="h-72 overflow-hidden relative">
              <img 
                src={`https://picsum.photos/seed/${cat.seed}/800/600`} 
                alt={cat.name} 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
              />
              <div className="absolute top-6 right-6">
                <span className="px-4 py-2 bg-white/90 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl border border-white/20">
                  {cat.tag}
                </span>
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-8">
                 <button className="bg-white text-black w-full py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-2xl translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                    Use this Base
                 </button>
              </div>
            </div>
            <div className="p-8 flex items-center justify-between mt-auto">
              <div>
                <h3 className="text-2xl font-black text-gray-900 mb-1">{cat.name}</h3>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Master Baseline</p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-indigo-600 group-hover:text-white group-hover:rotate-45 transition-all duration-500">
                <i className="fa-solid fa-plus"></i>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-24 text-center">
        <div className="inline-block p-12 bg-white rounded-[4rem] border border-gray-100 shadow-sm relative overflow-hidden group">
          <p className="text-gray-400 font-black mb-6 uppercase tracking-widest text-xs relative z-10">Unexpected Inspiration</p>
          <button 
            disabled={!!loadingSeed}
            onClick={() => handleTemplateClick('random' + Date.now())}
            className="relative z-10 inline-flex items-center gap-4 px-12 py-5 bg-gray-900 text-white rounded-[2rem] font-black text-sm uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-xl active:scale-95"
          >
            {loadingSeed && loadingSeed.startsWith('random') ? <i className="fa-solid fa-spinner fa-spin"></i> : <i className="fa-solid fa-shuffle"></i>}
            Surprise Me
          </button>
          
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full translate-x-16 -translate-y-16 blur-2xl group-hover:bg-indigo-100 transition-colors"></div>
        </div>
      </div>
    </div>
  );
};
