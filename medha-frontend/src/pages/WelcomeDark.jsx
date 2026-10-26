import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Zap, MessageSquare, Brain, Rocket, Layers, Star, Sparkles, BookOpen, Trophy } from "lucide-react";
import axios from "axios";

// Dark Theme Exclusive Components
import MeteorShower from "../components/DarkTheme/MeteorShower";
import GridPattern from "../components/DarkTheme/GridPattern";
import GlowingButton from "../components/DarkTheme/GlowingButton";
import TextReveal, { GradientTextReveal } from "../components/DarkTheme/TextReveal";
import BentoGrid, { BentoCard, BentoCardIcon, BentoCardTitle, BentoCardDescription } from "../components/DarkTheme/BentoGrid";
import SpotlightCard from "../components/UI/SpotlightCard";
import { TiltCard, HoverGlowCard, FloatingElement, PulseRing } from "../components/DarkTheme/HoverEffects";
import { GlowingOrbs } from "../components/DarkTheme/ParticleField";
import AnimatedCounter, { StaggeredList, ScrollProgress, RevealOnScroll } from "../components/DarkTheme/AnimatedElements";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const WelcomeDark = () => {
  const [userCount, setUserCount] = useState(null);

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
      icon: <Zap size={24} />,
      title: "AI Note Intelligence",
      desc: "Transform handwritten chaos into structured brilliance.",
      gradient: "from-amber-500/20 to-orange-500/20",
      hoverGradient: "from-amber-500/30 to-orange-500/30",
      colSpan: 1,
    },
    {
      icon: <Brain size={24} />,
      title: "Smart Exam Prep",
      desc: "AI-generated strategies tailored to your syllabus.",
      gradient: "from-purple-500/20 to-indigo-500/20",
      hoverGradient: "from-purple-500/30 to-indigo-500/30",
      colSpan: 2,
    },
    {
      icon: <Layers size={24} />,
      title: "The Archive",
      desc: "Years of past papers, solved answers, unit-wise weightage.",
      gradient: "from-emerald-500/20 to-teal-500/20",
      hoverGradient: "from-emerald-500/30 to-teal-500/30",
      colSpan: 2,
    },
    {
      icon: <MessageSquare size={24} />,
      title: "24/7 AI Tutor",
      desc: "Instant explanations at 2 AM. Your professor on speed dial.",
      gradient: "from-blue-500/20 to-cyan-500/20",
      hoverGradient: "from-blue-500/30 to-cyan-500/30",
      colSpan: 1,
    },
  ];

  const stats = [
    { label: "Active Students", value: userCount || "1000+", icon: <Trophy size={20} /> },
    { label: "Notes Processed", value: "50K+", icon: <BookOpen size={20} /> },
    { label: "Questions Answered", value: "100K+", icon: <Sparkles size={20} /> },
  ];

  return (
    <div className="min-h-screen bg-[#020617] text-white overflow-hidden">
      {/* Scroll Progress Bar */}
      <ScrollProgress />
      
      {/* Background Effects */}
      <MeteorShower count={20} />
      <GridPattern />
      <GlowingOrbs />
      
      {/* Additional Gradient Orbs */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-violet-600/20 rounded-full blur-[120px]" />
        <div className="absolute top-3/4 left-1/2 w-[300px] h-[300px] bg-cyan-600/15 rounded-full blur-[100px]" />
      </div>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4 pt-20">
        <div className="max-w-6xl w-full mx-auto text-center relative z-10">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500" />
            </span>
            <span className="text-sm font-medium text-blue-300">Premium Dark Experience</span>
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-5xl md:text-7xl lg:text-8xl font-black mb-6 leading-[1.05] tracking-tight"
          >
            <TextReveal 
              text="Study Smarter." 
              className="block text-white"
              delay={0.5}
            />
            <GradientTextReveal 
              text="Score Higher."
              className="block mt-2"
              gradient="from-blue-400 via-violet-400 to-cyan-400"
            />
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
            className="text-xl md:text-2xl text-slate-400 max-w-3xl mx-auto mb-12 leading-relaxed"
          >
            The AI-powered platform that transforms your notes into 
            <span className="text-blue-400 font-semibold"> interactive intelligence</span>.
            Built for students who refuse to settle.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
          >
            <Link to="/register">
              <GlowingButton variant="primary" size="lg">
                Get Started Free
                <ArrowRight size={20} />
              </GlowingButton>
            </Link>
            <Link to="/login">
              <GlowingButton variant="secondary" size="lg">
                Login
              </GlowingButton>
            </Link>
          </motion.div>

          {/* Stats with Animated Counters */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.8 }}
            className="flex flex-wrap justify-center gap-8 md:gap-12"
          >
            {stats.map((stat, i) => (
              <TiltCard key={i} maxTilt={8}>
                <HoverGlowCard 
                  className="px-8 py-6"
                  glowColor={i === 0 ? "rgba(59, 130, 246, 0.4)" : i === 1 ? "rgba(139, 92, 246, 0.4)" : "rgba(6, 182, 212, 0.4)"}
                >
                  <div className="text-center relative">
                    <div className="absolute -top-2 -right-2">
                      <PulseRing className="w-4 h-4" color={i === 0 ? "rgba(59, 130, 246, 0.5)" : i === 1 ? "rgba(139, 92, 246, 0.5)" : "rgba(6, 182, 212, 0.5)"} />
                    </div>
                    <div className="flex items-center justify-center gap-2 text-blue-400 mb-1">
                      <FloatingElement duration={2 + i * 0.5} distance={5}>
                        {stat.icon}
                      </FloatingElement>
                      <span className="text-2xl md:text-3xl font-bold text-white">
                        {typeof stat.value === 'number' ? (
                          <AnimatedCounter value={stat.value} duration={2} />
                        ) : stat.value}
                      </span>
                    </div>
                    <span className="text-sm text-slate-500">{stat.label}</span>
                  </div>
                </HoverGlowCard>
              </TiltCard>
            ))}
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.5 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="w-6 h-10 rounded-full border-2 border-white/20 flex items-start justify-center p-2"
          >
            <motion.div className="w-1 h-3 bg-white/50 rounded-full" />
          </motion.div>
        </motion.div>
      </section>

      {/* Features Bento Grid */}
      <section className="relative py-32 px-4">
        <div className="max-w-6xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-black mb-4">
              <GradientTextReveal 
                text="Everything You Need"
                gradient="from-white via-blue-200 to-white"
              />
            </h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              One platform. Infinite possibilities. Built for the modern student.
            </p>
          </motion.div>

          <StaggeredList staggerDelay={0.15}>
            <BentoGrid>
              {features.map((feature, i) => (
                <TiltCard key={i} maxTilt={5}>
                  <BentoCard 
                    colSpan={feature.colSpan}
                    gradient={feature.gradient}
                    hoverGradient={feature.hoverGradient}
                  >
                    <BentoCardIcon>
                      <FloatingElement duration={3} distance={3}>
                        <div className="text-white">{feature.icon}</div>
                      </FloatingElement>
                    </BentoCardIcon>
                    <BentoCardTitle>{feature.title}</BentoCardTitle>
                    <BentoCardDescription>{feature.desc}</BentoCardDescription>
                  </BentoCard>
                </TiltCard>
              ))}
            </BentoGrid>
          </StaggeredList>
        </div>
      </section>

      {/* Product Preview */}
      <section className="relative py-32 px-4 overflow-hidden">
        <div className="max-w-6xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            {/* Glow behind image */}
            <div className="absolute inset-0 bg-gradient-to-t from-blue-500/20 to-violet-500/20 blur-[100px] -z-10" />
            
            <SpotlightCard className="p-2 md:p-4" spotlightColor="rgba(59, 130, 246, 0.2)">
              <img
                src="https://ik.imagekit.io/ayushrathore1/Medha/Dashboard_ss"
                alt="MEDHA Dashboard"
                className="w-full rounded-2xl"
              />
            </SpotlightCard>
          </motion.div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative py-32 px-4">
        <div className="max-w-4xl mx-auto relative z-10">
          <SpotlightCard className="p-12 md:p-20 text-center" spotlightColor="rgba(139, 92, 246, 0.2)">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-6xl font-black mb-6">
                <TextReveal text="Ready to Transform" className="block" />
                <GradientTextReveal 
                  text="Your Grades?"
                  className="block mt-2"
                  gradient="from-violet-400 via-pink-400 to-violet-400"
                />
              </h2>
              <p className="text-xl text-slate-400 mb-10 max-w-xl mx-auto">
                Join thousands of students already using MEDHA to ace their exams.
              </p>
              <Link to="/register">
                <GlowingButton variant="primary" size="xl">
                  Start Your Journey
                  <Rocket size={24} />
                </GlowingButton>
              </Link>
            </motion.div>
          </SpotlightCard>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative py-12 text-center text-slate-500 text-sm border-t border-white/5">
        <p>© {new Date().getFullYear()} MEDHA AI. Crafted for students, by students.</p>
      </footer>
    </div>
  );
};

export default WelcomeDark;
