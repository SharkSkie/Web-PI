import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, User as UserIcon, Calendar, ArrowUpRight } from 'lucide-react';

function Explore() {
  const [zines, setZines] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchZines = async () => {
      try {
        const res = await axios.get('/api/zines');
        setZines(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchZines();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-6 space-y-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-3">
          <h1 className="text-3xl font-extrabold text-slate-900 leading-tight tracking-tight">Zine Community</h1>
          <p className="text-base text-slate-500 max-w-2xl font-light">
            Explore digital voices from around the world. These zines are created by individuals for self-expression and reflection.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {loading ? (
          Array(6).fill(0).map((_, i) => <SkeletonCard key={i} />)
        ) : (
          <AnimatePresence>
            {zines.map((zine, index) => (
              <motion.div
                key={zine.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="group glass-card hover:bg-[#f5f5f7] p-8 border border-slate-200/40 flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center text-indigo-600 mb-6 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
                    <FileText size={20} />
                  </div>
                  
                  <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors tracking-tight">
                    {zine.title}
                  </h3>
                  
                  <p className="text-sm text-slate-500 mb-6 line-clamp-3 leading-relaxed font-light">
                    {zine.description}
                  </p>
                </div>

                <div className="space-y-4 pt-6 border-t border-slate-200/50">
                  <div className="flex items-center justify-between text-xs text-slate-400 font-light">
                    <div className="flex items-center gap-1.5">
                       <UserIcon size={12} className="text-slate-500" />
                       <span className="font-medium text-slate-600">{zine.author}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                       <Calendar size={12} />
                       <span>{new Date(zine.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                  
                  <a 
                    href={zine.file_path ? zine.file_path.replace('/upload/', '/upload/fl_attachment/') : '#'} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className={`flex items-center justify-center gap-1.5 w-full py-2.5 rounded-full text-sm font-semibold transition-all border-none ${
                      zine.file_path 
                        ? 'bg-slate-100 text-slate-800 hover:bg-slate-200 cursor-pointer' 
                        : 'bg-slate-50 text-slate-400 cursor-not-allowed'
                    }`}
                    onClick={e => !zine.file_path && e.preventDefault()}
                  >
                    Read Zine <ArrowUpRight size={16} />
                  </a>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>

      {!loading && zines.length === 0 && (
        <div className="text-center py-20 bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200">
          <FileText size={48} className="mx-auto text-slate-300 mb-4" />
          <h3 className="text-xl font-bold text-slate-900 mb-2">No zines published yet</h3>
          <p className="text-slate-500">Be the first to share your voice with the community.</p>
        </div>
      )}
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="glass-card p-8 space-y-6 animate-pulse border-none">
      <div className="w-12 h-12 bg-slate-200 rounded-xl"></div>
      <div className="h-6 bg-slate-200 rounded-lg w-3/4"></div>
      <div className="space-y-3">
        <div className="h-4 bg-slate-100 rounded w-full"></div>
        <div className="h-4 bg-slate-100 rounded w-5/6"></div>
      </div>
      <div className="pt-6 border-t border-slate-100 flex justify-between">
        <div className="h-4 bg-slate-100 rounded w-1/3"></div>
        <div className="h-4 bg-slate-100 rounded w-1/4"></div>
      </div>
      <div className="h-12 bg-slate-100 rounded-xl w-full"></div>
    </div>
  );
}

export default Explore;
