import React, { useState, useRef, useEffect, useCallback } from 'react';
import ReactDOM from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Document, Page, pdfjs } from 'react-pdf';
import { 
  FaTimes,
  FaExpand,
  FaCompress,
  FaChevronLeft,
  FaChevronRight,
  FaSearchPlus,
  FaSearchMinus,
  FaDownload,
  FaPen,
  FaHighlighter,
  FaEraser,
  FaUndo,
  FaTh,
  FaMagic,
  FaPlay,
  FaPause,
  FaVolumeUp,
  FaImage,
  FaGripVertical,
  FaForward,
  FaBackward
} from 'react-icons/fa';

// Configure PDF.js worker using Vite's ?url import
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url
).toString();

/**
 * MedhaPDFViewer - Premium PDF viewer with presentation mode and annotations
 * Features: Slide navigation, zoom, fullscreen, drawing tools, download
 */
const MedhaPDFViewer = ({
  pdfUrl,
  title,
  isOpen,
  onClose,
  pageCount: initialPageCount,
  audioHindiUrl,
  audioEnglishUrl
}) => {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  const audioRef = useRef(null);
  
  const [numPages, setNumPages] = useState(initialPageCount || 0);
  const [currentPage, setCurrentPage] = useState(1);
  const [scale, setScale] = useState(0.8);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showThumbnails, setShowThumbnails] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Annotation states
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawingTool, setDrawingTool] = useState(null); // 'pen', 'highlighter', 'eraser', 'laser'
  const [drawingColor, setDrawingColor] = useState('#4f46e5');
  const [annotations, setAnnotations] = useState({}); // Store annotations per page
  const [currentPath, setCurrentPath] = useState([]);
  
  // Laser pointer state
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  
  // Audio player state
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioLang, setAudioLang] = useState('hindi'); // 'hindi' or 'english'
  const [audioProgress, setAudioProgress] = useState(0);
  const [audioDuration, setAudioDuration] = useState(0);
  const [audioCurrentTime, setAudioCurrentTime] = useState(0);
  
  const hasAudio = audioHindiUrl || audioEnglishUrl;
  const currentAudioUrl = audioLang === 'hindi' ? audioHindiUrl : audioEnglishUrl;
  
  // Helper to format seconds as mm:ss
  const formatTime = (seconds) => {
    if (!seconds || isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Navigation functions with bounds checking
  const goToNextPage = useCallback(() => {
    setCurrentPage(prev => {
      if (prev < numPages) return prev + 1;
      return prev;
    });
  }, [numPages]);

  const goToPrevPage = useCallback(() => {
    setCurrentPage(prev => {
      if (prev > 1) return prev - 1;
      return prev;
    });
  }, []);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      switch (e.code) {
        case 'ArrowLeft':
        case 'ArrowUp':
        case 'PageUp':
          e.preventDefault();
          goToPrevPage();
          break;
        case 'ArrowRight':
        case 'ArrowDown':
        case 'Space':
        case 'PageDown':
          e.preventDefault();
          goToNextPage();
          break;
        case 'KeyF':
          e.preventDefault();
          toggleFullscreen();
          break;
        case 'Escape':
          if (isFullscreen) {
            document.exitFullscreen();
          } else if (drawingTool) {
            setDrawingTool(null);
          } else {
            onClose();
          }
          break;
        case 'Home':
          e.preventDefault();
          setCurrentPage(1);
          break;
        case 'End':
          e.preventDefault();
          setCurrentPage(numPages);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, numPages, isFullscreen, drawingTool, goToNextPage, goToPrevPage]);

  // Fullscreen change handler
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const onDocumentLoadSuccess = useCallback(({ numPages: pages }) => {
    setNumPages(pages);
    setIsLoading(false);
  }, []);

  const onDocumentLoadError = (err) => {
    console.error('PDF load error:', err);
    setError('Failed to load PDF');
    setIsLoading(false);
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;

    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  const zoomIn = () => {
    setScale(prev => Math.min(3, prev + 0.25));
  };

  const zoomOut = () => {
    setScale(prev => Math.max(0.5, prev - 0.25));
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = pdfUrl;
    link.download = `${title || 'document'}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Wheel zoom handler
  // Ref for the viewer container to attach non-passive event listeners
  const viewerRef = useRef(null);

  useEffect(() => {
    const element = viewerRef.current;
    if (element) {
      const onWheel = (e) => {
        if (e.ctrlKey) {
          e.preventDefault();
          const delta = e.deltaY * -0.01;
          setScale(prev => Math.min(Math.max(0.5, prev + delta), 4));
        }
      };
      
      // Attach with passive: false to allow preventDefault()
      element.addEventListener('wheel', onWheel, { passive: false });
      return () => element.removeEventListener('wheel', onWheel);
    }
  }, []);

  // Drawing handlers
  const handleMouseMove = (e) => {
    // Update cursor position for laser tool
    if (drawingTool === 'laser') {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      setCursorPos({ x, y });
    }

    // Handle drawing
    if (isDrawing && drawingTool && drawingTool !== 'laser') {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      setCurrentPath(prev => [...prev, { x, y }]);
    }
  };

  const startDrawing = (e) => {
    if (!drawingTool || drawingTool === 'laser') return; // Laser doesn't draw
    setIsDrawing(true);
    const rect = e.target.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setCurrentPath([{ x, y }]);
  };

  const stopDrawing = () => {
    if (!isDrawing || !drawingTool || drawingTool === 'laser' || currentPath.length === 0) {
      setIsDrawing(false);
      return;
    }

    // Save annotation for current page
    setAnnotations(prev => ({
      ...prev,
      [currentPage]: [
        ...(prev[currentPage] || []),
        {
          path: currentPath,
          tool: drawingTool,
          color: drawingColor
        }
      ]
    }));

    setCurrentPath([]);
    setIsDrawing(false);
  };

  const clearAnnotations = () => {
    setAnnotations(prev => ({
      ...prev,
      [currentPage]: []
    }));
  };

  const getToolStyles = () => {
    switch (drawingTool) {
      case 'pen':
        return { strokeWidth: 2, opacity: 1 };
      case 'highlighter':
        return { strokeWidth: 20, opacity: 0.3 };
      case 'eraser':
        return { strokeWidth: 30, opacity: 1, color: 'white' };
      default:
        return { strokeWidth: 2, opacity: 1 };
    }
  };

  if (!isOpen) return null;

  return ReactDOM.createPortal(
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[99999] bg-black/95 backdrop-blur-md flex flex-col items-center justify-center p-2 sm:p-4"
        onClick={onClose}
      >
        {/* Main Floating Container */}
        <motion.div
          ref={containerRef}
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className={`relative w-full h-full flex flex-col overflow-hidden transition-all duration-500 ${
            isFullscreen ? 'rounded-none' : 'rounded-2xl shadow-2xl ring-1 ring-white/10'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          
          {/* MAIN CONTENT AREA (Rendered First) */}
          <div className="flex-1 flex overflow-hidden bg-[#111] relative">
            
            {/* Left: Thumbnails Sidebar (Glassmorphism) */}
            <AnimatePresence>
               {showThumbnails && (
                 <motion.div
                   initial={{ width: 0, opacity: 0 }}
                   animate={{ width: 180, opacity: 1 }}
                   exit={{ width: 0, opacity: 0 }}
                   className="h-full bg-black/20 backdrop-blur-2xl border-r border-white/5 overflow-y-auto z-40"
                 >
                   <div className="p-4 space-y-3">
                     {Array.from({ length: numPages }, (_, i) => (
                        <button
                          key={i}
                          onClick={() => setCurrentPage(i + 1)}
                           className={`w-full group relative aspect-[3/4] rounded-lg overflow-hidden transition-all ${
                             currentPage === i + 1 
                               ? 'ring-2 ring-indigo-500 ring-offset-2 ring-offset-black' 
                               : 'hover:ring-2 hover:ring-white/20'
                           }`}
                        >
                          <Document file={pdfUrl} className="opacity-90 group-hover:opacity-100 transition-opacity">
                            <Page
                              pageNumber={i + 1}
                              width={150}
                              renderTextLayer={false}
                              renderAnnotationLayer={false}
                            />
                          </Document>
                          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-2">
                             <span className="text-[10px] text-white font-medium text-center block">Page {i + 1}</span>
                          </div>
                        </button>
                     ))}
                   </div>
                 </motion.div>
               )}
            </AnimatePresence>

            {/* Center: PDF Canvas */}
            <div className="flex-1 relative flex items-center justify-center overflow-auto p-4 sm:p-8"
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
            >
               {isLoading && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
                  </div>
               )}

               <div
                  ref={viewerRef}
                  className="relative transition-transform duration-200 ease-out origin-center shadow-2xl"
                  style={{ 
                    transform: `scale(${scale})`,
                    cursor: drawingTool === 'laser' ? 'none' : (drawingTool ? 'crosshair' : 'default') 
                  }}
                  onMouseDown={startDrawing}
                  onMouseMove={handleMouseMove}
               >
                  <Document
                    file={pdfUrl}
                    onLoadSuccess={onDocumentLoadSuccess}
                    onLoadError={onDocumentLoadError}
                    loading={null}
                    className="rounded-lg overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)]"
                  >
                    <Page
                      pageNumber={currentPage}
                      scale={1} // Reset base scale, controlled by wrapper
                      renderTextLayer={false}
                      renderAnnotationLayer={false}
                      loading={null}
                    />
                  </Document>

                  {/* SVG Overlay for Annotations */}
                  <svg
                    className="absolute inset-0 pointer-events-none"
                    style={{ width: '100%', height: '100%' }}
                  >
                    {/* Saved Annotations */}
                    {(annotations[currentPage] || []).map((annotation, idx) => (
                      <polyline
                        key={idx}
                        points={annotation.path.map(p => `${p.x},${p.y}`).join(' ')}
                        fill="none"
                        stroke={annotation.tool === 'eraser' ? 'white' : annotation.color}
                        strokeWidth={annotation.tool === 'highlighter' ? 24 : annotation.tool === 'eraser' ? 32 : 3}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        opacity={annotation.tool === 'highlighter' ? 0.4 : 1}
                      />
                    ))}

                    {/* Active Drawing Path */}
                    {currentPath.length > 0 && drawingTool !== 'laser' && (
                       <polyline
                         points={currentPath.map(p => `${p.x},${p.y}`).join(' ')}
                         fill="none"
                         stroke={drawingTool === 'eraser' ? 'white' : drawingColor}
                         strokeWidth={drawingTool === 'highlighter' ? 24 : drawingTool === 'eraser' ? 32 : 3}
                         strokeLinecap="round"
                         strokeLinejoin="round"
                         opacity={drawingTool === 'highlighter' ? 0.4 : 1}
                       />
                    )}

                     {/* Laser Pointer */}
                     {drawingTool === 'laser' && (
                        <>
                          <circle cx={cursorPos.x} cy={cursorPos.y} r={6} fill="#ef4444" className="animate-pulse" />
                          <circle cx={cursorPos.x} cy={cursorPos.y} r={12} fill="#ef4444" fillOpacity={0.3} />
                        </>
                     )}
                  </svg>
               </div>
            </div>
            
            {/* Right: Floating Tools Dock */}
            <div className="absolute right-6 top-1/2 -translate-y-1/2 z-40 hidden sm:flex flex-col gap-3 bg-black/40 backdrop-blur-xl border border-white/10 p-2 rounded-2xl shadow-2xl">
              {[
                { id: 'laser', icon: FaMagic, color: 'text-red-400', label: 'Laser' },
                { id: 'pen', icon: FaPen, color: 'text-indigo-400', label: 'Pen' },
                { id: 'highlighter', icon: FaHighlighter, color: 'text-yellow-400', label: 'Highlight' },
                { id: 'eraser', icon: FaEraser, color: 'text-pink-400', label: 'Eraser' },
              ].map((tool) => (
                <button
                  key={tool.id}
                  onClick={() => setDrawingTool(drawingTool === tool.id ? null : tool.id)}
                  className={`p-3 rounded-xl transition-all group relative ${
                    drawingTool === tool.id 
                       ? 'bg-white text-black shadow-lg scale-110' 
                       : 'text-gray-400 hover:text-white hover:bg-white/10'
                  }`}
                >
                   <tool.icon size={18} className={drawingTool === tool.id ? tool.color.replace('text-', 'text-black ') : ''} />
                   
                   {/* Tooltip */}
                   <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 px-2 py-1 bg-black/80 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                     {tool.label}
                   </span>
                </button>
              ))}

              <div className="h-px bg-white/10 w-full my-1" />

              <button
                 onClick={clearAnnotations}
                 className="p-3 text-gray-400 hover:text-red-400 hover:bg-white/10 rounded-xl transition-all"
                 title="Clear Page"
              >
                <FaUndo size={16} />
              </button>
            </div>
          </div>

          {/* FLOATING HEADER TOOLBAR */}
          <div className="absolute top-0 inset-x-0 z-50 p-2 pointer-events-none">
            <div className="flex items-center justify-between gap-2">
              
              {/* Left: Title & Back */}
              <div className="flex items-center gap-2 pointer-events-auto bg-black/40 backdrop-blur-xl border border-white/10 px-3 py-2 rounded-full shadow-lg">
                 <div className="w-6 h-6 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400">
                   <FaImage size={10} />
                 </div>
                 <h2 className="font-medium truncate max-w-[150px] sm:max-w-xs" style={{ color: '#ffffff' }}>{title}</h2>
              </div>

              {/* Center: Title (Moved here since Audio is gone) */}
               {/* We keep the title on the left as requested? Or center it?
                   The user said "part above the pdf the audio controller and the title... is not visible"
                   We moved them to Portal. Now we are removing Audio from here 
                   so the title can stay left or be centered.
                   Let's keep title left for now to minimize layout shift surprises.
               */}

              {/* Right: Actions */}
              <div className="flex items-center gap-2 pointer-events-auto bg-black/40 backdrop-blur-xl border border-white/10 p-1.5 rounded-full shadow-lg">
                <button
                  onClick={() => setShowThumbnails(!showThumbnails)}
                  className={`p-2 rounded-full transition-all ${showThumbnails ? 'bg-white text-black' : 'text-gray-300 hover:bg-white/10 hover:text-white'}`}
                  title="Toggle Thumbnails"
                >
                  <FaTh size={14} />
                </button>
                <button
                  onClick={handleDownload}
                  className="p-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-full transition-all"
                  title="Download"
                >
                  <FaDownload size={14} />
                </button>
                <button
                  onClick={toggleFullscreen}
                  className="p-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-full transition-all hidden sm:block"
                  title="Fullscreen"
                >
                   {isFullscreen ? <FaCompress size={14} /> : <FaExpand size={14} />}
                </button>
                <div className="w-px h-4 bg-white/20 mx-1" />
                <button
                  onClick={onClose}
                  className="p-2 text-gray-300 hover:text-white hover:bg-red-500/80 rounded-full transition-all"
                  title="Close"
                >
                  <FaTimes size={14} />
                </button>
              </div>
            </div>
          </div>

          {/* FLOATING FOOTER CONTROLS */}
          <div className="absolute bottom-4 inset-x-0 z-50 flex items-center justify-center pointer-events-none">
             <div className="pointer-events-auto flex items-center gap-2 bg-black/60 backdrop-blur-xl border border-white/10 px-4 py-2 rounded-full shadow-2xl transition-transform hover:scale-105">
                
                {/* Previous Page */}
                <button
                   onClick={goToPrevPage}
                   disabled={currentPage === 1}
                   className="p-1.5 rounded-full hover:bg-white/10 text-white disabled:opacity-30 transition-colors"
                >
                   <FaChevronLeft size={14} />
                </button>

                {/* Page Counter */}
                <div className="flex items-center gap-1 px-3 border-x border-white/10">
                   <input
                     type="number"
                     min={1}
                     max={numPages}
                     value={currentPage}
                     onChange={(e) => {
                        const val = parseInt(e.target.value);
                        if (!isNaN(val) && val >= 1 && val <= numPages) setCurrentPage(val);
                     }}
                     className="w-8 bg-transparent text-white text-center font-bold text-sm focus:outline-none"
                   />
                   <span className="text-gray-400 font-medium text-sm">/ {numPages}</span>
                </div>

                {/* Next Page */}
                <button
                   onClick={goToNextPage}
                   disabled={currentPage === numPages}
                   className="p-1.5 rounded-full hover:bg-white/10 text-white disabled:opacity-30 transition-colors"
                >
                   <FaChevronRight size={14} />
                </button>

                {/* Zoom Controls */}
                <div className="flex items-center gap-1 ml-1 pl-3 border-l border-white/10">
                   <button onClick={zoomOut} className="text-gray-400 hover:text-white p-1">
                      <FaSearchMinus size={12} />
                   </button>
                   <span className="text-[10px] font-mono text-indigo-400 w-8 text-center">{Math.round(scale * 100)}%</span>
                   <button onClick={zoomIn} className="text-gray-400 hover:text-white p-1">
                      <FaSearchPlus size={12} />
                   </button>
                </div>
             </div>
          </div>

        </motion.div>

        {/* FLOATING DRAGGABLE AUDIO PLAYER */}
        {hasAudio && (
          <motion.div
            drag
            dragMomentum={false}
            initial={{ opacity: 0, y: -20, x: 0 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            className="fixed top-24 left-1/2 -translate-x-1/2 z-[100000] cursor-grab active:cursor-grabbing"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-black/80 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl p-4 flex flex-col gap-3 min-w-[320px] ring-1 ring-white/5">
              
              {/* Header: Grip & Waves */}
              <div className="flex items-center justify-between">
                 <div className="flex items-center gap-2 text-gray-400">
                    <FaGripVertical />
                    <span className="text-xs font-medium uppercase tracking-wider text-indigo-400">Audio Guide</span>
                 </div>
                 
                 {/* Visualizer Waveform */}
                 <div className="flex items-center gap-0.5 h-4">
                    {[...Array(10)].map((_, i) => (
                      <motion.div
                        key={i}
                        animate={{ 
                          height: isPlaying ? [4, 16, 8, 12, 4] : 4,
                          transition: { 
                            duration: 0.5, 
                            repeat: Infinity, 
                            repeatType: "reverse",
                            delay: i * 0.1 
                          } 
                        }}
                        className={`w-1 rounded-full ${isPlaying ? 'bg-indigo-500' : 'bg-white/10'}`}
                      />
                    ))}
                 </div>
              </div>

              {/* Progress Bar */}
              <div className="space-y-1">
                 <div className="flex justify-between text-[10px] text-gray-400 font-mono">
                    <span>{formatTime(audioCurrentTime)}</span>
                    <span>{formatTime(audioDuration)}</span>
                 </div>
                 <div 
                    className="h-1.5 bg-white/10 rounded-full cursor-pointer relative group overflow-hidden"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (audioRef.current && audioDuration) {
                        const rect = e.currentTarget.getBoundingClientRect();
                        const percent = (e.clientX - rect.left) / rect.width;
                        audioRef.current.currentTime = percent * audioDuration;
                      }
                    }}
                  >
                     <div 
                       className="absolute top-0 left-0 h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full" 
                       style={{ width: `${audioProgress}%` }} 
                     />
                  </div>
              </div>

              {/* Controls Row */}
              <div className="flex items-center justify-between pt-1">
                 
                 {/* Language Toggle */}
                 <div className="flex bg-white/5 rounded-lg p-0.5">
                    <button 
                       onClick={() => { setAudioLang('hindi'); setIsPlaying(false); }}
                       disabled={!audioHindiUrl}
                       className={`text-[10px] font-bold px-2 py-1 rounded transition-colors ${audioLang === 'hindi' ? 'bg-indigo-500/20 text-indigo-300 shadow-sm' : 'text-gray-500 hover:text-gray-300'}`}
                    >HI</button>
                    <button 
                       onClick={() => { setAudioLang('english'); setIsPlaying(false); }}
                       disabled={!audioEnglishUrl}
                       className={`text-[10px] font-bold px-2 py-1 rounded transition-colors ${audioLang === 'english' ? 'bg-indigo-500/20 text-indigo-300 shadow-sm' : 'text-gray-500 hover:text-gray-300'}`}
                    >EN</button>
                 </div>

                 {/* Playback Controls */}
                 <div className="flex items-center gap-3">
                    <button
                       onClick={() => {
                          if (audioRef.current) audioRef.current.currentTime -= 10;
                       }}
                       className="text-gray-400 hover:text-white transition-colors"
                       title="-10s"
                    >
                       <FaBackward size={14} />
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (audioRef.current) {
                          if (isPlaying) audioRef.current.pause();
                          else audioRef.current.play();
                          setIsPlaying(!isPlaying);
                        }
                      }}
                       className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center text-white hover:bg-indigo-400 transition-all shadow-lg hover:shadow-indigo-500/25 hover:scale-105"
                    >
                      {isPlaying ? <FaPause size={12} /> : <FaPlay size={12} className="ml-1" />}
                    </button>

                    <button
                       onClick={() => {
                          if (audioRef.current) audioRef.current.currentTime += 10;
                       }}
                       className="text-gray-400 hover:text-white transition-colors"
                       title="+10s"
                    >
                       <FaForward size={14} />
                    </button>
                 </div>

                 {/* Placeholder for Volume/Expand (Empty to balance flex) */}
                 <div className="w-[68px] flex justify-end">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
                 </div>
              </div>

               {/* Hidden Audio Element */}
               <audio 
                  ref={audioRef}
                  src={currentAudioUrl}
                  onTimeUpdate={(e) => {
                    setAudioCurrentTime(e.target.currentTime);
                    setAudioProgress((e.target.currentTime / e.target.duration) * 100 || 0);
                  }}
                  onLoadedMetadata={(e) => setAudioDuration(e.target.duration)}
                  onEnded={() => setIsPlaying(false)}
               />
            </div>
          </motion.div>
        )}

      </motion.div>,
      document.body
    );
};

export default MedhaPDFViewer;

