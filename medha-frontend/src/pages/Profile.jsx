import React, { useState, useEffect, useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Card from "../components/Common/Card";
import Button from "../components/Common/Button";
import Loader from "../components/Common/Loader";
import RevisionShell from "../components/Revision/RevisionShell";
import LogoutConfirm from "../components/Revision/LogoutConfirm";
import { loginPath } from "../components/Revision/revisionUtils";
import { AuthContext } from "../AuthContext";
import api from "../api/api";
import { generateAvatarOptions, getAvatarByIndex } from "../utils/avatarUtils";
import { getAuraTier } from "../utils/auraUtils";
import { isTeamUser } from "../config/appMode";
import { 
  FaMars, 
  FaVenus, 
  FaGenderless, 
  FaTrash, 
  FaCamera, 
  FaXmark, 
  FaWandMagicSparkles, 
  FaCrop, 
  FaUser,
  FaAward,
  FaBuildingColumns,
  FaFileLines,
  FaPen,
  FaLock,
  FaEye,
  FaShieldHalved,
  FaGear,
  FaArrowRightFromBracket,
} from "react-icons/fa6";
import "./ProfileDesk.css";

const UNIVERSITIES = ["RTU", "GGSIPU", "DTU", "AKTU"];
const BRANCHES = ["CSE", "IT", "ECE", "EE", "ME", "Civil", "AIDS", "CSD", "CAI"];
const SEMESTERS = ["1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th"];
const GENDERS = ["Male", "Female", "Other"];

const GenderIcon = ({ gender }) => {
  switch (gender) {
    case "Male": return <FaMars />;
    case "Female": return <FaVenus />;
    default: return <FaGenderless />;
  }
};

// Simple Image Cropper & Filter Component
const ImageCropper = ({ imageSrc, onCancel, onSave }) => {
  const [zoom, setZoom] = useState(1);
  const [baseScale, setBaseScale] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [filter, setFilter] = useState("none"); // none, grayscale, sepia, vintage
  const [isDragging, setIsDragging] = useState(false);
  const startPan = useRef({ x: 0, y: 0 });
  const containerRef = useRef(null);
  const imageRef = useRef(null);

  const handleMouseDown = (e) => {
    e.preventDefault();
    setIsDragging(true);
    startPan.current = { x: e.clientX - pan.x, y: e.clientY - pan.y };
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    setPan({ x: e.clientX - startPan.current.x, y: e.clientY - startPan.current.y });
  };

  const handleMouseUp = () => setIsDragging(false);

  const applyFilter = (ctx, width, height) => {
    if (filter === "grayscale") {
      ctx.globalCompositeOperation = "saturation";
      ctx.fillStyle = "white";
      ctx.globalAlpha = 0; // standard canvas doesn't support blend modes easily without complex logic, using CSS filter for save is better
      // Actually, standard canvas 'filter' property exists in modern browsers
      ctx.filter = "grayscale(100%)";
    } else if (filter === "sepia") {
      ctx.filter = "sepia(100%)";
    } else if (filter === "vintage") {
      ctx.filter = "sepia(50%) contrast(120%) brightness(90%)";
    } else {
      ctx.filter = "none";
    }
  };

  const handleSave = () => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const size = 300; // Output size
    canvas.width = size;
    canvas.height = size;

    // Background
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, size, size);

    // Filter
    applyFilter(ctx, size, size);

    // Draw
    const img = imageRef.current;
    // Calculate draw parameters to match the visual crop
    // The container is 256x256 (w-64).
    // The scale is zoom.
    // The pan is relative to the center.
    
    // Simplification: Draw image centered with pan and zoom (corrected for baseScale and output ratio)
    const ratio = size / 256;
    ctx.translate(size / 2 + pan.x * ratio, size / 2 + pan.y * ratio);
    ctx.scale(zoom * baseScale * ratio, zoom * baseScale * ratio);
    ctx.drawImage(img, -img.naturalWidth / 2, -img.naturalHeight / 2);

    onSave(canvas.toDataURL("image/jpeg", 0.9));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <Card className="max-w-md w-full shadow-2xl" style={{ backgroundColor: "var(--bg-secondary)" }}>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold flex items-center gap-2" style={{ color: "var(--text-primary)" }}>
            <FaCrop /> Edit Photo
          </h3>
          <button onClick={onCancel} className="hover:opacity-80 transition-opacity" style={{ color: "var(--text-tertiary)" }}>
            <FaXmark />
          </button>
        </div>

        {/* Crop Area */}
        <div 
          className="relative w-64 h-64 mx-auto bg-slate-100 rounded-full overflow-hidden border-4 border-indigo-100 shadow-inner cursor-move touch-none"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          ref={containerRef}
        >
          <img
            ref={imageRef}
            src={imageSrc}
            alt="Crop preview"
            onLoad={(e) => {
              const { naturalWidth, naturalHeight } = e.currentTarget;
              // default container size 256px
              const scale = Math.max(256 / naturalWidth, 256 / naturalHeight);
              setBaseScale(scale);
            }}
            className="absolute max-w-none origin-center pointer-events-none select-none transition-filter duration-200"
            style={{
              transform: `translate(-50%, -50%) translate(${pan.x}px, ${pan.y}px) scale(${zoom * baseScale})`,
              left: "50%",
              top: "50%",
              filter: filter === "grayscale" ? "grayscale(100%)" : 
                      filter === "sepia" ? "sepia(100%)" : 
                      filter === "vintage" ? "sepia(50%) contrast(120%) brightness(90%)" : "none"
            }}
            draggable={false}
          />
        </div>
        <p className="text-center text-xs text-slate-400 mt-2">Drag to pan • Pinch/Slide to zoom</p>

        {/* Controls */}
        <div className="space-y-4 mt-6">
          {/* Zoom */}
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase">Zoom</label>
            <input
              type="range"
              min="1"
              max="3"
              step="0.01"
              value={zoom}
              onChange={(e) => setZoom(parseFloat(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />
          </div>

          {/* Filters */}
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1 mb-2">
              <FaWandMagicSparkles size={10} /> Filters
            </label>
            <div className="flex gap-2 justify-center">
              {[
                { id: "none", label: "Normal" },
                { id: "grayscale", label: "B&W" },
                { id: "sepia", label: "Sepia" },
                { id: "vintage", label: "Vintage" }
              ].map(f => (
                <button
                  key={f.id}
                  onClick={() => setFilter(f.id)}
                  type="button"
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    filter === f.id
                      ? "bg-indigo-600 text-white shadow-md"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 mt-8">
          <Button variant="ghost" onClick={onCancel} fullWidth>Cancel</Button>
          <Button onClick={handleSave} fullWidth>Save Photo</Button>
        </div>
      </Card>
    </div>
  );
};



const Profile = () => {
  const navigate = useNavigate();
  const { user, setUser, logout } = useContext(AuthContext);
  const [userData, setUserData] = useState(null);
  const showOps = isTeamUser(user) || isTeamUser(userData);
  const [stats, setStats] = useState({ notesShared: 0, auraPoints: 0 });
  const [libraryStats, setLibraryStats] = useState({
    total: 0,
    inReview: 0,
    livePublic: 0,
  });
  const [isEditing, setIsEditing] = useState(false);
  const [logoutOpen, setLogoutOpen] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteStep, setDeleteStep] = useState(1); // 1 = reason, 2 = confirm
  const [deleteReason, setDeleteReason] = useState("");
  const [otherReason, setOtherReason] = useState("");
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [deleting, setDeleting] = useState(false);
  
  // Custom Avatar States
  const [showCropModal, setShowCropModal] = useState(false);
  const [tempImage, setTempImage] = useState(null);
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({ 
    name: "", 
    email: "",
    university: "",
    branch: "",
    semester: "",
    gender: "",
    selectedAvatar: 0,
    customAvatar: null // Base64 string
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [imgError, setImgError] = useState(false);

  const [privacy, setPrivacy] = useState(() => {
    try {
      return {
        publicProfile: localStorage.getItem("medha_privacy_public_profile") !== "false",
        showEmail: localStorage.getItem("medha_privacy_show_email") === "true",
        showUniversity: localStorage.getItem("medha_privacy_show_university") !== "false",
        showActivity: localStorage.getItem("medha_privacy_show_activity") !== "false",
      };
    } catch {
      return {
        publicProfile: true,
        showEmail: false,
        showUniversity: true,
        showActivity: true,
      };
    }
  });
  const [settingsTab, setSettingsTab] = useState("about"); // about | privacy | account

  // Reset img error when data changes
  useEffect(() => {
    setImgError(false);
  }, [userData?.avatar, userData?.avatarIndex, userData?.gender, userData?.email]);

  // Deletion reason options
  const DELETE_REASONS = [
    "Not using the app anymore",
    "Found a better alternative",
    "Too many notifications",
    "Privacy concerns",
    "App is too complicated",
    "Missing features I need",
    "Just exploring, not a student",
    "Other"
  ];

  useEffect(() => {
    fetchProfile();
    fetchLibraryStats();
  }, []);

  const updatePrivacy = (key, value) => {
    setPrivacy((prev) => {
      const next = { ...prev, [key]: value };
      const map = {
        publicProfile: "medha_privacy_public_profile",
        showEmail: "medha_privacy_show_email",
        showUniversity: "medha_privacy_show_university",
        showActivity: "medha_privacy_show_activity",
      };
      try {
        localStorage.setItem(map[key], String(value));
      } catch {
        /* ignore */
      }
      return next;
    });
  };

  const fetchLibraryStats = async () => {
    try {
      const res = await api.get("/notes", { params: { limit: 50 } });
      const notes = res.data?.notes || [];
      const inReview = notes.filter(
        (n) => n.verificationStatus === "pending" || n.verificationStatus === "awaiting_team"
      ).length;
      const livePublic = notes.filter(
        (n) => n.verificationStatus === "approved" && n.isPublic
      ).length;
      setLibraryStats({
        total: notes.length,
        inReview,
        livePublic,
      });
    } catch {
      setLibraryStats({ total: 0, inReview: 0, livePublic: 0 });
    }
  };

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        logout?.();
        navigate(loginPath("/profile"), { replace: true });
        return;
      }
      // First get basic info to get ID
      const responseMe = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/users/me`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const user = responseMe.data.user || responseMe.data;
      
      // Then fetch full profile stats
      const responseProfile = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/users/profile/${user._id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const profileUser = responseProfile.data.user || {};
      // /profile/:id historically omitted `year`; keep semester from /me as fallback
      const mergedUser = {
        ...user,
        ...profileUser,
        year: profileUser.year || user.year || "",
        university: profileUser.university || user.university || "",
        branch: profileUser.branch || user.branch || "",
      };
      const auraPoints =
        mergedUser?.auraPoints ??
        responseProfile.data.stats?.auraPoints ??
        user.auraPoints ??
        0;

      setUserData({ ...mergedUser, auraPoints });
      setStats({
        notesShared: responseProfile.data.stats?.notesShared || 0,
        auraPoints,
      });
      setUser?.((prev) => ({
        ...(prev || {}),
        ...mergedUser,
        auraPoints,
      }));

      setFormData({ 
        name: mergedUser.name || "", 
        email: mergedUser.email || "",
        university: mergedUser.university || "",
        branch: mergedUser.branch || "",
        semester: mergedUser.year || mergedUser.semester || "",
        gender: mergedUser.gender || "",
        selectedAvatar: mergedUser.avatarIndex || 0,
        customAvatar: null
      });
    } catch (error) {
      console.error("Error fetching profile:", error);
      if (error?.response?.status === 401 || error?.response?.status === 403) {
        logout?.();
        navigate(loginPath("/profile"), { replace: true });
        return;
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (field, value) => {
    // If selecting a predefined avatar, clear custom one
    if (field === "selectedAvatar") {
      setFormData(prev => ({
        ...prev,
        [field]: value,
        customAvatar: null // Clear custom if picking from list
      }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
  };
  
  // Image Upload Handlers
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setTempImage(reader.result);
        setShowCropModal(true);
      };
      reader.readAsDataURL(file);
    }
    // Reset input
    e.target.value = null;
  };

  const handleCropSave = (croppedImage) => {
    setFormData(prev => ({
      ...prev,
      customAvatar: croppedImage,
      selectedAvatar: -1 // Special index to indicate custom
    }));
    setShowCropModal(false);
    setTempImage(null);
  };
  
  const handleRemoveAvatar = () => {
    setFormData(prev => ({
      ...prev,
      customAvatar: null,
      selectedAvatar: 0
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const token = localStorage.getItem("token");
      
      // Prepare payload
      const payload = {
        name: formData.name,
        university: formData.university,
        branch: formData.branch,
        year: formData.semester,
        semester: formData.semester,
        gender: formData.gender,
        avatarIndex: formData.selectedAvatar
      };

      // Handle custom avatar logic
      if (formData.selectedAvatar === -1 && formData.customAvatar) {
        payload.avatar = formData.customAvatar;
      } else if (formData.selectedAvatar !== -1) {
        // If user selected a preset avatar, clear the custom one
        payload.avatar = ""; 
      }

      const response = await axios.patch(
        `${import.meta.env.VITE_BACKEND_URL}/api/users/me`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      const updatedUser = response.data.user;
      
      // Update context and localStorage
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
      
      setUserData(updatedUser);
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
    } finally {
      setSaving(false);
    }
  };

  const resetDeleteModal = () => {
    setShowDeleteModal(false);
    setDeleteStep(1);
    setDeleteReason("");
    setOtherReason("");
    setDeleteConfirmText("");
  };

  const handleDeleteAccount = async () => {
    setDeleting(true);
    try {
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/users/me`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      logout?.();
      navigate("/login");
    } catch (error) {
      console.error("Error deleting account:", error);
    } finally {
      setDeleting(false);
    }
  };

  // Get gender icon component - keep same

  // Generate avatar URL based on user's email, gender and selected index
  const getAvatarUrl = () => {
    // 1. Previewing custom uploaded avatar (Edit Mode)
    if (isEditing && formData.customAvatar) {
        return formData.customAvatar;
    }
    
    // 2. Saved Custom Avatar
    if (userData?.avatar) {
        return userData.avatar;
    }
    
    // 3. Preset Avatar (View Mode)
    if (!isEditing && userData?.avatarIndex !== undefined && userData?.avatarIndex !== -1) {
        return getAvatarByIndex(userData.avatarIndex, userData?.gender || "Male").url;
    }

    return null;
  };

  // Get avatar options for picker - regenerates when gender changes
  const avatarOptions = generateAvatarOptions(
    formData.email || "default",
    formData.gender || "Other"
  );

  if (loading) {
    return <Loader fullScreen />;
  }

  return (
    <RevisionShell title="Profile" desk>
    <div className="desk-page w-full bg-transparent">
      <header className="mb-4">
        <p className="desk-eyebrow">Your account</p>
        <h1 className="desk-title">Profile</h1>
        <p className="desk-sub">Your public presence, privacy controls, and account settings.</p>
      </header>
      <div className="mx-auto max-w-4xl space-y-6">
        
        {isEditing ? (
          /* ================= EDIT PROFILE FORM ================= */
          <Card className="shadow-xl bg-[var(--bg-secondary)] border border-[var(--border-default)]">
            <div className="flex items-center justify-between mb-6 border-b border-[var(--border-default)] pb-4">
               <div>
                  <h2 className="text-xl font-bold text-[var(--text-primary)]">Edit Profile</h2>
                  <p className="text-sm text-[var(--text-secondary)]">Update your personal details</p>
               </div>
               <Button variant="ghost" onClick={() => setIsEditing(false)} size="sm">
                   <FaXmark className="mr-2" /> Cancel
               </Button>
            </div>

            <form onSubmit={handleSave} className="space-y-6">
              {/* Avatar Selection */}
              <div className="space-y-4">
                <label className="block font-bold text-sm text-[var(--text-secondary)]">Profile Photo</label>
                
                <div className="flex flex-col sm:flex-row items-center gap-6">
                  {/* Current Avatar Preview */}
                  <div className="relative group">
                    <div className="w-24 h-24 rounded-full border-4 border-[var(--bg-secondary)] shadow-lg overflow-hidden bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                        {getAvatarUrl() ? (
                            <img src={getAvatarUrl()} alt="Avatar" className="w-full h-full object-cover" />
                        ) : (
                            // Fallback if editing and cleared everything
                             formData.selectedAvatar !== -1 ? (
                                <img src={getAvatarByIndex(formData.selectedAvatar, formData.gender || "Male").url} alt="Avatar" className="w-full h-full object-cover" />
                             ) : (
                                <span className="text-2xl text-white font-bold">{formData.name?.charAt(0)}</span>
                             )
                        )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-3">
                    <input
                      type="file"
                      ref={fileInputRef}
                      className="hidden"
                      accept="image/*"
                      onChange={handleImageUpload}
                    />
                    <div className="flex gap-3">
                         <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()}>
                           <FaCamera className="mr-2" /> Upload Custom
                         </Button>
                         {(formData.customAvatar || userData?.avatar) && (
                           <Button 
                             type="button" 
                             variant="danger" 
                             onClick={() => setFormData(prev => ({ ...prev, customAvatar: null }))}
                           >
                             <FaTrash />
                           </Button>
                         )}
                    </div>
                  </div>
                </div>

                {/* Preset Avatars */}
                {!formData.customAvatar && (
                    <div className="bg-[var(--bg-tertiary)] p-4 rounded-xl border border-[var(--border-default)]">
                         <p className="text-xs font-bold uppercase text-[var(--text-tertiary)] mb-3">Choose from presets</p>
                         <div className="flex flex-wrap gap-3">
                            {avatarOptions.map((avatar) => (
                                <button
                                    key={avatar.id}
                                    type="button"
                                    onClick={() => handleSelect("selectedAvatar", avatar.id)}
                                    className={`relative p-1 rounded-full transition-all ${
                                        formData.selectedAvatar === avatar.id ? "ring-2 ring-[var(--action-primary)] scale-110" : "hover:scale-105 opacity-70 hover:opacity-100"
                                    }`}
                                >
                                    <img src={avatar.url} alt="Preset" className="w-10 h-10 rounded-full bg-[var(--bg-secondary)]" />
                                </button>
                            ))}
                         </div>
                    </div>
                )}
              </div>

              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div>
                    <label className="block mb-2 font-bold text-sm text-[var(--text-secondary)]">Display Name</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border font-medium focus:outline-none focus:ring-2"
                      style={{
                        backgroundColor: "var(--bg-tertiary)",
                        borderColor: "var(--border-default)",
                        color: "var(--text-primary)",
                      }}
                    />
                 </div>
                 <div>
                    <label className="block mb-2 font-bold text-sm text-[var(--text-secondary)]">Email</label>
                    <input
                      type="email"
                      value={formData.email}
                      disabled
                      className="w-full px-4 py-3 rounded-xl border font-medium cursor-not-allowed opacity-60"
                      style={{
                        backgroundColor: "var(--bg-tertiary)",
                        borderColor: "var(--border-default)",
                        color: "var(--text-primary)",
                      }}
                    />
                 </div>
              </div>

              {/* University & Branch */}
              <div className="space-y-4">
                 <div>
                    <label className="block mb-2 font-bold text-sm text-[var(--text-secondary)]">University</label>
                    <div className="flex flex-wrap gap-2">
                        {UNIVERSITIES.map(uni => (
                            <button
                                key={uni}
                                type="button"
                                onClick={() => setFormData({ ...formData, university: uni })}
                                className={`px-4 py-2 rounded-xl text-sm font-bold border transition-all ${
                                    formData.university === uni 
                                        ? "bg-[var(--action-primary)] text-white border-[var(--action-primary)]" 
                                        : "bg-[var(--bg-primary)] text-[var(--text-secondary)] border-[var(--border-default)] hover:border-[var(--action-primary)]"
                                }`}
                            >
                                {uni}
                            </button>
                        ))}
                    </div>
                 </div>
                 
                 <div>
                    <label className="block mb-2 font-bold text-sm text-[var(--text-secondary)]">Branch</label>
                    <div className="flex flex-wrap gap-2">
                        {BRANCHES.map(branch => (
                            <button
                                key={branch}
                                type="button"
                                onClick={() => setFormData({ ...formData, branch: branch })}
                                className={`px-4 py-2 rounded-xl text-sm font-bold border transition-all ${
                                    formData.branch === branch 
                                        ? "bg-[var(--action-primary)] text-white border-[var(--action-primary)]" 
                                        : "bg-[var(--bg-primary)] text-[var(--text-secondary)] border-[var(--border-default)] hover:border-[var(--action-primary)]"
                                }`}
                            >
                                {branch}
                            </button>
                        ))}
                    </div>
                 </div>

                 <div>
                    <label className="block mb-2 font-bold text-sm text-[var(--text-secondary)]">Current semester</label>
                    <div className="grid grid-cols-4 gap-2">
                        {SEMESTERS.map((sem) => (
                            <button
                                key={sem}
                                type="button"
                                onClick={() => setFormData({ ...formData, semester: sem })}
                                className={`px-3 py-2 rounded-xl text-sm font-bold border transition-all ${
                                    formData.semester === sem 
                                        ? "bg-[var(--action-primary)] text-white border-[var(--action-primary)]" 
                                        : "bg-[var(--bg-primary)] text-[var(--text-secondary)] border-[var(--border-default)] hover:border-[var(--action-primary)]"
                                }`}
                            >
                                {sem}
                            </button>
                        ))}
                    </div>
                 </div>

                 <div>
                    <label className="block mb-2 font-bold text-sm text-[var(--text-secondary)]">Gender</label>
                    <div className="flex gap-4">
                        {["Male", "Female", "Other"].map(g => (
                            <button
                                key={g}
                                type="button"
                                onClick={() => handleSelect("gender", g)}
                                className={`px-4 py-2 rounded-xl text-sm font-bold border flex items-center gap-2 transition-all ${
                                    formData.gender === g 
                                        ? "bg-[var(--action-primary)] text-white border-[var(--action-primary)]" 
                                        : "bg-[var(--bg-primary)] text-[var(--text-secondary)] border-[var(--border-default)] hover:border-[var(--action-primary)]"
                                }`}
                            >
                                <GenderIcon gender={g} /> {g}
                            </button>
                        ))}
                    </div>
                 </div>
              </div>

              {/* Submit Actions */}
              <div className="flex gap-4 pt-6 border-t border-[var(--border-default)]">
                <Button type="submit" loading={saving} fullWidth variant="primary">
                  Save Changes
                </Button>
              </div>
            </form>

            {/* DANGER ZONE - Only visible in Edit Mode */}
            <div className="mt-12 pt-8 border-t border-red-200/50">
                <div className="flex items-center gap-3 mb-6 text-red-600">
                    <FaTrash className="text-xl" />
                    <h3 className="text-lg font-bold">Danger Zone</h3>
                </div>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border border-red-200/50 rounded-xl bg-red-500/5 gap-3">
                    <div>
                        <h4 className="font-bold text-[var(--text-primary)]">Delete Account</h4>
                        <p className="text-sm text-[var(--text-secondary)]">Permanently remove your account</p>
                    </div>
                    <Button variant="danger" onClick={() => setShowDeleteModal(true)}>
                        Delete
                    </Button>
                </div>
            </div>
          </Card>
        ) : (
          /* ================= SOCIAL PROFILE ================= */
          <>
            <section className="profile-card">
              <div className="profile-cover" aria-hidden="true" />
              <div className="profile-card-body">
                <div className="profile-hero-row">
                  <div className="profile-avatar-wrap">
                    <div className="profile-avatar">
                      {getAvatarUrl() ? (
                        <img src={getAvatarUrl()} alt={userData?.name} />
                      ) : (
                        <span>{userData?.name?.charAt(0)}</span>
                      )}
                    </div>
                  </div>
                  <div className="profile-hero-main">
                    <div className="profile-name-row">
                      <h2>{userData?.name}</h2>
                      {userData?.role === "admin" ? <span className="profile-badge">Admin</span> : null}
                    </div>
                    <p className="profile-handle">@{(userData?.email || "student").split("@")[0]}</p>
                    <p className="profile-bio">
                      {[privacy.showUniversity ? userData?.university : null, userData?.branch, userData?.year || userData?.semester]
                        .filter(Boolean)
                        .join(" · ") || "Add university, branch & semester in Edit profile"}
                    </p>
                    <div className="profile-actions">
                      <button type="button" className="desk-solid-btn" onClick={() => setIsEditing(true)}>
                        <FaPen /> Edit profile
                      </button>
                      <button type="button" className="desk-ghost-btn" onClick={() => setLogoutOpen(true)}>
                        <FaArrowRightFromBracket /> Log out
                      </button>
                    </div>
                  </div>
                </div>

                <div className="profile-metric-row">
                  {[
                    { value: libraryStats.total, label: "Notes", tone: "green" },
                    { value: libraryStats.inReview, label: "In review", tone: "blue" },
                    { value: libraryStats.livePublic, label: "Live", tone: "violet" },
                    { value: stats.auraPoints || 0, label: "Aura", tone: "amber" },
                  ].map((item) => (
                    <div key={item.label} className={"profile-metric profile-metric--" + item.tone}>
                      <strong>{item.value}</strong>
                      <span>{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <div className="desk-tabs profile-tabs">
              {[
                { id: "about", label: "About" },
                { id: "privacy", label: "Privacy" },
                { id: "account", label: "Account" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  className={"desk-tab" + (settingsTab === tab.id ? " is-on" : "")}
                  onClick={() => setSettingsTab(tab.id)}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {settingsTab === "about" && (
              <div className="profile-grid">
                <section className="desk-panel profile-panel">
                  <div className="desk-panel-head">
                    <h2><FaAward /> Aura</h2>
                    <span className="profile-chip">{getAuraTier(stats.auraPoints).tier}</span>
                  </div>
                  <p className="profile-aura-line">
                    <span className="profile-aura-emoji">{getAuraTier(stats.auraPoints).emoji}</span>
                    <strong>{getAuraTier(stats.auraPoints).rank}</strong>
                    <span className="profile-aura-points">{stats.auraPoints || 0} pts</span>
                  </p>
                  <p className="desk-sub" style={{ marginTop: 8 }}>
                    Earned when students download your public notes (+3 each). Share useful notes to climb ranks.
                  </p>
                </section>
                <section className="desk-panel profile-panel">
                  <div className="desk-panel-head">
                    <h2><FaBuildingColumns /> Academic</h2>
                  </div>
                  <div className="profile-kv">
                    <div><span>University</span><strong>{userData?.university || "Not set"}</strong></div>
                    <div><span>Branch</span><strong>{userData?.branch || "Not set"}</strong></div>
                    <div><span>Semester</span><strong>{userData?.year || userData?.semester || "Not set"}</strong></div>
                    <div><span>Member since</span><strong>{new Date(userData?.createdAt || Date.now()).toLocaleDateString()}</strong></div>
                    {privacy.showEmail ? (
                      <div><span>Email</span><strong>{userData?.email}</strong></div>
                    ) : null}
                  </div>
                </section>
              </div>
            )}

            {settingsTab === "privacy" && (
              <section className="desk-panel profile-panel">
                <div className="desk-panel-head">
                  <h2><FaShieldHalved /> Privacy & visibility</h2>
                </div>
                <p className="desk-sub" style={{ marginBottom: 8 }}>
                  Control what others can see on your profile.
                </p>
                {[
                  { key: "publicProfile", title: "Public profile", desc: "Anyone on Medha can view your profile page", Icon: FaEye },
                  { key: "showUniversity", title: "Show university & branch", desc: "Display academic details on your profile", Icon: FaBuildingColumns },
                  { key: "showEmail", title: "Show email", desc: "Let others see your email address", Icon: FaUser },
                  { key: "showActivity", title: "Show activity", desc: "Surface recent notes and contribution stats", Icon: FaFileLines },
                ].map((row) => {
                  const Icon = row.Icon;
                  return (
                    <div key={row.key} className="privacy-row">
                      <span className="privacy-row-icon"><Icon size={16} /></span>
                      <span className="privacy-row-copy">
                        <strong>{row.title}</strong>
                        <span>{row.desc}</span>
                      </span>
                      <button
                        type="button"
                        role="switch"
                        aria-checked={privacy[row.key]}
                        className={"privacy-switch" + (privacy[row.key] ? " is-on" : "")}
                        onClick={() => updatePrivacy(row.key, !privacy[row.key])}
                      >
                        <span />
                      </button>
                    </div>
                  );
                })}
                {!privacy.publicProfile ? (
                  <p className="privacy-note"><FaLock /> Your profile is private. Only you can see full details.</p>
                ) : null}
              </section>
            )}

            {settingsTab === "account" && (
              <div className="profile-grid">
                <section className="desk-panel profile-panel">
                  <div className="desk-panel-head">
                    <h2><FaGear /> Account</h2>
                  </div>
                  <div className="account-actions">
                    {showOps ? (
                      <button type="button" className="desk-ghost-btn" onClick={() => navigate("/admin")}>
                        <FaShieldHalved /> Ops desk
                      </button>
                    ) : null}
                    <button type="button" className="desk-ghost-btn" onClick={() => setIsEditing(true)}>
                      <FaPen /> Edit profile details
                    </button>
                    <button type="button" className="desk-ghost-btn" onClick={() => navigate("/notes?scope=mine")}>
                      <FaFileLines /> Manage uploads
                    </button>
                    <button type="button" className="desk-ghost-btn" onClick={() => setLogoutOpen(true)}>
                      <FaArrowRightFromBracket /> Log out
                    </button>
                  </div>
                </section>
                <section className="desk-panel profile-panel profile-danger">
                  <div className="desk-panel-head">
                    <h2><FaTrash /> Danger zone</h2>
                  </div>
                  <p className="desk-sub">Permanently delete your account and all associated data.</p>
                  <Button variant="danger" className="mt-4" onClick={() => setShowDeleteModal(true)}>
                    Delete account
                  </Button>
                </section>
              </div>
            )}
          </>
        )}

        {/* Modals */}
        {showDeleteModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
              <Card className="max-w-md w-full shadow-2xl bg-white">
                <h3 className="text-xl font-bold mb-4 text-red-600 flex items-center gap-2">
                   <FaTrash /> Delete Account
                </h3>
                {deleteStep === 1 ? (
                   <div className="space-y-4">
                        <p className="font-medium text-slate-700">We're sorry to see you go. Please tell us why you are leaving:</p>
                        <div className="space-y-2">
                            {DELETE_REASONS.map(reason => (
                                <button
                                    key={reason}
                                    onClick={() => setDeleteReason(reason)}
                                    className={`w-full text-left px-4 py-3 rounded-xl border transition-all ${
                                        deleteReason === reason ? "border-red-500 bg-red-50 text-red-700 font-bold" : "border-slate-200 hover:bg-slate-50"
                                    }`}
                                >
                                    {reason}
                                </button>
                            ))}
                        </div>
                        {deleteReason === "Other" && (
                            <textarea
                                placeholder="Please let us know..."
                                value={otherReason}
                                onChange={(e) => setOtherReason(e.target.value)}
                                className="w-full p-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-red-200"
                                rows={3}
                            />
                        )}
                        <div className="flex gap-3 pt-4">
                            <Button variant="ghost" onClick={resetDeleteModal} fullWidth>Cancel</Button>
                            <Button variant="danger" disabled={!deleteReason} onClick={() => setDeleteStep(2)} fullWidth>Continue</Button>
                        </div>
                   </div>
                ) : (
                   <div className="space-y-4">
                        <div className="p-4 bg-red-50 text-red-800 rounded-xl text-sm border border-red-100">
                             <strong>Warning:</strong> This action is permanent and cannot be undone. All your notes, stats, and data will be erased.
                        </div>
                        <div>
                             <label className="block text-sm font-bold text-slate-700 mb-2">Type "delete" to confirm</label>
                             <input 
                                type="text" 
                                value={deleteConfirmText}
                                onChange={(e) => setDeleteConfirmText(e.target.value)}
                                placeholder="delete"
                                className="w-full p-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-red-200"
                             />
                        </div>
                        <div className="flex gap-3 pt-2">
                            <Button variant="ghost" onClick={() => setDeleteStep(1)} fullWidth>Back</Button>
                            <Button 
                                variant="danger" 
                                disabled={deleteConfirmText !== "delete" || deleting} 
                                loading={deleting}
                                onClick={handleDeleteAccount} 
                                fullWidth
                            >
                                Confirm Delete
                            </Button>
                        </div>
                   </div>
                )}
              </Card>
            </div>
        )}

        {showCropModal && tempImage && (
          <ImageCropper
            imageSrc={tempImage}
            onCancel={() => {
              setShowCropModal(false);
              setTempImage(null);
            }}
            onSave={handleCropSave}
          />
        )}

        <LogoutConfirm
          open={logoutOpen}
          onCancel={() => setLogoutOpen(false)}
          onConfirm={() => {
            setLogoutOpen(false);
            logout?.();
            navigate("/", { replace: true });
          }}
        />
      </div>
    </div>
    </RevisionShell>
  );
};

export default Profile;

