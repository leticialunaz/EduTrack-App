const quizService = require('../services/quizService');
const { syncGradesOnce } = require("../services/gradesSyncService");


// recebe as respostas de um aluno, verifica se os dados estão corretos e salva no banco
async function submitAnswers(req, res) {
  try {
    const appUser = req.appUser;

    const { quizId, answers } = req.body;

    const payloadCheck = quizService.validateAnswersPayload(quizId, answers);
    if (!payloadCheck.ok) {
      return res.status(400).json({ error: payloadCheck.error });
    }

    const qid = payloadCheck.quizId;

    const quiz = await quizService.ensureQuizExists(qid);
    if (!quiz) {
      return res.status(400).json({ error: 'quizId inválido (quiz não existe no banco)' });
    }

    const matchCheck = await quizService.validateAnswersMatchQuestions(answers);
    if (!matchCheck.ok) {
      return res.status(400).json({ error: matchCheck.error });
    }

    const attempt = await quizService.getOrCreateAttempt(appUser.id, qid);

    if (attempt.finishedAt) {
      return res.status(409).json({ error: "Questionário já respondido" });
    }

    const saved = await quizService.saveStudentAnswers({
      userId: appUser.id,
      attemptId: attempt.id,
      answers
    });

    await prisma.quizAttempt.update({
      where: { id: attempt.id },
      data: { finishedAt: new Date() }
    });


    return res.status(201).json({
      message: 'Respostas salvas com sucesso',
      total: saved.count,
      attemptId: attempt.id
    });

  } catch (err) {
    console.error('SUBMIT ANSWERS ERROR:', err);
    return res.status(500).json({ error: 'Falha ao salvar respostas', details: err.message });
  }
}

const { getQuizById } = require('../services/quizService');

//busca detalhes de um quiz pelo ID
async function getQuiz(req, res) {
  try {
    const quiz = await getQuizById(req.params.quizId, req.appUser.id);

    if (!quiz) {
      return res.status(404).json({ error: 'Quiz não encontrado' });
    }

    return res.status(200).json(quiz);
  } catch (err) {
    console.error('GET QUIZ ERROR:', err);
    return res.status(500).json({ error: 'Erro ao buscar quiz' });
  }
}

const prisma = require('../prisma/client');

//lista todos os quizzes disponíveis
async function listQuizzes(req, res) {
  const quizzes = await prisma.quiz.findMany({
    select: {
      id: true,
      title: true,
      topic: { select: { name: true } }
    },
    orderBy: [{ topicId: 'asc' }, { id: 'asc' }]
  });

  res.json(quizzes);
}

async function getAnsweredQuizzes(req, res) {
  try {
    const userId = req.appUser.id;

    const attempts = await prisma.quizAttempt.findMany({
      where: {
        userId,
        answers: { some: {} }
      },
      select: 
        { quizId: true },
    });

    const answeredQuizIds = [...new Set(attempts.map(a => a.quizId))];
    return res.json(answeredQuizIds);
  } catch (err) {
    console.error("getAnsweredQuizzes error:", err);
    return res.status(500).json({ error: "Erro ao buscar quizzes respondidos" });
  }
}

module.exports = { submitAnswers, getQuiz, listQuizzes, getAnsweredQuizzes };