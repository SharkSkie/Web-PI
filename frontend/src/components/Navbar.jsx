import React, { useContext } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Layout, Globe, UploadCloud, ClipboardCheck, Settings, LogOut, User } from 'lucide-react';

function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white/70 backdrop-blur-md border-b border-slate-200/50">
      <nav className="max-w-6xl mx-auto px-6 h-12 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-1.5 group">
          <Layout size={18} className="text-slate-800 group-hover:scale-105 transition-transform" />
          <span className="text-sm font-semibold text-slate-800 tracking-tight">
            MindZine
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-6">
          <NavLink to="/" end className={({ isActive }) => `nav-link flex items-center gap-1.5 ${isActive ? 'active' : ''}`}>
            <Globe size={14} /> Home
          </NavLink>
          <NavLink to="/explore" className={({ isActive }) => `nav-link flex items-center gap-1.5 ${isActive ? 'active' : ''}`}>
            Explore
          </NavLink>
          
          {user ? (
            <>
              <NavLink to="/upload" className={({ isActive }) => `nav-link flex items-center gap-1.5 ${isActive ? 'active' : ''}`}>
                <UploadCloud size={14} /> Upload
              </NavLink>
              <NavLink to="/assessment" className={({ isActive }) => `nav-link flex items-center gap-1.5 ${isActive ? 'active' : ''}`}>
                <ClipboardCheck size={14} /> Assessment
              </NavLink>
              {user.role === 'admin' && (
                <NavLink to="/admin" className={({ isActive }) => `nav-link flex items-center gap-1.5 ${isActive ? 'active' : ''}`}>
                  <Settings size={14} /> Admin
                </NavLink>
              )}
              
              <div className="h-4 w-px bg-slate-200 mx-1"></div>
              
              <div className="flex items-center gap-3 pl-1">
                <div className="flex items-center gap-1.5 text-slate-700 text-sm font-medium">
                  <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                    <User size={12} />
                  </div>
                  <span>{user.name.split(' ')[0]}</span>
                </div>
                <button 
                  onClick={handleLogout} 
                  className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                  title="Logout"
                >
                  <LogOut size={16} />
                </button>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-4 ml-2">
              <Link to="/login" className="text-xs text-slate-600 font-medium hover:text-[#0071e3] transition-colors">
                Sign In
              </Link>
              <Link to="/register" className="btn-primary text-xs py-1.5 px-4 flex items-center gap-1.5">
                Get Started
              </Link>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}

export default Navbar;
