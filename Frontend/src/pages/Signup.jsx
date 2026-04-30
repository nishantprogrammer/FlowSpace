import { useState } from 'react';
import { useAuth } from '../hooks/useAuth.js';
import { useNavigate, Link } from 'react-router-dom';

export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState('member');
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(name, email, password, role);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed');
    }
  };

  return (
    <div className="flex min-h-screen w-full bg-bg text-text-primary">
      <div className="hidden lg:flex w-[60%] flex-col justify-center p-24" style={{ backgroundColor: '#0A0A0A', color: '#F0EEE8' }}>
        <h1 className="font-serif text-[52px] leading-tight mb-4">Join Flowspace</h1>
        <p className="text-[#F0EEE8]/45 mb-8 tracking-wide">Built for Ethara AI</p>
        <hr className="border-t border-[rgba(255,255,255,0.1)] w-16 mb-8" />
        <p className="max-w-md text-[#F0EEE8]/70 text-lg leading-relaxed">
          Create an account to start managing your team's tasks with a human, editorial approach.
        </p>
      </div>

      <div className="flex-1 flex flex-col justify-center px-12 sm:px-24 bg-surface border-l border-border">
        <div className="w-full max-w-sm mx-auto">
          <h2 className="text-2xl font-serif mb-8 lg:hidden">Sign up</h2>
          {error && <div className="mb-6 text-danger text-sm border border-danger/20 bg-danger/5 p-3">{error}</div>}
          
          <form onSubmit={handleSubmit} className="space-y-8">
            <div>
              <label className="block text-[11px] font-semibold tracking-widest uppercase text-text-muted mb-2">Full Name</label>
              <input 
                type="text" 
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full bg-transparent border-b border-border-strong pb-2 text-text-primary outline-none focus:border-text-primary transition-colors"
                required
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold tracking-widest uppercase text-text-muted mb-2">Email Address</label>
              <input 
                type="email" 
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full bg-transparent border-b border-border-strong pb-2 text-text-primary outline-none focus:border-text-primary transition-colors"
                required
              />
            </div>
            
            <div>
              <label className="block text-[11px] font-semibold tracking-widest uppercase text-text-muted mb-2">Password</label>
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"} 
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full bg-transparent border-b border-border-strong pb-2 pr-10 text-text-primary outline-none focus:border-text-primary transition-colors"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-0 top-0 bottom-2 flex items-center justify-center text-text-muted hover:text-text-primary transition-colors"
                  tabIndex="-1"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                    {showPassword ? (
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                    ) : (
                      <>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                      </>
                    )}
                  </svg>
                </button>
              </div>
            </div>

            <label className="flex items-center space-x-3 cursor-pointer">
              <input 
                type="checkbox" 
                checked={role === 'admin'}
                onChange={e => setRole(e.target.checked ? 'admin' : 'member')}
                className="accent-text-primary"
              />
              <span className="text-[13px] text-text-muted">Register as Admin</span>
            </label>

            <button type="submit" className="w-full bg-text-primary text-bg py-3 font-medium hover:opacity-90 transition-opacity rounded-[3px]">
              Sign Up
            </button>
          </form>

          <div className="mt-8 text-center">
            <div className="text-sm text-text-muted">
              Already have an account? <Link to="/login" className="text-text-primary border-b border-text-primary pb-0.5">Sign in</Link>
            </div>
          </div>

          <div className="mt-16 text-center text-text-subtle text-[12px]">
            Powered by Ethara AI
          </div>
        </div>
      </div>
    </div>
  );
}
