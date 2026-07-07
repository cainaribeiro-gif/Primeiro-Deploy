/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Service, Patient, Lead, Appointment, BlogPost, Review, FinanceRecord, MarketingCampaign } from './types';

export const INITIAL_SERVICES: Service[] = [
  // TRANSFORMAÇÃO DO SORRISO
  {
    id: 'lentes_contato',
    name: 'Lentes de Contato Dental',
    category: 'transformacao_sorriso',
    shortDescription: 'Películas ultrafinas de porcelana importada aplicadas sobre os dentes para corrigir cor e formato com mínimo desgaste.',
    fullDescription: 'As Lentes de Contato Dental representam o ápice da odontologia estética moderna. Tratam-se de lâminas de porcelana ultrafinas (de até 0.3mm de espessura) confeccionadas sob medida em laboratórios digitais de elite. Elas são meticulosamente cimentadas na superfície frontal dos dentes para corrigir pequenas imperfeições de formato, cor, tamanho e posicionamento, proporcionando uma harmonia facial incomparável com máxima preservação da estrutura dentária natural.',
    benefits: [
      'Harmonização absoluta do formato, simetria e cor dos dentes',
      'Preservação máxima da estrutura dentária original (mínimo preparo)',
      'Altíssima durabilidade e estabilidade de cor (não sofrem manchas com alimentos)',
      'Procedimento rápido e previsível, planejado digitalmente',
      'Excelente resistência mecânica, assemelhando-se ao esmalte dental'
    ],
    indications: [
      'Espaçamentos indesejados entre os dentes (diastemas)',
      'Formatos irregulares, dentes conoides ou pequenos demais',
      'Dentes com trincas leves ou desgastados pelo tempo',
      'Escurecimento severo ou manchas resistentes ao clareamento'
    ],
    faqs: [
      {
        question: 'É necessário desgastar muito os dentes para colocar lentes?',
        answer: 'Não. Ao contrário das coroas convencionais, as lentes de contato de porcelana exigem apenas uma leve regularização do esmalte (cerca de 0.2mm a 0.3mm), e em muitos casos nenhum desgaste é necessário, preservando a integridade original.'
      },
      {
        question: 'Qual é a durabilidade das lentes de contato?',
        answer: 'Com bons hábitos de higiene oral e visitas regulares para manutenção preventiva a cada 6 meses, as lentes de porcelana podem durar confortavelmente entre 10 e 15 anos.'
      }
    ],
    priceEstimate: 'Sob Consulta',
    imageUrl: 'https://images.unsplash.com/photo-1606811971618-4486d14f3f99?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'facetas_porcelana',
    name: 'Facetas em Porcelana',
    category: 'transformacao_sorriso',
    shortDescription: 'Restaurações estéticas de porcelana de alta precisão para dentes com maior grau de comprometimento estrutural.',
    fullDescription: 'As facetas em porcelana são revestimentos protéticos refinados indicados para dentes que exigem correções estruturais ou estéticas mais expressivas do que as permitidas pelas lentes de contato. Elas cobrem a parte frontal dos dentes e oferecem um resultado visual extremamente elegante e natural, sendo ideais para corrigir dentes com múltiplas restaurações antigas, desalinhamentos médios ou fraturas.',
    benefits: [
      'Correção de desalinhamentos severos, giroversões e pequenas fraturas',
      'Excelente estabilidade estética e resistência a fraturas a longo prazo',
      'Aparência idêntica ao esmalte dentário natural com alta translucidez',
      'Resolução de manchas profundas causadas por antibióticos (tetraciclina) ou canal'
    ],
    indications: [
      'Dentes muito escurecidos ou manchados',
      'Dentes desgastados por bruxismo severo ou atividade ácida',
      'Correções que necessitem de reestruturação volumétrica média'
    ],
    faqs: [
      {
        question: 'Qual é a diferença entre lente de contato e faceta em porcelana?',
        answer: 'A diferença principal está na espessura da porcelana e no nível de preparo dentário necessário. As lentes são ultrafinas (0.2 a 0.3mm) e requerem mínimo ou nenhum preparo. As facetas são ligeiramente mais espessas (0.5mm ou mais) e são indicadas para dentes com comprometimento de cor ou formato mais acentuado.'
      }
    ],
    priceEstimate: 'Sob Consulta',
    imageUrl: 'https://images.unsplash.com/photo-1579684389782-64d84b5e901a?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'clareamento',
    name: 'Clareamento Dental',
    category: 'transformacao_sorriso',
    shortDescription: 'Técnicas personalizadas de consultório a laser ou moldeiras residenciais sob rigorosa supervisão.',
    fullDescription: 'O Clareamento Dental é um tratamento altamente seguro e cientificamente consolidado para remover pigmentações e devolver o brilho e a cor branca original dos seus dentes. A técnica une o Clareamento de Consultório (com gel de alta concentração ativado de forma segura) e o Clareamento Caseiro (com moldeiras de silicone sob medida feitas em consultório), garantindo dentes visivelmente mais claros com total conforto e proteção gengival.',
    benefits: [
      'Sorriso visivelmente mais iluminado, branco e rejuvenescido',
      'Remoção de pigmentos profundos decorrentes de hábitos alimentares e idade',
      'Procedimento rápido e seguro, sem desgaste ou danos ao esmalte',
      'Resultados perceptíveis logo nas primeiras sessões de uso'
    ],
    indications: [
      'Dentes amarelados pelo envelhecimento natural ou tabagismo',
      'Pigmentação por consumo excessivo de café, vinho, refrigerantes e chás',
      'Pessoas que buscam realçar o sorriso de forma ágil e segura antes de eventos'
    ],
    faqs: [
      {
        question: 'O clareamento dental deixa os dentes sensíveis?',
        answer: 'A sensibilidade é temporária e varia para cada paciente. Na nossa clínica, utilizamos géis clareadores premium com agentes dessensibilizantes integrados e aplicamos laser terapêutico pós-sessão para garantir uma experiência confortável do início ao fim.'
      }
    ],
    priceEstimate: 'R$ 800 - R$ 1.500',
    imageUrl: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'fechamento_diastema',
    name: 'Fechamento de Diastema',
    category: 'transformacao_sorriso',
    shortDescription: 'Correção rápida e indolor do espaçamento excessivo entre os dentes utilizando resinas premium.',
    fullDescription: 'O fechamento de diastema é um procedimento estético delicado focado em fechar espaços vazios entre os dentes (especialmente na região anterior superior). Pode ser realizado de forma rápida e indolor em sessão única utilizando resinas estéticas nanoparticuladas de alta fidelidade cromática, ou com finas lâminas de porcelana, devolvendo a simetria ao sorriso.',
    benefits: [
      'Resultado estético imediato, concluído em apenas uma sessão',
      'Procedimento totalmente indolor e conservador (sem desgaste)',
      'Excelente custo-benefício para harmonização anterior rápida',
      'Melhora a fonética e impede o acúmulo de resíduos alimentares'
    ],
    indications: [
      'Pacientes incomodados com o espaço vago entre os dentes anteriores',
      'Diastemas que interferem na dicção ou estética do sorriso'
    ],
    faqs: [
      {
        question: 'O material de fechamento pode manchar com café ou cigarro?',
        answer: 'As resinas estéticas modernas de padrão ouro possuem excelente resistência a manchas. No entanto, hábitos de alta pigmentação podem diminuir seu brilho ao longo dos anos, sendo indicada manutenção e polimento periódico no consultório.'
      }
    ],
    priceEstimate: 'R$ 400 - R$ 900 por elemento',
    imageUrl: 'https://images.unsplash.com/photo-1512223792601-592a9809eed4?auto=format&fit=crop&q=80&w=800'
  },

  // IMPLANTES DENTÁRIOS
  {
    id: 'implante_unitario',
    name: 'Implante Unitário',
    category: 'implantes_dentarios',
    shortDescription: 'Substituição cirúrgica definitiva de um dente ausente com pino de titânio de alta pureza e coroa estética.',
    fullDescription: 'O Implante Unitário é o tratamento ideal e definitivo para repor a ausência de um único elemento dentário sem comprometer os dentes vizinhos. Um parafuso de titânio de alta pureza (biocompatível) é instalado no osso para fazer o papel da raiz. Após o período de integração óssea (ou de forma imediata em casos específicos), uma coroa de porcelana personalizada é fixada sobre ele, imitando perfeitamente o dente natural.',
    benefits: [
      'Preserva os dentes vizinhos totalmente saudáveis (sem necessidade de desgaste para pontes)',
      'Evita a perda de osso (reabsorção alveolar) decorrente da ausência dentária',
      'Restabelece 100% da eficiência mastigatória e clareza fonética',
      'Conforto absoluto e estabilidade idêntica à raiz natural'
    ],
    indications: [
      'Perda de um único dente por cárie avançada, fratura de raiz ou trauma',
      'Ausência congênita de dentes permanentes'
    ],
    faqs: [
      {
        question: 'Dói fazer cirurgia de implante?',
        answer: 'De forma alguma. O procedimento é realizado sob anestesia local de alta eficácia, sendo totalmente indolor durante o ato cirúrgico. A recuperação pós-operatória na clínica da Dra. Claudia é extremamente confortável graças à prescrição de analgésicos adequados e às técnicas cirúrgicas minimamente invasivas.'
      }
    ],
    priceEstimate: 'Sob Consulta',
    imageUrl: 'https://images.unsplash.com/photo-1629909615184-74f495363b67?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'multiplos_implantes',
    name: 'Múltiplos Implantes',
    category: 'implantes_dentarios',
    shortDescription: 'Reabilitação de áreas com perda de vários dentes consecutivos, devolvendo a força da mordida.',
    fullDescription: 'Para pacientes que perderam múltiplos dentes adjacentes, a implantodontia moderna oferece reabilitações altamente eficientes e seguras. Em vez de instalar um pino cirúrgico para cada dente perdido, podemos colocar uma quantidade estrategicamente calculada de implantes de titânio de suporte para sustentar pontes fixas de dentes conjugados, reduzindo o tempo cirúrgico e otimizando os custos.',
    benefits: [
      'Recuperação rápida da função mastigatória de múltiplos dentes',
      'Distribuição ideal de forças mastigatórias sobre a estrutura óssea',
      'Redução do número total de procedimentos e cirurgias invasivas',
      'Próteses fixas estáveis que não machucam ou se movimentam'
    ],
    indications: [
      'Ausência de três ou mais dentes consecutivos na arcada',
      'Instabilidade ou insatisfação com próteses parciais removíveis (roach)'
    ],
    faqs: [
      {
        question: 'Preciso de um implante para cada dente perdido?',
        answer: 'Não. Pontes sobre implantes são desenhadas para repor, por exemplo, 3 dentes fixados com segurança extrema sobre apenas 2 pinos de implante, garantindo uma abordagem mais conservadora e confortável.'
      }
    ],
    priceEstimate: 'Sob Consulta',
    imageUrl: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'protese_protocolo',
    name: 'Prótese Protocolo',
    category: 'implantes_dentarios',
    shortDescription: 'Prótese dentária completa e fixa aparafusada sobre 4 a 6 implantes, eliminando o uso de dentaduras.',
    fullDescription: 'A Prótese Protocolo é a solução padrão-ouro para reabilitação total de pacientes que perderam todos os dentes de uma arcada. Ela consiste em uma prótese completa e fixa de alta resistência, aparafusada permanentemente sobre 4 a 6 implantes de titânio estrategicamente inseridos. Com a prótese fixa, elimina-se o uso de dentaduras móveis instáveis, resgatando a autoestima e a segurança mastigatória absoluta.',
    benefits: [
      'Estabilidade completa – não se solta, não desliza e não requer adesivos',
      'Palato (céu da boca) totalmente livre, resgatando 100% do sabor dos alimentos',
      'Aparência estética impecável, rejuvenescendo o contorno facial e labial',
      'Restabelecimento completo da mastigação de qualquer tipo de alimento'
    ],
    indications: [
      'Pacientes desdentados totais na arcada superior ou inferior',
      'Portadores de dentaduras antigas machucadas ou instáveis',
      'Pacientes com poucos dentes remanescentes severamente comprometidos'
    ],
    faqs: [
      {
        question: 'Como higienizar uma prótese protocolo fixa?',
        answer: 'A higienização é feita com escovação diária normal associada ao uso de fios dentais especiais com pontas rígidas (passadores de fio), escovas interdentais ou jatos d’água sob pressão (como o Waterpik). Além disso, o paciente deve retornar à clínica anualmente para uma manutenção de rotina.'
      }
    ],
    priceEstimate: 'Sob Consulta',
    imageUrl: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&q=80&w=800'
  },

  // REABILITAÇÃO ORAL
  {
    id: 'coroas',
    name: 'Coroas de Porcelana / Zircônia',
    category: 'reabilitacao_oral',
    shortDescription: 'Capas protéticas personalizadas de alta resistência para proteger dentes severamente destruídos.',
    fullDescription: 'As coroas protéticas unitárias são "capas" de porcelana pura ou zircônia translúcida moldadas sob medida por escaneamento digital para recobrir e proteger dentes que sofreram grande perda de estrutura dentária devido a cáries profundas, tratamento de canal ou fraturas severas, restabelecendo a forma anatômica e força sem extrair a raiz.',
    benefits: [
      'Restauração total da anatomia, força e cor do dente original',
      'Proteção contra fraturas futuras em dentes com tratamento de canal',
      'Material livre de metal (metal-free), oferecendo altíssima estética e translucidez',
      'Ajuste oclusal perfeito por escaneamento 3D'
    ],
    indications: [
      'Dentes tratados de canal com grande perda estrutural',
      'Restaurações de resina muito extensas com infiltração recorrente',
      'Fraturas dentárias graves'
    ],
    faqs: [
      {
        question: 'É preciso remover todo o dente para colocar coroa?',
        answer: 'Não. A raiz natural do dente é mantida totalmente intacta e tratada. O dente é apenas preparado (reduzido nas bordas) de forma conservadora para que a capa de porcelana se encaixe perfeitamente sobre ele.'
      }
    ],
    priceEstimate: 'Sob Consulta',
    imageUrl: 'https://images.unsplash.com/photo-1598256989800-fe5f95da9787?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'proteses',
    name: 'Próteses Dentárias',
    category: 'reabilitacao_oral',
    shortDescription: 'Soluções protéticas removíveis ou fixas desenhadas digitalmente para restabelecer dentes perdidos.',
    fullDescription: 'Dispositivos protéticos removíveis (parciais ou totais) confeccionados com materiais acrílicos ou flexíveis de altíssima qualidade. São planejadas digitalmente para se ajustarem à gengiva com total estabilidade e naturalidade, devolvendo o conforto mastigatório e a alegria de sorrir de forma acessível e segura.',
    benefits: [
      'Preenchimento de lacunas e espaçamentos dentários de forma rápida',
      'Melhora expressiva na mastigação e digestão correta dos alimentos',
      'Recuperação do volume labial e bochechas, rejuvenescendo a face',
      'Soluções parciais flexíveis sem grampos metálicos aparentes'
    ],
    indications: [
      'Perdas parciais ou totais de dentes em pacientes que buscam reabilitações não cirúrgicas',
      'Substituição de próteses desajustadas antigas'
    ],
    faqs: [
      {
        question: 'As próteses removíveis machucam a boca?',
        answer: 'Próteses modernas planejadas com moldagem digital possuem excelente adaptação e conforto. Ajustes periódicos em consultório garantem que elas fiquem assentadas na gengiva sem atritos desconfortáveis.'
      }
    ],
    priceEstimate: 'Sob Consulta',
    imageUrl: 'https://images.unsplash.com/photo-1512223792601-592a9809eed4?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'recuperacao_funcional',
    name: 'Recuperação Funcional Oclusal',
    category: 'reabilitacao_oral',
    shortDescription: 'Ajuste da oclusão e mordida para cessar dores faciais na ATM e eliminar desgastes acelerados.',
    fullDescription: 'A Recuperação Funcional foca no restabelecimento do equilíbrio oclusal (o encaixe correto entre os dentes superiores e inferiores ao morder). Desajustes na mordida exercem pressões anômalas, provocando dores na articulação temporomandibular (ATM), dores de cabeça tensionais, quebras frequentes de restaurações e desgaste acelerado dos dentes.',
    benefits: [
      'Alívio expressivo de dores de cabeça tensionais e dores no maxilar',
      'Eliminação de desgastes, trincas e quebras de elementos dentários',
      'Mastigação correta com distribuição uniforme de forças',
      'Prevenção de estalos ou travamento da mandíbula'
    ],
    indications: [
      'Pacientes com bruxismo, apertamento ou dores articulares na face',
      'Desgastes dentários generalizados e mordida desalinhada'
    ],
    faqs: [
      {
        question: 'Como funciona o tratamento de ajuste funcional?',
        answer: 'O tratamento pode incluir desgastes seletivos em pontos de sobrecarga, acréscimos sutis com resinas estéticas para devolver guias de mordida, e a confecção de placas miorrelaxantes rígidas em acrílico de alta precisão para dormir.'
      }
    ],
    priceEstimate: 'Sob Consulta',
    imageUrl: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'reabilitacao_estetica_completa',
    name: 'Reabilitação Estética Completa',
    category: 'reabilitacao_oral',
    shortDescription: 'Abordagem multidisciplinar global para reconstruir dentes e tecidos, fundindo estética e função.',
    fullDescription: 'A Reabilitação Estética Completa é o tratamento definitivo e integrador para pacientes que apresentam múltiplos dentes desgastados, perdas de suporte labial e defasagem de mastigação. Consiste em planejar a boca de forma global, integrando de maneira sinérgica implantes, coroas, lentes de contato de porcelana e harmonização facial para rejuvenescer o sorriso e devolver a plenitude mastigatória.',
    benefits: [
      'Transformação total do sorriso com rejuvenescimento facial imediato',
      'Restauração de 100% do conforto mastigatório e articulação estabilizada',
      'Tratamento completo guiado por ferramentas digitais de altíssima previsibilidade',
      'Melhora drástica na autoestima e bem-estar geral'
    ],
    indications: [
      'Pacientes com desgaste severo generalizado (bruxismo avançado)',
      'Quadros com múltiplas perdas dentárias associadas a inclinações de dentes',
      'Histórico de tratamentos fragmentados e quebras frequentes'
    ],
    faqs: [
      {
        question: 'É um tratamento muito demorado?',
        answer: 'Por envolver múltiplas etapas, o tratamento é executado em fases planejadas. No entanto, graças ao planejamento digital computadorizado e às tecnologias modernas da nossa clínica, as etapas clínicas são integradas e agilizadas com conforto absoluto.'
      }
    ],
    priceEstimate: 'Sob Consulta',
    imageUrl: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&q=80&w=800'
  },

  // SAÚDE BUCAL
  {
    id: 'limpeza',
    name: 'Limpeza Avançada (Profilaxia)',
    category: 'saude_bucal',
    shortDescription: 'Prevenção de doenças gengivais através da remoção minuciosa de tártaro e manchas com ultrassom.',
    fullDescription: 'A profilaxia odontológica é a limpeza profissional preventiva realizada em consultório. Através de aparelhos modernos de ultrassom de vibração suave (que soltam o tártaro sem machucar) e jatos delicados de bicarbonato sob pressão, removemos resíduos minerais e biofilmes bacterianos que a escovação diária não alcança, purificando a boca e blindando as gengivas contra inflamações.',
    benefits: [
      'Prevenção ativa de cáries, gengivite, periodontite e mau hálito',
      'Remoção de tártaros profundos e placas bacterianas calcificadas',
      'Eliminação de manchas superficiais causadas por fumo, café ou vinho',
      'Sensação de frescor extremo e dentes polidos'
    ],
    indications: [
      'Todos os pacientes como consulta preventiva semestral essencial de rotina'
    ],
    faqs: [
      {
        question: 'Qual a frequência ideal para realizar a limpeza clínica?',
        answer: 'Para a maioria das pessoas, a profilaxia clínica deve ser realizada a cada 6 meses. Pacientes com histórico de problemas periodontais (gengiva) podem necessitar de visitas a cada 3 ou 4 meses.'
      }
    ],
    priceEstimate: 'R$ 250 - R$ 400',
    imageUrl: 'https://images.unsplash.com/photo-1606811971618-4486d14f3f99?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'restauracoes',
    name: 'Restaurações Estéticas',
    category: 'saude_bucal',
    shortDescription: 'Remoção de cáries e reparo de dentes lascados com resinas estéticas de alta durabilidade.',
    fullDescription: 'As restaurações diretas utilizam resinas nanoparticuladas de alta tecnologia que se fundem perfeitamente à cor natural dos dentes. São indicadas para remover tecidos cariados e preencher lacunas de forma segura e indolor, restabelecendo a barreira protetora contra infiltrações e devolvendo a beleza natural do sorriso, sem uso de amálgamas de metal escuro.',
    benefits: [
      'Estética invisível – a resina mimetiza a cor e o brilho dos dentes',
      'Altíssima resistência mecânica ao desgaste diário',
      'Procedimento rápido e indolor realizado em sessão única',
      'Proteção e isolamento térmico do dente'
    ],
    indications: [
      'Cáries ativas, infiltrações sob restaurações antigas, quebras parciais'
    ],
    faqs: [
      {
        question: 'As restaurações são feitas com metal escuro?',
        answer: 'Não. Nossa clínica preza pela odontologia moderna livre de metais. Utilizamos exclusivamente resinas de alta performance estética que reproduzem a coloração exata do dente, garantindo discrição absoluta.'
      }
    ],
    priceEstimate: 'R$ 200 - R$ 450',
    imageUrl: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'avaliacao_preventiva',
    name: 'Avaliação Preventiva e Check-up Digital',
    category: 'saude_bucal',
    shortDescription: 'Análise minuciosa auxiliada por câmera intraoral 3D para antecipar e diagnosticar cáries iniciais.',
    fullDescription: 'A avaliação preventiva é uma consulta minuciosa de rotina apoiada por câmeras digitais de alta definição. O check-up digital captura imagens dos dentes ampliadas em até 60 vezes, permitindo que a Dra. Claudia detecte infiltrações ocultas, pequenas trincas ou cáries em estágio microscópico antes que causem dor de dente ou exijam tratamentos complexos de canal.',
    benefits: [
      'Diagnóstico precoce, evitando a evolução para tratamentos de canal',
      'Procedimento rápido, confortável e preventivo',
      'Planejamento de saúde focado na preservação de dentes íntegros',
      'Excelente economia de tempo e financeira a longo prazo'
    ],
    indications: [
      'Exame de rotina anual recomendado para manter a boca saudável sem sobressaltos'
    ],
    faqs: [
      {
        question: 'O que é a câmera intraoral?',
        answer: 'É um scanner óptico que projeta na tela da sala a imagem ampliada dos dentes em alta resolução. O paciente acompanha em tempo real o diagnóstico da Dra. Claudia, com total transparência.'
      }
    ],
    priceEstimate: 'R$ 150 - R$ 300',
    imageUrl: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'manutencao',
    name: 'Consulta de Manutenção Clínica',
    category: 'saude_bucal',
    shortDescription: 'Acompanhamento pós-tratamento para manter implantes e lentes de porcelana impecáveis.',
    fullDescription: 'A Consulta de Manutenção é o pilar de longevidade dos tratamentos estéticos e cirúrgicos. Indicada para monitorar o assentamento e brilho das lentes de contato, reajustar a oclusão de coroas, e manter a saúde periodontal ao redor dos implantes, prevenindo perimplantite, assegurando que seu sorriso permaneça perfeito.',
    benefits: [
      'Garante a máxima durabilidade das porcelanas e pinos de implante',
      'Ajustes milimétricos imediatos na mastigação, evitando quebras por impacto',
      'Prevenção de inflamações bacterianas invisíveis sob próteses fixas',
      'Total paz de espírito para o paciente'
    ],
    indications: [
      'Pacientes reabilitados com lentes, próteses fixas, implantes ou placas de ATM'
    ],
    faqs: [
      {
        question: 'Por que preciso de manutenção se meu implante já está cicatrizado?',
        answer: 'Os pinos e coroas artificiais sofrem pressões constantes da mastigação e, embora não tenham cárie, os tecidos de gengiva e osso ao redor deles precisam estar livres de bactérias para evitar perdas futuras. A manutenção periódica preserva essa estrutura.'
      }
    ],
    priceEstimate: 'R$ 200 - R$ 350',
    imageUrl: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&q=80&w=800'
  },

  // TRATAMENTOS PERSONALIZADOS
  {
    id: 'planejamento_digital',
    name: 'Planejamento Digital do Sorriso',
    category: 'tratamentos_personalizados',
    shortDescription: 'Projeção 3D computadorizada baseada nas proporções faciais para visualizar o resultado antes de iniciar.',
    fullDescription: 'O Planejamento Digital do Sorriso (DSD - Digital Smile Design) é uma tecnologia revolucionária de personalização. Através de fotos profissionais da face, escaneamento intraoral e softwares gráficos, a Dra. Claudia projeta matematicamente as proporções e formatos de dentes mais adequados às suas características faciais, permitindo pré-visualizar o novo sorriso na tela antes do início.',
    benefits: [
      'Previsibilidade cirúrgica e protética absoluta de 100%',
      'Participação ativa do paciente na escolha de formatos e cores do sorriso',
      'Simulação tridimensional real que elimina medos de resultados artificiais',
      'Mock-up clínico prévio: teste os dentes de resina em boca antes de fazer'
    ],
    indications: [
      'Pacientes interessados em lentes de contato de porcelana ou facetas',
      'Planejamentos integrados de alta estética bucal e harmonização'
    ],
    faqs: [
      {
        question: 'Consigo ver os dentes na minha boca antes do procedimento definitivo?',
        answer: 'Sim! Com a técnica do "Mock-Up" ou teste físico, aplicamos uma resina provisória sobre seus dentes baseada no planejamento digital. Você poderá sorrir, falar e tirar fotos no espelho para aprovar as proporções antes de darmos início.'
      }
    ],
    priceEstimate: 'Sob Consulta',
    imageUrl: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'casos_complexos',
    name: 'Coordenação de Casos Complexos',
    category: 'tratamentos_personalizados',
    shortDescription: 'Planejamento multidisciplinar integrado para tratar perdas ósseas severas ou colapsos de mordida.',
    fullDescription: 'Para pacientes que apresentam comprometimento profundo de múltiplos dentes, perdas de suporte ósseo alveolar graves ou desgaste avançado generalizado, oferecemos a coordenação de casos complexos. Este protocolo unifica cirurgias guiadas virtuais, enxertos ósseos nobres, reabilitação oral e suporte estético de forma integrada, coordenada de ponta a ponta pela Dra. Claudia França.',
    benefits: [
      'Abordagem sistêmica interdisciplinar, tratando as causas do problema e não só sintomas',
      'Estudos em softwares 3D e cirurgias guiadas virtuais que geram precisão extrema',
      'Acolhimento humanizado para pacientes traumatizados por tratamentos anteriores',
      'Equipe dedicada e consultório privativo'
    ],
    indications: [
      'Desgastes severos generalizados por bruxismo agressivo e perdas ósseas',
      'Pacientes que necessitam repor dentes na boca inteira de forma simultânea'
    ],
    faqs: [
      {
        question: 'Mesmo com pouco osso ou dentes muito destruídos é possível recuperar o sorriso?',
        answer: 'Sim. A implantodontia e a periodontia avançadas contam hoje com enxertos ósseos biomateriais de excelente regeneração e guias protéticos digitais que viabilizam reabilitar o sorriso de forma firme, estável e bonita, com segurança clínica total.'
      }
    ],
    priceEstimate: 'Sob Consulta',
    imageUrl: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'acompanhamento_individual',
    name: 'Acompanhamento Individual Exclusivo',
    category: 'tratamentos_personalizados',
    shortDescription: 'Assistência prioritária direta e canal exclusivo pós-operatório com a Dra. Claudia França.',
    fullDescription: 'Nosso protocolo de atendimento vai muito além do consultório. Cada paciente da clínica boutique desfruta de um canal de atendimento direto de pós-operatório prioritário com a Dra. Claudia França, agendamentos flexíveis com espaçamentos ampliados para evitar sala de espera e cuidados individualizados de concierge clínico em todas as etapas de sua reabilitação.',
    benefits: [
      'Comunicação direta e prioritária pós-procedimento para esclarecer dúvidas',
      'Total privacidade e discrição – sala clínica reservada inteiramente para você',
      'Concierge clínico para agendamentos e acompanhamento pós-operatório imediato'
    ],
    indications: [
      'Pacientes que exigem máxima discrição, conforto e atendimento sob demanda focado no bem-estar'
    ],
    faqs: [
      {
        question: 'Como funciona o suporte direto com a Dra. Claudia?',
        answer: 'Os pacientes em pós-operatório recebem um canal direto de contato com a Dra. Claudia França para suporte em tempo real nas primeiras 48 horas após qualquer procedimento cirúrgico, garantindo total amparo e tranquilidade.'
      }
    ],
    priceEstimate: 'Incluso nos Tratamentos Premium',
    imageUrl: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&q=80&w=800'
  }
];

