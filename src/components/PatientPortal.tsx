/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Calendar, Clock, Video, FileText, Activity, AlertCircle, ArrowLeft, LogOut, Sparkles, Check, CreditCard, ChevronRight, User, Phone, Mail, FileCheck, CheckCircle, Smartphone } from 'lucide-react';
import { Appointment, Service } from '../types';
import { INITIAL_SERVICES } from '../mockData';
import { motion } from 'motion/react';
import { sendAppointmentToSupabase } from '../lib/supabase';
import TeleconsultationRoom from './TeleconsultationRoom';
import { BrandLogoHorizontal } from './BrandLogo';

interface PatientPortalProps {
  initialAppointments: Appointment[];
  onLogout: () => void;
}

export default function PatientPortal({ initialAppointments, onLogout }: PatientPortalProps) {
  const [appointments, setAppointments] = useState<Appointment[]>(initialAppointments);
  const [activeTab, setActiveTab] = useState<'home' | 'schedule' | 'documents' | 'post-care'>('home');
  const [selectedService, setSelectedService] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [consultationType, setConsultationType] = useState<'presencial' | 'teleconsulta'>('presencial');
  
  // Checkout flow state
  const [checkoutStep, setCheckoutStep] = useState<'form' | 'payment' | 'success'>('form');
  const [paymentMethod, setPaymentMethod] = useState<'pix' | 'cartao' | 'boleto'>('pix');
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCVV, setCardCVV] = useState('');
  
  // Teleconsultation room triggers
  const [activeTeleconsultation, setActiveTeleconsultation] = useState<Appointment | null>(null);

  // Filter out cancelled appointments
  const activeAppointments = appointments.filter(app => app.status !== 'cancelled');

  const availableHours = ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00'];

  const handleCreateAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedService || !selectedDate || !selectedTime) {
      alert('Por favor, preencha todos os campos do agendamento.');
      return;
    }

    const matchedService = INITIAL_SERVICES.find(s => s.id === selectedService);
    const serviceName = matchedService ? matchedService.name : selectedService;
    
    // For online consultations, trigger payment flow first
    if (consultationType === 'teleconsulta') {
      setCheckoutStep('payment');
      return;
    }

    // Direct physical booking (evaluation is free, other treatments marked)
    const newApp: Appointment = {
      id: `app-${Date.now()}`,
      patientId: 'pat-1',
      patientName: 'Amanda Silva Menezes', // Logged in patient name
      patientPhone: '(11) 98765-4321',
      serviceName: serviceName,
      date: selectedDate,
      time: selectedTime,
      status: 'pending',
      type: 'presencial',
      price: selectedService.includes('avaliacao') ? 0 : 250,
      paid: false
    };

    setAppointments(prev => [newApp, ...prev]);
    
    // Send pre-appointment request to Supabase
    sendAppointmentToSupabase(newApp).catch(err => {
      console.error('Erro assíncrono ao sincronizar agendamento no Supabase:', err);
    });

    alert('Sua pré-avaliação presencial foi solicitada com sucesso! A Dra. Claudia irá confirmar seu horário.');
    resetSchedulingForm();
    setActiveTab('home');
  };

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCheckoutStep('success');

    const matchedService = INITIAL_SERVICES.find(s => s.id === selectedService);
    const serviceName = matchedService ? matchedService.name : selectedService;

    // Create the online teleconsultation
    const newApp: Appointment = {
      id: `app-${Date.now()}`,
      patientId: 'pat-1',
      patientName: 'Amanda Silva Menezes',
      patientPhone: '(11) 98765-4321',
      serviceName: serviceName,
      date: selectedDate,
      time: selectedTime,
      status: 'approved', // Auto-approved upon payment
      type: 'teleconsulta',
      price: 250,
      paid: true,
      paymentMethod: paymentMethod,
      videoLink: 'https://meet.google.com/abc-defg-hij',
      notes: 'Consulta Online paga via portal.'
    };

    setAppointments(prev => [newApp, ...prev]);

    // Send pre-appointment request to Supabase
    sendAppointmentToSupabase(newApp).catch(err => {
      console.error('Erro assíncrono ao sincronizar agendamento teleconsulta no Supabase:', err);
    });
  };

  const resetSchedulingForm = () => {
    setSelectedService('');
    setSelectedDate('');
    setSelectedTime('');
    setConsultationType('presencial');
    setCheckoutStep('form');
    setPaymentMethod('pix');
    setCardNumber('');
    setCardHolder('');
    setCardExpiry('');
    setCardCVV('');
  };

  const handleCancelAppointment = (id: string) => {
    if (confirm('Tem certeza de que deseja cancelar este agendamento?')) {
      setAppointments(prev => prev.map(app => {
        if (app.id === id) {
          return { ...app, status: 'cancelled' };
        }
        return app;
      }));
    }
  };

  // Specific guidelines depending on treatment history
  const postCareInstructions = [
    {
      title: 'Cuidados Pós-Toxina Botulínica (Botox)',
      subtitle: 'Instruções para as primeiras 24 horas após a aplicação.',
      items: [
        'Não deite ou abaixe a cabeça por pelo menos 4 horas após a aplicação.',
        'Não realize exercícios físicos intensos ou musculação nas próximas 24 horas.',
        'Evite massagear vigorosamente ou esfregar as áreas onde houve aplicação.',
        'Evite exposição solar intensa ou saunas no dia do procedimento.'
      ]
    },
    {
      title: 'Manual de Cuidados com seu Invisalign',
      subtitle: 'Dicas de higiene e conservação diária do seu alinhador.',
      items: [
        'Retire sempre os alinhadores antes de comer ou beber qualquer líquido quente/corante.',
        'Escove os dentes e use o fio dental antes de recolocar os alinhadores na boca.',
        'Limpe seus alinhadores delicadamente usando escova de cerdas macias e sabão neutro.',
        'Sempre guarde seus alinhadores na caixinha de proteção oficial.'
      ]
    }
  ];

  if (activeTeleconsultation) {
    return (
      <TeleconsultationRoom 
        patientName={activeTeleconsultation.patientName} 
        serviceName={activeTeleconsultation.serviceName}
        onClose={() => setActiveTeleconsultation(null)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-nude-warm font-sans flex flex-col">
      {/* Portal Top Navigation bar */}
      <nav className="bg-green-deep text-white px-4 md:px-8 py-4 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-4">
          <BrandLogoHorizontal light={true} />
          <span className="hidden sm:inline-block h-6 w-px bg-white/20"></span>
          <span className="bg-brand-gold/20 text-brand-gold text-[9px] font-bold tracking-widest uppercase px-2.5 py-1 border border-brand-gold/30 rounded-none">
            Portal do Paciente
          </span>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex flex-col items-end text-right">
            <span className="text-xs font-semibold">Amanda Silva Menezes</span>
            <span className="text-[10px] text-neutral-300">Paciente Ativa</span>
          </div>
          <button 
            onClick={onLogout}
            className="flex items-center gap-1 bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-full text-xs text-neutral-200 transition-all border border-white/5"
          >
            <LogOut className="w-3.5 h-3.5" />
            Sair
          </button>
        </div>
      </nav>

      <div className="flex-1 max-w-6xl w-full mx-auto p-4 md:p-8 flex flex-col md:flex-row gap-6">
        {/* Sidebar Menu */}
        <aside className="w-full md:w-64 shrink-0 space-y-2">
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-neutral-100 flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gold-champagne/20 flex items-center justify-center text-gold-matte">
              <User className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[10px] text-neutral-400 font-medium">Bem-vindo(a) de volta,</p>
              <h3 className="text-sm font-semibold text-neutral-800">Amanda Menezes</h3>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-3 shadow-sm border border-neutral-100 space-y-1">
            <button 
              onClick={() => { setActiveTab('home'); resetSchedulingForm(); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-medium transition-all ${activeTab === 'home' ? 'bg-green-deep text-white shadow-sm' : 'text-neutral-500 hover:bg-neutral-50 hover:text-neutral-800'}`}
            >
              <Calendar className="w-4 h-4" />
              Minha Agenda
            </button>
            <button 
              onClick={() => { setActiveTab('schedule'); resetSchedulingForm(); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-medium transition-all ${activeTab === 'schedule' ? 'bg-green-deep text-white shadow-sm' : 'text-neutral-500 hover:bg-neutral-50 hover:text-neutral-800'}`}
            >
              <Sparkles className="w-4 h-4" />
              Agendar Consulta
            </button>
            <button 
              onClick={() => { setActiveTab('documents'); resetSchedulingForm(); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-medium transition-all ${activeTab === 'documents' ? 'bg-green-deep text-white shadow-sm' : 'text-neutral-500 hover:bg-neutral-50 hover:text-neutral-800'}`}
            >
              <FileText className="w-4 h-4" />
              Documentos & Exames
            </button>
            <button 
              onClick={() => { setActiveTab('post-care'); resetSchedulingForm(); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-medium transition-all ${activeTab === 'post-care' ? 'bg-green-deep text-white shadow-sm' : 'text-neutral-500 hover:bg-neutral-50 hover:text-neutral-800'}`}
            >
              <Activity className="w-4 h-4" />
              Orientações Pós-Procedimento
            </button>
          </div>

          {/* Quick Help box */}
          <div className="bg-gold-light/40 border border-gold-champagne/30 rounded-2xl p-5 text-xs text-neutral-700">
            <h4 className="font-semibold text-neutral-800 mb-1.5 flex items-center gap-1.5 text-gold-matte">
              <AlertCircle className="w-4 h-4 shrink-0" />
              Suporte Clínico
            </h4>
            <p className="leading-relaxed mb-3">Se precisar de remarcação urgente ou estiver sentindo desconforto físico, fale direto conosco.</p>
            <a 
              href="https://wa.me/5511995349751" 
              target="_blank" 
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-1.5 w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2 rounded-xl text-[11px] transition-colors shadow-sm"
            >
              <Smartphone className="w-3.5 h-3.5" />
              Falar no WhatsApp
            </a>
          </div>
        </aside>

        {/* Content Section */}
        <main className="flex-1 bg-white p-5 md:p-8 rounded-3xl shadow-sm border border-neutral-100 min-h-[500px]">
          
          {/* TAB: HOME / APPOINTMENTS LIST */}
          {activeTab === 'home' && (
            <div className="space-y-6">
              <div className="border-b border-neutral-100 pb-4">
                <h2 className="font-serif text-lg text-green-deep">Seus Agendamentos</h2>
                <p className="text-xs text-neutral-400">Gerencie suas consultas agendadas, retornos e acesse salas de teleconsulta.</p>
              </div>

              {activeAppointments.length === 0 ? (
                <div className="text-center py-12 border-2 border-dashed border-neutral-100 rounded-3xl">
                  <Calendar className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
                  <p className="text-sm font-semibold text-neutral-600">Nenhum agendamento ativo</p>
                  <p className="text-xs text-neutral-400 mt-1 max-w-xs mx-auto mb-4">Você ainda não possui consultas marcadas. Agende uma avaliação gratuita agora mesmo!</p>
                  <button 
                    onClick={() => setActiveTab('schedule')}
                    className="px-4 py-2 bg-green-deep text-white font-semibold rounded-xl text-xs hover:bg-green-deep/90 transition-all shadow-md"
                  >
                    Agendar Agora
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {activeAppointments.map((app) => (
                    <div 
                      key={app.id} 
                      className={`p-5 rounded-2xl border transition-all ${app.type === 'teleconsulta' ? 'border-amber-200 bg-amber-50/20' : 'border-neutral-100 bg-white'} hover:shadow-md`}
                    >
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex gap-3.5">
                          <div className={`w-12 h-12 rounded-xl flex flex-col items-center justify-center font-mono shrink-0 ${app.type === 'teleconsulta' ? 'bg-amber-100 text-amber-800' : 'bg-green-deep/5 text-green-deep'}`}>
                            <span className="text-xs font-bold">{app.date.split('-')[2]}</span>
                            <span className="text-[9px] uppercase">{app.date.split('-')[1]}</span>
                          </div>
                          <div>
                            <span className={`inline-block text-[10px] px-2 py-0.5 rounded-full font-medium mb-1 ${app.type === 'teleconsulta' ? 'bg-amber-100 text-amber-800' : 'bg-green-50 text-green-800'}`}>
                              {app.type === 'teleconsulta' ? 'Online / Vídeo' : 'Presencial na Clínica'}
                            </span>
                            <h4 className="text-sm font-semibold text-neutral-800">{app.serviceName}</h4>
                            <div className="flex items-center gap-3 text-neutral-500 text-xs mt-1">
                              <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {app.time}</span>
                              <span className="flex items-center gap-1">
                                <span className={`w-2 h-2 rounded-full ${app.status === 'approved' ? 'bg-green-500' : 'bg-yellow-500'}`} />
                                {app.status === 'approved' ? 'Confirmado' : 'Aguardando Aprovação'}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 self-end md:self-center">
                          {app.type === 'teleconsulta' && app.status === 'approved' && (
                            <button 
                              onClick={() => setActiveTeleconsultation(app)}
                              className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-neutral-950 font-semibold rounded-xl text-xs flex items-center gap-1.5 transition-all shadow-md"
                            >
                              <Video className="w-4 h-4 animate-pulse" />
                              Entrar na Consulta
                            </button>
                          )}
                          <button 
                            onClick={() => handleCancelAppointment(app.id)}
                            className="px-3 py-2 bg-neutral-50 hover:bg-red-50 text-neutral-400 hover:text-red-600 rounded-xl text-xs font-medium transition-all border border-neutral-100"
                          >
                            Cancelar
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB: SCHEDULE A CONSULTATION */}
          {activeTab === 'schedule' && (
            <div className="space-y-6">
              <div className="border-b border-neutral-100 pb-4">
                <h2 className="font-serif text-lg text-green-deep">Novo Agendamento Inteligente</h2>
                <p className="text-xs text-neutral-400">Escolha o serviço, modalidade da consulta e selecione o melhor horário com confirmação automática.</p>
              </div>

              {checkoutStep === 'form' && (
                <form onSubmit={handleCreateAppointment} className="space-y-4 text-xs">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    
                    {/* Select Service */}
                    <div className="space-y-1.5">
                      <label className="font-medium text-neutral-700">Selecione o Procedimento ou Avaliação:</label>
                      <select 
                        value={selectedService}
                        onChange={(e) => setSelectedService(e.target.value)}
                        className="w-full bg-white border border-neutral-200 rounded-xl px-3 py-2.5 text-xs text-neutral-800 focus:outline-none focus:border-green-deep focus:ring-1 focus:ring-green-deep"
                        required
                      >
                        <option value="">Selecione um serviço...</option>
                        <option value="avaliacao-gratuita">Avaliação Clínica Geral Integrada (Gratuita)</option>
                        <option value="avaliacao-estetica">Avaliação Harmonização Facial e Botox (Gratuita)</option>
                        {INITIAL_SERVICES.map(s => (
                          <option key={s.id} value={s.id}>{s.name} ({s.priceEstimate || 'R$ 250'})</option>
                        ))}
                      </select>
                    </div>

                    {/* Consultation Type */}
                    <div className="space-y-1.5">
                      <label className="font-medium text-neutral-700">Modalidade de Atendimento:</label>
                      <div className="grid grid-cols-2 gap-2">
                        <button 
                          type="button"
                          onClick={() => setConsultationType('presencial')}
                          className={`py-2.5 rounded-xl border text-xs font-medium flex items-center justify-center gap-1.5 transition-all ${consultationType === 'presencial' ? 'border-green-deep bg-green-deep/5 text-green-deep font-semibold' : 'border-neutral-200 hover:bg-neutral-50 text-neutral-500'}`}
                        >
                          <Smartphone className="w-4 h-4" />
                          Presencial na Clínica
                        </button>
                        <button 
                          type="button"
                          onClick={() => setConsultationType('teleconsulta')}
                          className={`py-2.5 rounded-xl border text-xs font-medium flex items-center justify-center gap-1.5 transition-all ${consultationType === 'teleconsulta' ? 'border-amber-500 bg-amber-50/30 text-amber-900 font-semibold' : 'border-neutral-200 hover:bg-neutral-50 text-neutral-500'}`}
                        >
                          <Video className="w-4 h-4" />
                          Teleconsulta Online
                        </button>
                      </div>
                    </div>

                    {/* Select Date */}
                    <div className="space-y-1.5">
                      <label className="font-medium text-neutral-700">Escolha o Dia:</label>
                      <input 
                        type="date" 
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        min="2026-07-03"
                        className="w-full bg-white border border-neutral-200 rounded-xl px-3 py-2 text-xs text-neutral-800 focus:outline-none focus:border-green-deep"
                        required
                      />
                    </div>

                    {/* Select Time */}
                    <div className="space-y-1.5">
                      <label className="font-medium text-neutral-700">Selecione o Horário Disponível:</label>
                      <div className="grid grid-cols-4 gap-2">
                        {availableHours.map((hour) => (
                          <button
                            key={hour}
                            type="button"
                            onClick={() => setSelectedTime(hour)}
                            className={`py-2 rounded-lg border text-xs transition-all ${selectedTime === hour ? 'border-green-deep bg-green-deep text-white font-semibold' : 'border-neutral-200 hover:bg-neutral-50 text-neutral-700'}`}
                          >
                            {hour}
                          </button>
                        ))}
                      </div>
                    </div>

                  </div>

                  {consultationType === 'teleconsulta' && (
                    <div className="bg-amber-50/50 border border-amber-200/50 p-4 rounded-2xl mt-4">
                      <span className="font-semibold text-amber-800 flex items-center gap-1 mb-1">
                        <Video className="w-4 h-4 text-amber-600" />
                        Incluso na Teleconsulta
                      </span>
                      <p className="text-[11px] text-neutral-600 leading-relaxed">As teleconsultas com a Dra. Claudia contam com triagem especializada, sala de vídeo HD própria com compartilhamento de tela para planejamento 3D, chat seguro, orientações ao vivo e receita digital com assinatura certificada válida em qualquer farmácia do país.</p>
                      <p className="text-[11px] font-semibold text-neutral-800 mt-2">Valor da Consulta Online: R$ 250,00 (pode ser descontado do futuro tratamento presencial)</p>
                    </div>
                  )}

                  <button 
                    type="submit"
                    className="w-full mt-4 py-3 bg-green-deep text-white font-semibold rounded-xl text-xs hover:bg-green-deep/90 transition-all shadow-md flex items-center justify-center gap-1.5"
                  >
                    {consultationType === 'teleconsulta' ? 'Proceder para Pagamento Seguro' : 'Confirmar Agendamento Presencial'}
                  </button>
                </form>
              )}

              {/* ONLINE PAYMENT STEP */}
              {checkoutStep === 'payment' && (
                <div className="space-y-6">
                  <div className="bg-neutral-50 p-4 rounded-2xl flex items-center justify-between border border-neutral-100">
                    <div className="flex items-center gap-2">
                      <ArrowLeft 
                        onClick={() => setCheckoutStep('form')} 
                        className="w-5 h-5 text-neutral-500 hover:text-neutral-800 cursor-pointer" 
                      />
                      <div>
                        <span className="text-[10px] text-neutral-400 block font-medium">Você está agendando:</span>
                        <h4 className="text-xs font-semibold text-neutral-800">
                          {INITIAL_SERVICES.find(s => s.id === selectedService)?.name || 'Consulta Online'}
                        </h4>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-green-deep">R$ 250,00</span>
                  </div>

                  <form onSubmit={handlePaymentSubmit} className="space-y-4 text-xs">
                    <span className="font-medium text-neutral-700 block">Forma de Pagamento Integrada (Mercado Pago / Stripe):</span>
                    
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('pix')}
                        className={`py-3 rounded-xl border flex flex-col items-center gap-1 transition-all ${paymentMethod === 'pix' ? 'border-green-deep bg-green-deep/5 text-green-deep font-semibold' : 'border-neutral-200 hover:bg-neutral-50 text-neutral-500'}`}
                      >
                        <span className="text-lg">⚡</span>
                        <span>Pix Copie e Cole</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('cartao')}
                        className={`py-3 rounded-xl border flex flex-col items-center gap-1 transition-all ${paymentMethod === 'cartao' ? 'border-green-deep bg-green-deep/5 text-green-deep font-semibold' : 'border-neutral-200 hover:bg-neutral-50 text-neutral-500'}`}
                      >
                        <CreditCard className="w-4 h-4 text-neutral-600" />
                        <span>Cartão de Crédito</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('boleto')}
                        className={`py-3 rounded-xl border flex flex-col items-center gap-1 transition-all ${paymentMethod === 'boleto' ? 'border-green-deep bg-green-deep/5 text-green-deep font-semibold' : 'border-neutral-200 hover:bg-neutral-50 text-neutral-500'}`}
                      >
                        <span className="text-lg">📄</span>
                        <span>Boleto Bancário</span>
                      </button>
                    </div>

                    {paymentMethod === 'pix' && (
                      <div className="bg-green-50/50 border border-green-200/50 p-5 rounded-2xl flex flex-col items-center text-center space-y-3">
                        <div className="w-32 h-32 bg-white p-2 rounded-xl border border-neutral-100 flex items-center justify-center">
                          {/* Simulated QR Code */}
                          <div className="w-full h-full bg-neutral-900 flex flex-col items-center justify-center text-white p-2 text-center rounded-lg">
                            <span className="text-[8px] tracking-widest leading-none mb-1 font-mono">PIX CLINICA CF</span>
                            <span className="text-2xl">📱</span>
                          </div>
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-neutral-800">Chave Pix Copie e Cole:</p>
                          <p className="text-[10px] text-neutral-500 font-mono bg-white px-3 py-1.5 rounded-lg border border-neutral-100 mt-1 select-all break-all">
                            00020126360014BR.GOV.BCB.PIX0114claudiafranca0002500
                          </p>
                        </div>
                        <p className="text-[10px] text-neutral-400">Após realizar o pagamento no seu banco, o sistema irá aprovar automaticamente o agendamento em instantes.</p>
                      </div>
                    )}

                    {paymentMethod === 'cartao' && (
                      <div className="space-y-3 border border-neutral-100 p-4 rounded-2xl bg-neutral-50">
                        <div className="space-y-1">
                          <label className="text-neutral-500 font-medium">Número do Cartão:</label>
                          <input 
                            type="text" 
                            placeholder="4532 1109 8832 1099" 
                            value={cardNumber}
                            onChange={(e) => setCardNumber(e.target.value)}
                            className="w-full bg-white border border-neutral-200 rounded-xl px-3 py-2 text-xs text-neutral-800"
                            required
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-neutral-500 font-medium">Nome no Cartão:</label>
                          <input 
                            type="text" 
                            placeholder="AMANDA S MENEZES" 
                            value={cardHolder}
                            onChange={(e) => setCardHolder(e.target.value)}
                            className="w-full bg-white border border-neutral-200 rounded-xl px-3 py-2 text-xs text-neutral-800"
                            required
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <label className="text-neutral-500 font-medium">Validade:</label>
                            <input 
                              type="text" 
                              placeholder="12/29" 
                              value={cardExpiry}
                              onChange={(e) => setCardExpiry(e.target.value)}
                              className="w-full bg-white border border-neutral-200 rounded-xl px-3 py-2 text-xs text-neutral-800"
                              required
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-neutral-500 font-medium">CVV:</label>
                            <input 
                              type="password" 
                              placeholder="***" 
                              value={cardCVV}
                              onChange={(e) => setCardCVV(e.target.value)}
                              className="w-full bg-white border border-neutral-200 rounded-xl px-3 py-2 text-xs text-neutral-800"
                              maxLength={3}
                              required
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {paymentMethod === 'boleto' && (
                      <div className="bg-neutral-50 border border-neutral-150 p-4 rounded-2xl text-center">
                        <p className="font-semibold text-neutral-700">Boleto Bancário Gerado com Sucesso</p>
                        <p className="text-[10px] text-neutral-400 mt-1">O boleto tem vencimento para amanhã. O agendamento será aprovado assim que houver a compensação bancária (até 24h).</p>
                        <button 
                          type="button" 
                          onClick={() => alert('Boleto PDF enviado para seu e-mail cadastrado!')}
                          className="mt-3 px-4 py-1.5 bg-neutral-200 hover:bg-neutral-300 text-neutral-700 font-semibold rounded-lg text-[10px] transition-colors"
                        >
                          Imprimir Boleto PDF
                        </button>
                      </div>
                    )}

                    <button
                      type="submit"
                      className="w-full py-3 bg-green-deep text-white font-semibold rounded-xl text-xs hover:bg-green-deep/90 transition-all shadow-md flex items-center justify-center gap-1.5"
                    >
                      <CreditCard className="w-4 h-4" />
                      Pagar e Agendar Consulta Online (R$ 250,00)
                    </button>
                  </form>
                </div>
              )}

              {checkoutStep === 'success' && (
                <div className="text-center py-12 space-y-4">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto text-green-600">
                    <CheckCircle className="w-10 h-10" />
                  </div>
                  <h3 className="font-serif text-lg text-green-deep">Consulta Online Agendada!</h3>
                  <p className="text-xs text-neutral-500 max-w-sm mx-auto leading-relaxed">
                    Seu pagamento de <strong>R$ 250,00</strong> foi processado com sucesso. O agendamento para o dia <strong>{selectedDate}</strong> às <strong>{selectedTime}</strong> está confirmado e disponível na sua agenda!
                  </p>
                  <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
                    <button 
                      onClick={() => { setActiveTab('home'); resetSchedulingForm(); }}
                      className="px-5 py-2.5 bg-green-deep text-white font-semibold rounded-xl text-xs hover:bg-green-deep/90 transition-all shadow-md"
                    >
                      Ir para Meus Agendamentos
                    </button>
                    <button 
                      onClick={() => resetSchedulingForm()}
                      className="px-5 py-2.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-semibold rounded-xl text-xs transition-all"
                    >
                      Agendar Outro Procedimento
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB: DOCUMENTS & PRESCRIPTIONS */}
          {activeTab === 'documents' && (
            <div className="space-y-6">
              <div className="border-b border-neutral-100 pb-4">
                <h2 className="font-serif text-lg text-green-deep">Meus Documentos Clínicos</h2>
                <p className="text-xs text-neutral-400">Acesse receitas digitais assinadas, atestados, guias de orientações e exames de imagem.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border border-neutral-100 rounded-2xl hover:shadow-sm transition-all flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-green-deep/5 flex items-center justify-center text-green-deep shrink-0">
                    <FileCheck className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-semibold text-neutral-800 truncate">Escaneamento_Arcada_3D.pdf</h4>
                    <p className="text-[10px] text-neutral-400">Escaneamento Digital de Modelagem • 10/05/2026</p>
                    <button 
                      onClick={() => alert('Baixando exame de escaneamento 3D...')}
                      className="text-[11px] text-gold-matte hover:underline mt-1 font-medium inline-block"
                    >
                      Visualizar Laudo
                    </button>
                  </div>
                  <span className="text-[10px] text-neutral-400 font-mono">4.2 MB</span>
                </div>

                <div className="p-4 border border-neutral-100 rounded-2xl hover:shadow-sm transition-all flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-green-deep/5 flex items-center justify-center text-green-deep shrink-0">
                    <FileCheck className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-semibold text-neutral-800 truncate">Contrato_Invisalign_Assinado.pdf</h4>
                    <p className="text-[10px] text-neutral-400">Contrato de Prestação de Serviços • 12/05/2026</p>
                    <button 
                      onClick={() => alert('Exibindo contrato assinado digitalmente...')}
                      className="text-[11px] text-gold-matte hover:underline mt-1 font-medium inline-block"
                    >
                      Visualizar Contrato
                    </button>
                  </div>
                  <span className="text-[10px] text-neutral-400 font-mono">1.8 MB</span>
                </div>

                <div className="p-4 border border-neutral-100 rounded-2xl hover:shadow-sm transition-all flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-600 shrink-0">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-semibold text-neutral-800 truncate">Receita_Botox_Terapeutico.pdf</h4>
                    <p className="text-[10px] text-neutral-400">Prescrição de Medicamentos Assinada ICP-Brasil • 01/06/2026</p>
                    <button 
                      onClick={() => alert('Exibindo receita com assinatura eletrônica válida nacionalmente...')}
                      className="text-[11px] text-gold-matte hover:underline mt-1 font-medium inline-block"
                    >
                      Baixar Receita Farmácia
                    </button>
                  </div>
                  <span className="text-[10px] text-neutral-400 font-mono">850 KB</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB: POST PROCEDURE ORIENTATIONS */}
          {activeTab === 'post-care' && (
            <div className="space-y-6">
              <div className="border-b border-neutral-100 pb-4">
                <h2 className="font-serif text-lg text-green-deep">Orientações Pós-Procedimento Personalizadas</h2>
                <p className="text-xs text-neutral-400">Instruções médicas detalhadas para garantir o sucesso total do seu tratamento estético e funcional.</p>
              </div>

              <div className="space-y-4">
                {postCareInstructions.map((group, index) => (
                  <div key={index} className="bg-neutral-50 p-6 rounded-2xl border border-neutral-100">
                    <h4 className="font-serif text-sm text-green-deep mb-1 font-semibold">{group.title}</h4>
                    <p className="text-[11px] text-neutral-400 mb-4">{group.subtitle}</p>
                    <ul className="space-y-2.5">
                      {group.items.map((item, i) => (
                        <li key={i} className="flex gap-2.5 items-start text-xs text-neutral-700 leading-relaxed">
                          <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}
