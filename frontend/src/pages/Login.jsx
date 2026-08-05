import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import { motion } from 'framer-motion';
import { LogIn, Mail, Lock, Loader2, Sparkles, Layout } from 'lucide-react';

function Login() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const userData = await login(formData.email, formData.password);
      const isAdmin = userData && userData.role === 'admin';
      Swal.fire({
        icon: 'success',
        title: isAdmin ? 'sucsessfull login as admin' : 'Welcome Back',
        text: isAdmin ? 'Redirecting to dashboard...' : 'Signing you in...',
        timer: 1500,
        showConfirmButton: false,
        toast: true,
        position: 'top-end'
      });
      if (isAdmin) {
        navigate('/admin');
      } else {
        navigate('/explore');
      }
    } catch (err) {
      const rawError = err.response?.data?.error || err.response?.data?.message || err.message;
      const errMsg = typeof rawError === 'string' ? rawError : 'Invalid email or password.';
      Swal.fire({
        icon: 'error',
        title: 'Authentication Failed',
        text: errMsg,
        confirmButtonColor: '#6366f1'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-6 relative">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[400px] relative z-10"
      >
        <div className="glass-card p-8 md:p-10 border border-slate-200/50 backdrop-blur-xl">
          <div className="flex flex-col items-center mb-8">
            <div className="w-12 h-12 bg-slate-900 rounded-full flex items-center justify-center text-white mb-4">
               <Layout size={22} />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-1 tracking-tight">Sign in to MindZine</h2>
            <p className="text-xs text-slate-500 font-light tracking-normal">Enter your credentials to continue</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-3">
              <div className="relative group">
                 <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 ml-0.5 block">Email Address</label>
                 <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={16} />
                    <input 
                      type="email" 
                      className="input-field pl-10 text-sm py-2.5 bg-slate-50 border-slate-200"
                      value={formData.email} 
                      onChange={e => setFormData({...formData, email: e.target.value})} 
                      required 
                      placeholder="name@company.com"
                    />
                 </div>
              </div>

              <div className="relative group">
                 <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 ml-0.5 block">Password</label>
                 <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={16} />
                    <input 
                      type="password" 
                      className="input-field pl-10 text-sm py-2.5 bg-slate-50 border-slate-200"
                      value={formData.password} 
                      onChange={e => setFormData({...formData, password: e.target.value})} 
                      required 
                      placeholder="••••••••"
                    />
                 </div>
              </div>
            </div>

            <button 
              type="submit" 
              className="btn-primary w-full py-3 text-base flex items-center justify-center gap-2 group font-medium" 
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="animate-spin" size={18} />
              ) : (
                <LogIn size={18} className="group-hover:translate-x-0.5 transition-transform" />
              )}
              {loading ? 'Authenticating...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-200/50 text-center space-y-3">
             <p className="text-slate-500 text-xs font-light">
                Don't have an account? 
                <Link to="/register" className="ml-1 text-indigo-600 font-medium hover:underline">
                    Create Profile
                </Link>
             </p>
             <div className="flex items-center justify-center gap-1.5 text-slate-300">
                <Sparkles size={12} className="text-slate-400" />
                <span className="text-[9px] uppercase font-bold tracking-wider text-slate-400">Self-Expression Hub</span>
                <Sparkles size={12} className="text-slate-400" />
             </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default Login;
