import { useForm } from 'react-hook-form';

type FormData = { username: string; email?: string };

export function CreatePlayerForm({ onSubmit, isLoading }: { onSubmit: (payload: FormData) => void; isLoading: boolean }) {
  const { register, handleSubmit, reset } = useForm<FormData>();

  return (
    <form
      className="card space-y-3"
      onSubmit={handleSubmit((values) => {
        const email = values.email?.trim();
        onSubmit({
          username: values.username.trim(),
          ...(email ? { email } : {}),
        });
        reset();
      })}
    >
      <h3 className="text-lg font-semibold">Create Player</h3>
      <input className="input" placeholder="Username" {...register('username', { required: true })} />
      <input className="input" placeholder="Email (optional)" {...register('email')} />
      <button disabled={isLoading} className="btn bg-indigo-600 text-white">Create Player</button>
    </form>
  );
}
