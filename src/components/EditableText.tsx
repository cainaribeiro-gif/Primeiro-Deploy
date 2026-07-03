import React, { useRef, useEffect, useState } from 'react';
import { Edit2 } from 'lucide-react';

interface EditableTextProps {
  id: string;
  value: string;
  onChange: (newValue: string) => void;
  isEditMode: boolean;
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'p' | 'span' | 'div' | 'a';
  multiline?: boolean;
}

export default function EditableText({
  id,
  value,
  onChange,
  isEditMode,
  className = "",
  as: Component = "span",
  multiline = false
}: EditableTextProps) {
  const ref = useRef<HTMLElement>(null);
  const [isFocused, setIsFocused] = useState(false);

  // Keep ref content in sync with incoming state value if not focused
  useEffect(() => {
    if (ref.current && !isFocused) {
      ref.current.innerText = value;
    }
  }, [value, isFocused]);

  if (!isEditMode) {
    if (Component === 'a') {
      return <span className={className}>{value}</span>;
    }
    return <Component className={className}>{value}</Component>;
  }

  const handleBlur = (e: React.FocusEvent<HTMLElement>) => {
    setIsFocused(false);
    const text = e.currentTarget.innerText;
    onChange(text);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
    // If not multiline, prevent Enter key
    if (!multiline && e.key === 'Enter') {
      e.preventDefault();
      e.currentTarget.blur();
    }
  };

  return (
    <span className="relative group/editable-text inline-block max-w-full">
      <Component
        ref={ref as any}
        contentEditable
        suppressContentEditableWarning
        onFocus={() => setIsFocused(true)}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        className={`${className} border border-dashed border-gold-champagne/70 bg-gold-champagne/5 hover:bg-gold-champagne/10 px-1 rounded-none cursor-text outline-none focus:bg-white focus:border-green-deep focus:ring-1 focus:ring-green-deep/30 transition-colors`}
        title="Clique para editar este texto diretamente no site"
      />
      {/* Small floating edit icon on hover */}
      <span className="absolute -top-3.5 -right-3.5 bg-green-deep text-white text-[7px] font-bold p-1 border border-white/10 opacity-0 group-hover/editable-text:opacity-100 transition-opacity pointer-events-none z-10 flex items-center gap-0.5">
        <Edit2 className="w-1.5 h-1.5" /> EDITAR
      </span>
    </span>
  );
}
