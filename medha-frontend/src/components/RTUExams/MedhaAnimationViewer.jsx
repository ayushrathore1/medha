/**
 * MedhaAnimationViewer - "The Compiler's Atelier" (Apple Edition)
 * True Black. High Contrast. Precision.
 */
import React, { useState, useRef, useEffect, useCallback, useMemo } from "react";
import ReactDOM from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import jsPDF from "jspdf";
import {
  FaTimes,
  FaChevronLeft,
  FaChevronRight,
  FaPlay,
  FaPause,
  FaMicrophone,
  FaStickyNote,
  FaEyeSlash,
  FaEye,
  FaFilePdf,
  FaEdit,
  FaUpload,
  FaList,
  FaArrowLeft,
  FaGlobe,
  FaMusic,
  FaShare,
  FaKeyboard,
} from "react-icons/fa";
import { getAnimation } from "./animations";
import SlideNoteCard from "./animations/SlideNoteCard";
import CinematicIntro from "./animations/CinematicIntro";
// Voice chatbot - kept for future use
// import VoiceChatbot from "./animations/VoiceChatbot";
// Text-based chatbot with full context awareness
import AnimationTextChatbot from "./animations/AnimationTextChatbot";
import AudioSyncTool from "./animations/AudioSyncTool";

// Audio sync functions for Unit 5 animation
import {
  getSceneFromAudioTime,
  getSceneAudioTime,
  sections as audioSections,
} from "./animations/Unit5OneShotAnimation";

const APPLE_THEME = {
  bg: "#000000",
  surface: "#1c1c1e", // Apple Dark Gray
  border: "rgba(255, 255, 255, 0.1)",
  accent: "#0A84FF", // System Blue
  text: "#F5F5F7",
  textSec: "#86868B",
  success: "#30D158",
  danger: "#FF453A",
};

