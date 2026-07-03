/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Service {
  id: string;
  name: string;
  category: 'harmonizacao' | 'implantodontia' | 'ortodontia' | 'clinica_geral' | 'estetica' | 'reabilitacao' | string;
  shortDescription: string;
  fullDescription: string;
  benefits: string[];
  indications: string[];
  contraindications?: string[];
  averageTime?: string;
  recovery?: string;
  ctaText?: string;
  faqs: { question: string; answer: string }[];
  priceEstimate?: string;
  imageUrl?: string;
}

export interface Patient {
  id: string;
  name: string;
  email: string;
  phone: string;
  birthDate: string;
  leadSource: 'Google Search' | 'Instagram' | 'Indicação' | 'WhatsApp' | 'Google Ads' | 'Outro';
  status: 'Ativo' | 'Em Tratamento' | 'Finalizado' | 'Inativo';
  history: {
    date: string;
    description: string;
    doctor: string;
  }[];
  documents: {
    id: string;
    name: string;
    date: string;
    size: string;
    type: 'raio-x' | 'receita' | 'consentimento' | 'exame';
    url?: string;
  }[];
  observations: string;
  createdDate: string;
}

export type CRMStage =
  | 'novo'
  | 'contato'
  | 'agendado'
  | 'compareceu'
  | 'orcamento'
  | 'iniciado'
  | 'concluido'
  | 'pos_venda';

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  whatsapp?: string;
  serviceInterested: string;
  stage: CRMStage;
  value: number;
  date: string;
  notes?: string;
  source: string;
  customQuestions?: { question: string; answer: string }[];
  attachedFiles?: { name: string; size: string; type: string }[];
}

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  patientPhone: string;
  serviceName: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  status: 'pending' | 'approved' | 'rescheduled' | 'cancelled';
  type: 'presencial' | 'teleconsulta';
  price: number;
  paid: boolean;
  paymentMethod?: 'pix' | 'cartao' | 'boleto' | 'carteira';
  videoLink?: string;
  notes?: string;
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  date: string;
  readTime: string;
  imageUrl: string;
  author: string;
  slug: string;
  tags: string[];
}

export interface Review {
  id: string;
  author: string;
  rating: number;
  text: string;
  date: string;
  avatarUrl: string;
  treatment?: string;
}

export interface FinanceRecord {
  id: string;
  type: 'receita' | 'despesa';
  amount: number;
  date: string;
  category: string;
  status: 'pago' | 'pendente';
  description: string;
  patientName?: string;
  paymentMethod?: 'pix' | 'cartao' | 'boleto';
}

export interface MarketingCampaign {
  id: string;
  name: string;
  platform: 'Google Ads' | 'Meta Ads' | 'SEO Local' | 'Instagram Orgânico';
  investment: number;
  leadsGenerated: number;
  conversions: number;
  clicks: number;
  impressions: number;
  revenue: number;
}

export interface ClinicSpace {
  id: string;
  title: string;
  description: string;
  details: string;
  imageUrl: string;
}

export interface SiteContent {
  // Hero section
  heroBadge: string;
  heroTitle: string;
  heroSubtitle: string;
  heroCta1: string;
  heroCta2: string;
  heroMetric1Value: string;
  heroMetric1Label: string;
  heroMetric2Value: string;
  heroMetric2Label: string;
  heroMetric3Value: string;
  heroMetric3Label: string;
  heroImageUrl: string;
  heroQuote: string;
  heroQuoteAuthor: string;

  // Bio section
  bioBadge: string;
  bioTitle: string;
  bioText1: string;
  bioText2: string;
  bioCardTitle: string;
  bioCardText: string;
  bioImageUrl: string;
  bioCro: string;

  // Spaces / Estrutura section
  spacesTitle: string;
  spacesSubtitle: string;
  clinicSpaces: ClinicSpace[];

  // Before/after section
  resultsTitle: string;
  resultsSubtitle: string;
  beforeImageUrl: string;
  afterImageUrl: string;

  // Contact section
  contactTitle: string;
  contactSubtitle: string;
  contactAddress: string;
  contactPhone: string;
  contactEmail: string;

  // Brand config fields for live editor
  brandName?: string;
  brandSub?: string;
  brandCro?: string;
  brandType?: string;
}

