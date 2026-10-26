/**
 * AudioSyncTool - Admin tool for transcribing audio and saving to database
 * Transcription is auto-saved and used for slide sync
 */
import React, { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { FaTimes, FaSync, FaPlay, FaPause, FaDatabase, FaCheck, FaMicrophone, FaSave, FaRedo, FaForward, FaTrash, FaEdit } from "react-icons/fa";

const AudioSyncTool = ({ isOpen, onClose, animationId, totalSlides = 104, currentStep, onStepChange }) => {
  const [activeTab, setActiveTab] = useState("manual"); // 'auto' | 'manual'
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [transcriptData, setTranscriptData] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [existingTranscript, setExistingTranscript] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);
  
  // Manual Sync State
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSlide, setRecordingSlide] = useState(1); // The slide we are currently "watching" to time the NEXT one
  const [recordedTimings, setRecordedTimings] = useState({}); // { slideNum: startTime }
  const [isPlaying, setIsPlaying] = useState(false);
  
  const audioRef = useRef(null);
  
  const baseUrl = import.meta.env.VITE_BACKEND_URL;

  // Fetch existing transcript and audio on open
  useEffect(() => {
    if (!isOpen || !animationId) return;
    
    const fetchExisting = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `${baseUrl}/api/learn/animation/${animationId}/audio`,
          { headers: token ? { Authorization: `Bearer ${token}` } : {} }
        );
        if (res.data.success) {
          if (res.data.audioTranscript) {
            setExistingTranscript(res.data.audioTranscript);
          }
          if (res.data.manualSlideTimings) {
            setRecordedTimings(res.data.manualSlideTimings);
          }
          // Set audio URL (Hindi default for now)
          setAudioUrl(res.data.audioHindiUrl || res.data.audioEnglishUrl);
        }
      } catch (err) {
        console.log("No existing transcript");
      }
    };
    fetchExisting();
  }, [isOpen, animationId, baseUrl]);

  // Track request status to prevent double-firing
  const isTranscribingRef = useRef(false);

  // Auto-transcribe logic
  const autoTranscribe = async () => {
    if (isTranscribingRef.current || isTranscribing) return;
    
    isTranscribingRef.current = true;
    setIsTranscribing(true);
    setError(null);
    setSuccess(null);
    
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        `${baseUrl}/api/learn/animation/${animationId}/transcribe`,
        { language: "hi" },
        {
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          timeout: 180000,
        }
      );
      
      if (res.data.success) {
        setTranscriptData(res.data.audioTranscript);
        setExistingTranscript(res.data.audioTranscript);
        setSuccess(`Transcribed ${res.data.segmentCount} segments and saved to database!`);
      } else {
        throw new Error(res.data.message || "Transcription failed");
      }
    } catch (err) {
      console.error("Transcription error:", err);
      setError(err.response?.data?.message || err.message || "Failed to transcribe");
    } finally {
      isTranscribingRef.current = false;
      setIsTranscribing(false);
    }
  };

  // Manual Recording Logic
  const startRecording = (fromSlide = 1) => {
    setIsRecording(true);
    setIsPlaying(true);
    setRecordingSlide(fromSlide);
    
    // Sync main viewer
    if (onStepChange) onStepChange(fromSlide);

    if (audioRef.current) {
      // If valid existing timing, seek to it
      const startTime = recordedTimings[fromSlide.toString()] || 0;
      audioRef.current.currentTime = startTime;
      audioRef.current.play();
    }
  };

  const stopRecording = () => {
    setIsRecording(false);
    setIsPlaying(false);
    if (audioRef.current) {
      audioRef.current.pause();
    }
  };
  
  const recordNextSlide = useCallback(() => {
    if (!isRecording || !audioRef.current) return;
    
    const nextSlide = recordingSlide + 1;
    if (nextSlide > totalSlides) {
      stopRecording();
      return;
    }
    
    const currentTime = audioRef.current.currentTime;
    
    // Save timing for next slide
    setRecordedTimings(prev => ({
      ...prev,
      [nextSlide.toString()]: currentTime
    }));
    
    // Advance internal state
    setRecordingSlide(nextSlide);
    
    // Advance main viewer to show the new slide
    if (onStepChange) onStepChange(nextSlide);
    
  }, [isRecording, recordingSlide, totalSlides, onStepChange]);

  // Keyboard shortcut for recording (Spacebar)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === "Space" && isRecording) {
        e.preventDefault();
        recordNextSlide();
      }
      if (e.code === "Escape" && isRecording) {
        e.preventDefault();
        stopRecording();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isRecording, recordNextSlide]);

  const saveManualTimings = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${baseUrl}/api/learn/animation/${animationId}/timings`,
        { timings: recordedTimings },
        { headers: token ? { Authorization: `Bearer ${token}` } : {} }
      );
      setSuccess(`Saved timings for ${Object.keys(recordedTimings).length} slides!`);
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError("Failed to save timings");
    }
  };
  
  const deleteTiming = (slideNum) => {
    setRecordedTimings(prev => {
      const newTimings = { ...prev };
      delete newTimings[slideNum.toString()];
      return newTimings;
    });
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!isOpen) return null;

  const displayTranscript = transcriptData || existingTranscript;

  return (
    <>
      {/* Persistent Audio Player */}
      {audioUrl && (
        <audio 
          ref={audioRef} 
          src={audioUrl} 
          onEnded={() => setIsPlaying(false)}
          className="hidden" 
        />
      )}

      {/* VISUAL RECORDING MODE (Compact Bar) */}
      {isRecording ? (
        <div className="fixed inset-x-0 bottom-0 z-[100000] p-6 flex justify-center pointer-events-none">
          <div className="bg-[#1c1c1e]/90 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl p-6 w-full max-w-2xl pointer-events-auto flex items-center gap-6">
            {/* Status */}
            <div className="flex-1">
              <div className="text-red-400 font-bold text-sm tracking-wider uppercase mb-1 flex items-center gap-2">
                 <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"/> Recording
              </div>
              <div className="text-white text-2xl font-bold">
                Current Slide: <span className="text-blue-400">{recordingSlide}</span>
              </div>
              <p className="text-gray-400 text-xs">Tap Spacebar when Next Slide starts</p>
            </div>
            
            {/* Big Button */}
            <button
              onClick={recordNextSlide}
              className="h-20 px-8 bg-blue-500 hover:bg-blue-600 active:scale-95 text-white rounded-xl font-bold text-xl shadow-lg transition-all flex items-center gap-3"
            >
              <FaForward /> NEXT SLIDE
            </button>
            
            {/* Stop Button */}
            <button
              onClick={stopRecording}
              className="h-20 w-20 bg-gray-800 hover:bg-gray-700 text-red-400 rounded-xl flex flex-col items-center justify-center gap-1 border border-white/10"
            >
              <div className="w-4 h-4 rounded-sm bg-red-500" />
              <span className="text-xs font-bold">STOP</span>
            </button>
          </div>
        </div>
      ) : (
        /* STANDARD MODAL MODE */
        <div 
          className="fixed inset-0 z-[100000] flex items-center justify-center bg-black/80 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-[#1c1c1e] rounded-2xl border border-white/10 w-[90vw] max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col"
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/10 bg-gradient-to-r from-blue-500/10 to-purple-500/10">
              <div>
                <h2 className="text-white font-bold text-lg">🎵 Audio Sync Tool</h2>
                <p className="text-gray-400 text-xs">Manage synchronization for animation slides</p>
              </div>
              <button onClick={onClose} className="text-gray-400 hover:text-white p-2">
                <FaTimes size={18} />
              </button>
            </div>
            
            {/* Tabs */}
            <div className="flex border-b border-white/10">
              <button
                onClick={() => setActiveTab("manual")}
                className={`flex-1 py-3 text-sm font-semibold transition-colors ${
                  activeTab === "manual" ? "bg-white/10 text-white border-b-2 border-blue-500" : "text-gray-400 hover:text-white"
                }`}
              >
                🔴 Record Timings (Manual)
              </button>
              <button
                onClick={() => setActiveTab("auto")}
                className={`flex-1 py-3 text-sm font-semibold transition-colors ${
                  activeTab === "auto" ? "bg-white/10 text-white border-b-2 border-purple-500" : "text-gray-400 hover:text-white"
                }`}
              >
                🤖 AI Auto-Sync
              </button>
            </div>
            
            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">

          {activeTab === "manual" && (
            <div className="space-y-6">
              {/* Start Recording Block */}
              <div className="bg-white/5 p-6 rounded-xl border border-white/10 text-center">
                <div className="mb-4">
                  <h3 className="text-xl font-bold text-white mb-2">Record Timings</h3>
                  <p className="text-gray-400 text-sm max-w-lg mx-auto">
                    Press Start to play audio and see slides. Tap <b>Spacebar</b> or <b>Next</b> whenever the slide should change.
                  </p>
                </div>
                
                <button
                  onClick={() => startRecording(1)}
                  disabled={!audioUrl}
                  className="px-8 py-4 bg-red-500 hover:bg-red-600 text-white rounded-full font-bold text-lg shadow-lg shadow-red-500/20 transition-all flex items-center gap-3 mx-auto disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FaPlay /> Start Recording from Beginning
                </button>
              </div>
              
              {/* Recorded Data List */}
              <div className="bg-black/30 rounded-xl p-4 border border-white/5 flex flex-col h-[400px]">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-gray-300 font-semibold">
                    Recorded Slides ({Object.keys(recordedTimings).length})
                  </h4>
                  <button
                    onClick={saveManualTimings}
                    disabled={Object.keys(recordedTimings).length === 0}
                    className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm font-bold flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <FaSave /> Save Timings
                  </button>
                </div>
                
                {/* Scrollable List */}
                <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-2">
                  {Object.entries(recordedTimings)
                    .sort((a,b) => Number(a[0]) - Number(b[0]))
                    .map(([slide, time]) => (
                    <div 
                      key={slide} 
                      className="bg-white/5 hover:bg-white/10 p-3 rounded-lg border border-white/5 flex items-center justify-between group transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-8 h-8 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-sm">
                          {slide}
                        </div>
                        <div>
                          <div className="text-gray-300 text-sm font-mono">{formatTime(time)}</div>
                          <div className="text-xs text-gray-500">Starts at {time.toFixed(2)}s</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => startRecording(Number(slide))}
                          className="p-2 hover:bg-blue-500/20 text-blue-400 rounded-lg transition-colors"
                          title="Record starting from this slide"
                        >
                          <FaRedo size={14} /> Re-record from here
                        </button>
                        <button
                          onClick={() => deleteTiming(slide)}
                          className="p-2 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors"
                          title="Delete timing"
                        >
                          <FaTrash size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                  
                  {Object.keys(recordedTimings).length === 0 && (
                    <div className="text-center text-gray-500 py-10">
                      No timings recorded yet. Click Start Recording!
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === "auto" && (
            <div className="space-y-6">
              <div className="bg-white/5 p-6 rounded-xl border border-white/10">
                <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                  <FaDatabase className="text-purple-400" />
                  AI Auto-Transcription
                </h3>
                  <p className="text-gray-400 text-sm mb-4">
                  Uses Whisper AI to transcribe audio and automatically map slides based on actual visible content similarity.
                </p>
                
                <button
                  onClick={autoTranscribe}
                  disabled={isTranscribing}
                  className={`w-full py-4 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${
                    !isTranscribing
                      ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-500 hover:to-purple-500 shadow-lg"
                      : "bg-gray-700 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  {isTranscribing ? (
                    <>
                      <FaSync className="animate-spin" />
                      Transcribing... (1-2 mins)
                    </>
                  ) : (
                    <>
                      <FaDatabase />
                      Transcribe & Save to Database
                    </>
                  )}
                </button>
              </div>

              {/* Transcript Display */}
              {displayTranscript && (
                <div>
                  <h3 className="text-white font-semibold mb-2 flex items-center gap-2">
                    Transcript Segments ({displayTranscript.segments?.length || 0})
                  </h3>
                  <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                    {displayTranscript.segments?.map((segment, i) => (
                      <div
                        key={segment.id || i}
                        className="p-3 rounded-lg border bg-black/30 border-white/5 flex gap-3"
                      >
                         <div className="flex flex-col gap-1 min-w-[80px]">
                          <span className="text-blue-400 text-xs font-mono bg-blue-500/10 px-2 py-1 rounded text-center">
                            {formatTime(segment.start)}
                          </span>
                          <span className="text-purple-400 text-xs font-bold bg-purple-500/10 px-2 py-1 rounded text-center">
                            Slide {segment.slideNumber}
                          </span>
                        </div>
                        <p className="text-gray-300 text-sm">{segment.text}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
          
          {/* Messages */}
          {error && (
            <div className="mt-4 text-red-400 text-sm bg-red-500/10 p-3 rounded-lg border border-red-500/20">
              ❌ {error}
            </div>
          )}
          
          {success && (
            <div className="mt-4 text-green-400 text-sm bg-green-500/10 p-3 rounded-lg border border-green-500/20 flex items-center gap-2">
              <FaCheck /> {success}
            </div>
          )}
        </div>
      </motion.div>
    </div>
    )}
    </>
  );
};

export default AudioSyncTool;
