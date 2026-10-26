import React, { useContext } from "react";
import { motion } from "framer-motion";
import { FaGraduationCap, FaClock, FaBell } from "react-icons/fa6";
import { AuthContext } from "../AuthContext";
import Card from "../components/Common/Card";

const ExamsComingSoon = () => {
  const { user } = useContext(AuthContext);
  
  const universityName = user?.university || "Your University";
  const branchName = user?.branch || "your branch";

  return (
    <div className="min-h-screen w-full p-6 bg-slate-50">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold text-slate-900 mb-2">
            {universityName} Exams
          </h1>
          <p className="text-lg text-slate-500">
            Exam resources for {branchName} students
          </p>
        </div>

        {/* Coming Soon Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="shadow-2xl border-slate-200 text-center py-16 px-8">
            {/* Icon */}
            <div className="flex justify-center mb-6">
              <motion.div 
                className="w-24 h-24 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-xl"
                animate={{ 
                  scale: [1, 1.05, 1],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{ 
                  duration: 3, 
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <FaClock className="text-white text-4xl" />
              </motion.div>
            </div>

            {/* Title */}
            <h2 className="text-3xl font-black text-slate-900 mb-4">
              Coming Soon! 🚀
            </h2>

            {/* Description */}
            <p className="text-lg text-slate-600 mb-8 max-w-md mx-auto">
              We're working hard to bring you exam resources, previous year questions, 
              and unit-wise weightage analysis for <span className="font-bold text-indigo-600">{universityName}</span> - <span className="font-bold text-indigo-600">{branchName}</span>.
            </p>

            {/* Features Coming */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <FaGraduationCap className="text-2xl text-indigo-500 mx-auto mb-2" />
                <div className="text-sm font-bold text-slate-700">Previous Year Papers</div>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <FaClock className="text-2xl text-amber-500 mx-auto mb-2" />
                <div className="text-sm font-bold text-slate-700">Unit-Wise Weightage</div>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <FaBell className="text-2xl text-emerald-500 mx-auto mb-2" />
                <div className="text-sm font-bold text-slate-700">Exam Date Alerts</div>
              </div>
            </div>

            {/* Note */}
            <div className="p-4 bg-gradient-to-r from-indigo-50 to-violet-50 rounded-xl border border-indigo-100">
              <p className="text-sm text-slate-600">
                <span className="font-bold text-indigo-600">Currently available:</span> RTU CSE 3rd Semester resources. 
                More universities and branches coming soon!
              </p>
            </div>
          </Card>
        </motion.div>

        {/* Stats */}
        <motion.div 
          className="mt-8 grid grid-cols-3 gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div className="text-center p-4 bg-white rounded-xl shadow border border-slate-100">
            <div className="text-2xl font-black text-indigo-600">4+</div>
            <div className="text-xs font-bold text-slate-500 uppercase">Universities</div>
          </div>
          <div className="text-center p-4 bg-white rounded-xl shadow border border-slate-100">
            <div className="text-2xl font-black text-indigo-600">7+</div>
            <div className="text-xs font-bold text-slate-500 uppercase">Branches</div>
          </div>
          <div className="text-center p-4 bg-white rounded-xl shadow border border-slate-100">
            <div className="text-2xl font-black text-indigo-600">Soon</div>
            <div className="text-xs font-bold text-slate-500 uppercase">Launch</div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ExamsComingSoon;
