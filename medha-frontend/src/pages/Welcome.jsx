import React, { useState, useEffect, Suspense } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle, Zap, MessageSquare, Brain, Rocket, Layers, Star } from "lucide-react";
import { useTour } from "../context/TourContext";
import SpotlightCard from "../components/UI/SpotlightCard";
import axios from "axios";

const Spline = React.lazy(() => import("@splinetool/react-spline"));

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const Welcome = () => {
  const { startTour } = useTour();
  const [userCount, setUserCount] = useState(null);

  // Fetch real user count
  useEffect(() => {
    const fetchUserCount = async () => {
      try {
        const res = await axios.get(`${BACKEND_URL}/api/users/stats`);
        setUserCount(res.data.totalUsers);
      } catch (err) {
        console.error("Failed to fetch user stats");
      }
    };
    fetchUserCount();
  }, []);

  const features = [
    {
      icon: <Zap size={28} />,
      title: "AI Note Intelligence",
      desc: "Turn messy handwritten notes into structured summaries and study materials in seconds.",
      gradient: "from-amber-400 to-orange-500",
    },
    {
      icon: <Brain size={28} />,
      title: "Smart Exam Prep",
      desc: "AI-generated exam strategies and insights based on your specific university syllabus.",
      gradient: "from-purple-400 to-indigo-500",
    },
    {
      icon: <Layers size={28} />,
      title: "The Archive",
      desc: "Access years of past papers, unit-wise weightage, and solved answers. (Starting with RTU).",
      gradient: "from-emerald-400 to-teal-500",
    },
    {
      icon: <MessageSquare size={28} />,
      title: "24/7 AI Tutor",
      desc: "Stuck at 2 AM? Get instant, accurate explanations for any concept from your own notes.",
      gradient: "from-blue-400 to-cyan-500",
    },
  ];

  const testimonials = [
    {
      name: "Priya Sharma",
      role: "CSE, 3rd Semester",
      text: "MEDHA completely changed how I prepare for exams. The PYQ analysis and AI solutions saved me during my midsems!",
      avatar: "PS",
      uni: "RTU"
    },
    {
      name: "Rohan Verma",
      role: "AIDS, 3rd Semester",
      text: "The AI tutor explains DSA concepts better than YouTube tutorials. I finally understood recursion thanks to MEDHA!",
      avatar: "RV",
      uni: "RTU"
    },
    {
      name: "Ananya Singh",
      role: "CSE, 5th Semester",
      text: "Unit-wise weightage analysis is a game changer. I know exactly what topics to focus on. My grades have improved so much!",
      avatar: "AS",
      uni: "RTU"
    },
  ];

  return (
    <div className="min-h-screen relative overflow-hidden font-sans selection:bg-indigo-500/30 selection:text-indigo-200 aurora-bg">
      
      {/* Background Elements managed by CSS variables in index.css */}
      {/* Additional decorative glows for general theme */}
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-[var(--action-primary)]/10 rounded-full blur-[120px] mix-blend-screen"></div>
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-[var(--accent-secondary)]/10 rounded-full blur-[120px] mix-blend-screen"></div>
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10"></div>
      </div>

      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex flex-col items-center justify-center px-4 pt-32 pb-20">
        <div className="max-w-7xl w-full mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
            
            {/* Left: Copy */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="flex-1 text-center lg:text-left z-10"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel mb-8 border border-[var(--action-primary)]/20 shadow-[0_0_15px_rgba(59,130,246,0.15)]"
              >
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--action-primary)] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-[var(--action-primary)]"></span>
                </span>
                <span className="text-sm font-bold bg-gradient-to-r from-[var(--action-primary)] to-[var(--accent-secondary)] bg-clip-text text-transparent tracking-wide uppercase">
                  The Future of Exam Prep
                </span>
              </motion.div>

              <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black mb-8 leading-[1.1] tracking-tight text-[var(--text-primary)]">
                Conquer <br className="hidden lg:block"/>
                <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent drop-shadow-lg">
                  The Chaos.
                </span>
              </h1>

              <p className="text-xl md:text-2xl text-[var(--text-secondary)] mb-10 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-medium">
                Stop drowning in notes. MEDHA turns your scattered study materials into <span className="text-[var(--action-primary)] font-bold">interactive intelligence</span>. 
                Study materials and exam strategies—powered by AI.
              </p>

              <div className="flex flex-col sm:flex-row gap-5 justify-center lg:justify-start mb-12">
                <Link to="/register">
                  <motion.button
                    data-tour="hero-section"
                    whileHover={{ scale: 1.05, boxShadow: "0 0 30px -5px var(--action-primary)" }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full sm:w-auto px-10 py-5 bg-[var(--text-primary)] text-[var(--bg-primary)] font-bold text-lg rounded-2xl shadow-xl flex items-center justify-center gap-3 transition-all group"
                  >
                    Start Learning Free
                    <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                  </motion.button>
                </Link>
                <Link to="/login">
                  <motion.button
                    whileHover={{ scale: 1.02, backgroundColor: "rgba(255,255,255,0.1)" }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full sm:w-auto px-10 py-5 glass-panel text-[var(--text-primary)] font-bold text-lg rounded-2xl flex items-center justify-center gap-3 transition-all hover:border-[var(--text-primary)]/30"
                  >
                    Login
                  </motion.button>
                </Link>
              </div>

              <div className="flex items-center justify-center lg:justify-start gap-4 text-sm font-semibold text-[var(--text-tertiary)]">
                <div className="flex -space-x-3">
                  {[1,2,3,4].map(i => (
                    <div key={i} className="w-8 h-8 rounded-full bg-[var(--bg-secondary)] border-2 border-[var(--bg-primary)] flex items-center justify-center text-xs overflow-hidden">
                       <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i*123}`} alt="user" />
                    </div>
                  ))}
                </div>
                <p>Trusted by <span className="text-[var(--text-primary)]">{userCount ? `${userCount.toLocaleString()}+` : '...'}</span> students</p>
              </div>
            </motion.div>

            {/* Right: 3D Visual */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="flex-1 relative w-full min-h-[400px] lg:min-h-[550px]"
            >
              <div className="relative z-10 w-full h-full">
                {/* Spline 3D Scene */}
                <div className="w-full h-[400px] lg:h-[550px] rounded-[2rem] overflow-hidden relative">
                  <Suspense
                    fallback={
                      <div className="w-full h-full flex items-center justify-center bg-[var(--bg-tertiary)]/50 rounded-[2rem] border border-[var(--glass-border)]">
                        <div className="flex flex-col items-center gap-4">
                          <div className="w-16 h-16 rounded-full border-4 border-[var(--action-primary)]/30 border-t-[var(--action-primary)] animate-spin" />
                          <span className="text-sm font-semibold text-[var(--text-tertiary)] tracking-wide">Loading 3D Experience...</span>
                        </div>
                      </div>
                    }
                  >
                    <Spline
                      scene="https://prod.spline.design/SfQlIlYycuq8an74/scene.splinecode"
                      style={{ width: "100%", height: "100%" }}
                    />
                  </Suspense>
                </div>

                {/* Cosmic gold glow behind the 3D scene */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[130%] h-[130%] -z-10 rounded-full"
                  style={{
                    background: "radial-gradient(ellipse at center, rgba(251, 191, 36, 0.2) 0%, rgba(245, 158, 11, 0.1) 40%, transparent 70%)",
                    filter: "blur(60px)",
                  }}
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Pain Points Section */}
      <section className="py-24 px-4 bg-[var(--bg-tertiary)]/50 relative border-y border-white/5">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black text-[var(--text-primary)] mb-6">
              Is This Your <span className="decoration-4 underline decoration-red-500/50 text-[var(--text-secondary)]">Reality?</span>
            </h2>
            <p className="text-xl text-[var(--text-tertiary)] font-medium">We know the struggle because we are students too.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: "The Note Chaos", emoji: "🤯", desc: "Hundreds of PDFs, scattered handwritten pages, and zero organization. Finding that one topic takes hours." },
              { title: "Exam Anxiety", emoji: "😰", desc: "The syllabus is huge, time is short, and you have no idea what's actually important for the exam." },
              { title: "Passive Reading", emoji: "😴", desc: "Reading the same page 10 times but remembering nothing. Study burnout hits different at 3 AM." },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="glass-card p-8 rounded-3xl text-center hover:border-red-500/30 transition-all group"
              >
                <div className="text-6xl mb-6 group-hover:scale-110 transition-transform duration-300">{item.emoji}</div>
                <h3 className="text-2xl font-bold text-[var(--text-primary)] mb-3">{item.title}</h3>
                <p className="text-[var(--text-secondary)] leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* The Solution */}
      <section className="py-24 px-4 relative overflow-hidden">
        {/* Background glow for this section */}
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[var(--accent-secondary)]/10 rounded-full blur-[120px] -z-10"></div>

        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between mb-20">
            <div className="max-w-2xl">
              <h2 className="text-4xl md:text-6xl font-black mb-6 leading-tight text-[var(--text-primary)]">
                <span className="text-[var(--text-secondary)]">Enter the </span>
                <span className="bg-gradient-to-r from-[var(--action-primary)] to-[var(--accent-secondary)] bg-clip-text text-transparent">MEDHA Era.</span>
              </h2>
              <p className="text-xl text-[var(--text-tertiary)]">
                A complete ecosystem designed to replace the chaos with clarity. 
                One platform for your entire academic life.
              </p>
            </div>
            <Link to="/register">
              <button className="hidden md:flex items-center gap-2 px-8 py-4 bg-[var(--action-primary)] hover:bg-[var(--action-hover)] text-white rounded-full font-bold transition-all shadow-lg shadow-[var(--action-primary)]/30">
                Get Started Now <ArrowRight size={20}/>
              </button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -10 }}
                className="h-full"
              >
                <SpotlightCard className="h-full p-8 flex flex-col group">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg`}>
                    <div className="text-white">{feature.icon}</div>
                  </div>
                  <h3 className="text-2xl font-bold mb-3 text-[var(--text-primary)]">{feature.title}</h3>
                  <p className="text-[var(--text-secondary)] leading-relaxed text-sm font-medium">{feature.desc}</p>
                </SpotlightCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Deep Dive */}
      <section className="py-32 px-4 bg-[var(--bg-tertiary)]/30 relative">
        <div className="max-w-6xl mx-auto space-y-32">
          
          <FeatureShowcase 
            title="Your Syllabus, Decoded."
            subtitle="INTELLIGENT DASHBOARD"
            desc="Imagine a dashboard that knows your exam dates, tracks your study streaks, and tells you exactly what to study today. It's not magic, it's MEDHA."
            image="https://ik.imagekit.io/ayushrathore1/Medha/Dashboard_ss"
            tags={["Progress Tracking", "Study Streaks", "Daily Goals"]}
            align="right"
          />

          <FeatureShowcase 
            title="The Ultimate Exam Archive."
            subtitle="UNIVERSITY INTEL"
            desc="Stop begging seniors for past papers. Access unit-wise weightage, solved PYQs, and marks distribution. Starting with RTU, but we’re expanding to universities worldwide."
            image="https://ik.imagekit.io/ayushrathore1/Medha/rtuExams_ss.png"
            tags={["Solved Papers", "Mark Distribution", "Unit Analysis"]}
            align="left"
          />


        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-4 bg-[var(--bg-secondary)]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-[var(--text-primary)]">Student Stories</h2>
            <p className="text-[var(--text-tertiary)] mt-4">Real results from real campuses.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((t, i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -5 }}
                className="glass-card p-8 rounded-3xl relative"
              >
                <div className="absolute top-8 right-8 text-[var(--text-primary)]/10"><MessageSquare size={40}/></div>
                <div className="flex gap-1 mb-6">
                  {[...Array(5)].map((_, j) => <Star key={j} size={16} fill="#FBBF24" className="text-amber-400"/>)}
                </div>
                <p className="text-[var(--text-secondary)] font-medium leading-relaxed mb-6 relative z-10">"{t.text}"</p>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-[var(--bg-tertiary)] flex items-center justify-center font-bold text-[var(--text-tertiary)] text-sm border border-white/10">
                    {t.avatar}
                  </div>
                  <div>
                    <div className="font-bold text-[var(--text-primary)]">{t.name}</div>
                    <div className="text-xs font-bold text-[var(--action-primary)]">{t.uni} • {t.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 px-4">
        <div className="max-w-5xl mx-auto bg-[var(--bg-tertiary)] border border-white/10 rounded-2xl sm:rounded-[3rem] p-8 sm:p-12 md:p-24 text-center relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10"></div>
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[var(--action-primary)]/20 blur-[120px] rounded-full"></div>
          
          <div className="relative z-10">
            <h2 className="text-3xl sm:text-4xl md:text-6xl font-black text-[var(--text-primary)] mb-8">
              Your GPA is Waiting.
            </h2>
            <p className="text-xl text-[var(--text-secondary)] mb-10 max-w-2xl mx-auto">
              Join the platform that turns study stress into academic success. 
              The future of learning is here, and it's free.
            </p>
            <Link to="/register">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-12 py-6 bg-[var(--text-primary)] text-[var(--bg-primary)] font-bold text-xl rounded-2xl shadow-xl hover:bg-opacity-90 transition-all inline-flex items-center gap-3"
              >
                Start Your Journey <Rocket size={24} className="text-[var(--action-primary)]"/>
              </motion.button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer Simple */}
      <footer className="py-12 text-center text-[var(--text-tertiary)] text-sm border-t border-white/5">
        <p>© {new Date().getFullYear()} MEDHA AI. Crafted for students, by students.</p>
      </footer>
    </div>
  );
};

const FeatureShowcase = ({ title, subtitle, desc, image, tags, align }) => (
  <div className={`flex flex-col ${align === 'right' ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center gap-16`}>
    <div className="flex-1 w-full relative group perspective-1000">
       <div className={`absolute -inset-4 bg-gradient-to-r from-[var(--action-primary)]/10 to-[var(--accent-secondary)]/10 rounded-[2rem] -rotate-3 group-hover:rotate-0 transition-transform duration-500`}></div>
       <img 
        src={image} 
        alt={title} 
        className="relative w-full rounded-2xl shadow-2xl border border-[var(--glass-border)] transform group-hover:scale-[1.02] transition-transform duration-500"
       />
    </div>
    <div className="flex-1 text-center lg:text-left">
      <span className="text-[var(--action-primary)] font-bold tracking-widest text-sm uppercase mb-4 block">{subtitle}</span>
      <h3 className="text-4xl md:text-5xl font-black text-[var(--text-primary)] mb-6">{title}</h3>
      <p className="text-xl text-[var(--text-secondary)] leading-relaxed mb-8">{desc}</p>
      <div className="flex flex-wrap justify-center lg:justify-start gap-3">
        {tags.map((tag, i) => (
          <span key={i} className="px-4 py-2 bg-[var(--bg-tertiary)] text-[var(--text-secondary)] font-semibold rounded-lg text-sm border border-white/10">
            {tag}
          </span>
        ))}
      </div>
    </div>
  </div>
);

export default Welcome;
