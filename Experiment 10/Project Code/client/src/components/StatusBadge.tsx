import clsx from 'clsx';
import type { Lobby } from '../types/models';

export function StatusBadge({ status }: { status: Lobby['status'] }) {
  return (
    <span
      className={clsx('rounded-full px-2 py-1 text-xs font-bold', {
        'bg-emerald-600/30 text-emerald-300': status === 'OPEN',
        'bg-amber-600/30 text-amber-300': status === 'FULL',
        'bg-indigo-600/30 text-indigo-300': status === 'IN_PROGRESS',
        'bg-rose-600/30 text-rose-300': status === 'CLOSED',
      })}
    >
      {status}
    </span>
  );
}
