import type { Lobby } from '../types/models';
import { StatusBadge } from './StatusBadge';

type LobbyCardProps = {
  lobby: Lobby;
  isSelected: boolean;
  onSelect: (lobby: Lobby) => void;
};

export function LobbyCard({ lobby, isSelected, onSelect }: LobbyCardProps) {
  return (
    <button
      id={`lobby-card-${lobby.id}`}
      onClick={() => onSelect(lobby)}
      className={`card w-full text-left transition hover:border-indigo-500 ${isSelected ? 'border-indigo-400 ring-1 ring-indigo-500/60' : ''}`}
    >
      <div className="mb-2 flex items-center justify-between">
        <div>
          <h4 className="font-semibold">{lobby.lobbyName}</h4>
          <p className="text-xs text-slate-400">Code: {lobby.lobbyCode}</p>
          <p className="text-xs text-slate-400">Mode: {lobby.gameMode}</p>
        </div>
        <StatusBadge status={lobby.status} />
      </div>
      <p className="text-sm text-slate-300">{lobby.members.length}/{lobby.maxPlayers} players</p>
    </button>
  );
}
