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
    <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-lg border-b border-slate-200">
      <nav className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 bg-gradient-to-tr from-indigo-600 to-violet-500 rounded-xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform">
            <Layout size={24} />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
            MindZine
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <NavLink to="/" end className={({ isActive }) => `nav-link flex items-center gap-2 ${isActive ? 'active' : ''}`}>
            <Globe size={18} /> Home
          </NavLink>
          <NavLink to="/explore" className={({ isActive }) => `nav-link flex items-center gap-2 ${isActive ? 'active' : ''}`}>
            Explore
          </NavLink>
          
          {user ? (
            <>
              <NavLink to="/upload" className={({ isActive }) => `nav-link flex items-center gap-2 ${isActive ? 'active' : ''}`}>
                <UploadCloud size={18} /> Upload
              </NavLink>
              <NavLink to="/assessment" className={({ isActive }) => `nav-link flex items-center gap-2 ${isActive ? 'active' : ''}`}>
                <ClipboardCheck size={18} /> Assessment
              </NavLink>
              {user.role === 'admin' && (
                <NavLink to="/admin" className={({ isActive }) => `nav-link flex items-center gap-2 ${isActive ? 'active' : ''}`}>
                  <Settings size={18} /> Admin
                </NavLink>
              )}
              
              <div className="h-6 w-px bg-slate-200 mx-2"></div>
              
              <div className="flex items-center gap-4 pl-2">
                <div className="flex items-center gap-2 text-slate-700 font-medium">
                  <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                    <User size={16} />
                  </div>
                  <span>{user.name.split(' ')[0]}</span>
                </div>
                <button 
                  onClick={handleLogout} 
                  className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                  title="Logout"
                >
                  <LogOut size={20} />
                </button>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-4 ml-4">
              <Link to="/login" className="text-slate-600 font-medium hover:text-indigo-600 transition-colors">
                Sign In
              </Link>
              <Link to="/register" className="btn-primary flex items-center gap-2 scale-90">
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
