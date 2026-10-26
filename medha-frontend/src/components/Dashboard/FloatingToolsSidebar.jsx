import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaClock, FaStopwatch, FaTimes, FaExpand, FaCompress, FaCalendarAlt, FaPlus, FaTrash, FaChevronLeft } from 'react-icons/fa';

const FloatingToolsSidebar = () => {
  const [activePanel, setActivePanel] = useState(null); // 'clock' | 'timer' | 'calendar' | null
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [time, setTime] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  
  // Timer state
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [isTimerPaused, setIsTimerPaused] = useState(false);

  // Calendar Task State
  const [viewDate, setViewDate] = useState(null); // Date currently being viewed for tasks
  const [newTaskInput, setNewTaskInput] = useState("");
  const [tasks, setTasks] = useState(() => {
    // Initial default tasks (RTU Exam Schedule)
    const defaults = {
      "2026-01-02": ["AEM Exam (RTU 3rd Sem)"],
      "2026-01-05": ["MEFA Exam (RTU 3rd Sem)"],
      "2026-01-07": ["DE Exam (RTU 3rd Sem)"],
      "2026-01-09": ["DSA Exam (RTU 3rd Sem)"],
      "2026-01-13": ["OOPS Exam (RTU 3rd Sem)"],
      "2026-01-15": ["SE Exam (RTU 3rd Sem)"]
    };
    
    let initialTasks = { ...defaults };

    // Load from local storage and merge
    try {
      const saved = localStorage.getItem('medha_calendar_tasks');
      if (saved) {
        initialTasks = { ...defaults, ...JSON.parse(saved) };
      }
    } catch (e) {
      console.error("Failed to load tasks", e);
    }

    // Cleanup: Remove tasks for passed dates (keep Today and Future)
    const today = new Date();
    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    
    const cleanedTasks = {};
    Object.keys(initialTasks).forEach(dateKey => {
      if (dateKey >= todayStr) {
        cleanedTasks[dateKey] = initialTasks[dateKey];
      }
    });

    return cleanedTasks;
  });

  // Save tasks to local storage
  useEffect(() => {
    localStorage.setItem('medha_calendar_tasks', JSON.stringify(tasks));
  }, [tasks]);

  // Clock update
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Timer countdown
  useEffect(() => {
    let interval = null;
    if (isTimerActive && !isTimerPaused) {
      interval = setInterval(() => {
        setTimerSeconds((s) => s + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerActive, isTimerPaused]);

  // Handle escape key to exit fullscreen
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isFullscreen]);

  const formatTime = (seconds) => {
    const h = `0${Math.floor(seconds / 3600)}`.slice(-2);
    const m = `0${Math.floor((seconds % 3600) / 60)}`.slice(-2);
    const s = `0${seconds % 60}`.slice(-2);
    return `${h}:${m}:${s}`;
  };

  const togglePanel = (panel) => {
    if (activePanel === panel) {
      setActivePanel(null);
      setIsFullscreen(false);
      setViewDate(null);
    } else {
      setActivePanel(panel);
      setIsFullscreen(false);
      setViewDate(null);
    }
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const closePanel = () => {
    setActivePanel(null);
    setIsFullscreen(false);
    setViewDate(null);
  };

  // Calendar helpers
  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    return { firstDay, daysInMonth };
  };

  const { firstDay, daysInMonth } = getDaysInMonth(selectedDate);
  const today = new Date();
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
                      'July', 'August', 'September', 'October', 'November', 'December'];
  const dayNames = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  const prevMonth = () => {
    setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 1));
  };

  // Task Management Functions
  const getDateKey = (day) => {
    const year = selectedDate.getFullYear();
    const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
    const d = String(day).padStart(2, '0');
    return `${year}-${month}-${d}`;
  };

  const handleDateClick = (day) => {
    const dateKey = getDateKey(day);
    setViewDate({ day, dateKey });
  };

  const addTask = () => {
    if (!newTaskInput.trim() || !viewDate) return;
    
    setTasks(prev => {
      const currentTasks = prev[viewDate.dateKey] || [];
      return {
        ...prev,
        [viewDate.dateKey]: [...currentTasks, newTaskInput.trim()]
      };
    });
    setNewTaskInput("");
  };

  const deleteTask = (dateKey, index) => {
    setTasks(prev => {
      const currentTasks = prev[dateKey] || [];
      const newTasks = currentTasks.filter((_, i) => i !== index);
      
      // Clean up key if empty? Optional. Keeping empty array is fine.
      if (newTasks.length === 0) {
        const { [dateKey]: _, ...rest } = prev;
        return rest;
      }
      
      return {
        ...prev,
        [dateKey]: newTasks
      };
    });
  };

  const getPanelGradient = () => {
    if (activePanel === 'clock') return 'bg-gradient-to-br from-[var(--action-primary)] to-[var(--action-hover)]';
    if (activePanel === 'timer') return 'bg-gradient-to-br from-[var(--gradient-start)] to-[var(--gradient-end)]';
    if (activePanel === 'calendar') return 'bg-gradient-to-br from-emerald-500 via-teal-600 to-cyan-700'; // Keep calendar distinct
    return '';
  };

  return (
    <>
      {/* Fixed Sidebar Icons - Right Edge */}
      <div className="fixed right-0 top-1/2 -translate-y-1/2 z-40 flex flex-col gap-2">
        {/* Clock Icon */}
        <motion.button
          whileHover={{ x: -4 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => togglePanel('clock')}
          className={`flex items-center gap-2 pl-3 pr-4 py-3 rounded-l-xl shadow-lg transition-colors ${
            activePanel === 'clock' 
              ? 'bg-[var(--action-primary)] text-white' 
              : 'bg-[var(--bg-primary)] text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] hover:text-[var(--action-primary)]'
          }`}
        >
          <FaClock size={18} />
          <span className="text-xs font-bold hidden sm:block">Clock</span>
        </motion.button>

        {/* Timer Icon */}
        <motion.button
          whileHover={{ x: -4 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => togglePanel('timer')}
          className={`flex items-center gap-2 pl-3 pr-4 py-3 rounded-l-xl shadow-lg transition-colors ${
            activePanel === 'timer' 
              ? 'bg-[var(--gradient-end)] text-white' 
              : 'bg-[var(--bg-primary)] text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] hover:text-[var(--gradient-end)]'
          }`}
        >
          <FaStopwatch size={18} />
          <span className="text-xs font-bold hidden sm:block">Timer</span>
        </motion.button>

        {/* Calendar Icon */}
        <motion.button
          whileHover={{ x: -4 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => togglePanel('calendar')}
          className={`flex items-center gap-2 pl-3 pr-4 py-3 rounded-l-xl shadow-lg transition-colors ${
            activePanel === 'calendar' 
              ? 'bg-emerald-600 text-white' 
              : 'bg-[var(--bg-primary)] text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] hover:text-emerald-600'
          }`}
        >
          <FaCalendarAlt size={18} />
          <span className="text-xs font-bold hidden sm:block">Calendar</span>
        </motion.button>
      </div>

      {/* Sliding Panels */}
      <AnimatePresence>
        {activePanel && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closePanel}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
            />

            {/* Panel */}
            <motion.div
              initial={{ x: '100%', opacity: 0 }}
              animate={{ 
                x: 0, 
                opacity: 1,
                width: isFullscreen ? '100vw' : (activePanel === 'calendar' ? '20rem' : '20rem'),
                height: isFullscreen ? '100vh' : 'auto',
                top: isFullscreen ? 0 : '50%',
                y: isFullscreen ? 0 : '-50%',
                right: 0,
                borderRadius: isFullscreen ? 0 : '1rem 0 0 1rem'
              }}
              exit={{ x: '100%', opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className={`fixed z-50 overflow-hidden ${getPanelGradient()}`}
              style={{
                maxWidth: isFullscreen ? '100vw' : '90vw',
              }}
            >
              {/* Control Buttons */}
              <div className="absolute top-4 right-4 flex gap-2 z-10">
                <button
                  onClick={toggleFullscreen}
                  className="p-2.5 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                  title={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
                >
                  {isFullscreen ? <FaCompress size={16} /> : <FaExpand size={16} />}
                </button>
                <button
                  onClick={closePanel}
                  className="p-2.5 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                >
                  <FaTimes size={16} />
                </button>
              </div>

              {/* Clock Panel */}
              {activePanel === 'clock' && (
                <div className={`flex flex-col items-center justify-center text-white text-center ${
                  isFullscreen ? 'h-screen p-12' : 'p-8'
                }`}>
                  <div className="flex items-center justify-center gap-3 mb-6">
                    <FaClock size={isFullscreen ? 32 : 20} />
                    <h3 className={`font-semibold uppercase tracking-wider opacity-80 ${
                      isFullscreen ? 'text-xl' : 'text-sm'
                    }`}>
                      Current Time (IST)
                    </h3>
                  </div>
                  <div className={`font-bold tracking-wider mb-4 ${
                    isFullscreen ? 'text-8xl md:text-9xl' : 'text-5xl'
                  }`}>
                    {time.toLocaleTimeString('en-IN', { 
                      timeZone: 'Asia/Kolkata',
                      hour12: true,
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit'
                    })}
                  </div>
                  <div className={`opacity-80 ${isFullscreen ? 'text-2xl' : 'text-sm'}`}>
                    {time.toLocaleDateString('en-IN', { 
                      timeZone: 'Asia/Kolkata',
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </div>
                  {isFullscreen && (
                    <p className="mt-8 text-white/50 text-sm">Press ESC to exit fullscreen</p>
                  )}
                </div>
              )}

              {/* Timer Panel */}
              {activePanel === 'timer' && (
                <div className={`flex flex-col items-center justify-center text-white text-center ${
                  isFullscreen ? 'h-screen p-12' : 'p-8'
                }`}>
                  <div className="flex items-center justify-center gap-3 mb-6">
                    <FaStopwatch size={isFullscreen ? 32 : 20} />
                    <h3 className={`font-semibold uppercase tracking-wider opacity-80 ${
                      isFullscreen ? 'text-xl' : 'text-sm'
                    }`}>
                      Study Timer
                    </h3>
                  </div>
                  <div className={`font-mono font-bold tracking-wider mb-8 ${
                    isFullscreen ? 'text-8xl md:text-9xl' : 'text-5xl'
                  }`}>
                    {formatTime(timerSeconds)}
                  </div>
                  <div className={`flex gap-4 ${isFullscreen ? 'gap-6' : 'gap-3'}`}>
                    {!isTimerActive && !isTimerPaused ? (
                      <button
                        onClick={() => setIsTimerActive(true)}
                        className={`bg-white text-violet-600 font-bold rounded-xl hover:bg-white/90 transition-colors ${
                          isFullscreen ? 'px-10 py-4 text-xl' : 'px-6 py-2.5'
                        }`}
                      >
                        Start
                      </button>
                    ) : (
                      <>
                        {isTimerPaused ? (
                          <button
                            onClick={() => setIsTimerPaused(false)}
                            className={`bg-white text-violet-600 font-bold rounded-xl hover:bg-white/90 transition-colors ${
                              isFullscreen ? 'px-8 py-4 text-xl' : 'px-5 py-2.5'
                            }`}
                          >
                            Resume
                          </button>
                        ) : (
                          <button
                            onClick={() => setIsTimerPaused(true)}
                            className={`bg-white/20 text-white font-bold rounded-xl hover:bg-white/30 transition-colors ${
                              isFullscreen ? 'px-8 py-4 text-xl' : 'px-5 py-2.5'
                            }`}
                          >
                            Pause
                          </button>
                        )}
                        <button
                          onClick={() => {
                            setIsTimerActive(false);
                            setIsTimerPaused(false);
                            setTimerSeconds(0);
                          }}
                          className={`bg-red-500/30 text-white font-bold rounded-xl hover:bg-red-500/50 transition-colors ${
                            isFullscreen ? 'px-8 py-4 text-xl' : 'px-5 py-2.5'
                          }`}
                        >
                          Reset
                        </button>
                      </>
                    )}
                  </div>
                  {isFullscreen && (
                    <p className="mt-10 text-white/50 text-sm">Press ESC to exit fullscreen</p>
                  )}
                </div>
              )}

              {/* Calendar Panel */}
              {activePanel === 'calendar' && (
                <div className={`flex flex-col text-white w-full mx-auto ${
                  isFullscreen ? 'h-screen p-8 max-w-4xl justify-center' : 'p-6'
                }`}>
                  {/* Calendar Header with conditional back button */}
                  <div className="flex items-center gap-3 mb-6 relative shrink-0">
                    {viewDate ? (
                      <button 
                        onClick={() => setViewDate(null)}
                        className="p-2 -ml-2 hover:bg-white/10 rounded-full transition-colors"
                      >
                        <FaChevronLeft size={16} />
                      </button>
                    ) : (
                      <FaCalendarAlt size={isFullscreen ? 28 : 20} className="text-white/80" />
                    )}
                    
                    <h3 className={`font-semibold uppercase tracking-wider opacity-90 ${
                      isFullscreen ? 'text-xl' : 'text-lg'
                    }`}>
                      {viewDate 
                        ? `${monthNames[selectedDate.getMonth()]} ${viewDate.day}, ${selectedDate.getFullYear()}`
                        : "Calendar"
                      }
                    </h3>
                  </div>
                  
                  {!viewDate ? (
                    // Month View
                    <>
                      {/* Month Navigation */}
                      <div className="flex items-center justify-between w-full mb-4 shrink-0">
                        <button onClick={prevMonth} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                          ←
                        </button>
                        <span className={`font-bold ${isFullscreen ? 'text-2xl' : 'text-lg'}`}>
                          {monthNames[selectedDate.getMonth()]} {selectedDate.getFullYear()}
                        </span>
                        <button onClick={nextMonth} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                          →
                        </button>
                      </div>

                      {/* Day Names */}
                      <div className={`grid grid-cols-7 gap-1 w-full mb-2 shrink-0 ${isFullscreen ? 'text-lg' : 'text-xs'}`}>
                        {dayNames.map((day, i) => (
                          <div key={i} className="text-center font-bold text-white/60 py-1">
                            {day}
                          </div>
                        ))}
                      </div>

                      {/* Calendar Grid */}
                      <div className={`grid grid-cols-7 gap-1 w-full ${isFullscreen ? 'text-xl' : 'text-sm'}`}>
                        {/* Empty cells for days before start of month */}
                        {Array.from({ length: firstDay }).map((_, i) => (
                          <div key={`empty-${i}`} className="p-2"></div>
                        ))}
                        {/* Days of the month */}
                        {Array.from({ length: daysInMonth }).map((_, i) => {
                          const day = i + 1;
                          const dateKey = getDateKey(day);
                          const hasTasks = tasks[dateKey] && tasks[dateKey].length > 0;
                          const isToday = 
                            day === today.getDate() && 
                            selectedDate.getMonth() === today.getMonth() && 
                            selectedDate.getFullYear() === today.getFullYear();
                          
                          return (
                            <div
                              key={day}
                              onClick={() => handleDateClick(day)}
                              className={`group relative p-2 text-center rounded-lg cursor-pointer transition-colors ${
                                isToday 
                                  ? 'bg-white text-emerald-600 font-bold' 
                                  : hasTasks 
                                    ? 'bg-emerald-400/30 text-white font-semibold hover:bg-emerald-400/50'
                                    : 'hover:bg-white/20'
                              } ${isFullscreen ? 'p-3' : 'p-2'}`}
                            >
                              {day}
                              {hasTasks && (
                                <>
                                  <div className={`mx-auto mt-1 w-1 h-1 rounded-full ${
                                    isToday ? 'bg-emerald-500' : 'bg-white'
                                  }`} />
                                  
                                  {/* Hover Tooltip - Hidden by default, shown on hover */}
                                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 hidden group-hover:block z-50">
                                      <div className="bg-slate-800 text-white text-xs rounded-lg shadow-xl p-3 border border-slate-700/50 backdrop-blur-md">
                                          <div className="font-bold border-b border-white/20 pb-1.5 mb-2 text-emerald-400">
                                              Tasks & Exams
                                          </div>
                                          <ul className="space-y-1.5 text-left">
                                              {tasks[dateKey].map((task, idx) => (
                                                  <li key={idx} className="flex items-start gap-1.5 leading-relaxed">
                                                      <span className="mt-1 w-1 h-1 rounded-full bg-emerald-400 shrink-0"></span>
                                                      <span className="text-slate-200">{task}</span>
                                                  </li>
                                              ))}
                                          </ul>
                                      </div>
                                      {/* Tooltip Arrow */}
                                      <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-slate-800"></div>
                                  </div>
                                </>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </>
                  ) : (
                    // Single Date View (Tasks)
                    <div className="flex flex-col h-full animate-in fade-in slide-in-from-right-4 duration-300">
                      {/* Task List */}
                      <div className="flex-1 overflow-y-auto min-h-0 space-y-3 mb-4 pr-2">
                        {tasks[viewDate.dateKey] && tasks[viewDate.dateKey].length > 0 ? (
                          tasks[viewDate.dateKey].map((task, idx) => (
                            <motion.div
                              key={idx}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="bg-white/10 backdrop-blur-sm rounded-xl p-3 flex items-start gap-3 group"
                            >
                              <div className="mt-1 w-2 h-2 rounded-full bg-white shrink-0" />
                              <div className="flex-1 text-sm font-medium leading-relaxed break-words text-left">
                                {task}
                              </div>
                              <button
                                onClick={() => deleteTask(viewDate.dateKey, idx)}
                                className="opacity-0 group-hover:opacity-100 text-white/50 hover:text-red-300 transition-opacity p-1"
                              >
                                <FaTrash size={12} />
                              </button>
                            </motion.div>
                          ))
                        ) : (
                          <div className="text-center py-12 text-white/40 italic">
                            No tasks for this day
                          </div>
                        )}
                      </div>

                      {/* Add Task Input */}
                      <div className="mt-auto">
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={newTaskInput}
                            onChange={(e) => setNewTaskInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && addTask()}
                            placeholder="Add a new task..."
                            className="flex-1 bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-sm text-white placeholder-white/50 focus:outline-none focus:bg-white/20 transition-all"
                          />
                          <button
                            onClick={addTask}
                            disabled={!newTaskInput.trim()}
                            className="bg-white text-emerald-600 p-3 rounded-xl hover:bg-white/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-bold"
                          >
                            <FaPlus />
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {isFullscreen && !viewDate && (
                    <p className="mt-auto pt-8 text-white/50 text-sm text-center">Press ESC to exit fullscreen</p>
                  )}
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default FloatingToolsSidebar;