export const INITIAL_PATIENTS: Patient[] = [
  {
    id: 'pat-1',
    name: 'Amanda Silva Menezes',
    email: 'amanda.menezes@gmail.com',
    phone: '(11) 98765-4321',
    birthDate: '1992-04-15',
    leadSource: 'Instagram',
    status: 'Em Tratamento',
    history: [
      { date: '2026-05-10', description: 'Consulta inicial de avaliação e escaneamento 3D para alinhadores.', doctor: 'Dra. Claudia França' },
      { date: '2026-05-24', description: 'Instalação do Invisalign e entrega dos primeiros 4 alinhadores.', doctor: 'Dra. Claudia França' },
      { date: '2026-06-25', description: 'Retorno para acompanhamento e refinamento estético.', doctor: 'Dra. Claudia França' }
    ],
    documents: [
      { id: 'doc-1', name: 'Escaneamento_Arcada_3D.pdf', date: '2026-05-10', size: '4.2 MB', type: 'exame' },
      { id: 'doc-2', name: 'Contrato_Invisalign_Assinado.pdf', date: '2026-05-12', size: '1.8 MB', type: 'consentimento' }
    ],
    observations: 'Paciente relata excelente adaptação ao uso do alinhador Invisalign. Foco no alinhamento do dente 12 e 21. Ótima higiene bucal.',
    createdDate: '2026-05-10'
  },
  {
    id: 'pat-2',
    name: 'Rodrigo Augusto Castro',
    email: 'rodrigo.castro@outlook.com',
    phone: '(11) 99122-3344',
    birthDate: '1984-11-02',
    leadSource: 'Google Search',
    status: 'Ativo',
    history: [
      { date: '2026-06-01', description: 'Aplicação de Toxina Botulínica (Botox) terapêutico para bruxismo e cefaleia.', doctor: 'Dra. Claudia França' },
      { date: '2026-06-15', description: 'Retorno pós-botox de 15 dias. Paciente relata melhora de 90% na dor tensional.', doctor: 'Dra. Claudia França' }
    ],
    documents: [
      { id: 'doc-3', name: 'Ficha_Anamnese_Clinica.pdf', date: '2026-06-01', size: '850 KB', type: 'consentimento' }
    ],
    observations: 'Forte apertamento dentário noturno. Aplicado 50U de Botox nos masseteres e temporais bilaterais.',
    createdDate: '2026-06-01'
  },
  {
    id: 'pat-3',
    name: 'Beatriz Vasconcellos Prado',
    email: 'beatriz.prado@uol.com.br',
    phone: '(11) 97531-8642',
    birthDate: '1975-08-20',
    leadSource: 'Indicação',
    status: 'Finalizado',
    history: [
      { date: '2026-03-10', description: 'Extração do dente 36 e enxerto ósseo liofilizado.', doctor: 'Dra. Claudia França' },
      { date: '2026-05-20', description: 'Instalação de implante unitário cone morse Neodent.', doctor: 'Dra. Claudia França' },
      { date: '2026-06-20', description: 'Instalação da coroa provisória sobre o implante.', doctor: 'Dra. Claudia França' }
    ],
    documents: [
      { id: 'doc-4', name: 'Tomografia_Mandibular_Pre.pdf', date: '2026-03-05', size: '12.5 MB', type: 'exame' },
      { id: 'doc-5', name: 'RaioX_Controle_Pos_Implante.pdf', date: '2026-05-21', size: '1.4 MB', type: 'raio-x' }
    ],
    observations: 'Osseointegração do dente 36 excelente. Gengiva bem cicatrizada com ótimo contorno para futura coroa de porcelana.',
    createdDate: '2026-03-10'
  }
];

