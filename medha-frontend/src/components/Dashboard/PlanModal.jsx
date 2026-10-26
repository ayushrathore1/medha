import React from "react";
import { FaXmark, FaThumbtack } from "react-icons/fa6";
import { createPortal } from "react-dom";
import ReactMarkdown from "react-markdown";

const PlanModal = ({ isOpen, onClose, plan }) => {
  if (!isOpen) return null;

  // Parse the plan into tasks (Chunks separated by '---')
  const tasks = plan
    .split('---') 
    .map(chunk => chunk.trim())
    .filter(chunk => chunk.length > 0); 

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div 
        className="relative w-full max-w-5xl h-[80vh] rounded-xl shadow-2xl overflow-hidden flex flex-col"
        style={{
          backgroundColor: "#d4a373", // Corkboard color
          backgroundImage: `url("https://www.transparenttextures.com/patterns/cork-board.png")`, // Subtle cork texture
          border: "12px solid #8d6e63", // Wood frame
          boxShadow: "inset 0 0 20px rgba(0,0,0,0.3), 0 10px 30px rgba(0,0,0,0.5)"
        }}
      >
        {/* Header */}
        <div className="bg-white/90 backdrop-blur px-6 py-4 flex justify-between items-center border-b-4 border-[#8d6e63] shadow-md z-10">
          <h2 className="text-3xl font-extrabold text-[#5d4037] flex items-center gap-3">
            <FaThumbtack className="text-red-500 transform -rotate-45" />
            Today's Mission Board
          </h2>
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-red-100 text-red-600 transition-colors"
          >
            <FaXmark size={24} />
          </button>
        </div>

        {/* Board Content */}
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {tasks.map((task, index) => {
              // Rotate cards slightly for a natural look
              const rotation = Math.random() * 6 - 3; // Random rotation between -3 and 3 deg
              const colors = ["#fff9c4", "#e1bee7", "#c8e6c9", "#bbdefb", "#ffccbc"];
              const color = colors[index % colors.length];

              return (
                <div 
                  key={index}
                  className="relative p-6 pt-8 shadow-lg transition-transform hover:scale-105 hover:z-10 duration-300"
                  style={{
                    backgroundColor: color,
                    transform: `rotate(${rotation}deg)`,
                    fontFamily: '"Comic Sans MS", "Chalkboard SE", sans-serif', // Handwritten-ish font
                    minHeight: "200px",
                  }}
                >
                  {/* Pin */}
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 text-red-600 drop-shadow-md">
                    <FaThumbtack size={24} />
                  </div>
                  
                  <div className="text-gray-900 text-base font-medium leading-relaxed prose prose-sm max-w-none">
                    <ReactMarkdown
                      components={{
                        // Custom styling for elements to look "handwritten"
                        strong: ({node, ...props}) => <span className="font-bold text-black" {...props} />,
                        ul: ({node, ...props}) => <ul className="list-disc pl-4 space-y-1" {...props} />,
                        li: ({node, ...props}) => <li className="pl-1" {...props} />,
                        h1: ({node, ...props}) => <h3 className="text-xl font-bold mb-2 border-b border-black/20 pb-1" {...props} />,
                        h2: ({node, ...props}) => <h4 className="text-lg font-bold mb-2" {...props} />,
                      }}
                    >
                      {task}
                    </ReactMarkdown>
                  </div>
                </div>
              );
            })}
          </div>
          
          {tasks.length === 0 && (
             <div className="flex flex-col items-center justify-center h-full text-[#5d4037] opacity-60">
                <p className="text-2xl font-bold">Board is empty</p>
                <p>Generate a plan to see your tasks here!</p>
             </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
};

export default PlanModal;
