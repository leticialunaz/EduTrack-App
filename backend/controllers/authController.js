const { syncUser } = require('../services/studentService.js');
const { getToken, getProfile } = require('../services/eurecaAuth.js');

//realiza o login do usuário via SIGAA
async function login(req, res) {
  const { username, password } = req.body;

  try {
    const token = await getToken(username, password);
    const profile = await getProfile(token);
    const user = await syncUser(profile);

    return res.status(200).json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        type: user.type,
        consentAccepted: user.consentAccepted,
      },
      eurecaToken: token
    });

  } catch (error) {
    console.error(error);
    return res.status(401).json({ error: 'Credenciais inválidas ou erro no SIGAA' });
  }
}

//busca os dados do perfil do usuário usando o token fornecido
async function getProfileData(req, res) {
  const token = req.headers['token-de-autenticacao'];

  if (!token) {
    return res.status(401).json({ error: 'Token não fornecido' });
  }

  try {
    const profile = await getProfile(token);
    return res.status(200).json(profile);
  } catch (err) {
    return res.status(401).json({ error: 'Token inválido' });
  }
}

module.exports = { login, getProfileData };