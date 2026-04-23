import { api } from './client';
import type { Player } from '../types/models';

export const getPlayers = async () => (await api.get<Player[]>('/players')).data;

export const createPlayer = async (payload: { username: string; email?: string }) =>
  (await api.post<Player>('/players', payload)).data;
