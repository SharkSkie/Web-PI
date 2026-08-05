import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, BookOpen, Heart, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

function Home() {
  return (
    <div className="space-y-24 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-[3rem] bg-slate-900 px-8 py-24 text-center">
        {/* Animated Background blob */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-30 pointer-events-none">
          <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[80%] bg-indigo-600 rounded-full blur-[120px] animate-pulse"></div>
          <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[70%] bg-purple-600 rounded-full blur-[120px] animate-pulse delay-1000"></div>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 max-w-3xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-indigo-300 text-sm font-medium mb-8 border border-white/10">
            <Sparkles size={16} />
            <span>Redefining Digital Self-Expression</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-8 leading-tight">
            A Safe Space for Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-400">Inner Voice.</span>
          </h1>
          <p className="text-xl text-slate-400 mb-12 leading-relaxed">
            Create, share, and reflect. MindZine is a colorful platform for digital zines and non-clinical mental health insights.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/register" className="btn-primary px-10 py-4 text-lg w-full sm:w-auto">
              Get Started Free
            </Link>
            <Link to="/explore" className="btn-secondary bg-white/10 text-white hover:bg-white/20 px-10 py-4 text-lg w-full sm:w-auto border border-white/10">
              Explore Community
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Features Grid */}
      <section className="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-8">
        <FeatureCard 
          icon={<BookOpen className="text-indigo-600" />}
          title="Digital Zines"
          description="Express yourself through self-published digital zines. A medium for your creativity and raw thoughts."
        />
        <FeatureCard 
          icon={<Heart className="text-pink-600" />}
          title="Self-Reflection"
          description="Understand your internal and external drivers through our non-clinical self-reflection tool."
        />
        <FeatureCard 
          icon={<ShieldCheck className="text-emerald-600" />}
          title="Safe & Private"
          description="Your journey is yours. We provide a space for introspection without judgment or diagnosis."
        />
      </section>

      {/* Extra Section */}
      <section className="bg-indigo-50 rounded-[3rem] p-12 md:p-20 flex flex-col md:flex-row items-center gap-12">
        <div className="flex-1 space-y-6">
          <h2 className="text-4xl font-bold text-slate-900 leading-tight">Beyond just a platform, it's a movement.</h2>
          <p className="text-lg text-slate-600">
            We believe that mental health isn't always about a clinical diagnosis. Sometimes, it's just about having a place to breathe and express the colors of your mind.
          </p>
          <ul className="space-y-4">
            {['No medical pressure', 'Community-driven insights', 'Purely creative expression'].map((item) => (
              <li key={item} className="flex items-center gap-3 text-slate-700 font-medium">
                <div className="w-6 h-6 rounded-full bg-indigo-200 flex items-center justify-center text-indigo-700">
                  <Sparkles size={14} />
                </div>
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div className="flex-1 w-full flex justify-center">
            <div className="relative w-full max-w-md aspect-square glass-card bg-indigo-600 flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-600 opacity-50"></div>
                <div className="relative z-10 text-white text-center p-8">
                    <Sparkles size={64} className="mx-auto mb-6 text-indigo-200" />
                    <p className="text-2xl font-bold mb-2 Italics">"Mental health is a journey, not a destination."</p>
                </div>
            </div>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, description }) {
  return (
    <motion.div 
      whileHover={{ y: -10 }}
      className="p-8 bg-white border border-slate-100 rounded-3xl shadow-sm hover:shadow-xl transition-all"
    >
      <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center mb-6">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-4">{title}</h3>
      <p className="text-slate-600 leading-relaxed">{description}</p>
    </motion.div>
  );
}

export default Home;
