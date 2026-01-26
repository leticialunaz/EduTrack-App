const prisma = require('../prisma/client.js');

//função para obter o início da semana (segunda-feira) para uma data, limita as tentativas semanais de quiz
function getWeekStart(date = new Date()) {
  const d = new Date(date);
  const day = d.getDay(); 
  const diff = (day === 0 ? -6 : 1 - day); 
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

//função para validar o payload de respostas do quiz
function validateAnswersPayload(quizId, answers) {
  const qid = Number(quizId);

  if (!Number.isInteger(qid)) {
    return { ok: false, error: 'quizId inválido' };
  }

  if (!Array.isArray(answers) || answers.length === 0) {
    return { ok: false, error: 'answers precisa ser um array não vazio' };
  }

  for (const a of answers) {
    if (!Number.isInteger(Number(a.questionId)) || !Number.isInteger(Number(a.answerId))) {
      return { ok: false, error: 'Cada answer precisa ter questionId e answerId numéricos' };
    }
  }

  return { ok: true, quizId: qid };
}

//função para garantir que o quiz existe no banco de dados
async function ensureQuizExists(quizId) {
  const quiz = await prisma.quiz.findUnique({ where: { id: quizId } });
  return quiz;
}

//função para obter ou criar uma tentativa de quiz para o usuário na semana atual
async function getOrCreateAttempt(userId, quizId) {
  const weekStart = getWeekStart();

  const attempt = await prisma.quizAttempt.upsert({
    where: {
      userId_quizId_weekStart: {
        userId,
        quizId,
        weekStart
      }
    },
    update: {},
    create: {
      userId,
      quizId,
      weekStart
    }
  });

  return attempt;
}

//função para validar se as respostas correspondem às perguntas do quiz
async function validateAnswersMatchQuestions(answers) {
  for (const a of answers) {
    const questionId = Number(a.questionId);
    const answerId = Number(a.answerId);

    const found = await prisma.answer.findFirst({
      where: { id: answerId, questionId }
    });

    if (!found) {
      return { ok: false, error: `answerId ${answerId} não pertence à questionId ${questionId}` };
    }
  }
  return { ok: true };
}

//função para salvar as respostas do aluno no banco de dados
async function saveStudentAnswers({ userId, attemptId, answers }) {
  const data = answers.map(a => ({
    questionId: Number(a.questionId),
    answerId: Number(a.answerId),
    userId,
    attemptId,
  }));

  const result = await prisma.studentAnswer.createMany({ data });
  return result; // { count }
}

//função para obter os detalhes de um quiz pelo ID
async function getQuizById(quizId) {
  const qid = Number(quizId);
  if (!Number.isInteger(qid)) return null;

  const quiz = await prisma.quiz.findUnique({
    where: { id: qid },
    include: {
      topic: true,
      questions: {
        orderBy: { id: 'asc' },
        include: {
          answers: { orderBy: { id: 'asc' } }
        }
      }
    }
  });
    return quiz;
}

module.exports = {
  validateAnswersPayload,
  ensureQuizExists,
  getOrCreateAttempt,
  validateAnswersMatchQuestions,
  saveStudentAnswers,
  getQuizById
};