export const INITIAL_LEADS: Lead[] = [
  {
    id: 'lead-1',
    name: 'Juliana Costa Ferreira',
    email: 'juliana.costa@gmail.com',
    phone: '(11) 99345-1234',
    serviceInterested: 'Invisalign',
    stage: 'novo',
    value: 8500,
    date: '2026-07-02',
    notes: 'Entrou em contato pelo botão do Instagram querendo saber preço do Invisalign.',
    source: 'Instagram'
  },
  {
    id: 'lead-2',
    name: 'Carlos Henrique Lima',
    email: 'carlos.lima@hotmail.com',
    phone: '(11) 97722-1100',
    serviceInterested: 'Implantes Unitários',
    stage: 'contato',
    value: 3500,
    date: '2026-07-01',
    notes: 'Enviou WhatsApp. Perdeu dente molar recentemente e quer agendar avaliação.',
    source: 'Google Ads'
  },
  {
    id: 'lead-3',
    name: 'Mariana de Souza Dias',
    email: 'mariana.dias@uol.com',
    phone: '(11) 98111-5544',
    serviceInterested: 'Toxina Botulínica (Botox)',
    stage: 'agendado',
    value: 1400,
    date: '2026-06-29',
    notes: 'Agendou consulta presencial para o dia 06/07 às 10h00.',
    source: 'Google Search'
  },
  {
    id: 'lead-4',
    name: 'Renato Albuquerque',
    email: 'renato.albu@gmail.com',
    phone: '(11) 96521-3901',
    serviceInterested: 'Ácido Hialurônico (Preenchimento)',
    stage: 'compareceu',
    value: 2800,
    date: '2026-06-28',
    notes: 'Compareceu na avaliação. Dra. sugeriu preenchimento labial e malar. Aguardando decisão do cônjuge.',
    source: 'Indicação'
  },
  {
    id: 'lead-5',
    name: 'Fernanda Silveira Rocha',
    email: 'fernanda.rocha@gmail.com',
    phone: '(11) 99888-7711',
    serviceInterested: 'Skinbooster',
    stage: 'orcamento',
    value: 2400,
    date: '2026-06-26',
    notes: 'Orçamento entregue para protocolo de 3 sessões de Skinbooster.',
    source: 'Instagram'
  },
  {
    id: 'lead-6',
    name: 'Gustavo Santos Pires',
    email: 'gustavo.pires@outlook.com',
    phone: '(11) 97111-0022',
    serviceInterested: 'Implantes com Carga Imediata',
    stage: 'iniciado',
    value: 12000,
    date: '2026-06-20',
    notes: 'Aprovou reabilitação estética anterior. Cirurgia agendada.',
    source: 'Google Ads'
  }
];

