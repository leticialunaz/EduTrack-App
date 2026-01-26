const prisma = require('../prisma/client.js');

async function syncUser(profile) {
    if (!profile?.id || !profile?.name || !profile?.type) {
        throw new Error('Perfil inválido para sincronização');
    }

    const user = await prisma.user.upsert({
        where: { cpf: profile.id },
        update: {
            name: profile.name,
            type: profile.type,
            email: profile.email ?? null
        },
        create: {
            cpf: profile.id,
            name: profile.name,
            type: profile.type,
            email: profile.email ?? null
        }
    });
    return user;
}

module.exports = { syncUser };
