import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import { motion } from 'framer-motion';
import { UserPlus, Mail, Lock, User as UserIcon, Loader2, Sparkles, Layout } from 'lucide-react';

function Register() {
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register(formData.name, formData.email, formData.password);
      Swal.fire({
        icon: 'success',
        title: 'Account Created',
        text: 'Welcome to MindZines!',
        timer: 2000,
        showConfirmButton: false,
        toast: true,
        position: 'top-end'
      });
      navigate('/explore');
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Registration Error',
        text: err.response?.data?.error || 'Could not create account. Please try again.',
        confirmButtonColor: '#6366f1'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6 relative py-12">
      {/* Background Decorative Elements */}
      <div className="absolute top-1/4 right-1/4 w-80 h-80 bg-violet-400 rounded-full blur-[120px] opacity-20 animate-pulse"></div>
      <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-indigo-400 rounded-full blur-[120px] opacity-20 animate-pulse delay-1000"></div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-lg relative z-10"
      >
        <div className="glass-card p-10 md:p-14 border-none backdrop-blur-2xl">
          <div className="flex flex-col items-center mb-10 text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-violet-600 to-indigo-500 rounded-2xl flex items-center justify-center text-white shadow-xl mb-6 shadow-violet-200 ring-4 ring-white/50">
               <UserPlus size={32} />
            </div>
            <h2 className="text-3xl font-black text-slate-900 mb-2 leading-tight">Join Our Community</h2>
            <p className="text-slate-500 font-medium max-w-xs mx-auto">Create a profile to start sharing your digital zines and insights.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-5">
              <div className="group">
                 <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1 block">Full Name</label>
                 <div className="relative">
                    <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-violet-500 transition-colors" size={18} />
                    <input 
                      type="text" 
                      className="input-field pl-12 bg-slate-50/50 border-slate-100 hover:bg-white"
                      value={formData.name} 
                      onChange={e => setFormData({...formData, name: e.target.value})} 
                      required 
                      placeholder="Jane Doe"
                    />
                 </div>
              </div>

              <div className="group">
                 <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1 block">Email Address</label>
                 <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-violet-500 transition-colors" size={18} />
                    <input 
                      type="email" 
                      className="input-field pl-12 bg-slate-50/50 border-slate-100 hover:bg-white"
                      value={formData.email} 
                      onChange={e => setFormData({...formData, email: e.target.value})} 
                      required 
                      placeholder="jane@example.com"
                    />
                 </div>
              </div>

              <div className="group">
                 <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1 block">Password</label>
                 <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-violet-500 transition-colors" size={18} />
                    <input 
                      type="password" 
                      className="input-field pl-12 bg-slate-50/50 border-slate-100 hover:bg-white"
                      value={formData.password} 
                      onChange={e => setFormData({...formData, password: e.target.value})} 
                      required 
                      placeholder="••••••••"
                      minLength="6"
                    />
                 </div>
                 <p className="text-[10px] text-slate-400 mt-2 ml-1 italic">Must be at least 6 characters long.</p>
              </div>
            </div>

            <button 
              type="submit" 
              className="btn-primary bg-indigo-600 hover:bg-indigo-700 w-full py-4 text-lg flex items-center justify-center gap-3 shadow-indigo-100 group" 
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <Sparkles size={20} className="group-hover:scale-125 transition-transform" />
              )}
              {loading ? 'Creating Account...' : 'Initialize Profile'}
            </button>
          </form>

          <div className="mt-10 pt-8 border-t border-slate-100/50 text-center">
             <p className="text-slate-500 text-sm">
                Already part of the movement? 
                <Link to="/login" className="ml-2 text-indigo-600 font-bold hover:text-indigo-700 underline underline-offset-4">
                    Sign In
                </Link>
             </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default Register;
