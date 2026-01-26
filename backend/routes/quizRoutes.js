const express = require('express');
const router = express.Router();

const { sigaaAuth } = require('../middlewares/sigaaAuth');
const { submitAnswers, getQuiz, listQuizzes } = require('../controllers/quizController');

//rota para listar todos os quizzes disponíveis
router.get('/list', sigaaAuth, listQuizzes);

//rota para obter detalhes de um quiz pelo ID
router.get('/:quizId', sigaaAuth, getQuiz);

//rota para submissão de respostas do quiz
router.post('/answers', sigaaAuth, submitAnswers);

module.exports = router;
