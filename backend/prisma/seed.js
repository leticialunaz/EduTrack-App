const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();


//populando o banco com quizzes, perguntas e respostas do questionário 
const LIKERT = [
  "Discordo totalmente",
  "Discordo",
  "Neutro",
  "Concordo",
  "Concordo totalmente",
];

const BANK = {
  Carreira: {
    "Desenvolvimento de carreira": [
      "Acredito que posso concretizar os meus valores na carreira que escolhi.",
      "Considero que escolhi a melhor área profissional para mim.",
      "O curso em que me encontro foi sobretudo determinado pelas notas de acesso.",
      "Os meus objetivos e metas acadêmicas estão bem definidos.",
      "O meu percurso vocacional está correspondendo às minhas expectativas.",
      "Julgo que o meu curso me permitirá realizar profissionalmente.",
      "Tenho boas competências para a área vocacional que escolhi.",
      "Tenho uma ideia clara daquilo que virei a fazer profissionalmente.",
      "Consigo justificar porque escolhi um curso superior em vez de entrar no mundo de trabalho.",
      "Escolhi o curso que me parece mais de acordo com as minhas aptidões e capacidades.",
      "Procuro atividades extracurriculares relacionadas com o meu curso.",
      "Não sei como encontrar informação sobre os empregos na minha área.",
      "Receio que quando experimentar a carreira/profissão que escolhi, não seja bem sucedido/a.",
      "Os meus gostos pessoais foram decisivos na escolha do meu curso."
    ],
    "Percepção pessoal de competência": [
      "Duvido das minhas capacidades intelectuais.",
      "Para conseguir os mesmos resultados escolares, tenho que me esforçar mais que os meus colegas.",
      "Julgo que sou suficientemente inteligente para concluir o meu curso sem dificuldades.",
      "Não sinto uma correspondência entre o meu nível de investimento e os resultados acadêmicos obtidos.",
      "Consigo habitualmente atingir os objetivos acadêmicos a que me proponho.",
      "Sinto-me preparado/a para as exigências do meu curso.",
      "Tenho boas competências para a área vocacional que escolhi.",
      "Tenho facilidade em lidar com ideias e conceitos abstratos.",
      "Acho que os meus colegas não acreditam nas minhas capacidades.",
      "Sou claro/a na exposição das minhas ideias."
    ],
    "Envolvimento em atividades extracurriculares": [
      "Não interajo com outros colegas da turma.",
      "Encontro-me envolvido/a nas estruturas associativas dos estudantes.",
      "Desconheço o leque de atividades extracurriculares que existem na minha Universidade.",
      "Procuro conviver com os meus colegas fora dos horários das aulas.",
      "Tomo a iniciativa de convidar os meus amigos para sair.",
      "Tenho pouco tempo para me dedicar aos lazeres.",
      "Faço exercício físico com regularidade.",
      "A semana do fera contribuiu para a minha integração acadêmica.",
      "Faço parte de grupos de animação, lazer ou recreio.",
      "Existem múltiplas atividades extracurriculares na instituição de ensino que frequento.",
      "Participo em iniciativas do meu meio estudantil."
    ]
  },

  Estudo: {
    "Métodos de estudo": [
      "Tenho facilidade em redigir os meus relatórios e trabalhos.",
      "Penso que tenho uma boa forma de estudar.",
      "Desconheço os conteúdos das disciplinas que frequento.",
      "Tenho dificuldades em selecionar a bibliografia e os textos de apoio relevantes.",
      "Utilizo a Biblioteca da Faculdade/Universidade.",
      "Não me consigo concentrar numa tarefa durante muito tempo.",
      "Consigo tirar bons apontamentos nas aulas.",
      "Procuro sistematizar/organizar a informação dada nas aulas.",
      "Tenho boas competências de estudo.",
      "Trabalho arduamente nos trabalhos acadêmicos em que me encontre envolvido."
    ],
    "Gestão do tempo": [
      "É difícil entregar os trabalhos nos prazos fixados.",
      "Faço uma gestão eficaz do meu tempo.",
      "Elaboro um plano das coisas a realizar diariamente.",
      "Consigo ter o trabalho escolar sempre em dia.",
      "A minha incapacidade para gerir bem o tempo leva a que tenha más notas.",
      "Sei estabelecer prioridades no que diz respeito à gestão do meu tempo.",
      "Consigo ser eficaz na minha preparação para os exames.",
      "Sou pontual na chegada às aulas."
    ],
    "Realização de exames": [
      "Mantenho-me calmo/a nas situações de avaliação.",
      "Não consigo ter bom aproveitamento nas avaliações.",
      "Os meus pensamentos tornam-se confusos quando estou apresentando um trabalho.",
      "Acho-me mais inseguro/a que os meus colegas nas avaliações acadêmicas.",
      "Na preparação de uma prova penso várias vezes em desistir porque acho que não vou ser capaz.",
      "Diante de um resultado fraco, penso logo que não vou conseguir fazer essa cadeira.",
      "Apesar de me sentir preparado/a, fico ansioso/a nas vésperas de um teste/prova.",
      "Consigo ser eficaz na minha preparação para as avaliações.",
      "A minha ansiedade aumenta na época das avaliações.",
      "Encaro com confiança a realização das avaliações."
    ],
    "Bases de conhecimentos para o curso": [
      "Foi fácil para mim a transição do Ensino Médio para a Universidade em termos de conhecimentos nas disciplinas.",
      "Sinto-me preparado/a para as exigências do meu curso.",
      "Julgo ter os conhecimentos escolares necessários ao sucesso no curso.",
      "Sinto que não tenho bases para frequentar este curso.",
      "Sinto-me mal preparado/a para frequentar este curso.",
      "Tenho falta de bases para algumas disciplinas do curso."
    ]
  },

  Institucional: {
    "Adaptação à instituição": [
      "Mesmo que pudesse não mudaria de Universidade",
      "Faço amigos com facilidade na minha Universidade",
      "Gosto da Universidade que frequento",
      "Conheço bem os serviços existentes na minha Universidade.",
      "Gostaria de concluir o meu curso na instituição que agora frequento.",
      "Sinto que possuo um bom grupo de amigos na Universidade.",
      "A instituição de ensino que frequento não me desperta interesse.",
      "A biblioteca da minha Universidade está bem apetrechada.",
      "Simpatizo com a cidade onde se situa a minha Universidade.",
      "A minha Universidade tem boas infra-estruturas."
    ],
    "Adaptação ao curso": [
      "As matérias das disciplinas parecem-me pouco interessantes.",
      "Sinto-me envolvido/a no curso que frequento.",
      "Olhando para trás, consigo identificar as razões que me levaram a escolher este curso.",
      "Escolhi bem o curso que estou a frequentar.",
      "Não encontro ligação entre as matérias ensinadas e a prática futura da profissão.",
      "Julgo que o meu curso me permitirá realizar profissionalmente.",
      "Existe um ambiente estimulante no curso que frequento.",
      "Julgo haver boa coordenação entre os professores do meu curso.",
      "As disciplinas do meu curso estão bem articuladas entre si.",
      "Sinto-me desiludido/a com o meu curso.",
      "Estou no curso com que sempre sonhei.",
      "O curso que frequento parece-me desorganizado.",
      "Estou satisfeito/a com as disciplinas que neste momento frequento."
    ],
    "Financeiro": [
      "Tenho dificuldade em fazer face às exigências econômicas do meu curso (computadores, rendas, bibliografia, materiais escolares, etc.).",
      "Possuo os recursos econômicos suficientes para acompanhar os meus colegas nas atividades de lazer.",
      "Neste momento, as minhas maiores dificuldades são econômicas.",
      "Tenho que controlar bem as minhas despesas para não piorar as minhas dificuldades econômicas.",
      "Por razões econômicas não participo nas atividades extracurriculares que gostaria.",
      "Tenho dificuldade em gerir o meu dinheiro.",
      "Para fazer face às minhas necessidades gostava de ter um emprego extra.",
      "Não participo em algumas atividades de lazer por falta de dinheiro."
    ],
    "Relacionamento com Professores": [
      "Não me é fácil estabelecer contatos com os professores.",
      "Tenho dificuldades no relacionamento com os professores.",
      "Considero que os meus professores têm poucas qualidades pedagógicas.",
      "Interajo com os professores fora das aulas.",
      "Julgo não poder contar com a ajuda dos meus professores se vier a ter algum problema.",
      "Não tenho problemas em colocar questões ao professor na sala de aula.",
      "Os docentes revelam pouca disponibilidade de tempo para os alunos.",
      "Os professores que tenho gostam de ensinar.",
      "São-me dadas oportunidades para interagir informalmente com os professores.",
      "Sinto-me à vontade para falar dos meus problemas com alguns professores.",
      "Tenho professores excelentes ou mesmo fora de série.",
      "Senti apoio dos professores na minha integração no curso.",
      "O curso que frequento promove a interação entre professores e alunos.",
      "Procuro os professores nos gabinetes para colocar dúvidas."
    ]
  },

  Interpessoal: {
    "Relacionamento com colegas": [
      "Faço amigos com facilidade na minha Universidade.",
      "Os meus colegas têm sido importantes no meu crescimento pessoal.",
      "Relaciono-me com facilidade com colegas do sexo oposto.",
      "Sinto-me mais isolado/a dos outros de algum tempo para cá.",
      "Tenho desenvolvido amizades satisfatórias com os meus colegas de curso.",
      "Tenho-me sentido crítico/a e áspero/a na comunicação com os outros.",
      "Torna-se-me difícil encontrar um colega que me ajude num problema pessoal.",
      "Tenho relações de amizade próximas com colegas de ambos os sexos.",
      "Sou conhecido/a como uma pessoa amigável e simpática.",
      "Procuro conviver com os meus colegas fora dos horários das aulas.",
      "Gosto de conhecer pessoas de culturas diferentes.",
      "As minhas relações de amizade são cada vez mais estáveis, duradouras e independentes.",
      "Não consigo estabelecer relações íntimas com colegas."
    ],
    "Relacionamento com a família": [
      "A minha família reconhece o meu valor e capacidades.",
      "Mantenho um relacionamento afectuoso com a minha família.",
      "Ninguém na minha família partilha as minhas preocupações.",
      "Sei que posso contar com algum familiar em situações de emergência econômica.",
      "Os meus pais incentivam-me nos meus projectos acadêmicos.",
      "Sinto-me bem-vindo/a quando vou a casa.",
      "Tenho alguém na família em que posso confiar os meus problemas mais íntimos.",
      "Preciso de contactar com os meus pais sempre que me sinto desanimado/a ou triste.",
      "Compreendo as opiniões dos meus pais mesmo que sejam contrárias às minhas.",
      "Sinto que a minha família me respeita."
    ]
  },

  Pessoal: {
    "Autonomia pessoal": [
      "Considero-me uma pessoa dependente dos outros.",
      "Duvido das minhas capacidades intelectuais.",
      "Julgo que sou suficientemente inteligente para concluir o meu curso sem dificuldades.",
      "Sinto confiança em mim próprio/a.",
      "Acho-me mais inseguro/a que os meus colegas nas avaliações acadêmicas.",
      "Tenho facilidade em convidar uma pessoa para sair à noite.",
      "Tenho uma ideia clara daquilo que virei a fazer profissionalmente.",
      "Quando conheço novos colegas, não sinto dificuldade em iniciar uma conversa.",
      "Preciso que as pessoas me ajudem a tomar decisões.",
      "Tomo a iniciativa de convidar os meus amigos para sair.",
      "Tenho dificuldades em tomar decisões."
    ],
    "Auto-confiança": [
      "Há situações em que me sinto a perder o controlo.",
      "Consigo habitualmente atingir os objetivos acadêmicos a que me proponho.",
      "Os meus pensamentos tornam-se confusos quando estou a apresentar um trabalho.",
      "Sinto confiança em mim próprio/a.",
      "Sinto-me confiante quando tenho que apresentar um trabalho na aula.",
      "Vivo o meu dia-a-dia com entusiasmo.",
      "Na preparação de um teste penso várias vezes em desistir porque acho que não vou ser capaz.",
      "Gosto de ser quem sou.",
      "Face a um fraco resultado, penso logo que não vou conseguir fazer essa cadeira.",
      "Evito participar nas aulas por não me sentir seguro/a.",
      "Julgo que sou atraente.",
      "Acho que os meus professores não têm grandes expectativas em relação ao meu rendimento."
    ],
    "Bem-estar psicológico": [
      "Apresento oscilações de humor.",
      "Sinto-me triste ou abatido/a.",
      "Sinto-me, ultimamente, desorientado/a e confuso/a.",
      "Nos últimos tempos tornei-me mais pessimista.",
      "Sinto-me em forma e com um bom ritmo de trabalho.",
      "Sou facilmente irritável.",
      "Tenho discutido por tudo e por nada com alguém que me é muito significativo (amigo/a, namorado/a, familiar...).",
      "Tenho momentos de angústia.",
      "Tenho-me sentido crítico/a e áspero/a na comunicação com os outros.",
      "Ultimamente tenho-me sentido cansado/a.",
      "Vivo o meu dia-a-dia com entusiasmo.",
      "Penso em muitas coisas que me põem triste.",
      "Sinto-me às vezes prestes a explodir.",
      "Tenho-me sentido ansioso/a."
    ],
    "Bem-estar físico": [
      "Ando a consumir álcool em demasia.",
      "Sinto cansaço e sonolência durante o dia.",
      "Tenho necessidade de recorrer a fármacos por causa dos meus problemas.",
      "Ultimamente tenho tido diarreias ou problemas gástricos.",
      "Tenho sentido alterações cardíacas.",
      "Tenho-me alimentado em excesso ou insuficientemente.",
      "Durmo o suficiente para me sentir bem pela manhã.",
      "Ando com dores de cabeça.",
      "Sinto-me fisicamente debilitado/a.",
      "Ando a fumar em demasia.",
      "Tenho sentido dificuldades de sono.",
      "Sinto-me uma pessoa doente.",
      "Sinto-me desgastado/a fisicamente após um dia de aulas."
    ]
  }
};

