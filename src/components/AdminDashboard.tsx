/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  BarChart3, Users, Calendar as CalendarIcon, DollarSign, Settings2, Target, Eye, 
  TrendingUp, ArrowRight, UserPlus, FileText, Search, Plus, Trash2, Edit2, Check,
  X, Filter, CalendarDays, Clock, HelpCircle, Briefcase, ChevronRight, Tag, Share2,
  Paperclip, MessageSquare, Sparkles, Database, Star, BookOpen, Save, UploadCloud, ShieldCheck, MapPin, Settings
} from 'lucide-react';
import { getSupabaseConfig, SUPABASE_SQL_SCHEMA, syncPendingData, sendLeadToSupabase, sendAppointmentToSupabase, sendReviewToSupabase } from '../lib/supabase';
import { motion } from 'motion/react';
import { ToothIcon } from './BrandLogo';
import { 
  Patient, Lead, Appointment, BlogPost, Review, FinanceRecord, MarketingCampaign, CRMStage, SiteContent 
} from '../types';
import { 
  INITIAL_PATIENTS, INITIAL_LEADS, INITIAL_APPOINTMENTS, INITIAL_SERVICES, 
  INITIAL_BLOG_POSTS, INITIAL_REVIEWS, INITIAL_FINANCE_RECORDS, INITIAL_CAMPAIGNS 
} from '../mockData';

interface AdminDashboardProps {
  onLogout: () => void;
  leads?: Lead[];
  setLeads?: React.Dispatch<React.SetStateAction<Lead[]>>;
  appointments?: Appointment[];
  setAppointments?: React.Dispatch<React.SetStateAction<Appointment[]>>;
  reviews?: Review[];
  setReviews?: React.Dispatch<React.SetStateAction<Review[]>>;
  siteContent?: SiteContent;
  onSaveSiteContent?: (newContent: SiteContent) => void;
  isEditMode?: boolean;
  setIsEditMode?: (active: boolean) => void;
  setCurrentView?: (view: 'landing' | 'patient' | 'admin' | 'login') => void;
}

