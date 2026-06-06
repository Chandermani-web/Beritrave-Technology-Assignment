import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import api from '../api/axiosInstance';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import TaskCard from '../components/TaskCard';
import TaskForm from '../components/TaskForm';

const initialStats = {
  total: 0,
  pending: 0,
  inProgress: 0,
  completed: 0,
};

const Dashboard = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [activeTask, setActiveTask] = useState(null);

  const fetchTasks = async () => {
    setLoading(true);

    try {
      const { data } = await api.get('/tasks');
      setTasks(data);
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Unable to load tasks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const openCreateForm = () => {
    setActiveTask(null);
    setFormOpen(true);
  };

  const openEditForm = (task) => {
    setActiveTask(task);
    setFormOpen(true);
  };

  const closeForm = () => {
    setFormOpen(false);
    setActiveTask(null);
  };

  const submitTask = async (formValues) => {
    setSaving(true);

    try {
      if (activeTask) {
        await api.put(`/tasks/${activeTask._id}`, formValues);
        toast.success('Task updated successfully');
      } else {
        await api.post('/tasks', formValues);
        toast.success('Task created successfully');
      }

      closeForm();
      await fetchTasks();
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Unable to save task');
    } finally {
      setSaving(false);
    }
  };

  const deleteTask = async (taskId) => {
    const confirmed = window.confirm('Delete this task permanently?');

    if (!confirmed) {
      return;
    }

    try {
      await api.delete(`/tasks/${taskId}`);
      toast.success('Task deleted');
      setTasks((current) => current.filter((task) => task._id !== taskId));
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Unable to delete task');
    }
  };

  const changeStatus = async (taskId, status) => {
    try {
      const { data } = await api.patch(`/tasks/${taskId}/status`, { status });
      setTasks((current) => current.map((task) => (task._id === taskId ? data : task)));
      toast.success('Task status updated');
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Unable to update status');
    }
  };

  const stats = tasks.reduce(
    (accumulator, task) => {
      accumulator.total += 1;

      if (task.status === 'Pending') accumulator.pending += 1;
      if (task.status === 'In Progress') accumulator.inProgress += 1;
      if (task.status === 'Completed') accumulator.completed += 1;

      return accumulator;
    },
    { ...initialStats }
  );

  return (
    <div className="min-h-screen">
      <Navbar />

      <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <section className="glass-panel rounded-[2rem] p-6 sm:p-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-sky-300/80">Dashboard</p>
              <h2 className="mt-2 text-3xl font-semibold text-white">Welcome back, {user?.name}</h2>
              <p className="mt-2 max-w-2xl text-sm text-slate-400">
                Track your work, keep your backlog tidy, and update tasks without losing ownership boundaries.
              </p>
            </div>

            <button type="button" onClick={openCreateForm} className="btn-primary">
              Add Task
            </button>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {[
              ['Total Tasks', stats.total],
              ['Pending Tasks', stats.pending],
              ['In Progress', stats.inProgress],
              ['Completed', stats.completed],
            ].map(([label, value]) => (
              <article key={label} className="rounded-3xl border border-white/10 bg-white/5 p-5">
                <p className="text-sm text-slate-400">{label}</p>
                <p className="mt-3 text-3xl font-semibold text-white">{value}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-8">
          <div className="mb-4 flex items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-semibold text-white">Your Tasks</h3>
              <p className="text-sm text-slate-400">Newest tasks appear first.</p>
            </div>

            <button type="button" onClick={fetchTasks} className="btn-ghost">
              Refresh
            </button>
          </div>

          {loading ? (
            <div className="glass-panel rounded-[2rem] p-8 text-center text-slate-300">Loading tasks...</div>
          ) : tasks.length === 0 ? (
            <div className="glass-panel rounded-[2rem] p-10 text-center">
              <h4 className="text-xl font-semibold text-white">No tasks yet</h4>
              <p className="mt-2 text-sm text-slate-400">Create your first task to start tracking work.</p>
              <button type="button" onClick={openCreateForm} className="btn-primary mt-6">
                Add your first task
              </button>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {tasks.map((task) => (
                <TaskCard key={task._id} task={task} onEdit={openEditForm} onDelete={deleteTask} onStatusChange={changeStatus} />
              ))}
            </div>
          )}
        </section>
      </main>

      <TaskForm open={formOpen} onClose={closeForm} onSubmit={submitTask} initialTask={activeTask} loading={saving} />
    </div>
  );
};

export default Dashboard;