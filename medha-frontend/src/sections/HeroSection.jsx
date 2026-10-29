import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const HeroSection = ({ totalStudents = '140+' }) => {
  return (
    <section className="hero-section journey-hero">
      <div className="journey-hero-sky" aria-hidden="true" />
      <div className="journey-stars" aria-hidden="true"><span /><span /><span /><span /><span /></div>
      <div className="journey-hero-nav-space" />
      <div className="journey-hero-copy">
        <motion.div className="journey-kicker" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .6 }}>
          <span className="journey-kicker-dot" /> YOUR NEXT CHAPTER STARTS HERE
        </motion.div>
        <motion.h1 initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .8, ease: [0.16, 1, 0.3, 1], delay: .08 }}>
          Make room for<br />your <em>aha</em> moment.
        </motion.h1>
        <motion.p initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .7, delay: .2 }}>
          Exams are a destination. Learning is the journey.<br className="journey-desktop-break" />
          MEDHA helps you find your route, one concept at a time.
        </motion.p>
        <motion.div className="journey-actions" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .65, delay: .32 }}>
          <Link className="journey-primary" to="/rtu-exams">Find your study path <span aria-hidden="true">↗</span></Link>
          <Link className="journey-secondary" to="/notes">Explore notes</Link>
        </motion.div>
      </div>
      <div className="journey-mountain-scene" aria-hidden="true">
        <div className="journey-cloud journey-cloud-one" />
        <div className="journey-cloud journey-cloud-two" />
        <svg className="journey-mountains journey-mountains-back" viewBox="0 0 2000 720" preserveAspectRatio="xMidYMax slice">
          <defs><linearGradient id="journeyMountainBack" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#91B6D4"/><stop offset="100%" stopColor="#D5E3EE"/></linearGradient></defs>
          <path d="M0 470 L120 300 L205 350 L330 190 L425 295 L510 245 L640 370 L760 250 L875 325 L1010 180 L1135 320 L1250 255 L1400 380 L1540 230 L1700 355 L1840 270 L2000 400 L2000 720 L0 720Z" fill="url(#journeyMountainBack)" />
          <path d="M0 470 L120 300 L170 350 L205 350 L330 190 L375 260 L425 295 L390 250 L350 270 L330 190 L295 265 L250 315 L205 350 L120 300 L70 390Z" fill="#EDF4F9" opacity=".9"/>
          <path d="M875 325 L1010 180 L1062 270 L1135 320 L1090 260 L1040 282 L1010 180 L975 265 L930 305Z" fill="#F4F8FB" opacity=".9"/>
        </svg>
        <svg className="journey-mountains journey-mountains-front" viewBox="0 0 2000 720" preserveAspectRatio="xMidYMax slice">
          <defs><linearGradient id="journeyMountainFront" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#F9FCFE"/><stop offset="100%" stopColor="#C6D9E8"/></linearGradient></defs>
          <path d="M0 485 L180 380 L300 420 L480 300 L600 405 L735 325 L900 450 L1080 310 L1210 390 L1390 280 L1550 430 L1730 340 L1900 430 L2000 400 L2000 720 L0 720Z" fill="url(#journeyMountainFront)" />
          <path d="M0 485 L180 380 L300 420 L480 300 L530 365 L600 405 L560 355 L515 340 L480 300 L440 365 L370 410 L300 420 L180 380 L120 435Z" fill="#FFFFFF" opacity=".96"/>
          <path d="M0 555 Q380 490 720 555 T1450 548 T2000 540 L2000 720 L0 720Z" fill="#F6FAFD"/>
        </svg>
        <div className="journey-trail" />
        <div className="journey-student"><span className="journey-student-head" /><span className="journey-student-body" /><span className="journey-student-pack" /><span className="journey-student-leg journey-leg-left" /><span className="journey-student-leg journey-leg-right" /></div>
      </div>
      <div className="journey-side-marker" aria-hidden="true"><span className="journey-marker-line" /><span className="journey-marker-spark">✦</span><span className="journey-marker-label">KEEP GOING</span></div>
      <a className="journey-scroll" href="#features" aria-label="Scroll to explore"><span>SCROLL TO EXPLORE</span><i>↓</i></a>
      <div className="journey-student-proof"><span className="journey-proof-dot" /> Join {totalStudents} learners finding their way with MEDHA</div>
    </section>
  );
};

export default HeroSection;
