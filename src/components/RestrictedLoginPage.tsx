import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Lock, 
  Mail, 
  Eye, 
  EyeOff, 
  ArrowLeft, 
  ShieldCheck, 
  Heart, 
  Sparkles, 
  Upload, 
  Image as ImageIcon, 
  Save, 
  X, 
  Settings, 
  RefreshCw, 
  Check, 
  ChevronRight,
  Sparkle
} from 'lucide-react';
import { BrandLogoVertical, BrandLogoHorizontal, BrandSubmarca } from './BrandLogo';
import { SiteContent } from '../types';

interface RestrictedLoginPageProps {
  onLoginSuccess: (role: 'patient' | 'admin') => void;
  onBackToLanding: () => void;
  siteContent?: SiteContent;
  onSaveSiteContent?: (newContent: SiteContent) => void;
}

// Premium dentist stock photography recommendations for instant luxury visuals
const PRESETS = {
  hero: [
    { name: 'Clínica Luxo Minimalista', url: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&q=80&w=1200' },
    { name: 'Lounge & Recepção VIP', url: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=1200' },
    { name: 'Consultório Moderno 3D', url: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&q=80&w=1200' },
    { name: 'Cadeira Odontológica Gold', url: 'https://images.unsplash.com/photo-1629909615184-74f495363b67?auto=format&fit=crop&q=80&w=1200' }
  ],
  bio: [
    { name: 'Dra. Claudia (Modelo Sorrindo)', url: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=800' },
    { name: 'Doutora de Perfil Clínico', url: 'https://images.unsplash.com/photo-1594824813573-246434e3b96f?auto=format&fit=crop&q=80&w=800' },
    { name: 'Atendimento Humanizado', url: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=800' }
  ],
  before: [
    { name: 'Alineamento Estético', url: 'https://images.unsplash.com/photo-1516214104703-d870798883c5?auto=format&fit=crop&q=80&w=800' },
    { name: 'Harmonização Dental', url: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&q=80&w=800' }
  ],
  after: [
    { name: 'Sorriso Transformado', url: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=800' },
    { name: 'Estética Finalizada', url: 'https://images.unsplash.com/photo-1606811971618-4486d14f3f99?auto=format&fit=crop&q=80&w=800' }
  ]
};

export default function RestrictedLoginPage({ 
  onLoginSuccess, 
  onBackToLanding, 
  siteContent, 
  onSaveSiteContent 
}: RestrictedLoginPageProps) {
  const [activeTab, setActiveTab] = useState<'patient' | 'admin'>('patient');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Live website customizer drawer states
  const [showEditor, setShowEditor] = useState(false);
  const [editorTab, setEditorTab] = useState<'branding' | 'text' | 'images'>('branding');
  const [dragActiveField, setDragActiveField] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Simulated short delay for luxury premium loading feedback
    setTimeout(() => {
      setLoading(false);
      if (activeTab === 'patient') {
        if (username.trim().toLowerCase() === 'amanda@gmail.com' && password === 'paciente123') {
          onLoginSuccess('patient');
        } else {
          setError('Credenciais incorretas para o Portal do Paciente. Tente usar o acesso demonstrativo.');
        }
      } else {
        if (username.trim().toLowerCase() === 'admin' && password === 'admin123') {
          onLoginSuccess('admin');
        } else {
          setError('Usuário ou senha incorretos para o Painel Administrativo.');
        }
      }
    }, 800);
  };

  const handleDemoFill = () => {
    setError('');
    if (activeTab === 'patient') {
      setUsername('amanda@gmail.com');
      setPassword('paciente123');
    } else {
      setUsername('admin');
      setPassword('admin123');
    }
  };

  // Safe real-time editing and auto-sync handler
  const handleUpdateContent = (key: keyof SiteContent, value: any) => {
    if (siteContent && onSaveSiteContent) {
      const updated = {
        ...siteContent,
        [key]: value
      };
      onSaveSiteContent(updated);
      
      // Dispatch custom event to trigger instant logo rendering updates
      setTimeout(() => {
        window.dispatchEvent(new Event('brand_update'));
      }, 50);
    }
  };

  // HTML5 FileReader for premium drag-and-drop local image uploading
  const handleImageFile = (key: keyof SiteContent, file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Por favor, selecione uma imagem válida (PNG, JPG, WEBP).');
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        handleUpdateContent(key, event.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  // Drag and drop events
  const handleDrag = (e: React.DragEvent, fieldKey: string, active: boolean) => {
    e.preventDefault();
    e.stopPropagation();
    if (active) {
      setDragActiveField(fieldKey);
    } else {
      setDragActiveField(null);
    }
  };

  const handleDrop = (e: React.DragEvent, key: keyof SiteContent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActiveField(null);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleImageFile(key, e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFBF9] flex flex-col lg:flex-row font-sans text-neutral-800 relative overflow-x-hidden">
      
      {/* Left Column: Visual & Aesthetic Brand Panel */}
      <div className="hidden lg:flex lg:w-5/12 bg-gradient-to-br from-brand-wine-dark to-brand-wine relative flex-col justify-between p-16 text-white overflow-hidden border-r border-neutral-100">
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(circle_at_center,_#FFEBA5_0%,_transparent_75%)]"></div>
        
        {/* Top Header Section */}
        <div className="relative z-10">
          <button 
            onClick={onBackToLanding}
            className="flex items-center gap-2 text-white/70 hover:text-white transition-all text-xs font-bold tracking-widest uppercase cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar para o site
          </button>
        </div>

        {/* Center Aesthetic Emblem */}
        <div className="relative z-10 flex flex-col items-center justify-center my-auto space-y-8">
          <motion.div
            key={siteContent?.brandName || "default_brand"}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
          >
            <BrandSubmarca className="w-56 h-56" light={true} />
          </motion.div>
          <div className="text-center max-w-sm space-y-4">
            <h2 className="font-serif text-2xl font-light tracking-wide text-brand-gold uppercase">
              Acesso Exclusivo
            </h2>
            <div className="h-[1px] w-12 bg-brand-gold/40 mx-auto"></div>
            <p className="text-xs text-white/80 font-light leading-relaxed tracking-wide">
              Bem-vindo ao canal reservado da Clínica {siteContent?.brandName || "Dra. Claudia França"}. Um ecossistema digital projetado com segurança de nível médico e privacidade absoluta.
            </p>
          </div>
        </div>

        {/* Footer info in sidebar */}
        <div className="relative z-10 flex items-center gap-2.5 text-white/50 text-[10px] tracking-wider uppercase font-medium">
          <ShieldCheck className="w-4 h-4 text-brand-gold" />
          Conexão Segura SSL de Alta Criptografia
        </div>
      </div>

      {/* Right Column: High-Fidelity Interactive Form Panel */}
      <div className="flex-1 flex flex-col justify-between p-6 sm:p-12 lg:p-20 relative">
        
        {/* Mobile-only and small viewport top header */}
        <div className="flex lg:hidden items-center justify-between border-b border-neutral-100 pb-4 mb-8">
          <BrandLogoHorizontal />
          <button 
            onClick={onBackToLanding}
            className="flex items-center gap-1.5 text-neutral-500 hover:text-brand-wine transition-all text-[10px] font-bold tracking-widest uppercase"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Sair
          </button>
        </div>

        {/* Top dummy offset for desktop alignment */}
        <div className="hidden lg:block text-right">
          <BrandLogoHorizontal />
        </div>

        {/* Centered Login Box */}
        <div className="w-full max-w-md mx-auto my-auto space-y-8">
          
          {/* Header Typography */}
          <div className="space-y-2 text-center lg:text-left">
            <h1 className="font-serif text-2xl sm:text-3xl font-light text-brand-wine uppercase tracking-tight leading-snug">
              Área Restrita
            </h1>
            <p className="text-xs text-neutral-400 font-light tracking-wide">
              Selecione o seu perfil para realizar o login seguro.
            </p>
          </div>

          {/* Luxury Tab Switcher */}
          <div className="grid grid-cols-2 p-1 bg-neutral-100 border border-neutral-200/40 rounded-none">
            <button
              onClick={() => {
                setActiveTab('patient');
                setError('');
                setUsername('');
                setPassword('');
              }}
              className={`py-3 text-[10px] font-bold uppercase tracking-widest transition-all ${
                activeTab === 'patient' 
                  ? 'bg-white text-brand-wine shadow-sm border border-neutral-200/20 font-extrabold' 
                  : 'text-neutral-500 hover:text-neutral-800'
              }`}
            >
              Portal do Paciente
            </button>
            <button
              onClick={() => {
                setActiveTab('admin');
                setError('');
                setUsername('');
                setPassword('');
              }}
              className={`py-3 text-[10px] font-bold uppercase tracking-widest transition-all ${
                activeTab === 'admin' 
                  ? 'bg-white text-brand-wine shadow-sm border border-neutral-200/20 font-extrabold' 
                  : 'text-neutral-500 hover:text-neutral-800'
              }`}
            >
              Painel da Dra (CRO)
            </button>
          </div>

          {/* Login Form Box */}
          <div className="bg-white border border-neutral-200/60 p-6 sm:p-8 shadow-xl relative">
            
            {/* Elegant visual line detail */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-brand-wine"></div>

            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* Username field */}
              <div className="space-y-1.5">
                <label className="text-neutral-500 font-bold uppercase tracking-wider text-[10px] block">
                  {activeTab === 'patient' ? 'E-mail do Paciente:' : 'Nome de Usuário:'}
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-neutral-400">
                    <Mail className="w-4 h-4" />
                  </span>
                  <input
                    type={activeTab === 'patient' ? 'email' : 'text'}
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder={activeTab === 'patient' ? 'nome@exemplo.com' : 'digite o usuário'}
                    className="w-full bg-neutral-50 border border-neutral-200 rounded-none pl-10 pr-4 py-3 text-xs text-neutral-800 focus:outline-none focus:border-brand-wine focus:bg-white font-medium transition-all"
                    required
                  />
                </div>
              </div>

              {/* Password field */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-neutral-500 font-bold uppercase tracking-wider text-[10px]">
                    Sua Senha:
                  </label>
                  {activeTab === 'patient' && (
                    <span className="text-[9px] text-neutral-400 hover:text-brand-wine cursor-pointer transition-colors">
                      Esqueceu a senha?
                    </span>
                  )}
                </div>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-neutral-400">
                    <Lock className="w-4 h-4" />
                  </span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-neutral-50 border border-neutral-200 rounded-none pl-10 pr-10 py-3 text-xs text-neutral-800 focus:outline-none focus:border-brand-wine focus:bg-white font-medium transition-all"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-neutral-400 hover:text-neutral-700 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Error box */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <p className="text-red-700 text-[10px] bg-red-50 border-l-4 border-red-600 p-3 font-semibold tracking-wide">
                      ⚠️ {error}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Action Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-brand-wine text-white font-bold text-xs uppercase tracking-widest transition-all hover:bg-brand-wine-dark disabled:bg-neutral-300 disabled:cursor-not-allowed shadow-md hover:shadow-lg flex items-center justify-center gap-2 animate-[pulse_6s_infinite]"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <span>Acessar Canal Seguro</span>
                )}
              </button>

            </form>

            {/* Simulated quick fill credentials for high fidelity testing */}
            <div className="mt-6 pt-5 border-t border-neutral-100 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-wider">Acesso Demonstrativo:</span>
                <button
                  type="button"
                  onClick={handleDemoFill}
                  className="text-[9px] font-bold text-brand-wine hover:text-brand-wine-dark hover:underline uppercase tracking-wider"
                >
                  Preencher dados
                </button>
              </div>
              <div className="bg-neutral-50 p-3 border border-neutral-200/40 text-[10px] text-neutral-600 leading-relaxed font-light space-y-1">
                {activeTab === 'patient' ? (
                  <>
                    <p>💡 E-mail: <strong className="select-all font-mono font-normal">amanda@gmail.com</strong></p>
                    <p>💡 Senha: <strong className="select-all font-mono font-normal">paciente123</strong></p>
                  </>
                ) : (
                  <>
                    <p>💡 Usuário: <strong className="select-all font-mono font-normal">admin</strong></p>
                    <p>💡 Senha: <strong className="select-all font-mono font-normal">admin123</strong></p>
                  </>
                )}
              </div>
            </div>

          </div>

          {/* Privacy text */}
          <p className="text-[9px] text-neutral-400 text-center leading-relaxed">
            Este canal está em conformidade total com a Lei Geral de Proteção de Dados (LGPD). Seus acessos são monitorados e as conexões criptografadas de ponta a ponta para sua total privacidade.
          </p>
        </div>

        {/* Footer info at the bottom */}
        <div className="text-center pt-8 border-t border-neutral-100 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-[9px] text-neutral-400">
            © 2026 Clínica {siteContent?.brandName || "Dra. Claudia França"} • Cambuci, São Paulo/SP.
          </p>
          <div className="flex items-center gap-4 text-[9px] text-neutral-400 font-bold uppercase tracking-wider">
            <span className="hover:text-brand-wine cursor-pointer">Termos</span>
            <span>•</span>
            <span className="hover:text-brand-wine cursor-pointer">Privacidade</span>
          </div>
        </div>

      </div>

      {/* Real-time Visual Editor Slide-Over Drawer */}
      <AnimatePresence>
        {showEditor && siteContent && (
          <>
            {/* Backdrop Blur overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowEditor(false)}
              className="fixed inset-0 bg-neutral-950/70 backdrop-blur-sm z-50 cursor-pointer"
            />

            {/* Main Settings Drawer */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 right-0 w-full max-w-lg bg-[#FAF8F5] shadow-2xl z-50 flex flex-col border-l border-neutral-200/60"
            >
              {/* Drawer Header */}
              <div className="p-6 bg-white border-b border-neutral-200/60 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-brand-gold-dark" />
                    <h2 className="font-serif text-lg font-bold uppercase tracking-wider text-brand-wine">
                      Personalizar Website
                    </h2>
                  </div>
                  <p className="text-[10px] text-neutral-400 mt-1 font-light tracking-wide">
                    Altere os logotipos, imagens de clínicas e títulos da plataforma em tempo real.
                  </p>
                </div>
                <button
                  onClick={() => setShowEditor(false)}
                  className="p-1.5 rounded-full hover:bg-neutral-100 text-neutral-400 hover:text-neutral-700 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Mini Tabs Selector */}
              <div className="grid grid-cols-3 bg-neutral-100/50 p-1 border-b border-neutral-200/40 font-mono text-[9px] font-bold tracking-widest uppercase text-center">
                <button
                  onClick={() => setEditorTab('branding')}
                  className={`py-3 transition-colors ${
                    editorTab === 'branding' 
                      ? 'bg-white text-brand-wine shadow-sm border-b-2 border-brand-wine' 
                      : 'text-neutral-500 hover:text-neutral-800'
                  }`}
                >
                  ⚜️ Identidade & Logos
                </button>
                <button
                  onClick={() => setEditorTab('text')}
                  className={`py-3 transition-colors ${
                    editorTab === 'text' 
                      ? 'bg-white text-brand-wine shadow-sm border-b-2 border-brand-wine' 
                      : 'text-neutral-500 hover:text-neutral-800'
                  }`}
                >
                  📝 Textos & Slogans
                </button>
                <button
                  onClick={() => setEditorTab('images')}
                  className={`py-3 transition-colors ${
                    editorTab === 'images' 
                      ? 'bg-white text-brand-wine shadow-sm border-b-2 border-brand-wine' 
                      : 'text-neutral-500 hover:text-neutral-800'
                  }`}
                >
                  🖼️ Galeria & Imagens
                </button>
              </div>

              {/* Drawer Scrollable Content */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs">
                
                {/* 1. Branding / Logos Tab */}
                {editorTab === 'branding' && (
                  <div className="space-y-4">
                    <div className="bg-amber-50 border-l-4 border-brand-gold p-4 text-[11px] text-amber-900 leading-relaxed font-light">
                      ✨ <strong>Customização Dinâmica Global:</strong> Todos os logotipos da clínica (curvos, horizontais e verticais) e as assinaturas de rodapé são recalculados instantaneamente ao alterar os campos abaixo.
                    </div>

                    <div className="space-y-1">
                      <label className="text-neutral-500 font-bold uppercase tracking-wider text-[9px]">Nome do Profissional / Marca:</label>
                      <input
                        type="text"
                        value={siteContent.brandName || "Dra. Claudia França"}
                        onChange={(e) => handleUpdateContent('brandName', e.target.value)}
                        className="w-full bg-white border border-neutral-200 px-3 py-2 text-xs focus:outline-none focus:border-brand-wine"
                        placeholder="Ex: Dra. Claudia França"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-neutral-500 font-bold uppercase tracking-wider text-[9px]">Tipo de Estabelecimento:</label>
                      <input
                        type="text"
                        value={siteContent.brandType || "Clínica Odontológica"}
                        onChange={(e) => handleUpdateContent('brandType', e.target.value)}
                        className="w-full bg-white border border-neutral-200 px-3 py-2 text-xs focus:outline-none focus:border-brand-wine"
                        placeholder="Ex: Clínica Odontológica"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-neutral-500 font-bold uppercase tracking-wider text-[9px]">Especialidade / Slogan do Logo:</label>
                      <input
                        type="text"
                        value={siteContent.brandSub || "Saúde & Estética"}
                        onChange={(e) => handleUpdateContent('brandSub', e.target.value)}
                        className="w-full bg-white border border-neutral-200 px-3 py-2 text-xs focus:outline-none focus:border-brand-wine"
                        placeholder="Ex: Saúde & Estética"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-neutral-500 font-bold uppercase tracking-wider text-[9px]">Registro Profissional (CRO):</label>
                      <input
                        type="text"
                        value={siteContent.brandCro || "CRO-SP 143883"}
                        onChange={(e) => handleUpdateContent('brandCro', e.target.value)}
                        className="w-full bg-white border border-neutral-200 px-3 py-2 text-xs focus:outline-none focus:border-brand-wine"
                        placeholder="Ex: CRO-SP 143883"
                      />
                    </div>

                    {/* Quick Live Preview Box */}
                    <div className="mt-8 pt-6 border-t border-neutral-200">
                      <h4 className="font-mono text-[9px] font-bold text-neutral-400 uppercase tracking-widest mb-3">Pré-visualização do Novo Logo</h4>
                      <div className="bg-white border border-neutral-200/50 p-6 flex items-center justify-center min-h-[140px]">
                        <BrandLogoVertical />
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. Titles & Copywriting Tab */}
                {editorTab === 'text' && (
                  <div className="space-y-5">
                    <h3 className="font-serif text-sm font-bold text-brand-wine uppercase tracking-wider">Seção Hero (Início)</h3>
                    
                    <div className="space-y-1">
                      <label className="text-neutral-500 font-bold uppercase tracking-wider text-[9px]">Tarjeta de Destaque:</label>
                      <input
                        type="text"
                        value={siteContent.heroBadge}
                        onChange={(e) => handleUpdateContent('heroBadge', e.target.value)}
                        className="w-full bg-white border border-neutral-200 px-3 py-2 text-xs focus:outline-none focus:border-brand-wine"
                        placeholder="Tarjeta superior dourada"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-neutral-500 font-bold uppercase tracking-wider text-[9px]">Título Principal:</label>
                      <textarea
                        value={siteContent.heroTitle}
                        onChange={(e) => handleUpdateContent('heroTitle', e.target.value)}
                        rows={3}
                        className="w-full bg-white border border-neutral-200 px-3 py-2 text-xs focus:outline-none focus:border-brand-wine leading-relaxed"
                        placeholder="Título principal da página de entrada"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-neutral-500 font-bold uppercase tracking-wider text-[9px]">Subtítulo de Conversão:</label>
                      <textarea
                        value={siteContent.heroSubtitle}
                        onChange={(e) => handleUpdateContent('heroSubtitle', e.target.value)}
                        rows={3}
                        className="w-full bg-white border border-neutral-200 px-3 py-2 text-xs focus:outline-none focus:border-brand-wine leading-relaxed"
                        placeholder="Parágrafo de apoio do banner"
                      />
                    </div>

                    <div className="pt-4 border-t border-neutral-200 space-y-4">
                      <h3 className="font-serif text-sm font-bold text-brand-wine uppercase tracking-wider">Seção Biográfica (Doutora)</h3>
                      
                      <div className="space-y-1">
                        <label className="text-neutral-500 font-bold uppercase tracking-wider text-[9px]">Slogan / Badge da Bio:</label>
                        <input
                          type="text"
                          value={siteContent.bioBadge}
                          onChange={(e) => handleUpdateContent('bioBadge', e.target.value)}
                          className="w-full bg-white border border-neutral-200 px-3 py-2 text-xs focus:outline-none focus:border-brand-wine"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-neutral-500 font-bold uppercase tracking-wider text-[9px]">Nome de Exibição na Bio:</label>
                        <input
                          type="text"
                          value={siteContent.bioTitle}
                          onChange={(e) => handleUpdateContent('bioTitle', e.target.value)}
                          className="w-full bg-white border border-neutral-200 px-3 py-2 text-xs focus:outline-none focus:border-brand-wine"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* 3. Image Galleries & Uploads Tab */}
                {editorTab === 'images' && (
                  <div className="space-y-8">
                    
                    {/* Hero Banner Image */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="font-mono text-[9px] font-bold text-brand-wine uppercase tracking-widest">1. Banner Principal (Hero)</h4>
                        <span className="text-[9px] bg-brand-gold/20 text-brand-gold-dark font-semibold px-2 py-0.5">Live</span>
                      </div>

                      {/* Preview window */}
                      <div className="aspect-video w-full bg-neutral-200 border border-neutral-200 overflow-hidden relative group">
                        <img 
                          src={siteContent.heroImageUrl} 
                          alt="Banner Hero Preview" 
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <ImageIcon className="w-8 h-8 text-white" />
                        </div>
                      </div>

                      {/* Custom URL Input */}
                      <div className="space-y-1">
                        <label className="text-[9px] font-semibold text-neutral-400 uppercase tracking-wider">Link da Imagem:</label>
                        <input
                          type="text"
                          value={siteContent.heroImageUrl}
                          onChange={(e) => handleUpdateContent('heroImageUrl', e.target.value)}
                          className="w-full bg-white border border-neutral-200 px-2 py-1.5 text-[10px] focus:outline-none focus:border-brand-wine font-mono"
                          placeholder="Cole uma URL direta da imagem"
                        />
                      </div>

                      {/* Drag & Drop Upload Zone */}
                      <div
                        onDragOver={(e) => handleDrag(e, 'heroImageUrl', true)}
                        onDragLeave={(e) => handleDrag(e, 'heroImageUrl', false)}
                        onDrop={(e) => handleDrop(e, 'heroImageUrl')}
                        className={`border-2 border-dashed p-4 text-center cursor-pointer transition-colors ${
                          dragActiveField === 'heroImageUrl'
                            ? 'border-brand-wine bg-brand-wine/5'
                            : 'border-neutral-300 hover:border-brand-wine/60'
                        }`}
                      >
                        <input
                          type="file"
                          id="hero-file-upload"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                              handleImageFile('heroImageUrl', e.target.files[0]);
                            }
                          }}
                        />
                        <label htmlFor="hero-file-upload" className="cursor-pointer space-y-1.5 block">
                          <Upload className="w-5 h-5 text-neutral-400 mx-auto" />
                          <p className="text-[10px] font-medium text-neutral-600">
                            Arraste uma foto aqui ou <span className="text-brand-wine underline font-bold">clique para fazer upload</span>
                          </p>
                          <p className="text-[8px] text-neutral-400 uppercase tracking-wider">PNG, JPG, WEBP (Local)</p>
                        </label>
                      </div>

                      {/* Suggestions presets */}
                      <div className="space-y-1.5">
                        <span className="text-[8px] font-bold text-neutral-400 uppercase tracking-widest">Ou selecione uma foto Premium da clínica:</span>
                        <div className="grid grid-cols-2 gap-2">
                          {PRESETS.hero.map((item, index) => (
                            <button
                              key={index}
                              onClick={() => handleUpdateContent('heroImageUrl', item.url)}
                              className={`text-[9px] p-1.5 border flex items-center gap-1.5 transition-all text-left ${
                                siteContent.heroImageUrl === item.url 
                                  ? 'border-brand-wine bg-brand-wine/5 font-bold text-brand-wine' 
                                  : 'border-neutral-200 bg-white text-neutral-600 hover:border-neutral-300'
                              }`}
                            >
                              <div className="w-5 h-5 rounded-none overflow-hidden shrink-0 border border-neutral-200">
                                <img src={item.url} alt={item.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                              </div>
                              <span className="truncate">{item.name}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Biography Portrait */}
                    <div className="space-y-3 pt-6 border-t border-neutral-200">
                      <div className="flex items-center justify-between">
                        <h4 className="font-mono text-[9px] font-bold text-brand-wine uppercase tracking-widest">2. Foto da Biografia (Doutora)</h4>
                        <span className="text-[9px] bg-brand-gold/20 text-brand-gold-dark font-semibold px-2 py-0.5">Live</span>
                      </div>

                      {/* Preview */}
                      <div className="aspect-[3/4] w-28 bg-neutral-200 border border-neutral-200 overflow-hidden relative group mx-auto">
                        <img 
                          src={siteContent.bioImageUrl} 
                          alt="Bio Portrait Preview" 
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </div>

                      {/* Custom URL Input */}
                      <div className="space-y-1">
                        <label className="text-[9px] font-semibold text-neutral-400 uppercase tracking-wider">Link da Imagem:</label>
                        <input
                          type="text"
                          value={siteContent.bioImageUrl}
                          onChange={(e) => handleUpdateContent('bioImageUrl', e.target.value)}
                          className="w-full bg-white border border-neutral-200 px-2 py-1.5 text-[10px] focus:outline-none focus:border-brand-wine font-mono"
                          placeholder="Cole uma URL direta para a foto da Bio"
                        />
                      </div>

                      {/* Drag & Drop Upload Zone */}
                      <div
                        onDragOver={(e) => handleDrag(e, 'bioImageUrl', true)}
                        onDragLeave={(e) => handleDrag(e, 'bioImageUrl', false)}
                        onDrop={(e) => handleDrop(e, 'bioImageUrl')}
                        className={`border-2 border-dashed p-4 text-center cursor-pointer transition-colors ${
                          dragActiveField === 'bioImageUrl'
                            ? 'border-brand-wine bg-brand-wine/5'
                            : 'border-neutral-300 hover:border-brand-wine/60'
                        }`}
                      >
                        <input
                          type="file"
                          id="bio-file-upload"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                              handleImageFile('bioImageUrl', e.target.files[0]);
                            }
                          }}
                        />
                        <label htmlFor="bio-file-upload" className="cursor-pointer space-y-1.5 block">
                          <Upload className="w-5 h-5 text-neutral-400 mx-auto" />
                          <p className="text-[10px] font-medium text-neutral-600">
                            Arraste uma foto ou <span className="text-brand-wine underline font-bold">clique para fazer upload</span>
                          </p>
                        </label>
                      </div>

                      {/* Presets */}
                      <div className="space-y-1.5">
                        <span className="text-[8px] font-bold text-neutral-400 uppercase tracking-widest">Ou escolha um retrato de destaque:</span>
                        <div className="grid grid-cols-2 gap-2">
                          {PRESETS.bio.map((item, index) => (
                            <button
                              key={index}
                              onClick={() => handleUpdateContent('bioImageUrl', item.url)}
                              className={`text-[9px] p-1.5 border flex items-center gap-1.5 transition-all text-left ${
                                siteContent.bioImageUrl === item.url 
                                  ? 'border-brand-wine bg-brand-wine/5 font-bold text-brand-wine' 
                                  : 'border-neutral-200 bg-white text-neutral-600 hover:border-neutral-300'
                              }`}
                            >
                              <div className="w-5 h-5 rounded-none overflow-hidden shrink-0 border border-neutral-200">
                                <img src={item.url} alt={item.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                              </div>
                              <span className="truncate">{item.name}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Before / After Transformation */}
                    <div className="space-y-5 pt-6 border-t border-neutral-200">
                      <h4 className="font-mono text-[9px] font-bold text-brand-wine uppercase tracking-widest">3. Antes & Depois (Slider de Sorriso)</h4>
                      
                      <div className="grid grid-cols-2 gap-4">
                        {/* Before */}
                        <div className="space-y-2">
                          <span className="text-[9px] text-neutral-400 font-bold uppercase tracking-wider block">Imagem Antes</span>
                          <div className="aspect-[4/3] w-full bg-neutral-200 border border-neutral-200 overflow-hidden relative">
                            <img src={siteContent.beforeImageUrl} alt="Sorriso Antes" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                          </div>
                          
                          <input
                            type="text"
                            value={siteContent.beforeImageUrl}
                            onChange={(e) => handleUpdateContent('beforeImageUrl', e.target.value)}
                            className="w-full bg-white border border-neutral-200 px-1.5 py-1 text-[9px] focus:outline-none focus:border-brand-wine font-mono"
                          />

                          <div className="grid grid-cols-1 gap-1">
                            {PRESETS.before.map((item, index) => (
                              <button
                                key={index}
                                onClick={() => handleUpdateContent('beforeImageUrl', item.url)}
                                className={`text-[8px] px-1 py-1 border flex items-center gap-1 transition-all text-left ${
                                  siteContent.beforeImageUrl === item.url ? 'border-brand-wine font-bold' : 'border-neutral-200'
                                }`}
                              >
                                <span className="truncate">{item.name}</span>
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* After */}
                        <div className="space-y-2">
                          <span className="text-[9px] text-neutral-400 font-bold uppercase tracking-wider block">Imagem Depois</span>
                          <div className="aspect-[4/3] w-full bg-neutral-200 border border-neutral-200 overflow-hidden relative">
                            <img src={siteContent.afterImageUrl} alt="Sorriso Depois" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                          </div>

                          <input
                            type="text"
                            value={siteContent.afterImageUrl}
                            onChange={(e) => handleUpdateContent('afterImageUrl', e.target.value)}
                            className="w-full bg-white border border-neutral-200 px-1.5 py-1 text-[9px] focus:outline-none focus:border-brand-wine font-mono"
                          />

                          <div className="grid grid-cols-1 gap-1">
                            {PRESETS.after.map((item, index) => (
                              <button
                                key={index}
                                onClick={() => handleUpdateContent('afterImageUrl', item.url)}
                                className={`text-[8px] px-1 py-1 border flex items-center gap-1 transition-all text-left ${
                                  siteContent.afterImageUrl === item.url ? 'border-brand-wine font-bold' : 'border-neutral-200'
                                }`}
                              >
                                <span className="truncate">{item.name}</span>
                              </button>
                            ))}
                          </div>
                        </div>

                      </div>
                    </div>

                  </div>
                )}

              </div>

              {/* Drawer Sticky Footer */}
              <div className="p-6 bg-white border-t border-neutral-200/60 flex items-center gap-3">
                <button
                  onClick={() => setShowEditor(false)}
                  className="w-full py-3 bg-brand-wine text-white font-mono text-[10px] font-bold tracking-widest uppercase hover:bg-neutral-900 transition-colors flex items-center justify-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  <span>Salvar & Visualizar Site</span>
                </button>
              </div>

            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
}
