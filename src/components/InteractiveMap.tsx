import React, { useState } from 'react';
import { APIProvider, Map, AdvancedMarker, Pin } from '@vis.gl/react-google-maps';
import { MapPin, Navigation, ExternalLink, AlertTriangle } from 'lucide-react';

interface InteractiveMapProps {
  address?: string;
  mapsLink?: string;
}

export default function InteractiveMap({ 
  address = "Rua Gama Cerqueira, 726, Cambuci, São Paulo/SP",
  mapsLink = "https://maps.app.goo.gl/VUebcvBKzmWi5aVG8"
}: InteractiveMapProps) {
  // Reading exactly GOOGLE_MAPS_PLATFORM_KEY
  const API_KEY = 
    (process.env as any).GOOGLE_MAPS_PLATFORM_KEY || 
    (import.meta as any).env?.VITE_GOOGLE_MAPS_PLATFORM_KEY || 
    (globalThis as any).GOOGLE_MAPS_PLATFORM_KEY || 
    '';

  const hasKey = Boolean(API_KEY) && API_KEY !== 'YOUR_API_KEY' && API_KEY.trim() !== '';

  const centerCoords = { lat: -23.57194, lng: -46.62122 };

  // Generate mobile link
  // On mobile, maps.app.goo.gl or standard geo query can launch the native app
  const isMobile = typeof window !== 'undefined' && /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  const directionsLink = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}&destination_place_id=ChIJy99u_9VZzpQRrW4Y3_3vA9M`;
  const mobileAppUrl = isMobile ? `geo:${centerCoords.lat},${centerCoords.lng}?q=${encodeURIComponent(address)}` : mapsLink;

  const [mapError, setMapError] = useState(false);

  const handleDirectionsClick = (e: React.MouseEvent) => {
    if (isMobile) {
      e.preventDefault();
      // Try launching geo URL protocol, fallback to directions link if fails
      window.location.href = mobileAppUrl;
      setTimeout(() => {
        window.open(directionsLink, '_blank', 'noreferrer');
      }, 500);
    } else {
      window.open(directionsLink, '_blank', 'noreferrer');
    }
  };

  return (
    <div className="w-full space-y-4">
      {/* Map Stage Container */}
      <div className="w-full aspect-[16/10] bg-neutral-100 rounded-2xl border border-neutral-200 shadow-md relative overflow-hidden group">
        {hasKey && !mapError ? (
          <APIProvider apiKey={API_KEY} onLoad={() => console.log('Google Maps API Loaded')}>
            <Map
              defaultZoom={17}
              defaultCenter={centerCoords}
              mapId="DEMO_MAP_ID"
              gestureHandling="cooperative"
              disableDefaultUI={false}
              className="w-full h-full"
            >
              <AdvancedMarker position={centerCoords} title="Clínica Dra. Claudia França">
                <Pin background={'#8C434E'} glyphColor={'#FFEBA5'} borderColor={'#C5A059'} scale={1.2}>
                  <span className="text-[10px] font-bold text-white">📍</span>
                </Pin>
              </AdvancedMarker>
            </Map>
          </APIProvider>
        ) : (
          /* Iframe fallback: extremely reliable, 100% interactive, responsive and works without any key! */
          <div className="w-full h-full relative">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3656.9609070908864!2d-46.6212204!3d-23.571944!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94ce599bf99b9cf9%3A0xcdfdf7dfdea16e2b!2sRua%20Gama%20Cerqueira%2C%20726%20-%20Cambuci%2C%20S%C3%A3o%20Paulo%20-%20SP%2C%2001539-010!5e0!3m2!1spt-BR!2sbr!4v1720379200000!5m2!1spt-BR!2sbr"
              className="w-full h-full border-0"
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Localização da Clínica Dra. Claudia França"
            />
            
            {/* Elegant banner showing running in optimized fallback mode */}
            {!hasKey && (
              <div className="absolute top-3 left-3 bg-neutral-900/90 text-brand-gold text-[9px] font-bold tracking-widest uppercase px-3 py-1.5 border border-brand-gold/20 flex items-center gap-1.5 shadow-lg">
                <MapPin className="w-3 h-3 text-brand-gold" />
                <span>Mapa Interativo</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Control Buttons Panel */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={handleDirectionsClick}
          className="flex-1 bg-brand-wine hover:bg-brand-wine-dark text-white font-bold text-xs uppercase tracking-wider py-3.5 px-6 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer hover:scale-[1.02]"
        >
          <Navigation className="w-4 h-4 text-brand-gold fill-brand-gold/10" />
          Como Chegar
        </button>
        <a
          href={mapsLink}
          target="_blank"
          rel="noreferrer"
          className="flex-1 bg-white hover:bg-neutral-50 text-green-deep border border-neutral-200 font-bold text-xs uppercase tracking-wider py-3.5 px-6 rounded-xl flex items-center justify-center gap-2 transition-all shadow-sm hover:scale-[1.02]"
        >
          <ExternalLink className="w-4 h-4" />
          Abrir no Google Maps
        </a>
      </div>

      {/* Elegant Warning Alert if API Key is missing, explaining where/how to configure */}
      {!hasKey && (
        <div className="bg-neutral-50 border border-neutral-200 p-4 rounded-2xl flex items-start gap-3.5">
          <div className="p-1.5 bg-amber-100 text-amber-700 rounded-lg shrink-0 mt-0.5">
            <AlertTriangle className="w-4 h-4" />
          </div>
          <div className="space-y-1">
            <h4 className="text-xs font-bold text-neutral-800 uppercase tracking-wide">
              Ambiente de Produção (Chave do Google Maps)
            </h4>
            <p className="text-[11px] text-neutral-500 leading-relaxed">
              O mapa acima está rodando no modo incorporado gratuito (Iframe). Para ativar a experiência total do Google Maps Platform em tela cheia com telemetria local e buscas de rotas integradas, configure a variável de ambiente <code className="bg-neutral-200 text-neutral-800 px-1 py-0.5 rounded text-[9px] font-mono font-bold">GOOGLE_MAPS_PLATFORM_KEY</code> nas configurações da sua hospedagem.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
