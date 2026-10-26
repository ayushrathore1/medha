import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { 
  FaBell, FaCheck, FaCircleCheck, FaTriangleExclamation, 
  FaCircleInfo, FaHeart, FaRocket, FaEnvelope 
} from "react-icons/fa6";
import Card from "../components/Common/Card";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

// Original changelog data
const updates = [
  {
    version: "2.9.0",
    date: "December 2025",
    title: "Notes Sharing Platform",
    features: [
      "📤 Upload and share notes with the community",
      "📥 Download notes shared by other students",
      "🔍 Search notes by subject, topic, or keyword",
      "⭐ Rate and review shared notes",
      "📚 Subject-wise organization for easy browsing",
    ],
  },
  {
    version: "2.8.0",
    date: "December 2025",
    title: "Admin Dashboard & Email System",
    features: [
      "📧 AI-powered email composer for admin broadcasts",
      "📊 Email history tracking with re-send capability",
      "👥 User management with individual/bulk messaging",
      "🎨 Refreshed UI with light theme consistency",
      "🔒 Enhanced security with balanced rate limiting",
    ],
  },
  {
    version: "2.7.0",
    date: "December 2025",
    title: "RTU Exam Paper Analysis",
    features: [
      "📝 Digital Electronics 2024 & 2025 paper analysis",
      "📊 Unit-wise marks distribution with weightage %",
      "🎯 98 marks breakdown (including optional questions)",
      "📖 Complete documentation for adding new papers",
      "🧮 KaTeX math equation rendering in solutions",
    ],
  },
  {
    version: "2.6.0",
    date: "December 2025",
    title: "WhatsApp-Style Messaging",
    features: [
      "💬 Real-time chat with admin support",
      "📢 Broadcast announcements to all users",
      "🔔 Notification badges for new messages",
      "👥 Admin contact list & user management",
    ],
  },
  {
    version: "2.5.0",
    date: "December 2025",
    title: "AI-Powered Exam Solutions",
    features: [
      "🤖 'Medha, solve it' - AI generates exam-ready solutions",
      "🌐 Real-time web search for current topics",
      "📊 Enhanced markdown rendering with tables & math equations",
      "💬 Chat history with session management",
    ],
  },
  {
    version: "2.4.0",
    date: "December 2025",
    title: "RTU Exam Weightage",
    features: [
      "📝 Unit-wise weightage analysis for RTU papers",
      "🎯 Question bank with marks distribution",
      "📺 YouTube lecture links for each unit",
      "📈 Visualized progress bars",
    ],
  },
  {
    version: "2.3.0",
    date: "November 2025",
    title: "Enhanced Study Tools",
    features: [
      "🧠 AI Daily Coach with personalized study plans",
      "📚 Flashcard system with difficulty tracking",
      "✅ Topic-based review management",
      "🎯 Quiz generation from topics",
    ],
  },
  {
    version: "2.0.0",
    date: "October 2025",
    title: "Medha AI Launch",
    features: [
      "🚀 Initial release of Medha AI",
      "💬 AI chatbot for study assistance",
      "📚 Syllabus integration for RTU",
      "👤 User profiles and authentication",
    ],
  },
];

