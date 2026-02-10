const express = require("express");
const router = express.Router();
const prisma = require("../prisma/client");
const { sigaaAuth } = require("../middlewares/sigaaAuth");

const multer = require("multer");

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, 
  fileFilter: (req, file, cb) => {
    if (file.mimetype !== "application/pdf") {
      return cb(new Error("Apenas PDF é permitido"));
    }
    cb(null, true);
  },
});

router.post("/accept", sigaaAuth, upload.single("file"), async (req, res) => {
  try {
    //if (!req.file) {
    //  return res.status(400).json({ error: "Arquivo não enviado" });
    //}

    const updatedUser = await prisma.user.update({
      where: { id: req.appUser.id },
      data: {
        consentAccepted: true,
        consentAt: new Date(),
      },
    });
  if (req.file) {
    await prisma.consentFile.upsert({
      where: { userId: req.appUser.id },
      update: {
        filename: req.file.originalname,
        mimeType: req.file.mimetype,
        size: req.file.size,
        data: req.file.buffer,
      },
      create: {
        userId: req.appUser.id,
        filename: req.file.originalname,
        mimeType: req.file.mimetype,
        size: req.file.size,
        data: req.file.buffer,
      },
    });
  }

    return res.json({
      message: "Termo de consentimento aceito",
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        type: updatedUser.type,
        consentAccepted: updatedUser.consentAccepted,
        consentAt: updatedUser.consentAt,
        hasConsentFile: !!req.file || false,
      },
    });
  } catch (err) {
    console.error(err);

    const msg = err?.message || "Erro ao salvar consentimento";
    return res.status(500).json({ error: msg });
  }
});

module.exports = router;