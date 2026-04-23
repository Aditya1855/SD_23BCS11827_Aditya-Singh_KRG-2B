import { useForm } from 'react-hook-form';
import type { Lobby } from '../types/models';

type FormData = { lobbyName: string; gameMode: Lobby['gameMode']; maxPlayers: number; isPrivate: boolean };

const gameModes: Lobby['gameMode'][] = ['CLASSIC', 'RANKED', 'ARCADE', 'CUSTOM'];

export function CreateLobbyForm({ onSubmit, isLoading }: { onSubmit: (payload: FormData) => void; isLoading: boolean }) {
  const { register, handleSubmit, reset } = useForm<FormData>({
    defaultValues: { lobbyName: 'Squad Lobby', gameMode: 'CLASSIC', maxPlayers: 4, isPrivate: false },
  });

  return (
    <form
      className="card space-y-3"
      onSubmit={handleSubmit((values) => {
        onSubmit({
          ...values,
          lobbyName: values.lobbyName.trim(),
        });
        reset();
      })}
    >
      <h3 className="text-lg font-semibold">Create Lobby</h3>
      <input className="input" placeholder="Lobby name" {...register('lobbyName', { required: true, minLength: 3, maxLength: 40 })} />
      <select className="input" {...register('gameMode', { required: true })}>
        {gameModes.map((mode) => (
          <option key={mode} value={mode}>{mode}</option>
        ))}
      </select>
      <input className="input" type="number" min={2} max={10} {...register('maxPlayers', { valueAsNumber: true })} />
      <label className="flex items-center gap-2 text-sm text-slate-300">
        <input type="checkbox" {...register('isPrivate')} /> Private lobby
      </label>
      <button disabled={isLoading} className="btn bg-indigo-600 text-white">Create Lobby</button>
    </form>
  );
}
