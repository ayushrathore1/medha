import React from "react";
import { motion } from "framer-motion";

// Animated Counter
const AnimatedCounter = ({ value, duration = 2, className = "" }) => {
  return (
    <motion.span
      className={className}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
    >
      <motion.span
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        {typeof value === 'number' ? (
          <Counter from={0} to={value} duration={duration} />
        ) : (
          value
        )}
      </motion.span>
    </motion.span>
  );
};

const Counter = ({ from, to, duration }) => {
  const [count, setCount] = React.useState(from);
  
  React.useEffect(() => {
    let startTime;
    let animationFrame;
    
    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
      
      setCount(Math.floor(from + (to - from) * easeOut(progress)));
      
      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };
    
    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [from, to, duration]);
  
  return <>{count.toLocaleString()}</>;
};

const easeOut = (t) => 1 - Math.pow(1 - t, 3);

// Staggered List Animation
export const StaggeredList = ({ children, className = "", staggerDelay = 0.1 }) => {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      variants={{
        visible: {
          transition: {
            staggerChildren: staggerDelay,
          },
        },
      }}
    >
      {React.Children.map(children, (child, i) => (
        <motion.div
          variants={{
            hidden: { opacity: 0, y: 30, filter: "blur(10px)" },
            visible: { 
              opacity: 1, 
              y: 0, 
              filter: "blur(0px)",
              transition: { duration: 0.5, ease: "easeOut" }
            },
          }}
        >
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
};

// Scroll Progress Indicator
export const ScrollProgress = ({ className = "" }) => {
  const [progress, setProgress] = React.useState(0);

  React.useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollProgress = (window.scrollY / totalHeight) * 100;
      setProgress(scrollProgress);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className={`fixed top-0 left-0 right-0 h-1 z-50 ${className}`}>
      <motion.div
        className="h-full bg-gradient-to-r from-blue-500 via-violet-500 to-cyan-500"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
};

// Reveal on Scroll
export const RevealOnScroll = ({ children, className = "", direction = "up" }) => {
  const directions = {
    up: { y: 50 },
    down: { y: -50 },
    left: { x: 50 },
    right: { x: -50 },
  };

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, ...directions[direction] }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.7, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
};

// Parallax Container
export const ParallaxSection = ({ children, className = "", speed = 0.5 }) => {
  const [offset, setOffset] = React.useState(0);
  const ref = React.useRef(null);

  React.useEffect(() => {
    const handleScroll = () => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const scrolled = window.innerHeight - rect.top;
      setOffset(scrolled * speed);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [speed]);

  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`}>
      <div style={{ transform: `translateY(${offset}px)` }}>
        {children}
      </div>
    </div>
  );
};

export default AnimatedCounter;
