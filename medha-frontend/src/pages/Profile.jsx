import React, { useState, useEffect, useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Card from "../components/Common/Card";
import Button from "../components/Common/Button";
import Loader from "../components/Common/Loader";
import { AuthContext } from "../AuthContext";
import api from "../api/api";
import { generateAvatarOptions, getAvatarByIndex } from "../utils/avatarUtils";
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
  FaUsers,
  FaFileLines,
  FaPen,
  FaCloudArrowUp,
  FaBookOpen,
  FaCircleCheck,
  FaSpinner,
  FaCircleXmark,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa6";

const UNIVERSITIES = ["RTU", "GGSIPU", "DTU", "AKTU"];
const BRANCHES = ["CSE", "IT", "ECE", "EE", "ME", "Civil", "AIDS"];
const GENDERS = ["Male", "Female", "Other"];

const GenderIcon = ({ gender }) => {
  switch (gender) {
    case "Male": return <FaMars />;
    case "Female": return <FaVenus />;
    default: return <FaGenderless />;
  }
};

// AURA Tier Calculator
const getAuraTier = (notesCount) => {
  // 🟣 ADVANCED TIER — RADIANCE
  if (notesCount >= 701) return { tier: "RADIANCE", rank: "Beacon", emoji: "🟣" };
  if (notesCount >= 401) return { tier: "RADIANCE", rank: "Luminary", emoji: "🟣" };
  if (notesCount >= 251) return { tier: "RADIANCE", rank: "Scholar", emoji: "🟣" };
  if (notesCount >= 151) return { tier: "RADIANCE", rank: "Mentor", emoji: "🟣" };
  
  // 🔵 INTERMEDIATE TIER — GLOW
  if (notesCount >= 101) return { tier: "GLOW", rank: "Anchor", emoji: "🔵" };
  if (notesCount >= 61) return { tier: "GLOW", rank: "Guide", emoji: "🔵" };
  if (notesCount >= 36) return { tier: "GLOW", rank: "Solver", emoji: "🔵" };
  if (notesCount >= 21) return { tier: "GLOW", rank: "Thinker", emoji: "🔵" };
  
  // 🌱 BEGINNER TIER — SPARK
  if (notesCount >= 11) return { tier: "SPARK", rank: "Builder", emoji: "🌱" };
  if (notesCount >= 6) return { tier: "SPARK", rank: "Initiate", emoji: "🌱" };
  if (notesCount >= 3) return { tier: "SPARK", rank: "Seeker", emoji: "🌱" };
  if (notesCount >= 1) return { tier: "SPARK", rank: "Flicker", emoji: "🌱" };
  
  return { tier: "SPARK", rank: "New", emoji: "✨" };
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
  const { setUser, logout } = useContext(AuthContext);
  const [userData, setUserData] = useState(null);
  const [stats, setStats] = useState({ followers: 0, following: 0, notesShared: 0 });
  const [isEditing, setIsEditing] = useState(false);
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
    gender: "",
    selectedAvatar: 0,
    customAvatar: null // Base64 string
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [imgError, setImgError] = useState(false);

  // Syllabus states
  const [syllabusSemesters, setSyllabusSemesters] = useState([]);
  const [syllabusUploading, setSyllabusUploading] = useState(false);
  const [selectedSem, setSelectedSem] = useState(null);
  const [expandedSubjects, setExpandedSubjects] = useState({});
  const syllabusFileRef = useRef(null);

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
    fetchSyllabus();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token");
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

      setUserData(responseProfile.data.user);
      if (responseProfile.data.stats) {
        setStats(responseProfile.data.stats);
      }

      setFormData({ 
        name: user.name || "", 
        email: user.email || "",
        university: user.university || "",
        branch: user.branch || "",
        gender: user.gender || "",
        selectedAvatar: user.avatarIndex || 0,
        customAvatar: null
      });
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  };

  // Syllabus API handlers
  const fetchSyllabus = async () => {
    try {
      const res = await api.get("/recommendations/syllabus");
      const sems = res.data.semesters || [];
      setSyllabusSemesters(sems);
      if (sems.length > 0 && !selectedSem) setSelectedSem(sems[0].semester);
    } catch (err) {
      console.error("Error fetching syllabus:", err);
    }
  };

  const handleSyllabusUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    e.target.value = null;

    setSyllabusUploading(true);
    try {
      const formData = new FormData();
      formData.append("syllabus", file);
      await api.post("/recommendations/syllabus/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      // Poll for processing completion
      pollSyllabusStatus();
    } catch (err) {
      console.error("Syllabus upload failed:", err);
      setSyllabusUploading(false);
    }
  };

  const pollSyllabusStatus = () => {
    const interval = setInterval(async () => {
      try {
        const res = await api.get("/recommendations/syllabus");
        const sems = res.data.semesters || [];
        if (sems.length > 0) {
          setSyllabusSemesters(sems);
          if (!selectedSem) setSelectedSem(sems[0].semester);
          setSyllabusUploading(false);
          clearInterval(interval);
        }
      } catch {
        clearInterval(interval);
        setSyllabusUploading(false);
      }
    }, 4000);
    setTimeout(() => clearInterval(interval), 120000);
  };

  const toggleSubjectExpand = (idx) => {
    setExpandedSubjects(prev => ({ ...prev, [idx]: !prev[idx] }));
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

  // ... (handleDeleteAccount remains same)

  // ... (resetDeleteModal remains same)

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
    <div className="min-h-screen w-full px-3 py-6 sm:px-8 sm:py-8 bg-transparent">
      <div className="max-w-4xl mx-auto space-y-6">
        
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
          /* ================= READ MODE (Public Profile Layout) ================= */
          <>
             {/* Header Card */}
             <Card className="shadow-xl border-t-4 border-[var(--action-primary)] bg-[var(--bg-secondary)] overflow-hidden">
                 <div className="relative pt-6 px-6 pb-8 text-center sm:text-left sm:flex sm:items-end sm:justify-between">
                     
                     <div className="flex flex-col sm:flex-row items-center gap-6">
                         {/* Avatar */}
                         <div className="relative">
                             <div className="w-32 h-32 rounded-full border-4 border-[var(--bg-secondary)] shadow-lg overflow-hidden bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                                 {getAvatarUrl() ? (
                                     <img src={getAvatarUrl()} alt={userData?.name} className="w-full h-full object-cover" />
                                 ) : (
                                     <span className="text-4xl text-white font-bold">{userData?.name?.charAt(0)}</span>
                                 )}
                             </div>
                             {userData?.gender && (
                                 <div className={`absolute bottom-1 right-1 w-8 h-8 rounded-full flex items-center justify-center shadow border-2 border-white ${
                                     userData.gender === "Male" ? "bg-blue-500" : 
                                     userData.gender === "Female" ? "bg-pink-500" : "bg-purple-500"
                                 }`}>
                                     <div className="text-white text-xs">
                                         <GenderIcon gender={userData.gender} />
                                     </div>
                                 </div>
                             )}
                         </div>

                         {/* Name & Info */}
                         <div className="space-y-1 text-center sm:text-left">
                             <h1 className="text-2xl sm:text-3xl font-black text-[var(--text-primary)] flex items-center gap-2 justify-center sm:justify-start flex-wrap">
                                 {userData?.name}
                                 {userData?.role === 'admin' && <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full border border-red-200 uppercase tracking-wide">Admin</span>}
                             </h1>
                             <p className="text-[var(--text-secondary)] font-medium text-lg flex items-center gap-2 justify-center sm:justify-start">
                                 {userData?.university || "University Student"} 
                                 {userData?.branch && <span className="text-[var(--text-tertiary)]">• {userData.branch}</span>}
                             </p>
                             
                             {/* Stats Row */}
                             <div className="flex items-center gap-3 sm:gap-6 mt-4 justify-center sm:justify-start flex-wrap">
                                 <div className="text-center sm:text-left">
                                     <div className="text-2xl font-bold text-[var(--text-primary)]">{stats.followers || 0}</div>
                                     <div className="text-xs font-bold uppercase text-[var(--text-tertiary)] tracking-wide">Followers</div>
                                 </div>
                                 <div className="text-center sm:text-left">
                                     <div className="text-2xl font-bold text-[var(--text-primary)]">{stats.following || 0}</div>
                                     <div className="text-xs font-bold uppercase text-[var(--text-tertiary)] tracking-wide">Following</div>
                                 </div>
                                 <div className="text-center sm:text-left">
                                     <div className="text-2xl font-bold text-[var(--text-primary)]">{stats.notesShared || 0}</div>
                                     <div className="text-xs font-bold uppercase text-[var(--text-tertiary)] tracking-wide">Notes Shared</div>
                                 </div>
                             </div>
                         </div>
                     </div>

                     {/* Edit Action */}
                     <div className="mt-6 sm:mt-0">
                          <Button variant="primary" onClick={() => setIsEditing(true)}>
                              <FaPen className="mr-2" /> Edit Profile
                          </Button>
                     </div>
                 </div>
             </Card>

             {/* Bio/Info Grid */}
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* AURA Card */}
                  <Card className="bg-[var(--bg-secondary)] border border-[var(--border-default)] relative overflow-hidden">
                      <div className="absolute inset-0 opacity-20" style={{
                          background: getAuraTier(stats.notesShared).tier === "RADIANCE" 
                              ? "radial-gradient(circle at 30% 30%, #a855f7 0%, transparent 50%)"
                              : getAuraTier(stats.notesShared).tier === "GLOW"
                              ? "radial-gradient(circle at 30% 30%, #3b82f6 0%, transparent 50%)"
                              : "radial-gradient(circle at 30% 30%, #22c55e 0%, transparent 50%)"
                      }} />
                      
                      <div className="relative z-10">
                          <div className="flex items-center gap-4 mb-4">
                              <div className={`p-3 rounded-xl ${
                                  getAuraTier(stats.notesShared).tier === "RADIANCE" 
                                      ? "bg-purple-100 text-purple-600"
                                      : getAuraTier(stats.notesShared).tier === "GLOW"
                                      ? "bg-blue-100 text-blue-600"
                                      : "bg-green-100 text-green-600"
                              }`}>
                                  <FaAward size={24} />
                              </div>
                              <div>
                                  <h3 className="text-lg font-bold text-[var(--text-primary)] flex items-center gap-2">
                                      AURA
                                      <span className={`text-xs px-2 py-0.5 rounded-full uppercase tracking-wide ${
                                          getAuraTier(stats.notesShared).tier === "RADIANCE" 
                                              ? "bg-purple-100 text-purple-700 border border-purple-200"
                                              : getAuraTier(stats.notesShared).tier === "GLOW"
                                              ? "bg-blue-100 text-blue-700 border border-blue-200"
                                              : "bg-green-100 text-green-700 border border-green-200"
                                      }`}>
                                          {getAuraTier(stats.notesShared).tier}
                                      </span>
                                  </h3>
                                  <p className="text-sm text-[var(--text-secondary)]">Contribution Level</p>
                              </div>
                          </div>
                          <div className="flex items-end gap-2">
                              <span className={`text-4xl font-black ${
                                  getAuraTier(stats.notesShared).tier === "RADIANCE" 
                                      ? "text-purple-600"
                                      : getAuraTier(stats.notesShared).tier === "GLOW"
                                      ? "text-blue-600"
                                      : "text-green-600"
                              }`}>{stats.notesShared}</span>
                              <span className="text-sm font-bold text-[var(--text-tertiary)] mb-2">Notes Shared</span>
                          </div>
                          <div className={`mt-3 inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold ${
                              getAuraTier(stats.notesShared).tier === "RADIANCE" 
                                  ? "bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-700 border border-purple-200"
                                  : getAuraTier(stats.notesShared).tier === "GLOW"
                                  ? "bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-blue-700 border border-blue-200"
                                  : "bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-700 border border-green-200"
                          }`}>
                              <span>{getAuraTier(stats.notesShared).emoji}</span>
                              <span>{getAuraTier(stats.notesShared).rank}</span>
                          </div>
                      </div>
                  </Card>

                  {/* Academic Card */}
                  <Card className="bg-[var(--bg-secondary)] border border-[var(--border-default)]">
                      <div className="flex items-center gap-4 mb-4">
                          <div className="p-3 bg-indigo-100 text-indigo-600 rounded-xl">
                              <FaBuildingColumns size={24} />
                          </div>
                          <div>
                              <h3 className="text-lg font-bold text-[var(--text-primary)]">Academic Info</h3>
                              <p className="text-sm text-[var(--text-secondary)]">University Details</p>
                          </div>
                      </div>
                      <div className="space-y-2">
                          <div className="flex justify-between border-b border-[var(--border-default)] pb-2">
                              <span className="text-sm text-[var(--text-secondary)]">University</span>
                              <span className="text-sm font-bold text-[var(--text-primary)]">{userData?.university || "Not set"}</span>
                          </div>
                          <div className="flex justify-between border-b border-[var(--border-default)] pb-2">
                              <span className="text-sm text-[var(--text-secondary)]">Branch</span>
                              <span className="text-sm font-bold text-[var(--text-primary)]">{userData?.branch || "Not set"}</span>
                          </div>
                          <div className="flex justify-between">
                              <span className="text-sm text-[var(--text-secondary)]">Member Since</span>
                              <span className="text-sm font-bold text-[var(--text-primary)]">{new Date(userData?.createdAt || Date.now()).toLocaleDateString()}</span>
                          </div>
                      </div>
                  </Card>
             </div>

             {/* University Syllabus Section */}
             <Card className="bg-[var(--bg-secondary)] border border-[var(--border-default)]">
                 <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-3">
                     <div className="flex items-center gap-4">
                         <div className="p-3 bg-green-100 text-green-600 rounded-xl">
                             <FaBookOpen size={24} />
                         </div>
                         <div>
                             <h3 className="text-lg font-bold text-[var(--text-primary)]">University Syllabus</h3>
                             <p className="text-sm text-[var(--text-secondary)]">
                                 {syllabusSemesters.length > 0
                                     ? `${userData?.university || ""} · ${userData?.branch || ""} · ${syllabusSemesters.length} semester${syllabusSemesters.length > 1 ? "s" : ""}`
                                     : "Upload your syllabus — it will be shared with all students of your university & branch"}
                             </p>
                         </div>
                     </div>
                     <div className="flex gap-2 w-full sm:w-auto">
                         <input
                             type="file"
                             ref={syllabusFileRef}
                             className="hidden"
                             accept=".pdf,.jpg,.jpeg,.png"
                             onChange={handleSyllabusUpload}
                         />
                         <Button
                             variant="primary" size="sm"
                             disabled={syllabusUploading}
                             onClick={() => syllabusFileRef.current?.click()}
                         >
                             {syllabusUploading ? (
                                 <><FaSpinner className="mr-1 animate-spin" /> Processing...</>
                             ) : (
                                 <><FaCloudArrowUp className="mr-1" /> {syllabusSemesters.length > 0 ? "Upload More" : "Upload Syllabus"}</>
                             )}
                         </Button>
                     </div>
                 </div>

                 {/* Processing state */}
                 {syllabusUploading && (
                     <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-center gap-3 mb-4">
                         <FaSpinner className="text-amber-600 animate-spin" />
                         <span className="text-sm text-amber-800 font-medium">
                             Extracting and structuring your syllabus with AI... This may take up to a minute.
                         </span>
                     </div>
                 )}

                 {/* Semester tabs */}
                 {syllabusSemesters.length > 0 && (
                     <div className="space-y-3">
                         <div className="flex gap-2 flex-wrap">
                             {syllabusSemesters.map((sem) => (
                                 <button
                                     key={sem.semester}
                                     onClick={() => { setSelectedSem(sem.semester); setExpandedSubjects({}); }}
                                     className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                                         selectedSem === sem.semester
                                             ? "bg-green-600 text-white shadow-md"
                                             : "bg-[var(--bg-tertiary)] text-[var(--text-secondary)] hover:bg-[var(--border-default)]"
                                     }`}
                                 >
                                     Sem {sem.semester}
                                     <span className={`text-xs ml-1.5 ${selectedSem === sem.semester ? "text-green-100" : "text-[var(--text-tertiary)]"}`}>
                                         {sem.subjects?.length || 0}
                                     </span>
                                 </button>
                             ))}
                         </div>

                         {/* Contributor badge */}
                         {(() => {
                             const activeSem = syllabusSemesters.find(s => s.semester === selectedSem);
                             if (!activeSem) return null;
                             return (
                                 <div className="flex items-center gap-2 text-xs text-[var(--text-tertiary)]">
                                     <FaUsers size={12} />
                                     <span>Contributed by {activeSem.contributorCount || 1} student{activeSem.contributorCount > 1 ? "s" : ""}</span>
                                 </div>
                             );
                         })()}

                         {/* Subjects for selected semester */}
                         {(() => {
                             const activeSem = syllabusSemesters.find(s => s.semester === selectedSem);
                             if (!activeSem) return null;
                             return (
                                 <div className="space-y-2">
                                     {(activeSem.subjects || []).map((subj, idx) => (
                                         <div key={idx} className="border border-[var(--border-default)] rounded-xl overflow-hidden">
                                             <button
                                                 onClick={() => toggleSubjectExpand(idx)}
                                                 className="w-full flex items-center justify-between p-3 hover:bg-[var(--bg-tertiary)] transition-colors text-left"
                                             >
                                                 <div>
                                                     <span className="text-sm font-bold text-[var(--text-primary)]">{subj.name}</span>
                                                     {subj.code && <span className="text-xs text-[var(--text-tertiary)] ml-2">({subj.code})</span>}
                                                     <span className="text-xs text-green-600 ml-2">{subj.units?.length || 0} units</span>
                                                 </div>
                                                 {expandedSubjects[idx] ? <FaChevronUp size={12} className="text-[var(--text-tertiary)]" /> : <FaChevronDown size={12} className="text-[var(--text-tertiary)]" />}
                                             </button>
                                             {expandedSubjects[idx] && (
                                                 <div className="px-3 pb-3 space-y-2">
                                                     {(subj.units || []).map((unit, ui) => (
                                                         <div key={ui} className="bg-[var(--bg-tertiary)] rounded-lg p-2.5">
                                                             <div className="text-xs font-bold text-[var(--text-secondary)] mb-1">
                                                                 Unit {unit.unitNumber}: {unit.title}
                                                             </div>
                                                             <div className="flex flex-wrap gap-1">
                                                                 {(unit.topics || []).map((topic, ti) => (
                                                                     <span key={ti} className="text-[10px] px-2 py-0.5 rounded-full bg-green-50 text-green-700 border border-green-200">
                                                                         {topic}
                                                                     </span>
                                                                 ))}
                                                             </div>
                                                         </div>
                                                     ))}
                                                 </div>
                                             )}
                                         </div>
                                     ))}
                                 </div>
                             );
                         })()}
                     </div>
                 )}

                 {/* No syllabus state */}
                 {syllabusSemesters.length === 0 && !syllabusUploading && (
                     <div className="text-center p-6 bg-[var(--bg-tertiary)] rounded-xl border border-dashed border-[var(--border-default)]">
                         <FaCloudArrowUp size={32} className="mx-auto text-[var(--text-tertiary)] mb-3" />
                         <p className="text-sm font-bold text-[var(--text-primary)] mb-1">Upload your university syllabus</p>
                         <p className="text-xs text-[var(--text-secondary)] mb-4">
                             PDF or image of your syllabus. AI extracts subjects & topics — shared with all students of your university for accurate lecture matching.
                         </p>
                         <Button variant="primary" size="sm" onClick={() => syllabusFileRef.current?.click()}>
                             <FaCloudArrowUp className="mr-1" /> Choose File
                         </Button>
                     </div>
                 )}
             </Card>
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
      </div>
    </div>
  );
};

export default Profile;

