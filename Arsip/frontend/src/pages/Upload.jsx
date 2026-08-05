import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { motion } from 'framer-motion';
import { UploadCloud, FileText, Info, Loader2 } from 'lucide-react';

function Upload() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      Swal.fire({
        icon: 'warning',
        title: 'Missing File',
        text: 'Please select a PDF file to upload.',
        confirmButtonColor: '#6366f1'
      });
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('zine_file', file);

    setLoading(true);
    try {
      await axios.post('/api/zines', formData);
      Swal.fire({
        icon: 'success',
        title: 'Uploaded!',
        text: 'Your zine is currently pending moderator approval.',
        confirmButtonColor: '#6366f1'
      }).then(() => {
        navigate('/explore');
      });
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: 'error',
        title: 'Upload Failed',
        text: err.response?.data?.error || 'There was an error uploading your zine.',
        confirmButtonColor: '#6366f1'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-10 md:p-16 border-none"
      >
        <div className="flex flex-col md:flex-row gap-12">
          <div className="flex-1 space-y-6">
            <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center text-indigo-600">
              <UploadCloud size={32} />
            </div>
            <h2 className="text-3xl font-bold text-slate-900 leading-tight">Share Your Story</h2>
            <p className="text-slate-500 leading-relaxed">
              Upload your digital zine to our community gallery. Express your thoughts, feelings, and artistic vision.
            </p>
            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 flex gap-4">
              <Info className="text-indigo-600 shrink-0" size={20} />
              <p className="text-sm text-slate-600">
                All zines are reviewed by our team to maintain a safe and supportive environment for everyone.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="flex-[1.5] space-y-6">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-semibold text-slate-700 ml-1 mb-2 block">Zine Title</label>
                <input
                  type="text"
                  placeholder="e.g. My Inner World"
                  className="input-field"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-slate-700 ml-1 mb-2 block">Tell us about it</label>
                <textarea
                  placeholder="What is this expression about?"
                  rows="4"
                  className="input-field resize-none leading-relaxed"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                ></textarea>
              </div>
              <div>
                <label className="text-sm font-semibold text-slate-700 ml-1 mb-2 block">PDF File</label>
                <div className="relative group">
                  <input
                    type="file"
                    accept="application/pdf"
                    className="absolute inset-0 opacity-0 w-full h-full cursor-pointer z-10"
                    onChange={handleFileChange}
                    required
                  />
                  <div className={`w-full p-8 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center transition-all ${file ? 'border-indigo-500 bg-indigo-50' : 'border-slate-200 group-hover:border-indigo-300'}`}>
                    <FileText className={`mb-3 ${file ? 'text-indigo-600' : 'text-slate-300'}`} size={32} />
                    <span className={`font-medium ${file ? 'text-indigo-700' : 'text-slate-500'}`}>
                      {file ? file.name : 'Select PDF Zine'}
                    </span>
                    <span className="text-xs text-slate-400 mt-1">Maximum size: 10MB</span>
                  </div>
                </div>
              </div>
            </div>

            <button 
              type="submit" 
              className="btn-primary w-full py-4 text-lg flex items-center justify-center gap-3" 
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  Uploading...
                </>
              ) : (
                'Publish Zine'
              )}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}

export default Upload;
