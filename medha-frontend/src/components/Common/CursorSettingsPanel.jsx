import React from 'react';
import { useCursor } from '../../context/CursorContext';

const CursorSettingsPanel = ({ className = "" }) => {
  const { isEnabled, setIsEnabled, cursorSpeed, setCursorSpeed } = useCursor();

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Toggle Custom Cursor */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div>
          <h4 className="font-bold text-slate-700">Premium Custom Cursor</h4>
          <p className="text-sm text-slate-500">Enable the weighted virtual cursor</p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input 
            type="checkbox" 
            checked={isEnabled} 
            onChange={(e) => setIsEnabled(e.target.checked)} 
            className="sr-only peer" 
          />
          <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
        </label>
      </div>

      {/* Cursor Speed Slider */}
      <div className={`transition-opacity duration-300 ${isEnabled ? 'opacity-100' : 'opacity-40 pointer-events-none'}`}>
        <div className="flex justify-between mb-2">
          <label className="font-bold text-slate-700">Cursor Weight / Speed</label>
          <span className="text-sm font-bold text-indigo-600">{cursorSpeed} / 10</span>
        </div>
        <input 
          type="range" 
          min="1" 
          max="10" 
          value={cursorSpeed} 
          onChange={(e) => setCursorSpeed(parseInt(e.target.value))}
          className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
        />
        <div className="flex justify-between text-xs text-slate-400 mt-1">
          <span>Heavy (Slow)</span>
          <span>Light (Fast)</span>
        </div>
      </div>
    </div>
  );
};

export default CursorSettingsPanel;
