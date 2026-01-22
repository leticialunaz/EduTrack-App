const express = require('express');

//cria um router
const router = express.Router();    

// rota health de verificaçao do servidor
router.get('/health', (req, res) => {
  return res.status(200).json({status:'OK'});
});

const prisma = require('../prisma/client.js');
// rota de teste de conexao com o banco de dados

router.get('/testdb', (req, res) => {
  prisma.User.count()
    .then(() => {
        return res.status(200).json({status:'banco conectado'});
    }).catch((error) => {
        return res.status(500).json({status:'erro ao conectar no banco', error: error.message});
});
});

module.exports = router;