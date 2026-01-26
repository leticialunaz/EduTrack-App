const { getProfile } = require('../services/eurecaAuth');
const { syncUser } = require('../services/studentService');


// autenticação via SIGAA - garante a existência do usuário no banco e adiciona o perfil à requisição
async function sigaaAuth(req, res, next) {
  try {
    const token = req.headers['token-de-autenticacao'];

    if (!token) {
      return res.status(401).json({ error: 'Token não fornecido' });
    }

    const profile = await getProfile(token);

    req.user = profile;

    const appUser = await syncUser(profile);
    req.appUser = appUser;

    req.eurecaToken = token;

    return next();
  } catch (err) {
    console.error('SIGAA AUTH ERROR:', err.response?.status, err.response?.data || err.message);
    return res.status(401).json({ error: 'Token inválido' });
  }
}

module.exports = { sigaaAuth };