export const INITIAL_APPOINTMENTS: Appointment[] = [
  {
    id: 'app-1',
    patientId: 'pat-1',
    patientName: 'Amanda Silva Menezes',
    patientPhone: '(11) 98765-4321',
    serviceName: 'Invisalign (Alinhadores Invisíveis)',
    date: '2026-07-04',
    time: '14:30',
    status: 'approved',
    type: 'presencial',
    price: 350,
    paid: true,
    paymentMethod: 'pix'
  },
  {
    id: 'app-2',
    patientId: 'pat-2',
    patientName: 'Rodrigo Augusto Castro',
    patientPhone: '(11) 99122-3344',
    serviceName: 'Toxina Botulínica (Botox)',
    date: '2026-07-06',
    time: '09:00',
    status: 'approved',
    type: 'presencial',
    price: 1500,
    paid: false
  },
  {
    id: 'app-3',
    patientId: 'new-lead-mock',
    patientName: 'Carlos Henrique Lima',
    patientPhone: '(11) 97722-1100',
    serviceName: 'Avaliação Estética Gratuita',
    date: '2026-07-06',
    time: '11:00',
    status: 'pending',
    type: 'presencial',
    price: 0,
    paid: false
  },
  {
    id: 'app-4',
    patientId: 'tele-mock',
    patientName: 'Patrícia Gouveia Lins',
    patientPhone: '(11) 98231-1049',
    serviceName: 'Consulta Online - Pré-avaliação Harmonização',
    date: '2026-07-07',
    time: '16:00',
    status: 'approved',
    type: 'teleconsulta',
    price: 250,
    paid: true,
    paymentMethod: 'cartao',
    videoLink: 'https://meet.google.com/abc-defg-hij',
    notes: 'Consulta remota paga para pré-planejamento de Botox e Ácido Hialurônico.'
  }
];