const Notifications = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("activity"); // "activity" | "changelog"
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    setLoading(true);
    try {
      const res = await axios.get(`${BACKEND_URL}/api/notifications`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNotifications(res.data.notifications || []);
      setUnreadCount(res.data.unreadCount || 0);
    } catch (err) {
      console.error("Error fetching notifications");
    } finally {
      setLoading(false);
    }
  };

  const markRead = async (id = "all") => {
    const token = localStorage.getItem("token");
    try {
      if (id === "all") {
        // Optimistic update
        setNotifications(notifications.map(n => ({ ...n, read: true })));
        setUnreadCount(0);
        await axios.put(`${BACKEND_URL}/api/notifications/all/read`, {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
         const notif = notifications.find(n => n._id === id);
         if (notif && !notif.read) {
            setNotifications(notifications.map(n => n._id === id ? { ...n, read: true } : n));
            setUnreadCount(prev => Math.max(0, prev - 1));
            await axios.put(`${BACKEND_URL}/api/notifications/${id}/read`, {}, {
              headers: { Authorization: `Bearer ${token}` }
            });
         }
      }
    } catch (err) {
      console.error("Error marking read");
    }
  };

  const getIconAndColor = (type) => {
    switch(type) {
      case "like": return { icon: <FaHeart />, color: "text-[var(--color-danger-text)]", bg: "bg-[var(--color-danger-bg)]/20" };
      case "feature": return { icon: <FaRocket />, color: "text-[var(--action-primary)]", bg: "bg-[var(--action-primary)]/10" };
      case "success": return { icon: <FaCircleCheck />, color: "text-[var(--color-success-text)]", bg: "bg-[var(--color-success-bg)]/20" };
      case "warning": return { icon: <FaTriangleExclamation />, color: "text-[var(--color-warning-text)]", bg: "bg-[var(--color-warning-bg)]/20" };
      case "message": return { icon: <FaEnvelope />, color: "text-[var(--action-hover)]", bg: "bg-[var(--action-hover)]/10" };
      case "info": default: return { icon: <FaCircleInfo />, color: "text-[var(--action-primary)]", bg: "bg-[var(--action-primary)]/10" };
    }
  };

  return (
    <div className="min-h-screen pt-24 px-4 sm:px-6 pb-12 bg-transparent">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-black tracking-tight" style={{ color: "var(--text-primary)" }}>Notifications</h1>
            {activeTab === "activity" && notifications.length > 0 && unreadCount > 0 && (
              <button 
                onClick={() => markRead("all")} 
                className="text-sm font-bold px-3 py-1.5 rounded-lg transition-colors"
                style={{ 
                   color: "var(--action-primary)",
                   backgroundColor: "transparent"
                }}
                onMouseEnter={(e) => {
                   e.currentTarget.style.backgroundColor = "var(--action-primary)"; 
                   e.currentTarget.style.opacity = "0.1";
                }}
                onMouseLeave={(e) => {
                   e.currentTarget.style.backgroundColor = "transparent";
                   e.currentTarget.style.opacity = "1";
                }}
              >
                 Mark all as read
              </button>
            )}
          </div>
          
          <div className="flex gap-1 p-1.5 rounded-2xl shadow-sm border w-fit" style={{ backgroundColor: "var(--bg-secondary)", borderColor: "var(--border-default)" }}>
             <button 
               onClick={() => setActiveTab("activity")}
               className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${
                 activeTab === "activity" 
                   ? "shadow-lg" 
                   : "hover:bg-[var(--bg-tertiary)]"
               }`}
               style={{
                 backgroundColor: activeTab === "activity" ? "var(--action-primary)" : "transparent",
                 color: activeTab === "activity" ? "#fff" : "var(--text-tertiary)"
               }}
             >
               Activity
               {unreadCount > 0 && (
                 <span className="text-white text-[10px] px-1.5 h-5 min-w-[20px] flex items-center justify-center rounded-full ml-1" style={{ backgroundColor: "var(--color-danger-bg)" }}>
                   {unreadCount}
                 </span>
               )}
             </button>
             <button 
               onClick={() => setActiveTab("changelog")}
               className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${
                 activeTab === "changelog" 
                   ? "shadow-lg" 
                   : "hover:bg-[var(--bg-tertiary)]"
               }`}
               style={{
                 backgroundColor: activeTab === "changelog" ? "var(--action-primary)" : "transparent",
                 color: activeTab === "changelog" ? "#fff" : "var(--text-tertiary)"
               }}
             >
               What's New
             </button>
          </div>
        </header>

        {activeTab === "activity" && (
           <div className="space-y-4">
             {loading ? (
                <div className="py-20 text-center" style={{ color: "var(--text-tertiary)" }}>Loading...</div>
             ) : notifications.length === 0 ? (
               <div className="text-center py-20 rounded-3xl border border-dashed" style={{ backgroundColor: "var(--bg-secondary)", borderColor: "var(--border-default)" }}>
                 <div className="inline-flex justify-center items-center w-16 h-16 rounded-full mb-4" style={{ backgroundColor: "var(--bg-tertiary)" }}>
                   <FaBell className="text-2xl" style={{ color: "var(--text-tertiary)" }} />
                 </div>
                 <h3 className="text-lg font-bold" style={{ color: "var(--text-primary)" }}>All caught up!</h3>
                 <p className="font-medium mt-1" style={{ color: "var(--text-secondary)" }}>No new notifications to show.</p>
               </div>
             ) : (
                <div className="space-y-3">
                  {notifications.map(n => {
                    const style = getIconAndColor(n.type);
                    return (
                      <div 
                        key={n._id} 
                        onClick={() => {
                          if (!n.read) markRead(n._id);
                          if (n.link) navigate(n.link);
                        }}
                        className={`group relative p-5 rounded-2xl border transition-all cursor-pointer hover:shadow-md`}
                        style={{
                          backgroundColor: n.read ? "var(--bg-secondary)" : "var(--bg-tertiary)",
                          borderColor: n.read ? "var(--border-default)" : "var(--action-primary)",
                          opacity: n.read ? 0.9 : 1
                        }}
                      >
                         {!n.read && (
                           <div className="absolute top-5 right-5 w-2.5 h-2.5 rounded-full ring-4" 
                                style={{ backgroundColor: "var(--action-primary)", ringColor: "var(--bg-secondary)" }}>
                           </div>
                         )}
                         <div className="flex gap-4">
                            <div className={`mt-1 w-10 h-10 rounded-full flex items-center justify-center shrink-0 text-lg ${style.bg} ${style.color}`}>
                               {style.icon}
                            </div>
                            <div className="flex-1 pr-4">
                               <h4 className={`text-base ${n.read ? "font-bold" : "font-black"}`} style={{ color: n.read ? "var(--text-secondary)" : "var(--text-primary)" }}>
                                 {n.title}
                               </h4>
                               <p className={`text-sm mt-1 leading-relaxed ${n.read ? "font-medium" : "font-semibold"}`} style={{ color: n.read ? "var(--text-tertiary)" : "var(--text-secondary)" }}>
                                 {n.message}
                               </p>
                               <p className="text-xs font-bold mt-3 flex items-center gap-1" style={{ color: "var(--text-tertiary)" }}>
                                 {new Date(n.createdAt).toLocaleDateString()} at {new Date(n.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                               </p>
                            </div>
                         </div>
                      </div>
                    );
                  })}
                </div>
             )}
           </div>
        )}

        {activeTab === "changelog" && (
          <div className="space-y-6">
            {updates.map((update, idx) => (
              <Card key={idx} className="relative overflow-hidden shadow-none hover:shadow-md transition-shadow" style={{ borderColor: "var(--border-default)" }}>
                {idx === 0 && (
                  <div className="absolute top-0 right-0 text-white text-[10px] font-black tracking-widest uppercase px-3 py-1.5 rounded-bl-xl shadow-sm"
                       style={{ background: "linear-gradient(to right, var(--action-primary), var(--action-hover))" }}>
                    Latest Release
                  </div>
                )}
                <div className="flex items-center gap-3 mb-4">
                  <span 
                    className="px-3 py-1 rounded-lg text-xs font-black tracking-wide"
                    style={{ 
                      backgroundColor: idx === 0 ? "var(--action-primary)" : "var(--bg-tertiary)",
                      color: idx === 0 ? "#fff" : "var(--text-tertiary)",
                      opacity: idx === 0 ? 0.9 : 1 
                    }}
                  >
                    v{update.version}
                  </span>
                  <span className="text-xs font-bold" style={{ color: "var(--text-tertiary)" }}>
                    {update.date}
                  </span>
                </div>
                <h3 className="text-xl font-bold mb-4" style={{ color: "var(--text-primary)" }}>
                  {update.title}
                </h3>
                <ul className="space-y-3">
                  {update.features.map((feature, fIdx) => (
                    <li key={fIdx} className="text-sm font-medium flex items-start gap-3" style={{ color: "var(--text-secondary)" }}>
                      <div className="mt-0.5 rounded-full p-0.5" style={{ backgroundColor: "var(--color-success-bg)", color: "var(--color-success-text)", opacity: 0.8 }}>
                        <FaCheck size={8} />
                      </div>
                      <span className="flex-1">{feature}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;
