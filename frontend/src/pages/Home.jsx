import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, BookOpen, Heart, ShieldCheck, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

function ParticleCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId;
    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    const particles = [];
    const particleCount = 45;
    const connectionDistance = 110;
    const mouse = { x: null, y: null, radius: 100 };

    class Particle {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.35;
        this.vy = (Math.random() - 0.5) * 0.35;
        this.radius = Math.random() * 1.5 + 0.5;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > width) this.vx = -this.vx;
        if (this.y < 0 || this.y > height) this.vy = -this.vy;

        // Mouse interaction
        if (mouse.x !== null && mouse.y !== null) {
          const dx = this.x - mouse.x;
          const dy = this.y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < mouse.radius) {
            const force = (mouse.radius - dist) / mouse.radius;
            this.x += (dx / dist) * force * 0.8;
            this.y += (dy / dist) * force * 0.8;
          }
        }
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.fill();
      }
    }

    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };

    const handleMouseLeave = () => {
      mouse.x = null;
      mouse.y = null;
    };

    const parent = canvas.parentElement;
    if (parent) {
      parent.addEventListener('mousemove', handleMouseMove);
      parent.addEventListener('mouseleave', handleMouseLeave);
    }

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        p.update();
        p.draw();
      });

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < connectionDistance) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            const alpha = (1 - dist / connectionDistance) * 0.15;
            ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      if (parent) {
        parent.removeEventListener('mousemove', handleMouseMove);
        parent.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-0"
    />
  );
}

function Home() {
  return (
    <div className="space-y-16 pb-20">
      {/* Hero Section - Apple Pro Style */}
      <section className="relative overflow-hidden rounded-[24px] bg-[#000000] px-8 py-28 text-center shadow-lg">
        {/* Animated glowing orbs in the background */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30 z-0">
          <motion.div 
            animate={{
              x: [0, 50, -30, 0],
              y: [0, -50, 30, 0],
              scale: [1, 1.25, 0.9, 1],
            }}
            transition={{
              duration: 12,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute top-1/4 left-1/4 w-72 h-72 bg-blue-500 rounded-full filter blur-[80px] mix-blend-screen"
          />
          <motion.div 
            animate={{
              x: [0, -40, 40, 0],
              y: [0, 60, -40, 0],
              scale: [1, 0.85, 1.15, 1],
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-indigo-500 rounded-full filter blur-[90px] mix-blend-screen"
          />
        </div>

        {/* Subtle, premium grid backdrop overlay */}
        <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#444_1px,transparent_1px),linear-gradient(to_bottom,#444_1px,transparent_1px)] bg-[size:40px_40px] z-0"></div>
        
        {/* Interactive particles mesh */}
        <ParticleCanvas />

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative z-10 max-w-3xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-800 text-zinc-300 text-xs font-medium mb-6 border border-zinc-700">
            <Sparkles size={12} className="text-indigo-400" />
            <span>Redefining Digital Self-Expression</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 leading-tight tracking-tight">
            A Safe Space for Your <br />
            <span className="bg-gradient-to-b from-white to-zinc-400 bg-clip-text text-transparent">Inner Voice.</span>
          </h1>
          <p className="text-lg md:text-xl text-zinc-400 mb-10 max-w-xl mx-auto font-light leading-relaxed">
            Create, share, and reflect. MindZine is a minimalist platform for digital zines and non-clinical mental health insights.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/register" className="btn-primary bg-white text-black hover:bg-zinc-100 px-8 py-3.5 text-base w-full sm:w-auto font-semibold">
              Get Started Free
            </Link>
            <Link to="/explore" className="btn-secondary bg-zinc-900 text-white hover:bg-zinc-800 px-8 py-3.5 text-base w-full sm:w-auto border border-zinc-800 flex items-center justify-center gap-1.5 font-semibold">
              Explore Community <ArrowRight size={16} />
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Features Bento Grid */}
      <section className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-12 space-y-3">
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Crafted for personal growth.</h2>
          <p className="text-slate-500 max-w-lg mx-auto">Explore features designed to let you express your mind without clinical constraints.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          <FeatureCard 
            icon={<BookOpen className="text-indigo-600" size={24} />}
            title="Digital Zines"
            description="Express yourself through self-published digital zines. A beautiful medium for your creativity and raw thoughts."
          />
          <FeatureCard 
            icon={<Heart className="text-pink-500" size={24} />}
            title="Self-Reflection"
            description="Understand your internal and external drivers through our sleek non-clinical self-reflection tool."
          />
          <FeatureCard 
            icon={<ShieldCheck className="text-emerald-500" size={24} />}
            title="Safe & Private"
            description="Your journey is yours. We provide a clean, distraction-free space for introspection without judgment."
          />
        </div>
      </section>

      {/* Secondary Focus Section - Bento Block */}
      <section className="max-w-6xl mx-auto px-6">
        <div className="bg-[#f5f5f7] rounded-[24px] p-8 md:p-16 flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1 space-y-6">
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Beyond just a platform. <br />It's a creative movement.
            </h2>
            <p className="text-slate-500 leading-relaxed font-light">
              We believe that mental health isn't always about a clinical diagnosis. Sometimes, it's just about having a quiet place to breathe and express the colors of your mind.
            </p>
            <ul className="space-y-3 pt-2">
              {['No medical pressure or labels', 'Community-driven creative insights', 'Purely creative and visual expression'].map((item) => (
                <li key={item} className="flex items-center gap-2.5 text-slate-700 text-sm font-medium">
                  <div className="w-5 h-5 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600">
                    <Sparkles size={12} />
                  </div>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="flex-1 w-full flex justify-center">
            <div className="relative w-full max-w-sm aspect-square bg-slate-900 rounded-[20px] flex items-center justify-center overflow-hidden shadow-inner">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/40 to-slate-900 opacity-60"></div>
              <div className="relative z-10 text-white text-center p-8 space-y-4">
                <Sparkles size={48} className="mx-auto text-indigo-400" />
                <p className="text-xl md:text-2xl font-light italic leading-relaxed text-zinc-200">
                  "Mental health is a journey, not a destination."
                </p>
                <div className="w-12 h-0.5 bg-zinc-600 mx-auto rounded-full"></div>
              </div>
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
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="p-8 bg-[#f5f5f7] rounded-[20px] flex flex-col justify-between hover:shadow-md transition-all"
    >
      <div>
        <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center mb-6 shadow-sm">
          {icon}
        </div>
        <h3 className="text-lg font-bold text-slate-900 mb-3 tracking-tight">{title}</h3>
        <p className="text-sm text-slate-500 leading-relaxed font-light">{description}</p>
      </div>
    </motion.div>
  );
}

export default Home;