export const INITIAL_BLOG_POSTS: BlogPost[] = [
  {
    id: 'blog-1',
    title: 'Invisalign: Como funciona o alinhador que revolucionou a ortodontia',
    excerpt: 'Esqueça os fios e braquetes metálicos. Conheça as principais vantagens, tempo de tratamento e conforto dos alinhadores invisíveis mais famosos do mundo.',
    content: 'O tratamento ortodôntico convencional com aparelhos metálicos sempre foi associado a desconforto, aftas, restrições alimentares e prejuízo estético temporário no sorriso. No entanto, a ortodontia digital revolucionou essa realidade com o surgimento do Invisalign.\n\n### O que é o Invisalign?\nO Invisalign é um sistema de alinhamento dentário que utiliza uma sequência de moldeiras de plástico transparente, chamadas de alinhadores. Cada alinhador é confeccionado sob medida e movimenta os dentes de forma sutil, guiado por um planejamento tridimensional computadorizado.\n\n### Principais vantagens:\n1. **Estética Absoluta:** Por ser transparente, quase ninguém percebe que você está de aparelho.\n2. **Conforto:** Não possui metais ou fios que machucam ou arranham os tecidos da bochecha e gengiva.\n3. **Higiene Perfeita:** Os alinhadores são removíveis, o que permite escovar os dentes e passar fio dental de maneira normal, evitando o acúmulo de placa bacteriana típico de aparelhos fixos.\n4. **Sem Restrições Alimentares:** Você retira o alinhador para comer e beber o que quiser.\n\n### Como é feito o planejamento?\nA Dra. Claudia França realiza um escaneamento intraoral em 3D da sua arcada. A partir desse modelo digital, um software exclusivo simula toda a movimentação dentária e calcula exatamente o número necessário de alinhadores, estimando a data exata de conclusão do tratamento antes mesmo de começar!',
    category: 'Ortodontia Digital',
    date: '2026-06-28',
    readTime: '4 min de leitura',
    imageUrl: 'https://images.unsplash.com/photo-1598256989800-fe5f95da9787?auto=format&fit=crop&q=80&w=800',
    author: 'Dra. Claudia França',
    slug: 'como-funciona-invisalign',
    tags: ['Invisalign', 'Aparelho Invisível', 'Tecnologia', 'Estética']
  },
  {
    id: 'blog-2',
    title: 'Bruxismo e Cefaleia: O papel terapêutico do Botox na Odontologia',
    excerpt: 'Dores de cabeça constantes e desgaste nos dentes podem ser sintomas de bruxismo. Descubra como a toxina botulínica atua no relaxamento muscular.',
    content: 'Muitas pessoas sofrem diariamente com dores de cabeça tensionais persistentes, dor na articulação temporomandibular (ATM) e acordam com sensação de cansaço facial extremo. Esses sintomas frequentemente indicam o bruxismo, que é o hábito involuntário de ranger ou apertar os dentes, principalmente durante o sono.\n\n### Como a Toxina Botulínica atua no tratamento?\nA toxina botulínica, popularmente conhecida como Botox, atua diretamente nos músculos da mastigação – o masseter e o temporal. Quando aplicada estrategicamente nestas regiões, a substância bloqueia parcialmente os estímulos nervosos que geram a contração muscular involuntária excessiva.\n\n### Benefícios clínicos imediatos:\n- **Relaxamento Muscular:** Reduz a força de apertamento do maxilar sem interferir na mastigação habitual ou na fala do paciente.\n- **Alívio da Cefaleia:** Diminui drasticamente a frequência e a intensidade das dores de cabeça tensionais associadas ao bruxismo.\n- **Proteção dos Dentes:** Evita o desgaste prematuro do esmalte dentário, fraturas de dentes e falhas em restaurações ou implantes devido à sobrecarga de força.\n- **Melhora da Qualidade do Sono:** O paciente alcança um descanso mais profundo e livre de dores faciais ao amanhecer.',
    category: 'Saúde Bucal',
    date: '2026-06-20',
    readTime: '5 min de leitura',
    imageUrl: 'https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?auto=format&fit=crop&q=80&w=800',
    author: 'Dra. Claudia França',
    slug: 'botox-terapeutico-odontologia',
    tags: ['Botox', 'Bruxismo', 'Dores de Cabeça', 'Saúde']
  },
  {
    id: 'blog-3',
    title: 'Implantes Dentários de Carga Imediata: É possível ter dentes fixos em 3 dias?',
    excerpt: 'Esclareça todas as dúvidas sobre a reabilitação oral rápida que devolve a mastigação e o sorriso com segurança em pouquíssimo tempo.',
    content: 'A perda de um ou mais dentes, especialmente na região frontal do sorriso, afeta diretamente a autoestima, a fala, o convívio social e a mastigação correta. Historicamente, os implantes convencionais exigiam meses de espera sem dente antes da instalação da prótese. Felizmente, hoje contamos com a técnica de Carga Imediata.\n\n### O que é a Carga Imediata?\nÉ o procedimento pelo qual instalamos a coroa protética provisória fixa sobre o implante em até 72 horas após a inserção do pino de titânio no osso. Dessa forma, o paciente reconstrói o sorriso e a mastigação no mesmo período cirúrgico.\n\n### Como funciona?\nPara que o dente provisório possa ser instalado de imediato, o pino de titânio precisa alcançar uma estabilidade excepcional no osso na hora da cirurgia. Essa firmeza primária depende da qualidade e quantidade de tecido ósseo disponível.\n\nPor isso, antes de realizar o procedimento, realizamos uma avaliação virtual em 3D meticulosa através de tomografias computadorizadas de alta definição, mapeando as dimensões exatas de osso disponíveis e garantindo um procedimento rápido e sem riscos para o paciente.',
    category: 'Implantes Dentários',
    date: '2026-06-15',
    readTime: '4 min de leitura',
    imageUrl: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&q=80&w=800',
    author: 'Dra. Claudia França',
    slug: 'carga-imediata-implantes',
    tags: ['Implantes', 'Carga Imediata', 'Reabilitação Oral', 'Estética']
  }
];

