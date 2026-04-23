export type Player = {
  id: number;
  username: string;
  email?: string | null;
  status: 'ONLINE' | 'OFFLINE';
  createdAt: string;
  updatedAt: string;
};

export type LobbyMember = {
  id: number;
  lobbyId: number;
  playerId: number;
  isReady: boolean;
  joinedAt: string;
  player: Player;
};

export type Lobby = {
  id: number;
  lobbyCode: string;
  lobbyName: string;
  hostPlayerId: number;
  hostPlayer: Player;
  gameMode: 'CLASSIC' | 'RANKED' | 'ARCADE' | 'CUSTOM';
  maxPlayers: number;
  status: 'OPEN' | 'FULL' | 'IN_PROGRESS' | 'CLOSED';
  isPrivate: boolean;
  createdAt: string;
  updatedAt: string;
  members: LobbyMember[];
};

export type LobbyEvent = {
  id: string;
  event: string;
  timestamp: string;
  payload: unknown;
};