const MedhaAnimationViewer = ({
  animationId,
  contentId,
  title,
  isOpen,
  onClose,
  totalSteps: propTotalSteps,
  audioHindiUrl: initialAudioHindi,
  audioEnglishUrl: initialAudioEnglish,
  isAdmin = false,
  isTeam = false,
  initialViews = 0,
  initialStep = 1,
  partAudios: initialPartAudios = [],
}) => {
  const containerRef = useRef(null);
  const audioRef = useRef(null);
  const voiceNoteRef = useRef(null);

  // Animation Data
  const animation = getAnimation(animationId);
  const rawSteps = animation?.AnimationSteps || [];
  const normalizedSteps = rawSteps.map((s) =>
    s.component ? s : { component: s, title: "Step" }
  );
  const totalSteps = normalizedSteps.length;

  // State
  const [currentStep, setCurrentStep] = useState(initialStep);
  const [editMode, setEditMode] = useState(false);
  const [showNoteCard, setShowNoteCard] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);
  const [showIntro, setShowIntro] = useState(true);
  const [showGlobalUpload, setShowGlobalUpload] = useState(false);
  const [showNotePanel, setShowNotePanel] = useState(true); // User can hide/show notes
  const [showFullscreenNote, setShowFullscreenNote] = useState(false); // Premium fullscreen view
  const [showAudioSyncTool, setShowAudioSyncTool] = useState(false); // Admin audio sync tool
  const [cursorVisible, setCursorVisible] = useState(false); // Cursor auto-hide
  const cursorTimeoutRef = useRef(null);

  const [slideData, setSlideData] = useState([]);
  const [loading, setLoading] = useState(false);

  // Pending global audio files for upload
  const [pendingHindiFile, setPendingHindiFile] = useState(null);
  const [pendingEnglishFile, setPendingEnglishFile] = useState(null);

  // Update state when props change
  const [audioHindiUrl, setAudioHindiUrl] = useState(initialAudioHindi);
  const [audioEnglishUrl, setAudioEnglishUrl] = useState(initialAudioEnglish);

  useEffect(() => {
    setAudioHindiUrl(initialAudioHindi);
    setAudioEnglishUrl(initialAudioEnglish);
  }, [initialAudioHindi, initialAudioEnglish]);


  // Orientation Enforcement Logic
  const [isPortrait, setIsPortrait] = useState(false);
  const [showRotationPrompt, setShowRotationPrompt] = useState(false);

  useEffect(() => {
    const checkOrientation = () => {
      // Check if mobile device (width < 768px) and in portrait
      const isMobile = window.innerWidth < 768;
      const isPortraitMode = window.innerHeight > window.innerWidth;
      
      if (isMobile && isPortraitMode) {
        setIsPortrait(true);
        setShowRotationPrompt(true);
      } else {
        setIsPortrait(false);
        setShowRotationPrompt(false);
      }
    };

    // Initial check
    checkOrientation();

    // Listen for resize/orientation change
    window.addEventListener('resize', checkOrientation);
    window.addEventListener('orientationchange', checkOrientation);

    // Try to lock orientation to landscape on mount (if supported)
    const lockOrientation = async () => {
      if (document.documentElement.requestFullscreen) {
        try {
          // Some browsers require full screen before locking
          // We won't force full screen here to avoid jarring UX without user interaction
          // But if already full screen, we try to lock
          if (document.fullscreenElement && screen.orientation && screen.orientation.lock) {
            await screen.orientation.lock("landscape");
          }
        } catch (e) {
          console.log("Orientation lock failed/not supported", e);
        }
      }
    };
    lockOrientation();

    return () => {
      window.removeEventListener('resize', checkOrientation);
      window.removeEventListener('orientationchange', checkOrientation);
    };
  }, []);
  const [audioTranscript, setAudioTranscript] = useState(null); // Saved transcript for sync
  const [manualTimings, setManualTimings] = useState(null); // Saved manual timings for precision sync

  useEffect(() => {
    if (!isOpen || !animationId) return;

    const fetchAudioUrls = async () => {
      try {
        const token = localStorage.getItem("token");
        const baseUrl = import.meta.env.VITE_BACKEND_URL;
        const res = await axios.get(
          `${baseUrl}/api/learn/animation/${animationId}/audio`,
          {
            headers: token ? { Authorization: `Bearer ${token}` } : {},
          }
        );
        if (res.data.success) {
          // Only set global audio if not already provided via props
          if (!initialAudioHindi && res.data.audioHindiUrl) {
            setAudioHindiUrl(res.data.audioHindiUrl);
          }
          if (!initialAudioEnglish && res.data.audioEnglishUrl) {
            setAudioEnglishUrl(res.data.audioEnglishUrl);
          }
          // Store transcript for sync
          if (res.data.audioTranscript) {
            setAudioTranscript(res.data.audioTranscript);
            if (res.data.audioTranscript.duration) {
              setAudioDuration(res.data.audioTranscript.duration);
            }
          }
          // Store manual timings
          if (
            res.data.manualSlideTimings &&
            Object.keys(res.data.manualSlideTimings).length > 0
          ) {
            setManualTimings(res.data.manualSlideTimings);
          }
          // ALWAYS store multi-part audio data (even if global audio exists)
          if (res.data.partAudios && res.data.partAudios.length > 0) {
            setPartAudios(res.data.partAudios);
            console.log("Loaded partAudios:", res.data.partAudios);
          }
        }
      } catch (error) {
        // Content may not exist yet, that's okay
        console.log("No audio data found for animation:", animationId);
      }
    };
    fetchAudioUrls();
  }, [isOpen, animationId, initialAudioHindi, initialAudioEnglish]);

  // Audio state
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioLang, setAudioLang] = useState("hindi");
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [showAudioHint, setShowAudioHint] = useState(false);
  const [showNavigationHint, setShowNavigationHint] = useState(false);
  const [hasUsedArrowKeys, setHasUsedArrowKeys] = useState(false);
  const [showControlsHelp, setShowControlsHelp] = useState(false);

  // Auto-play state (Video-like experience)
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const [slideProgress, setSlideProgress] = useState(0);
  const [slideDuration, setSlideDuration] = useState(12); // seconds per slide (slower default)
  const [playbackSpeedMultiplier, setPlaybackSpeedMultiplier] = useState(1); // 0.5x, 1x, 1.5x, 2x
  const autoPlayIntervalRef = useRef(null);
  const progressIntervalRef = useRef(null);

  // Audio Sync State
  const [audioCurrentTime, setAudioCurrentTime] = useState(0);
  const [audioDuration, setAudioDuration] = useState(553); // 9:13 total
  const [audioSyncMode, setAudioSyncMode] = useState(false); // When true, audio drives slides

  // Multi-part audio state (for animations with separate audio per section)
  const [partAudios, setPartAudios] = useState(initialPartAudios); // Array of per-part audio data from backend
  const [animationParts, setAnimationParts] = useState([]); // Part definitions from animation component
  const [currentPartIndex, setCurrentPartIndex] = useState(0); // Which part is currently active
  const [showPartBreak, setShowPartBreak] = useState(false); // Show break screen between parts


  // Voice recording
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

  const canEdit = isAdmin || isTeam;
  
  // Multi-part audio helpers
  const hasMultiPartAudio = partAudios.length > 0;
  
  const hasAudio = audioHindiUrl || audioEnglishUrl || hasMultiPartAudio;
  const currentAudioUrl =
    audioLang === "hindi" ? audioHindiUrl : audioEnglishUrl;

  
  // Get which part a step belongs to (uses partAudios, animationParts, or animation.parts)
  const getCurrentPartFromStep = useCallback((step) => {
    const parts = partAudios.length > 0 ? partAudios : (animationParts.length > 0 ? animationParts : animation?.parts || []);
    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      if (step >= part.startScene && step <= part.endScene) {
        return i;
      }
    }
    return 0;
  }, [partAudios, animationParts, animation?.parts]);

  // Get current part's audio URL based on currentPartIndex
  const currentPartAudioUrl = useMemo(() => {
    if (!hasMultiPartAudio) return null;
    const part = partAudios[currentPartIndex];
    if (!part) return null;
    return audioLang === "hindi" ? part.audioHindiUrl : part.audioEnglishUrl;
  }, [hasMultiPartAudio, partAudios, currentPartIndex, audioLang]);

  // Initialize animationParts from animation module
  useEffect(() => {
    if (animation?.parts && animation.parts.length > 0) {
      setAnimationParts(animation.parts);
    }
  }, [animation?.parts]);

  // Initialize currentPartIndex when partAudios first loads
  useEffect(() => {
    if (partAudios.length > 0) {
      const initialPartIndex = getCurrentPartFromStep(currentStep);
      setCurrentPartIndex(initialPartIndex);
      // Auto-enable sync mode for multi-part audio
      setAudioSyncMode(true);
      console.log("Initialized part to:", initialPartIndex, "for step:", currentStep, "- Sync mode enabled");
    }
  }, [partAudios.length]); // Only run when partAudios changes from empty to filled

  // Detect part changes when step changes (after initial load)
  const prevStepRef = useRef(currentStep);
  useEffect(() => {
    // URL Deep Linking: Update browser URL without reloading
    if (window.location.pathname.includes('/visualize/')) {
      const url = new URL(window.location);
      const pathParts = url.pathname.split('/');
      // Path format: /visualize/:animationId/:step
      // If step param exists, replace it, otherwise append it
      if (pathParts.length >= 4) {
        pathParts[3] = currentStep.toString();
      } else {
        pathParts.push(currentStep.toString());
      }
      const newPath = pathParts.join('/');
      window.history.replaceState(null, '', newPath);
    }

    if (!hasMultiPartAudio) return;
    if (prevStepRef.current === currentStep) return; // Skip if step hasn't changed
    
    const prevStep = prevStepRef.current;
    prevStepRef.current = currentStep;
    
    const newPartIndex = getCurrentPartFromStep(currentStep);
    const prevPartIndex = getCurrentPartFromStep(prevStep);
    
    if (newPartIndex !== prevPartIndex) {
      // Part changed! Pause current audio and optionally show break screen
      if (audioRef.current) {
        audioRef.current.pause();
      }
      setIsPlaying(false);
      setCurrentPartIndex(newPartIndex);
      
      // Show break screen if moving forward to next part
      if (newPartIndex > prevPartIndex) {
        setShowPartBreak(true);
      }
    }
  }, [currentStep, hasMultiPartAudio, getCurrentPartFromStep]);

  // Keyboard Controls


  // Content ID state for when we auto-create content
  const [localContentId, setLocalContentId] = useState(contentId);

  useEffect(() => {
    setLocalContentId(contentId);
  }, [contentId]);

  // Fetch slide data - try by contentId first, then by animationId
  useEffect(() => {
    if (!isOpen) return;

    const fetchSlideData = async () => {
      try {
        const token = localStorage.getItem("token");
        const baseUrl = import.meta.env.VITE_BACKEND_URL;

        if (localContentId) {
          // Fetch by contentId
          const res = await axios.get(
            `${baseUrl}/api/learn/${localContentId}/slides`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          if (res.data.success) setSlideData(res.data.slideData || []);
        } else if (animationId) {
          // Fetch by animationId
          const res = await axios.get(
            `${baseUrl}/api/learn/animation/${animationId}/slides`,
            { headers: token ? { Authorization: `Bearer ${token}` } : {} }
          );
          if (res.data.success) {
            setSlideData(res.data.slideData || []);
            if (res.data.contentId) setLocalContentId(res.data.contentId);
          }
        }
      } catch (error) {
        console.error("Error fetching slide data:", error);
      }
    };
    fetchSlideData();
  }, [isOpen, localContentId, animationId]);

  // Voice note auto-play (Slide Level)
  useEffect(() => {
    // Only play slide audio if Global Audio is NOT playing or available?
    // Usually Global Audio replaces per-slide audio.
    // Let's assume slide audio plays if Global Audio is not playing.
    if (!isPlaying) {
      const data = slideData.find((s) => s.stepNumber === currentStep);
      if (data?.voiceNoteUrl && voiceNoteRef.current) {
        voiceNoteRef.current.src = data.voiceNoteUrl;
        voiceNoteRef.current.play().catch(console.error);
      }
    }
  }, [currentStep, slideData, isPlaying]);

  // Global audio playback control (supports both single audio and multi-part audio)
  useEffect(() => {
    const audioUrl = currentPartAudioUrl || currentAudioUrl;
    if (!audioRef.current || !audioUrl) return;

    if (isPlaying) {
      audioRef.current.play().catch(console.error);
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying, currentAudioUrl, currentPartAudioUrl]);

  // Update playback speed when it changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = playbackSpeed;
    }
  }, [playbackSpeed]);

  // Audio time tracking and sync
  useEffect(() => {
    if (!audioRef.current || !hasAudio) return;

    const handleTimeUpdate = () => {
      const time = audioRef.current?.currentTime || 0;
      setAudioCurrentTime(time);

      // If in sync mode and audio is playing, update scene based on audio time
      if (audioSyncMode && isPlaying) {
        let targetScene = currentStep;

        // PRIORITY 0: Multi-Part Audio Auto-Sync (divides part duration by slide count)
        if (hasMultiPartAudio && partAudios[currentPartIndex]) {
          const part = partAudios[currentPartIndex];
          const partDuration = part.audioDuration || audioRef.current?.duration || 300;
          const slidesInPart = (part.endScene - part.startScene) + 1;
          const timePerSlide = partDuration / slidesInPart;
          
          // Calculate which slide within this part based on audio time
          const slideIndex = Math.floor(time / timePerSlide);
          targetScene = Math.min(part.startScene + slideIndex, part.endScene);
        }
        // PRIORITY 1: Manual Slide Timings (User Recorded)
        else if (manualTimings && Object.keys(manualTimings).length > 0) {
          // Find the highest slide number whose start time is <= current time
          let bestSlide = 1;
          const slides = Object.entries(manualTimings).sort(
            (a, b) => Number(a[0]) - Number(b[0])
          );

          for (const [slideNum, startTime] of slides) {
            if (time >= startTime) {
              bestSlide = Number(slideNum);
            } else {
              break; // Future slide
            }
          }
          targetScene = bestSlide;
        }
        // PRIORITY 2: AI Transcript Segments
        else if (audioTranscript?.segments?.length > 0) {
          // Find the segment that contains this time
          for (const seg of audioTranscript.segments) {
            if (time >= seg.start && time < seg.end) {
              targetScene = seg.slideNumber;
              break;
            }
            // If past segment end but before next, use last matching
            if (time >= seg.end) {
              targetScene = seg.slideNumber;
            }
          }
        } else {
          // Fallback to section-based timing function
          targetScene = getSceneFromAudioTime(time);
        }

        if (targetScene !== currentStep) {
          setCurrentStep(targetScene);
        }
      }
    };

    const handleLoadedMetadata = () => {
      if (audioRef.current?.duration) {
        setAudioDuration(audioRef.current.duration);
      }
    };

    audioRef.current.addEventListener("timeupdate", handleTimeUpdate);
    audioRef.current.addEventListener("loadedmetadata", handleLoadedMetadata);

    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener("timeupdate", handleTimeUpdate);
        audioRef.current.removeEventListener(
          "loadedmetadata",
          handleLoadedMetadata
        );
      }
    };
  }, [
    hasAudio,
    audioSyncMode,
    isPlaying,
    currentStep,
    audioTranscript,
    manualTimings,
    hasMultiPartAudio,
    partAudios,
    currentPartIndex,
  ]);

  // Sync current scene to audio when manually changing slides (seeks audio)
  const syncSceneToAudio = useCallback(
    (sceneNumber) => {
      if (audioRef.current && hasAudio) {
        let targetTime = 0;

        // PRIORITY 1: Manual Slide Timings
        if (manualTimings && manualTimings[sceneNumber] !== undefined) {
          targetTime = manualTimings[sceneNumber];
        }
        // PRIORITY 2: Saved Transcript Segments
        else if (audioTranscript?.segments?.length > 0) {
          const matchingSegment = audioTranscript.segments.find(
            (seg) => seg.slideNumber === sceneNumber
          );
          if (matchingSegment) {
            targetTime = matchingSegment.start;
          } else {
            // Fallback to section-based
            targetTime = getSceneAudioTime(sceneNumber);
          }
        } else {
          targetTime = getSceneAudioTime(sceneNumber);
        }

        audioRef.current.currentTime = targetTime;
        setAudioCurrentTime(targetTime);
      }
    },
    [hasAudio, audioTranscript, manualTimings]
  );

  // Format seconds to mm:ss
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // Show audio hint after intro completes
  useEffect(() => {
    if (!showIntro && hasAudio) {
      setShowAudioHint(true);
      const timer = setTimeout(() => setShowAudioHint(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [showIntro, hasAudio]);

  // Show navigation hint if user hasn't used arrow keys
  useEffect(() => {
    if (!showIntro && !hasUsedArrowKeys) {
      const timer = setTimeout(() => {
        setShowNavigationHint(true);
      }, 3000); // Show after 3 seconds of inactivity
      return () => clearTimeout(timer);
    }
  }, [showIntro, hasUsedArrowKeys]);

  // Auto-hide navigation hint after 10 seconds
  useEffect(() => {
    if (showNavigationHint) {
      const timer = setTimeout(() => setShowNavigationHint(false), 10000);
      return () => clearTimeout(timer);
    }
  }, [showNavigationHint]);

  // Navigation - Define before auto-play logic that depends on it
  const goToStep = useCallback(
    (step) => {
      if (step >= 1 && step <= totalSteps) {
        const data = slideData.find((s) => s.stepNumber === step);
        if (canEdit || !data?.isHidden) setCurrentStep(step);
      }
    },
    [totalSteps, slideData, canEdit]
  );

  const handleNext = useCallback(
    () => goToStep(currentStep < totalSteps ? currentStep + 1 : currentStep),
    [goToStep, currentStep, totalSteps]
  );

  const handlePrev = useCallback(
    () => goToStep(currentStep > 1 ? currentStep - 1 : currentStep),
    [goToStep, currentStep]
  );

  // Seek Handler
  const handleSeek = useCallback((seconds) => {
    if (audioRef.current) {
       const newTime = Math.min(Math.max(audioRef.current.currentTime + seconds, 0), audioRef.current.duration || 100);
       audioRef.current.currentTime = newTime;
       setAudioCurrentTime(newTime);
    }
  }, []);

  // 👆 Mobile Double Tap Logic
  const lastTapRef = useRef(0);
  const [doubleTapFeedback, setDoubleTapFeedback] = useState(null); // 'left' | 'right'

  const handleMobileTap = (e) => {
    // Only on mobile/touch (or if we want to support click double tap too)
    const now = Date.now();
    const DOUBLE_TAP_DELAY = 300;
    
    if (now - lastTapRef.current < DOUBLE_TAP_DELAY) {
      // Double tap detected!
      const screenWidth = window.innerWidth;
      // Handle both touch and mouse events
      const clientX = e.type.includes('touch') 
        ? (e.touches && e.touches[0] ? e.touches[0].clientX : e.changedTouches[0].clientX)
        : e.clientX;
      
      if (clientX < screenWidth * 0.35) {
        // Left side -> Rewind
        if (hasAudio) {
          handleSeek(-10);
          setDoubleTapFeedback('left');
          setTimeout(() => setDoubleTapFeedback(null), 600);
        }
      } else if (clientX > screenWidth * 0.65) {
        // Right side -> Forward
        if (hasAudio) {
           handleSeek(10);
           setDoubleTapFeedback('right');
           setTimeout(() => setDoubleTapFeedback(null), 600);
        }
      } else {
         // Center double tap - maybe toggle play/pause or fullscreen?
         // For now let single click handler deal with center
      }
      lastTapRef.current = 0; // Reset to prevent triple tap triggering twice
    } else {
      lastTapRef.current = now;
      // If we need to distinguish single vs double, we'd need a timer here, 
      // but simpler is to let single tap fire immediately for play/pause.
    }
  };

  // Keyboard Controls (Moved here to avoid hoisting issues with handleNext/Prev)
  useEffect(() => {
    if (!isOpen || showIntro || showAudioSyncTool) return; // Disable controls during intro or when sync tool is open

    const handleKeyDown = (e) => {
      // Ignore if typing in an input
      if (["INPUT", "TEXTAREA"].includes(e.target.tagName)) return;

      switch (e.key) {
        case "J": 
        case "j":
          e.preventDefault();
          if (hasAudio && audioRef.current) {
             handleSeek(-10);
          }
          break;
        case "L":
        case "l":
          e.preventDefault();
          if (hasAudio && audioRef.current) {
             handleSeek(10);
          }
          break;
        case "ArrowRight":
          e.preventDefault();
          setHasUsedArrowKeys(true);
          setShowNavigationHint(false);
          handleNext();
          break;
        case "ArrowLeft":
          e.preventDefault();
          setHasUsedArrowKeys(true);
          setShowNavigationHint(false);
          handlePrev();
          break;
        case "Tab":
          e.preventDefault();
          setShowControlsHelp((prev) => !prev);
          break;
        case " ":
        case "k": 
        case "K":
          e.preventDefault();
          // Space/K toggles Global Audio (Play/Pause) - Standard YouTube style
          if (hasAudio) {
            setIsPlaying((prev) => !prev);
          }
          break;
        // J/L seek logic handled above with handleSeek
        case "ArrowUp":
          e.preventDefault();
          // Increase slide duration (slower)
          setSlideDuration((prev) => Math.min(prev + 2, 20));
          break;
        case "ArrowDown":
          e.preventDefault();
          // Decrease slide duration (faster)
          setSlideDuration((prev) => Math.max(prev - 2, 4));
          break;
        case "Escape":
          e.preventDefault();
          // Close in order: help > part break > fullscreen note > main viewer
          if (showControlsHelp) {
            setShowControlsHelp(false);
          } else if (showPartBreak) {
            setShowPartBreak(false);
          } else if (showFullscreenNote) {
            setShowFullscreenNote(false);
          } else {
            setIsAutoPlaying(false); // Stop auto-play on close
            onClose();
          }
          break;
        case "f":
        case "F":
          e.preventDefault();
          if (document.fullscreenElement) document.exitFullscreen();
          else document.documentElement.requestFullscreen();
          break;
        case "m":
        case "M":
          e.preventDefault();
          if (hasAudio) {
            setAudioLang((prev) => (prev === "hindi" ? "english" : "hindi"));
          }
          break;
        case "a":
        case "A":
          e.preventDefault();
          // Toggle global audio if available
          if (hasAudio) {
            setIsPlaying((prev) => !prev);
          }
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    isOpen,
    showIntro,
    showAudioSyncTool,
    currentStep,
    totalSteps,
    hasAudio,
    showFullscreenNote,
    showControlsHelp,
    showPartBreak,
    handleNext,
    handlePrev,
    audioDuration
  ]);

  // Auto-play logic - Video-like experience
  // DISABLED when audioSyncMode is on (audio drives slides instead)
  useEffect(() => {
    // Clear existing intervals
    if (autoPlayIntervalRef.current) {
      clearTimeout(autoPlayIntervalRef.current);
    }
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
    }

    // Don't run auto-play timer when audio sync is enabled - audio drives slides
    if (audioSyncMode) {
      return;
    }

    if (isAutoPlaying && !showIntro && !showAudioSyncTool) {
      // Calculate actual duration based on speed multiplier
      const actualDuration = slideDuration / playbackSpeedMultiplier;

      // Reset progress when starting
      setSlideProgress(0);

      // Progress update interval (every 100ms for smooth progress bar)
      const progressStep = 100 / (actualDuration * 10);
      progressIntervalRef.current = setInterval(() => {
        setSlideProgress((prev) => {
          if (prev >= 100) return 100;
          return prev + progressStep;
        });
      }, 100);

      // Auto advance to next slide
      autoPlayIntervalRef.current = setTimeout(() => {
        if (currentStep < totalSteps) {
          goToStep(currentStep + 1);
        } else {
          // Reached the end, stop auto-play
          setIsAutoPlaying(false);
        }
      }, actualDuration * 1000);
    }

    return () => {
      if (autoPlayIntervalRef.current)
        clearTimeout(autoPlayIntervalRef.current);
      if (progressIntervalRef.current)
        clearInterval(progressIntervalRef.current);
    };
  }, [
    isAutoPlaying,
    slideDuration,
    playbackSpeedMultiplier,
    currentStep,
    totalSteps,
    audioSyncMode,
    showIntro,
    showAudioSyncTool,
    goToStep,
  ]);

  // Reset progress when step changes
  useEffect(() => {
    setSlideProgress(0);
  }, [currentStep]);

  // Toggle auto-play function
  const toggleAutoPlay = useCallback(() => {
    setIsAutoPlaying((prev) => !prev);
  }, []);

  // Global Audio Upload
  const handleGlobalUpload = async (file, language) => {
    if (!file) {
      alert("Please select a file first");
      return;
    }
    if (!animationId) {
      alert("Cannot upload: No animation ID available.");
      return;
    }
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const baseUrl = import.meta.env.VITE_BACKEND_URL;
      const formData = new FormData();
      formData.append("audioFile", file);
      formData.append("language", language);

      let res;

      if (contentId) {
        // Use existing content endpoint
        res = await axios.post(
          `${baseUrl}/api/learn/${contentId}/global-voice`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );
      } else {
        // Use animation-based endpoint (auto-creates content if needed)
        formData.append("animationId", animationId);
        formData.append("title", title || animationId);
        formData.append("totalSteps", totalSteps);

        res = await axios.post(
          `${baseUrl}/api/learn/animation/global-voice`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );
      }

      if (res.data.success) {
        if (language === "hindi") {
          setAudioHindiUrl(res.data.audioUrl);
          setPendingHindiFile(null);
        } else {
          setAudioEnglishUrl(res.data.audioUrl);
          setPendingEnglishFile(null);
        }
        alert("Audio uploaded successfully!");
      }
    } catch (err) {
      console.error(err);
      alert("Upload failed");
    } finally {
      setLoading(false);
    }
  };

  // Multi-Part Audio Upload
  const handlePartAudioUpload = async (partNumber, partData, audioUrl) => {
    if (!animationId) {
      alert("Cannot upload: No animation ID available.");
      return;
    }
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const baseUrl = import.meta.env.VITE_BACKEND_URL;

      const res = await axios.put(
        `${baseUrl}/api/learn/animation/${animationId}/part-audio/${partNumber}`,
        {
          partName: partData.name || partData.partName,
          startScene: partData.startScene,
          endScene: partData.endScene,
          audioHindiUrl: audioUrl,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.data.success) {
        setPartAudios(res.data.partAudios);
        alert(`Part ${partNumber} audio saved successfully!`);
      }
    } catch (err) {
      console.error(err);
      alert("Part audio upload failed");
    } finally {
      setLoading(false);
    }
  };

  // Admin Functions
  const handleVoiceUpload = async (file) => {
    if (!contentId || !file) return;
    try {
      const token = localStorage.getItem("token");
      const baseUrl = import.meta.env.VITE_BACKEND_URL;
      const formData = new FormData();
      formData.append("voiceNote", file);

      const res = await axios.post(
        `${baseUrl}/api/learn/${contentId}/slide/${currentStep}/voice`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (res.data.success) {
        setSlideData((prev) => {
          const newData = [...prev];
          const idx = newData.findIndex((s) => s.stepNumber === currentStep);
          if (idx >= 0) {
            newData[idx] = {
              ...newData[idx],
              voiceNoteUrl: res.data.voiceNoteUrl,
            };
          } else {
            newData.push({
              stepNumber: currentStep,
              voiceNoteUrl: res.data.voiceNoteUrl,
            });
          }
          return newData;
        });
        alert("Voice note uploaded!");
      }
    } catch (err) {
      console.error("Voice upload error:", err);
      alert("Upload failed");
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      chunksRef.current = [];
      mediaRecorderRef.current.ondataavailable = (e) =>
        chunksRef.current.push(e.data);
      mediaRecorderRef.current.onstop = async () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        const file = new File([blob], `voice-step-${currentStep}.webm`, {
          type: "audio/webm",
        });
        await handleVoiceUpload(file);
        stream.getTracks().forEach((t) => t.stop());
      };
      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Recording error:", err);
      alert("Could not access microphone");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const toggleVisibility = async () => {
    if (!localContentId && !animationId) return;
    const currentSlideData =
      slideData.find((s) => s.stepNumber === currentStep) || {};
    const newHiddenState = !currentSlideData.isHidden;
    try {
      const token = localStorage.getItem("token");
      const baseUrl = import.meta.env.VITE_BACKEND_URL;

      let res;
      if (localContentId) {
        res = await axios.patch(
          `${baseUrl}/api/learn/${localContentId}/slide/${currentStep}`,
          { isHidden: newHiddenState },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        res = await axios.patch(
          `${baseUrl}/api/learn/animation/${animationId}/slide/${currentStep}`,
          { isHidden: newHiddenState, title, totalSteps },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (res.data.contentId) setLocalContentId(res.data.contentId);
      }

      setSlideData((prev) => {
        const newData = [...prev];
        const idx = newData.findIndex((s) => s.stepNumber === currentStep);
        if (idx >= 0) {
          newData[idx] = { ...newData[idx], isHidden: newHiddenState };
        } else {
          newData.push({ stepNumber: currentStep, isHidden: newHiddenState });
        }
        return newData;
      });
    } catch (err) {
      console.error("Toggle visibility error:", err);
    }
  };

  const handleSaveNote = async (noteData) => {
    if (!localContentId && !animationId) return;
    try {
      const token = localStorage.getItem("token");
      const baseUrl = import.meta.env.VITE_BACKEND_URL;

      let res;
      if (localContentId) {
        res = await axios.patch(
          `${baseUrl}/api/learn/${localContentId}/slide/${currentStep}`,
          { notes: noteData },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        res = await axios.patch(
          `${baseUrl}/api/learn/animation/${animationId}/slide/${currentStep}`,
          { notes: noteData, title, totalSteps },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (res.data.contentId) setLocalContentId(res.data.contentId);
      }

      setSlideData((prev) => {
        const newData = [...prev];
        const idx = newData.findIndex((s) => s.stepNumber === currentStep);
        if (idx >= 0) {
          newData[idx] = { ...newData[idx], notes: noteData };
        } else {
          newData.push({ stepNumber: currentStep, notes: noteData });
        }
        return newData;
      });
      setShowNoteCard(false);
    } catch (err) {
      console.error("Save note error:", err);
    }
  };

  const handleNoteImageUpload = async (file) => {
    if (!contentId || !file) return null;
    try {
      const token = localStorage.getItem("token");
      const baseUrl = import.meta.env.VITE_BACKEND_URL;
      const formData = new FormData();
      formData.append("image", file);
      const res = await axios.post(
        `${baseUrl}/api/learn/${contentId}/slide/${currentStep}/note-image`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return res.data.success ? res.data.imageUrl : null;
    } catch (err) {
      console.error("Image upload error:", err);
      return null;
    }
  };

  const handleGeneratePDF = async () => {
    setLoading(true);
    try {
      const pdf = new jsPDF("l", "mm", "a4");
      const w = pdf.internal.pageSize.getWidth();
      const h = pdf.internal.pageSize.getHeight();

      for (let i = 1; i <= totalSteps; i++) {
        const data = slideData.find((s) => s.stepNumber === i);
        if (data?.isHidden) continue;
        if (i > 1) pdf.addPage();

        pdf.setFillColor(0, 0, 0);
        pdf.rect(0, 0, w, h, "F");

        pdf.setTextColor(10, 132, 255);
        pdf.setFontSize(24);
        pdf.text(`Step ${i}`, 20, 30);

        pdf.setTextColor(255, 255, 255);
        pdf.setFontSize(14);
        pdf.text(title, 20, 45);

        if (data?.notes?.content) {
          pdf.setTextColor(200, 200, 200);
          const lines = pdf.splitTextToSize(data.notes.content, w - 40);
          pdf.text(lines, 20, 60);
        }
      }
      pdf.save(`${title.replace(/\s+/g, "_")}_Notes.pdf`);
    } catch (e) {
      console.error("PDF generation error:", e);
    }
    setLoading(false);
  };

  if (!isOpen || !animation) return null;
  const currentStepObj = normalizedSteps[currentStep - 1] || {};
  const CurrentStepComponent = currentStepObj.component;
  const currentData = slideData.find((s) => s.stepNumber === currentStep) || {};

  return ReactDOM.createPortal(
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[99999] flex flex-col font-sans"
      style={{ 
        background: APPLE_THEME.bg, 
        color: APPLE_THEME.textSec,
        cursor: showIntro ? 'none' : 'auto'
      }}
      onMouseMove={() => {
        if (showIntro) return;
        setCursorVisible(true);
        if (cursorTimeoutRef.current) clearTimeout(cursorTimeoutRef.current);
        cursorTimeoutRef.current = setTimeout(() => setCursorVisible(false), 3000);
      }}
    >
      <audio ref={voiceNoteRef} className="hidden" />

      {/* CINEMATIC INTRO */}
      <AnimatePresence>
        {showIntro && (
          <CinematicIntro
            title={title}
            onComplete={() => setShowIntro(false)}
          />
        )}
      </AnimatePresence>

      {/* ROTATION PROMPT OVERLAY */}
      <AnimatePresence>
        {showRotationPrompt && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100001] bg-black flex flex-col items-center justify-center p-8 text-center"
          >
            <motion.div
              animate={{ rotate: 90 }}
              transition={{ 
                duration: 1.5, 
                repeat: Infinity, 
                repeatDelay: 1,
                ease: "easeInOut" 
              }}
              className="mb-8 text-blue-500"
            >
              <FaMobileAlt size={64} />
            </motion.div>
            <h2 className="text-2xl font-bold text-white mb-4">
              Please Rotate Your Device
            </h2>
            <p className="text-gray-400 mb-8 max-w-xs">
              For the best cinematic experience, please view this animation in landscape mode.
            </p>
            <button
              onClick={() => {
                // Attempt to force landscape via fullscreen API on user click
                if (document.documentElement.requestFullscreen) {
                  document.documentElement.requestFullscreen().then(() => {
                     if (screen.orientation && screen.orientation.lock) {
                       screen.orientation.lock("landscape").catch(console.error);
                     }
                  }).catch(console.error);
                }
              }}
              className="px-6 py-3 bg-blue-600 text-white rounded-full font-bold shadow-lg shadow-blue-500/30 animate-pulse"
            >
              Rotate to Landscape
            </button>
            <button 
              onClick={() => setShowRotationPrompt(false)}
              className="mt-6 text-gray-600 text-sm hover:text-gray-400 transition-colors"
            >
              Continue in Portrait (Not Recommended)
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* AUDIO FEATURE HINT - Shows after intro */}
      <AnimatePresence>
        {showAudioHint && hasAudio && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="absolute bottom-24 left-1/2 -translate-x-1/2 z-50"
          >
            <motion.div
              className="bg-[#1c1c1e]/90 backdrop-blur-xl border border-white/10 rounded-2xl px-6 py-4 shadow-2xl"
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center gap-4 mb-3">
                <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                  <FaPlay className="text-blue-400" size={14} />
                </div>
                <div>
                  <div className="text-white text-sm font-semibold">
                    🎧 Audio Available
                  </div>
                  <div className="text-gray-400 text-xs">
                    Control with keyboard shortcuts
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-[11px]">
                <div className="flex items-center gap-2">
                  <kbd className="px-2 py-0.5 bg-white/10 rounded text-gray-300 font-mono">
                    Space
                  </kbd>
                  <span className="text-gray-400">Play / Pause</span>
                </div>
                <div className="flex items-center gap-2">
                  <kbd className="px-2 py-0.5 bg-white/10 rounded text-gray-300 font-mono">
                    M
                  </kbd>
                  <span className="text-gray-400">Toggle HI/EN</span>
                </div>
                <div className="flex items-center gap-2">
                  <kbd className="px-2 py-0.5 bg-white/10 rounded text-gray-300 font-mono">
                    ↑
                  </kbd>
                  <span className="text-gray-400">Speed Up</span>
                </div>
                <div className="flex items-center gap-2">
                  <kbd className="px-2 py-0.5 bg-white/10 rounded text-gray-300 font-mono">
                    ↓
                  </kbd>
                  <span className="text-gray-400">Speed Down</span>
                </div>
              </div>
              <motion.div
                className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-12 h-1 bg-gradient-to-r from-transparent via-blue-500/50 to-transparent rounded-full"
                animate={{ opacity: [0.3, 0.8, 0.3] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* KEYBOARD CONTROLS HELP (Tab) */}
      <AnimatePresence>
        {showControlsHelp && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/60 backdrop-blur-sm"
            onClick={() => setShowControlsHelp(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-[#1c1c1e] border border-white/10 rounded-2xl p-8 max-w-lg w-full shadow-2xl relative overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />
              
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center border border-purple-500/20">
                    <FaKeyboard className="text-purple-400" size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white tracking-tight">Keyboard Controls</h3>
                    <p className="text-gray-400 text-sm">Master your learning flow</p>
                  </div>
                </div>
                <button 
                  onClick={() => setShowControlsHelp(false)}
                  className="p-2 hover:bg-white/10 rounded-full transition-colors text-gray-400 hover:text-white"
                >
                  <FaTimes size={20} />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {[
                  { keys: ["J"], label: "Rewind 10s", icon: "↺" },
                  { keys: ["L"], label: "Forward 10s", icon: "↻" },
                  { keys: ["Space", "K"], label: "Play / Pause", icon: "⏯" },
                  { keys: ["←", "→"], label: "Prev / Next Slide", icon: "↔" },
                  { keys: ["Tab"], label: "Toggle Controls", icon: "⌨" },
                  { keys: ["M"], label: "Switch Language", icon: "🌐" },
                  { keys: ["F"], label: "Toggle Fullscreen", icon: "⛶" },
                  { keys: ["Esc"], label: "Close Viewer", icon: "✕" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors">
                    <div className="flex items-center gap-2">
                       <span className="text-gray-500 text-xs">{item.icon}</span>
                       <span className="text-gray-300 text-sm font-medium">{item.label}</span>
                    </div>
                    <div className="flex gap-1">
                      {item.keys.map((k, j) => (
                        <kbd key={j} className="px-2 py-1 bg-black/40 rounded-md text-xs font-mono text-gray-400 border border-white/10 min-w-[24px] text-center">
                          {k}
                        </kbd>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 text-center text-xs text-gray-500">
                Press <kbd className="bg-white/10 px-1 rounded text-gray-400">Tab</kbd> anytime to view this guide
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Part Break Screen Overlay */}
      <AnimatePresence>
        {showPartBreak && hasMultiPartAudio && partAudios[currentPartIndex] && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center"
            style={{
              background: "rgba(0, 0, 0, 0.95)",
              backdropFilter: "blur(20px)",
            }}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="text-center max-w-md px-8"
            >
              {/* Part icon */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2 }}
                className="text-6xl mb-6"
              >
                {partAudios[currentPartIndex]?.partName?.includes("Exception") ? "🛡️" :
                 partAudios[currentPartIndex]?.partName?.includes("Template") ? "📐" :
                 partAudios[currentPartIndex]?.partName?.includes("Stream") ? "🌊" :
                 partAudios[currentPartIndex]?.partName?.includes("File") ? "📁" : "📚"}
              </motion.div>
              
              {/* Part label */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-blue-400 text-sm font-semibold tracking-widest mb-2 uppercase"
              >
                Part {currentPartIndex + 1} of {partAudios.length}
              </motion.div>
              
              {/* Part name */}
              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-3xl font-bold text-white mb-4"
              >
                {partAudios[currentPartIndex]?.partName || `Part ${currentPartIndex + 1}`}
              </motion.h2>
              
              {/* Scene range */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-gray-400 text-sm mb-8"
              >
                Scenes {partAudios[currentPartIndex]?.startScene} - {partAudios[currentPartIndex]?.endScene}
              </motion.p>
              
              {/* Continue button */}
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setShowPartBreak(false);
                  // Auto-play new part's audio if there was audio playing before
                  if (currentPartAudioUrl) {
                    setTimeout(() => setIsPlaying(true), 500);
                  }
                }}
                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-400 text-white font-semibold rounded-full shadow-lg hover:shadow-blue-500/30 transition-all"
              >
                Start Part {currentPartIndex + 1} →
              </motion.button>
              
              {/* Skip hint */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.5 }}
                transition={{ delay: 1 }}
                className="text-gray-500 text-xs mt-6"
              >
                Press <kbd className="px-1.5 py-0.5 bg-white/10 rounded text-gray-400">ESC</kbd> to skip
              </motion.p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 🍎 TOP BAR (Transparent, Glassy) */}
      <header className="h-14 landscape:h-10 flex items-center justify-between px-6 landscape:px-4 border-b border-white/5 bg-black/50 backdrop-blur-md z-20 transition-all duration-300">
        <div className="flex items-center gap-4">
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-full transition-colors text-white"
          >
            <FaTimes />
          </button>
          
          {/* Share Button (New) - Hide on mobile landscape */}
          <button
            onClick={async () => {
              // Always use production URL for sharing
              const baseUrl = "https://medha-revision.vercel.app";
              const url = `${baseUrl}/visualize/${animationId}/${currentStep}`;
              try {
                await navigator.clipboard.writeText(url);
                // Show toast (reusing audio hint structure logic for simplicity or adding new state)
                alert("Link Copied! Share this animation with anyone."); 
              } catch (err) {
                console.error("Failed to copy link", err);
              }
            }}
            className="p-2 hover:bg-blue-500/20 text-gray-400 hover:text-blue-400 rounded-full transition-colors landscape:hidden md:landscape:block"
            title="Share this scene"
          >
            <FaShare />
          </button>
          
          {/* View Count (New) - Hide on mobile landscape */}
          {initialViews > 0 && (
            <div className="flex items-center gap-1.5 px-3 py-1 bg-white/5 rounded-full border border-white/5 landscape:hidden md:landscape:flex">
              <FaEye className="text-gray-400" size={12} />
              <span className="text-xs font-semibold text-gray-300">
                {initialViews > 1000 ? `${(initialViews / 1000).toFixed(1)}k` : initialViews}
              </span>
            </div>
          )}

          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]"></span>
            <span className="text-white font-medium tracking-wide text-sm">
              {title}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {hasAudio && (
            <div className="flex items-center gap-1 bg-[#1c1c1e] rounded-full px-3 py-1 border border-white/10">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="text-blue-400 hover:text-blue-300 p-1"
                title="Space to play/pause"
              >
                {isPlaying ? <FaPause size={10} /> : <FaPlay size={10} />}
              </button>
              <div className="w-px h-3 bg-white/10 mx-1" />
              {/* Speed Control */}
              <button
                onClick={() =>
                  setPlaybackSpeed((prev) => Math.max(prev - 0.25, 0.5))
                }
                className="text-gray-400 hover:text-white text-[10px] font-bold px-1"
                title="↓ to decrease speed"
              >
                −
              </button>
              <span className="text-[10px] font-bold text-blue-400 min-w-[28px] text-center">
                {playbackSpeed}x
              </span>
              <button
                onClick={() =>
                  setPlaybackSpeed((prev) => Math.min(prev + 0.25, 2))
                }
                className="text-gray-400 hover:text-white text-[10px] font-bold px-1"
                title="↑ to increase speed"
              >
                +
              </button>
              <div className="w-px h-3 bg-white/10 mx-1" />
              <button
                onClick={() => setAudioLang("hindi")}
                className={`text-[10px] font-bold ${audioLang === "hindi" ? "text-white" : "text-gray-500"}`}
                title="M to toggle language"
              >
                HI
              </button>
              <button
                onClick={() => setAudioLang("english")}
                className={`text-[10px] font-bold ${audioLang === "english" ? "text-white" : "text-gray-500"}`}
                title="M to toggle language"
              >
                EN
              </button>
              <audio
                ref={audioRef}
                src={currentPartAudioUrl || currentAudioUrl}
                onEnded={() => setIsPlaying(false)}
                className="hidden"
              />
            </div>
          )}

          {canEdit && (
            <>
              <button
                onClick={() => setShowGlobalUpload(!showGlobalUpload)}
                className={`p-2 rounded-full transition-all ${showGlobalUpload ? "bg-blue-500 text-white" : "hover:bg-white/10 text-gray-400"}`}
                title="Upload Global Audio"
              >
                <FaGlobe size={14} />
              </button>
              <button
                onClick={() => setEditMode(!editMode)}
                className={`p-2 rounded-full transition-all ${editMode ? "bg-purple-500 text-white" : "hover:bg-white/10 text-gray-400"}`}
              >
                <FaEdit size={14} />
              </button>
            </>
          )}

          <button
            onClick={() => setShowSidebar(!showSidebar)}
            className={`p-2 rounded-full transition-colors ${showSidebar ? "bg-white/10 text-white" : "hover:bg-white/10 text-gray-400"}`}
          >
            <FaList size={14} />
          </button>
        </div>
      </header>

      {/* Global Upload Popup */}
      {showGlobalUpload && (
        <div className="absolute top-16 right-20 z-50 bg-[#1c1c1e] border border-white/10 rounded-xl p-5 shadow-2xl w-80">
          <h3 className="text-white text-sm font-bold mb-4 flex items-center gap-2">
            <FaGlobe className="text-blue-400" />
            Global Voice Note
          </h3>
          <div className="space-y-4">
            {/* Hindi Audio */}
            <div className="bg-black/30 rounded-lg p-3">
              <label className="text-xs text-gray-400 block mb-2 font-medium">
                Hindi Audio
              </label>
              {audioHindiUrl && !pendingHindiFile ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 bg-green-500/10 rounded-lg px-3 py-2 border border-green-500/20">
                    <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center">
                      <span className="text-green-400 text-xs">✓</span>
                    </div>
                    <span className="text-xs text-green-400 flex-1">
                      Audio uploaded
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        const audioPreview = new Audio(audioHindiUrl);
                        audioPreview.play();
                      }}
                      className="flex-1 px-3 py-1.5 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 text-xs font-medium rounded-lg transition-all flex items-center justify-center gap-1"
                    >
                      <FaPlay size={8} /> Preview
                    </button>
                    <label className="flex-1 px-3 py-1.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 text-xs font-medium rounded-lg cursor-pointer transition-all flex items-center justify-center gap-1">
                      <FaEdit size={10} /> Change
                      <input
                        type="file"
                        accept="audio/*"
                        className="hidden"
                        onChange={(e) => setPendingHindiFile(e.target.files[0])}
                      />
                    </label>
                  </div>
                </div>
              ) : (
                <>
                  <input
                    type="file"
                    accept="audio/*"
                    className="text-white text-xs w-full mb-2"
                    onChange={(e) => setPendingHindiFile(e.target.files[0])}
                  />
                  {pendingHindiFile && (
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-green-400 truncate flex-1">
                        {pendingHindiFile.name}
                      </span>
                      <div className="flex gap-1 ml-2">
                        <button
                          onClick={() => setPendingHindiFile(null)}
                          className="px-2 py-1 bg-gray-600 hover:bg-gray-500 text-white text-xs rounded-lg"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() =>
                            handleGlobalUpload(pendingHindiFile, "hindi")
                          }
                          disabled={loading}
                          className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white text-xs font-bold rounded-lg disabled:opacity-50"
                        >
                          {loading ? "..." : "Save"}
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* English Audio */}
            <div className="bg-black/30 rounded-lg p-3">
              <label className="text-xs text-gray-400 block mb-2 font-medium">
                English Audio
              </label>
              {audioEnglishUrl && !pendingEnglishFile ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 bg-green-500/10 rounded-lg px-3 py-2 border border-green-500/20">
                    <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center">
                      <span className="text-green-400 text-xs">✓</span>
                    </div>
                    <span className="text-xs text-green-400 flex-1">
                      Audio uploaded
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        const audioPreview = new Audio(audioEnglishUrl);
                        audioPreview.play();
                      }}
                      className="flex-1 px-3 py-1.5 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 text-xs font-medium rounded-lg transition-all flex items-center justify-center gap-1"
                    >
                      <FaPlay size={8} /> Preview
                    </button>
                    <label className="flex-1 px-3 py-1.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 text-xs font-medium rounded-lg cursor-pointer transition-all flex items-center justify-center gap-1">
                      <FaEdit size={10} /> Change
                      <input
                        type="file"
                        accept="audio/*"
                        className="hidden"
                        onChange={(e) =>
                          setPendingEnglishFile(e.target.files[0])
                        }
                      />
                    </label>
                  </div>
                </div>
              ) : (
                <>
                  <input
                    type="file"
                    accept="audio/*"
                    className="text-white text-xs w-full mb-2"
                    onChange={(e) => setPendingEnglishFile(e.target.files[0])}
                  />
                  {pendingEnglishFile && (
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-green-400 truncate flex-1">
                        {pendingEnglishFile.name}
                      </span>
                      <div className="flex gap-1 ml-2">
                        <button
                          onClick={() => setPendingEnglishFile(null)}
                          className="px-2 py-1 bg-gray-600 hover:bg-gray-500 text-white text-xs rounded-lg"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() =>
                            handleGlobalUpload(pendingEnglishFile, "english")
                          }
                          disabled={loading}
                          className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white text-xs font-bold rounded-lg disabled:opacity-50"
                        >
                          {loading ? "..." : "Save"}
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Multi-Part Audio Section */}
            <div className="border-t border-white/10 pt-4 mt-4">
              <h4 className="text-white text-xs font-bold mb-3 flex items-center gap-2">
                <span className="text-purple-400">📚</span>
                Multi-Part Audio ({animation?.parts?.length || 2} Parts)
              </h4>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {(animation?.parts || [
                  { partNumber: 1, name: "Part 1", startScene: 1, endScene: Math.ceil(totalSteps / 2), icon: "📚" },
                  { partNumber: 2, name: "Part 2", startScene: Math.ceil(totalSteps / 2) + 1, endScene: totalSteps, icon: "📖" },
                ]).map((part) => {
                  const existingPart = partAudios.find(p => p.partNumber === part.partNumber);
                  const hasPartAudio = existingPart?.audioHindiUrl;
                  
                  return (
                    <div key={part.partNumber} className="bg-black/30 rounded-lg p-2 flex items-center gap-2">
                      <span className="text-lg">{part.icon}</span>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs text-white font-medium truncate">{part.name}</div>
                        <div className="text-[10px] text-gray-500">Scenes {part.startScene}-{part.endScene}</div>
                      </div>
                      {hasPartAudio ? (
                        <div className="flex items-center gap-1">
                          <span className="text-green-400 text-xs">✓</span>
                          <button
                            onClick={() => {
                              const audio = new Audio(existingPart.audioHindiUrl);
                              audio.play();
                            }}
                            className="px-2 py-1 bg-blue-500/20 text-blue-400 text-[10px] rounded"
                          >
                            ▶
                          </button>
                        </div>
                      ) : (
                        <input
                          type="text"
                          placeholder="Paste audio URL..."
                          className="flex-1 max-w-[120px] px-2 py-1 text-[10px] bg-black/50 border border-white/10 rounded text-white placeholder-gray-500"
                          onBlur={(e) => {
                            if (e.target.value) {
                              handlePartAudioUpload(part.partNumber, part, e.target.value);
                            }
                          }}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && e.target.value) {
                              handlePartAudioUpload(part.partNumber, part, e.target.value);
                            }
                          }}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Close button */}
            <button
              onClick={() => {
                setShowGlobalUpload(false);
                setPendingHindiFile(null);
                setPendingEnglishFile(null);
              }}
              className="w-full py-2 bg-gray-700 hover:bg-gray-600 text-white text-xs font-bold rounded-lg mt-2"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* 🍎 MAIN LAYOUT */}
      <div className="flex-1 flex overflow-hidden">
        {/* ... Sidebar and Stage Implementation (Keep Existing Logic, mainly just added keyboard listener context to stage) ... */}
        {/* SIDEBAR (Navigator) - Optimized Overlay for Landscape */}
        <AnimatePresence initial={false}>
          {showSidebar && (
            <motion.aside
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 280, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              className="border-r border-white/5 bg-[#000000]/95 backdrop-blur-xl flex flex-col absolute inset-y-0 left-0 z-30 landscape:static md:landscape:static h-full"
            >
              <div className="p-4 border-b border-white/5 flex items-center justify-between">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                  Outline
                </span>
                <button
                  onClick={() => setShowSidebar(false)}
                  className="text-gray-500 hover:text-white transition-colors"
                >
                  <FaArrowLeft size={10} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-2 space-y-1">
                {/* Part-based grouping - use animation's parts or partAudios */}
                {(hasMultiPartAudio ? partAudios : (animation?.parts || [
                  { partNumber: 1, name: "Part 1", startScene: 1, endScene: Math.ceil(totalSteps / 2), icon: "📚" },
                  { partNumber: 2, name: "Part 2", startScene: Math.ceil(totalSteps / 2) + 1, endScene: totalSteps, icon: "📖" },
                ])).map((part, partIdx) => {
                  const partName = part.partName || part.name;
                  // Calculate if current step is within this part's range
                  const isCurrentPart = currentStep >= part.startScene && currentStep <= part.endScene;
                  const partSteps = normalizedSteps.slice(part.startScene - 1, part.endScene);
                  const hasPartAudio = part.audioHindiUrl || part.audioEnglishUrl;
                  
                  return (
                    <div key={partIdx} className="mb-2">
                      {/* Part Header */}
                      <div 
                        className={`px-3 py-2 rounded-lg flex items-center gap-2 cursor-pointer transition-all ${
                          isCurrentPart 
                            ? "bg-blue-500/10 border border-blue-500/30" 
                            : "hover:bg-white/5"
                        }`}
                        onClick={() => goToStep(part.startScene)}
                      >
                        <span className="text-lg">{part.icon || "📚"}</span>
                        <div className="flex-1 min-w-0">
                          <div className={`text-xs font-bold truncate ${isCurrentPart ? "text-blue-400" : "text-gray-400"}`}>
                            {partName}
                          </div>
                          <div className="text-[10px] text-gray-600">
                            Steps {part.startScene}-{part.endScene}
                            {hasPartAudio && <span className="ml-1 text-green-400">🎧</span>}
                          </div>
                        </div>
                        {isCurrentPart && (
                          <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                        )}
                      </div>
                      
                      {/* Steps within part (show only for current part) */}
                      {isCurrentPart && (
                        <div className="ml-4 mt-1 space-y-0.5 border-l border-white/10 pl-2">
                          {partSteps.map((step, stepIdx) => {
                            const stepNum = part.startScene + stepIdx;
                            const sData = slideData.find((s) => s.stepNumber === stepNum);
                            const isHidden = sData?.isHidden;
                            const isActive = currentStep === stepNum;

                            if (isHidden && !canEdit) return null;

                            return (
                              <button
                                key={stepNum}
                                onClick={() => goToStep(stepNum)}
                                className={`w-full text-left px-3 py-2 rounded-lg flex items-center justify-between transition-all ${
                                  isActive
                                    ? "bg-[#1c1c1e] text-white"
                                    : "text-gray-500 hover:text-gray-300 hover:bg-white/5"
                                }`}
                              >
                                <div className="flex flex-col gap-0.5 min-w-0">
                                  <span className={`text-[9px] font-bold uppercase tracking-wider ${isActive ? "text-blue-500" : "text-gray-600"}`}>
                                    {String(stepNum).padStart(2, "0")}
                                  </span>
                                  <span className="text-xs font-medium truncate">
                                    {step.title || `Scene ${stepNum}`}
                                  </span>
                                </div>
                                {sData?.notes?.content && (
                                  <div className="w-1.5 h-1.5 rounded-full bg-purple-500 flex-shrink-0" />
                                )}
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* STAGE */}
        <main className="flex-1 relative flex flex-col bg-black">
          {/* Edit Controls */}
          {editMode && (
            <div className="absolute top-6 left-1/2 -translate-x-1/2 z-40 bg-[#1c1c1e]/80 backdrop-blur-xl border border-white/10 p-1.5 rounded-full flex gap-1 shadow-2xl">
              <button
                onClick={isRecording ? stopRecording : startRecording}
                className={`p-3 rounded-full transition-all ${isRecording ? "bg-red-500 text-white" : "hover:bg-white/10 text-white"}`}
              >
                <FaMicrophone />
              </button>
              <label className="p-3 rounded-full hover:bg-white/10 cursor-pointer text-white">
                <FaUpload />
                <input
                  type="file"
                  accept="audio/*"
                  className="hidden"
                  onChange={(e) => handleVoiceUpload(e.target.files[0])}
                />
              </label>
              <button
                onClick={() => setShowNoteCard(true)}
                className="p-3 rounded-full hover:bg-white/10 text-purple-400"
              >
                <FaStickyNote />
              </button>
              <button
                onClick={toggleVisibility}
                className={`p-3 rounded-full ${currentData.isHidden ? "text-red-500" : "hover:bg-white/10 text-gray-400"}`}
              >
                {currentData.isHidden ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          )}

          <div
            className="flex-1 overflow-hidden relative"
            onClick={(e) => {
              // Handle Double Tap Logic inside Click
              handleMobileTap(e);
              // Fallback single click logic (if not double tap handled?)
              // Actually we want single click to toggle play, but double tap to seek.
              // A simple way: execute single click logic directly. Double tap will just seek ON TOP of it (might pause briefly then seek). 
              // Perfect YouTube behavior is slightly delayed single click, but immediate response is snappier.
              // Let's just run play/pause for now. 
               
              // Check if it's a center tap or we want to allow play/pause always
              if (hasAudio) {
                 // Debouncing play/pause might be needed if we want strict YouTube styling, but for now simple:
                 setIsPlaying(!isPlaying);
              } else {
                 handleNext();
              }
            }}
            onTouchEnd={(e) => {
               // Also handle touch end for taps to be responsive
               // handleMobileTap(e); // Removing this duplicate call as onClick handles mostly everything, 
               // but for strict mobile we might use onTouchStart/End.
               // Let's stick to onClick for simplicity as it covers both pointer types usually.
            }}
          >
            {/* Double Tap Feedback Overlay */}
            <AnimatePresence>
              {doubleTapFeedback && (
                 <motion.div
                   initial={{ opacity: 0 }}
                   animate={{ opacity: 1 }}
                   exit={{ opacity: 0 }}
                   className={`absolute inset-y-0 w-1/3 flex items-center justify-center pointer-events-none z-50 bg-white/10 ${doubleTapFeedback === 'left' ? 'left-0 rounded-r-[50%]' : 'right-0 rounded-l-[50%]'}`}
                 >
                   <div className="flex flex-col items-center justify-center text-white drop-shadow-md">
                     <motion.div
                       initial={{ scale: 0.5, opacity: 0 }}
                       animate={{ 
                         scale: [0.8, 1.2, 1], 
                         opacity: [0, 1, 0] 
                       }}
                       transition={{ duration: 0.6 }}
                     >
                       <span className="text-4xl font-bold">{doubleTapFeedback === 'left' ? '« 10s' : '10s »'}</span>
                     </motion.div>
                   </div>
                 </motion.div>
              )}
            </AnimatePresence>
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="w-full h-full"
              >
                {CurrentStepComponent && <CurrentStepComponent />}
              </motion.div>
            </AnimatePresence>

            {/* Inline Note Panel - Premium Apple-style Design with Golden Accents */}
            <AnimatePresence>
              {currentData?.notes?.content && showNotePanel && !editMode && (
                <motion.div
                  initial={{ opacity: 0, x: 40, scale: 0.95 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: 40, scale: 0.95 }}
                  transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
                  className="absolute top-4 right-4 bottom-24 z-30 w-80"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div
                    className="h-full flex flex-col rounded-2xl overflow-hidden shadow-2xl relative"
                    style={{
                      background: "rgba(28, 28, 30, 0.95)",
                      backdropFilter: "blur(40px)",
                      WebkitBackdropFilter: "blur(40px)",
                      border: "1px solid rgba(255, 215, 0, 0.15)",
                    }}
                  >
                    {/* Golden Shine Effect - Top Edge */}
                    <div
                      className="absolute top-0 left-0 right-0 h-[2px]"
                      style={{
                        background:
                          "linear-gradient(90deg, transparent 0%, #FFD700 20%, #FFC125 50%, #FFD700 80%, transparent 100%)",
                        opacity: 0.8,
                      }}
                    />

                    {/* Subtle Golden Glow */}
                    <div
                      className="absolute -top-20 -right-20 w-40 h-40 rounded-full pointer-events-none"
                      style={{
                        background:
                          "radial-gradient(circle, rgba(255, 215, 0, 0.08) 0%, transparent 70%)",
                      }}
                    />

                    {/* Premium Header with Golden Accent */}
                    <div
                      className="px-5 py-4 flex items-center justify-between relative"
                      style={{
                        background:
                          "linear-gradient(180deg, rgba(255, 215, 0, 0.05) 0%, rgba(255,255,255,0.02) 100%)",
                        borderBottom: "1px solid rgba(255, 215, 0, 0.1)",
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-8 h-8 rounded-xl flex items-center justify-center shadow-lg relative overflow-hidden"
                          style={{
                            background:
                              "linear-gradient(135deg, #B8860B 0%, #FFD700 50%, #DAA520 100%)",
                            boxShadow: "0 4px 16px rgba(255, 215, 0, 0.35)",
                          }}
                        >
                          {/* Inner shine */}
                          <div
                            className="absolute inset-0"
                            style={{
                              background:
                                "linear-gradient(135deg, rgba(255,255,255,0.3) 0%, transparent 50%)",
                            }}
                          />
                          <span className="text-black font-bold text-sm relative z-10">
                            {currentStep}
                          </span>
                        </div>
                        <div>
                          <h3
                            className="font-semibold text-sm tracking-tight"
                            style={{
                              background:
                                "linear-gradient(90deg, #FFD700, #FFC125)",
                              WebkitBackgroundClip: "text",
                              WebkitTextFillColor: "transparent",
                              backgroundClip: "text",
                            }}
                          >
                            Teacher's Note
                          </h3>
                          <p className="text-white/40 text-[10px] font-medium tracking-wide uppercase">
                            Step {currentStep} of {totalSteps}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        {/* Edit Button - Only for Admin/Team */}
                        {canEdit && (
                          <button
                            onClick={() => setShowNoteCard(true)}
                            className="p-2 rounded-lg hover:bg-amber-500/20 text-amber-400/70 hover:text-amber-400 transition-all"
                            title="Edit Note"
                          >
                            <FaEdit size={13} />
                          </button>
                        )}
                        <button
                          onClick={() => setShowFullscreenNote(true)}
                          className="p-2 rounded-lg hover:bg-white/10 text-white/50 hover:text-white transition-all"
                          title="Expand Note"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <polyline points="15 3 21 3 21 9"></polyline>
                            <polyline points="9 21 3 21 3 15"></polyline>
                            <line x1="21" y1="3" x2="14" y2="10"></line>
                            <line x1="3" y1="21" x2="10" y2="14"></line>
                          </svg>
                        </button>
                        <button
                          onClick={() => setShowNotePanel(false)}
                          className="p-2 rounded-lg hover:bg-white/10 text-white/50 hover:text-white transition-all"
                          title="Hide Panel"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                          </svg>
                        </button>
                      </div>
                    </div>

                    {/* Scrollable Content */}
                    <div
                      className="flex-1 overflow-y-auto px-5 py-4"
                      style={{
                        scrollbarWidth: "thin",
                        scrollbarColor: "rgba(255, 215, 0, 0.3) transparent",
                      }}
                    >
                      <p
                        className="leading-relaxed"
                        style={{
                          fontFamily:
                            "'SF Pro Text', 'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
                          fontSize: "15px",
                          fontWeight: 400,
                          color: "rgba(255, 255, 255, 0.92)",
                          letterSpacing: "-0.01em",
                          lineHeight: 1.7,
                          whiteSpace: "pre-wrap",
                          textRendering: "optimizeLegibility",
                          WebkitFontSmoothing: "antialiased",
                        }}
                      >
                        {currentData.notes.content}
                      </p>
                      {currentData.notes.imageUrl && (
                        <div
                          className="mt-4 rounded-xl overflow-hidden"
                          style={{
                            border: "1px solid rgba(255, 215, 0, 0.15)",
                          }}
                        >
                          <img
                            src={currentData.notes.imageUrl}
                            alt="Note illustration"
                            className="w-full h-auto object-cover"
                          />
                        </div>
                      )}
                    </div>

                    {/* Premium Footer with Golden Accent */}
                    <div
                      className="px-5 py-3 flex items-center justify-between relative"
                      style={{
                        background: "rgba(255, 215, 0, 0.03)",
                        borderTop: "1px solid rgba(255, 215, 0, 0.1)",
                      }}
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className="w-5 h-5 rounded-md flex items-center justify-center relative overflow-hidden"
                          style={{
                            background:
                              "linear-gradient(135deg, #B8860B, #FFD700)",
                          }}
                        >
                          <span className="text-[9px] font-black text-black">
                            M
                          </span>
                        </div>
                        <span
                          className="text-[11px] font-medium"
                          style={{ color: "rgba(255, 215, 0, 0.5)" }}
                        >
                          Medha Learning
                        </span>
                      </div>
                      <div
                        className="text-[10px] font-semibold px-2.5 py-1 rounded-md"
                        style={{
                          background:
                            "linear-gradient(135deg, rgba(255, 215, 0, 0.15), rgba(218, 165, 32, 0.1))",
                          color: "#FFD700",
                          border: "1px solid rgba(255, 215, 0, 0.2)",
                        }}
                      >
                        ✦ Premium Note
                      </div>
                    </div>

                    {/* Golden Shine Effect - Bottom Edge */}
                    <div
                      className="absolute bottom-0 left-0 right-0 h-[1px]"
                      style={{
                        background:
                          "linear-gradient(90deg, transparent 0%, rgba(255, 215, 0, 0.3) 50%, transparent 100%)",
                      }}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Floating Show Note Button - When panel is hidden */}
            {currentData?.notes?.content && !showNotePanel && !editMode && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8, x: 20 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={(e) => {
                  e.stopPropagation();
                  setShowNotePanel(true);
                }}
                className="absolute top-4 right-4 z-30 flex items-center gap-2 px-4 py-2.5 rounded-full transition-all"
                style={{
                  background: "rgba(28, 28, 30, 0.9)",
                  backdropFilter: "blur(20px)",
                  border: "1px solid rgba(255, 215, 0, 0.2)",
                  boxShadow:
                    "0 8px 32px rgba(0, 0, 0, 0.4), 0 0 20px rgba(255, 215, 0, 0.1)",
                }}
                title="Show Note"
              >
                <FaStickyNote size={14} style={{ color: "#FFD700" }} />
                <span
                  className="text-xs font-semibold"
                  style={{
                    background: "linear-gradient(90deg, #FFD700, #FFC125)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  View Note
                </span>
              </motion.button>
            )}
          </div>

          {/* AUDIO-SYNCED PLAYER CONTROLS */}
          <div className="bg-black px-6 py-4 z-30">
            {/* Current Part Indicator (for multi-part audio) */}
            {hasMultiPartAudio && partAudios[currentPartIndex] && (
              <div className="flex items-center justify-between mb-3 px-2">
                <div className="flex items-center gap-2">
                  <span className="text-lg">
                    {partAudios[currentPartIndex]?.partName?.includes("Exception") ? "🛡️" :
                     partAudios[currentPartIndex]?.partName?.includes("Template") ? "📐" :
                     partAudios[currentPartIndex]?.partName?.includes("Stream") ? "🌊" :
                     partAudios[currentPartIndex]?.partName?.includes("File") ? "📁" : "📚"}
                  </span>
                  <div>
                    <div className="text-xs text-white font-semibold">
                      {partAudios[currentPartIndex]?.partName || `Part ${currentPartIndex + 1}`}
                    </div>
                    <div className="text-[10px] text-gray-500">
                      Part {currentPartIndex + 1} of {partAudios.length} • Scenes {partAudios[currentPartIndex]?.startScene}-{partAudios[currentPartIndex]?.endScene}
                    </div>
                  </div>
                </div>
                {isPlaying && (
                  <div className="flex items-center gap-1">
                    <div className="w-1 h-3 bg-blue-500 rounded-full animate-pulse" />
                    <div className="w-1 h-4 bg-blue-400 rounded-full animate-pulse" style={{animationDelay: "0.1s"}} />
                    <div className="w-1 h-2 bg-blue-500 rounded-full animate-pulse" style={{animationDelay: "0.2s"}} />
                  </div>
                )}
              </div>
            )}
            
            {/* Audio Progress Bar (clickable to seek) */}
            {hasAudio && (
              <div className="mb-3">
                <div
                  className="relative h-2 bg-[#1c1c1e] rounded-full overflow-hidden cursor-pointer group"
                  onClick={(e) => {
                    if (!audioRef.current) return;
                    const rect = e.currentTarget.getBoundingClientRect();
                    const percent = (e.clientX - rect.left) / rect.width;
                    const newTime = percent * audioDuration;
                    audioRef.current.currentTime = newTime;
                    setAudioCurrentTime(newTime);
                    // Also update scene to match
                    const targetScene = getSceneFromAudioTime(newTime);
                    setCurrentStep(targetScene);
                  }}
                >
                  {/* Section markers */}
                  {audioSections?.map((section, i) => (
                    <div
                      key={i}
                      className="absolute top-0 bottom-0 border-l border-white/20"
                      style={{
                        left: `${(section.audioStart / audioDuration) * 100}%`,
                      }}
                      title={section.name}
                    />
                  ))}
                  {/* Progress fill */}
                  <motion.div
                    className="h-full bg-gradient-to-r from-blue-600 to-blue-400 rounded-full"
                    style={{
                      width: `${(audioCurrentTime / audioDuration) * 100}%`,
                    }}
                  />
                  {/* Hover indicator */}
                  <div className="absolute inset-0 bg-blue-400/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                {/* Time display */}
                <div className="flex justify-between mt-1 text-[10px] text-gray-500 font-mono">
                  <span>{formatTime(audioCurrentTime)}</span>
                  <span>{formatTime(audioDuration)}</span>
                </div>
              </div>
            )}

            <div className="flex items-center gap-3">
              {/* Audio Play/Pause Button */}
              {hasAudio && (
                <button
                  onClick={() => {
                    setIsPlaying(!isPlaying);
                    if (!isPlaying && audioSyncMode) {
                      // When starting playback in sync mode, sync to current scene first
                      syncSceneToAudio(currentStep);
                    }
                  }}
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                    isPlaying
                      ? "bg-blue-500 text-white shadow-[0_0_20px_rgba(59,130,246,0.5)]"
                      : "bg-[#1c1c1e] text-white hover:bg-white/10 border border-white/10"
                  }`}
                  title="Play/Pause Audio"
                >
                  {isPlaying ? (
                    <FaPause size={14} />
                  ) : (
                    <FaPlay size={14} className="ml-0.5" />
                  )}
                </button>
              )}

              {/* Sync Mode Toggle */}
              {hasAudio && (
                <button
                  onClick={() => setAudioSyncMode(!audioSyncMode)}
                  className={`px-3 py-1.5 rounded-full text-[10px] font-bold transition-all border ${
                    audioSyncMode
                      ? "bg-green-500/20 text-green-400 border-green-500/50"
                      : "text-gray-500 border-white/10 hover:text-white hover:bg-white/10"
                  }`}
                  title="Sync slides with audio"
                >
                  {audioSyncMode ? "🔗 SYNCED" : "🔗 SYNC"}
                </button>
              )}

              {/* Prev Button */}
              <button
                onClick={() => {
                  handlePrev();
                  if (audioSyncMode && hasAudio) {
                    syncSceneToAudio(currentStep - 1);
                  }
                }}
                disabled={currentStep === 1}
                className="text-white hover:text-blue-500 disabled:opacity-20 transition-colors"
              >
                <FaChevronLeft size={16} />
              </button>

              {/* Scene Progress Tabs */}
              <div className="flex-1 flex gap-0.5 h-1.5 bg-[#1c1c1e] rounded-full overflow-hidden">
                {normalizedSteps.map((_, i) => {
                  const step = i + 1;
                  const isPast = step < currentStep;
                  const isCurrent = step === currentStep;
                  return (
                    <button
                      key={i}
                      onClick={() => {
                        goToStep(step);
                        if (audioSyncMode && hasAudio) {
                          syncSceneToAudio(step);
                        }
                      }}
                      className={`h-full transition-all duration-300 ${
                        isPast
                          ? "bg-white"
                          : isCurrent
                            ? "bg-blue-400"
                            : "bg-transparent"
                      } hover:bg-blue-400/50`}
                      style={{ flex: 1 }}
                    />
                  );
                })}
              </div>

              {/* Next Button */}
              <button
                onClick={() => {
                  handleNext();
                  if (audioSyncMode && hasAudio) {
                    syncSceneToAudio(currentStep + 1);
                  }
                }}
                disabled={currentStep === totalSteps}
                className="text-white hover:text-blue-500 disabled:opacity-20 transition-colors"
              >
                <FaChevronRight size={16} />
              </button>

              {/* Speed Control for Audio */}
              {hasAudio && (
                <div className="flex items-center gap-0.5 ml-1">
                  {[0.5, 1, 1.5, 2].map((speed) => (
                    <button
                      key={speed}
                      onClick={() => {
                        setPlaybackSpeed(speed);
                        if (audioRef.current) {
                          audioRef.current.playbackRate = speed;
                        }
                      }}
                      className={`px-1.5 py-0.5 rounded text-[9px] font-bold transition-all ${
                        playbackSpeed === speed
                          ? "bg-blue-500 text-white"
                          : "text-gray-600 hover:text-white hover:bg-white/10"
                      }`}
                    >
                      {speed}x
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Info Row */}
            <div className="flex justify-between mt-2 text-[10px] font-bold tracking-widest text-gray-600 uppercase">
              <span className="flex items-center gap-2">
                Scene {currentStep} / {totalSteps}
                {isPlaying && audioSyncMode && (
                  <span className="text-green-400 normal-case tracking-normal flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                    Audio Synced
                  </span>
                )}
              </span>
              <span className="truncate max-w-[200px]">
                {currentStepObj.title}
              </span>
            </div>
          </div>
        </main>
      </div>

      <SlideNoteCard
        isOpen={showNoteCard}
        onClose={() => setShowNoteCard(false)}
        note={currentData.notes || {}}
        onSave={handleSaveNote}
        onImageUpload={handleNoteImageUpload}
        isEditable={canEdit}
        stepNumber={currentStep}
      />

      {/* Premium Fullscreen Note Viewer */}
      <AnimatePresence>
        {showFullscreenNote && currentData?.notes?.content && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[100000] flex items-center justify-center"
            style={{
              background: "rgba(0, 0, 0, 0.95)",
              backdropFilter: "blur(30px)",
            }}
            onClick={() => setShowFullscreenNote(false)}
          >
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <motion.div
                className="absolute top-1/4 -left-32 w-96 h-96 rounded-full"
                style={{
                  background:
                    "radial-gradient(circle, rgba(255, 215, 0, 0.08) 0%, transparent 70%)",
                }}
                animate={{
                  x: [0, 50, 0],
                  y: [0, 30, 0],
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
              <motion.div
                className="absolute bottom-1/4 -right-32 w-80 h-80 rounded-full"
                style={{
                  background:
                    "radial-gradient(circle, rgba(255, 215, 0, 0.06) 0%, transparent 70%)",
                }}
                animate={{
                  x: [0, -40, 0],
                  y: [0, -20, 0],
                }}
                transition={{
                  duration: 10,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            </div>

            <motion.div
              initial={{ scale: 0.9, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-3xl mx-4 max-h-[85vh] flex flex-col"
            >
              {/* Premium Card */}
              <div
                className="relative rounded-3xl overflow-hidden shadow-2xl flex flex-col"
                style={{
                  background:
                    "linear-gradient(145deg, rgba(28, 28, 30, 0.98) 0%, rgba(20, 20, 22, 0.99) 100%)",
                  border: "1px solid rgba(255, 215, 0, 0.2)",
                  boxShadow:
                    "0 50px 100px -20px rgba(0, 0, 0, 0.7), 0 0 60px rgba(255, 215, 0, 0.1)",
                }}
              >
                {/* Golden Top Border Glow */}
                <div
                  className="absolute top-0 left-0 right-0 h-[3px]"
                  style={{
                    background:
                      "linear-gradient(90deg, transparent 0%, #FFD700 30%, #FFC125 50%, #FFD700 70%, transparent 100%)",
                  }}
                />

                {/* Shine Effect */}
                <motion.div
                  className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden rounded-3xl"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <motion.div
                    className="absolute -top-1/2 -left-1/2 w-full h-full"
                    style={{
                      background:
                        "linear-gradient(45deg, transparent 30%, rgba(255, 215, 0, 0.03) 50%, transparent 70%)",
                    }}
                    animate={{
                      x: ["0%", "200%"],
                      y: ["0%", "200%"],
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  />
                </motion.div>

                {/* Premium Header */}
                <div
                  className="px-8 py-6 flex items-center justify-between relative"
                  style={{
                    background:
                      "linear-gradient(180deg, rgba(255, 215, 0, 0.08) 0%, rgba(255,255,255,0.02) 100%)",
                    borderBottom: "1px solid rgba(255, 215, 0, 0.15)",
                  }}
                >
                  <div className="flex items-center gap-4">
                    {/* Step Badge */}
                    <motion.div
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{
                        delay: 0.2,
                        type: "spring",
                        stiffness: 200,
                      }}
                      className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-2xl relative overflow-hidden"
                      style={{
                        background:
                          "linear-gradient(135deg, #B8860B 0%, #FFD700 50%, #DAA520 100%)",
                        boxShadow: "0 8px 32px rgba(255, 215, 0, 0.4)",
                      }}
                    >
                      <div
                        className="absolute inset-0"
                        style={{
                          background:
                            "linear-gradient(135deg, rgba(255,255,255,0.4) 0%, transparent 50%)",
                        }}
                      />
                      <span className="text-black font-black text-xl relative z-10">
                        {currentStep}
                      </span>
                    </motion.div>
                    <div>
                      <motion.h2
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                        className="font-bold text-2xl tracking-tight"
                        style={{
                          background:
                            "linear-gradient(90deg, #FFD700, #FFC125, #FFE066)",
                          WebkitBackgroundClip: "text",
                          WebkitTextFillColor: "transparent",
                          backgroundClip: "text",
                        }}
                      >
                        Teacher's Note
                      </motion.h2>
                      <motion.p
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 }}
                        className="text-white/50 text-sm font-medium tracking-wide mt-1"
                      >
                        Step {currentStep} of {totalSteps} •{" "}
                        {currentStepObj.title || "Lecture Content"}
                      </motion.p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Edit Button for Admin/Team */}
                    {canEdit && (
                      <motion.button
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.5 }}
                        onClick={() => {
                          setShowFullscreenNote(false);
                          setShowNoteCard(true);
                        }}
                        className="p-3 rounded-xl hover:bg-amber-500/20 text-amber-400/70 hover:text-amber-400 transition-all"
                        title="Edit Note"
                      >
                        <FaEdit size={18} />
                      </motion.button>
                    )}
                    {/* Close Button */}
                    <motion.button
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.5 }}
                      onClick={() => setShowFullscreenNote(false)}
                      className="p-3 rounded-xl hover:bg-white/10 text-white/60 hover:text-white transition-all"
                    >
                      <FaTimes size={18} />
                    </motion.button>
                  </div>
                </div>

                {/* Content Area */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="flex-1 overflow-y-auto px-8 py-8"
                  style={{
                    maxHeight: "50vh",
                    scrollbarWidth: "thin",
                    scrollbarColor: "rgba(255, 215, 0, 0.3) transparent",
                  }}
                >
                  <p
                    className="leading-relaxed"
                    style={{
                      fontFamily:
                        "'SF Pro Text', 'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
                      fontSize: "18px",
                      fontWeight: 400,
                      color: "rgba(255, 255, 255, 0.95)",
                      letterSpacing: "-0.01em",
                      lineHeight: 1.8,
                      whiteSpace: "pre-wrap",
                      textRendering: "optimizeLegibility",
                      WebkitFontSmoothing: "antialiased",
                    }}
                  >
                    {currentData.notes.content}
                  </p>

                  {/* Image */}
                  {currentData.notes.imageUrl && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                      className="mt-8 rounded-2xl overflow-hidden"
                      style={{
                        border: "1px solid rgba(255, 215, 0, 0.2)",
                        boxShadow: "0 20px 40px rgba(0, 0, 0, 0.3)",
                      }}
                    >
                      <img
                        src={currentData.notes.imageUrl}
                        alt="Note illustration"
                        className="w-full h-auto object-cover"
                      />
                    </motion.div>
                  )}
                </motion.div>

                {/* Premium Footer */}
                <div
                  className="px-8 py-5 flex items-center justify-between relative"
                  style={{
                    background: "rgba(255, 215, 0, 0.04)",
                    borderTop: "1px solid rgba(255, 215, 0, 0.12)",
                  }}
                >
                  <div className="flex items-center gap-3">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.6, type: "spring" }}
                      className="w-8 h-8 rounded-lg flex items-center justify-center relative overflow-hidden"
                      style={{
                        background: "linear-gradient(135deg, #B8860B, #FFD700)",
                      }}
                    >
                      <span className="text-xs font-black text-black">M</span>
                    </motion.div>
                    <span
                      className="text-sm font-medium"
                      style={{ color: "rgba(255, 215, 0, 0.6)" }}
                    >
                      Medha Learning
                    </span>
                  </div>

                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 }}
                    className="text-sm font-semibold px-4 py-2 rounded-xl"
                    style={{
                      background:
                        "linear-gradient(135deg, rgba(255, 215, 0, 0.15), rgba(218, 165, 32, 0.1))",
                      color: "#FFD700",
                      border: "1px solid rgba(255, 215, 0, 0.25)",
                    }}
                  >
                    ✦ Premium Content
                  </motion.div>
                </div>

                {/* Bottom Golden Glow */}
                <div
                  className="absolute bottom-0 left-0 right-0 h-[2px]"
                  style={{
                    background:
                      "linear-gradient(90deg, transparent 0%, rgba(255, 215, 0, 0.4) 50%, transparent 100%)",
                  }}
                />
              </div>

              {/* Keyboard Hint */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="mt-4 text-center"
              >
                <span className="text-white/30 text-xs">
                  Press{" "}
                  <kbd className="px-2 py-0.5 bg-white/10 rounded text-white/50 mx-1">
                    ESC
                  </kbd>{" "}
                  or click outside to close
                </span>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Text Chatbot - AI Assistant with full context */}
      <AnimationTextChatbot
        animationTitle={title || animation?.metadata?.title || animationId}
        currentStep={currentStep}
        totalSteps={totalSteps}
        slideNotes={
          slideData.find((s) => s.stepNumber === currentStep)?.notes || ""
        }
        animationId={animationId}
        isVisible={!showIntro}
        currentSlideTitle={
          normalizedSteps[currentStep - 1]?.title || `Step ${currentStep}`
        }
        currentSlideContent={
          normalizedSteps[currentStep - 1]?.contentText || ""
        }
        animationSubject={
          animation?.metadata?.subject || "Object Oriented Programming"
        }
        animationTopics={animation?.metadata?.topics || []}
        sectionName={
          audioSections?.find(
            (s) => currentStep >= s.startScene && currentStep <= s.endScene
          )?.name || ""
        }
      />

      {/* Voice Chatbot - kept for future use
      <VoiceChatbot
        animationTitle={title || animation?.metadata?.title || animationId}
        currentStep={currentStep}
        totalSteps={totalSteps}
        isVisible={!showIntro}
      />
      */}

      {/* Audio Sync Tool for Admins */}
      {canEdit && (
        <>
          {/* Floating Audio Sync Button */}
          <button
            onClick={() => {
              if (audioRef.current) audioRef.current.pause();
              setIsPlaying(false);
              setIsAutoPlaying(false); // Stop any auto-play loop
              setShowAudioSyncTool(true);
            }}
            className="fixed bottom-[170px] right-6 w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-white flex items-center justify-center shadow-lg hover:scale-110 transition-transform z-[9999]"
            title="Audio Sync Tool"
          >
            <FaMusic size={18} />
          </button>

          <AudioSyncTool
            isOpen={showAudioSyncTool}
            onClose={() => setShowAudioSyncTool(false)}
            animationId={animationId}
            totalSlides={totalSteps}
            currentStep={currentStep}
            onStepChange={setCurrentStep}
          />
        </>
      )}
    </motion.div>,
    document.body
  );
};

export default MedhaAnimationViewer;