export const INITIAL_REVIEWS: Review[] = [
  {
    id: 'rev-1',
    author: 'Karina de Oliveira Santos',
    rating: 5,
    text: 'A Dra. Claudia França é uma profissional ímpar! Extremamente atenciosa, delicada e competente. Realizei meu tratamento com o Invisalign na clínica e fiquei maravilhada com o resultado. O atendimento é humanizado do início ao fim, a clínica é impecável, super premium e aconchegante. Recomendo muito!',
    date: 'Há uma semana',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150',
    treatment: 'Invisalign'
  },
  {
    id: 'rev-2',
    author: 'Marcos André Figueiredo',
    rating: 5,
    text: 'Fiz a colocação de um implante de carga imediata com a Dra. Claudia e foi surpreendente. Não senti dor alguma nem durante o procedimento e nem no pós-operatório. O dente provisório ficou perfeito e saí da clínica sorrindo. Ela transmite muita segurança e domina a técnica. Sem palavras para agradecer!',
    date: 'Há 3 semanas',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
    treatment: 'Implante Carga Imediata'
  },
  {
    id: 'rev-3',
    author: 'Gisele Mendonça Alencar',
    rating: 5,
    text: 'Fiz aplicação de Botox para enxaqueca e bruxismo, e também preenchimento labial com ácido hialurônico. Fiquei impressionada com o olhar estético da Dra. Claudia, que preza pela naturalidade. Os lábios ficaram lindos, sem aquele aspecto exagerado, e as minhas crises de dor de cabeça praticamente sumiram. Nota mil!',
    date: 'Há um mês',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',
    treatment: 'Botox e Preenchimento'
  }
];

