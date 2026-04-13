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
      await login(formData.email, formData.password);
      Swal.fire({
        icon: 'success',
        title: 'Welcome Back',
        text: 'Signing you in...',
        timer: 1500,
        showConfirmButton: false,
        toast: true,
        position: 'top-end'
      });
      navigate('/explore');
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Authentication Failed',
        text: err.response?.data?.error || 'Invalid email or password.',
        confirmButtonColor: '#6366f1'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6 relative">
      {/* Background Decorative Elements */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-indigo-400 rounded-full blur-[100px] opacity-20 animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-violet-400 rounded-full blur-[100px] opacity-20 animate-pulse delay-700"></div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="glass-card p-10 md:p-12 border-none backdrop-blur-2xl">
          <div className="flex flex-col items-center mb-10">
            <div className="w-16 h-16 bg-gradient-to-tr from-indigo-600 to-violet-500 rounded-2xl flex items-center justify-center text-white shadow-xl mb-6 shadow-indigo-200">
               <Layout size={32} />
            </div>
            <h2 className="text-3xl font-black text-slate-900 mb-2">MindZines</h2>
            <p className="text-slate-500 font-medium tracking-tight">Enter your credentials to continue</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="relative group">
                 <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1 block">Email Address</label>
                 <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
                    <input 
                      type="email" 
                      className="input-field pl-12 bg-slate-50/50 border-slate-100 hover:bg-white"
                      value={formData.email} 
                      onChange={e => setFormData({...formData, email: e.target.value})} 
                      required 
                      placeholder="name@company.com"
                    />
                 </div>
              </div>

              <div className="relative group">
                 <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1 block">Password</label>
                 <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
                    <input 
                      type="password" 
                      className="input-field pl-12 bg-slate-50/50 border-slate-100 hover:bg-white"
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
              className="btn-primary w-full py-4 text-lg flex items-center justify-center gap-3 shadow-indigo-100 group" 
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <LogIn size={20} className="group-hover:translate-x-1 transition-transform" />
              )}
              {loading ? 'Authenticating...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-10 pt-8 border-t border-slate-100/50 text-center space-y-4">
             <p className="text-slate-500 text-sm">
                Don't have an account yet? 
                <Link to="/register" className="ml-2 text-indigo-600 font-bold hover:text-indigo-700 underline underline-offset-4">
                    Create Profile
                </Link>
             </p>
             <div className="flex items-center justify-center gap-2 text-slate-300">
                <Sparkles size={14} />
                <span className="text-[10px] uppercase font-black tracking-widest">Self-Expression Hub</span>
                <Sparkles size={14} />
             </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default Login;
