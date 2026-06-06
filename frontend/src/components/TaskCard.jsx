const statusStyles = {
  Pending: 'bg-amber-400/15 text-amber-300 ring-1 ring-amber-400/30',
  'In Progress': 'bg-sky-400/15 text-sky-300 ring-1 ring-sky-400/30',
  Completed: 'bg-emerald-400/15 text-emerald-300 ring-1 ring-emerald-400/30',
};

const formatDate = (value) =>
  new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(value));

const TaskCard = ({ task, onEdit, onDelete, onStatusChange, isUpdating = false }) => {
  return (
    <article className="glass-panel group rounded-[1.75rem] p-5 transition hover:-translate-y-0.5 hover:border-cyan-400/30">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-3">
            <h3 className="text-lg font-bold text-white">{task.title}</h3>
            <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[task.status] || statusStyles.Pending}`}>
              {task.status}
            </span>
          </div>
          <p className="max-w-3xl whitespace-pre-line text-sm leading-6 text-slate-300">
            {task.description || 'No description provided.'}
          </p>
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Created {formatDate(task.createdAt)}</p>
        </div>

        <div className="flex flex-col gap-3 sm:min-w-[200px]">
          <select
            className="input-field"
            value={task.status}
            onChange={(event) => onStatusChange(task._id, event.target.value)}
            disabled={isUpdating}
          >
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>

          <div className="flex gap-3">
            <button type="button" className="btn-secondary flex-1" onClick={() => onEdit(task)}>
              Edit
            </button>
            <button
              type="button"
              className="flex-1 rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-2.5 text-sm font-semibold text-rose-200 transition hover:bg-rose-500/20"
              onClick={() => onDelete(task._id)}
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};

export default TaskCard;