async function ensureTopic(name) {
  return prisma.topic.upsert({
    where: { name },
    update: {},
    create: { name },
  });
}

async function ensureQuiz(title, topicId) {
  const existing = await prisma.quiz.findFirst({
    where: { title, topicId }
  });

  if (existing) return existing;

  return prisma.quiz.create({
    data: { title, topicId }
  });
}


async function createQuestionWithLikert(quizId, text) {
  const question = await prisma.question.create({
    data: { quizId, text },
  });

  await prisma.answer.createMany({
    data: LIKERT.map((t) => ({
      questionId: question.id,
      text: t,
    })),
  });

  return question;
}

async function main() {
  console.log("🌱 Seed: criando topics/quizzes/perguntas/answers...");

  for (const topicName of Object.keys(BANK)) {
    const topic = await ensureTopic(topicName);

    for (const subName of Object.keys(BANK[topicName])) {
      const quizTitle = `Quiz - ${topicName} - ${subName}`;
      const quiz = await ensureQuiz(quizTitle, topic.id);

      const existing = await prisma.question.count({ where: { quizId: quiz.id } });
      if (existing > 0) {
        console.log(`✅ Já existe: ${quizTitle} (pulando)`);
        continue;
      }

      const questions = BANK[topicName][subName];
      for (const qText of questions) {
        await createQuestionWithLikert(quiz.id, qText);
      }

      console.log(`✅ Criado: ${quizTitle} com ${questions.length} perguntas`);
    }
  }

  console.log("🎉 Seed concluído!");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
