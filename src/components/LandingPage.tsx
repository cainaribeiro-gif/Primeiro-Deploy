/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Sparkles, Calendar, Heart, Award, MapPin, Phone, MessageSquare, ArrowRight, Star, 
  ChevronRight, ArrowLeftRight, Clock, HelpCircle, Check, BookOpen, User, ShieldCheck, Mail, Laptop, X, Menu,
  Paperclip, UploadCloud, AlertCircle, Edit, Settings, RotateCcw, Save
} from 'lucide-react';
import { Service, BlogPost, Review, SiteContent } from '../types';
import { INITIAL_SERVICES, INITIAL_BLOG_POSTS, INITIAL_REVIEWS } from '../mockData';
import { motion, AnimatePresence } from 'motion/react';
import { BrandLogoHorizontal, BrandLogoVertical, BrandSubmarca, ToothIcon } from './BrandLogo';
import EditableText from './EditableText';
import EditableImage from './EditableImage';
import { DEFAULT_SITE_CONTENT } from '../defaultSiteContent';

interface LandingPageProps {
  onLoginClick?: (role: 'patient' | 'admin') => void;
  onNewLeadCreated: (
    leadName: string, 
    leadPhone: string, 
    serviceInterested: string,
    leadEmail?: string,
    leadWhatsapp?: string,
    leadMessage?: string,
    customQuestions?: { question: string; answer: string }[],
    attachedFiles?: { name: string; size: string; type: string }[]
  ) => void;
  siteContent: SiteContent;
  onSaveSiteContent: (newContent: SiteContent) => void;
  isEditMode: boolean;
  setIsEditMode: (active: boolean) => void;
}

const CLINIC_SPACES = [
  {
    id: 'fachada',
    title: 'Fachada Premium',
    description: 'Elegância minimalista em preto fosco, letreiro 3D dourado e iluminação cênica sofisticada.',
    details: 'Uma entrada imponente projetada para refletir o nível de excelência dos tratamentos oferecidos. Com o letreiro em relevo dourado "Dra. Claudia França | Saúde & Estética" sob spots de iluminação quente, o design exterior une sofisticação urbana e o aconchego de uma clínica boutique, convidando você para uma experiência odontológica de padrão elevado.',
    imageUrl: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'recepcao',
    title: 'Recepção & Lounge VIP',
    description: 'Sala de espera climatizada com poltronas off-white acolhedoras, detalhes em dourado e adorno de flores nobres.',
    details: 'Projetada sob a ótica da neuroarquitetura para promover calma e relaxamento. Dispõe de um painel ripado iluminado, um suntuoso balcão com ripas de madeira natural, poltronas confortáveis adornadas com mantas macias de tricot, e um lustre orgânico de design italiano que banha o ambiente com luz suave e aconchegante.',
    imageUrl: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'consultorio',
    title: 'Escritório de Consulta',
    description: 'Mesa em L com tampo de vidro fosco, cadeiras ergonômicas e telas para detalhamento 3D dos planejamentos.',
    details: 'O espaço dedicado ao acolhimento e escuta ativa de cada paciente. A mesa de vidro fosco, cadeiras de design moderno e iluminação difusa proporcionam o ambiente perfeito para discutir suas metas de tratamento de forma privativa. Aqui, a Dra. Claudia apresenta planejamentos digitais e simulações 3D com total clareza e discrição.',
    imageUrl: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'suites',
    title: 'Suítes de Atendimento',
    description: 'Consultórios equipados com cadeiras de última geração, incluindo designs exclusivos em tons de laranja e vinho.',
    details: 'Equipados com tecnologia odontológica de última geração e cadeiras clínicas de alto padrão (incluindo designs coloridos em tons de laranja e vinho). Nossos consultórios seguem padrões internacionais de biossegurança, unindo ergonomia, alta precisão técnica e um ambiente perfeitamente higienizado e relaxante para a realização dos seus procedimentos.',
    imageUrl: 'https://images.unsplash.com/photo-1629909615184-74f495363b67?auto=format&fit=crop&q=80&w=800'
  }
];

