import type { LobbyEvent } from '../types/models';

export function EventFeed({ events }: { events: LobbyEvent[] }) {
  return (
    <section className="card h-full">
      <h3 className="mb-3 text-lg font-semibold">Live Event Panel</h3>
      {events.length === 0 ? (
        <p className="text-sm text-slate-400">No events yet.</p>
      ) : (
        <div className="space-y-2 text-xs">
          {events.map((item) => (
            <div key={item.id} className="rounded-md border border-slate-700 bg-slate-800/60 p-2">
              <div className="flex justify-between text-slate-300">
                <span className="font-semibold">{item.event}</span>
                <span>{new Date(item.timestamp).toLocaleTimeString()}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
