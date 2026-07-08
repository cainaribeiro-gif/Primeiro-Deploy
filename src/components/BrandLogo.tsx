import React, { useState, useEffect } from 'react';

// Live configuration hook to retrieve and listen to brand custom variables in real-time
export function useBrandConfig() {
  const [config, setConfig] = useState({
    brandName: "Dra. Claudia França",
    brandSub: "Saúde & Estética",
    brandCro: "CRO-SP 143883",
    brandType: "Clínica Odontológica",
    logoPrincipal: "",
    logoClara: "",
    logoEscura: "",
    favicon: "",
    contactPhone: "(11) 3271-7271 / (11) 99534-9751",
    contactWhatsapp: "(11) 99534-9751",
    contactEmail: "contato@draclaudiafranca.com.br",
    contactAddress: "Rua Gama Cerqueira, 726, Sala 02, Cambuci, São Paulo/SP, CEP 01539-010",
    clinicMapsLink: "https://maps.app.goo.gl/VUebcvBKzmWi5aVG8",
    clinicHours: "Segunda a Sexta: 08h às 19h | Sábado: 08h às 13h",
    brandColorPrimary: "#C5A059",
    brandColorSecondary: "#8C434E",
    brandColorBackground: "#FDFBF9"
  });

  useEffect(() => {
    const updateBrand = () => {
      const saved = localStorage.getItem('site_content');
      if (saved) {
        try {
          const content = JSON.parse(saved);
          setConfig({
            brandName: content.brandName || "Dra. Claudia França",
            brandSub: content.brandSub || "Saúde & Estética",
            brandCro: content.brandCro || "CRO-SP 143883",
            brandType: content.brandType || "Clínica Odontológica",
            logoPrincipal: content.logoPrincipal || "",
            logoClara: content.logoClara || "",
            logoEscura: content.logoEscura || "",
            favicon: content.favicon || "",
            contactPhone: content.contactPhone || "(11) 3271-7271 / (11) 99534-9751",
            contactWhatsapp: content.contactWhatsapp || "(11) 99534-9751",
            contactEmail: content.contactEmail || "contato@draclaudiafranca.com.br",
            contactAddress: content.contactAddress || "Rua Gama Cerqueira, 726, Sala 02, Cambuci, São Paulo/SP, CEP 01539-010",
            clinicMapsLink: content.clinicMapsLink || "https://maps.app.goo.gl/VUebcvBKzmWi5aVG8",
            clinicHours: content.clinicHours || "Segunda a Sexta: 08h às 19h | Sábado: 08h às 13h",
            brandColorPrimary: content.brandColorPrimary || "#C5A059",
            brandColorSecondary: content.brandColorSecondary || "#8C434E",
            brandColorBackground: content.brandColorBackground || "#FDFBF9"
          });
        } catch (e) {
          console.error('Error parsing site_content in BrandLogo hook', e);
        }
      }
    };

    updateBrand();
    window.addEventListener('storage', updateBrand);
    window.addEventListener('brand_update', updateBrand);
    
    return () => {
      window.removeEventListener('storage', updateBrand);
      window.removeEventListener('brand_update', updateBrand);
    };
  }, []);

  // Set Favicon in DOM dynamically if exists
  useEffect(() => {
    if (config.favicon) {
      try {
        let link: HTMLLinkElement | null = document.querySelector("link[rel*='icon']");
        if (!link) {
          link = document.createElement('link');
          link.rel = 'shortcut icon';
          document.getElementsByTagName('head')[0].appendChild(link);
        }
        link.href = config.favicon;
      } catch (err) {
        console.error("Error setting favicon in DOM", err);
      }
    }
  }, [config.favicon]);

  return config;
}