export default function LandingPage({ 
  onLoginClick, 
  onNewLeadCreated,
  siteContent,
  onSaveSiteContent,
  isEditMode,
  setIsEditMode
}: LandingPageProps) {
  // CMS helper functions
  const updateField = <K extends keyof SiteContent>(field: K, value: SiteContent[K]) => {
    onSaveSiteContent({
      ...siteContent,
      [field]: value
    });
  };

  const updateClinicSpace = (id: string, updatedFields: Partial<any>) => {
    const spaces = siteContent?.clinicSpaces || CLINIC_SPACES;
    const updatedSpaces = spaces.map(space => {
      if (space.id === id) {
        return { ...space, ...updatedFields };
      }
      return space;
    });
    updateField('clinicSpaces', updatedSpaces);
  };

  const resetToDefault = () => {
    if (window.confirm("Deseja realmente redefinir todos os textos e imagens para os padrões originais do site?")) {
      onSaveSiteContent(DEFAULT_SITE_CONTENT);
    }
  };

  // Services & Articles loaded from mock data
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<BlogPost | null>(null);
  const [selectedClinicSpace, setSelectedClinicSpace] = useState<any | null>(null);
  const [activeServiceCategory, setActiveServiceCategory] = useState<string>('todas');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Interactive Before/After slider control
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);

  // Advanced Form states for contact lead generation
  const [leadName, setLeadName] = useState('');
  const [leadEmail, setLeadEmail] = useState('');
  const [leadPhone, setLeadPhone] = useState('');
  const [leadWhatsapp, setLeadWhatsapp] = useState('');
  const [sameAsPhone, setSameAsPhone] = useState(true);
  
  // Categorized Service selections
  const [mainCategory, setMainCategory] = useState<'harmonizacao' | 'implantodontia' | 'ortodontia' | 'clinica_geral' | 'outro'>('harmonizacao');
  
  // Conditional sub-questions
  const [harmProcedure, setHarmProcedure] = useState('Toxina Botulínica (Botox)');
  const [priorBotox, setPriorBotox] = useState('');
  const [priorBotoxDetails, setPriorBotoxDetails] = useState('');
  const [harmGoal, setHarmGoal] = useState('Suavizar rugas de expressão');
  
  const [implState, setImplState] = useState('Já perdi o dente e o espaço está vazio');
  const [implBoneGraft, setImplBoneGraft] = useState('Não sei');
  const [implTimeLost, setImplTimeLost] = useState('Menos de 6 meses');
  
  const [orthoType, setOrthoType] = useState('Alinhadores Transparentes (Invisalign)');
  const [orthoPrior, setOrthoPrior] = useState('Não');
  
  const [generalGoal, setGeneralGoal] = useState('Profilaxia Avançada (Limpeza profunda)');
  const [customBrief, setCustomBrief] = useState('');
  
  // File attachments state
  const [attachedFiles, setAttachedFiles] = useState<{ name: string; size: string; type: string }[]>([]);
  const [isDraggingFile, setIsDraggingFile] = useState(false);
  
  const [leadMessage, setLeadMessage] = useState('');
  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleSliderMove = (clientX: number, containerRect: DOMRect) => {
    const x = clientX - containerRect.left;
    const percentage = Math.max(0, Math.min(100, (x / containerRect.width) * 100));
    setSliderPosition(percentage);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    const container = e.currentTarget.getBoundingClientRect();
    handleSliderMove(e.touches[0].clientX, container);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging && e.buttons !== 1) return;
    const container = e.currentTarget.getBoundingClientRect();
    handleSliderMove(e.clientX, container);
  };

  const formatBytes = (bytes: number, decimals = 1) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const filesArray = Array.from(e.target.files).map((file: any) => ({
        name: file.name,
        size: formatBytes(file.size),
        type: file.type || 'documento/exame'
      }));
      setAttachedFiles(prev => [...prev, ...filesArray]);
    }
  };

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingFile(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const filesArray = Array.from(e.dataTransfer.files).map((file: any) => ({
        name: file.name,
        size: formatBytes(file.size),
        type: file.type || 'documento/exame'
      }));
      setAttachedFiles(prev => [...prev, ...filesArray]);
    }
  };

  const removeFile = (index: number) => {
    setAttachedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleLeadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadName || !leadPhone) {
      alert('Por favor, preencha pelo menos seu nome e telefone.');
      return;
    }
    
    const actualWhatsapp = sameAsPhone ? leadPhone : leadWhatsapp;
    
    // Generate questions
    const customQuestions: { question: string; answer: string }[] = [];
    let serviceLabel = '';
    
    if (mainCategory === 'harmonizacao') {
      serviceLabel = `Harmonização: ${harmProcedure}`;
      customQuestions.push({ question: 'Procedimento', answer: harmProcedure });
      if (harmProcedure === 'Toxina Botulínica (Botox)') {
        customQuestions.push({ question: 'Experiência anterior com Botox', answer: priorBotox || 'Não' });
        if (priorBotox === 'Sim' && priorBotoxDetails) {
          customQuestions.push({ question: 'Experiências/Queixas', answer: priorBotoxDetails });
        }
      }
      customQuestions.push({ question: 'Objetivo da Harmonização', answer: harmGoal });
    } else if (mainCategory === 'implantodontia') {
      serviceLabel = 'Implantodontia';
      customQuestions.push({ question: 'Estado do dente', answer: implState });
      customQuestions.push({ question: 'Enxerto ósseo', answer: implBoneGraft });
      customQuestions.push({ question: 'Tempo de perda dentária', answer: implTimeLost });
    } else if (mainCategory === 'ortodontia') {
      serviceLabel = `Ortodontia: ${orthoType}`;
      customQuestions.push({ question: 'Modelo de aparelho', answer: orthoType });
      customQuestions.push({ question: 'Realizou tratamento antes?', answer: orthoPrior });
    } else if (mainCategory === 'clinica_geral') {
      serviceLabel = `Clínica Geral: ${generalGoal}`;
      customQuestions.push({ question: 'Motivo do atendimento', answer: generalGoal });
    } else {
      serviceLabel = 'Outro Serviço';
      customQuestions.push({ question: 'Descrição do caso', answer: customBrief });
    }

    onNewLeadCreated(
      leadName,
      leadPhone,
      serviceLabel,
      leadEmail,
      actualWhatsapp,
      leadMessage,
      customQuestions,
      attachedFiles
    );
    
    setFormSubmitted(true);
  };

  return (
    <div className="bg-nude-warm text-green-deep font-sans selection:bg-gold-champagne selection:text-green-deep pb-20">
      
      {/* Floating CMS Control Panel Dock */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-brand-dark/95 backdrop-blur-md border border-white/10 px-6 py-4 flex items-center gap-6 shadow-2xl rounded-full">
        <div className="flex items-center gap-3">
          <div className={`w-2.5 h-2.5 rounded-full ${isEditMode ? 'bg-amber-400 animate-pulse' : 'bg-emerald-400'}`} />
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white whitespace-nowrap">
            {isEditMode ? 'Modo de Edição Ativo' : 'Modo de Leitura'}
          </span>
        </div>
        <div className="h-4 w-[1px] bg-white/10" />
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsEditMode(!isEditMode)}
            className={`px-4 py-2 font-bold text-[9px] tracking-widest uppercase transition-all rounded-full flex items-center gap-2 cursor-pointer ${
              isEditMode 
                ? 'bg-gold-champagne text-brand-dark' 
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            {isEditMode ? <Settings className="w-3 h-3 animate-spin" /> : <Edit className="w-3 h-3" />}
            {isEditMode ? 'Visualizar Site' : 'Editar Textos & Fotos'}
          </button>
          
          <button
            onClick={resetToDefault}
            className="p-2.5 bg-white/5 hover:bg-white/10 text-white border border-white/15 hover:border-white/25 rounded-full transition-all flex items-center justify-center cursor-pointer"
            title="Restaurar originais"
          >
            <RotateCcw className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* 1. Header (Premium Navigation) */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-neutral-100 py-4 px-6 md:px-12 transition-all duration-300 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Brand Logo */}
          <a href="#" className="hover:opacity-90 transition-opacity">
            <BrandLogoHorizontal />
          </a>

          {/* Desktop Links */}
          <nav className="hidden lg:flex items-center gap-6 xl:gap-8 text-[11px] font-bold tracking-[0.2em] uppercase text-neutral-600">
            <a href="#sobre" className="hover:text-brand-wine transition-colors">Sobre</a>
            <a href="#clinica" className="hover:text-brand-wine transition-colors">Estrutura</a>
            <a href="#servicos" className="hover:text-brand-wine transition-colors">Serviços</a>
            <a href="#resultados" className="hover:text-brand-wine transition-colors">Resultados</a>
            <a href="#depoimentos" className="hover:text-brand-wine transition-colors">Opiniões</a>
            <a href="#blog" className="hover:text-brand-wine transition-colors">Blog</a>
            <a href="#contato" className="hover:text-brand-wine transition-colors">Contato</a>
          </nav>

          {/* Action CTAs (Desktop) */}
          <div className="hidden lg:flex items-center gap-4">
            {/* WhatsApp CTA */}
            <a 
              href="https://wa.me/5511995349751" 
              target="_blank" 
              rel="noreferrer" 
              className="px-4 py-2.5 border border-emerald-500/20 text-emerald-700 hover:bg-emerald-50 bg-emerald-50/30 font-bold text-[10px] tracking-widest uppercase flex items-center gap-2 transition-all duration-300"
            >
              <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
              WhatsApp
            </a>

            {/* Agendar Consulta CTA */}
            <a 
              href="#contato"
              className="px-5 py-2.5 bg-brand-wine text-white border border-brand-wine hover:bg-brand-wine-dark transition-all text-[10px] font-bold tracking-widest uppercase"
            >
              Agendar consulta
            </a>
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-neutral-700 hover:text-brand-wine transition-colors cursor-pointer"
            aria-label="Abrir Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu Drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="lg:hidden overflow-hidden bg-white mt-4 border-t border-neutral-100"
            >
              <div className="py-6 flex flex-col gap-6">
                <nav className="flex flex-col gap-3 text-xs font-semibold tracking-widest uppercase text-neutral-600">
                  <a href="#sobre" onClick={() => setMobileMenuOpen(false)} className="hover:text-brand-wine py-2 border-b border-neutral-100/60 transition-colors">Sobre</a>
                  <a href="#clinica" onClick={() => setMobileMenuOpen(false)} className="hover:text-brand-wine py-2 border-b border-neutral-100/60 transition-colors">Estrutura</a>
                  <a href="#servicos" onClick={() => setMobileMenuOpen(false)} className="hover:text-brand-wine py-2 border-b border-neutral-100/60 transition-colors">Serviços</a>
                  <a href="#resultados" onClick={() => setMobileMenuOpen(false)} className="hover:text-brand-wine py-2 border-b border-neutral-100/60 transition-colors">Resultados</a>
                  <a href="#depoimentos" onClick={() => setMobileMenuOpen(false)} className="hover:text-brand-wine py-2 border-b border-neutral-100/60 transition-colors">Opiniões</a>
                  <a href="#blog" onClick={() => setMobileMenuOpen(false)} className="hover:text-brand-wine py-2 border-b border-neutral-100/60 transition-colors">Blog</a>
                  <a href="#contato" onClick={() => setMobileMenuOpen(false)} className="hover:text-brand-wine py-2 border-b border-neutral-100/60 transition-colors">Contato</a>
                </nav>
                
                {/* Action CTAs in Mobile Menu */}
                <div className="flex flex-col gap-3 pt-2">
                  <a 
                    href="#contato"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full py-3.5 bg-brand-wine text-white font-bold text-xs tracking-widest uppercase flex items-center justify-center gap-2 rounded-none hover:bg-brand-wine-dark transition-all"
                  >
                    <Calendar className="w-4 h-4" />
                    Agendar consulta
                  </a>
                  <a 
                    href="https://wa.me/5511995349751"
                    target="_blank"
                    rel="noreferrer"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full py-3.5 border border-emerald-500/20 bg-emerald-50/30 text-emerald-800 font-bold text-xs tracking-widest uppercase flex items-center justify-center gap-2 rounded-none hover:bg-emerald-100 transition-all"
                  >
                    <MessageSquare className="w-4 h-4 text-emerald-600" />
                    Falar no WhatsApp
                  </a>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* 2. Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-neutral-50 to-white border-b border-neutral-200">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center py-12 md:py-20 lg:py-24 px-6 md:px-12 lg:px-16">
          
          {/* Hero Copywriting (Left Content) */}
          <div className="lg:col-span-7 flex flex-col justify-center bg-transparent">
            <div className="max-w-xl">
              <div className="inline-block px-3 py-1 mb-6 border border-brand-wine/10 text-[10px] font-bold tracking-[0.25em] uppercase text-brand-wine rounded-none bg-brand-wine/5">
                <EditableText id="heroBadge" value={siteContent?.heroBadge || ""} onChange={(val) => updateField('heroBadge', val)} isEditMode={isEditMode} />
              </div>
              
              <EditableText 
                id="heroTitle" 
                value={siteContent?.heroTitle || ""} 
                onChange={(val) => updateField('heroTitle', val)} 
                isEditMode={isEditMode} 
                as="h1" 
                className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-[54px] text-brand-wine tracking-tight leading-[1.12] mb-6 font-light uppercase" 
              />

              <EditableText 
                id="heroSubtitle" 
                value={siteContent?.heroSubtitle || ""} 
                onChange={(val) => updateField('heroSubtitle', val)} 
                isEditMode={isEditMode} 
                as="p" 
                className="text-sm md:text-base text-taupe leading-relaxed font-light mb-8 max-w-lg block" 
                multiline 
              />

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <a 
                  href="#contato"
                  className="flex-1 py-4 bg-brand-wine text-white font-bold text-[11px] tracking-widest uppercase flex items-center justify-center gap-3 rounded-none border border-brand-wine hover:bg-brand-wine-dark transition-all shadow-md hover:shadow-lg"
                >
                  <Calendar className="w-4 h-4" />
                  <EditableText id="heroCta1" value={siteContent?.heroCta1 || ""} onChange={(val) => updateField('heroCta1', val)} isEditMode={isEditMode} />
                </a>
                <a 
                  href="https://wa.me/5511995349751" 
                  target="_blank" 
                  rel="noreferrer"
                  className="flex-1 py-4 border border-emerald-500/20 bg-emerald-50/20 text-emerald-800 font-bold text-[11px] tracking-widest uppercase flex items-center justify-center gap-2 rounded-none hover:bg-emerald-50 transition-all shadow-sm"
                >
                  <MessageSquare className="w-4 h-4 text-emerald-600" />
                  <EditableText id="heroCta2" value={siteContent?.heroCta2 || ""} onChange={(val) => updateField('heroCta2', val)} isEditMode={isEditMode} />
                </a>
              </div>

              {/* Quick trust metrics */}
              <div className="grid grid-cols-3 gap-4 pt-8 border-t border-neutral-200/60 mt-12 max-w-lg">
                <div>
                  <EditableText id="heroMetric1Value" value={siteContent?.heroMetric1Value || ""} onChange={(val) => updateField('heroMetric1Value', val)} isEditMode={isEditMode} as="span" className="block font-serif text-xl md:text-2xl font-light text-brand-wine" />
                  <EditableText id="heroMetric1Label" value={siteContent?.heroMetric1Label || ""} onChange={(val) => updateField('heroMetric1Label', val)} isEditMode={isEditMode} as="span" className="text-[9px] text-neutral-400 font-bold uppercase tracking-widest block mt-1" />
                </div>
                <div>
                  <EditableText id="heroMetric2Value" value={siteContent?.heroMetric2Value || ""} onChange={(val) => updateField('heroMetric2Value', val)} isEditMode={isEditMode} as="span" className="block font-serif text-xl md:text-2xl font-light text-brand-wine" />
                  <EditableText id="heroMetric2Label" value={siteContent?.heroMetric2Label || ""} onChange={(val) => updateField('heroMetric2Label', val)} isEditMode={isEditMode} as="span" className="text-[9px] text-neutral-400 font-bold uppercase tracking-widest block mt-1" />
                </div>
                <div>
                  <EditableText id="heroMetric3Value" value={siteContent?.heroMetric3Value || ""} onChange={(val) => updateField('heroMetric3Value', val)} isEditMode={isEditMode} as="span" className="block font-serif text-xl md:text-2xl font-light text-brand-wine" />
                  <EditableText id="heroMetric3Label" value={siteContent?.heroMetric3Label || ""} onChange={(val) => updateField('heroMetric3Label', val)} isEditMode={isEditMode} as="span" className="text-[9px] text-neutral-400 font-bold uppercase tracking-widest block mt-1" />
                </div>
              </div>
            </div>
          </div>

          {/* Hero Right Visual / Portrait Panel */}
          <div className="lg:col-span-5 relative flex items-center justify-center bg-transparent">
            {/* Elegant luxury framing */}
            <div className="relative w-full max-w-sm aspect-[4/5] bg-neutral-100 border border-neutral-200/60 shadow-2xl overflow-hidden rounded-none group">
              <EditableImage 
                src={siteContent?.heroImageUrl || ""} 
                alt="Clínica Odontológica Dra Claudia França" 
                onChange={(val) => updateField('heroImageUrl', val)}
                isEditMode={isEditMode}
                className="absolute inset-0 w-full h-full object-cover filter brightness-100 hover:scale-[1.03] transition-all duration-700 ease-out"
              />
              
              {/* Discrete premium watermark label instead of heavy text overlays */}
              <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3.5 py-1.5 border-l-2 border-brand-wine text-[9px] font-bold tracking-widest uppercase text-brand-wine shadow-sm z-20">
                Espaço Cambuci, SP
              </div>

              {/* Floating trust badge at the bottom of the photo */}
              <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-md p-3.5 shadow-lg flex items-center gap-3 border border-neutral-100 z-20">
                <div className="text-brand-wine text-xl font-serif">4.9</div>
                <div className="h-6 w-[1px] bg-neutral-200"></div>
                <div>
                  <div className="flex text-amber-500 text-[8px] mb-0.5">★★★★★</div>
                  <div className="text-[8px] uppercase tracking-wider font-bold text-neutral-400">Google Reviews</div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 3. Sobre a Dra. Claudia França */}
      <section id="sobre" className="py-20 md:py-28 px-4 md:px-8 bg-white border-b border-neutral-200">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Doctor Portrait Image */}
          <div className="lg:col-span-5 relative pr-4 pb-4">
            <div className="w-full aspect-square md:aspect-[4/5] rounded-none overflow-hidden shadow-2xl border-[12px] border-neutral-100 bg-white">
              <EditableImage 
                src={siteContent?.bioImageUrl || ""} 
                alt="Dra. Claudia França" 
                onChange={(val) => updateField('bioImageUrl', val)}
                isEditMode={isEditMode}
                className="w-full h-full object-cover"
              />
            </div>
            {/* Circular Submarca rotating seal overlapping portrait */}
            <div className="absolute -bottom-6 -right-2 w-32 h-32 md:w-40 md:h-40 z-20 bg-white rounded-full p-2 shadow-2xl border border-neutral-200/50 flex items-center justify-center">
              <BrandSubmarca className="w-full h-full" />
            </div>
            {/* CRO Overlay card */}
            <div className="absolute top-6 right-6 bg-green-deep text-white px-4 py-2 rounded-none text-[10px] font-mono tracking-widest shadow-md uppercase font-semibold border border-white/10 z-10">
              <EditableText id="bioCro" value={siteContent?.bioCro || ""} onChange={(val) => updateField('bioCro', val)} isEditMode={isEditMode} />
            </div>
          </div>

          {/* Doctor Bio and Legacy Copy */}
          <div className="lg:col-span-7 space-y-6">
            <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-green-deep block opacity-60">
              <EditableText id="bioBadge" value={siteContent?.bioBadge || ""} onChange={(val) => updateField('bioBadge', val)} isEditMode={isEditMode} />
            </span>
            <EditableText id="bioTitle" value={siteContent?.bioTitle || ""} onChange={(val) => updateField('bioTitle', val)} isEditMode={isEditMode} as="h2" className="font-serif text-3xl md:text-4xl text-green-deep font-light uppercase tracking-wide block" />
            
            <EditableText id="bioText1" value={siteContent?.bioText1 || ""} onChange={(val) => updateField('bioText1', val)} isEditMode={isEditMode} as="p" className="text-sm text-taupe leading-relaxed font-light block" multiline />

            <EditableText id="bioText2" value={siteContent?.bioText2 || ""} onChange={(val) => updateField('bioText2', val)} isEditMode={isEditMode} as="p" className="text-sm text-taupe leading-relaxed font-light block" multiline />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6 border-t border-neutral-200">
              <div className="flex gap-4 items-start">
                <div className="w-6 h-6 bg-gold-champagne flex items-center justify-center text-green-deep shrink-0 mt-0.5">
                  <Check className="w-4 h-4" />
                </div>
                <div>
                  <EditableText id="bioCardTitle" value={siteContent?.bioCardTitle || ""} onChange={(val) => updateField('bioCardTitle', val)} isEditMode={isEditMode} as="h4" className="text-xs font-bold text-green-deep uppercase tracking-wider block" />
                  <EditableText id="bioCardText" value={siteContent?.bioCardText || ""} onChange={(val) => updateField('bioCardText', val)} isEditMode={isEditMode} as="p" className="text-[11px] text-taupe leading-relaxed font-light block" multiline />
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="w-6 h-6 bg-gold-champagne flex items-center justify-center text-green-deep shrink-0 mt-0.5">
                  <Check className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-green-deep uppercase tracking-wider">Inovação e Tecnologia</h4>
                  <p className="text-[11px] text-taupe leading-relaxed font-light">Uso de softwares e planejadores 3D para antecipar resultados estéticos faciais.</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Nossa Clínica (Virtual Gallery & Architectural Tour) */}
      <section id="clinica" className="py-20 md:py-28 px-4 md:px-8 bg-nude-warm/40 border-b border-neutral-200">
        <div className="max-w-7xl mx-auto space-y-12">
          
          <div className="text-center max-w-xl mx-auto space-y-3">
            <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-green-deep block opacity-60">Tour Virtual</span>
            <EditableText id="spacesTitle" value={siteContent?.spacesTitle || ""} onChange={(val) => updateField('spacesTitle', val)} isEditMode={isEditMode} as="h2" className="font-serif text-3xl md:text-4xl text-green-deep font-light uppercase tracking-wider block" />
            <EditableText id="spacesSubtitle" value={siteContent?.spacesSubtitle || ""} onChange={(val) => updateField('spacesSubtitle', val)} isEditMode={isEditMode} as="p" className="text-xs text-taupe leading-relaxed font-light block" multiline />
          </div>

          {/* Interactive Spaces Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {(siteContent?.clinicSpaces || CLINIC_SPACES).map((space) => (
              <motion.div 
                key={space.id}
                whileHover={{ y: -6 }}
                className="bg-white border border-neutral-200/80 flex flex-col group rounded-none overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
              >
                <div className="aspect-[4/3] w-full overflow-hidden relative">
                  <EditableImage 
                    src={space.imageUrl} 
                    alt={space.title}
                    onChange={(val) => updateClinicSpace(space.id, { imageUrl: val })}
                    isEditMode={isEditMode}
                    className="w-full h-full object-cover filter brightness-95 group-hover:scale-105 transition-all duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/60 via-transparent to-transparent opacity-80 pointer-events-none" />
                  <span className="absolute bottom-4 left-4 bg-gold-champagne text-green-deep font-sans text-[8.5px] font-bold tracking-widest uppercase px-2.5 py-1">
                    Exclusivo
                  </span>
                </div>
                
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <h3 className="font-serif text-lg text-green-deep font-medium group-hover:text-brand-wine-light transition-colors block">
                      <EditableText id={space.id + 'title'} value={space.title} onChange={(val) => updateClinicSpace(space.id, { title: val })} isEditMode={isEditMode} as="span" />
                    </h3>
                    <p className="text-[11px] text-taupe leading-relaxed font-light block">
                      <EditableText id={space.id + 'desc'} value={space.description} onChange={(val) => updateClinicSpace(space.id, { description: val })} isEditMode={isEditMode} as="span" multiline />
                    </p>
                  </div>
                  
                  <button 
                    onClick={() => setSelectedClinicSpace(space)}
                    className="flex items-center gap-1.5 text-[9px] font-bold tracking-widest uppercase text-brand-wine-light hover:text-green-deep transition-colors pt-2 border-t border-neutral-100 w-full text-left cursor-pointer"
                  >
                    Ver Detalhes do Espaço <span>➔</span>
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Expanded Clinic Space Modal */}
      <AnimatePresence>
        {selectedClinicSpace && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 bg-brand-dark/80 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-none shadow-2xl border border-neutral-200 flex flex-col md:flex-row"
            >
              {/* Image side */}
              <div className="md:w-1/2 relative bg-neutral-900 min-h-[250px] md:min-h-[400px]">
                <EditableImage 
                  src={selectedClinicSpace.imageUrl} 
                  alt={selectedClinicSpace.title} 
                  onChange={(val) => {
                    updateClinicSpace(selectedClinicSpace.id, { imageUrl: val });
                    setSelectedClinicSpace(prev => prev ? { ...prev, imageUrl: val } : null);
                  }}
                  isEditMode={isEditMode}
                  className="absolute inset-0 w-full h-full object-cover filter brightness-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent md:bg-gradient-to-r md:from-transparent md:via-black/20 md:to-black/80 pointer-events-none"></div>
                <div className="absolute bottom-6 left-6 right-6 md:hidden">
                  <span className="text-[9px] font-bold tracking-widest uppercase text-gold-champagne bg-brand-wine px-2 py-1">Espaço Clínico</span>
                  <h3 className="font-serif text-2xl text-white uppercase tracking-wider mt-2">{selectedClinicSpace.title}</h3>
                </div>
              </div>

              {/* Text side */}
              <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-between space-y-8 relative">
                {/* Close Button */}
                <button 
                  onClick={() => setSelectedClinicSpace(null)}
                  className="absolute top-6 right-6 w-8 h-8 flex items-center justify-center bg-neutral-50 hover:bg-neutral-100 border border-neutral-200 text-green-deep hover:text-brand-wine transition-colors cursor-pointer rounded-none"
                >
                  <X className="w-4 h-4" />
                </button>

                <div className="space-y-6">
                  <div className="hidden md:block space-y-1.5">
                    <span className="text-[9px] font-bold tracking-[0.25em] uppercase text-brand-wine-light/80 block">Infraestrutura Premium</span>
                    <h3 className="font-serif text-2xl md:text-3xl text-green-deep font-light uppercase tracking-wider">
                      <EditableText 
                        id={selectedClinicSpace.id + 'modalTitle'} 
                        value={selectedClinicSpace.title} 
                        onChange={(val) => {
                          updateClinicSpace(selectedClinicSpace.id, { title: val });
                          setSelectedClinicSpace(prev => prev ? { ...prev, title: val } : null);
                        }} 
                        isEditMode={isEditMode} 
                        as="span" 
                      />
                    </h3>
                  </div>

                  <div className="h-1 w-12 bg-gold-champagne"></div>

                  <p className="text-xs text-taupe leading-relaxed font-light">
                    <EditableText 
                      id={selectedClinicSpace.id + 'modalDetails'} 
                      value={selectedClinicSpace.details} 
                      onChange={(val) => {
                        updateClinicSpace(selectedClinicSpace.id, { details: val });
                        setSelectedClinicSpace(prev => prev ? { ...prev, details: val } : null);
                      }} 
                      isEditMode={isEditMode} 
                      as="span" 
                      multiline 
                    />
                  </p>

                  <div className="space-y-3 pt-2">
                    <div className="flex gap-3 items-center">
                      <div className="w-1.5 h-1.5 bg-brand-wine-light rounded-none shrink-0" />
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-green-deep">Padrão Ouro de Biossegurança</span>
                    </div>
                    <div className="flex gap-3 items-center">
                      <div className="w-1.5 h-1.5 bg-brand-wine-light rounded-none shrink-0" />
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-green-deep">Materiais e Insumos Importados</span>
                    </div>
                    <div className="flex gap-3 items-center">
                      <div className="w-1.5 h-1.5 bg-brand-wine-light rounded-none shrink-0" />
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-green-deep">Atendimento VIP Personalizado</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-neutral-100 flex items-center justify-between">
                  <span className="text-[9px] text-taupe uppercase tracking-wider font-semibold opacity-60">Cambuci, São Paulo</span>
                  <button 
                    onClick={() => setSelectedClinicSpace(null)}
                    className="px-6 py-3 bg-green-deep text-white hover:bg-brand-wine-dark transition-all text-xs font-semibold tracking-widest uppercase rounded-none"
                  >
                    Fechar Detalhes
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 4. Especialidades / Serviços (With Interactive Details) */}
      <section id="servicos" className="py-20 md:py-28 px-4 md:px-8 bg-white border-b border-neutral-200">
        <div className="max-w-7xl mx-auto space-y-12">
          
          <div className="text-center max-w-xl mx-auto space-y-3">
            <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-green-deep block opacity-60">Especialidades Premium</span>
            <h2 className="font-serif text-3xl md:text-4xl text-green-deep font-light uppercase tracking-wider">Áreas de Atuação Exclusiva</h2>
            <p className="text-xs text-taupe leading-relaxed font-light">Explore as modalidades exclusivas assinadas pela Dra. Claudia França para transformar o seu sorriso com excelência técnica e sensibilidade.</p>
          </div>

          {/* Category Filter Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 border-b border-neutral-100 pb-8 max-w-4xl mx-auto">
            {[
              { id: 'todas', label: 'Todas as Áreas' },
              { id: 'harmonizacao', label: 'Harmonização Orofacial' },
              { id: 'implantodontia', label: 'Implantodontia' },
              { id: 'ortodontia', label: 'Ortodontia Digital' },
              { id: 'clinica_geral', label: 'Clínica Geral' },
              { id: 'estetica_reabilitacao', label: 'Estética & Reabilitação' }
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveServiceCategory(cat.id)}
                className={`px-5 py-2.5 text-[9px] font-bold tracking-widest uppercase transition-all border cursor-pointer rounded-none ${
                  activeServiceCategory === cat.id
                    ? 'bg-green-deep text-white border-green-deep shadow-md'
                    : 'bg-white text-green-deep border-neutral-200 hover:border-green-deep/50 hover:bg-neutral-50'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Grid Layout of services styled as Services Ribbon */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 border border-neutral-200 bg-white gap-0">
            {INITIAL_SERVICES
              .filter(srv => {
                if (activeServiceCategory === 'todas') return true;
                if (activeServiceCategory === 'estetica_reabilitacao') {
                  return srv.category === 'estetica' || srv.category === 'reabilitacao';
                }
                return srv.category === activeServiceCategory;
              })
              .map((srv, index) => (
              <div 
                key={srv.id}
                onClick={() => setSelectedService(srv)}
                className="bg-brand-off-white p-8 border-b lg:border-b-0 lg:border-r last:border-r-0 border-neutral-200 hover:bg-brand-nude/40 transition-all duration-300 cursor-pointer flex flex-col justify-between group rounded-none relative overflow-hidden"
              >
                {/* Visual hover border indicator */}
                <div className="absolute top-0 left-0 w-full h-[3px] bg-brand-wine scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />

                <div className="space-y-6">
                  <span className="text-[10px] font-bold text-brand-wine-light/50 uppercase tracking-[0.25em] block font-mono">
                    PRODUTO 0{index + 1}
                  </span>
                  <div className="w-12 h-12 rounded-none bg-brand-dourado-acetinado/10 border border-brand-dourado-acetinado/25 flex items-center justify-center text-brand-dourado-acetinado group-hover:bg-brand-wine group-hover:text-brand-gold group-hover:border-brand-wine transition-all duration-300">
                    {/* Render different icon depending on treatment group */}
                    {srv.id.includes('harmonizacao') ? <Sparkles className="w-5 h-5 stroke-[1.25]" /> :
                     srv.id.includes('implante') ? <Award className="w-5 h-5 stroke-[1.25]" /> :
                     srv.id.includes('ortodontia') ? <ArrowLeftRight className="w-5 h-5 stroke-[1.25]" /> : <Heart className="w-5 h-5 stroke-[1.25]" />}
                  </div>
                  <div>
                    <h3 className="font-serif font-light tracking-widest text-brand-wine text-sm mb-2 uppercase group-hover:text-brand-wine-dark transition-colors">{srv.name}</h3>
                    <p className="text-xs text-brand-taupe leading-relaxed font-light line-clamp-3">{srv.shortDescription}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-neutral-200/60 pt-4 mt-6 text-[9px] font-bold tracking-[0.2em] uppercase text-brand-wine/70 group-hover:text-brand-wine-dark transition-colors">
                  <span>Explorar Tratamento ➔</span>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* SERVICE MODAL DETAILS */}
      <AnimatePresence>
        {selectedService && (
          <div className="fixed inset-0 bg-neutral-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="bg-white w-full max-w-2xl rounded-none border border-neutral-200 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col text-xs"
            >
              {/* Header */}
              <div className="bg-green-deep text-white px-6 py-5 flex items-center justify-between border-b border-neutral-850">
                <div>
                  <span className="text-[10px] font-bold tracking-widest text-gold-champagne uppercase block">Especialidade Médica</span>
                  <h3 className="font-serif text-base md:text-lg uppercase tracking-wide">{selectedService.name}</h3>
                </div>
                <button 
                  onClick={() => setSelectedService(null)}
                  className="text-white hover:text-gold-champagne p-2 rounded-none bg-white/10 hover:bg-white/20 transition-all cursor-pointer border border-white/10"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Modal Body scrollable */}
              <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
                
                {/* Description */}
                <div className="space-y-1.5">
                  <h4 className="font-serif text-sm text-green-deep font-semibold uppercase tracking-wider">O que é o procedimento?</h4>
                  <p className="text-xs text-taupe leading-relaxed font-light">{selectedService.fullDescription}</p>
                </div>

                {/* Benefits */}
                <div className="space-y-2">
                  <h4 className="font-serif text-sm text-green-deep font-semibold uppercase tracking-wider">Benefícios Exclusivos:</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {selectedService.benefits.map((benefit, i) => (
                      <div key={i} className="flex gap-3 items-start text-xs text-taupe font-light">
                        <div className="w-5 h-5 bg-neutral-100 flex items-center justify-center text-green-deep shrink-0 mt-0.5">
                          <Check className="w-3.5 h-3.5" />
                        </div>
                        <span>{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Indications */}
                <div className="space-y-2">
                  <h4 className="font-serif text-sm text-green-deep font-semibold uppercase tracking-wider">Para quem é indicado?</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {selectedService.indications.map((ind, i) => (
                      <div key={i} className="flex gap-3 items-start text-xs text-taupe font-light">
                        <div className="w-5 h-5 bg-neutral-100 flex items-center justify-center text-green-deep shrink-0 mt-0.5 font-bold">
                          •
                        </div>
                        <span>{ind}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Contraindications */}
                {selectedService.contraindications && selectedService.contraindications.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-serif text-sm text-brand-wine font-semibold uppercase tracking-wider">Contraindicações:</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {selectedService.contraindications.map((contra, i) => (
                        <div key={i} className="flex gap-3 items-start text-xs text-taupe font-light">
                          <div className="w-5 h-5 bg-red-50 flex items-center justify-center text-brand-wine shrink-0 mt-0.5 font-bold">
                            ✕
                          </div>
                          <span>{contra}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Average Time and Recovery Info block */}
                {(selectedService.averageTime || selectedService.recovery) && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-brand-beige p-4 border border-brand-beige-dark/50">
                    {selectedService.averageTime && (
                      <div className="space-y-1">
                        <span className="text-[9px] uppercase tracking-wider font-bold text-brand-wine block">🕒 Tempo Médio:</span>
                        <p className="text-xs text-taupe font-light leading-relaxed">{selectedService.averageTime}</p>
                      </div>
                    )}
                    {selectedService.recovery && (
                      <div className="space-y-1">
                        <span className="text-[9px] uppercase tracking-wider font-bold text-brand-wine block">✨ Recuperação:</span>
                        <p className="text-xs text-taupe font-light leading-relaxed">{selectedService.recovery}</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Price tag simulator */}
                <div className="bg-nude-warm border border-neutral-200 p-4 rounded-none flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-green-deep uppercase tracking-wider block font-bold">Investimento Estimado:</span>
                    <span className="text-[10px] text-taupe font-light">Valor exato definido sob planejamento anatômico.</span>
                  </div>
                  <span className="font-serif text-sm font-bold text-green-deep uppercase tracking-wider bg-gold-champagne px-3 py-1 border border-green-deep/10">{selectedService.priceEstimate}</span>
                </div>

                {/* FAQs */}
                <div className="space-y-3">
                  <h4 className="font-serif text-sm text-green-deep font-semibold uppercase tracking-wider">Perguntas Frequentes (FAQs):</h4>
                  <div className="space-y-3">
                    {selectedService.faqs.map((faq, i) => (
                      <div key={i} className="bg-white p-4 rounded-none border border-neutral-200 space-y-1">
                        <p className="font-bold text-green-deep flex items-start gap-2 uppercase tracking-wide text-[10px]">
                          <span className="w-4 h-4 bg-gold-champagne flex items-center justify-center text-green-deep rounded-none text-[9px] font-bold shrink-0">?</span>
                          {faq.question}
                        </p>
                        <p className="text-taupe leading-relaxed font-light pl-6">{faq.answer}</p>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* Footer */}
              <div className="bg-neutral-50 px-6 py-4 border-t border-neutral-200 flex items-center justify-between">
                <span className="text-[10px] text-taupe uppercase tracking-wider font-semibold opacity-60">Atendimento em Cambuci, São Paulo</span>
                <a 
                  href="#contato"
                  onClick={() => setSelectedService(null)}
                  className="px-6 py-3 bg-brand-wine text-white hover:bg-brand-dark border border-brand-wine transition-all text-xs font-semibold tracking-widest uppercase rounded-none"
                >
                  {selectedService.ctaText || "Quero Agendar Avaliação"}
                </a>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 5. Patient Results (Dynamic Before & After Comparison Slider!) */}
      <section id="resultados" className="py-20 md:py-28 px-4 md:px-8 bg-white border-b border-neutral-200">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Slider Copywriting */}
          <div className="lg:col-span-5 space-y-6">
            <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-green-deep block opacity-60">Galeria de Transformação</span>
            <EditableText id="resultsTitle" value={siteContent?.resultsTitle || ""} onChange={(val) => updateField('resultsTitle', val)} isEditMode={isEditMode} as="h2" className="font-serif text-3xl md:text-4xl text-green-deep font-light uppercase tracking-wider block" />
            <EditableText id="resultsSubtitle" value={siteContent?.resultsSubtitle || ""} onChange={(val) => updateField('resultsSubtitle', val)} isEditMode={isEditMode} as="p" className="text-sm text-taupe leading-relaxed font-light block" multiline />

            <div className="space-y-4 pt-2">
              <div className="flex gap-3 items-center">
                <div className="w-2.5 h-2.5 bg-gold-champagne border border-green-deep/20 rounded-none shrink-0" />
                <span className="text-xs font-semibold uppercase tracking-wider text-green-deep">Sorriso natural e simétrico</span>
              </div>
              <div className="flex gap-3 items-center">
                <div className="w-2.5 h-2.5 bg-gold-champagne border border-green-deep/20 rounded-none shrink-0" />
                <span className="text-xs font-semibold uppercase tracking-wider text-green-deep">Harmonia labial integrada</span>
              </div>
              <div className="flex gap-3 items-center">
                <div className="w-2.5 h-2.5 bg-gold-champagne border border-green-deep/20 rounded-none shrink-0" />
                <span className="text-xs font-semibold uppercase tracking-wider text-green-deep">Estética de alta longevidade</span>
              </div>
            </div>
          </div>

          {/* BEFORE / AFTER SLIDER ELEMENT */}
          <div className="lg:col-span-7">
            {isEditMode && (
              <div className="bg-neutral-50 border border-neutral-200 p-4 mb-4 flex flex-col sm:flex-row gap-4 items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-green-deep uppercase tracking-wider text-[10px]">Editor do Simulador:</span>
                </div>
                <div className="flex gap-3">
                  <div className="w-24 h-8 relative">
                    <EditableImage 
                      src={siteContent?.beforeImageUrl || ""} 
                      alt="Antes" 
                      onChange={(val) => updateField('beforeImageUrl', val)} 
                      isEditMode={isEditMode}
                      className="w-full h-full object-cover text-[8px]"
                    />
                    <div className="absolute -top-4 left-0 text-[8px] text-neutral-400 font-bold uppercase tracking-widest">Imagem Antes</div>
                  </div>
                  <div className="w-24 h-8 relative">
                    <EditableImage 
                      src={siteContent?.afterImageUrl || ""} 
                      alt="Depois" 
                      onChange={(val) => updateField('afterImageUrl', val)} 
                      isEditMode={isEditMode}
                      className="w-full h-full object-cover text-[8px]"
                    />
                    <div className="absolute -top-4 left-0 text-[8px] text-neutral-400 font-bold uppercase tracking-widest">Imagem Depois</div>
                  </div>
                </div>
              </div>
            )}

            <div 
              className="relative w-full aspect-[4/3] rounded-none overflow-hidden shadow-2xl border-[12px] border-neutral-100 select-none cursor-ew-resize bg-neutral-900"
              onMouseMove={handleMouseMove}
              onTouchMove={handleTouchMove}
              onMouseDown={() => setIsDragging(true)}
              onMouseUp={() => setIsDragging(false)}
              onMouseLeave={() => setIsDragging(false)}
            >
              {/* BEFORE IMAGE (Bottom Layer) */}
              <img 
                src={siteContent?.beforeImageUrl || ""} 
                alt="Sorriso Planejado (Antes)" 
                className="absolute inset-0 w-full h-full object-cover pointer-events-none"
              />
              <div className="absolute bottom-4 left-4 bg-red-600/90 border border-white/20 text-white px-3 py-1.5 rounded-none text-[9px] font-mono font-bold uppercase tracking-widest">
                Antes (Simulação)
              </div>

              {/* AFTER IMAGE (Top Layer cropped) */}
              <div 
                className="absolute inset-y-0 left-0 overflow-hidden pointer-events-none"
                style={{ width: `${sliderPosition}%` }}
              >
                <img 
                  src={siteContent?.afterImageUrl || ""} 
                  alt="Sorriso Finalizado (Depois)" 
                  className="absolute inset-0 w-[100vw] h-full object-cover max-w-none pointer-events-none"
                  style={{ width: '100%' }}
                />
                <div className="absolute bottom-4 left-4 bg-green-deep/90 border border-white/20 text-white px-3 py-1.5 rounded-none text-[9px] font-mono font-bold uppercase tracking-widest whitespace-nowrap">
                  Depois (Sorriso Real)
                </div>
              </div>

              {/* DRAG BAR DIVIDER */}
              <div 
                className="absolute inset-y-0 w-1 bg-white cursor-ew-resize flex items-center justify-center pointer-events-none"
                style={{ left: `${sliderPosition}%` }}
              >
                <div className="w-8 h-8 rounded-none bg-white shadow-xl border border-neutral-300 flex items-center justify-center text-green-deep text-xs font-bold font-mono">
                  ↔
                </div>
              </div>
            </div>
            <p className="text-center text-[10px] uppercase tracking-wider font-semibold text-taupe mt-3 opacity-60">★ Clique e arraste para comparar o plano de tratamento</p>
          </div>

        </div>
      </section>

      {/* 6. Google Reviews Integration */}
      <section id="depoimentos" className="py-20 md:py-28 px-4 md:px-8 bg-nude-warm/20 border-b border-neutral-200">
        <div className="max-w-7xl mx-auto space-y-12">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-3 max-w-lg">
              <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-green-deep block opacity-60">Depoimentos Verificados</span>
              <h2 className="font-serif text-3xl md:text-4xl text-green-deep font-light uppercase tracking-wide">Opiniões de Pacientes</h2>
              <p className="text-xs text-taupe leading-relaxed font-light">Nossa excelência é traduzida no carinho e satisfação de quem confiou o sorriso e a autoimagem à Dra. Claudia.</p>
            </div>

            {/* Google Rating Overview box */}
            <div className="bg-white p-5 rounded-none border border-neutral-200 flex items-center gap-4 shrink-0 shadow-md">
              <div className="text-center border-r border-neutral-200 pr-4">
                <span className="text-3xl font-bold font-serif text-green-deep block">5.0</span>
                <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">Nota no Google</span>
              </div>
              <div>
                <div className="flex gap-1 text-amber-400">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
                </div>
                <p className="text-xs font-bold text-neutral-800 mt-1">124 avaliações físicas reais</p>
                <p className="text-[10px] text-neutral-400 font-semibold tracking-wider uppercase">Excelente em São Paulo, SP</p>
              </div>
            </div>
          </div>

          {/* Grid of Reviews */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {INITIAL_REVIEWS.map((rev) => (
              <div key={rev.id} className="bg-white p-6 rounded-none border border-neutral-200 shadow-sm space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-none bg-gold-champagne/40 border border-green-deep/10 flex items-center justify-center font-bold text-xs text-green-deep font-sans uppercase">
                    {rev.author.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-neutral-800 uppercase tracking-wide">{rev.author}</h4>
                    <span className="text-[9px] text-taupe bg-neutral-100 px-2 py-1 rounded-none font-semibold uppercase tracking-wider inline-block mt-1 border border-neutral-200/50">
                      Tratamento: {rev.treatment}
                    </span>
                  </div>
                </div>

                <div className="flex gap-0.5 text-amber-400">
                  {[...Array(rev.rating)].map((_, i) => <Star key={i} className="w-3.5 h-3.5 fill-current" />)}
                </div>

                <p className="text-xs text-taupe leading-relaxed italic font-light">
                  "{rev.text}"
                </p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 7. Blog (SEO Optimized, Interactive Details) */}
      <section id="blog" className="py-20 md:py-28 px-4 md:px-8 bg-white border-b border-neutral-200">
        <div className="max-w-7xl mx-auto space-y-12">
          
          <div className="text-center max-w-xl mx-auto space-y-3">
            <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-green-deep block opacity-60">Artigos & Novidades</span>
            <h2 className="font-serif text-3xl md:text-4xl text-green-deep font-light uppercase tracking-wide">Informativo Odontológico</h2>
            <p className="text-xs text-taupe leading-relaxed font-light">Leia nossos artigos e guias especializados, criados pela Dra. Claudia para desmistificar cuidados orofaciais e dentários.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {INITIAL_BLOG_POSTS.map((post) => (
              <div 
                key={post.id}
                onClick={() => setSelectedArticle(post)}
                className="bg-white rounded-none border border-neutral-200 shadow-sm hover:shadow-xl transition-all cursor-pointer flex flex-col justify-between group"
              >
                <div>
                  <div className="w-full aspect-[16/10] bg-neutral-200 overflow-hidden relative border-b border-neutral-200">
                    <img 
                      src={post.imageUrl || "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=400"} 
                      alt={post.title} 
                      className="w-full h-full object-cover filter brightness-95 group-hover:scale-105 transition-transform duration-500"
                    />
                    <span className="absolute top-4 left-4 bg-green-deep text-white text-[9px] font-mono tracking-widest px-3 py-1.5 rounded-none uppercase border border-white/20">
                      {post.category}
                    </span>
                  </div>
                  <div className="p-6 space-y-3">
                    <p className="text-[10px] text-taupe font-mono tracking-wider uppercase opacity-75">{post.date} • {post.readTime}</p>
                    <h3 className="text-sm font-bold text-green-deep leading-snug group-hover:text-gold-matte transition-colors uppercase tracking-wide">{post.title}</h3>
                    <p className="text-xs text-taupe line-clamp-3 leading-relaxed font-light">{post.excerpt}</p>
                  </div>
                </div>

                <div className="px-6 pb-6 pt-3 flex items-center gap-1.5 text-[10px] font-bold tracking-wider uppercase text-green-deep/75 group-hover:text-green-deep transition-colors border-t border-neutral-100 mt-4">
                  <span>Ler Artigo Completo ➔</span>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ARTICLE MODAL */}
      <AnimatePresence>
        {selectedArticle && (
          <div className="fixed inset-0 bg-neutral-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="bg-white w-full max-w-2xl rounded-none border border-neutral-200 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col text-xs"
            >
              {/* Header */}
              <div className="bg-green-deep text-white px-6 py-5 flex items-center justify-between border-b border-neutral-850">
                <div>
                  <span className="text-[10px] font-bold tracking-widest text-gold-champagne uppercase block">Categoria: {selectedArticle.category}</span>
                  <h3 className="font-serif text-sm md:text-base leading-snug uppercase tracking-wide">{selectedArticle.title}</h3>
                </div>
                <button 
                  onClick={() => setSelectedArticle(null)}
                  className="text-white hover:text-gold-champagne p-2 rounded-none bg-white/10 hover:bg-white/20 transition-all cursor-pointer border border-white/10"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Scrollable Body */}
              <div className="p-6 overflow-y-auto space-y-4 flex-1 text-xs">
                <img 
                  src={selectedArticle.imageUrl} 
                  alt={selectedArticle.title} 
                  className="w-full aspect-[16/9] object-cover rounded-none border border-neutral-200 mb-2"
                />

                <p className="text-[9px] text-taupe font-mono border-b border-neutral-200 pb-3 tracking-wider uppercase opacity-85">
                  Publicado por: <strong>Dra. Claudia França</strong> • Data: {selectedArticle.date} • Tempo de Leitura: {selectedArticle.readTime}
                </p>

                {/* Article content render */}
                <div className="space-y-3 text-xs text-taupe leading-relaxed font-light whitespace-pre-line">
                  {selectedArticle.content}
                </div>

                <div className="bg-neutral-50 p-4 rounded-none border border-neutral-200 mt-6">
                  <span className="font-bold text-green-deep block mb-2 uppercase tracking-wider text-[10px]">Tags de SEO Associadas:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedArticle.tags.map((kw) => (
                      <span key={kw} className="bg-white px-2.5 py-1 rounded-none text-[10px] text-taupe border border-neutral-200 shadow-sm uppercase font-mono tracking-wider">
                        #{kw}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="bg-neutral-50 px-6 py-4 border-t border-neutral-200 flex justify-end">
                <button 
                  onClick={() => setSelectedArticle(null)}
                  className="px-6 py-3 bg-green-deep text-white border border-green-deep hover:bg-white hover:text-green-deep transition-all text-xs font-semibold tracking-widest uppercase rounded-none"
                >
                  Fechar Artigo
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 8. Contact Section (Integrated Map & Interactive Lead Form) */}
      <section id="contato" className="py-20 md:py-28 px-4 md:px-8 bg-nude-warm/25 border-b border-neutral-200">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
          
          {/* Left Column: Clinic Contact Details & Map Visualizer */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-green-deep block opacity-60">Como nos encontrar</span>
              <EditableText id="contactTitle" value={siteContent?.contactTitle || ""} onChange={(val) => updateField('contactTitle', val)} isEditMode={isEditMode} as="h2" className="font-serif text-3xl md:text-4xl text-green-deep font-light uppercase tracking-wider block" />
              <EditableText id="contactSubtitle" value={siteContent?.contactSubtitle || ""} onChange={(val) => updateField('contactSubtitle', val)} isEditMode={isEditMode} as="p" className="text-xs text-taupe leading-relaxed font-light block" multiline />
            </div>

            {/* Direct Contact info list */}
            <div className="space-y-4 text-xs text-taupe">
              <div className="flex gap-4 items-center">
                <div className="w-9 h-9 rounded-none bg-gold-champagne/40 border border-green-deep/10 flex items-center justify-center text-green-deep shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-green-deep uppercase tracking-wider text-[10px]">Endereço Nobre:</h4>
                  <EditableText id="contactAddress" value={siteContent?.contactAddress || ""} onChange={(val) => updateField('contactAddress', val)} isEditMode={isEditMode} as="p" className="text-[11px] font-light mt-0.5 block" multiline />
                </div>
              </div>

              <div className="flex gap-4 items-center">
                <div className="w-9 h-9 rounded-none bg-gold-champagne/40 border border-green-deep/10 flex items-center justify-center text-green-deep shrink-0">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-green-deep uppercase tracking-wider text-[10px]">Telefone / WhatsApp:</h4>
                  <EditableText id="contactPhone" value={siteContent?.contactPhone || ""} onChange={(val) => updateField('contactPhone', val)} isEditMode={isEditMode} as="p" className="text-[11px] font-semibold text-green-deep mt-0.5 block" />
                </div>
              </div>

              <div className="flex gap-4 items-center">
                <div className="w-9 h-9 rounded-none bg-gold-champagne/40 border border-green-deep/10 flex items-center justify-center text-green-deep shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-green-deep uppercase tracking-wider text-[10px]">E-mail de Relacionamento:</h4>
                  <EditableText id="contactEmail" value={siteContent?.contactEmail || ""} onChange={(val) => updateField('contactEmail', val)} isEditMode={isEditMode} as="p" className="text-[11px] font-light mt-0.5 block" />
                </div>
              </div>
            </div>

            {/* Interactive map placeholder mockup (Beautiful custom vector styled design) */}
            <div className="bg-white p-3 rounded-none shadow-md border border-neutral-200 flex flex-col justify-between overflow-hidden relative aspect-[16/9]">
              {/* Simulated Map image */}
              <div className="absolute inset-0 bg-neutral-100 flex flex-col items-center justify-center text-center p-4">
                <div className="w-8 h-8 rounded-none bg-red-600 flex items-center justify-center text-white text-xs font-bold animate-bounce shadow-md border border-white/20">
                  📍
                </div>
                <h5 className="font-bold text-green-deep text-[11px] mt-2 uppercase tracking-wider">Dra. Claudia França (Clínica)</h5>
                <p className="text-[10px] text-neutral-400 font-light">Rua Gama Cerqueira, 726 - Cambuci, SP</p>
                <p className="text-[9px] text-neutral-400 font-light">Esquina com a Av. Dom Pedro I</p>
              </div>

              {/* Float navigation buttons over simulated map */}
              <div className="absolute bottom-3 left-3 right-3 flex justify-between pointer-events-auto">
                <span className="bg-green-deep text-white text-[9px] px-2.5 py-1 rounded-none font-semibold uppercase tracking-widest border border-white/10">MAPA INTERATIVO</span>
                <a 
                  href="https://maps.google.com/?q=Rua+Gama+Cerqueira+726+Cambuci+Sao+Paulo" 
                  target="_blank" 
                  rel="noreferrer"
                  className="bg-white text-green-deep text-[9px] px-2.5 py-1 rounded-none font-semibold uppercase tracking-widest border border-neutral-200 hover:bg-neutral-50 shadow-sm"
                >
                  Abrir no Google Maps
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: Lead Form */}
          <div className="lg:col-span-7 bg-white p-6 md:p-10 rounded-none border border-neutral-200 shadow-xl flex flex-col justify-between">
            {formSubmitted ? (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8 text-center py-12"
              >
                <div className="w-16 h-16 rounded-none bg-gold-champagne/40 border border-green-deep/20 flex items-center justify-center text-green-deep mx-auto">
                  <Check className="w-8 h-8 text-green-deep" />
                </div>
                
                <div className="space-y-3">
                  <h3 className="font-serif text-2xl text-green-deep uppercase tracking-wide font-light">Solicitação Recebida com Sucesso!</h3>
                  <p className="text-xs text-taupe leading-relaxed max-w-md mx-auto font-light">
                    Obrigado, <strong className="text-green-deep font-semibold">{leadName}</strong>. Seus dados e preferências de atendimento foram consolidados e integrados à nossa triagem clínica VIP.
                  </p>
                  <p className="text-[11px] text-neutral-400 max-w-sm mx-auto">
                    Nossa assessoria entrará em contato por telefone ou WhatsApp em até 15 minutos para agendar seu horário com a Dra. Claudia França.
                  </p>
                </div>

                <div className="bg-nude-warm p-4 rounded-none border border-neutral-200 text-left max-w-md mx-auto text-[11px] space-y-1">
                  <p className="font-bold text-green-deep uppercase tracking-wider text-[10px]">Resumo do Atendimento Selecionado:</p>
                  <p className="text-taupe font-light"><strong className="font-semibold text-green-deep">Categoria:</strong> {
                    mainCategory === 'harmonizacao' ? 'Harmonização Orofacial' :
                    mainCategory === 'implantodontia' ? 'Implantodontia' :
                    mainCategory === 'ortodontia' ? 'Ortodontia' :
                    mainCategory === 'clinica_geral' ? 'Clínica Geral' : 'Outro Assunto'
                  }</p>
                  {mainCategory === 'harmonizacao' && <p className="text-taupe font-light"><strong className="font-semibold text-green-deep">Procedimento:</strong> {harmProcedure}</p>}
                  {attachedFiles.length > 0 && (
                    <p className="text-taupe font-light">
                      <strong className="font-semibold text-green-deep">Arquivos Anexados:</strong> {attachedFiles.map(f => f.name).join(', ')}
                    </p>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto pt-2">
                  <a 
                    href={`https://wa.me/5511995349751?text=Olá! Acabei de enviar o formulário no site. Meu nome é ${encodeURIComponent(leadName)} e gostaria de agendar uma consulta sobre ${encodeURIComponent(mainCategory === 'harmonizacao' ? harmProcedure : mainCategory)}.`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 py-3.5 bg-[#25D366] text-white hover:bg-neutral-800 hover:text-white border border-[#25D366] text-center text-xs font-semibold tracking-widest uppercase rounded-none transition-all shadow-md flex items-center justify-center gap-2"
                  >
                    <MessageSquare className="w-4 h-4 fill-white" />
                    Falar no WhatsApp Agora
                  </a>
                  <button 
                    onClick={() => {
                      setLeadName('');
                      setLeadEmail('');
                      setLeadPhone('');
                      setLeadWhatsapp('');
                      setLeadMessage('');
                      setAttachedFiles([]);
                      setFormSubmitted(false);
                    }}
                    className="flex-1 py-3.5 bg-white text-green-deep border border-green-deep hover:bg-green-deep hover:text-white transition-all text-xs font-semibold tracking-widest uppercase rounded-none"
                  >
                    Nova Solicitação
                  </button>
                </div>
              </motion.div>
            ) : (
              <>
                <div className="space-y-4 mb-6">
                  <h3 className="font-serif text-xl md:text-2xl text-green-deep uppercase tracking-wide font-light">Solicite um Pré-Agendamento</h3>
                  <p className="text-xs text-taupe leading-relaxed font-light">
                    Preencha os dados abaixo e entraremos em contato via ligação ou WhatsApp em até 15 minutos para agendar seu melhor horário. Sem qualquer custo ou compromisso inicial.
                  </p>
                </div>

                <form onSubmit={handleLeadSubmit} className="space-y-4 text-xs">
                  {/* Nome Completo */}
                  <div className="space-y-1.5">
                    <label className="text-neutral-500 font-bold uppercase tracking-wider text-[10px] block">Seu Nome Completo:</label>
                    <input 
                      type="text" 
                      value={leadName}
                      onChange={(e) => setLeadName(e.target.value)}
                      placeholder="Ex: Mariana Vasconcellos de Alencar"
                      className="w-full bg-neutral-50 border border-neutral-200 rounded-none px-4 py-3 text-xs text-neutral-800 focus:outline-none focus:border-green-deep"
                      required
                    />
                  </div>

                  {/* Email e Telefone */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-neutral-500 font-bold uppercase tracking-wider text-[10px] block">E-mail para Relacionamento:</label>
                      <input 
                        type="email" 
                        value={leadEmail}
                        onChange={(e) => setLeadEmail(e.target.value)}
                        placeholder="mariana@exemplo.com.br"
                        className="w-full bg-neutral-50 border border-neutral-200 rounded-none px-4 py-3 text-xs text-neutral-800 focus:outline-none focus:border-green-deep"
                        required
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-neutral-500 font-bold uppercase tracking-wider text-[10px] block">Telefone de Contato (Com DDD):</label>
                      <input 
                        type="tel" 
                        value={leadPhone}
                        onChange={(e) => setLeadPhone(e.target.value)}
                        placeholder="Ex: (11) 99534-9751"
                        className="w-full bg-neutral-50 border border-neutral-200 rounded-none px-4 py-3 text-xs text-neutral-800 focus:outline-none focus:border-green-deep"
                        required
                      />
                    </div>
                  </div>

                  {/* WhatsApp Custom Option */}
                  <div className="bg-neutral-50 p-3 border border-neutral-200 rounded-none space-y-3">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input 
                        type="checkbox" 
                        checked={sameAsPhone} 
                        onChange={(e) => {
                          setSameAsPhone(e.target.checked);
                          if (e.target.checked) setLeadWhatsapp('');
                        }}
                        className="rounded-none border-neutral-300 text-green-deep focus:ring-green-deep w-4 h-4"
                      />
                      <span className="text-[10px] font-bold uppercase tracking-wider text-green-deep">O telefone acima também é meu WhatsApp</span>
                    </label>

                    {!sameAsPhone && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="space-y-1.5"
                      >
                        <label className="text-neutral-500 font-bold uppercase tracking-wider text-[9px] block">Número do WhatsApp Comercial/Pessoal:</label>
                        <input 
                          type="tel" 
                          value={leadWhatsapp}
                          onChange={(e) => setLeadWhatsapp(e.target.value)}
                          placeholder="Ex: (11) 98888-7777"
                          className="w-full bg-white border border-neutral-200 rounded-none px-3 py-2 text-xs text-neutral-800 focus:outline-none focus:border-green-deep"
                          required={!sameAsPhone}
                        />
                      </motion.div>
                    )}
                  </div>

                  {/* Main Category */}
                  <div className="space-y-1.5">
                    <label className="text-neutral-500 font-bold uppercase tracking-wider text-[10px] block">Serviço de maior interesse:</label>
                    <select 
                      value={mainCategory}
                      onChange={(e) => setMainCategory(e.target.value as any)}
                      className="w-full bg-neutral-50 border border-neutral-200 rounded-none px-4 py-3 text-xs text-neutral-800 focus:outline-none focus:border-green-deep font-semibold"
                    >
                      <option value="harmonizacao">Harmonização Orofacial (Botox, Preenchimento, Pele)</option>
                      <option value="implantodontia">Implantodontia (Implantes de Dentes, Prótese Fixa)</option>
                      <option value="ortodontia">Ortodontia (Invisalign, Aparelhos Estéticos)</option>
                      <option value="clinica_geral">Clínica Geral (Limpeza, Canal, Restaurações)</option>
                      <option value="outro">Outro Caso ou Dúvida Específica</option>
                    </select>
                  </div>

                  {/* DYNAMIC SUB-QUESTIONS CONTAINER */}
                  <AnimatePresence mode="wait">
                    {mainCategory === 'harmonizacao' && (
                      <motion.div 
                        key="harm"
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 5 }}
                        className="border-l-2 border-gold-champagne pl-4 space-y-3 pt-1"
                      >
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <label className="text-neutral-500 font-semibold uppercase tracking-wider text-[9px] block">Procedimento Estético Desejado:</label>
                            <select 
                              value={harmProcedure}
                              onChange={(e) => setHarmProcedure(e.target.value)}
                              className="w-full bg-neutral-50 border border-neutral-200 rounded-none px-3 py-2 text-xs text-neutral-800 focus:outline-none focus:border-green-deep"
                            >
                              <option value="Toxina Botulínica (Botox)">Toxina Botulínica (Botox)</option>
                              <option value="Preenchimento Facial (Ácido Hialurônico)">Preenchimento Facial (Ácido Hialurônico)</option>
                              <option value="Skinbooster">Skinbooster (Hidratação Profunda)</option>
                              <option value="Fios de Sustentação (PDO)">Fios de Sustentação (PDO)</option>
                              <option value="Outro">Outro Procedimento</option>
                            </select>
                          </div>

                          <div className="space-y-1">
                            <label className="text-neutral-500 font-semibold uppercase tracking-wider text-[9px] block">Seu Principal Objetivo Estético:</label>
                            <select 
                              value={harmGoal}
                              onChange={(e) => setHarmGoal(e.target.value)}
                              className="w-full bg-neutral-50 border border-neutral-200 rounded-none px-3 py-2 text-xs text-neutral-800 focus:outline-none focus:border-green-deep"
                            >
                              <option value="Suavizar rugas de expressão">Suavizar rugas de expressão</option>
                              <option value="Rejuvenescer a qualidade da pele">Rejuvenescer a qualidade da pele</option>
                              <option value="Devolver volume aos lábios ou contornos">Devolver volume aos lábios ou contornos</option>
                              <option value="Alívio de bruxismo / Dores tensionais">Alívio de bruxismo / Dores tensionais</option>
                              <option value="Outro objetivo">Outro objetivo</option>
                            </select>
                          </div>
                        </div>

                        {harmProcedure === 'Toxina Botulínica (Botox)' && (
                          <motion.div 
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="space-y-2 pt-1 border-t border-neutral-100"
                          >
                            <div className="space-y-1">
                              <label className="text-neutral-500 font-semibold uppercase tracking-wider text-[9px] block">Já realizou aplicação de Botox anteriormente?</label>
                              <select 
                                value={priorBotox}
                                onChange={(e) => setPriorBotox(e.target.value)}
                                className="w-full bg-neutral-50 border border-neutral-200 rounded-none px-3 py-2 text-xs text-neutral-800 focus:outline-none focus:border-green-deep"
                              >
                                <option value="">Selecione...</option>
                                <option value="Sim">Sim, já apliquei antes</option>
                                <option value="Não">Não, seria minha primeira vez</option>
                              </select>
                            </div>

                            {priorBotox === 'Sim' && (
                              <motion.div 
                                initial={{ opacity: 0, y: 3 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="space-y-1"
                              >
                                <label className="text-neutral-500 font-semibold uppercase tracking-wider text-[9px] block">Há quanto tempo aplicou e qual foi sua experiência?</label>
                                <input 
                                  type="text"
                                  value={priorBotoxDetails}
                                  onChange={(e) => setPriorBotoxDetails(e.target.value)}
                                  placeholder="Ex: Apliquei há 10 meses, adorei o resultado, mas já saiu o efeito."
                                  className="w-full bg-neutral-50 border border-neutral-200 rounded-none px-3 py-2 text-xs text-neutral-800 focus:outline-none focus:border-green-deep"
                                />
                              </motion.div>
                            )}
                          </motion.div>
                        )}
                      </motion.div>
                    )}

                    {mainCategory === 'implantodontia' && (
                      <motion.div 
                        key="impl"
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 5 }}
                        className="border-l-2 border-gold-champagne pl-4 space-y-3 pt-1"
                      >
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <div className="space-y-1 col-span-1 sm:col-span-2">
                            <label className="text-neutral-500 font-semibold uppercase tracking-wider text-[9px] block">Situação atual do dente a tratar:</label>
                            <select 
                              value={implState}
                              onChange={(e) => setImplState(e.target.value)}
                              className="w-full bg-neutral-50 border border-neutral-200 rounded-none px-3 py-2 text-xs text-neutral-800 focus:outline-none focus:border-green-deep"
                            >
                              <option value="Já perdi o dente e o espaço está vazio">Já perdi o dente e o espaço está vazio</option>
                              <option value="O dente está quebrado/comprometido (necessita extração)">O dente está quebrado/comprometido (necessita extração)</option>
                              <option value="Desejo substituir dentadura móvel por prótese fixa total (Protocolo)">Desejo substituir dentadura por prótese fixa total (Protocolo)</option>
                              <option value="Outra situação">Outra situação</option>
                            </select>
                          </div>

                          <div className="space-y-1">
                            <label className="text-neutral-500 font-semibold uppercase tracking-wider text-[9px] block">Necessita enxerto?</label>
                            <select 
                              value={implBoneGraft}
                              onChange={(e) => setImplBoneGraft(e.target.value)}
                              className="w-full bg-neutral-50 border border-neutral-200 rounded-none px-3 py-2 text-xs text-neutral-800 focus:outline-none focus:border-green-deep"
                            >
                              <option value="Não sei">Não sei informar</option>
                              <option value="Sim">Sim, já me informaram que sim</option>
                              <option value="Não">Não precisarei</option>
                            </select>
                          </div>
                        </div>

                        <div className="space-y-1 pt-1 border-t border-neutral-100">
                          <label className="text-neutral-500 font-semibold uppercase tracking-wider text-[9px] block">Há quanto tempo ocorreu a perda dentária?</label>
                          <select 
                            value={implTimeLost}
                            onChange={(e) => setImplTimeLost(e.target.value)}
                            className="w-full bg-neutral-50 border border-neutral-200 rounded-none px-3 py-2 text-xs text-neutral-800 focus:outline-none focus:border-green-deep"
                          >
                            <option value="Menos de 6 meses">Menos de 6 meses</option>
                            <option value="Mais de 6 meses">Mais de 6 meses</option>
                            <option value="Mais de 1 ano">Mais de 1 ano</option>
                            <option value="Não se aplica">Não se aplica / O dente ainda está na boca</option>
                          </select>
                        </div>
                      </motion.div>
                    )}

                    {mainCategory === 'ortodontia' && (
                      <motion.div 
                        key="ortho"
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 5 }}
                        className="border-l-2 border-gold-champagne pl-4 space-y-3 pt-1"
                      >
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <label className="text-neutral-500 font-semibold uppercase tracking-wider text-[9px] block">Aparelho Ortodôntico de Preferência:</label>
                            <select 
                              value={orthoType}
                              onChange={(e) => setOrthoType(e.target.value)}
                              className="w-full bg-neutral-50 border border-neutral-200 rounded-none px-3 py-2 text-xs text-neutral-800 focus:outline-none focus:border-green-deep"
                            >
                              <option value="Alinhadores Transparentes (Invisalign)">Alinhadores Transparentes (Invisalign)</option>
                              <option value="Aparelho Estético (Safira / Porcelana)">Aparelho Estético (Safira / Porcelana)</option>
                              <option value="Aparelho Metálico Convencional">Aparelho Metálico Convencional</option>
                              <option value="Gostaria de recomendação da Dra. Claudia">Gostaria de recomendação da Dra. Claudia</option>
                            </select>
                          </div>

                          <div className="space-y-1">
                            <label className="text-neutral-500 font-semibold uppercase tracking-wider text-[9px] block">Já usou aparelho ortodôntico antes?</label>
                            <select 
                              value={orthoPrior}
                              onChange={(e) => setOrthoPrior(e.target.value)}
                              className="w-full bg-neutral-50 border border-neutral-200 rounded-none px-3 py-2 text-xs text-neutral-800 focus:outline-none focus:border-green-deep"
                            >
                              <option value="Não">Não, seria minha primeira vez</option>
                              <option value="Sim">Sim, já utilizei anteriormente</option>
                            </select>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {mainCategory === 'clinica_geral' && (
                      <motion.div 
                        key="general"
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 5 }}
                        className="border-l-2 border-gold-champagne pl-4 pt-1"
                      >
                        <div className="space-y-1">
                          <label className="text-neutral-500 font-semibold uppercase tracking-wider text-[9px] block">Principal motivo da consulta geral:</label>
                          <select 
                            value={generalGoal}
                            onChange={(e) => setGeneralGoal(e.target.value)}
                            className="w-full bg-neutral-50 border border-neutral-200 rounded-none px-3 py-2 text-xs text-neutral-800 focus:outline-none focus:border-green-deep font-medium"
                          >
                            <option value="Profilaxia Avançada (Limpeza profunda e aplicação de flúor)">Profilaxia Avançada (Limpeza profunda e remoção de tártaro)</option>
                            <option value="Clareamento Dental Estético (Laser ou Caseiro)">Clareamento Dental Estético (Laser ou Caseiro)</option>
                            <option value="Tratamento de Canal (Dor aguda ou inflamação)">Tratamento de Canal (Dor de dente aguda ou inflamação)</option>
                            <option value="Restaurações estéticas (Tratar cáries ou dentes lascados)">Restaurações estéticas (Tratar cáries ou dentes lascados)</option>
                            <option value="Outro motivo">Outro motivo clínico</option>
                          </select>
                        </div>
                      </motion.div>
                    )}

                    {mainCategory === 'outro' && (
                      <motion.div 
                        key="other"
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 5 }}
                        className="border-l-2 border-gold-champagne pl-4 pt-1"
                      >
                        <div className="space-y-1">
                          <label className="text-neutral-500 font-semibold uppercase tracking-wider text-[9px] block">Descreva brevemente sua queixa ou necessidade:</label>
                          <textarea 
                            value={customBrief}
                            onChange={(e) => setCustomBrief(e.target.value)}
                            placeholder="Descreva seu caso aqui (Ex: Gostaria de alinhar meus dentes mas tenho uma prótese que me deixa inseguro...)"
                            rows={3}
                            className="w-full bg-neutral-50 border border-neutral-200 rounded-none px-3 py-2 text-xs text-neutral-800 focus:outline-none focus:border-green-deep resize-none"
                            required={mainCategory === 'outro'}
                          />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* FILE ATTACHMENTS (Drag-and-Drop and Click-to-Upload) */}
                  <div className="space-y-2">
                    <label className="text-neutral-500 font-bold uppercase tracking-wider text-[10px] block">Anexar Documentos / Fotos (Opcional):</label>
                    <div 
                      onDragOver={(e) => { e.preventDefault(); setIsDraggingFile(true); }}
                      onDragLeave={() => setIsDraggingFile(false)}
                      onDrop={handleFileDrop}
                      className={`border border-dashed p-6 text-center cursor-pointer transition-all rounded-none ${isDraggingFile ? 'border-green-deep bg-nude-warm/25' : 'border-neutral-200 bg-neutral-50'} hover:border-green-deep`}
                    >
                      <input 
                        type="file" 
                        id="file-upload" 
                        multiple 
                        className="hidden" 
                        onChange={handleFileChange} 
                      />
                      <label htmlFor="file-upload" className="cursor-pointer space-y-2 block">
                        <UploadCloud className="w-8 h-8 text-neutral-400 mx-auto" />
                        <p className="font-semibold text-[11px] text-green-deep uppercase tracking-wider">Arraste arquivos ou clique para selecionar</p>
                        <p className="text-[9px] text-neutral-400 font-light">Envie radiografias, exames panorâmicos ou fotos nítidas do seu sorriso</p>
                      </label>
                    </div>

                    {/* Attached list */}
                    {attachedFiles.length > 0 && (
                      <div className="bg-neutral-50 p-3 border border-neutral-200 rounded-none space-y-2">
                        <p className="text-[9px] font-bold text-green-deep uppercase tracking-wider">Arquivos Selecionados ({attachedFiles.length}):</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {attachedFiles.map((file, idx) => (
                            <div key={idx} className="bg-white border border-neutral-200 p-2 flex items-center justify-between text-[11px]">
                              <div className="flex items-center gap-2 truncate">
                                <Paperclip className="w-3.5 h-3.5 text-gold-champagne shrink-0" />
                                <span className="truncate font-light text-taupe" title={file.name}>{file.name}</span>
                                <span className="text-[9px] text-neutral-400 font-mono">({file.size})</span>
                              </div>
                              <button 
                                type="button" 
                                onClick={() => removeFile(idx)}
                                className="text-red-600 hover:text-red-800 font-bold px-1.5 py-0.5 rounded-none hover:bg-red-50 text-[10px] uppercase tracking-wider"
                              >
                                Excluir
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Free Message text area */}
                  <div className="space-y-1.5">
                    <label className="text-neutral-500 font-bold uppercase tracking-wider text-[10px] block">Mensagem Livre ou Observação adicional (Opcional):</label>
                    <textarea 
                      value={leadMessage}
                      onChange={(e) => setLeadMessage(e.target.value)}
                      placeholder="Descreva detalhes que considere importantes sobre sua saúde bucal, melhor dia/período para contato, etc..."
                      rows={3}
                      className="w-full bg-neutral-50 border border-neutral-200 rounded-none px-4 py-3 text-xs text-neutral-800 focus:outline-none focus:border-green-deep resize-none"
                    />
                  </div>

                  <div className="bg-neutral-50 p-4 rounded-none border-l-4 border-green-deep text-[10px] text-neutral-500 leading-relaxed font-light">
                    🔒 <strong>Privacidade & LGPD:</strong> Seus dados pessoais e arquivos são mantidos em segurança, criptografados e acessados exclusivamente pelo corpo clínico da Dra. Claudia França para o planejamento da sua consulta. Nunca compartilhamos dados.
                  </div>

                  <button 
                    type="submit"
                    className="w-full py-4 bg-green-deep text-white border border-green-deep hover:bg-white hover:text-green-deep transition-all text-xs font-semibold tracking-widest uppercase rounded-none flex items-center justify-center gap-2 cursor-pointer shadow-md"
                  >
                    <Check className="w-4 h-4 text-gold-champagne animate-pulse" />
                    Enviar Solicitação e Pré-Agendar Grátis
                  </button>
                </form>
              </>
            )}
          </div>

        </div>
      </section>

      {/* Footer copyright */}
      <footer className="bg-green-deep text-white py-12 px-6 md:px-12 border-t border-neutral-800">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <BrandLogoHorizontal light={true} />
          </div>
          <div className="flex flex-col md:items-end items-center gap-2">
            <p className="text-[10px] text-neutral-400">
              © 2026 Clínica Dra. Claudia França. Todos os direitos reservados. Cambuci, São Paulo/SP.
            </p>
            <a 
              href="#login" 
              className="text-[10px] text-neutral-400/60 hover:text-white hover:underline transition-colors uppercase tracking-wider font-semibold"
            >
              Área Restrita do Profissional & Paciente
            </a>
          </div>
        </div>
      </footer>

    </div>
  );
}
