"use client";

import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Option {
  value: string;
  label: string;
}

interface CustomSelectProps {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  label?: string;
  className?: string;
}

export default function CustomSelect({ options, value, onChange, label, className }: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find(opt => opt.value === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={cn("relative space-y-2", isOpen && "z-[60]", className)} ref={containerRef}>
      {label && <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest block pl-1 italic">{label}</label>}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full h-12 md:h-14 bg-white/5 border border-white/10 hover:border-blue-500/50 rounded-xl md:rounded-2xl px-5 text-left flex items-center justify-between transition-all group focus:outline-none focus:ring-2 focus:ring-blue-500/20 active:scale-[0.98]"
      >
        <span className="text-[14px] font-black text-white group-hover:text-blue-400 transition-colors uppercase italic tracking-tight truncate pr-4">
          {selectedOption?.label || 'Select option'}
        </span>
        <ChevronDown size={18} className={cn("text-gray-500 transition-transform duration-300", isOpen && "rotate-180")} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 w-full mt-2 bg-slate-900 border border-white/10 rounded-2xl shadow-3xl overflow-hidden z-[100] animate-in fade-in zoom-in-95 duration-200">
          <div className="p-1.5 max-h-64 overflow-y-auto scrollbar-hide">
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={cn(
                  "w-full flex items-center justify-between px-4 py-3.5 rounded-xl text-[14px] font-black transition-all uppercase italic tracking-tight",
                  value === option.value 
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20" 
                    : "text-gray-500 hover:bg-white/5 hover:text-white"
                )}
              >
                <span>{option.label}</span>
                {value === option.value && <Check size={16} strokeWidth={4} />}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
