import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../api/axiosInstance';

const Register = () => {
  const navigate = useNavigate();
  const [formValues, setFormValues] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormValues((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formValues.name || !formValues.email || !formValues.phone || !formValues.password) {
      toast.error('All fields are required');
      return;
    }

    if (formValues.password.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }

    setLoading(true);

    try {
      await api.post('/auth/register', formValues);
      toast.success('Account created. Please log in.');
      navigate('/login', { replace: true });
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Unable to register');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-10">
      <section className="glass-panel w-full max-w-lg rounded-[2rem] p-6 sm:p-8">
        <p className="text-xs uppercase tracking-[0.35em] text-sky-300/80">Get started</p>
        <h1 className="mt-2 text-3xl font-semibold text-white">Create your account</h1>
        <p className="mt-2 text-sm text-slate-400">Register once and manage only your own tasks.</p>

        <form className="mt-8 grid gap-5 sm:grid-cols-2" onSubmit={handleSubmit}>
          <div className="sm:col-span-2">
            <label className="label-text" htmlFor="name">
              Name
            </label>
            <input id="name" name="name" value={formValues.name} onChange={handleChange} className="input-field" placeholder="Your full name" />
          </div>

          <div className="sm:col-span-2">
            <label className="label-text" htmlFor="email">
              Email
            </label>
            <input id="email" name="email" type="email" value={formValues.email} onChange={handleChange} className="input-field" placeholder="you@example.com" />
          </div>

          <div className="sm:col-span-2">
            <label className="label-text" htmlFor="phone">
              Phone Number
            </label>
            <input id="phone" name="phone" value={formValues.phone} onChange={handleChange} className="input-field" placeholder="Phone number" />
          </div>

          <div className="sm:col-span-2">
            <label className="label-text" htmlFor="password">
              Password
            </label>
            <input id="password" name="password" type="password" value={formValues.password} onChange={handleChange} className="input-field" placeholder="Minimum 8 characters" />
          </div>

          <button type="submit" disabled={loading} className="btn-primary sm:col-span-2 w-full">
            {loading ? 'Creating account...' : 'Register'}
          </button>
        </form>

        <p className="mt-6 text-sm text-slate-400">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-sky-300 hover:text-sky-200">
            Login
          </Link>
        </p>
      </section>
    </main>
  );
};

export default Register;