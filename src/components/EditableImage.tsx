import React, { useState } from 'react';
import { Camera, X, Check, Image as ImageIcon } from 'lucide-react';

interface EditableImageProps {
  src: string;
  alt: string;
  onChange: (newUrl: string) => void;
  isEditMode: boolean;
  className?: string;
}

const PRESET_IMAGES = [
  {
    name: 'Fachada Premium (Dra. Claudia)',
    url: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&q=80&w=800',
    category: 'Estrutura'
  },
  {
    name: 'Recepção & Lounge VIP',
    url: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=800',
    category: 'Estrutura'
  },
  {
    name: 'Escritório de Atendimento',
    url: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&q=80&w=800',
    category: 'Estrutura'
  },
  {
    name: 'Consultório Clínico',
    url: 'https://images.unsplash.com/photo-1629909615184-74f495363b67?auto=format&fit=crop&q=80&w=800',
    category: 'Estrutura'
  },
  {
    name: 'Retrato Dra. Claudia',
    url: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=800',
    category: 'Equipe'
  },
  {
    name: 'Sorriso Radiante (Claro)',
    url: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=1000',
    category: 'Tratamentos'
  },
  {
    name: 'Sorriso Planejado (Antes)',
    url: 'https://images.unsplash.com/photo-1516214104703-d870798883c5?auto=format&fit=crop&q=80&w=1000',
    category: 'Tratamentos'
  },
  {
    name: 'Procedimento / Equipamento',
    url: 'https://images.unsplash.com/photo-1579684389782-64d84b5e901d?auto=format&fit=crop&q=80&w=800',
    category: 'Equipamento'
  }
];

export default function EditableImage({
  src,
  alt,
  onChange,
  isEditMode,
  className = ""
}: EditableImageProps) {
  const [showModal, setShowModal] = useState(false);
  const [customUrl, setCustomUrl] = useState(src);

  if (!isEditMode) {
    return (
      <img
        src={src}
        alt={alt}
        className={className}
        referrerPolicy="no-referrer"
      />
    );
  }

  const handleSave = (url: string) => {
    onChange(url);
    setShowModal(false);
  };

  return (
    <div className="relative group/editable-img w-full h-full select-none">
      {/* Normal Image */}
      <img
        src={src}
        alt={alt}
        className={`${className} border-2 border-dashed border-gold-champagne/40 transition-all`}
        referrerPolicy="no-referrer"
      />

      {/* Editor Hover Overlay */}
      <div className="absolute inset-0 bg-neutral-950/60 opacity-0 group-hover/editable-img:opacity-100 transition-opacity flex items-center justify-center z-20">
        <button
          onClick={() => {
            setCustomUrl(src);
            setShowModal(true);
          }}
          className="bg-white hover:bg-gold-champagne hover:text-green-deep text-green-deep border border-neutral-200 px-4 py-2.5 shadow-xl text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 rounded-none cursor-pointer transition-all active:scale-95"
        >
          <Camera className="w-3.5 h-3.5" />
          Trocar Imagem
        </button>
      </div>

      {/* Editing Dialog Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-neutral-950/80 backdrop-blur-md z-[9999] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-xl rounded-none border border-neutral-200 shadow-2xl p-6 relative text-xs text-neutral-800">
            {/* Modal Header */}
            <div className="flex justify-between items-center pb-4 border-b border-neutral-100 mb-5">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gold-champagne/30 text-green-deep flex items-center justify-center font-bold">
                  📷
                </div>
                <div>
                  <h3 className="font-serif text-sm text-green-deep font-bold uppercase tracking-wider">Editor de Imagem</h3>
                  <p className="text-[10px] text-neutral-400">Escolha uma foto da galeria de sugestões ou cole um link personalizado.</p>
                </div>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-neutral-400 hover:text-neutral-700 p-1 rounded-none border border-neutral-100 hover:bg-neutral-50 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Custom URL Input */}
            <div className="space-y-1.5 mb-6">
              <label className="text-neutral-500 font-bold uppercase tracking-wider text-[10px] block">Endereço (URL) da Imagem:</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={customUrl}
                  onChange={(e) => setCustomUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="flex-1 bg-white border border-neutral-200 rounded-none px-3 py-2.5 text-xs text-neutral-800 focus:outline-none focus:border-green-deep font-mono"
                />
                <button
                  onClick={() => handleSave(customUrl)}
                  className="px-4 bg-green-deep text-white font-bold uppercase tracking-widest text-[10px] hover:bg-brand-wine hover:border-brand-wine border border-green-deep transition-all flex items-center gap-1 cursor-pointer"
                >
                  <Check className="w-3 h-3" /> Usar Link
                </button>
              </div>
            </div>

            {/* Preset Galley */}
            <div className="space-y-2">
              <label className="text-neutral-500 font-bold uppercase tracking-wider text-[10px] block">Fotos Selecionadas para Odontologia Premium:</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-h-[220px] overflow-y-auto pr-1">
                {PRESET_IMAGES.map((preset, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setCustomUrl(preset.url);
                      handleSave(preset.url);
                    }}
                    className={`group/preset relative border flex flex-col items-stretch text-left hover:border-green-deep cursor-pointer p-1 transition-all ${
                      src === preset.url ? 'border-green-deep bg-neutral-50' : 'border-neutral-200 bg-white'
                    }`}
                  >
                    <div className="aspect-[4/3] overflow-hidden relative mb-1">
                      <img
                        src={preset.url}
                        alt={preset.name}
                        className="w-full h-full object-cover group-hover/preset:scale-105 transition-transform"
                      />
                      {src === preset.url && (
                        <div className="absolute top-1 right-1 bg-green-deep text-white p-0.5 rounded-none">
                          <Check className="w-3 h-3" />
                        </div>
                      )}
                    </div>
                    <span className="text-[8px] font-bold text-neutral-500 block truncate leading-tight px-0.5">{preset.name}</span>
                    <span className="text-[7px] text-neutral-400 block px-0.5 mt-0.5 uppercase tracking-widest">{preset.category}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Preview of Current URL */}
            <div className="mt-5 p-3 bg-neutral-50 border border-neutral-200 flex gap-3 items-center">
              <div className="w-14 h-14 bg-neutral-200 border border-neutral-300 overflow-hidden shrink-0">
                <img
                  src={customUrl || 'https://via.placeholder.com/150'}
                  alt="Preview"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150?text=Link+Invalido';
                  }}
                />
              </div>
              <div className="min-w-0 flex-1">
                <span className="text-[9px] font-bold text-neutral-500 uppercase tracking-widest block">Visualização do Link Informado</span>
                <p className="text-[10px] text-neutral-400 truncate font-mono">{customUrl}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
