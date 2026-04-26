import React from 'react';
import { Search } from 'lucide-react';
import { motion } from 'motion/react';

interface SearchBoxProps {
  onSearch: (city: string) => void;
  isLoading: boolean;
}

export default function SearchBox({ onSearch, isLoading }: SearchBoxProps) {
  const [value, setValue] = React.useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim()) onSearch(value);
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-20 bg-paper relative z-20">
      <motion.form 
        onSubmit={handleSubmit}
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className="relative flex items-center border-b-2 border-ink/10 focus-within:border-sun transition-all duration-700"
      >
        <Search className="absolute left-0 w-8 h-8 text-ink/30" />
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="输入一座城，探寻一段灵感..."
          className="w-full bg-transparent py-8 pl-14 pr-4 text-3xl md:text-5xl font-serif focus:outline-none placeholder:text-ink/10"
        />
        <button 
           type="submit"
           className="px-8 py-3 bg-ink text-white font-serif tracking-widest hover:bg-sun transition-colors duration-500 disabled:opacity-50"
           disabled={isLoading}
        >
          {isLoading ? '寻迹中...' : '寻迹'}
        </button>
      </motion.form>
      <div className="mt-4 flex gap-4 text-xs font-serif text-ink/40 tracking-widest opacity-60">
        <span>热门：上海 · 虹口</span> |
        <span>北京 · 东城</span> |
        <span>杭州 · 西湖</span> |
        <span>青岛 · 八大关</span>
      </div>
    </div>
  );
}
