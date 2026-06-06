import { useEffect, useState } from 'react';

const defaultForm = {
  title: '',
  description: '',
  status: 'Pending',
};

const TaskForm = ({ open, onClose, onSubmit, initialTask, loading }) => {
  const [formValues, setFormValues] = useState(defaultForm);

  useEffect(() => {
    if (open && initialTask) {
      setFormValues({
        title: initialTask.title || '',
        description: initialTask.description || '',
        status: initialTask.status || 'Pending',
      });
      return;
    }

    if (open) {
      setFormValues(defaultForm);
    }
  }, [open, initialTask]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormValues((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit(formValues);
  };

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-20 flex items-center justify-center bg-slate-950/80 px-4 py-6 backdrop-blur-sm">
      <div className="glass-panel w-full max-w-2xl rounded-[2rem] p-6 sm:p-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-sky-300/80">{initialTask ? 'Edit Task' : 'New Task'}</p>
            <h2 className="mt-2 text-2xl font-semibold text-white">{initialTask ? 'Update the task details' : 'Create a task'}</h2>
          </div>

          <button type="button" onClick={onClose} className="btn-ghost px-4 py-2 text-sm">
            Close
          </button>
        </div>

        <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
          <div>
            <label className="label-text" htmlFor="title">
              Title
            </label>
            <input id="title" name="title" value={formValues.title} onChange={handleChange} className="input-field" placeholder="Write the task title" required />
          </div>

          <div>
            <label className="label-text" htmlFor="description">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formValues.description}
              onChange={handleChange}
              className="input-field min-h-32 resize-none"
              placeholder="Add task details"
            />
          </div>

          <div>
            <label className="label-text" htmlFor="status">
              Status
            </label>
            <select id="status" name="status" value={formValues.status} onChange={handleChange} className="input-field">
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button type="button" onClick={onClose} className="btn-ghost">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? 'Saving...' : initialTask ? 'Update Task' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskForm;