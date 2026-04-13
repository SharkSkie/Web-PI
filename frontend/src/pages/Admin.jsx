import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, CheckCircle, XCircle, FileText, User as UserIcon, Calendar, ArrowUpRight, ShieldCheck } from 'lucide-react';

function Admin() {
  const [zines, setZines] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAdminZines = async () => {
    try {
      const res = await axios.get('/api/admin/zines');
      setZines(res.data);
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: 'error',
        title: 'Fetch Failed',
        text: 'Could not load administrative data.',
        confirmButtonColor: '#6366f1'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminZines();
  }, []);

  const updateZineStatus = async (id, status) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: `Do you want to ${status} this submission?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: status === 'approved' ? '#10b981' : '#ef4444',
      cancelButtonColor: '#64748b',
      confirmButtonText: `Yes, ${status} it!`
    });

    if (result.isConfirmed) {
      try {
        await axios.put(`/api/admin/zines/${id}`, { status });
        Swal.fire({
            title: status === 'approved' ? 'Approved!' : 'Rejected!',
            icon: 'success',
            timer: 1500,
            showConfirmButton: false
        });
        fetchAdminZines(); // refresh list
      } catch (err) {
        console.error(err);
        Swal.fire({
            icon: 'error',
            title: 'Action Failed',
            text: 'There was an error updating the zine status.',
            confirmButtonColor: '#6366f1'
        });
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 space-y-12">
      <div className="glass-card p-10 md:p-12 border-none bg-indigo-900 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 p-12 text-white/5 pointer-events-none">
            <Settings size={200} />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-white/10 text-indigo-300 text-xs font-bold uppercase tracking-wider">
                    <ShieldCheck size={14} /> Administrator Access
                </div>
                <h1 className="text-4xl font-bold leading-tight">Zine Moderation</h1>
                <p className="text-indigo-200 max-w-xl text-lg opacity-80">
                    Review community contributions to ensure MindZines remains a safe, respectful, and creative space for all voices.
                </p>
            </div>
            <div className="flex items-center gap-4">
                <div className="bg-white/10 p-4 rounded-2xl text-center min-w-[120px]">
                    <span className="block text-3xl font-bold">{zines.filter(z => z.status === 'pending').length}</span>
                    <span className="text-xs text-indigo-300 uppercase font-bold tracking-tight">Pending</span>
                </div>
                <div className="bg-white/10 p-4 rounded-2xl text-center min-w-[120px]">
                    <span className="block text-3xl font-bold">{zines.length}</span>
                    <span className="text-xs text-indigo-300 uppercase font-bold tracking-tight">Total</span>
                </div>
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {loading ? (
             Array(3).fill(0).map((_, i) => <div key={i} className="glass-card h-80 animate-pulse bg-slate-100 border-none"></div>)
        ) : (
          <AnimatePresence>
            {zines.map((zine, index) => (
              <motion.div
                key={zine.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                className="glass-card p-8 border-none flex flex-col group relative"
              >
                {/* Status Badge */}
                <div className={`absolute top-6 right-6 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                    zine.status === 'approved' ? 'bg-emerald-100 text-emerald-700' : 
                    zine.status === 'rejected' ? 'bg-red-100 text-red-700' : 
                    'bg-amber-100 text-amber-700'
                }`}>
                    {zine.status}
                </div>

                <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 mb-6 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                  <FileText size={24} />
                </div>
                
                <h3 className="text-xl font-bold text-slate-900 mb-3">{zine.title}</h3>
                <p className="text-slate-500 mb-6 line-clamp-2 text-sm leading-relaxed flex-grow">
                  {zine.description}
                </p>

                <div className="space-y-4 pt-6 border-t border-slate-100">
                    <div className="flex items-center justify-between text-[11px] text-slate-400 font-bold uppercase tracking-tight">
                        <div className="flex items-center gap-1.5">
                            <UserIcon size={12} className="text-slate-300" />
                            {zine.author}
                        </div>
                        <div className="flex items-center gap-1.5">
                            <Calendar size={12} className="text-slate-300" />
                            {new Date(zine.created_at).toLocaleDateString()}
                        </div>
                    </div>
                
                    <div className="flex gap-2">
                        <a 
                            href={zine.file_path} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-slate-50 text-slate-600 text-sm font-bold hover:bg-slate-100 transition-all border border-slate-100"
                        >
                            Review <ArrowUpRight size={14} />
                        </a>
                        
                        {zine.status === 'pending' && (
                            <>
                            <button 
                                onClick={() => updateZineStatus(zine.id, 'approved')} 
                                className="w-10 h-10 flex items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white transition-all shadow-sm"
                                title="Approve"
                            >
                                <CheckCircle size={20} />
                            </button>
                            <button 
                                onClick={() => updateZineStatus(zine.id, 'rejected')} 
                                className="w-10 h-10 flex items-center justify-center rounded-xl bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition-all shadow-sm"
                                title="Reject"
                            >
                                <XCircle size={20} />
                            </button>
                            </>
                        )}
                    </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>

      {!loading && zines.length === 0 && (
        <div className="text-center py-20 bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200">
          <Settings size={48} className="mx-auto text-slate-200 mb-4" />
          <h3 className="text-xl font-bold text-slate-900 mb-2">No zines to manage</h3>
          <p className="text-slate-500">Submissions will appear here for review.</p>
        </div>
      )}
    </div>
  );
}

export default Admin;