// Elegant Stylized Tooth Icon in SVG, matching the flowing lines of the brand book
export function ToothIcon({ className = "w-12 h-12", color = "currentColor" }: { className?: string; color?: string }) {
  const strokeColor = color === "url(#goldGrad)" ? "url(#goldGrad)" : color;
  return (
    <svg 
      viewBox="0 0 200 200" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg" 
      className={className}
    >
      {/* Golden gradient for a premium look */}
      <defs>
        <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFEBA5" />
          <stop offset="50%" stopColor="#E5C173" />
          <stop offset="100%" stopColor="#C5A059" />
        </linearGradient>
      </defs>
      
      {/* Stroke 1: Left & bottom-left tooth outline. Starts at bottom, sweeps up-left, peak, and curves into cleft */}
      <path 
        d="M 94,172 C 60,158 32,125 32,95 C 32,62 52,38 76,38 C 88,38 96,46 100,54" 
        stroke={strokeColor} 
        strokeWidth="3.5" 
        strokeLinecap="round"
        strokeLinejoin="round"
        className="opacity-90"
      />

      {/* Stroke 2: Small cleft curve transitioning towards the right cusp */}
      <path 
        d="M 100,54 C 104,46 112,38 126,38" 
        stroke={strokeColor} 
        strokeWidth="3.5" 
        strokeLinecap="round"
        strokeLinejoin="round"
        className="opacity-90"
      />
      
      {/* Stroke 3: Right and bottom-right tooth outline with elegant gap at the top-right shoulder */}
      <path 
        d="M 140,41 C 158,46 168,68 168,95 C 168,125 140,158 108,172" 
        stroke={strokeColor} 
        strokeWidth="3.5" 
        strokeLinecap="round"
        strokeLinejoin="round"
        className="opacity-90"
      />

      {/* Elegant cursive "C" */}
      <path 
        d="M 115,68 C 105,58 75,58 70,85 C 65,112 95,115 105,102" 
        stroke={strokeColor} 
        strokeWidth="4" 
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      
      {/* Elegant cursive "F" (for França) intersecting C */}
      <path 
        d="M 85,95 C 100,95 125,92 120,75 C 115,58 100,68 95,85 C 90,102 85,125 90,132 C 95,138 105,135 110,128" 
        stroke={strokeColor} 
        strokeWidth="3.5" 
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      
      {/* F crossbar */}
      <path 
        d="M 88,88 C 96,88 112,85 116,84" 
        stroke={strokeColor} 
        strokeWidth="3" 
        strokeLinecap="round"
      />
    </svg>
  );
}

