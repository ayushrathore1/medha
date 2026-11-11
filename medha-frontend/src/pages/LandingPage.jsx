import React from 'react';

// Styles
import '../styles/globals.css';
import '../styles/LandingPage.css';

// Hook
import { useLiveStats } from '../hooks/useLiveStats';

// Components
import LandingNavbar from '../components/LandingNavbar';
import HeroSection from '../sections/HeroSection';
import PainSection from '../sections/PainSection';
import IdentitySection from '../sections/IdentitySection';
import FeaturesSection from '../sections/FeaturesSection';
import WhySection from '../sections/WhySection';
import SubjectsSection from '../sections/SubjectsSection';
import TestimonialsSection from '../sections/TestimonialsSection';
import CTASection from '../sections/CTASection';
import Footer from '../sections/Footer';
import { usePageSeo } from '../hooks/usePageSeo';

const LandingPage = () => {
  const stats = useLiveStats();

  usePageSeo({
    title: 'Medha Revision | RTU Previous Year Papers, Topics & Notes',
    description:
      'Medha Revision organises the RTU syllabus, past papers and topic-wise revision for B.Tech students. Search any topic or open year-wise PYQs by branch and semester.',
    path: '/',
  });

  return (
    <div className="landing-page">
      <LandingNavbar />
      <HeroSection />
      <PainSection />
      <IdentitySection stats={stats} />
      <FeaturesSection />
      <WhySection stats={stats} />
      <SubjectsSection />
      <TestimonialsSection />
      <CTASection totalStudents={stats.totalStudents} />
      <Footer />
    </div>
  );
};

export default LandingPage;
