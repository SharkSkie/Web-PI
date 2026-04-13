import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Sparkles, Brain, Compass, ArrowRight, ShieldAlert, Loader2 } from 'lucide-react';

function Result() {
  const [searchParams] = useSearchParams();
  const id = searchParams.get('id');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!id) {
      setError(true);
      setLoading(false);
      return;
    }

    const fetchResult = async () => {
      try {
        const res = await axios.get(`/api/questionnaire/result/${id}`);
        setResult(res.data);
      } catch (err) {
        console.error(err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchResult();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="animate-spin text-indigo-600" size={48} />
        <p className="text-slate-500 font-medium animate-pulse">Analyzing your mindscape...</p>
      </div>
    );
  }

  if (error || !result) {
    return (
      <div className="max-w-xl mx-auto text-center py-12 px-6">
        <div className="w-20 h-20 bg-red-50 text-red-600 rounded-3xl flex items-center justify-center mx-auto mb-6">
          <ShieldAlert size={40} />
        </div>
        <h2 className="text-3xl font-bold text-slate-900 mb-4">Result Not Found</h2>
        <p className="text-slate-500 mb-8 leading-relaxed">
          We couldn't retrieve your assessment results. It might have been deleted or the link is incorrect.
        </p>
        <Link to="/assessment" className="btn-primary inline-flex items-center gap-2">
          Take Assessment Again <ArrowRight size={18} />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-10 md:p-16 border-none text-center relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 p-8 text-indigo-100 drop-shadow-sm">
            <Sparkles size={120} />
        </div>

        <div className="relative z-10">
          <h1 className="text-4xl font-bold text-slate-900 mb-4 leading-tight">Your Mindscape Analysis</h1>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto mb-16">
            Everything starts with awareness. Here’s a breakdown of the internal and external forces shaping your well-being today.
          </p>

          <div className="grid md:grid-cols-2 gap-12 text-left mb-16">
            {/* Internal Score */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
                    <Brain size={20} />
                  </div>
                  <span className="font-bold text-slate-800">Internal Influence</span>
                </div>
                <span className="text-2xl font-black text-indigo-600">{result.internal_score}%</span>
              </div>
              <div className="w-full h-4 bg-slate-100 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${result.internal_score}%` }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  className="h-full bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-full shadow-lg shadow-indigo-100"
                />
              </div>
              <p className="text-sm text-slate-500 italic">Driven by personal emotions, mindset, and introspection.</p>
            </div>

            {/* External Score */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-violet-50 rounded-xl flex items-center justify-center text-violet-600">
                    <Compass size={20} />
                  </div>
                  <span className="font-bold text-slate-800">External Influence</span>
                </div>
                <span className="text-2xl font-black text-violet-600">{result.external_score}%</span>
              </div>
              <div className="w-full h-4 bg-slate-100 rounded-full overflow-hidden">
                <motion.div 
                   initial={{ width: 0 }}
                   animate={{ width: `${result.external_score}%` }}
                   transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
                   className="h-full bg-gradient-to-r from-violet-500 to-violet-600 rounded-full shadow-lg shadow-violet-100"
                />
              </div>
                <p className="text-sm text-slate-500 italic">Driven by environment, community, and worldly events.</p>
            </div>
          </div>

          <div className="text-left bg-slate-50 p-8 md:p-12 rounded-[2rem] border border-slate-100 mb-12 relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-100/50 rounded-full -translate-y-16 translate-x-16"></div>
             <h3 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                <Sparkles size={24} className="text-indigo-600" /> Professional Insight
             </h3>
             <p className="text-lg text-slate-700 leading-relaxed relative z-10">
               {result.conclusion}
             </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 border-t border-slate-100 pt-12">
            <Link to="/explore" className="btn-primary py-4 px-10 w-full sm:w-auto">
              Explore Community Zines
            </Link>
            <Link to="/upload" className="btn-secondary py-4 px-10 w-full sm:w-auto bg-slate-100">
              Create a Zine
            </Link>
          </div>

          <p className="mt-12 text-xs text-slate-400 max-w-2xl mx-auto italic leading-loose">
            Disclaimer: This analysis is part of a self-reflection platform and is purely for personal insight. It does not constitute a clinical or medical diagnosis. If you are experiencing distress, please consult with a licensed mental health professional.
          </p>
        </div>
      </motion.div>
    </div>
  );
}

export default Result;
