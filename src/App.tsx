import React, { useState, useEffect } from 'react';
import Hero from './components/Hero';
import SearchBox from './components/SearchBox';
import WriterList from './components/WriterList';
import CustomCursor from './components/CustomCursor';
import { searchWritersByLocation, Writer } from './services/geminiService';
import { motion, useScroll, useSpring } from 'motion/react';

export default function App() {
  const [writers, setWriters] = useState<Writer[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchedCity, setSearchedCity] = useState('');
  
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const handleSearch = async (city: string) => {
    setLoading(true);
    setSearchedCity(city);
    const results = await searchWritersByLocation(city);
    setWriters(results);
    setLoading(false);
    
    // Smooth scroll to list after a small delay
    setTimeout(() => {
      window.scrollTo({
        top: window.innerHeight + 100,
        behavior: 'smooth'
      });
    }, 100);
  };

  return (
    <main className="relative min-h-screen selection:bg-sun selection:text-white">
      <CustomCursor />
      
      {/* Reading Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-sun origin-left z-[100]"
        style={{ scaleX }}
      />

      <Hero />
      
      <section className="bg-paper relative overflow-hidden">
        {/* Decorative Lines */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1px] h-40 bg-ink/5" />
        
        <SearchBox onSearch={handleSearch} isLoading={loading} />
        
        {loading && (
          <div className="flex flex-col items-center justify-center py-20 animate-pulse">
            <div className="w-8 h-8 rounded-full border-2 border-sun border-t-transparent animate-spin mb-4" />
            <p className="font-serif italic text-ink/40 tracking-[0.2em]">正在从故纸堆中寻觅影迹...</p>
          </div>
        )}

        {writers.length > 0 && !loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="px-4"
          >
            <div className="max-w-4xl mx-auto mb-20 text-center">
               <h3 className="text-xl font-serif italic text-ink/30 mb-2">关于 {searchedCity} 的文学记忆</h3>
               <div className="w-12 h-[1px] bg-sun mx-auto" />
            </div>
            <WriterList writers={writers} />
          </motion.div>
        )}

        {!loading && searchedCity && writers.length === 0 && (
          <div className="py-20 text-center font-serif italic text-ink/40">
            暂未寻到文人的足迹，换座城试试？
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="py-20 border-t border-ink/5 text-center bg-[#fffdfa]">
        <div className="font-shoujin text-3xl mb-4 opacity-30">文踪影迹</div>
        <p className="text-[10px] font-serif uppercase tracking-[0.4em] text-ink/20">
          Made with sunlight and calligraphy
        </p>
      </footer>
    </main>
  );
}
