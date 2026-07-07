import { SiteContent } from './types';
// @ts-ignore
import heroImg from './assets/images/regenerated_image_1783059473581.jpg';
// @ts-ignore
import bioImg from './assets/images/regenerated_image_1783061703946.jpg';
// @ts-ignore
import fachadaImg from './assets/images/regenerated_image_1783379379778.jpg';

export const DEFAULT_SITE_CONTENT: SiteContent = {
  // Hero section
  heroBadge: "Excelência & Estética Avançada",
  heroTitle: "Tratamento com excelência para transformar sorrisos e vidas",
  heroSubtitle: "Odontologia humanizada, tecnologia avançada e cuidado personalizado para você sorrir com confiança.",
  heroCta1: "Agendar consulta",
  heroCta2: "Falar no WhatsApp",
  heroMetric1Value: "100%",
  heroMetric1Label: "Satisfação",
  heroMetric2Value: "10+ Anos",
  heroMetric2Label: "De Atuação",
  heroMetric3Value: "Cambuci",
  heroMetric3Label: "S. Paulo, SP",
  heroImageUrl: heroImg,
  heroQuote: '"O sorriso é a expressão mais sincera de quem somos."',
  heroQuoteAuthor: "Referência em Estética",

  // Bio section
  bioBadge: "Nossa Fundadora",
  bioTitle: "Dra. Claudia França",
  bioText1: "A Dra. Cláudia França é reconhecida por sua dedicação, competência e sensibilidade no cuidado com cada paciente. Vinda de uma família de dentistas, carrega no sangue a paixão pela odontologia e a arte de esculpir sorrisos.",
  bioText2: "Ao longo de sua trajetória de excelência, atuou em conceituados hospitais e clínicas cirúrgicas, consolidando ampla experiência clínica tanto na odontologia estética quanto em cirurgias reabilitadoras de alta complexidade. Hoje, atende em sua própria clínica no Cambuci, integrando saúde, estética avançada e tecnologia para oferecer tratamentos personalizados com máximo conforto e naturalidade.",
  bioCardTitle: "Tradição & Amor",
  bioCardText: "Legado familiar de cuidado integral e afeição sincera pela saúde dos pacientes.",
  bioImageUrl: bioImg,
  bioCro: "CRO-SP 143883",

  // Spaces / Estrutura section
  spacesTitle: "Nossa Estrutura",
  spacesSubtitle: "Projetada nos mínimos detalhes para oferecer uma experiência de saúde e estética em um ambiente luxuoso, acolhedor e com total biossegurança.",
  clinicSpaces: [
    {
      id: 'fachada',
      title: 'Fachada Premium',
      description: 'Elegância minimalista em preto fosco, letreiro 3D dourado e iluminação cênica sofisticada.',
      details: 'Uma entrada imponente projetada para refletir o nível de excelência dos tratamentos oferecidos. Com o letreiro em relevo dourado "Dra. Claudia França | Saúde & Estética" sob spots de iluminação quente, o design exterior une sofisticação urbana e o aconchego de uma clínica boutique, convidando você para uma experiência odontológica de padrão elevado.',
      imageUrl: fachadaImg
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
  ],

  // Before/after section
  resultsTitle: "Galeria de Resultados",
  resultsSubtitle: "Transformações reais planejadas sob medida para cada paciente.",
  beforeImageUrl: "https://images.unsplash.com/photo-1516214104703-d870798883c5?auto=format&fit=crop&q=80&w=1000",
  afterImageUrl: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=1000",

  // Contact section
  contactTitle: "Entre em contato",
  contactSubtitle: "Nossa luxuosa clínica está no coração do bairro Cambuci, projetada com instalações modernas e de biossegurança rígida para oferecer todo o aconchego que você e sua família merecem.",
  contactAddress: "Rua Gama Cerqueira, 726, Sala 02, Cambuci, São Paulo/SP, CEP 01539-010",
  contactPhone: "(11) 3271-7271 / (11) 99534-9751",
  contactEmail: "contato@draclaudiafranca.com.br",

  // Brand config fields for live editor
  brandName: "Dra. Claudia França",
  brandSub: "Saúde & Estética",
  brandCro: "CRO-SP 143883",
  brandType: "Clínica Odontológica"
};
