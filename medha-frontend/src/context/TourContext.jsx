import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

// Feature flag to enable/disable tour functionality
const TOUR_ENABLED = import.meta.env.VITE_ENABLE_TOUR === 'true';

const TourContext = createContext();

// Disabled tour hook - returns no-op functions when tour is disabled
const disabledTour = {
  isTourActive: false,
  isGuestMode: false,
  currentStep: 0,
  tourSteps: [],
  startTour: () => {},
  endTour: () => {},
  nextStep: () => {},
  skipTour: () => {},
  setCurrentStep: () => {},
  isTourEnabled: false,
};

export const useTour = () => {
  const context = useContext(TourContext);
  
  // If tour is disabled globally, return disabled state
  if (!TOUR_ENABLED) {
    return disabledTour;
  }
  
  if (!context) {
    throw new Error('useTour must be used within a TourProvider');
  }
  return context;
};

export const TourProvider = ({ children }) => {
  const [isTourActive, setIsTourActive] = useState(false);
  const [isGuestMode, setIsGuestMode] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();

  const tourSteps = [
    {
      target: '[data-tour="quick-actions"]',
      title: 'Quick Actions',
      content: 'Jump straight into learning! Create notes and explore your study materials.',
      page: '/dashboard',
    },
    {
      target: '[data-tour="ai-daily-coach"]',
      title: 'AI Daily Coach',
      content: 'Your personal AI generates a smart study plan based on your progress and upcoming goals.',
      page: '/dashboard',
    },
    {
      target: '[data-tour="daily-plan"]',
      title: 'Daily Plan & To-Do',
      content: 'Keep track of your tasks and what you need to accomplish today.',
      page: '/dashboard',
    },
    {
      target: '[data-tour="manage-subjects"]',
      title: 'Manage Subjects',
      content: 'Add and organize your courses here. This helps Medha personalize your learning experience.',
      page: '/dashboard',
    },
    {
      target: '[data-tour="focus-areas"]',
      title: 'Focus Areas',
      content: 'We identify topics that need your attention so you never fall behind.',
      page: '/dashboard',
    },
    // Notes Page
    {
      target: '[data-tour="choose-subject"]',
      title: 'Choose Subject',
      content: 'First, select a subject to organize your notes. All your materials will be neatly categorized.',
      page: '/notes',
    },
    {
      target: '[data-tour="upload-note"]',
      title: 'Upload Notes',
      content: 'Drag and drop PDFs or images here. Medha will extract the text and make your notes searchable.',
      page: '/notes',
    },

    {
      target: '[data-tour="explore-tab"]',
      title: 'Explore Public Notes',
      content: 'Discover notes shared by the community! Click Explore to see public notes from other students.',
      page: '/notes',
    },
    {
      target: '[data-tour="explore-folders"]',
      title: 'Browse & Like Notes',
      content: 'Notes are organized by subject. Click folders to expand, search by topic, and like notes to save them.',
      page: '/notes',
    },
    // RTU Exams Page
    {
      target: '[data-tour="rtu-semester"]',
      title: 'The Archives',
      content: 'Access previous year question papers organized by semester. Click to explore 3rd semester subjects.',
      page: '/rtu-exams',
    },
    {
      target: '[data-tour="rtu-subjects"]',
      title: 'Choose a Subject',
      content: 'Pick a subject to see available question papers. Subjects with "Includes Analysis" have detailed unit-wise breakdowns.',
      page: '/rtu-exams',
    },
    {
      target: '[data-tour="rtu-years"]',
      title: 'Select Year',
      content: 'Choose an academic year to view that exam paper. We analyze patterns across multiple years.',
      page: '/rtu-exams',
    },
    {
      target: '[data-tour="rtu-weightage"]',
      title: 'Unit Weightage Analysis',
      content: 'Smart analysis shows which units are most important. Focus on high-weightage units to maximize your score!',
      page: '/rtu-exams',
    },
  ];

  const startTour = (guest = false) => {
    setCurrentStep(0);
    setIsTourActive(true);
    setIsGuestMode(guest);
    if (location.pathname !== tourSteps[0].page) {
      navigate(tourSteps[0].page);
    }
  };

  const endTour = () => {
    setIsTourActive(false);
    setIsGuestMode(false);
    setCurrentStep(0);
    if (isGuestMode) {
      navigate('/');
    }
  };

  const nextStep = () => {
    if (currentStep < tourSteps.length - 1) {
      const nextIdx = currentStep + 1;
      const nextStepData = tourSteps[nextIdx];
      
      if (location.pathname !== nextStepData.page) {
        navigate(nextStepData.page);
        // We'll let the listener handle step increment once the page loads
      } else {
        setCurrentStep(nextIdx);
      }
    } else {
      endTour();
    }
  };

  const skipTour = () => {
    endTour();
  };

  // Sync step when page changes
  useEffect(() => {
    if (isTourActive) {
      const stepData = tourSteps[currentStep];
      if (location.pathname !== stepData.page) {
        // If we navigated manually or via code, check if the current step matches the page
        const correctStepIdx = tourSteps.findIndex(s => s.page === location.pathname);
        if (correctStepIdx !== -1 && correctStepIdx >= currentStep) {
          setCurrentStep(correctStepIdx);
        }
      }
    }
  }, [location.pathname, isTourActive]);

  return (
    <TourContext.Provider value={{
      isTourActive,
      isGuestMode,
      currentStep,
      tourSteps,
      startTour,
      endTour,
      nextStep,
      skipTour,
      setCurrentStep,
      isTourEnabled: TOUR_ENABLED
    }}>
      {children}
    </TourContext.Provider>
  );
};
