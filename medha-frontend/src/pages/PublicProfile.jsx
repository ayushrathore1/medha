import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Card from "../components/Common/Card";
import Button from "../components/Common/Button";
import Loader from "../components/Common/Loader";
import { AuthContext } from "../AuthContext"; // Assuming this exists for auth state
import { generateAvatarOptions, getAvatarByIndex } from "../utils/avatarUtils";
import { 
  FaMars, 
  FaVenus, 
  FaGenderless, 
  FaUser, 
  FaUserPlus, 
  FaUserCheck, 
  FaFileLines, 
  FaUsers,
  FaBuildingColumns,
  FaAward
} from "react-icons/fa6";

// AURA Tier Calculator based on notes shared
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

const PublicProfile = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { user: currentUser } = useContext(AuthContext); 
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, [userId]);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/users/profile/${userId}`,
        { headers }
      );
      
      setProfileData(response.data);
      setIsFollowing(response.data.isFollowing);
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFollowToggle = async () => {
    if (!currentUser) {
        console.log("User not logged in");
        return;
    }
    
    setFollowLoading(true);
    try {
      const token = localStorage.getItem("token");
      const url = `${import.meta.env.VITE_BACKEND_URL}/api/users/${userId}/follow`;
      
      if (isFollowing) {
        await axios.delete(url, { headers: { Authorization: `Bearer ${token}` } });
        setIsFollowing(false);
        setProfileData(prev => ({
            ...prev,
            stats: { ...prev.stats, followers: prev.stats.followers - 1 }
        }));
      } else {
        await axios.post(url, {}, { headers: { Authorization: `Bearer ${token}` } });
        setIsFollowing(true);
        setProfileData(prev => ({
            ...prev,
            stats: { ...prev.stats, followers: prev.stats.followers + 1 }
        }));
      }
    } catch (error) {
      console.error("Error toggling follow:", error);
    } finally {
      setFollowLoading(false);
    }
  };

  if (loading) return <Loader fullScreen />;
  if (!profileData) return <div className="text-center py-20 text-xl font-bold text-[var(--text-tertiary)]">User not found</div>;

  const { user, stats } = profileData;
  const isMe = currentUser && currentUser._id === user._id;

  // Helper to get avatar URL (reuse generic or custom logic)
  const getAvatarUrl = () => {
      if (user.avatar) return user.avatar;
      return null; // Fallback handled in render
  };

  return (
    <div className="min-h-screen w-full px-4 py-8 sm:px-8 bg-transparent">
        <div className="max-w-4xl mx-auto space-y-6">
            <Card className="shadow-xl border-t-4 border-[var(--action-primary)] bg-[var(--bg-secondary)] overflow-hidden">
                <div className="relative pt-6 px-6 pb-8 text-center sm:text-left sm:flex sm:items-end sm:justify-between">
                    
                    <div className="flex flex-col sm:flex-row items-center gap-6">
                        {/* Avatar */}
                        <div className="relative">
                            <div className="w-32 h-32 rounded-full border-4 border-[var(--bg-secondary)] shadow-lg overflow-hidden bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                                {getAvatarUrl() ? (
                                    <img src={getAvatarUrl()} alt={user.name} className="w-full h-full object-cover" />
                                ) : (
                                    <span className="text-4xl text-white font-bold">{user.name?.charAt(0)}</span>
                                )}
                            </div>
                            {user.gender && (
                                <div className={`absolute bottom-1 right-1 w-8 h-8 rounded-full flex items-center justify-center shadow border-2 border-white ${
                                    user.gender === "Male" ? "bg-blue-500" : 
                                    user.gender === "Female" ? "bg-pink-500" : "bg-purple-500"
                                }`}>
                                    {user.gender === "Male" ? <FaMars className="text-white text-xs" /> : 
                                     user.gender === "Female" ? <FaVenus className="text-white text-xs" /> : 
                                     <FaGenderless className="text-white text-xs" />}
                                </div>
                            )}
                        </div>

                        {/* Name & Info */}
                        <div className="space-y-1 text-center sm:text-left">
                            <h1 className="text-3xl font-black text-[var(--text-primary)] flex items-center gap-2 justify-center sm:justify-start">
                                {user.name}
                                {user.role === 'admin' && <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full border border-red-200 uppercase tracking-wide">Admin</span>}
                                {user.role === 'team' && <span className="text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full border border-blue-200 uppercase tracking-wide">Team</span>}
                            </h1>
                            <p className="text-[var(--text-secondary)] font-medium text-lg flex items-center gap-2 justify-center sm:justify-start">
                                {user.university || "University Student"} 
                                {user.branch && <span className="text-[var(--text-tertiary)]">• {user.branch}</span>}
                            </p>
                            
                            {/* Stats */}
                            <div className="flex items-center gap-6 mt-4 justify-center sm:justify-start">
                                <div className="text-center sm:text-left">
                                    <div className="text-2xl font-bold text-[var(--text-primary)]">{stats.followers}</div>
                                    <div className="text-xs font-bold uppercase text-[var(--text-tertiary)] tracking-wide">Followers</div>
                                </div>
                                <div className="text-center sm:text-left">
                                    <div className="text-2xl font-bold text-[var(--text-primary)]">{stats.following}</div>
                                    <div className="text-xs font-bold uppercase text-[var(--text-tertiary)] tracking-wide">Following</div>
                                </div>
                                <div className="text-center sm:text-left">
                                    <div className="text-2xl font-bold text-[var(--text-primary)]">{stats.notesShared}</div>
                                    <div className="text-xs font-bold uppercase text-[var(--text-tertiary)] tracking-wide">Notes Shared</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Action Button */}
                    <div className="mt-6 sm:mt-0">
                        {isMe ? (
                            <Button variant="secondary" onClick={() => navigate("/profile")}>Edit Profile</Button>
                        ) : (
                            <Button 
                                onClick={handleFollowToggle} 
                                loading={followLoading}
                                variant={isFollowing ? "outline" : "primary"}
                                className={isFollowing ? "border-2 border-[var(--action-primary)] text-[var(--action-primary)] hover:bg-[var(--action-primary)] hover:text-white" : ""}
                            >
                                {isFollowing ? (
                                    <>
                                        <FaUserCheck className="mr-2" /> Following
                                    </>
                                ) : (
                                    <>
                                        <FaUserPlus className="mr-2" /> Follow
                                    </>
                                )}
                            </Button>
                        )}
                    </div>
                </div>
            </Card>

            {/* AURA Card */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-[var(--bg-secondary)] border border-[var(--border-default)] relative overflow-hidden">
                    {/* Animated glow background */}
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
                            <span className="text-sm font-bold text-[var(--text-primary)]">{user.university || "Not set"}</span>
                        </div>
                        <div className="flex justify-between border-b border-[var(--border-default)] pb-2">
                            <span className="text-sm text-[var(--text-secondary)]">Branch</span>
                            <span className="text-sm font-bold text-[var(--text-primary)]">{user.branch || "Not set"}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-sm text-[var(--text-secondary)]">Joined</span>
                            <span className="text-sm font-bold text-[var(--text-primary)]">{new Date(user.createdAt).toLocaleDateString()}</span>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    </div>
  );
};

export default PublicProfile;
