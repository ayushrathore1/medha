import React, { useState, useMemo } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { getBarGradient } from "../../utils/unitWeightageUtils";
import { FaYoutube, FaChevronDown, FaXmark, FaBookOpen, FaList, FaImage } from "react-icons/fa6";
import QuestionImageUploader from "./QuestionImageUploader";
import QuestionImageModal from "./QuestionImageModal";
import QuestionAILinks from "./QuestionAILinks";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

// Helper function to convert YouTube playlist URL to embed URL
const getYouTubeEmbedUrl = (url) => {
  if (!url) return null;
  const match = url.match(/[?&]list=([^&]+)/);
  if (match && match[1]) {
    return `https://www.youtube.com/embed/videoseries?list=${match[1]}`;
  }
  return null;
};

const UnitWeightageBar = ({
  unitSerial,
  unitName,
  totalMarks,
  weightagePercentage,
  weightageRatio,
  youtubePlaylistUrl,
  questions = [],
  index = 0,
  subjectName = "",
  year = "",
  isAdmin = false,
  onQuestionsUpdated,
  onLinksUpdated,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [activePlaylistIndex, setActivePlaylistIndex] = useState(0);
  const [viewingImageIdx, setViewingImageIdx] = useState(null);
  const [localQuestions, setLocalQuestions] = useState(questions);

  const barWidth = Math.min(weightagePercentage, 100);

  // Parse multiple playlists (separated by " | "), each as "URL::ChannelName"
  const playlists = useMemo(() => {
    if (!youtubePlaylistUrl) return [];
    return youtubePlaylistUrl.split(" | ").map((entry, idx) => {
      const [url, channelName] = entry.trim().split("::");
      return {
        url: url?.trim(),
        embedUrl: getYouTubeEmbedUrl(url?.trim()),
        label: channelName?.trim() || `Playlist ${idx + 1}`
      };
    }).filter(p => p.embedUrl);
  }, [youtubePlaylistUrl]);

  const handleWatchLecture = (e) => {
    e.stopPropagation();
    if (playlists.length > 0) {
      setActivePlaylistIndex(0);
      setShowVideoModal(true);
    }
  };

  const closeVideoModal = (e) => {
    if (e) e.stopPropagation();
    setShowVideoModal(false);
  };

  const toggleExpand = () => {
    if (questions && questions.length > 0) {
      setIsExpanded(!isExpanded);
    }
  };


  // Handle image update from uploader
  const handleImageUpdated = (qCode, newImageUrl) => {
    setLocalQuestions(prev => 
      prev.map(q => 
        q.qCode === qCode 
          ? { ...q, imageUrl: newImageUrl } 
          : q
      )
    );
    onQuestionsUpdated && onQuestionsUpdated();
  };

  // Close image modal
  const closeImageModal = () => {
    setViewingImageIdx(null);
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4, delay: index * 0.1 }}
        className={`group relative p-6 mb-4 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-default)] shadow-sm hover:shadow-md hover:border-[var(--action-primary)]/50 transition-all ${
          questions.length > 0 ? "cursor-pointer" : ""
        }`}
        onClick={toggleExpand}
      >
        <div className="flex flex-col gap-4">
          {/* Header */}
          <div className="flex justify-between items-start gap-4">
            <div className="flex-1">
               <h4 className="text-lg font-bold text-[var(--text-primary)] mb-2 leading-tight">
                 Unit {unitSerial} <span className="text-[var(--text-tertiary)] font-light mx-2">|</span> {unitName}
               </h4>
               
               <div className="flex flex-wrap items-center gap-3">
                 <span className="text-xs font-bold text-[var(--action-primary)] bg-[var(--action-primary)]/10 px-3 py-1 rounded-full border border-[var(--action-primary)]/20">
                    {totalMarks} Marks • {weightagePercentage.toFixed(1)}% Weightage
                 </span>
                 
                 {youtubePlaylistUrl && (
                    <button
                      onClick={handleWatchLecture}
                      className="flex items-center gap-2 px-3 py-1 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-full transition-colors shadow-sm"
                    >
                      <FaYoutube /> Watch Lecture
                    </button>
                 )}
               </div>
            </div>

            {questions.length > 0 && (
              <div className={`text-[var(--text-tertiary)] transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`}>
                <FaChevronDown />
              </div>
            )}
          </div>

          {/* Progress Bar */}
          <div className="w-full h-2.5 bg-[var(--bg-tertiary)] rounded-full overflow-hidden">
             <motion.div
               initial={{ width: 0 }}
               animate={{ width: `${barWidth}%` }}
               transition={{ duration: 0.8, delay: index * 0.1 + 0.2, ease: "easeOut" }}
               className="h-full rounded-full"
               style={{ background: getBarGradient(weightagePercentage) }}
             />
          </div>
        </div>

        {/* Questions List */}
        <AnimatePresence>
          {isExpanded && localQuestions.length > 0 && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
               <div className="mt-6 pt-6 border-t border-[var(--border-default)] space-y-4" onClick={(e) => e.stopPropagation()}>
                  <div className="flex items-center justify-between">
                    <h5 className="text-xs font-bold text-[var(--text-tertiary)] uppercase tracking-wider flex items-center gap-2">
                      <FaBookOpen /> Past Year Questions ({year})
                    </h5>
                    {isAdmin && (
                      <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded border border-amber-200">
                        Admin Mode
                      </span>
                    )}
                  </div>

                  {localQuestions.map((q, idx) => (
                    <div key={idx} className="bg-[var(--bg-tertiary)] p-4 rounded-xl border border-[var(--border-default)] hover:border-[var(--action-primary)]/50 transition-colors">
                       <div className="flex justify-between items-start mb-3">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-bold text-[var(--action-primary)] text-sm bg-[var(--bg-secondary)] px-2 py-0.5 rounded border border-[var(--action-primary)]/20 shadow-sm">
                               {q.qCode}
                            </span>
                            {q.topic && (
                              <span className="text-xs font-bold text-[var(--action-primary)] bg-[var(--action-primary)]/10 px-2 py-0.5 rounded border border-[var(--action-primary)]/20">
                                 📌 {q.topic}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                             {q.imageUrl && (
                               <span className="flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded border border-emerald-200">
                                 <FaImage className="text-emerald-500" /> Has Image
                               </span>
                             )}
                             <span className="text-xs font-bold text-[var(--text-secondary)] bg-[var(--bg-secondary)] px-2 py-1 rounded border border-[var(--border-default)]">
                                {q.marks} Marks
                             </span>
                          </div>
                       </div>
                       
                       <div 
                         className="prose prose-sm prose-slate max-w-none text-[var(--text-secondary)] mb-4 font-medium leading-relaxed"
                         dangerouslySetInnerHTML={{ __html: q.text }}
                       />


                       {/* Question AI Links Component */}
                       <QuestionAILinks
                         question={q}
                         subjectName={subjectName}
                         year={year}
                         isAdmin={isAdmin}
                         onLinksUpdated={onLinksUpdated}
                       />

                       {/* Admin-only image uploader */}
                       {isAdmin && (
                         <QuestionImageUploader
                           question={q}
                           subjectName={subjectName}
                           year={year}
                           unitSerial={unitSerial}
                           onImageUpdated={handleImageUpdated}
                         />
                       )}
                    </div>
                  ))}
               </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* YouTube Video Player Modal */}
      <AnimatePresence>
        {showVideoModal && playlists.length > 0 && (
          <div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" 
            onClick={closeVideoModal}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-slate-900 rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col overflow-hidden border border-slate-700"
            >
              {/* Modal Header */}
              <div className="flex justify-between items-center p-4 border-b border-slate-700 bg-red-700">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/20 text-white rounded-lg">
                    <FaYoutube size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-lg drop-shadow-md">Video Lectures</h3>
                    <p className="text-sm text-white/90 font-medium drop-shadow-sm">
                      {subjectName} • Unit {unitSerial}: {unitName}
                    </p>
                  </div>
                </div>
                <button 
                  onClick={closeVideoModal} 
                  className="p-2 text-white/80 hover:text-white hover:bg-white/20 rounded-full transition-colors"
                >
                  <FaXmark size={20} />
                </button>
              </div>

              {/* Playlist Tabs (if multiple playlists) */}
              {playlists.length > 1 && (
                <div className="flex gap-2 p-3 bg-slate-800/50 border-b border-slate-700">
                  {playlists.map((playlist, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActivePlaylistIndex(idx)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                        activePlaylistIndex === idx
                          ? "bg-red-600 text-white shadow-lg"
                          : "bg-slate-700 text-slate-300 hover:bg-slate-600"
                      }`}
                    >
                      <FaList size={12} />
                      {playlist.label}
                    </button>
                  ))}
                </div>
              )}

              {/* YouTube Iframe */}
              <div className="w-full h-[60vh] bg-black">
                <iframe
                  src={playlists[activePlaylistIndex]?.embedUrl}
                  title={`${subjectName} - Unit ${unitSerial} Lectures`}
                  className="w-full h-full"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>

              {/* Footer */}
              <div className="p-3 bg-slate-800/50 border-t border-slate-700 text-center space-y-1">
                <p className="text-sm text-white font-semibold">
                  ❤️ Credits: <span className="text-red-400">{playlists[activePlaylistIndex]?.label}</span>
                </p>
                <p className="text-xs text-yellow-400 font-semibold">
                  💡 Click the playlist icon (≡) on top-right of the video to see all videos
                </p>
                <p className="text-xs text-slate-500 font-medium">
                  🎓 Watch lectures directly in MEDHA • <span className="text-slate-400">Powered by YouTube</span>
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Question Image Modal */}
      <QuestionImageModal
        isOpen={viewingImageIdx !== null}
        imageUrl={localQuestions[viewingImageIdx]?.imageUrl}
        questionCode={localQuestions[viewingImageIdx]?.qCode}
        onClose={closeImageModal}
      />
    </>
  );
};

export default UnitWeightageBar;