export default function AdminDashboard({ 
  onLogout,
  leads: propLeads,
  setLeads: propSetLeads,
  appointments: propAppointments,
  setAppointments: propSetAppointments,
  reviews: propReviews,
  setReviews: propSetReviews,
  siteContent,
  onSaveSiteContent,
  isEditMode,
  setIsEditMode,
  setCurrentView
}: AdminDashboardProps) {
  // Global admin states initialized from our mockup data
  const [patients, setPatients] = useState<Patient[]>(INITIAL_PATIENTS);
  const [localLeads, setLocalLeads] = useState<Lead[]>(INITIAL_LEADS);
  const [localAppointments, setLocalAppointments] = useState<Appointment[]>(INITIAL_APPOINTMENTS);
  const [localReviews, setLocalReviews] = useState<Review[]>(() => {
    return INITIAL_REVIEWS.map(r => ({ ...r, approved: true, source: 'google' }));
  });

  const leads = propLeads !== undefined ? propLeads : localLeads;
  const setLeads = propSetLeads !== undefined ? propSetLeads : setLocalLeads;

  const appointments = propAppointments !== undefined ? propAppointments : localAppointments;
  const setAppointments = propSetAppointments !== undefined ? propSetAppointments : setLocalAppointments;

  const reviews = propReviews !== undefined ? propReviews : localReviews;
  const setReviews = propSetReviews !== undefined ? propSetReviews : setLocalReviews;

  const [financeRecords, setFinanceRecords] = useState<FinanceRecord[]>(INITIAL_FINANCE_RECORDS);
  const [campaigns, setCampaigns] = useState<MarketingCampaign[]>(INITIAL_CAMPAIGNS);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>(() => {
    const saved = localStorage.getItem('blog_posts_cache');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error parsing blog posts cache in admin', e);
      }
    }
    return INITIAL_BLOG_POSTS;
  });

  // Persist blogPosts state to localStorage cache
  useEffect(() => {
    localStorage.setItem('blog_posts_cache', JSON.stringify(blogPosts));
  }, [blogPosts]);

  // New selected lead state for full clinical triaging review
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  // Navigation state inside admin panel
  const [activeTab, setActiveTab] = useState<'insights' | 'crm' | 'patients' | 'agenda' | 'finance' | 'website' | 'supabase' | 'reviews' | 'identity'>('insights');
  const [copiedSql, setCopiedSql] = useState(false);
  const [isSyncingSupabase, setIsSyncingSupabase] = useState(false);
  const [syncFeedback, setSyncFeedback] = useState('');
  
  // Search and filters
  const [patientSearch, setPatientSearch] = useState('');
  const [crmFilter, setCrmFilter] = useState<string>('todos');

  // Detail view modallers
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [showAddPatientModal, setShowAddPatientModal] = useState(false);
  const [showAddLeadModal, setShowAddLeadModal] = useState(false);

  // State to simulate website text edits, initialized from siteContent prop
  const [headline, setHeadline] = useState(() => siteContent?.heroTitle || 'Tratamento com empatia para transformar sorrisos e vidas.');
  const [subHeadline, setSubHeadline] = useState(() => siteContent?.heroSubtitle || 'Excelência técnica, estética avançada e atendimento humanizado.');
  const [seoDescription, setSeoDescription] = useState('Dra. Claudia França - Especialista em Harmonização Orofacial, Invisalign, Implantes Dentários de carga imediata no Cambuci, São Paulo.');

  // Sync states if siteContent changes
  useEffect(() => {
    if (siteContent) {
      if (siteContent.heroTitle) setHeadline(siteContent.heroTitle);
      if (siteContent.heroSubtitle) setSubHeadline(siteContent.heroSubtitle);
    }
  }, [siteContent]);

  // Brand identity handlers
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>, field: 'logoPrincipal' | 'logoClara' | 'logoEscura' | 'favicon') => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string' && onSaveSiteContent && siteContent) {
        const updated = {
          ...siteContent,
          [field]: reader.result
        } as SiteContent;
        onSaveSiteContent(updated);
        // Trigger global BrandLogo update
        window.dispatchEvent(new Event('brand_update'));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveLogo = (field: 'logoPrincipal' | 'logoClara' | 'logoEscura' | 'favicon') => {
    if (onSaveSiteContent && siteContent) {
      const updated = {
        ...siteContent,
        [field]: ''
      } as SiteContent;
      onSaveSiteContent(updated);
      // Trigger global BrandLogo update
      window.dispatchEvent(new Event('brand_update'));
    }
  };

  const handleColorChange = (field: 'brandColorPrimary' | 'brandColorSecondary' | 'brandColorBackground', value: string) => {
    if (onSaveSiteContent && siteContent) {
      const updated = {
        ...siteContent,
        [field]: value
      } as SiteContent;
      onSaveSiteContent(updated);
      // Trigger global BrandLogo update
      window.dispatchEvent(new Event('brand_update'));
    }
  };

  const handleColorPreset = (primary: string, secondary: string, background: string) => {
    if (onSaveSiteContent && siteContent) {
      const updated = {
        ...siteContent,
        brandColorPrimary: primary,
        brandColorSecondary: secondary,
        brandColorBackground: background
      } as SiteContent;
      onSaveSiteContent(updated);
      // Trigger global BrandLogo update
      window.dispatchEvent(new Event('brand_update'));
    }
  };

  const handleFieldChange = (field: keyof SiteContent, value: string) => {
    if (onSaveSiteContent && siteContent) {
      const updated = {
        ...siteContent,
        [field]: value
      } as SiteContent;
      onSaveSiteContent(updated);
      // Trigger global BrandLogo update
      window.dispatchEvent(new Event('brand_update'));
    }
  };

  const handleSaveVisualIdentity = () => {
    if (siteContent) {
      localStorage.setItem('site_content', JSON.stringify(siteContent));
      window.dispatchEvent(new Event('brand_update'));
      alert('Identidade Visual salva com sucesso!');
    }
  };

  // Google Reviews Tab States
  const [placeId, setPlaceId] = useState(() => localStorage.getItem('google_place_id') || 'ChIJy99u_9VZzpQRrW4Y3_3vA9M');
  const [googleApiKey, setGoogleApiKey] = useState(() => localStorage.getItem('google_api_key') || '');
  const [reviewSearchText, setReviewSearchText] = useState('');
  const [reviewTabFilter, setReviewTabFilter] = useState<'all' | 'approved' | 'pending'>('all');
  const [simulatingFetch, setSimulatingFetch] = useState(false);
  const [simAuthor, setSimAuthor] = useState('');
  const [simRating, setSimRating] = useState<number>(5);
  const [simText, setSimText] = useState('');
  const [simTreatment, setSimTreatment] = useState('Invisalign');
  const [showAddSimReview, setShowAddSimReview] = useState(false);

  // Form states for adding new elements
  const [newPatientName, setNewPatientName] = useState('');
  const [newPatientEmail, setNewPatientEmail] = useState('');
  const [newPatientPhone, setNewPatientPhone] = useState('');
  const [newPatientSource, setNewPatientSource] = useState<'Google Search' | 'Instagram' | 'Indicação' | 'WhatsApp' | 'Google Ads'>('Instagram');
  const [newPatientNotes, setNewPatientNotes] = useState('');

  const [newLeadName, setNewLeadName] = useState('');
  const [newLeadPhone, setNewLeadPhone] = useState('');
  const [newLeadService, setNewLeadService] = useState('Invisalign');
  const [newLeadValue, setNewLeadValue] = useState(5000);
  const [newLeadSource, setNewLeadSource] = useState('Instagram');

  // Blog Management States
  const [isBlogModalOpen, setIsBlogModalOpen] = useState(false);
  const [editingBlogPost, setEditingBlogPost] = useState<BlogPost | null>(null);
  const [blogFormTitle, setBlogFormTitle] = useState('');
  const [blogFormExcerpt, setBlogFormExcerpt] = useState('');
  const [blogFormContent, setBlogFormContent] = useState('');
  const [blogFormCategory, setBlogFormCategory] = useState('');
  const [blogFormReadTime, setBlogFormReadTime] = useState('');
  const [blogFormImageUrl, setBlogFormImageUrl] = useState('');
  const [blogFormAuthor, setBlogFormAuthor] = useState('Dra. Claudia França');

  // Blog Management Helper Functions
  const openNewBlogModal = () => {
    setEditingBlogPost(null);
    setBlogFormTitle('');
    setBlogFormExcerpt('');
    setBlogFormContent('');
    setBlogFormCategory('Estética');
    setBlogFormReadTime('4 min de leitura');
    setBlogFormImageUrl('');
    setBlogFormAuthor('Dra. Claudia França');
    setIsBlogModalOpen(true);
  };

  const openEditBlogModal = (post: BlogPost) => {
    setEditingBlogPost(post);
    setBlogFormTitle(post.title);
    setBlogFormExcerpt(post.excerpt);
    setBlogFormContent(post.content);
    setBlogFormCategory(post.category);
    setBlogFormReadTime(post.readTime);
    setBlogFormImageUrl(post.imageUrl);
    setBlogFormAuthor(post.author || 'Dra. Claudia França');
    setIsBlogModalOpen(true);
  };

  const handleSaveBlogPost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!blogFormTitle) return;

    if (editingBlogPost) {
      // Editing existing blog post
      setBlogPosts(prev => prev.map(post => {
        if (post.id === editingBlogPost.id) {
          return {
            ...post,
            title: blogFormTitle,
            excerpt: blogFormExcerpt,
            content: blogFormContent,
            category: blogFormCategory,
            readTime: blogFormReadTime,
            imageUrl: blogFormImageUrl,
            author: blogFormAuthor,
            slug: blogFormTitle.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-'),
            tags: post.tags || [blogFormCategory, 'Odontologia', 'Saúde']
          };
        }
        return post;
      }));
    } else {
      // Creating new blog post
      const newPost: BlogPost = {
        id: 'blog-' + Date.now(),
        title: blogFormTitle,
        excerpt: blogFormExcerpt,
        content: blogFormContent,
        category: blogFormCategory,
        date: new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' }),
        readTime: blogFormReadTime,
        imageUrl: blogFormImageUrl || 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=400',
        author: blogFormAuthor,
        slug: blogFormTitle.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-'),
        tags: [blogFormCategory, 'Odontologia', 'Saúde']
      };
      setBlogPosts(prev => [newPost, ...prev]);
    }

    setIsBlogModalOpen(false);
    setEditingBlogPost(null);
  };

  const handleDeleteBlogPost = (postId: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta postagem do blog?')) {
      setBlogPosts(prev => prev.filter(post => post.id !== postId));
    }
  };

  // Google Reviews management handlers
  const handleToggleReviewApproval = (reviewId: string) => {
    setReviews(prev => prev.map(rev => {
      if (rev.id === reviewId) {
        const updated = { ...rev, approved: !rev.approved };
        // Sync with Supabase asynchronously in background
        sendReviewToSupabase(updated).catch(err => {
          console.error('Falha de sincronização Supabase para avaliações:', err);
        });
        return updated;
      }
      return rev;
    }));
  };

  const handleDeleteReview = (reviewId: string) => {
    if (confirm('Tem certeza de que deseja remover esta avaliação? Ela deixará de constar no site.')) {
      setReviews(prev => prev.filter(rev => rev.id !== reviewId));
    }
  };

  const handleSimulateGoogleFetch = () => {
    setSimulatingFetch(true);
    
    // Simulating API loading latency
    setTimeout(() => {
      setSimulatingFetch(false);
      
      const simulatedReviews: Review[] = [
        {
          id: `goog-sim-${Date.now()}-1`,
          author: 'Renata Albuquerque Silveira',
          rating: 5,
          text: 'Fiz harmonização orofacial com a Dra. Claudia e o resultado ficou super natural. Ela é extremamente detalhista, explica cada etapa e nos deixa super segura. A clínica é linda e acolhedora!',
          date: 'Há 1 dia',
          avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',
          treatment: 'Harmonização Orofacial',
          approved: false, // Must be approved by dentist!
          source: 'google'
        },
        {
          id: `goog-sim-${Date.now()}-2`,
          author: 'Thiago Castelli',
          rating: 4,
          text: 'Excelente infraestrutura e atendimento de ponta. Fui para uma limpeza e acabei fazendo clareamento. A doutora é muito atenciosa. Recomendo!',
          date: 'Há 3 dias',
          avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
          treatment: 'Clareamento Dental',
          approved: false, // Must be approved by dentist!
          source: 'google'
        }
      ];

      setReviews(prev => {
        // Prevent adding duplicate simulation items
        const filteredSimulated = simulatedReviews.filter(
          sim => !prev.some(p => p.author === sim.author)
        );
        
        if (filteredSimulated.length === 0) {
          alert('Todas as novas avaliações do Google já foram sincronizadas e estão na fila de moderação!');
          return prev;
        }

        // Add them to the list (they start as unapproved)
        const updated = [...filteredSimulated, ...prev];
        
        // Sync them to Supabase as unapproved
        filteredSimulated.forEach(rev => {
          sendReviewToSupabase(rev).catch(err => console.error(err));
        });

        alert(`Encontramos ${filteredSimulated.length} novas avaliações pendentes na página da clínica no Google! Elas foram adicionadas ao painel para sua aprovação.`);
        return updated;
      });
    }, 1500);
  };

  const handleSimulateUserPost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!simAuthor.trim() || !simText.trim()) {
      alert('Por favor, preencha o nome do autor e o texto da avaliação.');
      return;
    }

    const newSim: Review = {
      id: `goog-user-${Date.now()}`,
      author: simAuthor,
      rating: simRating,
      text: simText,
      date: 'Há alguns segundos',
      avatarUrl: `https://images.unsplash.com/photo-${1500000000000 + Math.floor(Math.random() * 500000)}?auto=format&fit=crop&q=80&w=150`,
      treatment: simTreatment || undefined,
      approved: false, // Must be approved by dentist!
      source: 'google'
    };

    setReviews(prev => [newSim, ...prev]);
    sendReviewToSupabase(newSim).catch(err => console.error(err));
    
    // Clear form
    setSimAuthor('');
    setSimText('');
    setSimTreatment('Invisalign');
    setShowAddSimReview(false);

    alert('Nova avaliação postada no Google simulada com sucesso! Ela está marcada como pendente no painel de moderação para sua aprovação.');
  };

  // Interactive CRM drag/move handler
  const handleMoveLead = (leadId: string, targetStage: CRMStage) => {
    setLeads(prev => prev.map(l => {
      if (l.id === leadId) {
        const updated = { ...l, stage: targetStage };
        sendLeadToSupabase(updated).catch(err => console.error('Erro de sincronização Supabase:', err));
        return updated;
      }
      return l;
    }));
  };

  const handleConvertLeadToPatient = (leadToConvert: Lead) => {
    // Check if already a patient
    const exists = patients.some(p => p.email.toLowerCase() === leadToConvert.email.toLowerCase());
    if (exists) {
      alert(`Este lead (${leadToConvert.name}) já possui um prontuário de paciente cadastrado com este e-mail.`);
      return;
    }

    const mockDocs = (leadToConvert.attachedFiles || []).map((file, idx) => ({
      id: `doc-${Date.now()}-${idx}`,
      name: file.name,
      date: new Date().toISOString().split('T')[0],
      size: file.size,
      type: 'exame' as 'raio-x' | 'receita' | 'consentimento' | 'exame',
      url: '#'
    }));

    const customObs = `Paciente convertido a partir de Lead de triagem clínica no site.\n` +
      `Serviço de interesse: ${leadToConvert.serviceInterested}\n` +
      `Mensagem original: ${leadToConvert.notes || 'Nenhuma'}\n\n` +
      `Respostas da triagem:\n` +
      (leadToConvert.customQuestions || []).map(q => `- ${q.question}: ${q.answer}`).join('\n');

    const sourceMapping = 
      leadToConvert.source.includes('Instagram') ? 'Instagram' :
      leadToConvert.source.includes('WhatsApp') ? 'WhatsApp' :
      leadToConvert.source.includes('Google Ads') ? 'Google Ads' :
      leadToConvert.source.includes('Search') ? 'Google Search' :
      leadToConvert.source.includes('Indicação') ? 'Indicação' : 'Google Ads';

    const newPat: Patient = {
      id: `pat-${Date.now()}`,
      name: leadToConvert.name,
      email: leadToConvert.email,
      phone: leadToConvert.phone,
      birthDate: '1990-01-01',
      leadSource: sourceMapping as any,
      status: 'Ativo',
      history: [
        { 
          date: new Date().toISOString().split('T')[0], 
          description: `Prontuário gerado por conversão de Lead do Site. Triagem clínica integrada com ${mockDocs.length} documentos.`, 
          doctor: 'Dra. Claudia França' 
        }
      ],
      documents: mockDocs,
      observations: customObs,
      createdDate: new Date().toISOString().split('T')[0]
    };

    setPatients(prev => [newPat, ...prev]);
    
    // Also update lead stage to 'concluido' (meaning converted/won!)
    setLeads(prev => prev.map(l => {
      if (l.id === leadToConvert.id) {
        const updated = { ...l, stage: 'concluido' as const };
        sendLeadToSupabase(updated).catch(err => console.error('Erro de sincronização Supabase:', err));
        return updated;
      }
      return l;
    }));
    setSelectedLead(null);
    
    alert(`Sucesso! O lead "${leadToConvert.name}" foi convertido em paciente. Um prontuário clínico premium foi criado automaticamente e os documentos de triagem foram anexados.`);
  };

  // Appointment actions
  const handleApproveAppointment = (id: string) => {
    setAppointments(prev => prev.map(app => {
      if (app.id === id) {
        const updated = { ...app, status: 'approved' as const };
        sendAppointmentToSupabase(updated).catch(err => console.error('Erro de sincronização Supabase:', err));
        return updated;
      }
      return app;
    }));
  };

  const handleCancelAppointment = (id: string) => {
    setAppointments(prev => prev.map(app => {
      if (app.id === id) {
        const updated = { ...app, status: 'cancelled' as const };
        sendAppointmentToSupabase(updated).catch(err => console.error('Erro de sincronização Supabase:', err));
        return updated;
      }
      return app;
    }));
  };

  // Finance actions
  const [newChargeAmount, setNewChargeAmount] = useState(1500);
  const [newChargePatient, setNewChargePatient] = useState('Amanda Silva Menezes');
  const [newChargeCategory, setNewChargeCategory] = useState('Invisalign');
  const [newChargeMethod, setNewChargeMethod] = useState<'pix' | 'cartao' | 'boleto'>('pix');
  const [generatedPaymentLink, setGeneratedPaymentLink] = useState('');

  const handleGeneratePaymentLink = (e: React.FormEvent) => {
    e.preventDefault();
    const mockId = `pay-${Math.floor(Math.random() * 90000) + 10000}`;
    const link = `https://checkout.draclaudiafranca.com.br/pagamento/${mockId}?valor=${newChargeAmount}`;
    setGeneratedPaymentLink(link);

    // Register a pending record in finance
    const newRecord: FinanceRecord = {
      id: mockId,
      type: 'receita',
      amount: newChargeAmount,
      date: new Date().toISOString().split('T')[0],
      category: newChargeCategory,
      status: 'pendente',
      description: `Link de pagamento gerado para ${newChargePatient}`,
      patientName: newChargePatient,
      paymentMethod: newChargeMethod
    };
    setFinanceRecords(prev => [newRecord, ...prev]);
  };

  const handleAddPatient = (e: React.FormEvent) => {
    e.preventDefault();
    const newPat: Patient = {
      id: `pat-${Date.now()}`,
      name: newPatientName,
      email: newPatientEmail,
      phone: newPatientPhone,
      birthDate: '1990-01-01',
      leadSource: newPatientSource,
      status: 'Ativo',
      history: [{ date: new Date().toISOString().split('T')[0], description: 'Cadastro efetuado via painel de controle.', doctor: 'Dra. Claudia França' }],
      documents: [],
      observations: newPatientNotes,
      createdDate: new Date().toISOString().split('T')[0]
    };
    setPatients(prev => [newPat, ...prev]);
    setShowAddPatientModal(false);
    
    // Reset forms
    setNewPatientName('');
    setNewPatientEmail('');
    setNewPatientPhone('');
    setNewPatientNotes('');
  };

  const handleAddLead = (e: React.FormEvent) => {
    e.preventDefault();
    const newL: Lead = {
      id: `lead-${Date.now()}`,
      name: newLeadName,
      email: `${newLeadName.toLowerCase().replace(/\s/g, '')}@exemplo.com`,
      phone: newLeadPhone,
      serviceInterested: newLeadService,
      stage: 'novo',
      value: Number(newLeadValue),
      date: new Date().toISOString().split('T')[0],
      source: newLeadSource
    };
    setLeads(prev => [newL, ...prev]);
    
    // Sync manually created lead/pre-appointment to Supabase
    sendLeadToSupabase(newL).catch(err => {
      console.error('Erro assíncrono ao sincronizar lead manual no Supabase:', err);
    });

    setShowAddLeadModal(false);

    setNewLeadName('');
    setNewLeadPhone('');
    setNewLeadValue(5000);
  };

  // CALCULATIONS FOR DASHBOARDS
  const totalBilling = financeRecords
    .filter(r => r.type === 'receita' && r.status === 'pago')
    .reduce((sum, r) => sum + r.amount, 0);

  const totalExpenses = financeRecords
    .filter(r => r.type === 'despesa' && r.status === 'pago')
    .reduce((sum, r) => sum + r.amount, 0);

  const netProfit = totalBilling - totalExpenses;

  const activeLeadsCount = leads.length;
  const pipelineValue = leads
    .filter(l => l.stage !== 'concluido' && l.stage !== 'pos_venda')
    .reduce((sum, l) => sum + l.value, 0);

  // CRM Pipeline definitions
  const CRM_STAGES: { id: CRMStage; label: string; bg: string; text: string }[] = [
    { id: 'novo', label: 'Lead Novo', bg: 'bg-neutral-100', text: 'text-neutral-800' },
    { id: 'contato', label: 'Contato Realizado', bg: 'bg-blue-50', text: 'text-blue-800' },
    { id: 'agendado', label: 'Avaliação Agendada', bg: 'bg-purple-50', text: 'text-purple-800' },
    { id: 'compareceu', label: 'Compareceu', bg: 'bg-amber-50', text: 'text-amber-800' },
    { id: 'orcamento', label: 'Orçamento Enviado', bg: 'bg-indigo-50', text: 'text-indigo-800' },
    { id: 'iniciado', label: 'Tratamento Iniciado', bg: 'bg-teal-50', text: 'text-teal-800' },
    { id: 'concluido', label: 'Tratamento Concluído', bg: 'bg-green-50', text: 'text-green-800' },
    { id: 'pos_venda', label: 'Pós-Venda / Recorrência', bg: 'bg-rose-50', text: 'text-rose-800' }
  ];

  return (
    <div className="min-h-screen bg-neutral-900 text-neutral-100 font-sans flex flex-col md:flex-row">
      
      {/* Sidebar navigation */}
      <aside className="w-full md:w-64 bg-neutral-950 border-r border-neutral-800 shrink-0 flex flex-col justify-between">
        <div className="p-6">
          <div className="flex items-center gap-3.5 mb-8 bg-neutral-900/50 p-3 border border-neutral-800/30 rounded-none">
            <ToothIcon className="w-9 h-9 shrink-0" color="#FFEBA5" />
            <div className="flex flex-col">
              <h2 className="font-serif text-[13px] tracking-widest text-brand-gold uppercase leading-tight">Dra. Claudia França</h2>
              <p className="text-[8px] text-neutral-400 uppercase tracking-widest font-bold mt-0.5">Painel Administrativo</p>
            </div>
          </div>

          <nav className="space-y-1">
            <button 
              onClick={() => setActiveTab('insights')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold tracking-wide transition-all ${activeTab === 'insights' ? 'bg-gold-champagne text-neutral-950 shadow-md' : 'text-neutral-400 hover:bg-neutral-800 hover:text-white'}`}
            >
              <BarChart3 className="w-4 h-4" />
              Dashboard de Insights
            </button>

            <button 
              onClick={() => setActiveTab('crm')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold tracking-wide transition-all ${activeTab === 'crm' ? 'bg-gold-champagne text-neutral-950 shadow-md' : 'text-neutral-400 hover:bg-neutral-800 hover:text-white'}`}
            >
              <Target className="w-4 h-4" />
              CRM Visual (Pipeline)
            </button>

            <button 
              onClick={() => setActiveTab('patients')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold tracking-wide transition-all ${activeTab === 'patients' ? 'bg-gold-champagne text-neutral-950 shadow-md' : 'text-neutral-400 hover:bg-neutral-800 hover:text-white'}`}
            >
              <Users className="w-4 h-4" />
              Gestão de Pacientes
            </button>

            <button 
              onClick={() => setActiveTab('agenda')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold tracking-wide transition-all ${activeTab === 'agenda' ? 'bg-gold-champagne text-neutral-950 shadow-md' : 'text-neutral-400 hover:bg-neutral-800 hover:text-white'}`}
            >
              <CalendarIcon className="w-4 h-4" />
              Gestão de Agenda
              {appointments.filter(app => app.status === 'pending').length > 0 && (
                <span className="ml-auto bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                  {appointments.filter(app => app.status === 'pending').length}
                </span>
              )}
            </button>

            <button 
              onClick={() => setActiveTab('finance')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold tracking-wide transition-all ${activeTab === 'finance' ? 'bg-gold-champagne text-neutral-950 shadow-md' : 'text-neutral-400 hover:bg-neutral-800 hover:text-white'}`}
            >
              <DollarSign className="w-4 h-4" />
              Gestão Financeira
            </button>

            <button 
              onClick={() => setActiveTab('website')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold tracking-wide transition-all ${activeTab === 'website' ? 'bg-gold-champagne text-neutral-950 shadow-md' : 'text-neutral-400 hover:bg-neutral-800 hover:text-white'}`}
            >
              <Settings2 className="w-4 h-4" />
              Gestão do Site & SEO
            </button>

            <button 
              onClick={() => setActiveTab('identity')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold tracking-wide transition-all ${activeTab === 'identity' ? 'bg-gold-champagne text-neutral-950 shadow-md font-bold' : 'text-neutral-400 hover:bg-neutral-800 hover:text-white'}`}
            >
              <Sparkles className="w-4 h-4 text-brand-gold" />
              Identidade Visual
            </button>

            <button 
              onClick={() => setActiveTab('reviews')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold tracking-wide transition-all ${activeTab === 'reviews' ? 'bg-gold-champagne text-neutral-950 shadow-md font-bold' : 'text-neutral-400 hover:bg-neutral-800 hover:text-white'}`}
            >
              <Star className="w-4 h-4 fill-current text-amber-400" />
              Avaliações do Google
              {reviews.filter(r => r.approved === false).length > 0 && (
                <span className="ml-auto bg-amber-500 text-neutral-950 text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                  {reviews.filter(r => r.approved === false).length}
                </span>
              )}
            </button>

            <button 
              onClick={() => setActiveTab('supabase')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold tracking-wide transition-all ${activeTab === 'supabase' ? 'bg-[#3ECF8E] text-neutral-950 shadow-md font-bold' : 'text-neutral-400 hover:bg-neutral-800 hover:text-white'}`}
            >
              <Database className="w-4 h-4 text-[#3ECF8E]" />
              Conexão Supabase
            </button>
          </nav>
        </div>

        {/* Footer info in sidebar */}
        <div className="p-6 border-t border-neutral-800 text-[10px] text-neutral-400 space-y-2">
          <p className="flex items-center gap-1.5"><Eye className="w-3.5 h-3.5 text-gold-champagne" /> 100% de Conformidade LGPD</p>
          <button 
            onClick={onLogout}
            className="w-full bg-neutral-800 hover:bg-red-950 hover:text-red-300 py-2 rounded-lg font-bold transition-all border border-neutral-700/50"
          >
            Encerrar Sessão
          </button>
        </div>
      </aside>

      {/* Main dashboard viewport */}
      <main className="flex-1 overflow-y-auto p-4 md:p-8 min-w-0 bg-neutral-900">
        
        {/* TAB 1: INSIGHTS DASHBOARD */}
        {activeTab === 'insights' && (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-800 pb-4">
              <div>
                <h1 className="font-serif text-xl text-gold-champagne">Dashboard de Performance & Insights</h1>
                <p className="text-xs text-neutral-400">Análise agregada de conversão, ROI de marketing digital e comportamento do paciente em tempo real.</p>
              </div>
              <div className="bg-neutral-950 px-4 py-2 rounded-xl border border-neutral-800 text-xs flex items-center gap-2">
                <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping" />
                <span className="text-[10px] text-neutral-400 font-mono">CONEXÃO GOOGLE ANALYTICS 4 & META PIXEL ATIVA</span>
              </div>
            </div>

            {/* Quick Metrics Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-neutral-950 p-4 rounded-2xl border border-neutral-800">
                <p className="text-[10px] text-neutral-400 font-medium uppercase tracking-wider">Faturamento Bruto</p>
                <h3 className="text-xl font-bold font-mono text-gold-champagne mt-1">R$ {totalBilling.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</h3>
                <span className="text-[9px] text-emerald-400 flex items-center gap-0.5 mt-1 font-mono"><TrendingUp className="w-3 h-3" /> +14.8% este mês</span>
              </div>

              <div className="bg-neutral-950 p-4 rounded-2xl border border-neutral-800">
                <p className="text-[10px] text-neutral-400 font-medium uppercase tracking-wider">Leads no Pipeline</p>
                <h3 className="text-xl font-bold font-mono text-neutral-100 mt-1">{activeLeadsCount} Leads</h3>
                <span className="text-[9px] text-gold-champagne mt-1 block">Valor Estimado: R$ {pipelineValue.toLocaleString('pt-BR')}</span>
              </div>

              <div className="bg-neutral-950 p-4 rounded-2xl border border-neutral-800">
                <p className="text-[10px] text-neutral-400 font-medium uppercase tracking-wider">Conversão de Atendimento</p>
                <h3 className="text-xl font-bold font-mono text-neutral-100 mt-1">21.4%</h3>
                <span className="text-[9px] text-neutral-400 mt-1 block">Benchmarking: Superior a 15%</span>
              </div>

              <div className="bg-neutral-950 p-4 rounded-2xl border border-neutral-800">
                <p className="text-[10px] text-neutral-400 font-medium uppercase tracking-wider">ROI Médio Campanhas</p>
                <h3 className="text-xl font-bold font-mono text-neutral-100 mt-1">8.5x</h3>
                <span className="text-[9px] text-emerald-400 mt-1 block font-mono">Retorno excelente sob investimento</span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Traffic Chart (Custom SVG!) */}
              <div className="bg-neutral-950 p-5 rounded-2xl border border-neutral-800 lg:col-span-2">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-4">Volume de Visitas Diárias (Média do Mês)</h4>
                
                {/* SVG Graph rendering traffic trend line */}
                <div className="h-44 w-full relative">
                  <svg className="w-full h-full" viewBox="0 0 600 150">
                    <defs>
                      <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#FFEBA5" stopOpacity="0.4" />
                        <stop offset="100%" stopColor="#FFEBA5" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    {/* Grid lines */}
                    <line x1="0" y1="20" x2="600" y2="20" stroke="#222" strokeDasharray="4 4" />
                    <line x1="0" y1="70" x2="600" y2="70" stroke="#222" strokeDasharray="4 4" />
                    <line x1="0" y1="120" x2="600" y2="120" stroke="#222" strokeDasharray="4 4" />
                    
                    {/* Area under curve */}
                    <path 
                      d="M 0 150 L 0 120 Q 100 80 150 110 T 300 40 T 450 70 T 600 10 L 600 150 Z" 
                      fill="url(#chartGrad)" 
                    />
                    {/* The Line */}
                    <path 
                      d="M 0 120 Q 100 80 150 110 T 300 40 T 450 70 T 600 10" 
                      fill="none" 
                      stroke="#FFEBA5" 
                      strokeWidth="3" 
                    />
                    
                    {/* Tooltip dot */}
                    <circle cx="300" cy="40" r="5" fill="#FFEBA5" />
                  </svg>
                  
                  {/* Tooltip text */}
                  <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-neutral-900 border border-neutral-800 px-2 py-1 rounded text-[10px] font-mono">
                    Pico de Acesso: Segunda-feira (1.240 visitas via Google Ads)
                  </div>
                </div>

                <div className="flex justify-between text-[9px] text-neutral-400 font-mono mt-2">
                  <span>Semana 1</span>
                  <span>Semana 2</span>
                  <span>Semana 3 (Pico Google Search)</span>
                  <span>Semana 4</span>
                </div>
              </div>

              {/* Patient Profile Intelligence panel */}
              <div className="bg-neutral-950 p-5 rounded-2xl border border-neutral-800 space-y-4">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-300">Inteligência de Perfil e Interesse</h4>
                <p className="text-[11px] text-neutral-400">Intenção de compra preditiva com base nas páginas navegadas, interações no WhatsApp e cliques em CTAs.</p>
                
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-[11px] mb-1">
                      <span className="font-semibold text-neutral-200">Alinhadores Invisíveis (Invisalign)</span>
                      <span className="text-gold-champagne font-mono">48% de Intenção</span>
                    </div>
                    <div className="w-full bg-neutral-800 h-2 rounded-full overflow-hidden">
                      <div className="bg-gold-champagne h-full rounded-full" style={{ width: '48%' }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[11px] mb-1">
                      <span className="font-semibold text-neutral-200">Harmonização Facial / Botox</span>
                      <span className="text-gold-champagne font-mono">32% de Intenção</span>
                    </div>
                    <div className="w-full bg-neutral-800 h-2 rounded-full overflow-hidden">
                      <div className="bg-gold-champagne h-full rounded-full" style={{ width: '32%' }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[11px] mb-1">
                      <span className="font-semibold text-neutral-200">Implantes de Carga Imediata</span>
                      <span className="text-gold-champagne font-mono">15% de Intenção</span>
                    </div>
                    <div className="w-full bg-neutral-800 h-2 rounded-full overflow-hidden">
                      <div className="bg-gold-champagne h-full rounded-full" style={{ width: '15%' }} />
                    </div>
                  </div>
                </div>

                <div className="bg-neutral-900 p-3 rounded-xl border border-neutral-800 text-[10px] text-neutral-400">
                  <p className="font-semibold text-neutral-200 mb-1">💡 Conclusão de Marketing:</p>
                  <span>Anúncios focados no Botox orofacial têm a maior taxa de conversão direta de contato (clique-para-WhatsApp). Focar tráfego em Cambuci, SP aumenta o ROI em 2.4x.</span>
                </div>
              </div>

            </div>

            {/* Marketing Campaign Table */}
            <div className="bg-neutral-950 p-5 rounded-2xl border border-neutral-800">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-4">Análise Detalhada de Campanhas e ROI</h4>
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-neutral-900 text-neutral-400 text-[10px] uppercase font-mono border-b border-neutral-800">
                    <tr>
                      <th className="py-3 px-4">Nome da Campanha</th>
                      <th className="py-3 px-4">Plataforma</th>
                      <th className="py-3 px-4">Investimento</th>
                      <th className="py-3 px-4">Leads Gerados</th>
                      <th className="py-3 px-4">Conversões (Vendas)</th>
                      <th className="py-3 px-4">Faturamento (Vendas)</th>
                      <th className="py-3 px-4">ROI</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-800">
                    {campaigns.map((c) => (
                      <tr key={c.id} className="hover:bg-neutral-900/50">
                        <td className="py-3 px-4 font-semibold text-neutral-200">{c.name}</td>
                        <td className="py-3 px-4">{c.platform}</td>
                        <td className="py-3 px-4 font-mono">R$ {c.investment}</td>
                        <td className="py-3 px-4 font-mono">{c.leadsGenerated}</td>
                        <td className="py-3 px-4 font-mono text-emerald-400 font-bold">{c.conversions}</td>
                        <td className="py-3 px-4 font-mono text-gold-champagne font-bold">R$ {c.revenue.toLocaleString()}</td>
                        <td className="py-3 px-4 font-bold font-mono text-emerald-400">{(c.revenue / c.investment).toFixed(1)}x</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: CRM VISUAL (PIPELINE) */}
        {activeTab === 'crm' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800 pb-4">
              <div>
                <h1 className="font-serif text-xl text-gold-champagne">Funil de Vendas & CRM de Pacientes</h1>
                <p className="text-xs text-neutral-400">Acompanhe novos leads em tempo real e mova-os pelas etapas para fechar orçamentos de alta performance.</p>
              </div>
              <button 
                onClick={() => setShowAddLeadModal(true)}
                className="bg-gold-champagne text-neutral-950 font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 hover:bg-gold-champagne/90 transition-all shadow-md self-start sm:self-center"
              >
                <Plus className="w-4 h-4" />
                Cadastrar Novo Lead
              </button>
            </div>

            {/* Grid for pipeline columns */}
            <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-8 gap-4 overflow-x-auto pb-6">
              {CRM_STAGES.map((stage) => {
                const stageLeads = leads.filter(l => l.stage === stage.id);
                const stageSum = stageLeads.reduce((sum, l) => sum + l.value, 0);

                return (
                  <div key={stage.id} className="bg-neutral-950 rounded-2xl p-3 border border-neutral-800 flex flex-col min-w-[180px] h-[550px]">
                    <div className="flex items-center justify-between border-b border-neutral-800 pb-2 mb-3">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${stage.bg} ${stage.text}`}>
                        {stage.label}
                      </span>
                      <span className="text-[11px] font-mono text-neutral-400">{stageLeads.length}</span>
                    </div>

                    <p className="text-[9px] text-neutral-400 font-mono mb-2">Total: R$ {stageSum.toLocaleString('pt-BR')}</p>

                    {/* Cards container */}
                    <div className="flex-1 overflow-y-auto space-y-2 pr-1">
                      {stageLeads.map((lead) => (
                        <div 
                          key={lead.id} 
                          onClick={() => setSelectedLead(lead)}
                          className="bg-neutral-900 border border-neutral-800 p-3 rounded-xl space-y-2 hover:border-gold-champagne/50 hover:shadow-lg transition-all cursor-pointer group"
                        >
                          <div className="flex justify-between items-start">
                            <div className="truncate">
                              <h5 className="text-[11px] font-bold text-neutral-200 group-hover:text-gold-champagne transition-colors truncate">{lead.name}</h5>
                              <p className="text-[9px] text-neutral-400 truncate">{lead.serviceInterested}</p>
                            </div>
                            <div className="w-5 h-5 rounded bg-neutral-850 flex items-center justify-center text-neutral-400 opacity-0 group-hover:opacity-100 transition-opacity ml-1 shrink-0">
                              <Eye className="w-3 h-3 text-gold-champagne" />
                            </div>
                          </div>

                          <div className="flex items-center justify-between">
                            <span className="text-[9px] font-mono font-bold text-gold-champagne">R$ {lead.value}</span>
                            <div className="flex items-center gap-1">
                              {lead.attachedFiles && lead.attachedFiles.length > 0 && (
                                <span className="text-[8px] text-gold-champagne bg-gold-champagne/10 px-1.5 py-0.5 rounded border border-gold-champagne/20 font-mono font-bold" title={`${lead.attachedFiles.length} arquivos clínicos anexados`}>
                                  📎 {lead.attachedFiles.length}
                                </span>
                              )}
                              <span className="text-[8px] text-neutral-400 bg-neutral-950 px-1.5 py-0.5 rounded border border-neutral-800">
                                {lead.source}
                              </span>
                            </div>
                          </div>

                          {/* Quick movement controls inside simulation */}
                          <div className="flex items-center justify-end gap-1 border-t border-neutral-800 pt-1.5 animate-none" onClick={(e) => e.stopPropagation()}>
                            <span className="text-[8px] text-neutral-500 font-mono mr-auto">Mover:</span>
                            {CRM_STAGES.map((s) => {
                              // Render buttons for adjacent steps to simulate drag-drop
                              const indexSelf = CRM_STAGES.findIndex(x => x.id === stage.id);
                              const indexTarget = CRM_STAGES.findIndex(x => x.id === s.id);
                              
                              if (Math.abs(indexSelf - indexTarget) === 1) {
                                return (
                                  <button
                                    key={s.id}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleMoveLead(lead.id, s.id);
                                    }}
                                    title={`Mover para ${s.label}`}
                                    className="bg-neutral-800 hover:bg-gold-champagne hover:text-neutral-950 p-1 rounded text-[8px] font-bold transition-all text-neutral-400 cursor-pointer"
                                  >
                                    {indexTarget > indexSelf ? '→' : '←'}
                                  </button>
                                );
                              }
                              return null;
                            })}
                          </div>
                        </div>
                      ))}

                      {stageLeads.length === 0 && (
                        <div className="text-center py-8 text-neutral-600 text-[10px]">
                          Vazio
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 3: PATIENT MANAGEMENT */}
        {activeTab === 'patients' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800 pb-4">
              <div>
                <h1 className="font-serif text-xl text-gold-champagne">Prontuários & Gestão de Pacientes</h1>
                <p className="text-xs text-neutral-400">Busca inteligente de registros, histórico de anamnese, documentos de imagem e observações clínicas.</p>
              </div>
              <button 
                onClick={() => setShowAddPatientModal(true)}
                className="bg-gold-champagne text-neutral-950 font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 hover:bg-gold-champagne/90 transition-all shadow-md self-start sm:self-center"
              >
                <UserPlus className="w-4 h-4" />
                Cadastrar Novo Paciente
              </button>
            </div>

            {/* Search filter row */}
            <div className="flex bg-neutral-950 p-3 rounded-xl border border-neutral-800">
              <div className="flex-1 relative">
                <Search className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input 
                  type="text" 
                  value={patientSearch}
                  onChange={(e) => setPatientSearch(e.target.value)}
                  placeholder="Pesquisar por nome do paciente ou telefone..."
                  className="w-full bg-transparent border-none pl-9 pr-4 py-1 text-xs text-neutral-100 focus:outline-none"
                />
              </div>
            </div>

            {/* Patients table layout */}
            <div className="bg-neutral-950 rounded-2xl border border-neutral-800 overflow-hidden">
              <table className="w-full text-xs text-left">
                <thead className="bg-neutral-900 text-neutral-400 text-[10px] uppercase font-mono border-b border-neutral-800">
                  <tr>
                    <th className="py-3 px-4">Nome Completo</th>
                    <th className="py-3 px-4">Contato</th>
                    <th className="py-3 px-4">Origem do Lead</th>
                    <th className="py-3 px-4">Data de Cadastro</th>
                    <th className="py-3 px-4">Status Clínico</th>
                    <th className="py-3 px-4 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800">
                  {patients
                    .filter(p => p.name.toLowerCase().includes(patientSearch.toLowerCase()) || p.phone.includes(patientSearch))
                    .map((pat) => (
                      <tr key={pat.id} className="hover:bg-neutral-900/40">
                        <td className="py-3 px-4 font-semibold text-neutral-100">{pat.name}</td>
                        <td className="py-3 px-4">
                          <p>{pat.email}</p>
                          <p className="text-[10px] text-neutral-400">{pat.phone}</p>
                        </td>
                        <td className="py-3 px-4">
                          <span className="bg-neutral-800 border border-neutral-700 px-2.5 py-0.5 rounded-full text-[10px] text-neutral-300">
                            {pat.leadSource}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-mono">{pat.createdDate}</td>
                        <td className="py-3 px-4">
                          <span className={`inline-block w-2.5 h-2.5 rounded-full mr-1.5 ${pat.status === 'Em Tratamento' ? 'bg-amber-500' : pat.status === 'Ativo' ? 'bg-emerald-500' : 'bg-neutral-500'}`} />
                          {pat.status}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button 
                            onClick={() => setSelectedPatient(pat)}
                            className="bg-neutral-800 hover:bg-gold-champagne hover:text-neutral-950 font-bold px-3 py-1.5 rounded-lg text-[10px] transition-all"
                          >
                            Ver Prontuário
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>

            {/* Selected Patient Detailed Drawer/Modal */}
            {selectedPatient && (
              <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <div className="bg-neutral-950 w-full max-w-2xl rounded-3xl border border-neutral-800 shadow-2xl overflow-hidden text-xs max-h-[90vh] flex flex-col">
                  {/* Modal Header */}
                  <div className="bg-neutral-900 px-6 py-4 border-b border-neutral-800 flex items-center justify-between">
                    <div>
                      <h3 className="font-serif text-gold-champagne text-base">{selectedPatient.name}</h3>
                      <p className="text-[10px] text-neutral-400">Prontuário Digital Integrado • Cadastrado em {selectedPatient.createdDate}</p>
                    </div>
                    <button 
                      onClick={() => setSelectedPatient(null)}
                      className="text-neutral-400 hover:text-white p-1 rounded-lg bg-neutral-800"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Modal Body */}
                  <div className="p-6 overflow-y-auto space-y-6 flex-1">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-neutral-500 block mb-0.5">E-mail:</span>
                        <span className="font-semibold text-neutral-100">{selectedPatient.email}</span>
                      </div>
                      <div>
                        <span className="text-neutral-500 block mb-0.5">Telefone/WhatsApp:</span>
                        <span className="font-semibold text-neutral-100">{selectedPatient.phone}</span>
                      </div>
                      <div>
                        <span className="text-neutral-500 block mb-0.5">Origem:</span>
                        <span className="font-semibold text-neutral-100">{selectedPatient.leadSource}</span>
                      </div>
                      <div>
                        <span className="text-neutral-500 block mb-0.5">Status Clínico:</span>
                        <span className="font-semibold text-neutral-100">{selectedPatient.status}</span>
                      </div>
                    </div>

                    {/* Observations */}
                    <div className="space-y-1">
                      <span className="text-neutral-500 font-medium block">Notas Clínicas e Anamnese:</span>
                      <p className="bg-neutral-900 p-3 rounded-xl border border-neutral-800 leading-relaxed text-neutral-200 italic">
                        {selectedPatient.observations || 'Nenhuma observação clínica extra anotada.'}
                      </p>
                    </div>

                    {/* Clinical History timeline */}
                    <div className="space-y-3">
                      <span className="text-neutral-500 font-medium block">Histórico de Atendimentos:</span>
                      <div className="space-y-2 border-l border-neutral-800 pl-3.5 ml-2">
                        {selectedPatient.history.map((hist, i) => (
                          <div key={i} className="relative">
                            <span className="absolute -left-[19.5px] top-1.5 w-2 h-2 bg-gold-champagne rounded-full" />
                            <p className="text-[10px] text-neutral-400 font-mono">{hist.date} • {hist.doctor}</p>
                            <p className="text-xs text-neutral-200 mt-0.5">{hist.description}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Attached Documents */}
                    <div className="space-y-2">
                      <span className="text-neutral-500 font-medium block">Documentos Clínicos & Exames ({selectedPatient.documents.length}):</span>
                      {selectedPatient.documents.length === 0 ? (
                        <p className="text-[10px] text-neutral-500 italic">Nenhum exame anexado.</p>
                      ) : (
                        <div className="grid grid-cols-2 gap-2">
                          {selectedPatient.documents.map((doc) => (
                            <div key={doc.id} className="p-3 bg-neutral-900 border border-neutral-800 rounded-xl flex items-center justify-between">
                              <div>
                                <p className="font-semibold text-neutral-200 truncate max-w-[150px]">{doc.name}</p>
                                <p className="text-[9px] text-neutral-400 font-mono">{doc.date} • {doc.size}</p>
                              </div>
                              <span className="text-xs">📄</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Modal Footer */}
                  <div className="bg-neutral-900 px-6 py-4 border-t border-neutral-800 flex justify-end gap-2">
                    <button 
                      onClick={() => {
                        const notes = prompt('Adicione uma nota de anamnese ao histórico do paciente:');
                        if (notes) {
                          setPatients(prev => prev.map(p => {
                            if (p.id === selectedPatient.id) {
                              const updatedHist = [
                                { date: new Date().toISOString().split('T')[0], description: notes, doctor: 'Dra. Claudia França' },
                                ...p.history
                              ];
                              return { ...p, history: updatedHist };
                            }
                            return p;
                          }));
                          alert('Nota clínica registrada!');
                          setSelectedPatient(null);
                        }
                      }}
                      className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white font-semibold rounded-xl"
                    >
                      Adicionar Evolução Clínica
                    </button>
                    <button 
                      onClick={() => setSelectedPatient(null)}
                      className="px-4 py-2 bg-gold-champagne text-neutral-950 font-bold rounded-xl"
                    >
                      Fechar Prontuário
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 4: CALENDAR / AGENDA MANAGEMENT */}
        {activeTab === 'agenda' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800 pb-4">
              <div>
                <h1 className="font-serif text-xl text-gold-champagne">Gestão de Agenda Integrada</h1>
                <p className="text-xs text-neutral-400">Sincronização bidirecional em tempo real com Google Calendar e Outlook. Bloqueie horários e configure turnos.</p>
              </div>
              <div className="flex gap-2 text-xs">
                <button 
                  onClick={() => alert('Sincronização de 10 horários do Google Calendar concluída com sucesso!')}
                  className="bg-neutral-800 hover:bg-neutral-700 text-white font-semibold px-3 py-2 rounded-xl transition-all border border-neutral-700"
                >
                  Sincronizar Google Calendar
                </button>
                <button 
                  onClick={() => {
                    const block = prompt('Digite o dia e horário que deseja BLOQUEAR (Ex: 08/07 das 14h às 16h):');
                    if (block) alert(`Horário bloqueado na agenda oficial: ${block}`);
                  }}
                  className="bg-red-950 text-red-300 font-semibold px-3 py-2 rounded-xl border border-red-900 hover:bg-red-900 transition-all"
                >
                  Bloquear Horário
                </button>
              </div>
            </div>

            {/* List of active requests and calendar slots */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Left Column: List of Appointments needing approval */}
              <div className="lg:col-span-1 bg-neutral-950 p-5 rounded-2xl border border-neutral-800 space-y-4">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-300">Aprovações Pendentes</h4>
                
                <div className="space-y-3">
                  {appointments.filter(app => app.status === 'pending').length === 0 ? (
                    <p className="text-[11px] text-neutral-500 italic text-center py-6">Nenhuma solicitação aguardando aprovação.</p>
                  ) : (
                    appointments.filter(app => app.status === 'pending').map((app) => (
                      <div key={app.id} className="bg-neutral-900 p-3.5 rounded-xl border border-neutral-800 space-y-3 text-[11px]">
                        <div>
                          <p className="font-bold text-neutral-100">{app.patientName}</p>
                          <p className="text-neutral-400">{app.serviceName}</p>
                          <p className="font-mono text-gold-champagne mt-0.5">{app.date} • {app.time} ({app.type === 'teleconsulta' ? 'Online' : 'Presencial'})</p>
                        </div>
                        <div className="flex gap-2 justify-end">
                          <button 
                            onClick={() => handleCancelAppointment(app.id)}
                            className="bg-red-950 text-red-300 px-3 py-1 rounded-lg border border-red-900 font-bold hover:bg-red-900"
                          >
                            Recusar
                          </button>
                          <button 
                            onClick={() => handleApproveAppointment(app.id)}
                            className="bg-emerald-600 text-white px-3 py-1 rounded-lg font-bold hover:bg-emerald-500"
                          >
                            Aprovar
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Middle & Right Column: Interactive Week visualizer simulation */}
              <div className="lg:col-span-2 bg-neutral-950 p-5 rounded-2xl border border-neutral-800">
                <div className="flex items-center justify-between mb-4 border-b border-neutral-800 pb-2">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-300">Grade Semanal da Dra. Claudia</h4>
                  <span className="text-[10px] font-mono text-neutral-400">Julho de 2026</span>
                </div>

                <div className="grid grid-cols-5 gap-2 text-center text-xs">
                  {['Seg 06/07', 'Ter 07/07', 'Qua 08/07', 'Qui 09/07', 'Sex 10/07'].map((day, dIdx) => {
                    const mockDate = `2026-07-0${dIdx + 6}`;
                    const dayApps = appointments.filter(app => app.date === mockDate && app.status !== 'cancelled');

                    return (
                      <div key={day} className="bg-neutral-900 p-2 rounded-xl border border-neutral-800/80 min-h-[300px] flex flex-col">
                        <span className="font-semibold block border-b border-neutral-800 pb-1 mb-2 text-neutral-300">{day}</span>
                        
                        <div className="space-y-1.5 flex-1 flex flex-col justify-start">
                          {dayApps.map((app) => (
                            <div 
                              key={app.id} 
                              onClick={() => alert(`Detalhes: Paciente ${app.patientName}\nServiço: ${app.serviceName}\nHorário: ${app.time}`)}
                              className={`p-1.5 rounded text-[10px] font-semibold text-left border cursor-pointer transition-colors ${app.type === 'teleconsulta' ? 'bg-amber-950/40 border-amber-800 text-amber-300' : 'bg-green-deep/40 border-green-800 text-neutral-200'}`}
                            >
                              <span className="block font-mono font-bold text-[9px]">{app.time}</span>
                              <span className="truncate block">{app.patientName.split(' ')[0]}</span>
                            </div>
                          ))}

                          {dayApps.length === 0 && (
                            <span className="text-[9px] text-neutral-600 block my-auto italic">Disponível</span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          </div>
        )}

        {/* TAB 5: FINANCIAL MANAGEMENT */}
        {activeTab === 'finance' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800 pb-4">
              <div>
                <h1 className="font-serif text-xl text-gold-champagne">Gestão Financeira & Cobranças</h1>
                <p className="text-xs text-neutral-400">Totalize receitas, despesas operacionais e emita links de pagamentos instantâneos (Pix, Cartão de Crédito e Boleto).</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Form: Link Payment Generator */}
              <div className="bg-neutral-950 p-5 rounded-2xl border border-neutral-800 space-y-4 h-fit">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-300">Gerador de Cobrança / Link de Pagamento</h4>
                <p className="text-[10px] text-neutral-400">Gere um link integrado do Asaas/Mercado Pago que envia lembrete Pix ou fatura ao paciente via WhatsApp.</p>
                
                <form onSubmit={handleGeneratePaymentLink} className="space-y-3.5 text-xs">
                  <div className="space-y-1">
                    <label className="text-neutral-400 font-medium">Nome do Paciente:</label>
                    <input 
                      type="text" 
                      value={newChargePatient}
                      onChange={(e) => setNewChargePatient(e.target.value)}
                      placeholder="Ex: Amanda Silva"
                      className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-neutral-100"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-neutral-400 font-medium">Procedimento:</label>
                      <select 
                        value={newChargeCategory}
                        onChange={(e) => setNewChargeCategory(e.target.value)}
                        className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-neutral-100"
                      >
                        <option value="Invisalign">Invisalign</option>
                        <option value="Harmonização">Harmonização</option>
                        <option value="Botox">Botox</option>
                        <option value="Implante">Implante</option>
                        <option value="Clínica Geral">Clínica Geral</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-neutral-400 font-medium">Valor (R$):</label>
                      <input 
                        type="number" 
                        value={newChargeAmount}
                        onChange={(e) => setNewChargeAmount(Number(e.target.value))}
                        className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-neutral-100"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-neutral-400 font-medium">Canal de Pagamento:</label>
                    <select 
                      value={newChargeMethod}
                      onChange={(e) => setNewChargeMethod(e.target.value as 'pix' | 'cartao' | 'boleto')}
                      className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-neutral-100"
                    >
                      <option value="pix">Pix (Confirmação Automática)</option>
                      <option value="cartao">Cartão de Crédito (Parcelado)</option>
                      <option value="boleto">Boleto Bancário</option>
                    </select>
                  </div>

                  <button 
                    type="submit"
                    className="w-full bg-gold-champagne text-neutral-950 font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 hover:bg-gold-champagne/90 transition-colors shadow-md"
                  >
                    Gerar e Enviar Cobrança
                  </button>
                </form>

                {generatedPaymentLink && (
                  <div className="bg-neutral-900 p-3 rounded-xl border border-neutral-800 text-[10px] space-y-2 mt-2">
                    <p className="font-semibold text-emerald-400 flex items-center gap-1">✔ Link Gerado com Sucesso!</p>
                    <input 
                      type="text" 
                      value={generatedPaymentLink} 
                      readOnly
                      className="w-full bg-neutral-950 border border-neutral-800 rounded p-1.5 font-mono text-[9px] text-neutral-300"
                    />
                    <button 
                      onClick={() => alert('Link copiado! Você pode colá-lo no WhatsApp do paciente.')}
                      className="text-gold-champagne font-bold underline"
                    >
                      Copiar Link de Cobrança
                    </button>
                  </div>
                )}
              </div>

              {/* Right Column: Historical Ledger of Transactions */}
              <div className="lg:col-span-2 bg-neutral-950 p-5 rounded-2xl border border-neutral-800 space-y-4">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-300">Livro-Razão de Transações</h4>
                
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-neutral-900 text-neutral-400 text-[10px] uppercase font-mono border-b border-neutral-800">
                      <tr>
                        <th className="py-2.5 px-3">Data</th>
                        <th className="py-2.5 px-3">Paciente/Descritivo</th>
                        <th className="py-2.5 px-3">Categoria</th>
                        <th className="py-2.5 px-3">Tipo</th>
                        <th className="py-2.5 px-3">Forma</th>
                        <th className="py-2.5 px-3">Valor</th>
                        <th className="py-2.5 px-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-800">
                      {financeRecords.map((r) => (
                        <tr key={r.id} className="hover:bg-neutral-900/40">
                          <td className="py-2.5 px-3 font-mono">{r.date}</td>
                          <td className="py-2.5 px-3 font-semibold text-neutral-200">
                            {r.patientName || r.description}
                          </td>
                          <td className="py-2.5 px-3">{r.category}</td>
                          <td className="py-2.5 px-3">
                            <span className={`inline-block px-1.5 py-0.5 rounded text-[9px] font-bold ${r.type === 'receita' ? 'bg-green-950/50 text-green-300' : 'bg-red-950/50 text-red-300'}`}>
                              {r.type === 'receita' ? 'Entrada' : 'Saída'}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 font-mono text-[10px] uppercase">{r.paymentMethod || 'fatura'}</td>
                          <td className={`py-2.5 px-3 font-bold font-mono ${r.type === 'receita' ? 'text-green-400' : 'text-red-400'}`}>
                            {r.type === 'receita' ? '+' : '-'}R$ {r.amount}
                          </td>
                          <td className="py-2.5 px-3">
                            <span className={`inline-block px-1.5 py-0.5 rounded text-[9px] font-bold ${r.status === 'pago' ? 'bg-emerald-950/50 text-emerald-400' : 'bg-yellow-950/50 text-yellow-300'}`}>
                              {r.status === 'pago' ? 'Liquidado' : 'Pendente'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: WEBSITE CONTENT & SEO EDITOR */}
        {activeTab === 'website' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800 pb-4">
              <div>
                <h1 className="font-serif text-xl text-gold-champagne">Gestão de Conteúdo do Site (CMS) & SEO</h1>
                <p className="text-xs text-neutral-400">Gerencie textos de cabeçalho, descrições de serviços e metatags para indexação orgânica no Google (SEO Local).</p>
              </div>
              <button 
                onClick={() => {
                  if (siteContent && onSaveSiteContent) {
                    const updated = {
                      ...siteContent,
                      heroTitle: headline,
                      heroSubtitle: subHeadline,
                    };
                    onSaveSiteContent(updated);
                  }
                  alert('Modificações de texto e SEO aplicadas com sucesso no site público!');
                }}
                className="bg-gold-champagne text-neutral-950 font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 hover:bg-gold-champagne/90 transition-all shadow-md self-start sm:self-center cursor-pointer"
              >
                Salvar Alterações do Site
              </button>
            </div>

            {/* Visual Editor Integrated Access (DOCTOR RESTRITA ONLY) */}
            <div className="bg-gradient-to-br from-[#1C1212] to-neutral-950 p-6 rounded-2xl border border-gold-champagne/20 space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-1 md:max-w-xl">
                  <div className="flex items-center gap-2 text-gold-champagne font-bold text-xs uppercase tracking-wider">
                    <Sparkles className="w-4 h-4 text-gold-champagne animate-pulse" />
                    Editor Visual Interativo em Tempo Real
                  </div>
                  <p className="text-[11px] text-neutral-300 leading-relaxed">
                    Você pode editar de forma totalmente visual o site público. Ao ativar o modo visual, você será direcionada para a página inicial onde poderá clicar diretamente sobre qualquer texto ou foto para alterá-los instantaneamente.
                  </p>
                </div>
                {setIsEditMode && setCurrentView && (
                  <button
                    onClick={() => {
                      setIsEditMode(true);
                      setCurrentView('landing');
                      window.location.hash = ''; // Navega para a home
                    }}
                    className="bg-gold-champagne text-neutral-950 hover:bg-white transition-all font-bold text-xs uppercase tracking-wider px-5 py-3 rounded-xl flex items-center gap-2 shadow-lg cursor-pointer self-start md:self-center whitespace-nowrap"
                  >
                    <Edit2 className="w-4 h-4" />
                    Ativar Edição Visual no Site
                  </button>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* CMS Text Editor Form */}
              <div className="bg-neutral-950 p-5 rounded-2xl border border-neutral-800 space-y-4">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-300">Editor da Página Inicial (Home / Hero)</h4>
                
                <div className="space-y-3.5 text-xs">
                  <div className="space-y-1">
                    <label className="text-neutral-400 font-medium">Título Principal (Headline):</label>
                    <textarea 
                      value={headline} 
                      onChange={(e) => setHeadline(e.target.value)}
                      rows={2}
                      className="w-full bg-neutral-900 border border-neutral-800 rounded-xl p-2.5 text-xs text-neutral-100 focus:outline-none focus:border-gold-champagne"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-neutral-400 font-medium">Subtítulo do Hero:</label>
                    <textarea 
                      value={subHeadline} 
                      onChange={(e) => setSubHeadline(e.target.value)}
                      rows={2}
                      className="w-full bg-neutral-900 border border-neutral-800 rounded-xl p-2.5 text-xs text-neutral-100 focus:outline-none focus:border-gold-champagne"
                    />
                  </div>
                </div>
              </div>

              {/* SEO Tags Panel */}
              <div className="bg-neutral-950 p-5 rounded-2xl border border-neutral-800 space-y-4">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-300">Otimização SEO Local & Keywords</h4>
                <p className="text-[10px] text-neutral-400 leading-relaxed">Estas tags aumentam as chances de a clínica aparecer em primeiro lugar ao buscarem por dentistas de luxo ou procedimentos específicos na região do Cambuci, São Paulo.</p>
                
                <div className="space-y-3.5 text-xs">
                  <div className="space-y-1">
                    <label className="text-neutral-400 font-medium">Meta Description do Google:</label>
                    <textarea 
                      value={seoDescription} 
                      onChange={(e) => setSeoDescription(e.target.value)}
                      rows={3}
                      className="w-full bg-neutral-900 border border-neutral-800 rounded-xl p-2.5 text-xs text-neutral-100 focus:outline-none focus:border-gold-champagne animate-none"
                    />
                  </div>

                  <div>
                    <span className="text-neutral-400 font-medium block mb-1.5">Palavras-chave Otimizadas Prontas:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {['Dentista Cambuci', 'Dentista São Paulo', 'Harmonização Facial São Paulo', 'Invisalign SP', 'Implante Dentário Carga Imediata', 'Clínica Odontológica de Luxo'].map((tag) => (
                        <span key={tag} className="bg-neutral-800 border border-neutral-700/80 px-2.5 py-1 rounded-full text-[10px] text-gold-champagne font-mono">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Blog Post Management Panel */}
            <div className="bg-neutral-950 p-6 rounded-2xl border border-neutral-800 space-y-4 mt-6">
              <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
                <div>
                  <h4 className="text-sm font-semibold uppercase tracking-wider text-neutral-300 flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-gold-champagne" />
                    Gerenciador de Artigos do Blog
                  </h4>
                  <p className="text-[10px] text-neutral-400">Publique conteúdos ricos de orientações odontológicas, tratamentos e dicas que aumentam sua relevância orgânica (SEO).</p>
                </div>
                <button 
                  onClick={openNewBlogModal}
                  className="bg-gold-champagne text-neutral-950 font-bold px-3.5 py-1.5 rounded-xl text-[10px] uppercase tracking-wider flex items-center gap-1.5 hover:bg-gold-champagne/90 transition-all cursor-pointer shadow"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Novo Artigo
                </button>
              </div>

              {blogPosts.length === 0 ? (
                <div className="text-center py-8 text-neutral-500 text-xs">
                  Nenhum artigo cadastrado. Clique em "Novo Artigo" para criar a primeira publicação!
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-neutral-900 text-neutral-400 text-[10px] uppercase font-mono border-b border-neutral-800">
                      <tr>
                        <th className="py-2.5 px-3 w-16">Imagem</th>
                        <th className="py-2.5 px-3">Título do Artigo</th>
                        <th className="py-2.5 px-3">Categoria</th>
                        <th className="py-2.5 px-3">Autor</th>
                        <th className="py-2.5 px-3">Data</th>
                        <th className="py-2.5 px-3 text-right">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-800">
                      {blogPosts.map((post) => (
                        <tr key={post.id} className="hover:bg-neutral-900/40">
                          <td className="py-2.5 px-3">
                            <img 
                              src={post.imageUrl || "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=400"} 
                              alt={post.title} 
                              className="w-10 h-7 object-cover rounded border border-neutral-800"
                            />
                          </td>
                          <td className="py-2.5 px-3 font-semibold text-neutral-200">
                            <div>
                              <div className="line-clamp-1">{post.title}</div>
                              <div className="text-[10px] text-neutral-500 font-normal line-clamp-1 mt-0.5">{post.excerpt}</div>
                            </div>
                          </td>
                          <td className="py-2.5 px-3">
                            <span className="px-2 py-0.5 rounded-full bg-neutral-800 border border-neutral-700/60 text-[9px] font-mono text-gold-champagne uppercase">
                              {post.category}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 text-neutral-400 font-mono text-[10px]">{post.author}</td>
                          <td className="py-2.5 px-3 text-neutral-400 font-mono text-[10px]">{post.date}</td>
                          <td className="py-2.5 px-3 text-right space-x-2">
                            <button 
                              onClick={() => openEditBlogModal(post)}
                              className="text-gold-champagne hover:text-white transition-colors cursor-pointer text-[10px] uppercase font-bold"
                            >
                              Editar
                            </button>
                            <button 
                              onClick={() => handleDeleteBlogPost(post.id)}
                              className="text-red-400 hover:text-red-300 transition-colors cursor-pointer text-[10px] uppercase font-bold"
                            >
                              Excluir
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 7: SUPABASE DATABASE CONFIGURATION */}
        {activeTab === 'supabase' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800 pb-4">
              <div>
                <h1 className="font-serif text-xl text-[#3ECF8E] flex items-center gap-2">
                  <Database className="w-6 h-6" />
                  Integração com Banco de Dados Supabase
                </h1>
                <p className="text-xs text-neutral-400">
                  Gerencie a sincronização em tempo real de leads, triagens e agendamentos diretos do portal de pacientes para sua instância Supabase.
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={async () => {
                    setIsSyncingSupabase(true);
                    setSyncFeedback('');
                    try {
                      const res = await syncPendingData();
                      if (res.leadsSynced > 0 || res.appointmentsSynced > 0) {
                        setSyncFeedback(`Sincronizado: ${res.leadsSynced} leads e ${res.appointmentsSynced} agendamentos.`);
                      } else {
                        setSyncFeedback('Nenhum dado pendente encontrado para sincronização.');
                      }
                    } catch (e) {
                      setSyncFeedback('Erro ao conectar ou sincronizar.');
                    } finally {
                      setIsSyncingSupabase(false);
                    }
                  }}
                  disabled={isSyncingSupabase}
                  className="bg-[#3ECF8E] text-neutral-950 font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 hover:bg-[#3ECF8E]/90 transition-all shadow-md cursor-pointer disabled:opacity-55 animate-none"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  {isSyncingSupabase ? 'Sincronizando...' : 'Sincronizar Pendentes'}
                </button>
              </div>
            </div>

            {/* Sync Feedback Alert */}
            {syncFeedback && (
              <div className="bg-neutral-900 border border-neutral-800 p-4 rounded-xl flex items-center justify-between text-xs text-neutral-200">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#3ECF8E] animate-ping" />
                  <span>{syncFeedback}</span>
                </div>
                <button onClick={() => setSyncFeedback('')} className="text-neutral-500 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Grid Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Connection Status Card */}
              <div className="lg:col-span-1 bg-neutral-950 p-6 rounded-2xl border border-neutral-800 space-y-6">
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-300 mb-3">Status da Conexão</h4>
                  {getSupabaseConfig().isConfigured ? (
                    <div className="bg-[#3ECF8E]/10 border border-[#3ECF8E]/20 p-4 rounded-xl space-y-3">
                      <div className="flex items-center gap-2 text-xs font-semibold text-[#3ECF8E]">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#3ECF8E] animate-pulse" />
                        Conectado com Sucesso
                      </div>
                      <p className="text-[11px] text-neutral-400 leading-relaxed">
                        Seu site está enviando todos os dados de pré-agendamento e triagem clínica em tempo real para a sua conta Supabase.
                      </p>
                      <div className="pt-2 text-[10px] font-mono break-all text-neutral-300">
                        <span className="text-neutral-500">URL:</span> {getSupabaseConfig().url}
                      </div>
                    </div>
                  ) : (
                    <div className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-xl space-y-3">
                      <div className="flex items-center gap-2 text-xs font-semibold text-amber-500">
                        <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                        Modo Sandbox / Local Only
                      </div>
                      <p className="text-[11px] text-neutral-400 leading-relaxed">
                        A chave de API ou URL do Supabase não foi detectada nas variáveis de ambiente. Os dados estão sendo armazenados localmente no navegador (localStorage) para que você não perca nenhuma informação durante os testes.
                      </p>
                    </div>
                  )}
                </div>

                <div className="space-y-3 text-xs leading-relaxed text-neutral-400">
                  <h5 className="font-semibold text-neutral-300 text-[11px] uppercase tracking-wider border-b border-neutral-900 pb-1">Instruções de Configuração</h5>
                  <p>
                    Para conectar seu banco de dados Supabase de produção, adicione as seguintes variáveis no seu arquivo <code className="bg-neutral-900 px-1 py-0.5 rounded text-neutral-300 font-mono text-[10px]">.env</code>:
                  </p>
                  <pre className="bg-neutral-900 p-3 rounded-xl font-mono text-[10px] text-neutral-200 overflow-x-auto space-y-1 select-all">
                    VITE_SUPABASE_URL=seu_url_do_projeto{"\n"}
                    VITE_SUPABASE_ANON_KEY=sua_chave_anon_publica
                  </pre>
                  <p className="text-[11px] text-neutral-500 italic">
                    *Não se esqueça de reiniciar o servidor após definir as novas variáveis de ambiente.
                  </p>
                </div>
              </div>

              {/* SQL Editor / Script copy */}
              <div className="lg:col-span-2 bg-neutral-950 p-6 rounded-2xl border border-neutral-800 space-y-4">
                <div className="flex items-center justify-between border-b border-neutral-850 pb-2">
                  <div>
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-300">Script SQL para Inicialização</h4>
                    <p className="text-[11px] text-neutral-500">Execute este código no SQL Editor do seu painel Supabase para criar as tabelas necessárias.</p>
                  </div>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(SUPABASE_SQL_SCHEMA);
                      setCopiedSql(true);
                      setTimeout(() => setCopiedSql(false), 2000);
                    }}
                    className="bg-neutral-800 hover:bg-neutral-750 text-neutral-200 hover:text-white border border-neutral-750 px-3 py-1.5 rounded-xl text-[10px] uppercase tracking-wider font-semibold transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    {copiedSql ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-[#3ECF8E]" />
                        Copiado!
                      </>
                    ) : (
                      <>
                        <FileText className="w-3.5 h-3.5 text-neutral-400" />
                        Copiar Script SQL
                      </>
                    )}
                  </button>
                </div>

                <div className="relative">
                  <pre className="bg-neutral-900 p-4 rounded-xl font-mono text-[10px] text-[#3ECF8E]/85 overflow-y-auto max-h-[300px] leading-relaxed border border-neutral-850 select-text">
                    {SUPABASE_SQL_SCHEMA}
                  </pre>
                </div>

                <div className="bg-neutral-900/40 p-4 rounded-xl border border-neutral-850 text-xs text-neutral-400 space-y-2">
                  <h5 className="font-semibold text-neutral-300">💡 Como usar:</h5>
                  <ul className="list-disc list-inside space-y-1 text-[11px]">
                    <li>Acesse o dashboard do seu projeto no Supabase</li>
                    <li>No menu lateral esquerdo, clique em <strong>SQL Editor</strong></li>
                    <li>Clique em <strong>New Query</strong> e cole o código acima</li>
                    <li>Clique em <strong>Run</strong> (ou aperte Ctrl+Enter/Cmd+Enter)</li>
                    <li>Pronto! As tabelas estarão prontas e devidamente estruturadas com Row-Level Security (RLS) habilitada.</li>
                  </ul>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* TAB 8: GOOGLE REVIEWS MODERATION PANEL */}
        {activeTab === 'reviews' && (
          <div className="space-y-6 text-xs">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800 pb-4">
              <div>
                <h1 className="font-serif text-xl text-brand-gold flex items-center gap-2">
                  <Star className="w-6 h-6 fill-current text-amber-400" />
                  Integração & Moderação de Avaliações do Google
                </h1>
                <p className="text-xs text-neutral-400">
                  Acompanhe e filtre avaliações enviadas à clínica "Clínica Odontologia Dra. Claudia França". Somente as aprovadas aparecem no seu site.
                </p>
              </div>
              <div className="flex gap-2 shrink-0">
                <button
                  onClick={() => setShowAddSimReview(true)}
                  className="bg-neutral-800 hover:bg-neutral-750 text-neutral-200 hover:text-white border border-neutral-700 px-3.5 py-2 rounded-xl text-xs flex items-center gap-1.5 font-semibold transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4 text-amber-400" />
                  Simular Nova Postagem
                </button>
                <button
                  onClick={handleSimulateGoogleFetch}
                  disabled={simulatingFetch}
                  className="bg-gold-champagne text-neutral-950 px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 font-bold hover:bg-brand-gold hover:text-neutral-950 transition-all shadow-md cursor-pointer disabled:opacity-50"
                >
                  <Sparkles className="w-4 h-4 text-neutral-950" />
                  {simulatingFetch ? 'Buscando do Google...' : 'Sincronizar Feed Google'}
                </button>
              </div>
            </div>

            {/* Config & Metrics Row */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              
              {/* API Integration Settings */}
              <div className="lg:col-span-1 bg-neutral-950 p-5 rounded-2xl border border-neutral-800 space-y-4">
                <div>
                  <h4 className="text-[11px] font-semibold uppercase tracking-wider text-neutral-300 mb-2 border-b border-neutral-900 pb-1.5 flex items-center gap-1.5">
                    <Settings2 className="w-4 h-4 text-brand-gold" />
                    Parâmetros Google Business
                  </h4>
                  <p className="text-[10px] text-neutral-400 leading-relaxed mb-3">
                    Configurações do Google Place para o feed automático da Dra. Claudia França.
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-[10px] text-neutral-400 font-medium">Place ID da Clínica:</label>
                    <input 
                      type="text" 
                      value={placeId}
                      onChange={(e) => {
                        setPlaceId(e.target.value);
                        localStorage.setItem('google_place_id', e.target.value);
                      }}
                      placeholder="Ex: ChIJy99u_9VZzpQRrW4Y3_3vA9M"
                      className="w-full bg-neutral-900 border border-neutral-850 rounded-xl px-3 py-2 text-[11px] text-neutral-100 font-mono focus:border-amber-400 focus:outline-none"
                    />
                    <span className="text-[9px] text-neutral-500 italic block">Identificador oficial do Google Maps.</span>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] text-neutral-400 font-medium">Google API Key (Opcional):</label>
                    <input 
                      type="password" 
                      value={googleApiKey}
                      onChange={(e) => {
                        setGoogleApiKey(e.target.value);
                        localStorage.setItem('google_api_key', e.target.value);
                      }}
                      placeholder="AIzaSyA8xxxxxxxxxxxxxxxx"
                      className="w-full bg-neutral-900 border border-neutral-850 rounded-xl px-3 py-2 text-[11px] text-neutral-100 font-mono focus:border-amber-400 focus:outline-none"
                    />
                    <span className="text-[9px] text-neutral-500 italic block">Para sincronização real com Places API.</span>
                  </div>
                </div>

                <div className="pt-2">
                  <div className="bg-neutral-900 p-3.5 border border-neutral-850 rounded-xl space-y-1">
                    <div className="text-[10px] font-bold text-neutral-300 uppercase">Status do Feed</div>
                    <div className="text-[11px] text-[#3ECF8E] font-medium flex items-center gap-1.5 mt-1">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#3ECF8E] animate-pulse" />
                      Sincronização Ativa
                    </div>
                    <p className="text-[10px] text-neutral-400 leading-relaxed mt-1">
                      Conectado à página: <strong>Clínica Odontologia Dra. Claudia França</strong>
                    </p>
                  </div>
                </div>
              </div>

              {/* Reviews Moderation Area */}
              <div className="lg:col-span-3 bg-neutral-950 p-5 rounded-2xl border border-neutral-800 space-y-4">
                
                {/* Filter and search controls */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-900 pb-4">
                  
                  {/* Tabs filtering */}
                  <div className="flex bg-neutral-900 p-1 rounded-xl border border-neutral-850 shrink-0">
                    <button
                      onClick={() => setReviewTabFilter('all')}
                      className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${reviewTabFilter === 'all' ? 'bg-gold-champagne text-neutral-950' : 'text-neutral-400 hover:text-white'}`}
                    >
                      Todas ({reviews.length})
                    </button>
                    <button
                      onClick={() => setReviewTabFilter('approved')}
                      className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${reviewTabFilter === 'approved' ? 'bg-green-500/20 text-green-400' : 'text-neutral-400 hover:text-white'}`}
                    >
                      Aprovadas ({reviews.filter(r => r.approved !== false).length})
                    </button>
                    <button
                      onClick={() => setReviewTabFilter('pending')}
                      className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer relative ${reviewTabFilter === 'pending' ? 'bg-amber-500/20 text-amber-400' : 'text-neutral-400 hover:text-white'}`}
                    >
                      Pendentes ({reviews.filter(r => r.approved === false).length})
                      {reviews.filter(r => r.approved === false).length > 0 && (
                        <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full animate-ping" />
                      )}
                    </button>
                  </div>

                  {/* Search box */}
                  <div className="relative flex-1 max-w-xs">
                    <Search className="w-4 h-4 text-neutral-500 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      value={reviewSearchText}
                      onChange={(e) => setReviewSearchText(e.target.value)}
                      placeholder="Pesquisar autor ou texto..."
                      className="w-full bg-neutral-900 border border-neutral-850 rounded-xl pl-9 pr-4 py-2 text-xs text-neutral-200 focus:outline-none focus:border-brand-gold"
                    />
                  </div>
                </div>

                {/* Reviews List */}
                <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
                  {(() => {
                    const filtered = reviews.filter(rev => {
                      // Apply tab filter
                      if (reviewTabFilter === 'approved' && rev.approved === false) return false;
                      if (reviewTabFilter === 'pending' && rev.approved !== false) return false;
                      
                      // Apply search text
                      if (reviewSearchText.trim()) {
                        const s = reviewSearchText.toLowerCase();
                        return (
                          rev.author.toLowerCase().includes(s) || 
                          (rev.text && rev.text.toLowerCase().includes(s)) ||
                          (rev.treatment && rev.treatment.toLowerCase().includes(s))
                        );
                      }
                      
                      return true;
                    });

                    if (filtered.length === 0) {
                      return (
                        <div className="text-center py-10 border border-dashed border-neutral-850 rounded-xl space-y-2">
                          <Star className="w-8 h-8 text-neutral-600 mx-auto" />
                          <p className="text-neutral-400 font-medium">Nenhuma avaliação encontrada neste filtro.</p>
                          <p className="text-[10px] text-neutral-500">Adicione uma avaliação para simular ou clique em Sincronizar Feed Google.</p>
                        </div>
                      );
                    }

                    return filtered.map((rev) => (
                      <div 
                        key={rev.id} 
                        className={`p-4 rounded-xl border transition-all flex flex-col md:flex-row justify-between gap-4 ${rev.approved !== false ? 'bg-neutral-900/40 border-neutral-850' : 'bg-amber-950/10 border-amber-800/30'}`}
                      >
                        <div className="space-y-2 flex-1">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-neutral-800 border border-neutral-700 overflow-hidden flex items-center justify-center font-bold text-xs text-amber-400 font-sans uppercase shrink-0">
                              {rev.avatarUrl && rev.avatarUrl.startsWith('http') ? (
                                <img src={rev.avatarUrl} alt={rev.author} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                              ) : (
                                rev.author.charAt(0)
                              )}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className="text-xs font-bold text-white uppercase tracking-wide">{rev.author}</h4>
                                <span className="text-[8px] text-neutral-500">{rev.date}</span>
                                {rev.source === 'google' && (
                                  <span className="text-[7px] bg-[#4285F4]/15 text-[#4285F4] px-1.5 py-0.5 rounded font-mono uppercase font-bold tracking-wider">Google</span>
                                )}
                              </div>
                              <div className="flex items-center gap-2 mt-0.5">
                                <div className="flex gap-0.5 text-amber-400">
                                  {[...Array(rev.rating)].map((_, i) => <Star key={i} className="w-3 h-3 fill-current" />)}
                                </div>
                                {rev.treatment && (
                                  <span className="text-[9px] text-amber-200/80 bg-amber-500/10 px-1.5 py-0.5 rounded font-medium">
                                    Tratamento: {rev.treatment}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          <p className="text-xs text-neutral-300 leading-relaxed italic pl-1 border-l-2 border-neutral-800">
                            "{rev.text}"
                          </p>
                        </div>

                        {/* Approvals action panel */}
                        <div className="flex items-center gap-3 shrink-0 self-start md:self-center">
                          {rev.approved !== false ? (
                            <div className="flex flex-col items-end gap-1.5">
                              <span className="bg-green-500/10 text-green-400 border border-green-500/20 px-2.5 py-1 rounded-lg text-[9px] font-bold uppercase tracking-wider flex items-center gap-1">
                                <Check className="w-3 h-3" /> Aprovada no Site
                              </span>
                              <button
                                onClick={() => handleToggleReviewApproval(rev.id)}
                                className="text-neutral-400 hover:text-white text-[10px] underline cursor-pointer"
                              >
                                Ocultar do Site
                              </button>
                            </div>
                          ) : (
                            <div className="flex flex-col items-end gap-1.5">
                              <span className="bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2.5 py-1 rounded-lg text-[9px] font-bold uppercase tracking-wider flex items-center gap-1">
                                <Clock className="w-3 h-3" /> Pendente Moderação
                              </span>
                              <button
                                onClick={() => handleToggleReviewApproval(rev.id)}
                                className="bg-green-500 hover:bg-green-600 text-neutral-950 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer shadow-md"
                              >
                                Aprovar para o Site
                              </button>
                            </div>
                          )}

                          <button
                            onClick={() => handleDeleteReview(rev.id)}
                            className="bg-neutral-900 hover:bg-red-950/50 hover:text-red-400 border border-neutral-800 hover:border-red-900/30 p-2 rounded-lg transition-all cursor-pointer"
                            title="Remover Avaliação"
                          >
                            <Trash2 className="w-4 h-4 text-neutral-500 hover:text-red-400" />
                          </button>
                        </div>
                      </div>
                    ));
                  })()}
                </div>

              </div>

            </div>
          </div>
        )}

        {/* TAB 9: IDENTIDADE VISUAL & LOGO EDITOR */}
        {activeTab === 'identity' && (
          <div className="space-y-6 text-xs text-neutral-300">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800 pb-4">
              <div>
                <h1 className="font-serif text-xl text-brand-gold flex items-center gap-2">
                  <Sparkles className="w-6 h-6 text-brand-gold" />
                  Identidade Visual & Configurações da Marca
                </h1>
                <p className="text-xs text-neutral-400">
                  Gerencie as logos, favicon, dados da clínica e paleta de cores. As alterações são aplicadas globalmente em tempo real.
                </p>
              </div>
            </div>

            {/* Editor Layout Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Left Side: Logo Uploads & Color Selection */}
              <div className="lg:col-span-7 space-y-6">
                
                {/* Panel 1: Logos & Favicon */}
                <div className="bg-neutral-950 p-6 rounded-2xl border border-neutral-800 space-y-6">
                  <h3 className="font-serif text-sm text-brand-gold border-b border-neutral-900 pb-2 uppercase tracking-wider flex items-center gap-2">
                    <UploadCloud className="w-4 h-4" />
                    Logotipos & Favicon (Formatos suportados: PNG, JPG, WEBP, SVG)
                  </h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* Logo Principal */}
                    <div className="space-y-2">
                      <label className="text-neutral-400 font-bold block uppercase tracking-wide text-[10px]">Logo Principal (Versão Padrão)</label>
                      <div className="border border-neutral-800 bg-neutral-900/50 p-4 rounded-xl flex flex-col items-center justify-center text-center space-y-3 relative overflow-hidden group min-h-[160px]">
                        {siteContent?.logoPrincipal ? (
                          <div className="space-y-2">
                            <img src={siteContent.logoPrincipal} alt="Logo Principal Preview" className="h-14 max-w-full object-contain mx-auto" />
                            <button 
                              type="button" 
                              onClick={() => handleRemoveLogo('logoPrincipal')}
                              className="text-[10px] text-red-400 hover:text-red-300 font-semibold uppercase tracking-wider block mx-auto hover:underline"
                            >
                              Remover
                            </button>
                          </div>
                        ) : (
                          <div className="space-y-2 py-4">
                            <div className="w-10 h-10 rounded-full bg-neutral-800 flex items-center justify-center text-neutral-400 mx-auto border border-neutral-700">
                              <Plus className="w-5 h-5" />
                            </div>
                            <p className="text-[10px] text-neutral-500 font-medium">Nenhuma logo cadastrada</p>
                          </div>
                        )}
                        <input 
                          type="file" 
                          accept="image/*" 
                          onChange={(e) => handleLogoUpload(e, 'logoPrincipal')}
                          className="absolute inset-0 opacity-0 cursor-pointer" 
                          title="Fazer upload de nova logo"
                        />
                      </div>
                      <span className="text-[9px] text-neutral-500 block leading-tight">Será exibida no menu superior escuro e áreas gerais.</span>
                    </div>

                    {/* Logo Versão Clara */}
                    <div className="space-y-2">
                      <label className="text-neutral-400 font-bold block uppercase tracking-wide text-[10px]">Logo Versão Clara (Contraste Escuro)</label>
                      <div className="border border-neutral-800 bg-neutral-950 p-4 rounded-xl flex flex-col items-center justify-center text-center space-y-3 relative overflow-hidden group min-h-[160px]">
                        {siteContent?.logoClara ? (
                          <div className="space-y-2">
                            <img src={siteContent.logoClara} alt="Logo Clara Preview" className="h-14 max-w-full object-contain mx-auto" />
                            <button 
                              type="button" 
                              onClick={() => handleRemoveLogo('logoClara')}
                              className="text-[10px] text-red-400 hover:text-red-300 font-semibold uppercase tracking-wider block mx-auto hover:underline"
                            >
                              Remover
                            </button>
                          </div>
                        ) : (
                          <div className="space-y-2 py-4">
                            <div className="w-10 h-10 rounded-full bg-neutral-800 flex items-center justify-center text-neutral-400 mx-auto border border-neutral-700">
                              <Plus className="w-5 h-5" />
                            </div>
                            <p className="text-[10px] text-neutral-500 font-medium">Nenhuma logo cadastrada</p>
                          </div>
                        )}
                        <input 
                          type="file" 
                          accept="image/*" 
                          onChange={(e) => handleLogoUpload(e, 'logoClara')}
                          className="absolute inset-0 opacity-0 cursor-pointer" 
                          title="Fazer upload de logo clara"
                        />
                      </div>
                      <span className="text-[9px] text-neutral-500 block leading-tight">Indicada para rodapés escuros ou sobre imagens contrastantes.</span>
                    </div>

                    {/* Logo Versão Escura */}
                    <div className="space-y-2">
                      <label className="text-neutral-400 font-bold block uppercase tracking-wide text-[10px]">Logo Versão Escura (Contraste Claro)</label>
                      <div className="border border-neutral-800 bg-white/5 p-4 rounded-xl flex flex-col items-center justify-center text-center space-y-3 relative overflow-hidden group min-h-[160px]">
                        {siteContent?.logoEscura ? (
                          <div className="space-y-2">
                            <img src={siteContent.logoEscura} alt="Logo Escura Preview" className="h-14 max-w-full object-contain mx-auto" />
                            <button 
                              type="button" 
                              onClick={() => handleRemoveLogo('logoEscura')}
                              className="text-[10px] text-red-400 hover:text-red-300 font-semibold uppercase tracking-wider block mx-auto hover:underline"
                            >
                              Remover
                            </button>
                          </div>
                        ) : (
                          <div className="space-y-2 py-4">
                            <div className="w-10 h-10 rounded-full bg-neutral-800 flex items-center justify-center text-neutral-400 mx-auto border border-neutral-700">
                              <Plus className="w-5 h-5" />
                            </div>
                            <p className="text-[10px] text-neutral-500 font-medium">Nenhuma logo cadastrada</p>
                          </div>
                        )}
                        <input 
                          type="file" 
                          accept="image/*" 
                          onChange={(e) => handleLogoUpload(e, 'logoEscura')}
                          className="absolute inset-0 opacity-0 cursor-pointer" 
                          title="Fazer upload de logo escura"
                        />
                      </div>
                      <span className="text-[9px] text-neutral-500 block leading-tight">Indicada para fundos claros ou mídias impressas.</span>
                    </div>

                    {/* Favicon */}
                    <div className="space-y-2">
                      <label className="text-neutral-400 font-bold block uppercase tracking-wide text-[10px]">Ícone do Navegador (Favicon)</label>
                      <div className="border border-neutral-800 bg-neutral-900/50 p-4 rounded-xl flex flex-col items-center justify-center text-center space-y-3 relative overflow-hidden group min-h-[160px]">
                        {siteContent?.favicon ? (
                          <div className="space-y-2">
                            <img src={siteContent.favicon} alt="Favicon Preview" className="w-12 h-12 object-contain mx-auto rounded-lg border border-neutral-700 p-1" />
                            <button 
                              type="button" 
                              onClick={() => handleRemoveLogo('favicon')}
                              className="text-[10px] text-red-400 hover:text-red-300 font-semibold uppercase tracking-wider block mx-auto hover:underline"
                            >
                              Remover
                            </button>
                          </div>
                        ) : (
                          <div className="space-y-2 py-4">
                            <div className="w-10 h-10 rounded-full bg-neutral-800 flex items-center justify-center text-neutral-400 mx-auto border border-neutral-700">
                              <Plus className="w-5 h-5" />
                            </div>
                            <p className="text-[10px] text-neutral-500 font-medium">Nenhum favicon cadastrado</p>
                          </div>
                        )}
                        <input 
                          type="file" 
                          accept="image/*" 
                          onChange={(e) => handleLogoUpload(e, 'favicon')}
                          className="absolute inset-0 opacity-0 cursor-pointer" 
                          title="Fazer upload do favicon"
                        />
                      </div>
                      <span className="text-[9px] text-neutral-500 block leading-tight">Ícone que aparece na aba do navegador do paciente.</span>
                    </div>
                  </div>
                </div>

                {/* Panel 2: Brand Colors */}
                <div className="bg-neutral-950 p-6 rounded-2xl border border-neutral-800 space-y-6">
                  <h3 className="font-serif text-sm text-brand-gold border-b border-neutral-900 pb-2 uppercase tracking-wider flex items-center gap-2">
                    <Settings className="w-4 h-4" />
                    Cores Principais da Marca (Personalização de Paleta)
                  </h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    {/* Cor Primária */}
                    <div className="space-y-2">
                      <label className="text-neutral-400 font-semibold block uppercase tracking-wide text-[9px]">Dourado Champagne</label>
                      <div className="flex items-center gap-2 bg-neutral-900 border border-neutral-800 p-2.5 rounded-xl">
                        <input 
                          type="color" 
                          value={siteContent?.brandColorPrimary || '#C5A059'} 
                          onChange={(e) => handleColorChange('brandColorPrimary', e.target.value)}
                          className="w-8 h-8 rounded-lg border-0 cursor-pointer"
                        />
                        <input 
                          type="text" 
                          value={siteContent?.brandColorPrimary || '#C5A059'} 
                          onChange={(e) => handleColorChange('brandColorPrimary', e.target.value)}
                          className="w-full bg-transparent border-0 focus:outline-none text-neutral-100 font-mono text-xs uppercase"
                        />
                      </div>
                      <p className="text-[9px] text-neutral-500">Usado em destaques, bordas finas e detalhes premium.</p>
                    </div>

                    {/* Cor Secundária */}
                    <div className="space-y-2">
                      <label className="text-neutral-400 font-semibold block uppercase tracking-wide text-[9px]">Vinho / Accent Wine</label>
                      <div className="flex items-center gap-2 bg-neutral-900 border border-neutral-800 p-2.5 rounded-xl">
                        <input 
                          type="color" 
                          value={siteContent?.brandColorSecondary || '#8C434E'} 
                          onChange={(e) => handleColorChange('brandColorSecondary', e.target.value)}
                          className="w-8 h-8 rounded-lg border-0 cursor-pointer"
                        />
                        <input 
                          type="text" 
                          value={siteContent?.brandColorSecondary || '#8C434E'} 
                          onChange={(e) => handleColorChange('brandColorSecondary', e.target.value)}
                          className="w-full bg-transparent border-0 focus:outline-none text-neutral-100 font-mono text-xs uppercase"
                        />
                      </div>
                      <p className="text-[9px] text-neutral-500">Usado em botões principais, cabeçalhos de destaque.</p>
                    </div>

                    {/* Cor de Fundo */}
                    <div className="space-y-2">
                      <label className="text-neutral-400 font-semibold block uppercase tracking-wide text-[9px]">Fundo Nude / Warm</label>
                      <div className="flex items-center gap-2 bg-neutral-900 border border-neutral-800 p-2.5 rounded-xl">
                        <input 
                          type="color" 
                          value={siteContent?.brandColorBackground || '#FDFBF9'} 
                          onChange={(e) => handleColorChange('brandColorBackground', e.target.value)}
                          className="w-8 h-8 rounded-lg border-0 cursor-pointer"
                        />
                        <input 
                          type="text" 
                          value={siteContent?.brandColorBackground || '#FDFBF9'} 
                          onChange={(e) => handleColorChange('brandColorBackground', e.target.value)}
                          className="w-full bg-transparent border-0 focus:outline-none text-neutral-100 font-mono text-xs uppercase"
                        />
                      </div>
                      <p className="text-[9px] text-neutral-500">Fundo principal das seções institucionais do site.</p>
                    </div>
                  </div>

                  {/* Quick Preset Options */}
                  <div className="pt-2">
                    <p className="text-[9px] text-neutral-400 font-medium uppercase tracking-wider mb-2">Paletas de Cores Recomendadas (Presets Rápidos)</p>
                    <div className="flex flex-wrap gap-3">
                      <button 
                        type="button"
                        onClick={() => {
                          handleColorPreset('#C5A059', '#8C434E', '#FDFBF9');
                        }}
                        className="bg-neutral-900 hover:bg-neutral-850 border border-neutral-800 hover:border-neutral-700 px-3 py-2 rounded-xl flex items-center gap-2 transition-all cursor-pointer"
                      >
                        <div className="flex gap-1 shrink-0">
                          <span className="w-3 h-3 rounded-full bg-[#C5A059]" />
                          <span className="w-3 h-3 rounded-full bg-[#8C434E]" />
                          <span className="w-3 h-3 rounded-full bg-[#FDFBF9]" />
                        </div>
                        <span className="text-[10px] font-bold text-neutral-200">Manual Dra. Claudia (Padrão)</span>
                      </button>
                      <button 
                        type="button"
                        onClick={() => {
                          handleColorPreset('#B38E5D', '#542E35', '#FAF6F0');
                        }}
                        className="bg-neutral-900 hover:bg-neutral-850 border border-neutral-800 hover:border-neutral-700 px-3 py-2 rounded-xl flex items-center gap-2 transition-all cursor-pointer"
                      >
                        <div className="flex gap-1 shrink-0">
                          <span className="w-3 h-3 rounded-full bg-[#B38E5D]" />
                          <span className="w-3 h-3 rounded-full bg-[#542E35]" />
                          <span className="w-3 h-3 rounded-full bg-[#FAF6F0]" />
                        </div>
                        <span className="text-[10px] font-bold text-neutral-200">Champagne & Vinho Escuro</span>
                      </button>
                      <button 
                        type="button"
                        onClick={() => {
                          handleColorPreset('#D4AF37', '#1E3A8A', '#F8FAFC');
                        }}
                        className="bg-neutral-900 hover:bg-neutral-850 border border-neutral-800 hover:border-neutral-700 px-3 py-2 rounded-xl flex items-center gap-2 transition-all cursor-pointer"
                      >
                        <div className="flex gap-1 shrink-0">
                          <span className="w-3 h-3 rounded-full bg-[#D4AF37]" />
                          <span className="w-3 h-3 rounded-full bg-[#1E3A8A]" />
                          <span className="w-3 h-3 rounded-full bg-[#F8FAFC]" />
                        </div>
                        <span className="text-[10px] font-bold text-neutral-200">Ouro Real & Azul Imperial</span>
                      </button>
                    </div>
                  </div>
                </div>

              </div>

              {/* Right Side: Typography Settings & Clinic Info Details */}
              <div className="lg:col-span-5 space-y-6">
                
                {/* Panel 3: Brand Text Configuration */}
                <div className="bg-neutral-950 p-6 rounded-2xl border border-neutral-800 space-y-4">
                  <h3 className="font-serif text-sm text-brand-gold border-b border-neutral-900 pb-2 uppercase tracking-wider flex items-center gap-2">
                    <Edit2 className="w-4 h-4" />
                    Tipografia & Textos de Assinatura
                  </h3>

                  <div className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-neutral-400 font-semibold block uppercase tracking-wide text-[9px]">Nome da Clínica / Doutora</label>
                      <input 
                        type="text"
                        value={siteContent?.brandName || "Dra. Claudia França"}
                        onChange={(e) => handleFieldChange('brandName', e.target.value)}
                        placeholder="Ex: Dra. Claudia França"
                        className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-xs text-neutral-100 focus:outline-none focus:border-gold-champagne font-serif"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-neutral-400 font-semibold block uppercase tracking-wide text-[9px]">Subtítulo da Marca</label>
                      <input 
                        type="text"
                        value={siteContent?.brandSub || "Saúde & Estética"}
                        onChange={(e) => handleFieldChange('brandSub', e.target.value)}
                        placeholder="Ex: Saúde & Estética"
                        className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-xs text-neutral-100 focus:outline-none focus:border-gold-champagne"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-neutral-400 font-semibold block uppercase tracking-wide text-[9px]">Registro de Classe (CRO)</label>
                      <input 
                        type="text"
                        value={siteContent?.brandCro || "CRO-SP 143883"}
                        onChange={(e) => handleFieldChange('brandCro', e.target.value)}
                        placeholder="Ex: CRO-SP 143883"
                        className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-xs text-neutral-100 focus:outline-none focus:border-gold-champagne font-mono"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-neutral-400 font-semibold block uppercase tracking-wide text-[9px]">Tipo de Estabelecimento</label>
                      <input 
                        type="text"
                        value={siteContent?.brandType || "Clínica Odontológica"}
                        onChange={(e) => handleFieldChange('brandType', e.target.value)}
                        placeholder="Ex: Clínica Odontológica"
                        className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-xs text-neutral-100 focus:outline-none focus:border-gold-champagne"
                      />
                    </div>
                  </div>
                </div>

                {/* Panel 4: Contact & Location Info Details */}
                <div className="bg-neutral-950 p-6 rounded-2xl border border-neutral-800 space-y-4">
                  <h3 className="font-serif text-sm text-brand-gold border-b border-neutral-900 pb-2 uppercase tracking-wider flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    Informações de Contato & Localização
                  </h3>

                  <div className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-neutral-400 font-semibold block uppercase tracking-wide text-[9px]">Telefones de Atendimento</label>
                      <input 
                        type="text"
                        value={siteContent?.contactPhone || "(11) 3271-7271 / (11) 99534-9751"}
                        onChange={(e) => handleFieldChange('contactPhone', e.target.value)}
                        placeholder="Ex: (11) 3271-7271 / (11) 99534-9751"
                        className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-xs text-neutral-100 focus:outline-none focus:border-gold-champagne"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-neutral-400 font-semibold block uppercase tracking-wide text-[9px]">WhatsApp Oficial (Apenas número para botões)</label>
                      <input 
                        type="text"
                        value={siteContent?.contactWhatsapp || "(11) 99534-9751"}
                        onChange={(e) => handleFieldChange('contactWhatsapp', e.target.value)}
                        placeholder="Ex: (11) 99534-9751"
                        className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-xs text-neutral-100 focus:outline-none focus:border-gold-champagne"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-neutral-400 font-semibold block uppercase tracking-wide text-[9px]">E-mail de Relacionamento</label>
                      <input 
                        type="email"
                        value={siteContent?.contactEmail || "contato@draclaudiafranca.com.br"}
                        onChange={(e) => handleFieldChange('contactEmail', e.target.value)}
                        placeholder="Ex: contato@draclaudiafranca.com.br"
                        className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-xs text-neutral-100 focus:outline-none focus:border-gold-champagne"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-neutral-400 font-semibold block uppercase tracking-wide text-[9px]">Endereço Oficial da Clínica</label>
                      <textarea 
                        rows={2}
                        value={siteContent?.contactAddress || "Rua Gama Cerqueira, 726, Sala 02, Cambuci, São Paulo/SP, CEP 01539-010"}
                        onChange={(e) => handleFieldChange('contactAddress', e.target.value)}
                        placeholder="Escreva o endereço completo da clínica..."
                        className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-xs text-neutral-100 focus:outline-none focus:border-gold-champagne leading-relaxed"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-neutral-400 font-semibold block uppercase tracking-wide text-[9px]">Horário de Funcionamento</label>
                      <input 
                        type="text"
                        value={siteContent?.clinicHours || "Segunda a Sexta: 08h às 19h | Sábado: 08h às 13h"}
                        onChange={(e) => handleFieldChange('clinicHours', e.target.value)}
                        placeholder="Ex: Segunda a Sexta: 08h às 19h | Sábado: 08h às 13h"
                        className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-xs text-neutral-100 focus:outline-none focus:border-gold-champagne"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-neutral-400 font-semibold block uppercase tracking-wide text-[9px]">Link Oficial de Localização (Google Maps)</label>
                      <input 
                        type="url"
                        value={siteContent?.clinicMapsLink || "https://maps.app.goo.gl/VUebcvBKzmWi5aVG8"}
                        onChange={(e) => handleFieldChange('clinicMapsLink', e.target.value)}
                        placeholder="Cole aqui o link compartilhado do Google Maps..."
                        className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-xs text-neutral-100 focus:outline-none focus:border-gold-champagne font-mono"
                      />
                    </div>
                  </div>
                </div>

                {/* Persistent Action Panel */}
                <div className="bg-neutral-950 p-4 rounded-2xl border border-neutral-800 flex justify-between items-center gap-4">
                  <div className="text-[10px] text-neutral-400 flex items-center gap-1.5 leading-snug">
                    <ShieldCheck className="w-4 h-4 text-brand-gold shrink-0" />
                    <span>Todas as alterações são seguras e replicadas instantaneamente.</span>
                  </div>
                  <button 
                    type="button"
                    onClick={handleSaveVisualIdentity}
                    className="bg-gold-champagne hover:bg-white text-neutral-950 px-5 py-2.5 rounded-xl font-bold uppercase tracking-wider text-[11px] transition-all flex items-center gap-2 cursor-pointer shadow-md shrink-0 hover:scale-[1.02]"
                  >
                    <Save className="w-4 h-4" />
                    Salvar Alterações
                  </button>
                </div>

              </div>

            </div>

          </div>
        )}

      </main>

      {/* MODAL: ADD PATIENT */}
      {showAddPatientModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form onSubmit={handleAddPatient} className="bg-neutral-950 w-full max-w-md rounded-3xl border border-neutral-800 p-6 space-y-4 text-xs">
            <h3 className="font-serif text-gold-champagne text-base border-b border-neutral-800 pb-2 mb-2">Cadastrar Novo Paciente</h3>
            
            <div className="space-y-1">
              <label className="text-neutral-400 font-medium">Nome Completo:</label>
              <input 
                type="text" 
                value={newPatientName}
                onChange={(e) => setNewPatientName(e.target.value)}
                placeholder="Ex: Pedro Henrique Vasconcellos"
                className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-neutral-100"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-neutral-400 font-medium">E-mail:</label>
                <input 
                  type="email" 
                  value={newPatientEmail}
                  onChange={(e) => setNewPatientEmail(e.target.value)}
                  placeholder="pedro.henrique@gmail.com"
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-neutral-100"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-neutral-400 font-medium">WhatsApp:</label>
                <input 
                  type="text" 
                  value={newPatientPhone}
                  onChange={(e) => setNewPatientPhone(e.target.value)}
                  placeholder="(11) 99999-8888"
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-neutral-100"
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-neutral-400 font-medium">Origem do Lead:</label>
              <select 
                value={newPatientSource}
                onChange={(e) => setNewPatientSource(e.target.value as any)}
                className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-neutral-100"
              >
                <option value="Instagram">Instagram (Orgânico ou Ads)</option>
                <option value="Google Search">Google Search (Orgânico)</option>
                <option value="Google Ads">Google Ads (Campanhas)</option>
                <option value="Indicação">Indicação de Amigos</option>
                <option value="WhatsApp">WhatsApp Direto</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-neutral-400 font-medium">Notas Iniciais / Queixa Principal:</label>
              <textarea 
                value={newPatientNotes}
                onChange={(e) => setNewPatientNotes(e.target.value)}
                rows={3}
                placeholder="Escreva dores, queixas estéticas ou tratamentos planejados..."
                className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-neutral-100"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-neutral-800">
              <button 
                type="button" 
                onClick={() => setShowAddPatientModal(false)}
                className="px-4 py-2 bg-neutral-900 hover:bg-neutral-850 text-neutral-400 font-semibold rounded-xl"
              >
                Cancelar
              </button>
              <button 
                type="submit"
                className="px-4 py-2 bg-gold-champagne text-neutral-950 font-bold rounded-xl"
              >
                Salvar Registro
              </button>
            </div>
          </form>
        </div>
      )}

      {/* MODAL: ADD LEAD */}
      {showAddLeadModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form onSubmit={handleAddLead} className="bg-neutral-950 w-full max-w-md rounded-3xl border border-neutral-800 p-6 space-y-4 text-xs">
            <h3 className="font-serif text-gold-champagne text-base border-b border-neutral-800 pb-2 mb-2">Adicionar Novo Lead ao Funil</h3>
            
            <div className="space-y-1">
              <label className="text-neutral-400 font-medium">Nome do Lead:</label>
              <input 
                type="text" 
                value={newLeadName}
                onChange={(e) => setNewLeadName(e.target.value)}
                placeholder="Ex: Roberta da Silva Dias"
                className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-neutral-100"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-neutral-400 font-medium">Telefone:</label>
                <input 
                  type="text" 
                  value={newLeadPhone}
                  onChange={(e) => setNewLeadPhone(e.target.value)}
                  placeholder="(11) 98122-3904"
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-neutral-100"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-neutral-400 font-medium">Valor Estimado (R$):</label>
                <input 
                  type="number" 
                  value={newLeadValue}
                  onChange={(e) => setNewLeadValue(Number(e.target.value))}
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-neutral-100"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-neutral-400 font-medium">Serviço de Interesse:</label>
                <select 
                  value={newLeadService}
                  onChange={(e) => setNewLeadService(e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-neutral-100"
                >
                  <option value="Invisalign">Invisalign</option>
                  <option value="Toxina Botulínica (Botox)">Toxina Botulínica (Botox)</option>
                  <option value="Ácido Hialurônico (Preenchimento)">Ácido Hialurônico (Preenchimento)</option>
                  <option value="Implantes Unitários">Implantes Unitários</option>
                  <option value="Skinbooster">Skinbooster</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-neutral-400 font-medium">Origem da Mídia:</label>
                <select 
                  value={newLeadSource}
                  onChange={(e) => setNewLeadSource(e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-neutral-100"
                >
                  <option value="Instagram">Instagram</option>
                  <option value="Google Ads">Google Ads</option>
                  <option value="Google Search">Google Search</option>
                  <option value="Indicação">Indicação</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-neutral-800">
              <button 
                type="button" 
                onClick={() => setShowAddLeadModal(false)}
                className="px-4 py-2 bg-neutral-900 hover:bg-neutral-850 text-neutral-400 font-semibold rounded-xl cursor-pointer"
              >
                Cancelar
              </button>
              <button 
                type="submit"
                className="px-4 py-2 bg-gold-champagne text-neutral-950 font-bold rounded-xl cursor-pointer"
              >
                Inserir no Funil
              </button>
            </div>
          </form>
        </div>
      )}

      {/* MODAL: LEAD DETAIL & CLINICAL TRIAGING COCKPIT */}
      {selectedLead && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-neutral-950 w-full max-w-2xl rounded-3xl border border-neutral-800 p-6 md:p-8 space-y-6 text-xs text-neutral-300 max-h-[90vh] overflow-y-auto shadow-2xl relative">
            
            {/* Close absolute button */}
            <button 
              onClick={() => setSelectedLead(null)}
              className="absolute top-5 right-5 text-neutral-400 hover:text-white p-1.5 rounded-full bg-neutral-900 border border-neutral-800 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Header: Lead Name and Stage Pill */}
            <div className="border-b border-neutral-800 pb-4">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span className="text-[9px] font-bold uppercase tracking-widest text-gold-champagne bg-gold-champagne/10 px-2.5 py-1 rounded border border-gold-champagne/20">
                  Triagem Clínica do Site
                </span>
                <span className={`text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 rounded border ${
                  selectedLead.stage === 'novo' ? 'bg-blue-600/10 text-blue-400 border-blue-600/20' :
                  selectedLead.stage === 'contato' ? 'bg-orange-600/10 text-orange-400 border-orange-600/20' :
                  selectedLead.stage === 'agendado' ? 'bg-yellow-600/10 text-yellow-400 border-yellow-600/20' :
                  selectedLead.stage === 'concluido' ? 'bg-green-600/10 text-green-400 border-green-600/20' :
                  'bg-neutral-600/10 text-neutral-400 border-neutral-600/20'
                }`}>
                  {CRM_STAGES.find(s => s.id === selectedLead.stage)?.label || selectedLead.stage}
                </span>
              </div>
              <h3 className="font-serif text-xl text-neutral-100 uppercase tracking-wide">{selectedLead.name}</h3>
              <p className="text-[10px] text-neutral-500 font-light mt-0.5">Cadastrado em: {selectedLead.date} | Canal de Origem: {selectedLead.source}</p>
            </div>

            {/* Content grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column: Personal info & contact actions */}
              <div className="space-y-4">
                <h4 className="font-bold text-[10px] text-gold-champagne uppercase tracking-wider border-b border-neutral-900 pb-1">Identificação & Contato Direto</h4>
                
                <div className="space-y-3 bg-neutral-900/50 p-4 rounded-2xl border border-neutral-900">
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="text-neutral-500">E-mail:</span>
                    <a href={`mailto:${selectedLead.email}`} className="text-neutral-200 hover:text-gold-champagne font-medium transition-colors">{selectedLead.email}</a>
                  </div>
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="text-neutral-500">Telefone:</span>
                    <a href={`tel:${selectedLead.phone}`} className="text-neutral-200 hover:text-gold-champagne font-medium transition-colors">{selectedLead.phone}</a>
                  </div>
                  {selectedLead.whatsapp && (
                    <div className="flex justify-between items-center text-[11px]">
                      <span className="text-neutral-500">WhatsApp:</span>
                      <span className="text-neutral-200 font-medium">{selectedLead.whatsapp}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="text-neutral-500">Valor Estimado:</span>
                    <span className="font-bold font-mono text-gold-champagne text-xs">R$ {selectedLead.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                  </div>
                </div>

                {/* Direct Action buttons */}
                <div className="space-y-2">
                  <a 
                    href={`https://wa.me/${(selectedLead.whatsapp || selectedLead.phone).replace(/\D/g, '')}?text=Olá%20${encodeURIComponent(selectedLead.name)},%20aqui%20é%20da%20equipe%20da%20Dra.%20Claudia%20França.%20Recebemos%20seu%20contato%20sobre%20${encodeURIComponent(selectedLead.serviceInterested)}%20e%20gostaríamos%20de%20conversar!`}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-3 bg-[#25D366] text-white hover:bg-neutral-800 hover:text-[#25D366] border border-[#25D366] text-center text-[10px] font-bold tracking-widest uppercase rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <MessageSquare className="w-4 h-4 fill-white" />
                    Iniciar Conversa no WhatsApp
                  </a>
                </div>
              </div>

              {/* Right Column: Custom Triaging questions responses */}
              <div className="space-y-4">
                <h4 className="font-bold text-[10px] text-gold-champagne uppercase tracking-wider border-b border-neutral-900 pb-1">Triagem Clínica Detalhada</h4>
                
                <div className="space-y-3">
                  <div className="bg-neutral-900/50 p-4 rounded-2xl border border-neutral-900 space-y-2 text-[11px]">
                    <p className="font-bold text-neutral-400 uppercase tracking-wider text-[9px]">Serviço de maior interesse:</p>
                    <p className="text-neutral-200 font-semibold text-xs text-gold-champagne">{selectedLead.serviceInterested}</p>
                  </div>

                  {selectedLead.customQuestions && selectedLead.customQuestions.length > 0 ? (
                    <div className="bg-neutral-900/40 border border-neutral-900 rounded-2xl p-4 space-y-3.5 max-h-[160px] overflow-y-auto">
                      {selectedLead.customQuestions.map((q, idx) => (
                        <div key={idx} className="space-y-1 text-[11px] border-b border-neutral-900/50 pb-2 last:border-0 last:pb-0">
                          <p className="text-neutral-500 font-medium">Q: {q.question}</p>
                          <p className="text-neutral-100 font-semibold bg-neutral-950 p-2 rounded-lg border border-neutral-900 mt-1">A: {q.answer}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-neutral-900/20 border border-neutral-900/50 rounded-2xl p-4 text-center text-neutral-500 text-[10px] font-light">
                      Nenhuma resposta de triagem específica enviada.
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Document Attachments / Files */}
            <div className="space-y-3 pt-2">
              <h4 className="font-bold text-[10px] text-gold-champagne uppercase tracking-wider border-b border-neutral-900 pb-1">Documentos e Fotos Anexados pelo Paciente</h4>
              {selectedLead.attachedFiles && selectedLead.attachedFiles.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {selectedLead.attachedFiles.map((file, idx) => (
                    <div 
                      key={idx} 
                      className="bg-neutral-900 border border-neutral-800 p-3 rounded-2xl flex items-center justify-between group/file hover:border-gold-champagne/40 transition-all"
                    >
                      <div className="flex items-center gap-2 truncate text-[11px]">
                        <Paperclip className="w-4 h-4 text-gold-champagne shrink-0" />
                        <div className="truncate">
                          <p className="text-neutral-200 font-medium truncate" title={file.name}>{file.name}</p>
                          <p className="text-[9px] text-neutral-500 font-mono">{file.size} • {file.type}</p>
                        </div>
                      </div>
                      <button 
                        type="button"
                        onClick={() => alert(`Simulação Premium: Abrindo arquivo clínico de triagem "${file.name}" para visualização em alta definição.`)}
                        className="bg-neutral-850 hover:bg-gold-champagne hover:text-neutral-950 px-2.5 py-1 text-[9px] uppercase tracking-wider font-semibold rounded-lg text-neutral-400 transition-colors shrink-0"
                      >
                        Visualizar
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-neutral-900/20 border border-neutral-900/50 rounded-2xl p-4 text-center text-neutral-500 text-[10px] font-light">
                  Nenhum arquivo ou exame em anexo para este lead.
                </div>
              )}
            </div>

            {/* Free Message Observations */}
            <div className="space-y-2">
              <h4 className="font-bold text-[10px] text-gold-champagne uppercase tracking-wider border-b border-neutral-900 pb-1">Mensagem do Lead</h4>
              <div className="bg-neutral-900/30 p-4 rounded-2xl border border-neutral-900 text-[11px] leading-relaxed text-neutral-300 whitespace-pre-wrap font-light">
                {selectedLead.notes || "Nenhuma mensagem livre ou observação enviada."}
              </div>
            </div>

            {/* Bottom Actions: Convert Lead to Patient or Change Stage */}
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between pt-4 border-t border-neutral-800">
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <span className="text-neutral-500 font-medium whitespace-nowrap">Alterar Funil:</span>
                <select 
                  value={selectedLead.stage}
                  onChange={(e) => handleMoveLead(selectedLead.id, e.target.value as CRMStage)}
                  className="bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-neutral-100 focus:outline-none focus:border-gold-champagne w-full sm:w-auto"
                >
                  {CRM_STAGES.map(s => (
                    <option key={s.id} value={s.id}>{s.label}</option>
                  ))}
                </select>
              </div>

              <div className="flex gap-2 w-full sm:w-auto">
                <button 
                  onClick={() => setSelectedLead(null)}
                  className="flex-1 sm:flex-initial px-4 py-3 bg-neutral-900 hover:bg-neutral-850 text-neutral-400 font-semibold rounded-xl text-[10px] uppercase tracking-wider cursor-pointer"
                >
                  Fechar
                </button>
                <button 
                  onClick={() => handleConvertLeadToPatient(selectedLead)}
                  className="flex-1 sm:flex-initial px-5 py-3 bg-gold-champagne text-neutral-950 hover:bg-white hover:text-neutral-950 font-bold rounded-xl text-[10px] uppercase tracking-widest transition-all flex items-center justify-center gap-1.5 shadow-md cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 animate-pulse text-neutral-950" />
                  Converter em Paciente
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* MODAL: SIMULATE NEW GOOGLE REVIEW POST */}
      {showAddSimReview && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form onSubmit={handleSimulateUserPost} className="bg-neutral-950 w-full max-w-md rounded-3xl border border-neutral-800 p-6 space-y-4 text-xs text-neutral-200">
            <div>
              <h3 className="font-serif text-gold-champagne text-base border-b border-neutral-800 pb-2 flex items-center gap-2">
                <Star className="w-5 h-5 fill-current text-amber-400" />
                Simular Avaliação no Google Places
              </h3>
              <p className="text-[10px] text-neutral-400 mt-1">
                Simule um paciente enviando uma nova avaliação à página da clínica no Google. Ela aparecerá como <strong>Pendente</strong> no painel.
              </p>
            </div>

            <div className="space-y-1">
              <label className="text-neutral-400 font-medium">Nome do Paciente:</label>
              <input 
                type="text" 
                value={simAuthor}
                onChange={(e) => setSimAuthor(e.target.value)}
                placeholder="Ex: Mariana Vasconcellos Prado"
                className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-neutral-100 focus:outline-none focus:border-amber-400"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-neutral-400 font-medium">Nota (Estrelas):</label>
                <select 
                  value={simRating}
                  onChange={(e) => setSimRating(Number(e.target.value))}
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-neutral-100 focus:outline-none focus:border-amber-400 font-bold"
                >
                  <option value={5}>⭐⭐⭐⭐⭐ (5 Estrelas)</option>
                  <option value={4}>⭐⭐⭐⭐ (4 Estrelas)</option>
                  <option value={3}>⭐⭐⭐ (3 Estrelas)</option>
                  <option value={2}>⭐⭐ (2 Estrelas)</option>
                  <option value={1}>⭐ (1 Estrela)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-neutral-400 font-medium">Tratamento Realizado:</label>
                <select 
                  value={simTreatment}
                  onChange={(e) => setSimTreatment(e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-neutral-100 focus:outline-none focus:border-amber-400"
                >
                  <option value="Invisalign">Invisalign</option>
                  <option value="Harmonização Orofacial">Harmonização Orofacial</option>
                  <option value="Implantes Dentários">Implantes Dentários</option>
                  <option value="Clareamento Dental">Clareamento Dental</option>
                  <option value="Facetas de Porcelana">Facetas de Porcelana</option>
                  <option value="Estética Dental">Estética Dental</option>
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-neutral-400 font-medium">Texto da Avaliação:</label>
              <textarea 
                rows={4}
                value={simText}
                onChange={(e) => setSimText(e.target.value)}
                placeholder="Ex: Amei o atendimento da Dra. Claudia! O consultório é impecável e ela é muito gentil e competente."
                className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-neutral-100 focus:outline-none focus:border-amber-400 leading-relaxed"
                required
              />
            </div>

            <div className="flex gap-2.5 pt-2 border-t border-neutral-800">
              <button 
                type="button"
                onClick={() => setShowAddSimReview(false)}
                className="flex-1 py-2.5 bg-neutral-900 hover:bg-neutral-850 text-neutral-400 font-semibold rounded-xl text-center uppercase tracking-wider cursor-pointer"
              >
                Cancelar
              </button>
              <button 
                type="submit"
                className="flex-1 py-2.5 bg-gold-champagne text-neutral-950 font-bold rounded-xl text-center uppercase tracking-wider hover:bg-white transition-colors cursor-pointer"
              >
                Enviar Avaliação
              </button>
            </div>
          </form>
        </div>
      )}

      {/* MODAL: CREATE OR EDIT BLOG POST */}
      {isBlogModalOpen && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form onSubmit={handleSaveBlogPost} className="bg-neutral-950 w-full max-w-xl rounded-3xl border border-neutral-800 p-6 space-y-4 text-xs text-neutral-200 overflow-y-auto max-h-[90vh]">
            <div>
              <h3 className="font-serif text-gold-champagne text-base border-b border-neutral-800 pb-2 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-gold-champagne" />
                {editingBlogPost ? 'Editar Publicação do Blog' : 'Escrever Nova Publicação'}
              </h3>
              <p className="text-[10px] text-neutral-400 mt-1">
                Adicione ou altere as postagens do blog público. Artigos bem estruturados melhoram a experiência do paciente e seu ranqueamento orgânico.
              </p>
            </div>

            <div className="space-y-1">
              <label className="text-neutral-400 font-medium">Título do Artigo:</label>
              <input 
                type="text" 
                value={blogFormTitle}
                onChange={(e) => setBlogFormTitle(e.target.value)}
                placeholder="Ex: Como cuidar do clareamento dental em casa"
                className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-neutral-100 focus:outline-none focus:border-gold-champagne"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="space-y-1">
                <label className="text-neutral-400 font-medium">Categoria:</label>
                <select 
                  value={blogFormCategory}
                  onChange={(e) => setBlogFormCategory(e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-neutral-100 focus:outline-none focus:border-gold-champagne"
                >
                  <option value="Estética">Estética</option>
                  <option value="Implantes">Implantes</option>
                  <option value="Saúde Bucal">Saúde Bucal</option>
                  <option value="Reabilitação">Reabilitação</option>
                  <option value="Ortodontia">Ortodontia</option>
                  <option value="Dicas Gerais">Dicas Gerais</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-neutral-400 font-medium">Tempo de Leitura:</label>
                <input 
                  type="text" 
                  value={blogFormReadTime}
                  onChange={(e) => setBlogFormReadTime(e.target.value)}
                  placeholder="Ex: 5 min de leitura"
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-neutral-100 focus:outline-none focus:border-gold-champagne"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-neutral-400 font-medium">Autor do Artigo:</label>
                <input 
                  type="text" 
                  value={blogFormAuthor}
                  onChange={(e) => setBlogFormAuthor(e.target.value)}
                  placeholder="Ex: Dra. Claudia França"
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-neutral-100 focus:outline-none focus:border-gold-champagne"
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <label className="text-neutral-400 font-medium">URL da Imagem de Capa:</label>
                <span className="text-[9px] text-neutral-500 font-mono">(Deixe vazio para usar capa padrão)</span>
              </div>
              <input 
                type="url" 
                value={blogFormImageUrl}
                onChange={(e) => setBlogFormImageUrl(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-neutral-100 focus:outline-none focus:border-gold-champagne"
              />
            </div>

            <div className="space-y-1">
              <label className="text-neutral-400 font-medium">Resumo do Artigo (Excerpt - exibido na lista):</label>
              <textarea 
                rows={2}
                value={blogFormExcerpt}
                onChange={(e) => setBlogFormExcerpt(e.target.value)}
                placeholder="Uma breve introdução instigante sobre o tema para prender a atenção do leitor..."
                className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-neutral-100 focus:outline-none focus:border-gold-champagne leading-relaxed"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-neutral-400 font-medium">Conteúdo Completo do Artigo:</label>
              <textarea 
                rows={6}
                value={blogFormContent}
                onChange={(e) => setBlogFormContent(e.target.value)}
                placeholder="Escreva aqui o artigo completo. Você pode separar parágrafos para uma leitura confortável e envolvente..."
                className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-neutral-100 focus:outline-none focus:border-gold-champagne leading-relaxed"
                required
              />
            </div>

            <div className="flex gap-2.5 pt-2 border-t border-neutral-800">
              <button 
                type="button"
                onClick={() => {
                  setIsBlogModalOpen(false);
                  setEditingBlogPost(null);
                }}
                className="flex-1 py-2.5 bg-neutral-900 hover:bg-neutral-850 text-neutral-400 font-semibold rounded-xl text-center uppercase tracking-wider cursor-pointer"
              >
                Cancelar
              </button>
              <button 
                type="submit"
                className="flex-1 py-2.5 bg-gold-champagne text-neutral-950 font-bold rounded-xl text-center uppercase tracking-wider hover:bg-white transition-colors cursor-pointer"
              >
                {editingBlogPost ? 'Salvar Alterações' : 'Publicar Artigo'}
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
}
