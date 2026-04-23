import { api } from './client';
import type { Lobby, LobbyMember } from '../types/models';

export const getLobbies = async () => (await api.get<Lobby[]>('/lobbies')).data;
export const getLobby = async (id: number) => (await api.get<Lobby>(`/lobbies/${id}`)).data;
export const getLobbyByCode = async (code: string) => (await api.get<Lobby>(`/lobbies/code/${code}`)).data;
export const getLobbyMembers = async (id: number) => (await api.get<LobbyMember[]>(`/lobbies/${id}/members`)).data;

export const createLobby = async (payload: {
  hostPlayerId: number;
  lobbyName: string;
  gameMode: Lobby['gameMode'];
  maxPlayers: number;
  isPrivate: boolean;
}) => (await api.post<Lobby>('/lobbies', payload)).data;

export const joinLobby = async (lobbyId: number, playerId: number) =>
  (await api.post<Lobby>(`/lobbies/${lobbyId}/join`, { playerId })).data;

export const leaveLobby = async (lobbyId: number, playerId: number) =>
  (await api.post<Lobby>(`/lobbies/${lobbyId}/leave`, { playerId })).data;

export const setReady = async (lobbyId: number, playerId: number, isReady: boolean) =>
  (await api.post<Lobby>(`/lobbies/${lobbyId}/ready`, { playerId, isReady })).data;

export const startGame = async (lobbyId: number, playerId: number) =>
  (await api.post(`/lobbies/${lobbyId}/start`, { playerId })).data;
