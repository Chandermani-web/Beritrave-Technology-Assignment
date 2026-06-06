import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  const handleLogout = () => {
    signOut();
    navigate('/login', { replace: true });
  };

  return (
    <header className="glass-panel sticky top-0 z-10 border-x-0 border-t-0">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-sky-300/80">Task Manager</p>
          <h1 className="mt-1 text-xl font-semibold text-white sm:text-2xl">Focused work, clean execution</h1>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden text-right sm:block">
            <p className="text-sm font-medium text-white">{user?.name}</p>
            <p className="text-xs text-slate-400">{user?.email}</p>
          </div>
          <button type="button" onClick={handleLogout} className="btn-ghost text-sm">
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;