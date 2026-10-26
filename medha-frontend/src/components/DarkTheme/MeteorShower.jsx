import React, { useEffect, useState } from "react";

const MeteorShower = ({ count = 20 }) => {
  // Disable on mobile/touch devices for performance
  const [isMobile, setIsMobile] = useState(true);
  
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(
        window.matchMedia('(max-width: 768px)').matches ||
        window.matchMedia('(pointer: coarse)').matches ||
        window.matchMedia('(prefers-reduced-motion: reduce)').matches
      );
    };
    checkMobile();
  }, []);

  if (isMobile) return null;

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {[...Array(count)].map((_, i) => (
        <div
          key={i}
          className="meteor absolute w-[2px] h-[80px] bg-gradient-to-b from-white/80 via-blue-400/50 to-transparent rotate-[215deg]"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 50 - 20}%`,
            animationDelay: `${Math.random() * 8}s`,
            animationDuration: `${2 + Math.random() * 3}s`,
          }}
        />
      ))}
      <style>{`
        @keyframes meteor-fall {
          0% {
            transform: translateY(0) translateX(0) rotate(215deg);
            opacity: 1;
          }
          70% {
            opacity: 1;
          }
          100% {
            transform: translateY(500px) translateX(-500px) rotate(215deg);
            opacity: 0;
          }
        }
        .meteor {
          animation: meteor-fall linear infinite;
          box-shadow: 0 0 10px 2px rgba(59, 130, 246, 0.3);
        }
      `}</style>
    </div>
  );
};

export default MeteorShower;
