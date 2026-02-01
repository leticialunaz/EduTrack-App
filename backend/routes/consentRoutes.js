const express = require("express");
const router = express.Router();
const prisma = require("../prisma/client");
const { sigaaAuth } = require("../middlewares/sigaaAuth");

// POST /api/consent/accept
router.post("/accept", sigaaAuth, async (req, res) => {
  try {
    const user = await prisma.user.update({
      where: { id: req.appUser.id },
      data: {
        consentAccepted: true,
        consentAt: new Date(),
      },
    });

    res.json({
      message: "Termo de consentimento aceito",
      user,
    });
  } catch (err) {
    res.status(500).json({ error: "Erro ao salvar consentimento" });
  }
});

module.exports = router;
