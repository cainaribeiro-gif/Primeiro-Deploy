import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Lead, Appointment } from '../types';

let supabaseInstance: SupabaseClient | null = null;

// Retrieves the Supabase URL and Key from environment variables safely
export const getSupabaseConfig = () => {
  const url = (import.meta as any).env.VITE_SUPABASE_URL || '';
  const key = (import.meta as any).env.VITE_SUPABASE_ANON_KEY || '';
  return { url, key, isConfigured: !!(url && key) };
};

// Lazy initialization of Supabase Client to avoid crashing if env variables are empty
export const getSupabaseClient = (): SupabaseClient | null => {
  if (supabaseInstance) return supabaseInstance;

  const { url, key, isConfigured } = getSupabaseConfig();

  if (!isConfigured) {
    return null;
  }

  try {
    supabaseInstance = createClient(url, key);
    return supabaseInstance;
  } catch (error) {
    console.error('Falha ao inicializar o cliente do Supabase:', error);
    return null;
  }
};

/**
 * Inserts or updates a lead (pré-agendamento from contact forms) in Supabase.
 */
export async function sendLeadToSupabase(lead: Lead): Promise<{ success: boolean; error?: string }> {
  const client = getSupabaseClient();
  
  if (!client) {
    console.warn('⚠️ Supabase não configurado. Salvando localmente:', lead);
    // Emulate successful local persistence fallback
    saveToLocalBackup('leads', lead);
    return { success: false, error: 'Supabase não configurado. Dados salvos localmente.' };
  }

  try {
    const { error } = await client
      .from('leads')
      .upsert({
        id: lead.id,
        name: lead.name,
        email: lead.email,
        phone: lead.phone,
        whatsapp: lead.whatsapp || lead.phone,
        service_interested: lead.serviceInterested,
        stage: lead.stage,
        value: lead.value,
        date: lead.date,
        notes: lead.notes || '',
        source: lead.source,
        custom_questions: lead.customQuestions ? JSON.stringify(lead.customQuestions) : '[]',
        attached_files: lead.attachedFiles ? JSON.stringify(lead.attachedFiles) : '[]',
        created_at: new Date().toISOString()
      });

    if (error) {
      console.error('Erro ao enviar lead para o Supabase:', error);
      saveToLocalBackup('leads_pending', lead);
      return { success: false, error: error.message };
    }

    console.log('✅ Lead enviado com sucesso para o Supabase!', lead.id);
    return { success: true };
  } catch (err: any) {
    console.error('Erro de conexão ao Supabase:', err);
    saveToLocalBackup('leads_pending', lead);
    return { success: false, error: err.message || 'Erro de rede ou conexão.' };
  }
}

/**
 * Inserts or updates an appointment (agendamento from portal) in Supabase.
 */
export async function sendAppointmentToSupabase(app: Appointment): Promise<{ success: boolean; error?: string }> {
  const client = getSupabaseClient();

  if (!client) {
    console.warn('⚠️ Supabase não configurado. Salvando agendamento localmente:', app);
    saveToLocalBackup('appointments', app);
    return { success: false, error: 'Supabase não configurado. Dados salvos localmente.' };
  }

  try {
    const { error } = await client
      .from('appointments')
      .upsert({
        id: app.id,
        patient_id: app.patientId,
        patient_name: app.patientName,
        patient_phone: app.patientPhone,
        service_name: app.serviceName,
        date: app.date,
        time: app.time,
        status: app.status,
        type: app.type,
        price: app.price,
        paid: app.paid,
        payment_method: app.paymentMethod || '',
        video_link: app.videoLink || '',
        notes: app.notes || '',
        created_at: new Date().toISOString()
      });

    if (error) {
      console.error('Erro ao enviar agendamento para o Supabase:', error);
      saveToLocalBackup('appointments_pending', app);
      return { success: false, error: error.message };
    }

    console.log('✅ Agendamento enviado com sucesso para o Supabase!', app.id);
    return { success: true };
  } catch (err: any) {
    console.error('Erro de conexão do agendamento ao Supabase:', err);
    saveToLocalBackup('appointments_pending', app);
    return { success: false, error: err.message || 'Erro de rede ou conexão.' };
  }
}

