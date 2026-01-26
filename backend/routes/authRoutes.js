const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');

//rota de login, já com a verificação das credenciais atraves do controller
router.post('/login', authController.login);

//rota para obter os dados do perfil do usuário autenticado
router.get('/profile', authController.getProfileData);

module.exports = router;