// 1. Horizontal Logo: Icon on left, elegant Marcellus/Poppins text on right
export function BrandLogoHorizontal({ light = false }: { light?: boolean }) {
  const textColor = light ? "text-white" : "text-green-deep";
  const descColor = light ? "text-white/60" : "text-neutral-500";
  const iconColor = light ? "#FFEBA5" : "#8C434E";
  const brand = useBrandConfig();

  // Pick suitable uploaded logo image
  const uploadedLogo = light 
    ? (brand.logoClara || brand.logoPrincipal) 
    : (brand.logoEscura || brand.logoPrincipal);

  if (uploadedLogo) {
    return (
      <div className="flex items-center gap-3">
        <img 
          src={uploadedLogo} 
          alt={brand.brandName} 
          className="h-10 md:h-12 w-auto object-contain max-w-[140px]" 
        />
        <div className="flex flex-col border-l border-neutral-400/20 pl-3">
          <span className="text-[7px] md:text-[8px] tracking-[0.2em] uppercase font-semibold text-brand-gold-dark font-sans leading-none mb-1">
            {brand.brandType}
          </span>
          <h1 className={`font-serif text-xs md:text-sm font-light tracking-[0.08em] ${textColor} uppercase leading-none`}>
            {brand.brandName}
          </h1>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4">
      <ToothIcon className="w-12 h-12 md:w-14 md:h-14 shrink-0" color={iconColor} />
      <div className="flex flex-col">
        <span className="text-[9px] tracking-[0.25em] uppercase font-semibold text-brand-gold-dark font-sans">
          {brand.brandType}
        </span>
        <h1 className={`font-serif text-lg md:text-2xl font-light tracking-[0.12em] ${textColor} leading-tight uppercase`}>
          {brand.brandName}
        </h1>
        <div className="flex items-center gap-2 mt-0.5 font-sans text-[8px] tracking-[0.18em] uppercase font-light">
          <span className={descColor}>
            {brand.brandSub}
          </span>
          <span className="text-brand-gold-dark font-normal">|</span>
          <span className={descColor}>
            {brand.brandCro}
          </span>
        </div>
      </div>
    </div>
  );
}

// 2. Stacked/Vertical Logo
export function BrandLogoVertical({ light = false }: { light?: boolean }) {
  const textColor = light ? "text-white" : "text-green-deep";
  const descColor = light ? "text-white/60" : "text-neutral-500";
  const iconColor = light ? "#FFEBA5" : "#8C434E";
  const brand = useBrandConfig();

  // Pick suitable uploaded logo image
  const uploadedLogo = light 
    ? (brand.logoClara || brand.logoPrincipal) 
    : (brand.logoEscura || brand.logoPrincipal);

  if (uploadedLogo) {
    return (
      <div className="flex flex-col items-center text-center">
        <img 
          src={uploadedLogo} 
          alt={brand.brandName} 
          className="h-16 md:h-20 w-auto object-contain max-w-[240px]" 
        />
        <div className="flex flex-col items-center mt-3">
          <span className="text-[8px] tracking-[0.25em] uppercase font-semibold text-brand-gold-dark font-sans">
            {brand.brandType}
          </span>
          <h1 className={`font-serif text-base md:text-lg font-light tracking-[0.1em] ${textColor} uppercase leading-tight mt-1`}>
            {brand.brandName}
          </h1>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center text-center">
      <ToothIcon className="w-20 h-20 mb-3" color={iconColor} />
      <span className="text-[10px] tracking-[0.3em] uppercase font-semibold text-brand-gold-dark mb-1 font-sans">
        {brand.brandType}
      </span>
      <h1 className={`font-serif text-2xl md:text-3xl font-light tracking-[0.15em] ${textColor} uppercase leading-tight`}>
        {brand.brandName}
      </h1>
      <div className="flex items-center gap-2 mt-2 font-sans text-[9px] tracking-[0.2em] uppercase font-light">
        <span className={descColor}>
          {brand.brandSub}
        </span>
        <span className="text-brand-gold-dark font-normal">|</span>
        <span className={descColor}>
          {brand.brandCro}
        </span>
      </div>
    </div>
  );
}

// 3. Circular Submarca Component
export function BrandSubmarca({ className = "w-40 h-40", light = false }: { className?: string; light?: boolean }) {
  const textColor = light ? "#FFEBA5" : "#8C434E";
  const iconColor = light ? "#FFEBA5" : "#8C434E";
  const circleStroke = light ? "rgba(255, 235, 165, 0.2)" : "rgba(140, 67, 78, 0.15)";
  const brand = useBrandConfig();

  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      {/* Outer rotating/interactive circle wrapper */}
      <svg 
        viewBox="0 0 200 200" 
        className="w-full h-full animate-[spin_120s_linear_infinite]"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFEBA5" />
            <stop offset="50%" stopColor="#E5C173" />
            <stop offset="100%" stopColor="#C5A059" />
          </linearGradient>
          {/* Paths for text curved top & bottom */}
          <path 
            id="curvedPathTop" 
            d="M 28,100 A 72,72 0 0,1 172,100" 
            fill="none" 
          />
          <path 
            id="curvedPathBottom" 
            d="M 172,100 A 72,72 0 0,1 28,100" 
            fill="none" 
          />
        </defs>

        {/* Delicate aesthetic thin circles */}
        <circle cx="100" cy="100" r="88" stroke={circleStroke} strokeWidth="1" fill="none" />
        <circle cx="100" cy="100" r="84" stroke={circleStroke} strokeWidth="0.5" strokeDasharray="2 2" fill="none" />
        <circle cx="100" cy="100" r="60" stroke={circleStroke} strokeWidth="1" fill="none" />

        {/* Text curving along TOP */}
        <text className="font-sans text-[8.5px] font-semibold tracking-[0.28em] uppercase" fill={textColor}>
          <textPath href="#curvedPathTop" startOffset="50%" textAnchor="middle">
            {brand.brandType}
          </textPath>
        </text>

        {/* Text curving along BOTTOM */}
        <text className="font-sans text-[7px] font-bold tracking-[0.22em] uppercase" fill={light ? "#ffffff" : "#6B5E60"}>
          <textPath href="#curvedPathBottom" startOffset="50%" textAnchor="middle">
            {brand.brandName} | {brand.brandCro}
          </textPath>
        </text>

        {/* Left and Right tiny star/dot separators */}
        <circle cx="28" cy="100" r="2.5" fill={light ? "#FFEBA5" : "#C5A059"} />
        <circle cx="172" cy="100" r="2.5" fill={light ? "#FFEBA5" : "#C5A059"} />
      </svg>

      {/* Static Tooth Icon in Center */}
      <div className="absolute inset-0 flex items-center justify-center p-[25%] pointer-events-none">
        <ToothIcon className="w-full h-full" color={iconColor} />
      </div>
    </div>
  );
}