export const INITIAL_FINANCE_RECORDS: FinanceRecord[] = [
  { id: 'f-1', type: 'receita', amount: 8500, date: '2026-07-02', category: 'Invisalign', status: 'pago', description: 'Entrada tratamento Invisalign', patientName: 'Amanda Silva Menezes', paymentMethod: 'pix' },
  { id: 'f-2', type: 'receita', amount: 1500, date: '2026-07-02', category: 'Harmonização', status: 'pago', description: 'Procedimento Botox Masseter', patientName: 'Rodrigo Augusto Castro', paymentMethod: 'pix' },
  { id: 'f-3', type: 'receita', amount: 250, date: '2026-07-01', category: 'Consulta', status: 'pago', description: 'Teleconsulta paga', patientName: 'Patrícia Gouveia Lins', paymentMethod: 'cartao' },
  { id: 'f-4', type: 'despesa', amount: 2400, date: '2026-07-01', category: 'Laboratório', status: 'pago', description: 'Confecção prótese porcelana lab' },
  { id: 'f-5', type: 'despesa', amount: 1200, date: '2026-06-30', category: 'Insumos', status: 'pago', description: 'Compra de seringas ácido hialurônico e toxina' },
  { id: 'f-6', type: 'receita', amount: 3500, date: '2026-06-29', category: 'Implante', status: 'pago', description: 'Procedimento Implante Unitário', patientName: 'Beatriz Vasconcellos Prado', paymentMethod: 'pix' },
  { id: 'f-7', type: 'receita', amount: 2800, date: '2026-06-28', category: 'Harmonização', status: 'pago', description: 'Preenchimento Labial Ácido Hialurônico', patientName: 'Gisele Mendonça Alencar', paymentMethod: 'cartao' }
];

export const INITIAL_CAMPAIGNS: MarketingCampaign[] = [
  { id: 'c-1', name: 'Invisalign - São Paulo Premium', platform: 'Google Ads', investment: 1500, leadsGenerated: 42, conversions: 5, clicks: 1200, impressions: 24000, revenue: 45000 },
  { id: 'c-2', name: 'Estética Labial / Botox', platform: 'Meta Ads', investment: 1200, leadsGenerated: 68, conversions: 12, clicks: 3100, impressions: 58000, revenue: 19600 },
  { id: 'c-3', name: 'Implantes Dentários Cambuci', platform: 'Google Ads', investment: 800, leadsGenerated: 25, conversions: 3, clicks: 650, impressions: 12500, revenue: 14500 },
  { id: 'c-4', name: 'SEO Local - Dentista Cambuci', platform: 'SEO Local', investment: 300, leadsGenerated: 18, conversions: 4, clicks: 420, impressions: 8500, revenue: 8600 }
];
