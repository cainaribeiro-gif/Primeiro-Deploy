import React, { useState, useRef } from 'react';
import { Camera, X, Check, Image as ImageIcon, Upload, Link as LinkIcon, Info, FileImage } from 'lucide-react';

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
  const [activeTab, setActiveTab] = useState<'upload' | 'cloud' | 'presets'>('upload');
  const [customUrl, setCustomUrl] = useState(src);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

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
    setErrorMessage('');
  };

  // Helper to resize and compress local images to optimized Web JPEG (~100-150kb)
  const compressAndProcessFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setErrorMessage('Por favor, envie apenas arquivos de imagem.');
      return;
    }

    setIsProcessing(true);
    setErrorMessage('');

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          const maxWidth = 1200; // Optimal resolution for web gallery/hero
          const maxHeight = 1200;

          // Downscale proportionally
          if (width > height) {
            if (width > maxWidth) {
              height = Math.round((height * maxWidth) / width);
              width = maxWidth;
            }
          } else {
            if (height > maxHeight) {
              width = Math.round((width * maxHeight) / height);
              height = maxHeight;
            }
          }

          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          if (!ctx) {
            // Fallback to original Base64 if canvas is unavailable
            setCustomUrl(event.target?.result as string);
            setIsProcessing(false);
            return;
          }

          ctx.drawImage(img, 0, 0, width, height);
          
          // Compress with 0.8 quality to keep image crisp but extremely light (approx 100kb-180kb)
          const compressedBase64 = canvas.toDataURL('image/jpeg', 0.8);
          setCustomUrl(compressedBase64);
          setIsProcessing(false);
        } catch (e) {
          console.error('Erro ao comprimir imagem:', e);
          setCustomUrl(event.target?.result as string); // fallback
          setIsProcessing(false);
        }
      };
      img.onerror = () => {
        setErrorMessage('Falha ao processar arquivo de imagem.');
        setIsProcessing(false);
      };
    };
    reader.onerror = () => {
      setErrorMessage('Falha ao ler o arquivo.');
      setIsProcessing(false);
    };
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      compressAndProcessFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      compressAndProcessFile(file);
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="relative group/editable-img w-full h-full select-none">
      {/* Normal Image with dashed gold frame indicating it's editable */}
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
            setErrorMessage('');
          }}
          className="bg-white hover:bg-gold-champagne hover:text-green-deep text-green-deep border border-neutral-200 px-4 py-2.5 shadow-xl text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 rounded-none cursor-pointer transition-all active:scale-95"
        >
          <Camera className="w-3.5 h-3.5" />
          Alterar Foto
        </button>
      </div>

      {/* Editing Dialog Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-neutral-950/80 backdrop-blur-md z-[9999] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-xl rounded-none border border-neutral-200 shadow-2xl p-6 relative text-xs text-neutral-800">
            {/* Modal Header */}
            <div className="flex justify-between items-center pb-3 border-b border-neutral-100 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gold-champagne/30 text-green-deep flex items-center justify-center font-bold">
                  🖼️
                </div>
                <div>
                  <h3 className="font-serif text-sm text-green-deep font-bold uppercase tracking-wider">Gestor de Imagens</h3>
                  <p className="text-[10px] text-neutral-400">Adicione imagens locais ou links de armazenamento em nuvem.</p>
                </div>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-neutral-400 hover:text-neutral-700 p-1 rounded-none border border-neutral-100 hover:bg-neutral-50 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* TAB SELECTOR */}
            <div className="flex border-b border-neutral-200 mb-4 text-[10px] font-bold uppercase tracking-wider">
              <button
                onClick={() => { setActiveTab('upload'); setErrorMessage(''); }}
                className={`flex-1 py-2.5 border-b-2 flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  activeTab === 'upload' ? 'border-green-deep text-green-deep bg-neutral-50/50' : 'border-transparent text-neutral-400 hover:text-neutral-700'
                }`}
              >
                <Upload className="w-3.5 h-3.5" />
                Upload Local
              </button>
              <button
                onClick={() => { setActiveTab('cloud'); setErrorMessage(''); }}
                className={`flex-1 py-2.5 border-b-2 flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  activeTab === 'cloud' ? 'border-green-deep text-green-deep bg-neutral-50/50' : 'border-transparent text-neutral-400 hover:text-neutral-700'
                }`}
              >
                <LinkIcon className="w-3.5 h-3.5" />
                Link de Nuvem
              </button>
              <button
                onClick={() => { setActiveTab('presets'); setErrorMessage(''); }}
                className={`flex-1 py-2.5 border-b-2 flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  activeTab === 'presets' ? 'border-green-deep text-green-deep bg-neutral-50/50' : 'border-transparent text-neutral-400 hover:text-neutral-700'
                }`}
              >
                <ImageIcon className="w-3.5 h-3.5" />
                Sugestões
              </button>
            </div>

            {errorMessage && (
              <div className="bg-red-50 text-red-700 border border-red-200 p-2.5 mb-4 text-[11px] font-medium leading-relaxed">
                ⚠️ {errorMessage}
              </div>
            )}

            {/* TAB CONTENT: LOCAL FILE UPLOAD */}
            {activeTab === 'upload' && (
              <div className="space-y-4">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  className="hidden"
                />

                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={triggerFileSelect}
                  className={`border-2 border-dashed rounded-none p-8 text-center cursor-pointer transition-all flex flex-col items-center justify-center min-h-[140px] ${
                    isDragging
                      ? 'border-green-deep bg-green-50/20'
                      : 'border-neutral-200 hover:border-green-deep/50 hover:bg-neutral-50/80 bg-white'
                  }`}
                >
                  <FileImage className={`w-8 h-8 mb-2 ${isDragging ? 'text-green-deep' : 'text-neutral-400'}`} />
                  <span className="font-bold text-neutral-700 text-[11px]">
                    {isProcessing ? 'Comprimindo e otimizando...' : 'Arraste a foto aqui ou clique para selecionar'}
                  </span>
                  <p className="text-[9px] text-neutral-400 mt-1">Suporta JPEG, PNG, WEBP de qualquer resolução.</p>
                </div>

                <div className="flex items-center gap-1.5 text-neutral-500 text-[10px] bg-neutral-50 p-2 border border-neutral-150">
                  <Info className="w-3.5 h-3.5 text-gold-champagne shrink-0" />
                  <span>
                    ⚡ <strong>Compressão Automática Ativa:</strong> Reduzimos e otimizamos o tamanho do arquivo no navegador para garantir carregamento ultra-rápido no site.
                  </span>
                </div>
              </div>
            )}

            {/* TAB CONTENT: CLOUD STORAGE URL */}
            {activeTab === 'cloud' && (
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-neutral-500 font-bold uppercase tracking-wider text-[10px] block">Endereço (URL) de Nuvem da Imagem:</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={customUrl}
                      onChange={(e) => setCustomUrl(e.target.value)}
                      placeholder="https://sua-conta.supabase.co/storage/v1/object/public/imagens/..."
                      className="flex-1 bg-white border border-neutral-200 rounded-none px-3 py-2 text-xs text-neutral-800 focus:outline-none focus:border-green-deep font-mono"
                    />
                  </div>
                </div>

                <div className="bg-neutral-50 p-3 border border-neutral-200 space-y-2 text-[10px] text-neutral-500 leading-relaxed">
                  <p className="font-bold text-neutral-700 flex items-center gap-1">
                    🌐 Onde hospedar suas fotos em nuvem?
                  </p>
                  <ul className="list-disc list-inside space-y-1 pl-1">
                    <li><strong>Supabase Storage:</strong> Crie um bucket público no menu "Storage" do seu painel e copie a URL pública da imagem.</li>
                    <li><strong>Imgur / Firebase Storage:</strong> Faça upload e cole a URL pública direta da imagem (terminando em .jpg ou .png).</li>
                  </ul>
                </div>
              </div>
            )}

            {/* TAB CONTENT: PRESETS */}
            {activeTab === 'presets' && (
              <div className="space-y-2">
                <label className="text-neutral-500 font-bold uppercase tracking-wider text-[10px] block">Fotos Selecionadas para Odontologia Premium:</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 max-h-[180px] overflow-y-auto pr-1">
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
            )}

            {/* PREVIEW & SAVE SECTION */}
            <div className="mt-4 pt-4 border-t border-neutral-100 flex flex-col sm:flex-row items-center justify-between gap-4">
              {/* Preview Box */}
              <div className="flex gap-2.5 items-center w-full sm:w-auto min-w-0">
                <div className="w-12 h-12 bg-neutral-100 border border-neutral-250 overflow-hidden shrink-0 flex items-center justify-center">
                  <img
                    src={customUrl || 'https://via.placeholder.com/150'}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150?text=Link+Invalido';
                    }}
                  />
                </div>
                <div className="min-w-0 flex-1 sm:max-w-[200px]">
                  <span className="text-[8px] font-bold text-neutral-400 uppercase tracking-widest block leading-none mb-1">Preview Atual</span>
                  <p className="text-[9px] text-neutral-500 truncate font-mono leading-none">{customUrl ? (customUrl.startsWith('data:') ? 'Arquivo Local (Base64)' : customUrl) : 'Sem Imagem'}</p>
                </div>
              </div>

              {/* Save Trigger */}
              <button
                onClick={() => handleSave(customUrl)}
                disabled={isProcessing}
                className="w-full sm:w-auto px-5 py-2.5 bg-green-deep hover:bg-brand-wine hover:border-brand-wine text-white font-bold uppercase tracking-widest text-[10px] border border-green-deep transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-55"
              >
                <Check className="w-3.5 h-3.5" /> Salvar e Aplicar
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
