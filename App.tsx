
import React, { useState, useEffect } from 'react';
import { SocialPlatform, GeneratedResult, GenerationStatus, DesignTheme } from './types';
import { SOCIAL_PLATFORMS } from './constants';
import { Header, View } from './components/Header';
import { ImageUploader } from './components/ImageUploader';
import { PlatformGrid } from './components/PlatformGrid';
import { ResultView } from './components/ResultView';
import { HowItWorks } from './components/HowItWorks';
import { Templates } from './components/Templates';
import { adaptImageForPlatform, brainstormAndGenerateContent } from './services/geminiService';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<View>('home');
  const [sourceImage, setSourceImage] = useState<string | null>(null);
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [results, setResults] = useState<GeneratedResult[]>([]);
  const [userBrief, setUserBrief] = useState("");
  const [designTheme, setDesignTheme] = useState<DesignTheme>("original");
  const [status, setStatus] = useState<GenerationStatus>({
    loading: false,
    error: null,
    progress: 0,
  });

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeView]);

  const handleImageUpload = (image: string) => {
    setSourceImage(image);
    setResults([]);
    setSelectedPlatforms([]);
    setActiveView('home');
  };

  const togglePlatform = (id: string) => {
    setSelectedPlatforms(prev => 
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  };

  const handleGenerate = async () => {
    if (!sourceImage || selectedPlatforms.length === 0) return;

    setStatus({ loading: true, error: null, progress: 0 });
    
    // We'll process each platform sequentially to update the UI as each one completes
    try {
      for (let i = 0; i < selectedPlatforms.length; i++) {
        const platformId = selectedPlatforms[i];
        const platform = SOCIAL_PLATFORMS.find(p => p.id === platformId)!;
        
        // Phase 1: Brainstorming
        const brainstorm = await brainstormAndGenerateContent(
          sourceImage, 
          platform.name, 
          platform.type,
          userBrief,
          designTheme
        );

        // Phase 2: Generating visual
        const imageUrl = await adaptImageForPlatform(
          sourceImage, 
          platform.name, 
          platform.type, 
          platform.aspectRatio,
          brainstorm.creativeReasoning,
          designTheme,
          userBrief
        );

        const newResult: GeneratedResult = {
          id: `${platformId}-${Date.now()}`,
          platform,
          imageUrl,
          caption: brainstorm.caption,
          hashtags: brainstorm.hashtags,
          creativeReasoning: brainstorm.creativeReasoning,
          theme: designTheme,
          timestamp: Date.now()
        };

        // Prepend result to list
        setResults(prev => [newResult, ...prev]);

        // Update progress
        setStatus(prev => ({ 
          ...prev, 
          progress: Math.round(((i + 1) / selectedPlatforms.length) * 100) 
        }));
      }

      setStatus(prev => ({ ...prev, loading: false }));
    } catch (error: any) {
      console.error("Batch generation failed", error);
      setStatus({ 
        loading: false, 
        error: error.message || "An error occurred during generation.", 
        progress: 0 
      });
    }
  };

  const handleRegenerate = async (resultId: string) => {
    if (!sourceImage) return;
    setResults(prev => prev.map(r => r.id === resultId ? { ...r, isRegenerating: true } : r));

    try {
      const existingResult = results.find(r => r.id === resultId);
      if (!existingResult) return;
      const platform = existingResult.platform;

      const brainstorm = await brainstormAndGenerateContent(
        sourceImage, 
        platform.name, 
        platform.type,
        userBrief,
        designTheme
      );

      const imageUrl = await adaptImageForPlatform(
        sourceImage, 
        platform.name, 
        platform.type, 
        platform.aspectRatio,
        brainstorm.creativeReasoning,
        designTheme,
        userBrief
      );

      setResults(prev => prev.map(r => r.id === resultId ? {
        ...existingResult,
        imageUrl,
        caption: brainstorm.caption,
        hashtags: brainstorm.hashtags,
        creativeReasoning: brainstorm.creativeReasoning,
        theme: designTheme,
        timestamp: Date.now(),
        isRegenerating: false
      } : r));
    } catch (error: any) {
      console.error("Regeneration failed", error);
      setResults(prev => prev.map(r => r.id === resultId ? { ...r, isRegenerating: false } : r));
      alert("Failed to regenerate post. Please try again.");
    }
  };

  const resetApp = () => {
    setSourceImage(null);
    setSelectedPlatforms([]);
    setResults([]);
    setUserBrief("");
    setDesignTheme("original");
    setStatus({ loading: false, error: null, progress: 0 });
    setActiveView('home');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F9FAFB] selection:bg-indigo-600 selection:text-white">
      <Header 
        activeView={activeView} 
        onViewChange={setActiveView} 
        onReset={resetApp} 
      />
      
      <main className="flex-grow container mx-auto px-4 py-8 max-w-7xl">
        {activeView === 'how-it-works' ? (
          <HowItWorks onGetStarted={() => setActiveView('home')} />
        ) : activeView === 'templates' ? (
          <Templates onSelectTemplate={handleImageUpload} />
        ) : (
          <>
            {!sourceImage ? (
              <div className="flex flex-col items-center justify-center py-20 px-4 animate-in fade-in zoom-in duration-1000">
                <div className="text-center mb-16">
                  <div className="inline-block px-4 py-1.5 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-black uppercase tracking-[0.3em] mb-8 shadow-sm">
                    AI Content Orchestrator
                  </div>
                  <h1 className="text-6xl md:text-8xl font-black text-gray-900 mb-8 tracking-tighter leading-none">
                    Resize with <br />
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600">Pure Intelligence.</span>
                  </h1>
                  <p className="text-xl md:text-2xl text-gray-500 max-w-3xl mx-auto font-medium leading-relaxed">
                    Transform one design into a full platform-native kit. Powered by Gemini 2.5 Flash for visuals and Gemini 3 for strategy.
                  </p>
                </div>
                <ImageUploader onUpload={handleImageUpload} />
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start pb-32 animate-in slide-in-from-bottom-8 duration-700">
                {/* Sidebar Controls */}
                <div className="lg:col-span-4 space-y-8 sticky top-24">
                  <div className="bg-white p-8 rounded-[3rem] shadow-xl border border-gray-100">
                    <h3 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-3">
                      <div className="w-1.5 h-6 bg-indigo-600 rounded-full"></div>
                      Creative Strategy
                    </h3>
                    
                    <div className="space-y-6">
                      <div>
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3 block">Color Aesthetic</label>
                        <div className="grid grid-cols-3 gap-3 bg-gray-50 p-2 rounded-3xl border border-gray-100">
                          {[
                            { id: 'original', icon: 'fa-palette', label: 'Original' },
                            { id: 'light', icon: 'fa-sun', label: 'Light' },
                            { id: 'dark', icon: 'fa-moon', label: 'Dark' }
                          ].map((t) => (
                            <button
                              key={t.id}
                              onClick={() => setDesignTheme(t.id as DesignTheme)}
                              className={`flex flex-col items-center justify-center gap-1 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
                                designTheme === t.id 
                                  ? 'bg-white text-indigo-600 shadow-xl ring-1 ring-black/5 scale-105' 
                                  : 'text-gray-400 hover:text-gray-600'
                              }`}
                            >
                              <i className={`fa-solid ${t.icon} text-lg mb-1`}></i>
                              {t.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3 block">Custom Brief</label>
                        <textarea 
                          placeholder="e.g. Focus on the main character, add urban vibe, emphasize luxury..."
                          className="w-full bg-gray-50 border border-gray-100 rounded-[2rem] p-6 text-sm font-medium focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all min-h-[140px] resize-none leading-relaxed"
                          value={userBrief}
                          onChange={(e) => setUserBrief(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-8 rounded-[3rem] shadow-xl border border-gray-100">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-black text-gray-900 flex items-center gap-3">
                        <div className="w-1.5 h-6 bg-indigo-600 rounded-full"></div>
                        Select Platforms
                      </h3>
                      <button 
                        onClick={() => setSelectedPlatforms(SOCIAL_PLATFORMS.map(p => p.id))}
                        className="text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:underline"
                      >
                        All
                      </button>
                    </div>
                    
                    <PlatformGrid 
                      platforms={SOCIAL_PLATFORMS} 
                      selectedIds={selectedPlatforms} 
                      onToggle={togglePlatform} 
                    />
                    
                    <button
                      disabled={selectedPlatforms.length === 0 || status.loading}
                      onClick={handleGenerate}
                      className={`w-full mt-8 py-6 rounded-[2rem] font-black text-white transition-all shadow-2xl flex flex-col items-center justify-center gap-1 active:scale-95 text-xs uppercase tracking-widest ${
                        selectedPlatforms.length === 0 || status.loading
                          ? 'bg-gray-200 cursor-not-allowed text-gray-400 shadow-none'
                          : 'bg-black hover:bg-indigo-600'
                      }`}
                    >
                      {status.loading ? (
                        <>
                          <div className="flex items-center gap-2 mb-1">
                            <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            Processing {status.progress}%
                          </div>
                          <div className="w-full max-w-[120px] h-1 bg-white/20 rounded-full overflow-hidden">
                             <div className="h-full bg-white transition-all duration-300" style={{ width: `${status.progress}%` }}></div>
                          </div>
                        </>
                      ) : (
                        <>
                          <i className="fa-solid fa-wand-magic-sparkles mb-1 text-lg"></i>
                          Reimagine Designs
                        </>
                      )}
                    </button>
                    {status.error && (
                      <p className="mt-4 text-center text-xs text-red-500 font-bold uppercase tracking-tight">{status.error}</p>
                    )}
                  </div>

                  <div className="bg-white p-5 rounded-[2.5rem] border border-gray-100 shadow-sm flex items-center gap-4 group">
                    <div className="relative w-16 h-16 rounded-xl overflow-hidden shadow-md">
                       <img src={sourceImage} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-grow">
                      <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Creative DNA</p>
                      <button onClick={() => setSourceImage(null)} className="text-[10px] font-black text-indigo-600 hover:text-indigo-800">
                        Replace Source
                      </button>
                    </div>
                  </div>
                </div>

                {/* Results Display */}
                <div className="lg:col-span-8 space-y-10">
                  {results.length > 0 ? (
                    <div className="space-y-12">
                      <div className="flex items-center justify-between bg-white px-10 py-6 rounded-[3rem] border border-gray-100 shadow-sm">
                        <div className="flex items-center gap-4">
                           <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600">
                              <i className="fa-solid fa-layer-group"></i>
                           </div>
                           <div>
                              <h2 className="text-xl font-black text-gray-900">Your Brand Kit</h2>
                              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Optimized for Conversion</p>
                           </div>
                        </div>
                        <div className="hidden sm:flex items-center gap-2">
                          <span className="px-4 py-2 bg-black text-white text-[10px] font-black rounded-full uppercase tracking-widest">
                            {results.length} Assets
                          </span>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 gap-12">
                        {results.map((result) => (
                          <ResultView 
                            key={result.id} 
                            result={result} 
                            onRegenerate={() => handleRegenerate(result.id)}
                          />
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="bg-white rounded-[4rem] border-2 border-dashed border-gray-100 h-[600px] flex flex-col items-center justify-center text-gray-400 p-12 text-center shadow-inner relative overflow-hidden">
                      <div className="relative z-10 animate-pulse">
                        <div className="w-32 h-32 bg-indigo-50/50 rounded-full flex items-center justify-center mb-8 text-indigo-200 mx-auto">
                          <i className="fa-solid fa-sparkles text-5xl"></i>
                        </div>
                        <h3 className="text-3xl font-black text-gray-800 mb-4 tracking-tight">Ready for Generation</h3>
                        <p className="max-w-xs mx-auto text-gray-400 text-sm leading-relaxed font-medium">
                          Select your target platforms and creative direction on the left to start the AI rendering process.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </main>

      <footer className="bg-white border-t border-gray-100 py-16 mt-20">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-900 text-[10px] font-black uppercase tracking-[0.3em] mb-4">Social Media AI Resizer</p>
          <p className="text-gray-400 text-[10px] max-w-sm mx-auto leading-relaxed font-medium">
            Next-gen creative toolkit utilizing Gemini 2.5 Flash and Gemini 3 Pro for platform-native content generation and strategy automation.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;
