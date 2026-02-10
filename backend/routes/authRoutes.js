const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');
const prisma = require("../prisma/client");

const { sigaaAuth } = require("../middlewares/sigaaAuth");

//rota de login, já com a verificação das credenciais atraves do controller
router.post('/login', authController.login);

//rota para obter os dados do perfil do usuário autenticado
router.get('/profile', sigaaAuth, async (req, res) => {
    try {
    const file = await prisma.consentFile.findUnique({
      where: { userId: req.appUser.id },
      select: { id: true },
    });

    res.json({
        id: req.appUser.id,
        name: req.appUser.name,
        email: req.appUser.email,
        type: req.appUser.type,
        consentAccepted: req.appUser.consentAccepted,
        hasConsentFile: !!file,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao carregar perfil" });
  }
});

module.exports = router;