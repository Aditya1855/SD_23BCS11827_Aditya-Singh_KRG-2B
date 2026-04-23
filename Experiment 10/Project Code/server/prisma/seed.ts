import { LobbyStatus, PlayerStatus, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.gameSession.deleteMany();
  await prisma.lobbyMember.deleteMany();
  await prisma.lobby.deleteMany();
  await prisma.player.deleteMany();

  const players = await prisma.$transaction([
    prisma.player.create({ data: { username: 'Nova', email: 'nova@example.com', status: PlayerStatus.ONLINE } }),
    prisma.player.create({ data: { username: 'Blaze', email: 'blaze@example.com', status: PlayerStatus.ONLINE } }),
    prisma.player.create({ data: { username: 'Rogue', email: 'rogue@example.com', status: PlayerStatus.ONLINE } }),
    prisma.player.create({ data: { username: 'Echo', email: 'echo@example.com', status: PlayerStatus.ONLINE } }),
  ]);

  const lobbyA = await prisma.lobby.create({
    data: {
      lobbyCode: 'ALPHA1',
      lobbyName: 'Alpha Squad',
      hostPlayerId: players[0].id,
      gameMode: 'CLASSIC',
      maxPlayers: 4,
      status: LobbyStatus.OPEN,
      isPrivate: false,
    },
  });

  const lobbyB = await prisma.lobby.create({
    data: {
      lobbyCode: 'BETA22',
      lobbyName: 'Rank Grinders',
      hostPlayerId: players[2].id,
      gameMode: 'RANKED',
      maxPlayers: 3,
      status: LobbyStatus.FULL,
      isPrivate: true,
    },
  });

  await prisma.lobbyMember.createMany({
    data: [
      { lobbyId: lobbyA.id, playerId: players[0].id, isReady: true },
      { lobbyId: lobbyA.id, playerId: players[1].id, isReady: false },
      { lobbyId: lobbyB.id, playerId: players[2].id, isReady: true },
      { lobbyId: lobbyB.id, playerId: players[1].id, isReady: true },
      { lobbyId: lobbyB.id, playerId: players[3].id, isReady: true },
    ],
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
