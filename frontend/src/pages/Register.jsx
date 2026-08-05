import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import { motion } from 'framer-motion';
import { UserPlus, Mail, Lock, User as UserIcon, Loader2, Sparkles, Layout, Eye, EyeOff, CheckCircle2, XCircle } from 'lucide-react';

function Register() {
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors] = useState({});

  const getPasswordStrength = (pass) => {
    if (!pass) return { label: '', color: '', width: '0%' };
    let score = 0;
    if (pass.length >= 6) score++;
    if (pass.length >= 10) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;
    if (score <= 1) return { label: 'Weak', color: 'bg-red-500', width: '25%' };
    if (score === 2) return { label: 'Fair', color: 'bg-orange-400', width: '50%' };
    if (score === 3) return { label: 'Good', color: 'bg-yellow-400', width: '75%' };
    return { label: 'Strong', color: 'bg-emerald-500', width: '100%' };
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Full name is required.';
    if (!formData.email.trim()) newErrors.email = 'Email address is required.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Please enter a valid email.';
    if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters.';
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: null }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await register(formData.name, formData.email, formData.password);
      Swal.fire({
        icon: 'success',
        title: 'Account Created! 🎉',
        text: `Welcome to MindZine, ${formData.name}!`,
        timer: 2000,
        showConfirmButton: false,
        toast: true,
        position: 'top-end'
      });
      navigate('/explore');
      const rawError = err.response?.data?.error || err.response?.data?.message || err.message;
      const errMsg = typeof rawError === 'string' ? rawError : 'Could not create account. Please try again.';
      if (errMsg === 'User already exists') {
        setErrors(prev => ({ ...prev, email: 'This email is already registered. Try signing in instead.' }));
        Swal.fire({
          icon: 'info',
          title: 'Email Already Registered',
          html: `<p>An account with <b>${formData.email}</b> already exists.</p><p class="mt-2 text-sm text-slate-500">Try signing in or use a different email address.</p>`,
          confirmButtonText: 'Sign In Instead',
          showCancelButton: true,
          cancelButtonText: 'Use Different Email',
          confirmButtonColor: '#0071e3',
          cancelButtonColor: '#86868b',
        }).then(result => {
          if (result.isConfirmed) navigate('/login');
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Registration Error',
          text: errMsg,
          confirmButtonColor: '#0071e3'
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const strength = getPasswordStrength(formData.password);
  const passwordsMatch = formData.confirmPassword && formData.password === formData.confirmPassword;

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-6 relative py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-[420px] relative z-10"
      >
        <div className="glass-card p-8 md:p-10 border border-slate-200/50 backdrop-blur-xl">
          {/* Header */}
          <div className="flex flex-col items-center mb-8 text-center">
            <div className="w-12 h-12 bg-slate-900 rounded-full flex items-center justify-center text-white mb-4">
              <Layout size={22} />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-1 tracking-tight">Create Account</h2>
            <p className="text-xs text-slate-500 font-light max-w-xs mx-auto">Join MindZine to share your digital zines and track your mental wellness.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            {/* Full Name */}
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 ml-0.5 block">Full Name</label>
              <div className="relative group">
                <UserIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={16} />
                <input
                  type="text"
                  className={`input-field pl-10 text-sm py-2.5 bg-slate-50 ${errors.name ? 'border-red-400 focus:border-red-500' : 'border-slate-200'}`}
                  value={formData.name}
                  onChange={e => handleChange('name', e.target.value)}
                  placeholder="Jane Doe"
                  autoComplete="name"
                />
              </div>
              {errors.name && <p className="text-[10px] text-red-500 mt-1 ml-0.5">{errors.name}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 ml-0.5 block">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={16} />
                <input
                  type="email"
                  className={`input-field pl-10 text-sm py-2.5 bg-slate-50 ${errors.email ? 'border-red-400 focus:border-red-500' : 'border-slate-200'}`}
                  value={formData.email}
                  onChange={e => handleChange('email', e.target.value)}
                  placeholder="jane@example.com"
                  autoComplete="email"
                />
              </div>
              {errors.email && <p className="text-[10px] text-red-500 mt-1 ml-0.5">{errors.email}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 ml-0.5 block">Password</label>
              <div className="relative group">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={16} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  className={`input-field pl-10 pr-10 text-sm py-2.5 bg-slate-50 ${errors.password ? 'border-red-400 focus:border-red-500' : 'border-slate-200'}`}
                  value={formData.password}
                  onChange={e => handleChange('password', e.target.value)}
                  placeholder="••••••••"
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              {/* Strength meter */}
              {formData.password && (
                <div className="mt-2 ml-0.5">
                  <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden">
                    <motion.div
                      animate={{ width: strength.width }}
                      transition={{ duration: 0.3 }}
                      className={`h-full rounded-full ${strength.color}`}
                    />
                  </div>
                  <p className={`text-[9px] mt-0.5 font-medium ${strength.color.replace('bg-', 'text-')}`}>{strength.label} password</p>
                </div>
              )}
              {errors.password && <p className="text-[10px] text-red-500 mt-1 ml-0.5">{errors.password}</p>}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 ml-0.5 block">Confirm Password</label>
              <div className="relative group">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={16} />
                <input
                  type={showConfirm ? 'text' : 'password'}
                  className={`input-field pl-10 pr-10 text-sm py-2.5 bg-slate-50 ${errors.confirmPassword ? 'border-red-400 focus:border-red-500' : formData.confirmPassword && passwordsMatch ? 'border-emerald-400' : 'border-slate-200'}`}
                  value={formData.confirmPassword}
                  onChange={e => handleChange('confirmPassword', e.target.value)}
                  placeholder="••••••••"
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  tabIndex={-1}
                >
                  {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
                {formData.confirmPassword && (
                  <div className="absolute right-9 top-1/2 -translate-y-1/2">
                    {passwordsMatch
                      ? <CheckCircle2 size={14} className="text-emerald-500" />
                      : <XCircle size={14} className="text-red-400" />
                    }
                  </div>
                )}
              </div>
              {errors.confirmPassword && <p className="text-[10px] text-red-500 mt-1 ml-0.5">{errors.confirmPassword}</p>}
              {formData.confirmPassword && passwordsMatch && !errors.confirmPassword && (
                <p className="text-[10px] text-emerald-600 mt-1 ml-0.5">Passwords match ✓</p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="btn-primary w-full py-3 text-base flex items-center justify-center gap-2 group font-medium mt-2"
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="animate-spin" size={18} />
              ) : (
                <Sparkles size={18} className="group-hover:scale-110 transition-transform text-indigo-200" />
              )}
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-200/50 text-center">
            <p className="text-slate-500 text-xs font-light">
              Already have an account?
              <Link to="/login" className="ml-1 text-indigo-600 font-medium hover:underline">Sign In</Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default Register;
