import React from "react";
import { motion } from "motion/react";
import { Sparkles, ArrowDown, Flame, Compass, ChevronRight } from "lucide-react";

interface HeroProps {
  onExploreClick: () => void;
  onCategorySelect: (cat: string) => void;
  categories: string[];
}

export default function Hero({ onExploreClick, onCategorySelect, categories }: HeroProps) {
  // Preselected category cover images to make the bubble selection highly visual and elegant (using high-quality fashion imagery)
  const categoryCovers: Record<string, string> = {
    "T-Shirts": "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=150&auto=format&fit=crop&q=80",
    "Oversized T-Shirts": "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=150&auto=format&fit=crop&q=80",
    "Check Shirts": "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=150&auto=format&fit=crop&q=80",
    "Cargo Pants": "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=150&auto=format&fit=crop&q=80",
    "Baggy Jeans": "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=150&auto=format&fit=crop&q=80",
    "Sneakers": "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=150&auto=format&fit=crop&q=80",
    "Hoodies": "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=150&auto=format&fit=crop&q=80",
    "Watches": "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=150&auto=format&fit=crop&q=80",
    "Streetwear": "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=150&auto=format&fit=crop&q=80",
    "Jackets": "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=150&auto=format&fit=crop&q=80"
  };

  return (
    <div className="relative bg-black text-white min-h-[90vh] flex flex-col justify-between overflow-hidden">
      
      {/* Visual Background Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-red-900/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[300px] h-[300px] bg-amber-950/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Main Grid Hero Block */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-16 lg:py-24 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10 my-auto">
        
        {/* Left Side: Editorial Typography & Copy */}
        <div className="space-y-8 lg:col-span-7 flex flex-col text-left">
          
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-3 py-1 bg-zinc-900/85 border border-zinc-805 rounded-full text-xxs font-bold uppercase tracking-widest text-red-500 w-fit cursor-default"
          >
            <Flame size={12} className="animate-pulse" />
            <span>Volume IV // Summer Drop</span>
          </motion.div>

          <div className="space-y-4">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="text-5xl sm:text-7xl font-sans font-black tracking-tight leading-[0.95]"
            >
              Discover <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-650 via-red-500 to-amber-500 drop-shadow-sm">
                Latest Fashion
              </span>{" "}
              <br />
              Trends
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-zinc-400 text-sm sm:text-base font-medium max-w-xl font-sans leading-relaxed tracking-wide"
            >
              Explore weekly trending streetwear, oversized statement pieces, and premium designer collections curated by global stylists. INSTANT SYNC.
            </motion.p>
          </div>

          {/* Call to Actions */}
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex flex-wrap items-center gap-4"
          >
            <button
              onClick={onExploreClick}
              className="flex items-center gap-2 bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 text-white font-bold text-xs uppercase tracking-widest px-8 py-4 rounded-full transition-all duration-300 shadow-[0_4px_20px_rgba(220,38,38,0.35)] hover:scale-[1.03] active:scale-[0.98] cursor-pointer"
            >
              <Compass size={14} /> Explore Collections
            </button>
            <button
              onClick={() => onCategorySelect("Sneakers")}
              className="flex items-center gap-1.5 bg-zinc-950 hover:bg-zinc-900 text-white font-semibold text-xs uppercase tracking-widest px-7 py-3.5 rounded-full border border-zinc-800 hover:border-zinc-700 transition duration-300 cursor-pointer"
            >
              Exclusive Drops <ChevronRight size={14} />
            </button>
          </motion.div>

          {/* Social Proof/Subtle Stat Indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.45, duration: 1 }}
            className="pt-6 grid grid-cols-3 gap-6 max-w-md border-t border-zinc-900/60"
          >
            <div>
              <p className="text-2xl font-black font-mono text-zinc-100">10K+</p>
              <p className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">Weekly Views</p>
            </div>
            <div>
              <p className="text-2xl font-black font-mono text-zinc-100">250+</p>
              <p className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">Latest Cuts</p>
            </div>
            <div>
              <p className="text-2xl font-black font-mono text-zinc-100">100%</p>
              <p className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">Premium Curation</p>
            </div>
          </motion.div>

        </div>

        {/* Right Side: High-Fashion Luxury Model Banner Display */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
          className="lg:col-span-5 relative w-full h-[380px] sm:h-[460px] lg:h-[500px]"
        >
          {/* Main Visual Image - Wrapped in beautiful geometric borders */}
          <div className="absolute inset-0 bg-zinc-900 rounded-3xl overflow-hidden border border-zinc-800/80 group">
            <img
              src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=900&auto=format&fit=crop&q=80"
              alt="Dripverse Streetwear model shoot"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover grayscale brightness-90 hover:grayscale-0 transition-all duration-1000 ease-in-out md:scale-105 group-hover:scale-110"
            />
            {/* Dark gradient mapping overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-transparent pointer-events-none" />
            
            {/* Visual Glassmorphism highlight tag */}
            <div className="absolute bottom-6 left-6 right-6 p-4 bg-black/60 backdrop-blur-md rounded-2xl border border-zinc-800/50 flex items-center justify-between text-left">
              <div>
                <span className="text-[9px] uppercase tracking-widest font-black text-red-500">TRENDING HIGHLIGHT</span>
                <p className="text-sm font-bold text-white tracking-tight">OVAL ACID HOODIE V2</p>
                <p className="text-[10px] text-zinc-400 font-mono">MODEL HEIGHT // 186cm</p>
              </div>
              <span className="bg-red-650 text-white px-2.5 py-1 text-[9px] font-black uppercase tracking-wider rounded">
                NEW RELEASE
              </span>
            </div>
          </div>

          {/* Ambient Accent Badges */}
          <div className="absolute -top-4 -right-4 w-28 h-28 bg-gradient-to-tr from-red-650 to-amber-500 rounded-full blur-2xl opacity-40 animate-pulse pointer-events-none" />
          <div className="absolute -bottom-3 -left-3 px-4 py-2 bg-zinc-950 border border-zinc-850 rounded-xl text-xs font-mono font-semibold tracking-wider flex items-center gap-1.5 shadow-2xl">
            <Sparkles size={11} className="text-yellow-500" />
            <span>@dripverse</span>
          </div>

        </motion.div>

      </div>

      {/* HORIZONTAL SLIDER: Categories Quick Shortcut Drawer */}
      <div className="bg-zinc-950/90 border-t border-zinc-900/65 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex items-center justify-between mb-3 text-left">
            <h3 className="text-xxs uppercase tracking-widest font-black text-zinc-500 flex items-center gap-1.5">
              <span>EXPLORE BY ESSENTIAL PIECES</span>
            </h3>
            <span className="text-[10px] font-mono text-zinc-650">SLIDE FOR MORE</span>
          </div>

          <div className="flex overflow-x-auto gap-3 pb-3 scrollbar-none snap-x touch-pan-x">
            {categories.map((cat) => {
              const coverUrl = categoryCovers[cat] || "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=100";
              return (
                <button
                  key={cat}
                  onClick={() => onCategorySelect(cat)}
                  className="flex-shrink-0 snap-center bg-zinc-900 hover:bg-zinc-850 hover:border-red-500/50 border border-zinc-800/60 p-2.5 rounded-xl flex items-center gap-3 transition-all duration-300 min-w-[170px] text-left cursor-pointer group"
                >
                  <img
                    src={coverUrl}
                    alt={cat}
                    referrerPolicy="no-referrer"
                    className="w-10 h-10 rounded-lg object-cover grayscale group-hover:grayscale-0 transition-all duration-350"
                  />
                  <div>
                    <p className="text-[10px] uppercase font-bold text-zinc-400 group-hover:text-white transition-colors">{cat}</p>
                    <p className="text-[9px] text-zinc-500 font-mono">View Trend &rarr;</p>
                  </div>
                </button>
              );
            })}
          </div>

        </div>
      </div>

    </div>
  );
}
