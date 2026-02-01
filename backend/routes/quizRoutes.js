const express = require('express');
const router = express.Router();

const { sigaaAuth } = require('../middlewares/sigaaAuth');
const { onlyAluno } = require("../middlewares/onlyAluno");
const { submitAnswers, getQuiz, listQuizzes, getAnsweredQuizzes } = require('../controllers/quizController');

router.get("/answered", sigaaAuth, onlyAluno, getAnsweredQuizzes);

//rota para listar todos os quizzes disponíveis
router.get('/list', sigaaAuth, listQuizzes);

//rota para obter detalhes de um quiz pelo ID
router.get('/:quizId', sigaaAuth, onlyAluno, getQuiz);

//rota para submissão de respostas do quiz
router.post('/answers', sigaaAuth, onlyAluno, submitAnswers);



module.exports = router;
