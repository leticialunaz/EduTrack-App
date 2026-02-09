const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');

const { sigaaAuth } = require("../middlewares/sigaaAuth");

//rota de login, já com a verificação das credenciais atraves do controller
router.post('/login', authController.login);

//rota para obter os dados do perfil do usuário autenticado
router.get('/profile', sigaaAuth, (req, res) => {
  res.json({
    id: req.appUser.id,
    name: req.appUser.name,
    email: req.appUser.email,
    type: req.appUser.type,
    consentAccepted: req.appUser.consentAccepted,
  });
});

module.exports = router;