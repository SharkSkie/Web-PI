import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, User as UserIcon, Calendar, Eye, X, ExternalLink, Image as ImageIcon, Download } from 'lucide-react';

function Explore() {
  const [zines, setZines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedZine, setSelectedZine] = useState(null);

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

  const isImageFile = (url) => {
    if (!url) return false;
    if (url.startsWith('data:image/')) return true;
    return url.match(/\.(jpeg|jpg|png|webp|gif)($|\?)/i) || (url.includes('/image/upload/') && !url.endsWith('.pdf'));
  };

  const handleDownload = (zine, e) => {
    if (e) e.stopPropagation();
    if (!zine || !zine.file_path) return;

    let downloadUrl = zine.file_path;
    
    // If it's a Cloudinary URL, force attachment mode so browser prompts file download
    if (downloadUrl.includes('cloudinary.com') && downloadUrl.includes('/upload/')) {
      downloadUrl = downloadUrl.replace('/upload/', '/upload/fl_attachment/');
    }

    const cleanTitle = (zine.title || 'zine').replace(/[^a-z0-9]/gi, '_').toLowerCase();
    const isImg = isImageFile(downloadUrl);
    const fileName = `${cleanTitle}${isImg ? '.png' : '.pdf'}`;

    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = fileName;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 space-y-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-3">
          <h1 className="text-3xl font-extrabold text-slate-900 leading-tight tracking-tight">Zine Community</h1>
          <p className="text-base text-slate-500 max-w-2xl font-light">
            Explore digital voices from around the world. Click any zine to read inside the app or download a copy.
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
                    {isImageFile(zine.file_path) ? <ImageIcon size={20} /> : <FileText size={20} />}
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
                  
                  <div className="flex gap-2">
                    <button 
                      onClick={() => zine.file_path && setSelectedZine(zine)}
                      disabled={!zine.file_path}
                      className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-full text-sm font-semibold transition-all border-none ${
                        zine.file_path 
                          ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md shadow-indigo-100 cursor-pointer' 
                          : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                      }`}
                    >
                      <Eye size={16} /> Read
                    </button>

                    <button
                      onClick={(e) => handleDownload(zine, e)}
                      disabled={!zine.file_path}
                      className="px-4 py-2.5 rounded-full bg-slate-100 text-slate-700 hover:bg-slate-200 hover:text-slate-900 text-sm font-semibold transition-all flex items-center gap-1.5"
                      title="Download Zine"
                    >
                      <Download size={16} />
                    </button>
                  </div>
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

      {/* IN-APP READER MODAL */}
      <AnimatePresence>
        {selectedZine && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-md flex items-center justify-center p-4 md:p-8"
            onClick={() => setSelectedZine(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-5xl h-[85vh] flex flex-col overflow-hidden border border-slate-200"
            >
              {/* Modal Header */}
              <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
                    {isImageFile(selectedZine.file_path) ? <ImageIcon size={20} /> : <FileText size={20} />}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-base leading-tight">{selectedZine.title}</h3>
                    <p className="text-xs text-slate-500 font-light">By {selectedZine.author}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleDownload(selectedZine)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white text-xs font-bold transition-all"
                    title="Download Copy"
                  >
                    <Download size={14} /> Download
                  </button>

                  {!selectedZine.file_path.startsWith('data:') && (
                    <a
                      href={selectedZine.file_path}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-all"
                      title="Open link"
                    >
                      <ExternalLink size={18} />
                    </a>
                  )}
                  <button
                    onClick={() => setSelectedZine(null)}
                    className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-all"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>

              {/* Modal Viewer Content */}
              <div className="flex-1 bg-slate-900/5 overflow-auto flex items-center justify-center p-4">
                {isImageFile(selectedZine.file_path) ? (
                  <img
                    src={selectedZine.file_path}
                    alt={selectedZine.title}
                    className="max-h-full max-w-full object-contain rounded-xl shadow-md"
                  />
                ) : (
                  <object
                    data={selectedZine.file_path}
                    type="application/pdf"
                    className="w-full h-full rounded-xl border-none shadow-inner bg-white"
                  >
                    <embed
                      src={selectedZine.file_path}
                      type="application/pdf"
                      className="w-full h-full rounded-xl"
                    />
                  </object>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
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
