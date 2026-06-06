import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../api/axiosInstance';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const [formValues, setFormValues] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormValues((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formValues.email || !formValues.password) {
      toast.error('Email and password are required');
      return;
    }

    setLoading(true);

    try {
      const { data } = await api.post('/auth/login', formValues);
      const { token, ...user } = data;
      signIn({ ...user, token });
      toast.success('Logged in successfully');
      navigate('/dashboard', { replace: true });
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Unable to log in');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-10">
      <section className="glass-panel w-full max-w-md rounded-[2rem] p-6 sm:p-8">
        <p className="text-xs uppercase tracking-[0.35em] text-sky-300/80">Welcome back</p>
        <h1 className="mt-2 text-3xl font-semibold text-white">Sign in to your workspace</h1>
        <p className="mt-2 text-sm text-slate-400">Manage your tasks securely with JWT-based authentication.</p>

        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
          <div>
            <label className="label-text" htmlFor="email">
              Email
            </label>
            <input id="email" name="email" type="email" value={formValues.email} onChange={handleChange} className="input-field" placeholder="you@example.com" />
          </div>

          <div>
            <label className="label-text" htmlFor="password">
              Password
            </label>
            <input id="password" name="password" type="password" value={formValues.password} onChange={handleChange} className="input-field" placeholder="Enter your password" />
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? 'Signing in...' : 'Login'}
          </button>
        </form>

        <p className="mt-6 text-sm text-slate-400">
          New here?{' '}
          <Link to="/register" className="font-semibold text-sky-300 hover:text-sky-200">
            Create an account
          </Link>
        </p>
      </section>
    </main>
  );
};

export default Login;