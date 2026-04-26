import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Writer } from '../services/geminiService';
import { Book, X } from 'lucide-react';

interface WriterListProps {
  writers: Writer[];
}

export default function WriterList({ writers }: WriterListProps) {
  const [selectedBook, setSelectedBook] = useState<{ title: string; info: string } | null>(null);

  if (writers.length === 0) return null;

  return (
    <div className="w-full max-w-6xl mx-auto px-4 pb-40">
      <div className="space-y-40">
        {writers.map((writer, index) => (
          <motion.div 
            key={writer.name + index}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, delay: index * 0.1 }}
            className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-20 items-start border-t border-ink/5 pt-20"
          >
            {/* Left: Writer Name & Info */}
            <div className="md:col-span-4 sticky top-40">
              <span className="text-xs font-serif text-sun tracking-[0.5em] uppercase block mb-4">
                {writer.era}
              </span>
              <h2 className="text-6xl md:text-8xl font-shoujin mb-6 leading-tight">
                {writer.name}
              </h2>
              <p className="text-sm font-serif italic text-ink/50 leading-relaxed mb-8">
                {writer.description}
              </p>
              
              <div className="p-6 bg-white/50 border border-ink/5 rounded-sm backdrop-blur-sm shadow-sm hover:shadow-md transition-shadow duration-500">
                 <h4 className="text-[10px] tracking-[0.3em] font-serif uppercase text-ink/40 mb-3">文案视角</h4>
                 <p className="text-sm font-serif text-ink/80 leading-relaxed">
                   {writer.locationContext}
                 </p>
              </div>
            </div>

            {/* Right: Content & Works */}
            <div className="md:col-span-8">
               <div className="relative group cursor-pointer overflow-hidden p-1 bg-[#fffdfa] border border-ink/5 shadow-sm hover:shadow-xl transition-all duration-700">
                  <div className="p-10 md:p-16 border border-ink/5">
                    <div className="mb-10 text-xl font-handwriting text-sun opacity-60">见字如面 · 辑录</div>
                    <blockquote className="text-2xl md:text-4xl font-serif leading-snug mb-12 relative">
                      <span className="absolute -left-8 -top-8 text-8xl text-ink/5 opacity-5 font-serif">“</span>
                      {writer.quote}
                    </blockquote>
                    <div className="text-right font-serif">
                       <span className="text-ink/40 mr-2">—</span>
                       <span className="text-lg italic">{writer.representativeWork}</span>
                    </div>
                  </div>
               </div>

               <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {writer.books.map((book) => (
                    <motion.button
                      key={book.title}
                      whileHover={{ scale: 1.02, x: 5 }}
                      onClick={() => setSelectedBook(book)}
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
               exit={{ opacity: 0, scale: 0.9, y: 20 }}
               className="relative w-full max-w-lg bg-white p-12 shadow-2xl border border-ink/5 pointer-events-auto"
            >
              <button 
                onClick={() => setSelectedBook(null)}
                className="absolute top-6 right-6 p-2 hover:bg-ink/5 transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
              <h3 className="text-3xl font-shoujin mb-6">{selectedBook.title}</h3>
              <div className="h-[1px] w-12 bg-sun mb-8" />
              <p className="font-serif text-ink/70 leading-relaxed italic">
                {selectedBook.info}
              </p>
              <div className="mt-12 flex justify-end">
                <button 
                  onClick={() => setSelectedBook(null)}
                  className="px-8 py-2 border border-ink text-sm font-serif hover:bg-ink hover:text-white transition-all"
                >
                  合上书页
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
