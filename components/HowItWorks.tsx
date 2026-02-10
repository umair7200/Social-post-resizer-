
import React from 'react';

interface HowItWorksProps {
  onGetStarted: () => void;
}

export const HowItWorks: React.FC<HowItWorksProps> = ({ onGetStarted }) => {
  const steps = [
    {
      icon: 'fa-upload',
      title: '1. Seed Input',
      description: 'Upload any image or design. Our AI extracts the visual essence, lighting, and core subjects to use as a creative foundation.',
      color: 'bg-indigo-50 text-indigo-600'
    },
    {
      icon: 'fa-brain-circuit',
      title: '2. Platform Intelligence',
      description: 'Gemini 3 Pro analyzes platform-specific trends and policies to brainstorm a layout that feels native to the target social feed.',
      color: 'bg-purple-50 text-purple-600'
    },
    {
      icon: 'fa-wand-magic-sparkles',
      title: '3. Generative Creation',
      description: 'Gemini 2.5 Flash Image recreates the design from scratch—not just resizing, but re-rendering elements for the new ratio.',
      color: 'bg-pink-50 text-pink-600'
    },
    {
      icon: 'fa-cloud-arrow-down',
      title: '4. Professional Output',
      description: 'Get a full social media kit including optimized high-res images, engaging captions, and researched hashtags.',
      color: 'bg-emerald-50 text-emerald-600'
    }
  ];

  return (
    <div className="max-w-6xl mx-auto py-16 px-4 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="text-center mb-20">
        <h2 className="text-5xl font-black text-gray-900 mb-6 tracking-tight leading-none">
          Precision <span className="text-indigo-600">Reimagining</span>
        </h2>
        <p className="text-xl text-gray-500 max-w-3xl mx-auto font-medium leading-relaxed">
          Our technology goes beyond simple cropping. We use generative AI to re-render your designs, ensuring every pixel is perfectly placed for its destination.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-24">
        {steps.map((step, i) => (
          <div key={i} className="flex gap-8 p-10 bg-white rounded-[3rem] border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <div className={`flex-shrink-0 w-20 h-20 rounded-3xl flex items-center justify-center ${step.color} text-2xl shadow-inner`}>
              <i className={`fa-solid ${step.icon}`}></i>
            </div>
            <div>
              <h3 className="text-2xl font-black text-gray-900 mb-4">{step.title}</h3>
              <p className="text-gray-500 font-medium leading-relaxed">{step.description}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-gray-900 rounded-[4rem] p-16 text-center text-white relative overflow-hidden shadow-2xl">
        <div className="relative z-10 max-w-2xl mx-auto">
          <h3 className="text-4xl font-black mb-8 leading-tight">Ready to transform your brand content?</h3>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button 
              onClick={onGetStarted}
              className="w-full sm:w-auto bg-indigo-600 text-white px-12 py-5 rounded-[2rem] font-black text-sm uppercase tracking-widest hover:bg-indigo-500 transition-all shadow-xl active:scale-95"
            >
              Get Started Now
            </button>
            <p className="text-gray-400 font-bold uppercase tracking-[0.2em] text-[10px] hidden sm:block">No Credit Card Required</p>
          </div>
        </div>
        
        {/* Abstract shapes */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-[100px] -translate-x-1/4 -translate-y-1/2"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/10 rounded-full blur-[100px] translate-x-1/4 translate-y-1/2"></div>
      </div>
    </div>
  );
};