/**
 * Syncs any pending local leads or appointments when the connection becomes active
 */
export async function syncPendingData(): Promise<{ leadsSynced: number; appointmentsSynced: number }> {
  const client = getSupabaseClient();
  if (!client) return { leadsSynced: 0, appointmentsSynced: 0 };

  let leadsSynced = 0;
  let appointmentsSynced = 0;

  // Sync leads
  const pendingLeads = getLocalBackup('leads_pending');
  for (const lead of pendingLeads) {
    const res = await sendLeadToSupabase(lead);
    if (res.success) {
      removeFromLocalBackup('leads_pending', lead.id);
      leadsSynced++;
    }
  }

  // Sync appointments
  const pendingApps = getLocalBackup('appointments_pending');
  for (const app of pendingApps) {
    const res = await sendAppointmentToSupabase(app);
    if (res.success) {
      removeFromLocalBackup('appointments_pending', app.id);
      appointmentsSynced++;
    }
  }

  return { leadsSynced, appointmentsSynced };
}

// Helper local backup functions
function saveToLocalBackup(key: string, data: any) {
  try {
    const existing = getLocalBackup(key);
    // Avoid duplicates by id
    const filtered = existing.filter((item: any) => item.id !== data.id);
    filtered.push(data);
    localStorage.setItem(`supabase_fallback_${key}`, JSON.stringify(filtered));
  } catch (e) {
    console.error('Erro de escrita no localStorage:', e);
  }
}

function getLocalBackup(key: string): any[] {
  try {
    const raw = localStorage.getItem(`supabase_fallback_${key}`);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

function removeFromLocalBackup(key: string, id: string) {
  try {
    const existing = getLocalBackup(key);
    const filtered = existing.filter((item: any) => item.id !== id);
    localStorage.setItem(`supabase_fallback_${key}`, JSON.stringify(filtered));
  } catch (e) {}
}

/**
 * SQL scripts schema representation to help user configure database tables easily.
 */
export const SUPABASE_SQL_SCHEMA = `-- Copie e cole este script SQL no Editor de Consultas (SQL Editor) do seu projeto no Supabase:

-- 1. Criação da tabela de Leads / Pré-Agendamentos
CREATE TABLE IF NOT EXISTS public.leads (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  whatsapp TEXT,
  service_interested TEXT,
  stage TEXT DEFAULT 'novo',
  value NUMERIC DEFAULT 0,
  date DATE,
  notes TEXT,
  source TEXT,
  custom_questions TEXT, -- Armazenado como JSON stringificado ou use o tipo JSONB
  attached_files TEXT,    -- Armazenado como JSON stringificado ou use o tipo JSONB
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Criação da tabela de Agendamentos / Consultas do Portal
CREATE TABLE IF NOT EXISTS public.appointments (
  id TEXT PRIMARY KEY,
  patient_id TEXT,
  patient_name TEXT,
  patient_phone TEXT,
  service_name TEXT,
  date DATE,
  time TEXT,
  status TEXT DEFAULT 'pending',
  type TEXT DEFAULT 'presencial',
  price NUMERIC DEFAULT 0,
  paid BOOLEAN DEFAULT FALSE,
  payment_method TEXT,
  video_link TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Habilitar acesso público de escrita (Row Level Security ou permissão de inserção)
-- Para propósitos de teste simples ou ambiente de desenvolvimento:
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Permitir inserções e atualizações públicas" ON public.leads
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Permitir inserções e atualizações públicas em agendamentos" ON public.appointments
  FOR ALL USING (true) WITH CHECK (true);
`;
