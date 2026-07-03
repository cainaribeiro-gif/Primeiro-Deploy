/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Service, Patient, Lead, Appointment, BlogPost, Review, FinanceRecord, MarketingCampaign } from './types';

export const INITIAL_SERVICES: Service[] = [
  // HARMONIZAÇÃO OROFACIAL
  {
    id: 'botox',
    name: 'Toxina Botulínica (Botox)',
    category: 'harmonizacao',
    shortDescription: 'Suavização de linhas de expressão e alívio de disfunções como bruxismo.',
    fullDescription: 'A aplicação de toxina botulínica na odontologia vai muito além da estética. Embora seja amplamente reconhecida por suavizar rugas e marcas de expressão na região da testa, olhos e entre as sobrancelhas, ela possui indicações terapêuticas essenciais. É uma grande aliada no tratamento de dores de cabeça tensionais, bruxismo (aperto dos dentes), sorrisos gengivais e assimetrias faciais.',
    benefits: [
      'Suavização de rugas dinâmicas e linhas de expressão',
      'Alívio de dores de cabeça tensionais e relaxamento muscular mandibular',
      'Correção do sorriso gengival (exposição excessiva da gengiva ao sorrir)',
      'Prevenção do desgaste dentário prematuro causado pelo bruxismo',
      'Procedimento rápido, seguro e minimamente invasivo'
    ],
    indications: [
      'Indivíduos com bruxismo ou apertamento dentário severo',
      'Pacientes com sorriso gengival acentuado',
      'Pessoas que buscam suavizar rugas ao redor dos olhos e na testa',
      'Casos de assimetria labial ou facial leve'
    ],
    faqs: [
      {
        question: 'Quanto tempo dura o efeito do Botox?',
        answer: 'O efeito inicia-se entre 3 e 5 dias após a aplicação, atingindo o pico em 15 dias. A durabilidade média varia entre 4 e 6 meses, dependendo do metabolismo individual do paciente.'
      },
      {
        question: 'A aplicação é dolorida?',
        answer: 'O procedimento é extremamente tolerável. Utilizamos agulhas ultrafinas e anestésicos tópicos de alta eficácia para garantir o máximo de conforto durante a aplicação.'
      }
    ],
    priceEstimate: 'R$ 1.200 - R$ 1.800',
    imageUrl: 'https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'skinbooster',
    name: 'Skinbooster',
    category: 'harmonizacao',
    shortDescription: 'Hidratação profunda e restauração do brilho e elasticidade da pele.',
    fullDescription: 'O Skinbooster é um tratamento de hidratação injetável que atua nas camadas mais profundas da derme utilizando ácido hialurônico de baixa densidade combinado com vitaminas e aminoácidos. Diferente dos preenchedores tradicionais, seu objetivo não é dar volume, mas sim restaurar a hidratação, elasticidade, brilho e firmeza da pele de dentro para fora.',
    benefits: [
      'Hidratação profunda e duradoura da derme facial',
      'Melhora imediata da textura e luminosidade da pele',
      'Estímulo sutil de colágeno e elastina',
      'Suavização de rugas finas (efeito \"craquelado\")',
      'Resultados extremamente naturais e revigorantes'
    ],
    indications: [
      'Peles desidratadas, opacas ou sem viço',
      'Pacientes com linhas finas persistentes no rosto ou pescoço',
      'Prevenção do envelhecimento precoce'
    ],
    faqs: [
      {
        question: 'Quantas sessões são necessárias?',
        answer: 'Recomenda-se um protocolo inicial de 2 a 3 sessões, com intervalo de 30 dias entre elas. Para manutenção, uma sessão a cada 6 meses é ideal.'
      }
    ],
    priceEstimate: 'R$ 800 - R$ 1.400 por sessão',
    imageUrl: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'acido-hialuronico',
    name: 'Ácido Hialurônico (Preenchimento)',
    category: 'harmonizacao',
    shortDescription: 'Reposição de volumes perdidos, contorno labial e redefinição de mandíbula.',
    fullDescription: 'O preenchimento com ácido hialurônico é uma das técnicas mais nobres da harmonização orofacial. Ele devolve o volume perdido em regiões estratégicas decorrente do envelhecimento, melhora contornos, projeta o queixo (mento), preenche olheiras profundas e esculpe lábios simétricos, hidratados e volumosos, sempre respeitando a anatomia natural de cada indivíduo.',
    benefits: [
      'Definição e volume labial de forma natural e esculpida',
      'Suavização do sulco nasogeniano (famoso \"bigode chinês\")',
      'Harmonização e projeção do mento (queixo) e mandíbula',
      'Melhora na sustentação das bochechas (efeito blush/top model look)',
      'Resultado imediato e reversível, proporcionando alta segurança'
    ],
    indications: [
      'Lábios finos, sem definição ou com assimetrias',
      'Perda de volume na região malar e bochechas',
      'Olheiras profundas e sulcos faciais marcados'
    ],
    faqs: [
      {
        question: 'O resultado é definitivo?',
        answer: 'Não. O ácido hialurônico é um composto biocompatível e reabsorvível. Seus efeitos duram em média de 10 a 18 meses, dependendo da área preenchida e do estilo de vida.'
      }
    ],
    priceEstimate: 'R$ 1.500 - R$ 2.900 por seringa',
    imageUrl: 'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'mmp',
    name: 'Microinfusão de Medicamentos na Pele (MMP)',
    category: 'harmonizacao',
    shortDescription: 'Tratamento de manchas, melasma, rejuvenescimento e cicatrizes com ativos.',
    fullDescription: 'O MMP é uma técnica inovadora que utiliza um aparelho com microagulhas para infundir medicamentos e ativos diretamente na derme profunda. Essa técnica permite a entrega super concentrada de ácidos clareadores, vitaminas, antioxidantes e estimuladores de colágeno exatamente onde a pele necessita, garantindo alta eficácia no combate ao melasma, cicatrizes de acne e poros abertos.',
    benefits: [
      'Tratamento focado contra melasma e manchas persistentes',
      'Estímulo mecânico de colágeno induzido pelo microagulhamento',
      'Redução de poros dilatados e cicatrizes de acne',
      'Uniformização do tom e relevo da pele'
    ],
    indications: [
      'Portadores de melasma resistente a tratamentos tópicos',
      'Pacientes com cicatrizes de acne ou poros abertos',
      'Flacidez facial leve'
    ],
    faqs: [
      {
        question: 'A pele descama muito após o MMP?',
        answer: 'Pode haver uma descamação leve e vermelhidão nos primeiros 3 a 5 dias. É essencial o uso de protetor solar e hidratante regenerador prescrito pela Dra. Claudia.'
      }
    ],
    priceEstimate: 'R$ 600 - R$ 950 por sessão',
    imageUrl: 'https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'fios',
    name: 'Fios de Sustentação (PDO)',
    category: 'harmonizacao',
    shortDescription: 'Efeito lifting imediato sem cirurgia e estímulo intenso de colágeno.',
    fullDescription: 'Os fios de Polidioxanona (PDO) são estruturas reabsorvíveis inseridas sob a pele para promover um efeito lifting imediato através da tração dos tecidos e, paralelamente, estimular a produção biológica de colágeno a médio e longo prazo. São perfeitos para reposicionar bochechas caídas, redefinir a linha da mandíbula e levantar sobrancelhas.',
    benefits: [
      'Efeito lifting imediato e reposicionamento de tecidos flácidos',
      'Estímulo contínuo de colágeno novo por até 12 meses',
      'Melhora acentuada na firmeza e textura cutânea',
      'Totalmente absorvível pelo organismo, garantindo segurança clínica'
    ],
    indications: [
      'Flacidez facial leve a moderada',
      'Perda de contorno da mandíbula',
      'Queda da cauda das sobrancelhas (Fox Eyes look)'
    ],
    faqs: [
      {
        question: 'Como é a recuperação?',
        answer: 'A recuperação é rápida. É normal sentir um leve desconforto físico, inchaço ou pequenos hematomas nos primeiros dias. Deve-se evitar exercícios pesados e movimentos faciais bruscos por uma semana.'
      }
    ],
    priceEstimate: 'R$ 1.800 - R$ 3.800',
    imageUrl: 'https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'bichectomia',
    name: 'Bichectomia',
    category: 'harmonizacao',
    shortDescription: 'Redução das bochechas para afinar o rosto e evitar mordeduras internas.',
    fullDescription: 'A bichectomia consiste na remoção cirúrgica parcial do corpo adiposo da bochecha (bola de Bichat). Além de proporcionar um efeito estético de afinamento facial, marcando mais as maçãs do rosto (efeito blush), possui indicação funcional crucial para pacientes que mordem frequentemente a parte interna das bochechas, causando lesões crônicas.',
    benefits: [
      'Afinamento tridimensional do terço inferior da face',
      'Destorcimento e maior evidência das maçãs do rosto',
      'Fim das mordidas dolorosas nas bochechas durante a mastigação',
      'Procedimento cirúrgico de pequeno porte com rápida cicatrização'
    ],
    indications: [
      'Pacientes com corredor bucal estreito que mordem a bochecha constantemente',
      'Rostos muito arredondados que buscam maior definição de contorno'
    ],
    faqs: [
      {
        question: 'O rosto pode ficar muito flácido com o tempo?',
        answer: 'Não, quando bem indicada. A bola de Bichat é uma gordura profunda que não dá sustentação à pele. A remoção criteriosa e na quantidade correta pela Dra. Claudia garante um resultado harmônico sem causar flacidez precoce.'
      }
    ],
    priceEstimate: 'R$ 3.500 - R$ 5.000',
    imageUrl: 'https://images.unsplash.com/photo-1579684389782-64d84b5e901d?auto=format&fit=crop&q=80&w=800'
  },

  // IMPLANTODONTIA
  {
    id: 'proteses-implante',
    name: 'Próteses sobre Implantes',
    category: 'implantodontia',
    shortDescription: 'Reabilitação total ou parcial de dentes perdidos com próteses fixas e seguras.',
    fullDescription: 'As próteses sobre implantes são as melhores soluções para repor múltiplos dentes ou até mesmo arcadas inteiras. Podem ser coroas unitárias fixas, pontes sobre implantes ou próteses totais fixas (conhecidas como Próteses Protocolo). Elas eliminam a necessidade de dentaduras móveis, devolvendo 100% da segurança para comer, falar e sorrir de forma natural.',
    benefits: [
      'Estabilidade absoluta ao mastigar e falar, sem riscos de deslocamento',
      'Estética idêntica aos dentes naturais em brilho, forma e translucidez',
      'Preservação da estrutura óssea facial e sustentação labial',
      'Devolução da fonética correta e qualidade de vida do paciente'
    ],
    indications: [
      'Ausência de um, vários ou todos os dentes de uma arcada',
      'Usuários de dentaduras móveis insatisfeitos com a falta de firmeza',
      'Dentes comprometidos sem possibilidade de tratamento de canal'
    ],
    faqs: [
      {
        question: 'A prótese protocolo é removível pelo paciente?',
        answer: 'Não. A prótese protocolo é totalmente parafusada sobre os implantes pelo dentista. Ela só é removida na clínica durante as consultas de manutenção e profilaxia semestral.'
      }
    ],
    priceEstimate: 'Sob Avaliação (R$ 4.000 - R$ 15.000 por arcada)',
    imageUrl: 'https://images.unsplash.com/photo-1445527815219-ecbfec67492e?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'implantes-unitarios',
    name: 'Implantes Unitários',
    category: 'implantodontia',
    shortDescription: 'Substituição de um dente perdido de forma definitiva com pino de titânio.',
    fullDescription: 'O implante unitário consiste na inserção de um pino de titânio de alta pureza no osso maxilar ou mandibular para substituir a raiz de um dente perdido. Após o período de integração óssea, uma coroa de porcelana personalizada é confeccionada e fixada sobre este pino, funcionando exatamente como um dente natural e sem desgastar os dentes vizinhos.',
    benefits: [
      'Substituição definitiva sem necessidade de tocar ou desgastar os dentes saudáveis adjacentes',
      'Sensação tátil e de mastigação idêntica ao dente original',
      'Higiene idêntica à de um dente normal (uso de escova e fio dental tradicional)',
      'Excelente durabilidade (pode durar a vida toda com os devidos cuidados)'
    ],
    indications: [
      'Pacientes que perderam um único dente por cárie, fratura ou trauma',
      'Casos de agenesia (dentes que nunca nasceram)'
    ],
    faqs: [
      {
        question: 'Existe risco de rejeição do implante?',
        answer: 'O titânio é um material altamente biocompatível, o que significa que o organismo não o rejeita. O índice de sucesso do procedimento é superior a 98% quando realizado por profissional capacitado e com boa saúde sistêmica do paciente.'
      }
    ],
    priceEstimate: 'R$ 2.500 - R$ 4.500 por elemento',
    imageUrl: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'carga-imediata',
    name: 'Implantes com Carga Imediata',
    category: 'implantodontia',
    shortDescription: 'Dente novo fixo em até 72 horas após a cirurgia do implante.',
    fullDescription: 'Os implantes com carga imediata são a revolução da implantodontia moderna. Essa técnica permite que o paciente entre no consultório sem dente (ou com dente condenado) e saia com um dente provisório fixo aparafusado no mesmo dia ou em até 72 horas. Indicado principalmente para regiões estéticas visíveis, evitando o uso de aparelhos móveis provisórios desconfortáveis.',
    benefits: [
      'Dente fixo imediato, sem constrangimentos sociais ou lacunas no sorriso',
      'Apenas um procedimento cirúrgico para instalação do implante e do dente provisório',
      'Adaptação gengival otimizada ao redor da coroa definitiva futura',
      'Retorno imediato da autoestima e funções mastigatórias básicas'
    ],
    indications: [
      'Ausência ou perda iminente de dentes na região anterior (frente)',
      'Pacientes com quantidade e densidade óssea adequadas verificadas via tomografia'
    ],
    faqs: [
      {
        question: 'Qualquer pessoa pode fazer Carga Imediata?',
        answer: 'Não. É essencial que o pino de titânio consiga uma estabilidade primária excelente no osso durante a cirurgia (torque alto). Isso depende exclusivamente da qualidade óssea do paciente, avaliada previamente por exames de imagem e durante o ato cirúrgico.'
      }
    ],
    priceEstimate: 'R$ 3.800 - R$ 6.000',
    imageUrl: 'https://images.unsplash.com/photo-1598256989800-fe5f95da9787?auto=format&fit=crop&q=80&w=800'
  },

  // ORTODONTIA
  {
    id: 'aparelho-convencional',
    name: 'Aparelho Ortodôntico Convencional',
    category: 'ortodontia',
    shortDescription: 'Alinhamento dos dentes com braquetes metálicos clássicos e borrachinhas.',
    fullDescription: 'O aparelho metálico convencional é o método mais consagrado para movimentação de dentes desalinhados e correção de problemas de mordida (oclusão). Ele utiliza braquetes de metal colados aos dentes, conectados por um fio metálico tensionado por borrachinhas coloridas. É extremamente versátil e resolve desde os casos simples aos mais severos de má-oclusão.',
    benefits: [
      'Altíssima precisão e eficácia em qualquer complexidade de caso',
      'Excelente relação custo-benefício',
      'Acompanhamento mensal rigoroso e personalização por borrachinhas',
      'Resultados ortodônticos comprovados mundialmente'
    ],
    indications: [
      'Crianças, adolescentes e adultos com dentes tortos ou encavalados',
      'Problemas de mordida cruzada, aberta, profunda ou prognatismo'
    ],
    faqs: [
      {
        question: 'Quanto tempo dura o tratamento?',
        answer: 'A duração varia conforme a complexidade e a colaboração do paciente nas consultas. Em média, os tratamentos duram entre 18 e 24 meses.'
      }
    ],
    priceEstimate: 'Mensalidade de manutenção R$ 120 - R$ 200',
    imageUrl: 'https://images.unsplash.com/photo-1513412536067-16d820b9176c?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'invisalign',
    name: 'Invisalign (Alinhadores Invisíveis)',
    category: 'ortodontia',
    shortDescription: 'O alinhamento dos seus dentes de forma totalmente discreta, móvel e rápida.',
    fullDescription: 'O Invisalign é a tecnologia mais avançada do mundo para alinhamento dentário. Esqueça fios, metais ou restrições alimentares. Através de placas plásticas transparentes e personalizadas por meio de escaneamento 3D da sua boca, seus dentes são movimentados milímetro a milímetro de forma rápida, confortável e imperceptível.',
    benefits: [
      'Praticamente invisível, mantendo sua estética e confiança profissional',
      'Removível para comer o que quiser e fazer a higiene bucal com facilidade',
      'Sem fios metálicos que espetam, cortam a boca ou causam aftas',
      'Tratamento até 50% mais rápido e previsível graças ao software 3D ClinCheck',
      'Menos consultas presenciais necessárias na clínica'
    ],
    indications: [
      'Adultos e adolescentes que buscam máxima discrição e conforto',
      'Profissionais que trabalham com imagem ou dão palestras constantes',
      'Pacientes que buscam um tratamento rápido com menor visitas clínicas'
    ],
    faqs: [
      {
        question: 'Quantas horas por dia devo usar?',
        answer: 'Para que o tratamento funcione com máxima eficiência, os alinhadores devem ser usados entre 20 e 22 horas por dia, sendo removidos apenas para alimentação e higiene.'
      }
    ],
    priceEstimate: 'Sob Consulta (R$ 6.000 - R$ 16.000)',
    imageUrl: 'https://images.unsplash.com/photo-1598256989800-fe5f95da9787?auto=format&fit=crop&q=80&w=800'
  },

  // CLÍNICA GERAL
  {
    id: 'profilaxia',
    name: 'Profilaxia e Raspagem (Limpeza)',
    category: 'clinica_geral',
    shortDescription: 'Prevenção de doenças na gengiva, remoção de tártaro e manchas superficiais.',
    fullDescription: 'A profilaxia é a limpeza profissional realizada em consultório. Através da raspagem com ultrassom e instrumentos manuais, removemos o tártaro acumulado e a placa bacteriana profunda que a escovação diária não consegue alcançar. O procedimento é finalizado com jato de bicarbonato de sódio e aplicação tópica de flúor para dentes blindados e gengivas saudáveis.',
    benefits: [
      'Eliminação imediata do mau hálito causado por bactérias acumuladas',
      'Prevenção da gengivite (inflamação) e periodontite (perda de suporte ósseo)',
      'Remoção de manchas superficiais de café, chá, vinho ou cigarro',
      'Sensação indescritível de limpeza profunda, frescor e dentes lisos'
    ],
    indications: [
      'Todos os pacientes, idealmente a cada 6 meses',
      'Pessoas com sangramento gengival durante o uso do fio dental',
      'Portadores de implantes ou aparelhos ortodônticos que necessitam controle extra'
    ],
    faqs: [
      {
        question: 'Com qual frequência devo fazer a limpeza clínica?',
        answer: 'Para a maioria das pessoas, o ideal é realizar a profilaxia a cada 6 meses. Pacientes com histórico de doença periodontal severa ou portadores de aparelhos devem fazer a cada 3 ou 4 meses.'
      }
    ],
    priceEstimate: 'R$ 180 - R$ 350',
    imageUrl: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&q=80&w=800'
  },
  // CORE 7 PREMIUM TREATMENT SHEETS
  {
    id: 'implantes',
    name: 'Implantes Dentários',
    category: 'implantodontia',
    shortDescription: 'Substituição segura e definitiva de dentes perdidos com tecnologia de titânio de alta pureza.',
    fullDescription: 'Os implantes dentários representam o padrão ouro na reabilitação de dentes perdidos. Utilizando pinos de titânio biocompatíveis que atuam como raízes artificiais, esta tecnologia oferece estabilidade absoluta para mastigação, fala e estética, eliminando a insegurança de próteses móveis.',
    benefits: [
      'Estabilidade total ao mastigar e falar, sem risco de deslocamentos',
      'Preservação da estrutura óssea facial e sustentação labial',
      'Estética natural idêntica aos dentes originais em cor, brilho e translucidez',
      'Durabilidade vitalícia com os devidos cuidados de higiene e manutenção'
    ],
    indications: [
      'Ausência de um, vários ou todos os dentes de uma arcada',
      'Dificuldade na mastigação devido a falhas dentárias',
      'Usuários de próteses ou dentaduras móveis insatisfeitos com a falta de firmeza'
    ],
    contraindications: [
      'Pacientes com diabetes ou hipertensão grave descompensada',
      'Problemas sistêmicos graves de cicatrização ou doenças ósseas ativas',
      'Higiene bucal extremamente deficitária que possa comprometer a osseointegração'
    ],
    averageTime: 'De 3 a 6 meses para osseointegração clássica, ou carga imediata em até 72 horas para casos aptos',
    recovery: 'Repouso moderado nas primeiras 48 horas, alimentação preferencialmente fria e líquida, e uso de medicação analgésica prescrita.',
    ctaText: 'Agendar Avaliação de Implantes',
    faqs: [
      {
        question: 'O procedimento cirúrgico é doloroso?',
        answer: 'Absolutamente não. A cirurgia de implante é realizada sob anestesia local moderna extremamente eficaz. No pós-operatório, os medicamentos prescritos garantem um restabelecimento bastante confortável.'
      },
      {
        question: 'Existe risco de rejeição?',
        answer: 'O titânio é um metal altamente biocompatível e o corpo não reage contra ele de forma imunológica. O índice de sucesso do tratamento é de mais de 98%.'
      }
    ],
    priceEstimate: 'Sob Avaliação',
    imageUrl: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'facetas',
    name: 'Facetas e Lentes de Contato Dental',
    category: 'estetica',
    shortDescription: 'Transformação estética de alta performance para um sorriso harmonioso, simétrico e radiante.',
    fullDescription: 'As facetas e lentes de contato de porcelana pura são lâminas ultrafinas aplicadas sobre a superfície externa dos dentes. Elas corrigem imperfeições de cor, formato, tamanho e desalinhamentos leves com o máximo de preservação da estrutura dentária natural, alcançando o sorriso ideal.',
    benefits: [
      'Correção imediata de dentes escurecidos, manchados ou desgastados',
      'Harmonização de tamanho, contornos e fechamento de espaços (diastemas)',
      'Altíssima resistência a manchas alimentares e excelente estabilidade de cor ao longo dos anos',
      'Resultado estético de altíssimo padrão, com brilho e translucidez naturais'
    ],
    indications: [
      'Dentes desgastados, lascados ou ligeiramente desalinhados',
      'Manchas intrínsecas resistentes a tratamentos de clareamento químico',
      'Desejo de redefinição completa de formato e alinhamento do sorriso'
    ],
    contraindications: [
      'Pacientes com bruxismo ou apertamento severo sem placa protetora de descanso',
      'Dentes com perda severa de estrutura de esmalte para colagem',
      'Doença periodontal ativa ou cáries não tratadas'
    ],
    averageTime: 'Apenas 2 a 3 sessões de consultório (incluindo planejamento digital detalhado, preparo e cimentação final)',
    recovery: 'Imediata. O paciente pode retornar às suas atividades normais logo após as sessões, sentindo-se seguro com o novo sorriso.',
    ctaText: 'Planejar Meu Sorriso Premium',
    faqs: [
      {
        question: 'É necessário desgastar muito os dentes originais?',
        answer: 'As lentes de contato de porcelana modernas são tão finas (cerca de 0.2 a 0.5mm) que exigem um desgaste mínimo ou, em muitos casos, nenhum desgaste do esmalte natural.'
      },
      {
        question: 'Qual a durabilidade das facetas de porcelana?',
        answer: 'Com boa higiene bucal e visitas regulares ao dentista, as facetas de porcelana podem durar facilmente entre 10 e 15 anos.'
      }
    ],
    priceEstimate: 'Sob Consulta',
    imageUrl: 'https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'clareamento',
    name: 'Clareamento Dental Premium',
    category: 'estetica',
    shortDescription: 'Sorriso intensamente branco e rejuvenescido com segurança clínica e controle absoluto de sensibilidade.',
    fullDescription: 'O clareamento dental premium associa o procedimento de consultório assistido por LED de última geração com o acompanhamento caseiro supervisionado. Esta sinergia de técnicas garante um sorriso radiante, natural e duradouro, com controle estrito de sensibilidade dental.',
    benefits: [
      'Remoção profunda de pigmentos e amarelamento persistente',
      'Combinação personalizada de técnicas para melhores resultados',
      'Uso de gel clareador premium com dessensibilizantes integrados de alta eficácia',
      'Procedimento totalmente seguro que preserva intacta a estrutura de esmalte'
    ],
    indications: [
      'Dentes amarelados pelo envelhecimento natural ou hábitos de vida (consumo de café, chá, vinho tinto)',
      'Manchas superficiais no esmalte ou escurecimento pós-tratamentos de canal'
    ],
    contraindications: [
      'Gestantes e lactantes',
      'Pacientes menores de 16 anos',
      'Sensibilidade dentária severa não tratada, cáries ativas ou inflamações gengivais'
    ],
    averageTime: 'De 1 a 3 semanas (associando a sessão clínica com o uso domiciliar)',
    recovery: 'Sem necessidade de repouso. Apenas recomenda-se evitar alimentos com corantes fortes durante o tratamento.',
    ctaText: 'Iluminar Meu Sorriso',
    faqs: [
      {
        question: 'O clareamento dental estraga o esmalte do dente?',
        answer: 'Não. O gel clareador atua apenas nos pigmentos orgânicos dentro dos poros do dente, sem alterar a estrutura mineral ou desgastar o esmalte.'
      },
      {
        question: 'Vou sentir muita sensibilidade durante o clareamento?',
        answer: 'Na nossa clínica, utilizamos géis clareadores premium com agentes dessensibilizantes e planejamos o tempo de uso de forma individual, minimizando a sensibilidade.'
      }
    ],
    priceEstimate: 'R$ 800 - R$ 1.500',
    imageUrl: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'canal',
    name: 'Tratamento de Canal (Endodontia)',
    category: 'clinica_geral',
    shortDescription: 'Alívio imediato da dor e preservação do dente natural com técnicas de endodontia avançada.',
    fullDescription: 'O tratamento de canal consiste na remoção precisa da polpa dentária inflamada ou infeccionada, desinfecção rigorosa dos canais internos e selamento tridimensional permanente. Utilizando técnicas modernas de endodontia mecanizada e instrumentação de ponta, o procedimento é extremamente rápido, seguro e totalmente indolor.',
    benefits: [
      'Alívio imediato de dores agudas e latejantes',
      'Preservação do dente natural na boca, evitando a perda e a necessidade de implantes',
      'Prevenção de infecções graves que podem se espalhar pelo organismo',
      'Procedimento confortável e silencioso sob anestesia local eficaz'
    ],
    indications: [
      'Cáries profundas que atingiram o canal nervoso do dente',
      'Dores espontâneas persistentes ou sensibilidade extrema prolongada ao quente e frio',
      'Dentes que sofreram traumas físicos que comprometeram a saúde pulpar'
    ],
    contraindications: [
      'Dentes com fraturas de raiz completas ou perda de sustentação óssea extrema'
    ],
    averageTime: 'Geralmente realizado em sessão única (1 a 1h30 de procedimento)',
    recovery: 'Leve sensibilidade local ao mastigar nos primeiros 3 dias, facilmente controlada com analgésicos simples prescritos.',
    ctaText: 'Aliviar Minha Dor de Canal',
    faqs: [
      {
        question: 'O dente fica fraco após tratar o canal?',
        answer: 'O dente perde a vitalidade interna, mas a sua estrutura de esmalte e dentina permanece. Uma restauração com pino de reforço ou coroa de porcelana restabelece totalmente a sua força.'
      },
      {
        question: 'Dói para fazer o canal?',
        answer: 'Não. Graças às técnicas de anestesia local atuais, o procedimento de canal é totalmente indolor durante a sessão clínica.'
      }
    ],
    priceEstimate: 'R$ 650 - R$ 1.500',
    imageUrl: 'https://images.unsplash.com/photo-1579684389782-64d84b5e901d?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'protese',
    name: 'Próteses Odontológicas',
    category: 'reabilitacao',
    shortDescription: 'Reabilitação funcional e estética com próteses fixas, sobre implantes e parciais de alta precisão.',
    fullDescription: 'As próteses odontológicas são projetadas com tecnologia digital para restabelecer a função mastigatória, a fonética e a estética facial do paciente. Oferecemos coroas em zircônia, próteses protocolo sobre implante e próteses parciais estéticas, devolvendo a alegria de sorrir e mastigar sem constrangimentos.',
    benefits: [
      'Restabelecimento imediato de uma mastigação segura, eficiente e sem incômodos',
      'Prevenção de dores articulares (ATM) decorrentes de mastigação unilateral',
      'Apoio labial e preenchimento facial, suavizando linhas de expressão e rugas',
      'Grande variedade de materiais premium de altíssima durabilidade e aparência natural'
    ],
    indications: [
      'Perda de um ou vários dentes',
      'Dentes severamente destruídos que não aceitam restaurações comuns',
      'Usuários de próteses antigas desadaptadas, frouxas ou desgastadas'
    ],
    contraindications: [
      'Presença de cáries ativas ou inflamações periodontais nas áreas de apoio'
    ],
    averageTime: 'De 2 a 4 sessões (entre moldagem/escaneamento digital, provas estéticas e entrega)',
    recovery: 'Breve período de adaptação fonética e mastigatória nas primeiras semanas; livre de dores físicas agudas.',
    ctaText: 'Restaurar Minha Mastigação',
    faqs: [
      {
        question: 'Qual a diferença entre prótese fixa de porcelana e zircônia?',
        answer: 'A porcelana oferece excelente estética, mas a zircônia associa a beleza estética com uma resistência mecânica extraordinária, sendo o material de preferência para reabilitações extensas.'
      },
      {
        question: 'Como higienizar minha prótese fixa?',
        answer: 'O uso de escovas de cerdas macias, passa-fio ou jatos de água orais (como Waterpik) garantem a limpeza perfeita abaixo das pontes fixas.'
      }
    ],
    priceEstimate: 'Sob Avaliação',
    imageUrl: 'https://images.unsplash.com/photo-1445527815219-ecbfec67492e?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'harmonizacao',
    name: 'Harmonização Facial',
    category: 'harmonizacao',
    shortDescription: 'Equilíbrio de traços, rejuvenescimento natural e valorização da beleza facial com sofisticação.',
    fullDescription: 'A Harmonização Facial integra procedimentos estéticos modernos de forma minimamente invasiva para equilibrar as proporções do rosto, suavizar linhas de expressão marcantes e repor os volumes perdidos com o tempo. Nosso foco absoluto está na naturalidade, elegância e exaltação da sua melhor versão.',
    benefits: [
      'Suavização eficaz de rugas de expressão e marcas na testa com toxina botulínica',
      'Definição elegante de lábios, contorno da mandíbula e queixo com ácido hialurônico',
      'Estímulo biológico intenso de colágeno novo com bioestimuladores de última geração',
      'Procedimento rápido com resultados imediatos e sem necessidade de cirurgias plásticas'
    ],
    indications: [
      'Linhas de expressão marcadas ou perda visível de viço na pele do rosto',
      'Lábios finos, sem contorno ou com assimetrias',
      'Flacidez facial no terço médio e inferior da face'
    ],
    contraindications: [
      'Gestantes e lactantes',
      'Alergias conhecidas às substâncias aplicadas',
      'Doenças autoimunes ou infecções ativas no local da aplicação'
    ],
    averageTime: 'Sessões ágeis de 30 a 60 minutos em consultório',
    recovery: 'Praticamente imediata. Evitar exercícios físicos intensos e exposição direta ao sol nas primeiras 24 horas.',
    ctaText: 'Agendar Avaliação Facial',
    faqs: [
      {
        question: 'Vou ficar com a expressão artificial?',
        answer: 'Não. O olhar clínico da Dra. Claudia França prioriza sempre a naturalidade e a harmonia anatômica, respeitando os seus traços únicos.'
      },
      {
        question: 'Os preenchimentos doem?',
        answer: 'Utilizamos anestesia odontológica local de altíssimo conforto e agulhas e microcânulas especiais que tornam a sessão extremamente confortável.'
      }
    ],
    priceEstimate: 'Sob Consulta',
    imageUrl: 'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'reabilitacao',
    name: 'Reabilitação Oral Completa',
    category: 'reabilitacao',
    shortDescription: 'Planejamento multidisciplinar integrado para restaurar completamente sua mastigação, oclusão e sorriso.',
    fullDescription: 'A reabilitação oral é o planejamento mais completo e nobre da odontologia. Combinando implantes, próteses de precisão, estética avançada e ortodontia digital, ela restabelece de forma tridimensional a oclusão correta, eliminando dores na articulação (ATM) e devolvendo um sorriso radiante e funcional.',
    benefits: [
      'Recuperação total da capacidade de mastigação e ingestão de qualquer alimento',
      'Alívio de dores de cabeça e musculares associadas a problemas na articulação (ATM)',
      'Transformação estética radical e natural do sorriso, devolvendo a autoestima perdida',
      'Aumento imediato na qualidade de vida, segurança profissional e bem-estar geral'
    ],
    indications: [
      'Pacientes com desgaste dentário severo e generalizado por bruxismo ou acidez',
      'Ausência de múltiplos dentes com perda de dimensão vertical da face',
      'Dentes desalinhados, desgastados e quebrados em toda a boca'
    ],
    contraindications: [
      'Nenhuma contraindicação absoluta. O plano é customizado para as necessidades médicas e cardíacas do paciente.'
    ],
    averageTime: 'Etapas planejadas ao longo de 1 a 6 meses de forma estruturada e confortável',
    recovery: 'Processo conduzido por etapas seguras, sempre garantindo o uso de próteses provisórias altamente estéticas e funcionais ao longo do tratamento.',
    ctaText: 'Iniciar Minha Reabilitação Oral',
    faqs: [
      {
        question: 'Vou ficar sem dentes durante as etapas do tratamento?',
        answer: 'De forma alguma. Desde o primeiro dia, planejamos e instalamos próteses provisórias fixas ou móveis de excelente padrão estético para que você sorria com conforto durante todo o processo.'
      },
      {
        question: 'Como é feito o planejamento inicial?',
        answer: 'Realizamos um checkup digital completo com escaneamento 3D, fotos profissionais e radiografias digitais. Criamos um enceramento diagnóstico que simula digitalmente o resultado final antes de iniciar.'
      }
    ],
    priceEstimate: 'Sob Avaliação',
    imageUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'aparelho-porcelana',
    name: 'Aparelho de Porcelana',
    category: 'ortodontia',
    shortDescription: 'Alinhamento com braquetes cerâmicos translúcidos de altíssima discrição estética.',
    fullDescription: 'O aparelho de porcelana une a eficiência do tratamento ortodôntico convencional com a exigência estética do paciente adulto. Os braquetes são confeccionados em cerâmica odontológica pura e translúcida, mimetizando a cor natural do dente. Eles não sofrem amarelamento e oferecem excelente conforto físico.',
    benefits: [
      'Estética altamente discreta com braquetes que imitam a cor dos dentes',
      'Material de porcelana pura que não mancha ou amarela com alimentação',
      'Excelente resistência mecânica para conduzir casos complexos',
      'Arco e borrachinhas estéticas especiais invisíveis'
    ],
    indications: [
      'Adultos e jovens que desejam alinhar os dentes sem o visual metálico',
      'Profissionais com alta exigência de imagem pessoal'
    ],
    contraindications: [
      'Nenhuma contraindicação absoluta.'
    ],
    averageTime: 'De 12 a 24 meses de tratamento ativo',
    recovery: 'Leve desconforto nos primeiros 3 dias pós-manutenção mensal.',
    ctaText: 'Agendar Ortodontia Estética',
    faqs: [
      {
        question: 'Os braquetes de porcelana descolam fácil?',
        answer: 'Não. Utilizamos adesivos fotopolimerizáveis de alta performance específicos para cerâmica, garantindo uma colagem extremamente segura e resistente.'
      }
    ],
    priceEstimate: 'Sob Avaliação',
    imageUrl: 'https://images.unsplash.com/photo-1513412536067-16d820b9176c?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'aparelho-autoligado',
    name: 'Aparelho Autoligado',
    category: 'ortodontia',
    shortDescription: 'Tratamento ortodôntico de alta performance, sem borrachinhas e até 30% mais rápido.',
    fullDescription: 'O sistema autoligado dispensa o uso das borrachinhas coloridas tradicionais. O próprio braquete possui um clipe de metal ou cerâmica que prende o arco ortodôntico de forma inteligente. Isso reduz drasticamente o atrito entre o dente e o fio, resultando em movimentações mais rápidas, confortáveis e menos visitas ao consultório.',
    benefits: [
      'Movimentações dentárias até 30% mais rápidas do que o sistema clássico',
      'Menor atrito, promovendo um tratamento muito mais confortável e sem dores fortes',
      'Higiene facilitada pela ausência de elastômeros (borrachinhas) que acumulam resíduos',
      'Menos consultas presenciais necessárias e intervalos de retorno estendidos'
    ],
    indications: [
      'Pacientes que buscam um tratamento rápido e eficiente',
      'Pessoas com rotinas agitadas que preferem consultas de manutenção bimestrais'
    ],
    contraindications: [
      'Nenhuma.'
    ],
    averageTime: 'De 10 a 18 meses em média',
    recovery: 'Mínimo desconforto pós-ativação, significativamente menor que o convencional.',
    ctaText: 'Descobrir Aparelho Autoligado',
    faqs: [
      {
        question: 'O aparelho autoligado também possui versão estética?',
        answer: 'Sim! Oferecemos o sistema autoligado estético, onde os braquetes são confeccionados em safira ou cerâmica translúcida, unindo velocidade extrema e invisibilidade.'
      }
    ],
    priceEstimate: 'Sob Consulta',
    imageUrl: 'https://images.unsplash.com/photo-1513412536067-16d820b9176c?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'restauracao',
    name: 'Restaurações Estéticas',
    category: 'clinica_geral',
    shortDescription: 'Reconstrução de dentes afetados por cáries ou fraturas com resinas de alta performance.',
    fullDescription: 'As restaurações estéticas consistem na remoção criteriosa de tecidos cariados ou reconstrução de dentes trincados utilizando resinas compostas importadas. O material é esculpido delicadamente pela Dra. Claudia, respeitando a anatomia, cor e translucidez original do dente, tornando a intervenção totalmente invisível aos olhos.',
    benefits: [
      'Restaura a anatomia e força mastigatória de forma imediata',
      'Resinas importadas com nano-partículas que garantem alta polibilidade e brilho',
      'Cor mimetizada perfeitamente com os dentes vizinhos',
      'Substituição de amálgamas escuras antigas por resina na cor natural'
    ],
    indications: [
      'Dentes afetados por cáries ativas ou fraturas parciais de esmalte',
      'Substituição de restaurações de metal (amálgama escuro) por motivos estéticos'
    ],
    contraindications: [
      'Dentes com fraturas de raiz ou perda excessiva de estrutura coronária'
    ],
    averageTime: 'Sessão única de 30 a 60 minutos por dente',
    recovery: 'Imediata. O paciente pode se alimentar normalmente após o término da anestesia local.',
    ctaText: 'Restaurar Meu Sorriso',
    faqs: [
      {
        question: 'A resina pode escurecer ou mudar de cor com o tempo?',
        answer: 'As resinas modernas possuem excelente stabileza cromática, porém, hábitos como tabagismo ou consumo excessivo de café podem causar pigmentações superficiais ao longo de alguns anos, facilmente removíveis no polimento semestral.'
      }
    ],
    priceEstimate: 'R$ 200 - R$ 450',
    imageUrl: 'https://images.unsplash.com/photo-1579684389782-64d84b5e901d?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'extracao',
    name: 'Extrações Dentárias',
    category: 'clinica_geral',
    shortDescription: 'Remoção de dentes condenados com técnicas cirúrgicas seguras e sem dor.',
    fullDescription: 'Realizamos extrações dentárias simples ou complexas de forma totalmente segura, asséptica e indolor. Priorizamos ao máximo a manutenção da estrutura óssea do alvéolo, preparando a região de forma ideal para a posterior instalação de implantes e preservação do contorno facial.',
    benefits: [
      'Alívio de infecções recorrentes e dores crônicas severas',
      'Procedimento totalmente indolor sob anestesia local eficaz e humanizada',
      'Planejamento cirúrgico limpo que minimiza o inchaço pós-operatório',
      'Técnicas de preservação óssea para implantes imediatos'
    ],
    indications: [
      'Dentes amplamente destruídos por cáries profundas que não aceitam canal',
      'Fraturas verticais de raiz ou dentes condenados por doença periodontal avançada'
    ],
    contraindications: [
      'Distúrbios severos de coagulação não controlados clinicamente'
    ],
    averageTime: 'De 20 a 45 minutos',
    recovery: 'Cicatrização inicial da gengiva em 7 a 10 dias. Repouso absoluto de 48 horas recomendado para evitar sangramentos.',
    ctaText: 'Fazer Extração sem Dor',
    faqs: [
      {
        question: 'Vou sentir dor durante a extração?',
        answer: 'Não. A anestesia local é aplicada de forma técnica e delicada, bloqueando 100% da sensibilidade dolorosa. Você sentirá apenas uma leve pressão mecânica natural.'
      }
    ],
    priceEstimate: 'R$ 250 - R$ 600',
    imageUrl: 'https://images.unsplash.com/photo-1579684389782-64d84b5e901d?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'siso',
    name: 'Cirurgia do Siso',
    category: 'clinica_geral',
    shortDescription: 'Remoção dos dentes do juízo inclusos ou semi-inclusos com máxima segurança e bem-estar.',
    fullDescription: 'A cirurgia para remoção dos terceiros molares (dentes do siso) é planejada por meio de exames de imagem digitais de alta precisão. Atuamos com técnicas cirúrgicas refinadas que preservam a integridade dos tecidos vizinhos e do nervo alveolar, resultando em um pós-operatório muito mais tranquilo, com menos inchaço e cicatrização acelerada.',
    benefits: [
      'Prevenção do desalinhamento dos dentes vizinhos por empurramento',
      'Fim de inflamações na gengiva de cobertura (pericoronarite) e dores locais',
      'Evita o desenvolvimento de cáries na raiz do dente adjacente pela dificuldade de limpeza',
      'Procedimento realizado com instrumentação de ponta e máximo conforto'
    ],
    indications: [
      'Sisos inclusos, semi-inclusos ou impactados contra os outros dentes',
      'Dores recorrentes no fundo da mandíbula, inchaço gengival ou dificuldade de abertura bucal'
    ],
    contraindications: [
      'Indivíduos em estado de saúde geral debilitado sem liberação médica.'
    ],
    averageTime: 'De 30 a 60 minutos por dente',
    recovery: 'Inchaço normal que atinge o pico em 48 horas. Recomenda-se repouso físico por 3 a 5 dias, compressas geladas e dieta estritamente líquida e fria.',
    ctaText: 'Remover Meu Siso sem Trauma',
    faqs: [
      {
        question: 'Preciso tirar os quatro sisos de uma só vez?',
        answer: 'Não necessariamente. A Dra. Claudia avaliará seu caso. É comum remover os dois dentes do mesmo lado (superior e inferior) em uma mesma sessão para que o paciente mastigue do lado oposto durante a cicatrização.'
      }
    ],
    priceEstimate: 'R$ 400 - R$ 900 por elemento',
    imageUrl: 'https://images.unsplash.com/photo-1579684389782-64d84b5e901d?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'fluorterapia',
    name: 'Fluorterapia',
    category: 'clinica_geral',
    shortDescription: 'Remineralização do esmalte dentário e proteção ativa contra lesões de cárie ativa.',
    fullDescription: 'A fluorterapia consiste na aplicação profissional de flúor sob a forma de verniz ou gel de alta concentração. Este tratamento atua diretamente no esmalte dentário, promovendo a reposição mineral de cálcio e fosfato e tornando o dente muito mais resistente contra os ácidos produzidos pelas bactérias causadoras da cárie.',
    benefits: [
      'Remineralização de lesões de cárie em estágio inicial (manchas brancas)',
      'Ação bactericida e redução da sensibilidade dentária ao frio e quente',
      'Proteção contínua e ativa para pacientes com alto risco de cárie',
      'Procedimento extremamente rápido, agradável e preventivo'
    ],
    indications: [
      'Pacientes com sensibilidade dentária no colo dos dentes',
      'Crianças em fase de amadurecimento do esmalte dentário',
      'Indivíduos com alto índice de cáries ou boca seca (xerostomia)'
    ],
    contraindications: [
      'Nenhuma.'
    ],
    averageTime: '15 minutos em consultório',
    recovery: 'Imediata. Evitar apenas a ingestão de líquidos quentes e alimentação sólida por 1 hora após a aplicação.',
    ctaText: 'Agendar Fluorterapia Preventiva',
    faqs: [
      {
        question: 'O flúor faz mal para adultos?',
        answer: 'De forma alguma. O flúor de alta concentração de uso clínico é excelente para adultos, pois fortalece as raízes expostas e previne cáries cervicais.'
      }
    ],
    priceEstimate: 'R$ 100 - R$ 180',
    imageUrl: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&q=80&w=800'
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
    category: 'Invisalign',
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
    category: 'Harmonização Facial',
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
    category: 'Implantes',
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
