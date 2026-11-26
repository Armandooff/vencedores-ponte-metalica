import type { Atleta, BancoDados, Evento, Noticia } from "./types";

const atletas: Atleta[] = [];

const noticias: Noticia[] = [
  {
    id: "not-001",
    titulo: "Inscrições abertas para a temporada 2026",
    resumo:
      "A nova turma do Vencedores da Ponte Metálica está recebendo inscrições de crianças e jovens da comunidade.",
    conteudo:
      "Estão abertas as inscrições para a temporada 2026 do projeto Vencedores da Ponte Metálica. As vagas são gratuitas e destinadas a crianças e jovens a partir dos 7 anos, com prioridade para famílias da Praia de Iracema e entorno.\n\nPara se inscrever, basta criar sua conta na área do atleta e preencher o cadastro completo. Menores de 18 anos precisam da autorização e dos dados de um responsável.\n\nOs treinos acontecem aos sábados pela manhã, na Praia de Iracema, com acompanhamento técnico e atividades de educação e cidadania.",
    categoria: "Aviso",
    imagem: "/img/noticia-trofeu.jpg",
    autor: "Equipe Vencedores",
    publicada: true,
    destaque: true,
    publicadoEm: "2026-11-10",
  },
  {
    id: "not-002",
    titulo: "Treino de sábado confirmado na Praia de Iracema",
    resumo:
      "Turmas iniciante e intermediária se encontram às 7h, em frente à Ponte dos Ingleses. Leve água e protetor solar.",
    conteudo:
      "O treino deste sábado está confirmado! As turmas iniciante e intermediária se encontram às 7h, na Praia de Iracema, em frente à Ponte dos Ingleses.\n\nA recomendação é chegar 15 minutos antes, levar água, protetor solar e roupa de banho. O projeto oferece pranchas e coletes durante a atividade.\n\nEm caso de chuva forte ou condições ruins de mar, o treino será remarcado e avisaremos por aqui e no Instagram.",
    categoria: "Treino",
    imagem: "/img/noticia-treino.jpg",
    autor: "Coordenação técnica",
    publicada: true,
    destaque: true,
    publicadoEm: "2026-11-15",
  },
  {
    id: "not-003",
    titulo: "Atletas do projeto brilham no circuito cearense",
    resumo:
      "Nossos atletas representaram Iracema em mais uma etapa do circuito estadual de bodyboard.",
    conteudo:
      "Fim de semana de muita onda e aprendizado para a nossa equipe. Atletas do Vencedores da Ponte Metálica participaram de mais uma etapa do circuito cearense de bodyboard e representaram Iracema com garra e respeito dentro e fora da água.\n\nMais do que resultados, o que fica é a evolução de cada um: a confiança de entrar no mar, a torcida da família na areia e o companheirismo entre a galera.\n\nSeguimos treinando forte. Vem aí a próxima etapa!",
    categoria: "Competição",
    imagem: "/img/noticia-podio.jpg",
    autor: "Equipe Vencedores",
    publicada: true,
    destaque: false,
    publicadoEm: "2026-10-28",
  },
  {
    id: "not-004",
    titulo: "Novas pranchas e coletes chegam ao projeto",
    resumo:
      "Doações garantiram equipamentos novos para as turmas iniciantes e intermediárias.",
    conteudo:
      "Com o apoio de parceiros e amigos do projeto, recebemos um novo lote de pranchas de bodyboard, coletes e acessórios de segurança.\n\nOs equipamentos serão usados nas aulas das turmas iniciante e intermediária, permitindo que mais crianças entrem na água com segurança e conforto.\n\nQuer contribuir? Fale com a gente pelo Instagram: toda ajuda vira onda no mar de Iracema.",
    categoria: "Notícia",
    imagem: "/img/noticia-equipamentos.jpg",
    autor: "Equipe Vencedores",
    publicada: true,
    destaque: false,
    publicadoEm: "2026-10-05",
  },
  {
    id: "not-005",
    titulo: "Encontro de famílias celebra a comunidade na orla",
    resumo:
      "Atletas, responsáveis e voluntários viveram um dia de esporte, convivência e cuidado com a praia.",
    conteudo:
      "No último domingo, atletas, famílias e voluntários se reuniram na Praia de Iracema para um dia de esporte, convivência e cuidado com a orla.\n\nAlém das atividades na areia, a ação reforçou o que ensinamos dentro do projeto: cuidar do mar e da comunidade é parte de ser atleta.\n\nObrigado a cada pessoa que dedicou a manhã de domingo para deixar a nossa praia melhor.",
    categoria: "Comunidade",
    imagem: "/img/noticia-comunidade.jpg",
    autor: "Equipe Vencedores",
    publicada: true,
    destaque: false,
    publicadoEm: "2026-09-21",
  },
  {
    id: "not-006",
    titulo: "Calendário de treinos de dezembro",
    resumo:
      "Confira as datas das últimas atividades do ano e do encerramento da temporada.",
    conteudo:
      "Em dezembro teremos treinos especiais de encerramento da temporada, com presença das famílias e uma confraternização na praia.\n\nO calendário completo será publicado na agenda da área do atleta. Fique de olho!",
    categoria: "Aviso",
    imagem: "/img/ponte.jpg",
    autor: "Coordenação técnica",
    publicada: false,
    destaque: false,
    publicadoEm: "2026-11-20",
  },
];

const eventos: Evento[] = [
  {
    id: "evt-001",
    titulo: "Treino de bodyboard · Sábado",
    descricao:
      "Fundamentos de posicionamento, remada e segurança no mar. Pranchas e coletes disponíveis no local.",
    data: "2026-11-28",
    hora: "07:00",
    local: "Praia de Iracema — em frente à Ponte dos Ingleses",
    ativo: true,
  },
  {
    id: "evt-002",
    titulo: "Treino livre de bodyboard",
    descricao:
      "Sessão aberta com acompanhamento dos professores e integração entre os atletas.",
    data: "2026-12-05",
    hora: "07:00",
    local: "Praia de Iracema — em frente à Ponte dos Ingleses",
    ativo: true,
  },
  {
    id: "evt-003",
    titulo: "Campeonato interno Vencedores",
    descricao:
      "Competição interna com categorias por faixa de idade. Famílias e comunidade convidadas.",
    data: "2026-12-13",
    hora: "08:00",
    local: "Praia de Iracema — em frente à Ponte dos Ingleses",
    ativo: true,
    categorias: [
      "sub12-feminino",
      "sub12-masculino",
      "sub14-feminino",
      "sub14-masculino",
      "sub16-feminino",
      "sub16-masculino",
      "sub18-feminino",
      "sub18-masculino",
    ],
  },
  {
    id: "evt-004",
    titulo: "Roda de conversa com as famílias",
    descricao:
      "Encontro para alinhar o calendário do próximo ano e ouvir a comunidade.",
    data: "2026-12-20",
    hora: "16:00",
    local: "Sede do projeto — Praia de Iracema",
    ativo: true,
  },
];

export const bancoInicial: BancoDados = {
  atletas,
  noticias,
  eventos,
};
