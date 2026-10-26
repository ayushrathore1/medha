import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaArrowLeft,
  FaYoutube,
  FaMagnifyingGlass,
  FaSpinner,
} from "react-icons/fa6";
import { Sparkles, Search, Loader2 } from "lucide-react";
import api from "../api/api";
import Button from "../components/Common/Button";
import Loader from "../components/Common/Loader";
import ChapterAccordion from "../components/RTUExams/ChapterAccordion";
import SYLLABUS_DATA from "../data/syllabusData";
import "../styles/responsive-pages.css";

const SubjectYouTube = () => {
  const { subjectName } = useParams();
  const [searchParams] = useSearchParams();
  const targetUnitParam = searchParams.get("unit");
  const navigate = useNavigate();
  const decodedName = decodeURIComponent(subjectName);

  const [units, setUnits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedUnit, setExpandedUnit] = useState(null);
  const [unitVideos, setUnitVideos] = useState({}); // { unitNumber: [videos] }
  const [unitLoading, setUnitLoading] = useState({}); // { unitNumber: true/false }
  const [searchingAll, setSearchingAll] = useState(false);

  // Track whether this subject has hardcoded data
  const hasHardcodedData = (SYLLABUS_DATA[decodedName] || []).some(
    (u) => u.videos && u.videos.length > 0
  );

  // Fetch units from backend, fall back to hardcoded syllabus data
  useEffect(() => {
    const fetchUnits = async () => {
      try {
        const res = await api.get(
          `/recommendations/units/${encodeURIComponent(decodedName)}`
        );
        const apiUnits = res.data.units || [];
        if (apiUnits.length > 0) {
          setUnits(apiUnits);
        } else {
          // Fallback to hardcoded syllabus data
          const fallbackUnits = SYLLABUS_DATA[decodedName] || [];
          setUnits(fallbackUnits);
          // Pre-populate videos from hardcoded data
          const preloaded = {};
          fallbackUnits.forEach((u) => {
            if (u.videos && u.videos.length > 0) {
              preloaded[u.unitNumber] = u.videos;
            }
          });
          if (Object.keys(preloaded).length > 0) {
            setUnitVideos(preloaded);
          }
        }
      } catch (err) {
        console.error("Error fetching units:", err);
        // Fallback to hardcoded syllabus data
        const fallbackUnits = SYLLABUS_DATA[decodedName] || [];
        setUnits(fallbackUnits);
        // Pre-populate videos from hardcoded data
        const preloaded = {};
        fallbackUnits.forEach((u) => {
          if (u.videos && u.videos.length > 0) {
            preloaded[u.unitNumber] = u.videos;
          }
        });
        if (Object.keys(preloaded).length > 0) {
          setUnitVideos(preloaded);
        }
      } finally {
        setLoading(false);
        if (targetUnitParam) {
          const uNum = parseInt(targetUnitParam, 10);
          if (!isNaN(uNum)) {
            setExpandedUnit(uNum);
          }
        }
      }
    };
    fetchUnits();
  }, [decodedName, targetUnitParam]);

  // Search videos for a specific unit (only if no pre-assigned videos exist)
  const searchUnitVideos = useCallback(
    async (unitNumber, unitTitle) => {
      if (unitVideos[unitNumber]?.length > 0) return; // Already have videos
      if (!hasHardcodedData) return; // Skip AI search for subjects without hardcoded data

      setUnitLoading((prev) => ({ ...prev, [unitNumber]: true }));
      try {
        const res = await api.post("/recommendations/search", {
          topic: unitTitle,
          subject: decodedName,
          unit: unitTitle,
        });
        const videos = res.data?.data?.youtube || [];
        setUnitVideos((prev) => ({ ...prev, [unitNumber]: videos }));
      } catch (err) {
        console.error(`Error searching videos for unit ${unitNumber}:`, err);
        setUnitVideos((prev) => ({ ...prev, [unitNumber]: [] }));
      } finally {
        setUnitLoading((prev) => ({ ...prev, [unitNumber]: false }));
      }
    },
    [decodedName, unitVideos]
  );

  // "Find All Lectures" button
  const handleFindAll = async () => {
    setSearchingAll(true);
    for (const unit of units) {
      if (!unitVideos[unit.unitNumber]?.length) {
        await searchUnitVideos(unit.unitNumber, unit.title);
      }
    }
    setSearchingAll(false);
  };

  const handleExpand = (unitNumber, unitTitle) => {
    setExpandedUnit((prev) => (prev === unitNumber ? null : unitNumber));
    searchUnitVideos(unitNumber, unitTitle);
  };

  if (loading) return <Loader fullScreen />;

  return (
    <div className="min-h-screen w-full px-3 py-6 sm:px-8 sm:py-8 bg-transparent">
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>

      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <div className="flex items-center gap-3 mb-6">
            <Button
              onClick={() => navigate(-1)}
              variant="ghost"
              className="bg-[var(--bg-secondary)] shadow-sm border border-[var(--border-default)] hover:bg-[var(--bg-tertiary)] text-[var(--text-secondary)]"
            >
              <FaArrowLeft className="mr-2" /> Back
            </Button>
          </div>

          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            {/* Subject badge */}
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                background: "rgba(255, 0, 0, 0.06)",
                border: "1.5px solid rgba(255, 0, 0, 0.12)",
                borderRadius: 100,
                padding: "6px 16px",
                marginBottom: 14,
                fontSize: 12,
                fontWeight: 700,
                color: "#FF0000",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
              }}
            >
              <FaYoutube size={14} />
              YouTube Lectures
            </div>

            <h1
              className="text-3xl md:text-4xl font-black tracking-tight mb-3"
              style={{ color: "var(--text-primary)" }}
            >
              {decodedName}
            </h1>
            <p
              className="text-base md:text-lg font-medium"
              style={{ color: "var(--text-secondary)" }}
            >
              {units.length} chapters · Click any chapter to explore video
              lectures
            </p>

            {/* Find All button */}
            {units.length > 0 && hasHardcodedData && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                style={{ marginTop: 20 }}
              >
                <button
                  onClick={handleFindAll}
                  disabled={searchingAll}
                  className="find-all-btn"
                  style={{
                    background: searchingAll
                      ? "var(--bg-secondary)"
                      : "var(--text-primary)",
                    color: searchingAll
                      ? "var(--text-tertiary)"
                      : "#fff",
                    cursor: searchingAll ? "not-allowed" : "pointer",
                  }}
                >
                  {searchingAll ? (
                    <>
                      <Loader2
                        size={16}
                        style={{ animation: "spin 1s linear infinite" }}
                      />
                      Searching all chapters…
                    </>
                  ) : (
                    <>
                      <Sparkles size={16} />
                      Find All Lectures (AI Search)
                    </>
                  )}
                </button>
              </motion.div>
            )}
          </motion.div>
        </div>

        {/* Chapter Accordions */}
        {units.length > 0 ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {units.map((unit) => (
              <ChapterAccordion
                key={unit.unitNumber}
                unitNumber={unit.unitNumber}
                title={unit.title}
                topics={unit.topics || []}
                videos={unitVideos[unit.unitNumber] || []}
                loading={unitLoading[unit.unitNumber] || false}
                playlistUrl={unit.youtubePlaylistUrl}
                pyqImportance={unit.pyqImportance || null}
                isExpanded={expandedUnit === unit.unitNumber}
                onExpand={() =>
                  handleExpand(unit.unitNumber, unit.title)
                }
              />
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{
              textAlign: "center",
              padding: "60px 20px",
              color: "var(--text-tertiary)",
            }}
          >
            <Search
              size={48}
              style={{ margin: "0 auto 16px", opacity: 0.3 }}
            />
            <p style={{ fontSize: 16, fontWeight: 700, marginBottom: 6 }}>
              No syllabus data found
            </p>
            <p style={{ fontSize: 13 }}>
              Syllabus information for "{decodedName}" is not available yet.
            </p>
          </motion.div>
        )}

        {/* Footer tip */}
        {units.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            style={{
              textAlign: "center",
              padding: "32px 20px",
              color: "var(--text-tertiary)",
              fontSize: 12,
              fontWeight: 500,
            }}
          >
            <p>
              💡 Videos are sourced from verified channels via AI-powered
              search. Click a chapter to auto-search for relevant lectures.
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default SubjectYouTube;
