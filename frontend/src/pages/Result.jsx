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
    <div className="max-w-3xl mx-auto px-6 py-12">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-8 md:p-12 border border-slate-200/50 text-center relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 p-6 text-indigo-100/40 pointer-events-none">
            <Sparkles size={80} />
        </div>

        <div className="relative z-10">
          <h1 className="text-3xl font-extrabold text-slate-900 mb-3 tracking-tight leading-tight">Your Mindscape Analysis</h1>
          <p className="text-base text-slate-500 max-w-xl mx-auto mb-12 font-light">
            Everything starts with awareness. Here’s a breakdown of the internal and external forces shaping your well-being today.
          </p>

          <div className="grid md:grid-cols-2 gap-10 text-left mb-12">
            {/* Internal Score */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center text-indigo-600">
                    <Brain size={18} />
                  </div>
                  <span className="font-semibold text-slate-800 text-sm tracking-tight">Internal Influence</span>
                </div>
                <span className="text-xl font-bold text-indigo-600">{result.internal_score}%</span>
              </div>
              <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${result.internal_score}%` }}
                  transition={{ duration: 1.2, ease: "easeOut" }}
                  className="h-full bg-indigo-600 rounded-full"
                />
              </div>
              <p className="text-xs text-slate-400 font-light italic">Driven by personal emotions, mindset, and introspection.</p>
            </div>

            {/* External Score */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center text-indigo-600">
                    <Compass size={18} />
                  </div>
                  <span className="font-semibold text-slate-800 text-sm tracking-tight">External Influence</span>
                </div>
                <span className="text-xl font-bold text-indigo-600">{result.external_score}%</span>
              </div>
              <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <motion.div 
                   initial={{ width: 0 }}
                   animate={{ width: `${result.external_score}%` }}
                   transition={{ duration: 1.2, ease: "easeOut", delay: 0.15 }}
                   className="h-full bg-indigo-600 rounded-full"
                />
              </div>
              <p className="text-xs text-slate-400 font-light italic">Driven by environment, community, and worldly events.</p>
            </div>
          </div>

          <div className="text-left bg-[#f5f5f7] p-6 md:p-8 rounded-[20px] mb-8 relative overflow-hidden">
             <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Sparkles size={18} className="text-indigo-600" /> Insight
             </h3>
             <p className="text-base text-slate-700 leading-relaxed font-light relative z-10">
               {result.conclusion}
             </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 border-t border-slate-200/50 pt-8">
            <Link to="/explore" className="btn-primary py-2.5 px-8 text-sm font-semibold w-full sm:w-auto text-center">
              Explore Community Zines
            </Link>
            <Link to="/upload" className="btn-secondary py-2.5 px-8 text-sm font-semibold w-full sm:w-auto text-center">
              Create a Zine
            </Link>
          </div>

          <p className="mt-10 text-[10px] text-slate-400 max-w-xl mx-auto italic leading-relaxed font-light">
            Disclaimer: This analysis is part of a self-reflection platform and is purely for personal insight. It does not constitute a clinical or medical diagnosis. If you are experiencing distress, please consult with a licensed mental health professional.
          </p>
        </div>
      </motion.div>
    </div>
  );
}

export default Result;
