/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { Camera, CameraOff, Mic, MicOff, PhoneOff, Send, MessageSquare, Download, Share2, Award, Info, FileText } from 'lucide-react';
import { motion } from 'motion/react';

interface TeleconsultationRoomProps {
  patientName: string;
  serviceName: string;
  onClose: () => void;
}

export default function TeleconsultationRoom({ patientName, serviceName, onClose }: TeleconsultationRoomProps) {
  const [micActive, setMicActive] = useState(true);
  const [cameraActive, setCameraActive] = useState(true);
  const [doctorMuted, setDoctorMuted] = useState(false);
  const [messages, setMessages] = useState<{ sender: 'doc' | 'patient'; text: string; time: string }[]>([
    { sender: 'doc', text: 'Olá! Seja muito bem-vindo à nossa consulta online. Como posso ajudar hoje?', time: '16:01' }
  ]);
  const [inputText, setInputText] = useState('');
  const [callTime, setCallTime] = useState(0);
  const [activeTab, setActiveTab] = useState<'chat' | 'orientations' | 'receita'>('chat');
  
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Doctor image 9 reference: Dra. Claudia sitting at her desk smiling
  const doctorImg = "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=600"; // Fallback beautiful professional dentist

  useEffect(() => {
    const interval = setInterval(() => {
      setCallTime(prev => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Simulate doctor responding after user sends a message
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userMsg = inputText;
    const now = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    
    setMessages(prev => [...prev, { sender: 'patient', text: userMsg, time: now }]);
    setInputText('');

    setTimeout(() => {
      let responseText = "Entendi perfeitamente. Vamos avaliar essa região com cuidado assim que você realizar o escaneamento inicial, para termos precisão milimétrica.";
      if (userMsg.toLowerCase().includes('dor') || userMsg.toLowerCase().includes('sensibilidade')) {
        responseText = "Para essa sensibilidade, recomendo evitar alimentos extremamente frios ou ácidos por enquanto. Acabei de emitir uma prescrição com um analgésico e creme dental específico na aba 'Receita Digital' ao lado.";
      } else if (userMsg.toLowerCase().includes('botox') || userMsg.toLowerCase().includes('harmonização')) {
        responseText = "A harmonização orofacial que realizo preza sempre pela naturalidade. Aplico a toxina botulínica de forma muito sutil para suavizar, sem congelar expressões.";
      }
      
      setMessages(prev => [...prev, { sender: 'doc', text: responseText, time: now }]);
    }, 2000);
  };

  const formatTime = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const secs = sec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 bg-neutral-950 z-50 flex flex-col md:flex-row font-sans text-neutral-100">
      {/* Video Screens Section */}
      <div className="flex-1 flex flex-col relative h-[60vh] md:h-full bg-neutral-900">
        
        {/* Header Overlay */}
        <div className="absolute top-4 left-4 right-4 z-10 flex items-center justify-between pointer-events-none">
          <div className="bg-neutral-950/80 backdrop-blur-md px-4 py-2 rounded-full border border-neutral-800 flex items-center gap-2 pointer-events-auto">
            <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            <span className="text-xs font-mono tracking-wider">TELECONSULTA AO VIVO</span>
            <span className="text-xs text-neutral-400 font-mono ml-2 border-l border-neutral-700 pl-2">
              {formatTime(callTime)}
            </span>
          </div>
          <div className="bg-neutral-950/80 backdrop-blur-md px-4 py-2 rounded-full border border-neutral-800 flex items-center gap-2 pointer-events-auto">
            <span className="text-xs text-gold-champagne font-medium">{serviceName}</span>
          </div>
        </div>

        {/* Doctor Video Area (Large Screen) */}
        <div className="flex-1 w-full h-full relative overflow-hidden flex items-center justify-center bg-green-deep/20">
          <img 
            src={doctorImg} 
            alt="Dra. Claudia França" 
            className="w-full h-full object-cover filter brightness-95"
            referrerPolicy="no-referrer"
          />
          
          <div className="absolute bottom-4 left-4 bg-neutral-950/60 backdrop-blur-md px-3 py-1.5 rounded-lg text-xs font-medium border border-neutral-800 flex items-center gap-2">
            <span>Dra. Claudia França</span>
            <span className="text-[10px] text-neutral-400">CRO 143883</span>
          </div>
        </div>

        {/* Patient Video Thumbnail (Floating Window) */}
        <div className="absolute bottom-20 right-4 w-32 h-44 md:w-48 md:h-64 rounded-xl overflow-hidden border-2 border-neutral-800 shadow-2xl bg-neutral-950 z-10">
          {cameraActive ? (
            <div className="w-full h-full bg-neutral-800 relative">
              {/* Simulate Patient video using user placeholder or real camera indicator */}
              <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-tr from-neutral-900 to-neutral-700 text-center p-3">
                <span className="text-4xl">🧑‍⚕️</span>
                <span className="text-[10px] text-neutral-400 mt-2">Sua Câmera (Ativa)</span>
              </div>
              <div className="absolute bottom-2 left-2 bg-neutral-950/80 px-2 py-0.5 rounded text-[10px] text-neutral-300">
                {patientName} (Você)
              </div>
            </div>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-neutral-950 text-neutral-500">
              <CameraOff className="w-8 h-8 mb-2" />
              <span className="text-[10px]">Câmera Desativada</span>
            </div>
          )}
        </div>

        {/* Controller Overlay at Bottom */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-neutral-950/90 backdrop-blur-md px-6 py-3 rounded-full border border-neutral-800 flex items-center gap-4 z-20 shadow-2xl">
          <button 
            onClick={() => setMicActive(!micActive)}
            className={`p-3 rounded-full transition-colors ${micActive ? 'bg-neutral-800 hover:bg-neutral-700 text-neutral-200' : 'bg-red-600 text-white'}`}
            title={micActive ? 'Mutar Microfone' : 'Ativar Microfone'}
          >
            {micActive ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
          </button>
          
          <button 
            onClick={() => setCameraActive(!cameraActive)}
            className={`p-3 rounded-full transition-colors ${cameraActive ? 'bg-neutral-800 hover:bg-neutral-700 text-neutral-200' : 'bg-red-600 text-white'}`}
            title={cameraActive ? 'Desativar Câmera' : 'Ativar Câmera'}
          >
            {cameraActive ? <Camera className="w-5 h-5" /> : <CameraOff className="w-5 h-5" />}
          </button>

          <button 
            onClick={() => alert('Compartilhamento de tela em modo de simulação.')}
            className="p-3 rounded-full bg-neutral-800 hover:bg-neutral-700 text-neutral-200 transition-colors"
            title="Compartilhar Tela"
          >
            <Share2 className="w-5 h-5" />
          </button>

          <button 
            onClick={onClose}
            className="p-3 rounded-full bg-red-600 hover:bg-red-700 text-white transition-colors ml-4"
            title="Encerrar Chamada"
          >
            <PhoneOff className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Sidebar Interface (Chat, Digital Recipe, Recommendations) */}
      <div className="w-full md:w-[400px] bg-neutral-950 border-t md:border-t-0 md:border-l border-neutral-800 flex flex-col h-[40vh] md:h-full">
        {/* Navigation Tabs */}
        <div className="flex border-b border-neutral-800 text-xs">
          <button 
            onClick={() => setActiveTab('chat')}
            className={`flex-1 py-3 text-center font-medium transition-colors border-b-2 ${activeTab === 'chat' ? 'border-gold-champagne text-gold-champagne bg-neutral-900/50' : 'border-transparent text-neutral-400 hover:text-neutral-200'}`}
          >
            <span className="flex items-center justify-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5" />
              Chat Clínico
            </span>
          </button>
          <button 
            onClick={() => setActiveTab('orientations')}
            className={`flex-1 py-3 text-center font-medium transition-colors border-b-2 ${activeTab === 'orientations' ? 'border-gold-champagne text-gold-champagne bg-neutral-900/50' : 'border-transparent text-neutral-400 hover:text-neutral-200'}`}
          >
            <span className="flex items-center justify-center gap-1.5">
              <Award className="w-3.5 h-3.5" />
              Orientações
            </span>
          </button>
          <button 
            onClick={() => setActiveTab('receita')}
            className={`flex-1 py-3 text-center font-medium transition-colors border-b-2 ${activeTab === 'receita' ? 'border-gold-champagne text-gold-champagne bg-neutral-900/50' : 'border-transparent text-neutral-400 hover:text-neutral-200'}`}
          >
            <span className="flex items-center justify-center gap-1.5">
              <FileText className="w-3.5 h-3.5" />
              Prescrição
            </span>
          </button>
        </div>

        {/* Tab Contents */}
        <div className="flex-1 overflow-y-auto p-4 flex flex-col min-h-0">
          
          {activeTab === 'chat' && (
            <>
              {/* Chat history */}
              <div className="flex-1 overflow-y-auto space-y-3 mb-4 pr-1 text-sm">
                <div className="bg-neutral-900/50 text-[11px] p-2.5 rounded-lg border border-neutral-800/80 text-neutral-400 flex items-start gap-2">
                  <Info className="w-4 h-4 text-gold-champagne shrink-0 mt-0.5" />
                  <span>Esta teleconsulta é criptografada de ponta a ponta, em conformidade com as diretrizes da LGPD e do CFO.</span>
                </div>

                {messages.map((msg, index) => (
                  <div key={index} className={`flex flex-col ${msg.sender === 'patient' ? 'items-end' : 'items-start'}`}>
                    <div className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 ${msg.sender === 'patient' ? 'bg-green-deep text-white rounded-tr-none' : 'bg-neutral-800 text-neutral-100 rounded-tl-none'}`}>
                      <p className="leading-relaxed">{msg.text}</p>
                    </div>
                    <span className="text-[10px] text-neutral-500 mt-1 px-1">{msg.time}</span>
                  </div>
                ))}
                <div ref={chatEndRef} />
              </div>

              {/* Chat Input */}
              <form onSubmit={handleSendMessage} className="flex gap-2 border-t border-neutral-800 pt-3">
                <input 
                  type="text" 
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Envie sua mensagem para a Dra..."
                  className="flex-1 bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-sm text-neutral-100 focus:outline-none focus:border-gold-champagne"
                />
                <button type="submit" className="p-2.5 rounded-xl bg-gold-champagne text-neutral-950 hover:bg-gold-champagne/90 transition-colors">
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </>
          )}

          {activeTab === 'orientations' && (
            <div className="space-y-4 text-sm">
              <h4 className="font-serif text-gold-champagne text-base border-b border-neutral-800 pb-2">Orientações Pré & Pós Consulta</h4>
              
              <div className="space-y-3">
                <div className="bg-neutral-900/40 p-3 rounded-lg border border-neutral-800">
                  <span className="text-xs text-gold-champagne font-medium uppercase tracking-wider block mb-1">Como proceder agora:</span>
                  <p className="text-xs text-neutral-300 leading-relaxed">Converse com a Dra. Claudia sobre seus sintomas, desejos estéticos ou queixas de dor. Se tiver radiografias ou exames anteriores, você pode compartilhá-los no chat.</p>
                </div>

                <div className="bg-neutral-900/40 p-3 rounded-lg border border-neutral-800">
                  <span className="text-xs text-green-300 font-medium uppercase tracking-wider block mb-1">Passo seguinte recomendando:</span>
                  <p className="text-xs text-neutral-300 leading-relaxed">Caso seja acordado um procedimento estético ou reabilitação, nosso sistema agendará automaticamente seu escaneamento 3D na clínica física.</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'receita' && (
            <div className="flex flex-col h-full space-y-4">
              <div className="bg-white text-neutral-900 p-5 rounded-lg border border-neutral-200 flex-1 flex flex-col shadow-xl">
                {/* Header of Prescription */}
                <div className="text-center border-b border-neutral-100 pb-3 mb-4">
                  <h3 className="font-serif text-sm tracking-widest text-neutral-800 uppercase">Clínica Dra. Claudia França</h3>
                  <p className="text-[9px] text-neutral-500 uppercase tracking-wider">Saúde & Estética | CRO 143883</p>
                </div>

                {/* Patient Name */}
                <div className="text-xs mb-4">
                  <span className="text-neutral-500 font-medium">Paciente: </span>
                  <span className="font-semibold text-neutral-800">{patientName}</span>
                </div>

                {/* Prescription Body */}
                <div className="flex-1 text-xs space-y-3 font-serif">
                  <div className="border-l-2 border-gold-champagne pl-2">
                    <p className="font-bold text-neutral-800">1. Sensodyne True White (Creme Dental)</p>
                    <p className="text-neutral-500 text-[10px] italic">Usar 3 vezes ao dia após as principais refeições.</p>
                  </div>

                  <div className="border-l-2 border-gold-champagne pl-2">
                    <p className="font-bold text-neutral-800">2. Lisador Dipirona 1g</p>
                    <p className="text-neutral-500 text-[10px] italic">Tomar 1 comprimido de 6 em 6 horas caso haja dor ou sensibilidade tensional.</p>
                  </div>
                </div>

                {/* Footer Signature */}
                <div className="border-t border-neutral-100 pt-3 text-center">
                  <div className="inline-block border-b border-neutral-300 px-6 py-1 text-[10px] text-neutral-400 font-sans italic">
                    Assinatura Eletrônica ICP-Brasil
                  </div>
                  <p className="text-[8px] text-neutral-400 mt-1 font-sans">Dra. Claudia França - CRO 143883</p>
                </div>
              </div>

              {/* Action Button */}
              <button 
                onClick={() => alert('Prescrição assinada digitalmente e enviada com sucesso para o seu celular cadastrado via SMS!')}
                className="w-full py-2.5 bg-gold-champagne text-neutral-950 font-semibold rounded-xl text-xs flex items-center justify-center gap-2 hover:bg-gold-champagne/90 transition-colors"
              >
                <Download className="w-4 h-4" />
                Baixar Receita PDF Assinada
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
