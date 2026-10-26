/**
 * VisualizeConcepts - "The Compiler's Atelier" (Apple Edition)
 * True Black. High Energy.
 */
import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import {
  FaMagic,
  FaPlay,
  FaCode,
  FaLayerGroup,
  FaMicrochip,
  FaArrowRight,
  FaEye,
  FaSearch,
  FaTimes,
} from "react-icons/fa";
import { getAllAnimations } from "./animations";
import MedhaAnimationViewer from "./MedhaAnimationViewer";

const APPLE_THEME = {
  bg: "#000000",
  surface: "#1c1c1e",
  surfaceHover: "#2c2c2e",
  primary: "#0A84FF", // System Blue
  secondary: "#BF5AF2", // System Purple
  text: "#F5F5F7",
  textSec: "#86868B",
  border: "rgba(255, 255, 255, 0.1)",
};

const VisualizeConcepts = () => {
  const navigate = useNavigate();
  const [animations, setAnimations] = useState([]);
  const [activeAnimation, setActiveAnimation] = useState(null);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isTeam, setIsTeam] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const baseUrl = import.meta.env.VITE_BACKEND_URL;

  // Filter animations based on search query
  const filteredAnimations = useMemo(() => {
    if (!searchQuery.trim()) return animations;

    const query = searchQuery.toLowerCase().trim();
    return animations.filter((animation) => {
      // Search in title
      const titleMatch = animation.title?.toLowerCase().includes(query);
      // Search in description
      const descMatch = animation.description?.toLowerCase().includes(query);
      // Search in subject
      const subjectMatch = animation.subject?.toLowerCase().includes(query);
      // Search in related topics/keywords (if available)
      const keywordsMatch = animation.keywords?.some((k) =>
        k.toLowerCase().includes(query)
      );
      // Search in tags (if available)
      const tagsMatch = animation.tags?.some((t) =>
        t.toLowerCase().includes(query)
      );

      return (
        titleMatch || descMatch || subjectMatch || keywordsMatch || tagsMatch
      );
    });
  }, [animations, searchQuery]);

  // Check admin/team status via API
  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;
        const res = await axios.get(`${baseUrl}/api/messages/check-admin`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setIsAdmin(res.data.isAdmin || false);
        setIsTeam(res.data.isTeam || false);
      } catch (err) {
        setIsAdmin(false);
        setIsTeam(false);
      }
    };
    checkAdminStatus();
  }, [baseUrl]);

  useEffect(() => {
    const fetchContentAndMerge = async () => {
      const staticAnims = getAllAnimations();

      try {
        const token = localStorage.getItem("token");
        // Fetch C++ content (since most animations are C++)
        // Ideally we fetch all or multiple subjects, but let's start with C++
        const res = await axios.get(
          `${baseUrl}/api/learn/subjects/C++/content?type=animation`,
          {
            headers: token ? { Authorization: `Bearer ${token}` } : {},
          }
        );

        if (res.data.success) {
          const dbContent = res.data.content;

          // Merge logic: Match static ID/Title with DB content
          const merged = staticAnims.map((anim) => {
            // Try to find matching DB content by title (approximate) or id if stored in DB
            // Assuming DB content title matches animation title
            const match = dbContent.find(
              (c) => c.title.toLowerCase() === anim.title.toLowerCase()
            );
            if (match) {
              return {
                ...anim,
                _id: match._id,
                audioHindiUrl: match.audioHindiUrl,
                audioEnglishUrl: match.audioEnglishUrl,
              };
            }
            return anim;
          });
          setAnimations(merged);
        } else {
          setAnimations(staticAnims);
        }
      } catch (err) {
        console.error("Error fetching content for mapping:", err);
        setAnimations(staticAnims);
      }
    };

    fetchContentAndMerge();
  }, []);

  const handleAnimationClick = (animation) => {
    // Navigate to shareable URL - enables direct links and browser history
    navigate(`/visualize/${animation.id}`);
  };

  return (
    <div
      className="min-h-screen font-sans selection:bg-blue-500/30"
      style={{ background: APPLE_THEME.bg, color: APPLE_THEME.text }}
    >
      {/* 🍎 HERO SECTION */}
      <section className="relative py-40 px-6 flex flex-col items-center justify-center overflow-hidden">
        {/* Dynamic Abstract Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{ duration: 10, repeat: Infinity }}
            className="absolute top-[-20%] left-[20%] w-[600px] h-[600px] bg-amber-600/20 blur-[120px] rounded-full mix-blend-screen"
          />
          <motion.div
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{ duration: 15, repeat: Infinity, delay: 2 }}
            className="absolute bottom-[-20%] right-[20%] w-[500px] h-[500px] bg-yellow-600/20 blur-[120px] rounded-full mix-blend-screen"
          />
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 text-center max-w-5xl"
        >
          <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full border border-amber-500/20 bg-gradient-to-r from-amber-500/10 to-yellow-500/10 backdrop-blur-md mb-8">
            <span className="w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_12px_#f59e0b]"></span>
            <span className="text-xs font-bold tracking-[0.2em] text-amber-300 uppercase">
              Medha Experiences
            </span>
          </div>

          <h1
            className="text-6xl md:text-8xl font-black tracking-tight mb-8 leading-[0.95]"
            style={{
              background: "linear-gradient(to bottom, #ffffff, #a1a1aa)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Experience Learning.
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-300">
              Differently.
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-400 max-w-2xl mx-auto font-medium leading-relaxed">
            Immersive animated journeys through complex concepts.
            <br />
            <span className="text-amber-400">Watch. Understand. Master.</span>
          </p>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="mt-12 max-w-2xl mx-auto w-full"
          >
            <div
              className={`relative group transition-all duration-300 ${
                isSearchFocused ? "scale-[1.02]" : "scale-100"
              }`}
            >
              {/* Glow Effect */}
              <div
                className={`absolute -inset-1 bg-gradient-to-r from-amber-500/20 via-yellow-500/20 to-amber-500/20 rounded-2xl blur-lg transition-opacity duration-300 ${
                  isSearchFocused ? "opacity-100" : "opacity-0"
                }`}
              />

              <div
                className={`relative flex items-center gap-3 px-6 py-4 rounded-2xl border transition-all duration-300 ${
                  isSearchFocused
                    ? "bg-[#1c1c1e] border-amber-500/50"
                    : "bg-[#1c1c1e]/80 border-white/10 hover:border-white/20"
                }`}
              >
                <FaSearch
                  className={`text-lg transition-colors duration-300 ${
                    isSearchFocused ? "text-amber-400" : "text-gray-500"
                  }`}
                />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                  placeholder="Search topics, concepts, or experiences..."
                  className="flex-1 bg-transparent outline-none text-white placeholder-gray-500 text-lg font-medium"
                />
                {searchQuery && (
                  <motion.button
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    onClick={() => setSearchQuery("")}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                  >
                    <FaTimes className="text-gray-400 hover:text-white" />
                  </motion.button>
                )}
              </div>
            </div>

            {/* Search Results Count */}
            <AnimatePresence>
              {searchQuery && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mt-4 text-center"
                >
                  <span className="text-gray-400 text-sm">
                    {filteredAnimations.length === 0 ? (
                      <span className="text-amber-400">
                        No experiences found for "{searchQuery}"
                      </span>
                    ) : (
                      <>
                        Found{" "}
                        <span className="text-amber-400 font-bold">
                          {filteredAnimations.length}
                        </span>{" "}
                        experience{filteredAnimations.length !== 1 ? "s" : ""}{" "}
                        matching "
                        <span className="text-white">{searchQuery}</span>"
                      </>
                    )}
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      </section>

      {/* 🍎 BENTO GRID */}
      <section className="px-6 pb-40 max-w-7xl mx-auto">
        {/* No Results State */}
        {searchQuery && filteredAnimations.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-20"
          >
            <div className="w-24 h-24 rounded-full bg-amber-500/10 flex items-center justify-center mb-6">
              <FaSearch className="text-4xl text-amber-400/50" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">
              No experiences found
            </h3>
            <p className="text-gray-400 text-center max-w-md">
              Try searching for different topics like "pointer", "class",
              "constructor", or browse all experiences below.
            </p>
            <button
              onClick={() => setSearchQuery("")}
              className="mt-6 px-6 py-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-400 font-semibold hover:bg-amber-500/20 transition-colors"
            >
              Clear Search
            </button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 landscape:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAnimations.map((animation, idx) => (
              <motion.div
                key={animation.id}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1, duration: 0.6 }}
                onHoverStart={() => setHoveredCard(animation.id)}
                onHoverEnd={() => setHoveredCard(null)}
                onClick={() => handleAnimationClick(animation)}
                className="group cursor-pointer"
              >
                <div
                  className="relative h-full overflow-hidden rounded-[32px] bg-[#1c1c1e] transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-amber-500/10"
                  style={{
                    border: "1px solid rgba(255,255,255,0.05)",
                  }}
                >
                  {/* Card Preview Image Area - Redesigned with Topic Name */}
                  <div className="h-72 relative bg-gradient-to-br from-[#0a0a0a] to-[#1a1a1a] flex flex-col items-center justify-center overflow-hidden">
                    {/* Subtle Grid Pattern */}
                    <div
                      className="absolute inset-0 opacity-10"
                      style={{
                        backgroundImage:
                          "linear-gradient(rgba(245,158,11,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(245,158,11,0.1) 1px, transparent 1px)",
                        backgroundSize: "40px 40px",
                      }}
                    />

                    {/* Golden Glow Background */}
                    <div className="absolute inset-0 bg-gradient-to-t from-amber-500/5 via-transparent to-transparent" />

                    {/* Topic Title with Golden Shine - Hides on hover */}
                    <motion.h2
                      animate={{
                        opacity: hoveredCard === animation.id ? 0 : 1,
                        scale: hoveredCard === animation.id ? 0.95 : 1,
                        textShadow: "0 0 20px rgba(245,158,11,0.3)",
                      }}
                      transition={{ duration: 0.2 }}
                      className="text-3xl md:text-4xl font-black text-center px-6 leading-tight z-10"
                      style={{
                        background:
                          "linear-gradient(135deg, #fcd34d, #f59e0b, #fbbf24)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text",
                      }}
                    >
                      {animation.title}
                    </motion.h2>

                    {/* Scenes Badge - Hides on hover */}
                    <motion.div
                      animate={{
                        opacity: hoveredCard === animation.id ? 0 : 1,
                      }}
                      transition={{ duration: 0.2 }}
                      className="mt-4 px-4 py-1.5 bg-white/5 border border-amber-500/20 rounded-full z-10"
                    >
                      <span className="text-xs font-bold text-amber-300 tracking-wider">
                        {animation.totalSteps} SCENES
                      </span>
                    </motion.div>

                    {/* Play Button Overlay with Golden Shine */}
                    <div
                      className={`absolute inset-0 flex flex-col items-center justify-center transition-all duration-300 ${hoveredCard === animation.id ? "opacity-100" : "opacity-0 pointer-events-none"}`}
                      style={{
                        background:
                          "linear-gradient(to top, rgba(0,0,0,0.95), rgba(0,0,0,0.85), rgba(0,0,0,0.8))",
                      }}
                    >
                      {/* Golden shine particles */}
                      <div className="absolute inset-0 overflow-hidden">
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-amber-500/20 blur-[80px] rounded-full" />
                      </div>

                      <motion.div
                        initial={{ scale: 0.8, y: 20 }}
                        animate={{
                          scale: hoveredCard === animation.id ? 1 : 0.8,
                          y: hoveredCard === animation.id ? 0 : 20,
                        }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                        className="relative z-10 px-10 py-5 bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-400 text-amber-950 rounded-full font-bold text-lg flex items-center gap-3 shadow-2xl"
                        style={{
                          boxShadow:
                            "0 0 60px rgba(245,158,11,0.5), 0 20px 40px rgba(0,0,0,0.3)",
                        }}
                      >
                        <FaPlay size={16} /> Start Experience
                      </motion.div>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-amber-400 text-xs font-bold uppercase tracking-wider">
                        {animation.subject}
                      </span>
                      {animation.views > 0 && (
                        <span className="text-[10px] font-bold text-gray-500 flex items-center gap-1">
                          <FaEye />{" "}
                          {animation.views > 1000
                            ? `${(animation.views / 1000).toFixed(1)}k`
                            : animation.views}{" "}
                          views
                        </span>
                      )}
                    </div>

                    <p className="text-gray-400 leading-relaxed text-sm font-medium line-clamp-2">
                      {animation.description}
                    </p>

                    <div className="mt-6 flex items-center gap-2 text-sm font-semibold text-amber-400 group-hover:text-amber-300 group-hover:translate-x-1 transition-all">
                      Begin Experience{" "}
                      <FaArrowRight
                        size={12}
                        className="transition-transform group-hover:translate-x-1"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      <MedhaAnimationViewer
        isOpen={!!activeAnimation}
        onClose={() => setActiveAnimation(null)}
        animationId={activeAnimation?.id}
        contentId={activeAnimation?._id}
        title={activeAnimation?.title}
        totalSteps={activeAnimation?.totalSteps}
        audioHindiUrl={activeAnimation?.audioHindiUrl}
        audioEnglishUrl={activeAnimation?.audioEnglishUrl}
        isAdmin={isAdmin}
        isTeam={isTeam}
      />
    </div>
  );
};

export default VisualizeConcepts;
