import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Writer } from '../services/geminiService';
import { Book, X } from 'lucide-react';

interface WriterListProps {
  writers: Writer[];
}

export default function WriterList({ writers }: WriterListProps) {
  const [selectedBook, setSelectedBook] = useState<{ title: string; info: string } | null>(null);
  const [selectedBiography, setSelectedBiography] = useState<Writer | null>(null);

  if (writers.length === 0) return null;

  return (
    <div className="w-full max-w-6xl mx-auto px-4 pb-40">
      <div className="space-y-40">
        {writers.map((writer, index) => (
          <WriterCard 
            key={writer.name + index} 
            writer={writer} 
            index={index} 
            onBookClick={setSelectedBook}
            onBioClick={setSelectedBiography}
          />
        ))}
      </div>

      {/* Book Detail Modal */}
      <AnimatePresence>
        {selectedBook && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 sm:p-10 pointer-events-none">
            <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               className="absolute inset-0 bg-paper/80 backdrop-blur-md pointer-events-auto"
               onClick={() => setSelectedBook(null)}
            />
            <motion.div 
               initial={{ opacity: 0, scale: 0.9, y: 20 }}
               animate={{ opacity: 1, scale: 1, y: 0 }}
               transition={{ type: 'spring', damping: 25, stiffness: 200 }}
               exit={{ opacity: 0, scale: 0.9, y: 20 }}
               className="relative w-full max-w-lg bg-white p-12 shadow-2xl border border-ink/5 pointer-events-auto overflow-hidden"
            >
              <div className="absolute inset-0 paper-texture opacity-5 pointer-events-none" />
              <button 
                onClick={() => setSelectedBook(null)}
                className="absolute top-6 right-6 p-2 hover:bg-ink/5 transition-colors z-20"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="relative z-10">
                <h3 className="text-3xl font-shoujin mb-6">{selectedBook.title}</h3>
                <div className="h-[1px] w-12 bg-sun mb-8" />
                <p className="font-serif text-ink/70 leading-relaxed italic">
                  {selectedBook.info}
                </p>
                <div className="mt-12 flex justify-end">
                  <button 
                    onClick={() => setSelectedBook(null)}
                    className="px-8 py-2 border border-ink text-sm font-serif hover:bg-ink hover:text-white transition-all transform hover:-translate-y-1 active:translate-y-0"
                  >
                    合上书页
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Biography Modal */}
      <AnimatePresence>
        {selectedBiography && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 sm:p-10 pointer-events-none">
            <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               className="absolute inset-0 bg-ink/10 backdrop-blur-sm pointer-events-auto"
               onClick={() => setSelectedBiography(null)}
            />
            <motion.div 
               initial={{ opacity: 0, scale: 0.95, x: 50 }}
               animate={{ opacity: 1, scale: 1, x: 0 }}
               transition={{ type: 'spring', damping: 30, stiffness: 300 }}
               exit={{ opacity: 0, scale: 0.95, x: 50 }}
               className="relative w-full max-w-2xl bg-paper p-16 shadow-2xl border border-ink/5 pointer-events-auto overflow-hidden"
            >
              <div className="absolute inset-0 paper-texture opacity-20 pointer-events-none" />
              <div className="absolute top-0 right-0 w-32 h-32 bg-sun/5 -rotate-45 translate-x-16 -translate-y-16" />
              
              <button 
                onClick={() => setSelectedBiography(null)}
                className="absolute top-8 right-8 p-3 hover:bg-ink/5 transition-colors z-20 rounded-full"
              >
                <X className="w-6 h-6 text-ink/40" />
              </button>

              <div className="relative z-10">
                <div className="flex gap-8 mb-12 items-end">
                  <h3 className="text-5xl md:text-7xl font-shoujin text-ink">{selectedBiography.name}</h3>
                  <span className="text-sm font-serif text-sun tracking-[0.4em] mb-2">{selectedBiography.era}</span>
                </div>
                
                <div className="w-16 h-[1px] bg-ink/10 mb-8" />
                
                <div className="space-y-6">
                  <p className="font-serif text-lg leading-loose text-ink/80 text-justify first-letter:text-4xl first-letter:font-shoujin first-letter:mr-2 first-letter:float-left">
                    {selectedBiography.biography}
                  </p>
                </div>

                <div className="mt-16 flex justify-between items-center opacity-40">
                   <div className="text-[10px] font-serif tracking-[0.5em] uppercase">作家 · 生平小传</div>
                   <button 
                    onClick={() => setSelectedBiography(null)}
                    className="font-serif text-sm border-b border-ink/20 hover:border-ink transition-colors pb-1"
                   >
                     返回页面
                   </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function WriterCard({ writer, index, onBookClick, onBioClick }: { 
  writer: Writer, 
  index: number, 
  onBookClick: (b: {title: string, info: string}) => void,
  onBioClick: (w: Writer) => void
}) {
  const [quoteIndex, setQuoteIndex] = useState(0);
  const currentQuote = writer.quotes[quoteIndex % writer.quotes.length];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 1, delay: index * 0.1 }}
      className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-20 items-start border-t border-ink/5 pt-20"
    >
      {/* Left: Writer Name & Info */}
      <div 
        className="md:col-span-4 sticky top-40 flex gap-8 cursor-pointer group/bio"
        onClick={() => onBioClick(writer)}
      >
        <div className="flex flex-col items-center">
          <span className="text-[10px] font-serif text-sun tracking-[0.4em] uppercase writing-vertical mb-4 opacity-60 group-hover/bio:text-ink transition-colors duration-500">
            {writer.era}
          </span>
          <h2 className="text-5xl md:text-7xl font-shoujin font-normal writing-vertical h-80 flex justify-between py-4 border-l border-ink/5 pl-4 group-hover/bio:border-sun/30 transition-all duration-700">
            {writer.name.split('').map((char, i) => (
              <span key={i} className="group-hover/bio:text-sun transition-colors duration-700" style={{ transitionDelay: `${i * 50}ms` }}>{char}</span>
            ))}
          </h2>
        </div>
        
        <div className="flex-1 pt-12">
          <p className="text-xs font-serif italic text-ink/40 leading-relaxed mb-6 group-hover/bio:text-ink/60 transition-colors">
            {writer.description}
          </p>
          <div className="p-4 bg-white/30 border-l-2 border-sun/20 backdrop-blur-sm group-hover/bio:bg-white/50 transition-all duration-700">
             <h4 className="text-[9px] tracking-widest font-serif uppercase text-ink/30 mb-2">观照视角</h4>
             <p className="text-xs font-serif text-ink/70 leading-relaxed">
               {writer.locationContext}
             </p>
             <div className="mt-4 opacity-0 group-hover/bio:opacity-100 transition-opacity text-[8px] font-serif tracking-[0.2em] text-sun uppercase">
               点击查看生平 · [ Read Bio ]
             </div>
          </div>
        </div>
      </div>

      {/* Right: Content & Works */}
      <div className="md:col-span-8">
         <div className="relative group cursor-none overflow-hidden bg-[#faf7f2] border border-ink/5 shadow-sm hover:shadow-2xl transition-all duration-1000 p-8 md:p-12 min-h-[400px] flex flex-col justify-between">
            {/* Subtle Paper Grain Overlay */}
            <div className="absolute inset-0 paper-texture opacity-20 pointer-events-none" />
            
            <AnimatePresence mode="wait">
              <motion.div 
                key={quoteIndex}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                className="relative z-10"
              >
                <div className="mb-12 flex justify-between items-center opacity-30">
                  <div className="text-[10px] tracking-[0.5em] font-serif">文踪 · 辑录 [{quoteIndex + 1}/{writer.quotes.length}]</div>
                  <div className="w-12 h-[1px] bg-ink/20" />
                </div>
                
                <div className="space-y-6">
                  {currentQuote.split(/[，。！？；]/).filter(s => s.trim()).map((sentence, idx) => (
                    <p key={idx} className="text-xl md:text-2xl font-serif leading-[2] text-ink/80 tracking-wide text-justify">
                      {sentence}
                      {currentQuote[currentQuote.indexOf(sentence) + sentence.length]}
                    </p>
                  ))}
                </div>

                <div className="mt-16 flex flex-col items-start opacity-40">
                   <div className="text-sm italic font-serif group-hover:opacity-100 transition-opacity">—— {writer.name}</div>
                   <div className="text-[10px] tracking-widest font-serif mt-1">《{writer.representativeWork}》</div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Next Sentence Button */}
            {writer.quotes.length > 1 && (
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setQuoteIndex(prev => (prev + 1));
                }}
                className="absolute bottom-6 right-6 md:bottom-8 md:right-8 z-20 px-4 py-2 border border-ink/10 hover:border-sun/40 hover:bg-white transition-all text-[10px] font-serif tracking-[0.2em] group/next flex items-center gap-2"
              >
                <span className="opacity-40 group-hover/next:opacity-100">下一句</span>
                <span className="w-4 h-[1px] bg-ink/20 group-hover/next:bg-sun group-hover/next:w-6 transition-all" />
              </button>
            )}
         </div>

         <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {writer.books.map((book) => (
              <motion.button
                key={book.title}
                whileHover={{ scale: 1.02, x: 5 }}
                onClick={() => onBookClick(book)}
                className="flex items-center gap-4 p-4 text-left border border-ink/5 hover:border-sun/30 hover:bg-white/40 transition-all group"
              >
                <div className="p-2 bg-ink/5 group-hover:bg-sun group-hover:text-white transition-colors">
                  <Book className="w-4 h-4" />
                </div>
                <span className="font-serif text-sm truncate">{book.title}</span>
              </motion.button>
            ))}
         </div>
      </div>
    </motion.div>
  );
}
