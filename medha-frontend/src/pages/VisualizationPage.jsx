/**
 * VisualizationPage - Standalone page for direct URL access to animations
 * Enables shareable URLs like /visualize/unit5-oneshot
 */
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { FaArrowLeft, FaExclamationTriangle } from "react-icons/fa";
import { getAnimation, hasAnimation } from "../components/RTUExams/animations";
import MedhaAnimationViewer from "../components/RTUExams/MedhaAnimationViewer";

const VisualizationPage = () => {
  const { animationId, step } = useParams();
  const navigate = useNavigate();
  const [animation, setAnimation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isTeam, setIsTeam] = useState(false);
  const [dbContent, setDbContent] = useState(null);

  const baseUrl = import.meta.env.VITE_BACKEND_URL;

  // Check admin/team status
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

  // Load animation
  useEffect(() => {
    const loadAnimation = async () => {
      setLoading(true);
      setError(null);

      // Check if animation exists in registry
      if (!hasAnimation(animationId)) {
        setError(`Animation "${animationId}" not found`);
        setLoading(false);
        return;
      }

      // Get animation from registry
      const anim = getAnimation(animationId);
      
      // Fetch DB content for audio URLs and increment views
      try {
        const token = localStorage.getItem("token");
        // Get content
        const res = await axios.get(
          `${baseUrl}/api/learn/animation/${animationId}/audio`,
          { headers: token ? { Authorization: `Bearer ${token}` } : {} }
        );
        if (res.data.success) {
          setDbContent(res.data);
          
          // Increment views
          if (res.data._id) {
            axios.post(
              `${baseUrl}/api/learn/${res.data._id}/view`,
              {},
              { headers: token ? { Authorization: `Bearer ${token}` } : {} }
            ).then(viewRes => {
              if (viewRes.data.success) {
                setDbContent(prev => ({ ...prev, views: viewRes.data.views }));
              }
            }).catch(console.error);
          }
        }
      } catch (err) {
        console.log("No DB content for animation:", animationId);
      }

      setAnimation({
        id: animationId,
        ...anim.metadata,
        Component: anim.default?.AnimationSteps || anim.AnimationSteps,
        module: anim,
      });
      setLoading(false);
    };

    loadAnimation();
  }, [animationId, baseUrl]);

  // Handle close - go back or to RTU exams
  const handleClose = () => {
    if (window.history.length > 2) {
      navigate(-1);
    } else {
      navigate("/rtu-exams");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center max-w-md">
          <FaExclamationTriangle className="text-amber-500 text-5xl mx-auto mb-4" />
          <h2 className="text-white text-xl font-bold mb-2">Not Found</h2>
          <p className="text-gray-400 mb-6">{error}</p>
          <button
            onClick={() => navigate("/rtu-exams")}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2 mx-auto"
          >
            <FaArrowLeft size={12} /> Back to RTU Exams
          </button>
        </div>
      </div>
    );
  }

  return (
    <MedhaAnimationViewer
      isOpen={true}
      onClose={handleClose}
      title={animation?.title}
      animationId={animationId}
      AnimationSteps={animation?.module?.AnimationSteps || animation?.Component}
      initialAudioHindi={dbContent?.audioHindiUrl}
      initialAudioEnglish={dbContent?.audioEnglishUrl}
      isAdmin={isAdmin}
      isTeam={isTeam}
      contentId={dbContent?._id}
      initialViews={dbContent?.views}
      initialStep={step ? parseInt(step) : 1}
      partAudios={dbContent?.partAudios || []}
    />
  );
};

export default VisualizationPage;
