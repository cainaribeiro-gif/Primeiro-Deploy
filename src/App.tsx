/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Sparkles, Calendar, Laptop, LogIn, Lock, Mail, Phone, X, Check, Eye } from 'lucide-react';
import LandingPage from './components/LandingPage';
import PatientPortal from './components/PatientPortal';
import AdminDashboard from './components/AdminDashboard';
import RestrictedLoginPage from './components/RestrictedLoginPage';
import { INITIAL_APPOINTMENTS, INITIAL_LEADS, INITIAL_REVIEWS } from './mockData';
import { Appointment, Lead, SiteContent, Review } from './types';
import { DEFAULT_SITE_CONTENT } from './defaultSiteContent';
import { sendLeadToSupabase } from './lib/supabase';

export default function App() {
  // Global shared state for real-time interaction simulation
  const [appointments, setAppointments] = useState<Appointment[]>(INITIAL_APPOINTMENTS);
  const [leads, setLeads] = useState<Lead[]>(INITIAL_LEADS);
  const [reviews, setReviews] = useState<Review[]>(() => {
    const saved = localStorage.getItem('google_reviews_cache');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error parsing google_reviews_cache', e);
      }
    }
    // Default to initial reviews, pre-approved
    return INITIAL_REVIEWS.map(r => ({ ...r, approved: true, source: 'google' }));
  });

  // Keep localStorage in sync with reviews
  useEffect(() => {
    localStorage.setItem('google_reviews_cache', JSON.stringify(reviews));
  }, [reviews]);

  // Load reviews from Supabase if available
  useEffect(() => {
    const loadSupabaseReviews = async () => {
      try {
        const { fetchReviewsFromSupabase } = await import('./lib/supabase');
        const dbReviews = await fetchReviewsFromSupabase();
        if (dbReviews && dbReviews.length > 0) {
          setReviews(dbReviews);
        }
      } catch (err) {
        console.warn('Erro ao carregar avaliações do Supabase:', err);
      }
    };
    loadSupabaseReviews();
  }, []);

  // CMS Content State
  const [siteContent, setSiteContent] = useState<SiteContent>(() => {
    const saved = localStorage.getItem('site_content');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.clinicSpaces) {
          parsed.clinicSpaces = parsed.clinicSpaces.map((space: any) => {
            if (space.id === 'fachada' && space.imageUrl === 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&q=80&w=800') {
              space.imageUrl = DEFAULT_SITE_CONTENT.clinicSpaces[0].imageUrl;
            }
            return space;
          });
        }
        return parsed;
      } catch (e) {
        console.error('Error parsing site_content', e);
      }
    }
    return DEFAULT_SITE_CONTENT;
  });

  const [isEditMode, setIsEditMode] = useState<boolean>(false);

  const handleSaveSiteContent = (newContent: SiteContent) => {
    setSiteContent(newContent);
    localStorage.setItem('site_content', JSON.stringify(newContent));
  };

  // App viewport routing: 'landing' | 'patient' | 'admin' | 'login'
  const [currentView, setCurrentView] = useState<'landing' | 'patient' | 'admin' | 'login'>('landing');

  // Monitor URL Hash for navigation routing (e.g., #login)
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash === '#login') {
        setCurrentView('login');
      } else if (hash === '#patient') {
        setCurrentView('patient');
      } else if (hash === '#admin') {
        setCurrentView('admin');
      } else if (!hash || hash === '#' || hash.startsWith('#sobre') || hash.startsWith('#clinica') || hash.startsWith('#servicos') || hash.startsWith('#resultados') || hash.startsWith('#depoimentos') || hash.startsWith('#blog') || hash.startsWith('#contato')) {
        setCurrentView('landing');
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleLogout = () => {
    window.location.hash = '';
    setCurrentView('landing');
  };

  // Handle lead creation from Landing Page form
  const handleNewLeadCreated = (
    leadName: string, 
    leadPhone: string, 
    serviceInterested: string,
    leadEmail?: string,
    leadWhatsapp?: string,
    leadMessage?: string,
    customQuestions?: { question: string; answer: string }[],
    attachedFiles?: { name: string; size: string; type: string }[]
  ) => {
    const newL: Lead = {
      id: `lead-${Date.now()}`,
      name: leadName,
      email: leadEmail || `${leadName.toLowerCase().replace(/\s/g, '')}@exemplo.com`,
      phone: leadPhone,
      whatsapp: leadWhatsapp || leadPhone,
      serviceInterested: serviceInterested,
      stage: 'novo',
      value: serviceInterested.toLowerCase().includes('invisalign') ? 12000 : serviceInterested.toLowerCase().includes('implante') ? 4500 : 2500,
      date: new Date().toISOString().split('T')[0],
      notes: leadMessage || '',
      source: 'Formulário do Site',
      customQuestions: customQuestions || [],
      attachedFiles: attachedFiles || []
    };
    // Sync to mock CRM list so Admin can see it immediately!
    setLeads(prev => [newL, ...prev]);

    // Send newly created lead / pre-appointment to Supabase background service
    sendLeadToSupabase(newL).catch(err => {
      console.error('Falha assíncrona ao sincronizar lead com o Supabase:', err);
    });
  };

  return (
    <div className="min-h-screen bg-nude-warm">
      
      {/* 1. Main views router */}
      {currentView === 'landing' && (
        <LandingPage 
          onNewLeadCreated={handleNewLeadCreated}
          siteContent={siteContent}
          onSaveSiteContent={handleSaveSiteContent}
          isEditMode={isEditMode}
          setIsEditMode={setIsEditMode}
          reviews={reviews}
        />
      )}

      {currentView === 'patient' && (
        <PatientPortal 
          initialAppointments={appointments} 
          onLogout={handleLogout} 
        />
      )}

      {currentView === 'admin' && (
        <AdminDashboard 
          onLogout={handleLogout} 
          leads={leads}
          setLeads={setLeads}
          appointments={appointments}
          setAppointments={setAppointments}
          reviews={reviews}
          setReviews={setReviews}
        />
      )}

      {currentView === 'login' && (
        <RestrictedLoginPage 
          onLoginSuccess={(role) => {
            window.location.hash = role;
            setCurrentView(role);
          }}
          onBackToLanding={handleLogout}
          siteContent={siteContent}
          onSaveSiteContent={handleSaveSiteContent}
        />
      )}

    </div>
  );
}
