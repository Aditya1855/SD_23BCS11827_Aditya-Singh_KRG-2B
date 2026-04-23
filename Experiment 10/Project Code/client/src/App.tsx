import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import {
  createLobby,
  getLobbies,
  getLobby,
  getLobbyByCode,
  joinLobby,
  leaveLobby,
  setReady,
  startGame,
} from './api/lobbies';
import { getPlayers as fetchPlayers, createPlayer as addPlayer } from './api/players';
import { CreateLobbyForm } from './components/CreateLobbyForm';
import { CreatePlayerForm } from './components/CreatePlayerForm';
import { EventFeed } from './components/EventFeed';
import { LobbyCard } from './components/LobbyCard';
import { StatusBadge } from './components/StatusBadge';
import { socket } from './socket/socket';
import type { LobbyEvent, Player } from './types/models';

function App() {
  const queryClient = useQueryClient();
  const [currentPlayerId, setCurrentPlayerId] = useState<number | null>(null);
  const [selectedLobbyId, setSelectedLobbyId] = useState<number | null>(null);
  const [events, setEvents] = useState<LobbyEvent[]>([]);
  const [searchCode, setSearchCode] = useState('');

  const { data: players = [] } = useQuery({ queryKey: ['players'], queryFn: fetchPlayers });
  const { data: lobbies = [] } = useQuery({ queryKey: ['lobbies'], queryFn: getLobbies, refetchInterval: 8000 });
  const { data: selectedLobby } = useQuery({
    queryKey: ['lobby', selectedLobbyId],
    queryFn: () => getLobby(selectedLobbyId as number),
    enabled: !!selectedLobbyId,
  });

  const currentPlayer = useMemo(
    () => players.find((player: Player) => player.id === currentPlayerId) ?? null,
    [players, currentPlayerId],
  );

  const logEvent = (event: string, payload: unknown) => {
    setEvents((prev) => [{ id: `${Date.now()}-${Math.random()}`, event, timestamp: new Date().toISOString(), payload }, ...prev].slice(0, 30));
  };

  useEffect(() => {
    const handlers = ['lobby_created', 'player_joined', 'player_left', 'ready_changed', 'host_changed', 'lobby_updated', 'game_started'] as const;

    handlers.forEach((eventName) => {
      socket.on(eventName, (payload) => {
        logEvent(eventName, payload);
        queryClient.invalidateQueries({ queryKey: ['lobbies'] });
        if (selectedLobbyId) queryClient.invalidateQueries({ queryKey: ['lobby', selectedLobbyId] });
      });
    });

    return () => {
      handlers.forEach((eventName) => socket.off(eventName));
    };
  }, [queryClient, selectedLobbyId]);

  useEffect(() => {
    if (!selectedLobbyId) return;
    socket.emit('join_lobby_room', { lobbyId: selectedLobbyId });
    return () => {
      socket.emit('leave_lobby_room', { lobbyId: selectedLobbyId });
    };
  }, [selectedLobbyId]);

  const createPlayerMutation = useMutation({
    mutationFn: addPlayer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['players'] });
      toast.success('Player created');
    },
    onError: (error: any) => toast.error(error?.response?.data?.message ?? 'Could not create player'),
  });

  const createLobbyMutation = useMutation({
    mutationFn: createLobby,
    onSuccess: (lobby) => {
      setSelectedLobbyId(lobby.id);
      queryClient.invalidateQueries({ queryKey: ['lobbies'] });
      toast.success('Lobby created');
    },
    onError: (error: any) => toast.error(error?.response?.data?.message ?? 'Could not create lobby'),
  });

  const actionMutation = useMutation({
    mutationFn: async ({ type, lobbyId, playerId, isReady }: { type: 'join' | 'leave' | 'ready' | 'start'; lobbyId: number; playerId: number; isReady?: boolean }) => {
      if (type === 'join') return joinLobby(lobbyId, playerId);
      if (type === 'leave') return leaveLobby(lobbyId, playerId);
      if (type === 'ready') return setReady(lobbyId, playerId, !!isReady);
      return startGame(lobbyId, playerId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lobbies'] });
      if (selectedLobbyId) queryClient.invalidateQueries({ queryKey: ['lobby', selectedLobbyId] });
      toast.success('Action completed');
    },
    onError: (error: any) => toast.error(error?.response?.data?.message ?? 'Action failed'),
  });

  const selectedMember = selectedLobby?.members.find((m) => m.playerId === currentPlayerId);
  const canStart = !!selectedLobby && selectedLobby.hostPlayerId === currentPlayerId;

  const searchByCode = async () => {
    const normalizedCode = searchCode.trim().toUpperCase();
    if (!normalizedCode) return;

    try {
      const lobby = await getLobbyByCode(normalizedCode);
      setSelectedLobbyId(lobby.id);
      setSearchCode(lobby.lobbyCode);
      setTimeout(() => {
        document.getElementById(`lobby-card-${lobby.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 50);
      toast.success(`Selected lobby: ${lobby.lobbyName}`);
    } catch {
      toast.error('Lobby code not found');
    }
  };

  return (
    <main className="mx-auto grid min-h-screen max-w-7xl gap-4 p-4 lg:grid-cols-[320px_1fr_320px]">
      <section className="space-y-4">
        <div className="card">
          <h2 className="mb-2 text-xl font-bold">Players</h2>
          <select className="input" value={currentPlayerId ?? ''} onChange={(e) => setCurrentPlayerId(Number(e.target.value) || null)}>
            <option value="">Select current player</option>
            {players.map((player) => <option key={player.id} value={player.id}>{player.username}</option>)}
          </select>
          {currentPlayer && <p className="mt-2 text-xs text-slate-400">Current: {currentPlayer.username}</p>}
        </div>
        <CreatePlayerForm isLoading={createPlayerMutation.isPending} onSubmit={(values) => createPlayerMutation.mutate(values)} />
        <CreateLobbyForm
          isLoading={createLobbyMutation.isPending || !currentPlayerId}
          onSubmit={(values) => currentPlayerId && createLobbyMutation.mutate({ ...values, hostPlayerId: currentPlayerId })}
        />
      </section>

      <section className="space-y-4">
        <div className="card">
          <h2 className="mb-3 text-xl font-bold">Lobby Dashboard</h2>
          <div className="mb-4 flex gap-2">
            <input value={searchCode} onChange={(e) => setSearchCode(e.target.value)} className="input" placeholder="Search lobby by code" />
            <button onClick={searchByCode} className="btn bg-slate-700 text-white">Find</button>
          </div>
          {lobbies.length === 0 ? <p className="text-sm text-slate-400">No lobbies created yet.</p> : (
            <div className="grid gap-3 md:grid-cols-2">
              {lobbies.map((lobby) => (
                <LobbyCard
                  key={lobby.id}
                  lobby={lobby}
                  isSelected={lobby.id === selectedLobbyId}
                  onSelect={(value) => setSelectedLobbyId(value.id)}
                />
              ))}
            </div>
          )}
        </div>

        <div className="card">
          <h2 className="mb-3 text-xl font-bold">Lobby Detail</h2>
          {!selectedLobby ? <p className="text-sm text-slate-400">Select a lobby to view details.</p> : (
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-300">Lobby: <span className="font-semibold text-white">{selectedLobby.lobbyName}</span></p>
                  <p className="text-slate-300">Code: <span className="font-semibold text-white">{selectedLobby.lobbyCode}</span></p>
                  <p className="text-slate-300">Host: <span className="font-semibold text-white">{selectedLobby.hostPlayer.username}</span></p>
                  <p className="text-slate-300">Mode: {selectedLobby.gameMode}</p>
                </div>
                <StatusBadge status={selectedLobby.status} />
              </div>
              <p className="text-slate-300">Players: {selectedLobby.members.length}/{selectedLobby.maxPlayers}</p>
              <div className="space-y-2">
                {selectedLobby.members.map((member) => (
                  <div key={member.id} className="flex items-center justify-between rounded-md border border-slate-700 bg-slate-800/50 p-2">
                    <span>{member.player.username} {member.playerId === selectedLobby.hostPlayerId ? '(Host)' : ''}</span>
                    <span className={member.isReady ? 'text-emerald-300' : 'text-slate-400'}>{member.isReady ? 'Ready' : 'Not Ready'}</span>
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap gap-2 pt-2">
                <button className="btn bg-sky-600 text-white" disabled={!currentPlayerId || actionMutation.isPending} onClick={() => currentPlayerId && actionMutation.mutate({ type: 'join', lobbyId: selectedLobby.id, playerId: currentPlayerId })}>Join Lobby</button>
                <button className="btn bg-slate-700 text-white" disabled={!selectedMember || actionMutation.isPending} onClick={() => currentPlayerId && actionMutation.mutate({ type: 'leave', lobbyId: selectedLobby.id, playerId: currentPlayerId })}>Leave Lobby</button>
                <button className="btn bg-emerald-600 text-white" disabled={!selectedMember || actionMutation.isPending} onClick={() => currentPlayerId && actionMutation.mutate({ type: 'ready', lobbyId: selectedLobby.id, playerId: currentPlayerId, isReady: !selectedMember?.isReady })}>{selectedMember?.isReady ? 'Unready' : 'Ready'}</button>
                <button className="btn bg-amber-600 text-white" disabled={!canStart || actionMutation.isPending} onClick={() => currentPlayerId && actionMutation.mutate({ type: 'start', lobbyId: selectedLobby.id, playerId: currentPlayerId })}>Start Game</button>
              </div>
            </div>
          )}
        </div>
      </section>

      <EventFeed events={events} />
    </main>
  );
}

export default App;
