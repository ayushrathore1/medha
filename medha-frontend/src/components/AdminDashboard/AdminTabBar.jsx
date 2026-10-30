import React from "react";
import axios from "axios";
import {
  FaInbox,
  FaEnvelopeOpen,
  FaBug,
  FaLightbulb,
  FaCircleCheck,
  FaClock,
  FaSpinner,
  FaTrash,
  FaXmark,
  FaFilter,
  FaArrowsRotate,
  FaPaperPlane,
  FaUser,
  FaArrowDownAZ,
  FaCalendarDays,
  FaMagnifyingGlass,
  FaWandMagicSparkles,
  FaEye,
  FaUsers,
  FaShieldHalved,
  FaUserMinus,
  FaPlus,
  FaMicrophone,
  FaCopy,
  FaCheck,
  FaUpload,
  FaFileAudio,
  FaCommentDots,
} from "react-icons/fa6";
import Card from "../Common/Card";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;


export default function AdminTabBar({ admin }) {
  const { activeTab, setActiveTab } = admin;
  return (
    <>
        <header className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-red-400 to-orange-500 bg-clip-text text-transparent mb-2">
              Admin Dashboard
            </h1>
            <p style={{ color: "var(--text-secondary)" }}>
              Manage everything from here
            </p>
          </div>

          <div className="admin-tabs">
            <button
              onClick={() => setActiveTab("messages")}
              className={`px-4 py-2 rounded-lg font-semibold transition-all border ${activeTab === "messages" ? "bg-purple-600 text-white border-purple-600" : "bg-white text-gray-500 hover:bg-gray-50 border-gray-200"}`}
            >
              Messages & Feedback
            </button>
            <button
              onClick={() => setActiveTab("email")}
              className={`px-4 py-2 rounded-lg font-semibold transition-all border ${activeTab === "email" ? "bg-purple-600 text-white border-purple-600" : "bg-white text-gray-500 hover:bg-gray-50 border-gray-200"}`}
            >
              Email Console
            </button>
            <button
              onClick={() => setActiveTab("history")}
              className={`px-4 py-2 rounded-lg font-semibold transition-all border ${activeTab === "history" ? "bg-purple-600 text-white border-purple-600" : "bg-white text-gray-500 hover:bg-gray-50 border-gray-200"}`}
            >
              <FaClock className="inline mr-2" /> History
            </button>
            <button
              onClick={() => setActiveTab("team")}
              className={`px-4 py-2 rounded-lg font-semibold transition-all border ${activeTab === "team" ? "bg-purple-600 text-white border-purple-600" : "bg-white text-gray-500 hover:bg-gray-50 border-gray-200"}`}
            >
              <FaUsers className="inline mr-2" /> Team
            </button>
            <button
              onClick={() => setActiveTab("transcribe")}
              className={`px-4 py-2 rounded-lg font-semibold transition-all border ${activeTab === "transcribe" ? "bg-purple-600 text-white border-purple-600" : "bg-white text-gray-500 hover:bg-gray-50 border-gray-200"}`}
            >
              <FaMicrophone className="inline mr-2" /> Transcribe
            </button>
            <button
              onClick={() => setActiveTab("suggestions")}
              className={`px-4 py-2 rounded-lg font-semibold transition-all border ${activeTab === "suggestions" ? "bg-purple-600 text-white border-purple-600" : "bg-white text-gray-500 hover:bg-gray-50 border-gray-200"}`}
            >
              <FaCommentDots className="inline mr-2" /> Suggestions
            </button>
          </div>
        </header>
    </>
  );
}
