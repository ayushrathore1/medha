import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaPlay, 
  FaPause, 
  FaExpand, 
  FaCompress,
  FaVolumeUp, 
  FaVolumeMute,
  FaHeart,
  FaRegHeart,
  FaTimes,
  FaBackward,
  FaForward
} from 'react-icons/fa';

/**
 * MedhaVideoPlayer - Premium YouTube-style video player
 * Features: 10s skip, speed control, fullscreen, likes
 */
const MedhaVideoPlayer = ({ 
  videoUrl, 
  videoId, // YouTube video ID
  title,
  isOpen,
  onClose,
  onLike,
  isLiked,
  likeCount,
  onView
}) => {
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const progressRef = useRef(null);
  const hideControlsTimer = useRef(null);
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [showControls, setShowControls] = useState(true);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);

  const speeds = [0.5, 0.75, 1, 1.25, 1.5, 2];

  // Track view when video starts playing
  useEffect(() => {
    if (isPlaying && onView) {
      onView();
    }
  }, [isPlaying]);

  // Reset controls timer
  const resetControlsTimer = useCallback(() => {
    setShowControls(true);
    if (hideControlsTimer.current) {
      clearTimeout(hideControlsTimer.current);
    }
    if (isPlaying) {
      hideControlsTimer.current = setTimeout(() => {
        setShowControls(false);
      }, 3000);
    }
  }, [isPlaying]);

  // Mouse move handler
  const handleMouseMove = () => {
    resetControlsTimer();
  };

  // Keyboard shortcuts
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      const video = videoRef.current;
      if (!video) return;

      switch (e.code) {
        case 'Space':
          e.preventDefault();
          togglePlay();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          skipBackward();
          break;
        case 'ArrowRight':
          e.preventDefault();
          skipForward();
          break;
        case 'ArrowUp':
          e.preventDefault();
          setVolume(prev => Math.min(1, prev + 0.1));
          break;
        case 'ArrowDown':
          e.preventDefault();
          setVolume(prev => Math.max(0, prev - 0.1));
          break;
        case 'KeyF':
          e.preventDefault();
          toggleFullscreen();
          break;
        case 'KeyM':
          e.preventDefault();
          setIsMuted(prev => !prev);
          break;
        case 'Escape':
          if (isFullscreen) {
            document.exitFullscreen();
          } else {
            onClose();
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isFullscreen]);

  // Fullscreen change handler
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
    } else {
      video.play();
    }
    setIsPlaying(!isPlaying);
  };

  const skipForward = () => {
    if (videoRef.current) {
      videoRef.current.currentTime += 10;
    }
  };

  const skipBackward = () => {
    if (videoRef.current) {
      videoRef.current.currentTime -= 10;
    }
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;

    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const handleProgressClick = (e) => {
    const rect = progressRef.current.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    if (videoRef.current) {
      videoRef.current.currentTime = percent * duration;
    }
  };

  const handleSpeedChange = (speed) => {
    setPlaybackRate(speed);
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
    }
    setShowSpeedMenu(false);
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  // Check if it's a YouTube video
  const isYouTube = !!videoId;

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          ref={containerRef}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="relative w-full max-w-5xl mx-4 bg-slate-900 rounded-2xl overflow-hidden shadow-2xl"
          onClick={(e) => e.stopPropagation()}
          onMouseMove={handleMouseMove}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 p-2 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors"
          >
            <FaTimes size={20} />
          </button>

          {/* Video Title */}
          <AnimatePresence>
            {showControls && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="absolute top-0 left-0 right-0 z-10 p-6 bg-gradient-to-b from-black/80 to-transparent"
              >
                <h2 className="text-white text-xl font-bold pr-12">{title}</h2>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Video Container */}
          <div className="relative aspect-video bg-black">
            {isYouTube ? (
              <iframe
                src={`https://www.youtube.com/embed/${videoId}?enablejsapi=1&modestbranding=1&rel=0`}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <>
                <video
                  ref={videoRef}
                  src={videoUrl}
                  className="w-full h-full"
                  onTimeUpdate={handleTimeUpdate}
                  onLoadedMetadata={handleLoadedMetadata}
                  onWaiting={() => setIsBuffering(true)}
                  onPlaying={() => setIsBuffering(false)}
                  onEnded={() => setIsPlaying(false)}
                  volume={volume}
                  muted={isMuted}
                />

                {/* Buffering Spinner */}
                {isBuffering && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 border-4 border-white/20 border-t-white rounded-full animate-spin" />
                  </div>
                )}

                {/* Center Play Button */}
                <AnimatePresence>
                  {showControls && !isBuffering && (
                    <motion.button
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      onClick={togglePlay}
                      className="absolute inset-0 flex items-center justify-center"
                    >
                      <div className="p-6 bg-indigo-600/80 rounded-full hover:bg-indigo-600 transition-colors">
                        {isPlaying ? (
                          <FaPause size={32} className="text-white" />
                        ) : (
                          <FaPlay size={32} className="text-white ml-1" />
                        )}
                      </div>
                    </motion.button>
                  )}
                </AnimatePresence>

                {/* Controls Bar */}
                <AnimatePresence>
                  {showControls && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 20 }}
                      className="absolute bottom-0 left-0 right-0 z-10 bg-gradient-to-t from-black/90 via-black/60 to-transparent pt-16 pb-4 px-4"
                    >
                      {/* Progress Bar */}
                      <div
                        ref={progressRef}
                        className="relative h-1 bg-white/30 rounded-full cursor-pointer mb-4 group"
                        onClick={handleProgressClick}
                      >
                        <div
                          className="absolute top-0 left-0 h-full bg-indigo-500 rounded-full transition-all"
                          style={{ width: `${progressPercent}%` }}
                        />
                        <div
                          className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-indigo-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          style={{ left: `${progressPercent}%`, transform: 'translate(-50%, -50%)' }}
                        />
                      </div>

                      {/* Control Buttons */}
                      <div className="flex items-center justify-between gap-4">
                        {/* Left Controls */}
                        <div className="flex items-center gap-3">
                          {/* Skip Backward */}
                          <button
                            onClick={skipBackward}
                            className="p-2 text-white hover:text-indigo-400 transition-colors flex items-center gap-1"
                            title="Rewind 10s (←)"
                          >
                            <FaBackward size={16} />
                            <span className="text-xs font-bold">10</span>
                          </button>

                          {/* Play/Pause */}
                          <button
                            onClick={togglePlay}
                            className="p-2 text-white hover:text-indigo-400 transition-colors"
                            title="Play/Pause (Space)"
                          >
                            {isPlaying ? <FaPause size={20} /> : <FaPlay size={20} />}
                          </button>

                          {/* Skip Forward */}
                          <button
                            onClick={skipForward}
                            className="p-2 text-white hover:text-indigo-400 transition-colors flex items-center gap-1"
                            title="Forward 10s (→)"
                          >
                            <span className="text-xs font-bold">10</span>
                            <FaForward size={16} />
                          </button>

                          {/* Volume */}
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => setIsMuted(!isMuted)}
                              className="p-2 text-white hover:text-indigo-400 transition-colors"
                              title="Mute (M)"
                            >
                              {isMuted || volume === 0 ? <FaVolumeMute size={18} /> : <FaVolumeUp size={18} />}
                            </button>
                            <input
                              type="range"
                              min="0"
                              max="1"
                              step="0.1"
                              value={isMuted ? 0 : volume}
                              onChange={(e) => {
                                setVolume(parseFloat(e.target.value));
                                setIsMuted(false);
                              }}
                              className="w-20 h-1 accent-indigo-500"
                            />
                          </div>

                          {/* Time */}
                          <span className="text-white text-sm font-medium">
                            {formatTime(currentTime)} / {formatTime(duration)}
                          </span>
                        </div>

                        {/* Right Controls */}
                        <div className="flex items-center gap-3">
                          {/* Like Button */}
                          <button
                            onClick={onLike}
                            className="flex items-center gap-2 px-3 py-1.5 bg-white/10 rounded-full hover:bg-white/20 transition-colors"
                          >
                            {isLiked ? (
                              <FaHeart size={16} className="text-red-500" />
                            ) : (
                              <FaRegHeart size={16} className="text-white" />
                            )}
                            <span className="text-white text-sm font-medium">{likeCount || 0}</span>
                          </button>

                          {/* Speed Control */}
                          <div className="relative">
                            <button
                              onClick={() => setShowSpeedMenu(!showSpeedMenu)}
                              className="px-3 py-1.5 bg-white/10 rounded-full text-white text-sm font-bold hover:bg-white/20 transition-colors"
                            >
                              {playbackRate}x
                            </button>
                            
                            <AnimatePresence>
                              {showSpeedMenu && (
                                <motion.div
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  exit={{ opacity: 0, y: 10 }}
                                  className="absolute bottom-full right-0 mb-2 bg-slate-800 rounded-xl overflow-hidden shadow-xl border border-white/10"
                                >
                                  {speeds.map((speed) => (
                                    <button
                                      key={speed}
                                      onClick={() => handleSpeedChange(speed)}
                                      className={`block w-full px-4 py-2 text-sm font-medium text-left transition-colors ${
                                        playbackRate === speed
                                          ? 'bg-indigo-600 text-white'
                                          : 'text-white/80 hover:bg-white/10'
                                      }`}
                                    >
                                      {speed}x
                                    </button>
                                  ))}
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>

                          {/* Fullscreen */}
                          <button
                            onClick={toggleFullscreen}
                            className="p-2 text-white hover:text-indigo-400 transition-colors"
                            title="Fullscreen (F)"
                          >
                            {isFullscreen ? <FaCompress size={18} /> : <FaExpand size={18} />}
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default MedhaVideoPlayer;
