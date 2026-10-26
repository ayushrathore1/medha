import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

const CalendarWidget = () => {
  const [value, onChange] = useState(new Date());

  return (
    <div className="flex flex-col items-center justify-center p-4 w-full">
      <h3 className="text-xl font-bold mb-4" style={{ color: "var(--text-primary)" }}>
        Calendar
      </h3>
      <div className="calendar-container w-full">
        <Calendar 
          onChange={onChange} 
          value={value} 
          className="w-full border-none rounded-lg bg-transparent text-white"
          tileClassName={({ date, view }) => {
            // Add custom styles for tiles if needed
            if (view === 'month' && date.toDateString() === new Date().toDateString()) {
              return 'bg-violet-600 text-white rounded-full font-bold';
            }
            return 'text-gray-300 hover:bg-violet-500/20 rounded-lg transition-colors';
          }}
        />
      </div>
      <style>{`
        .react-calendar {
          background: transparent !important;
          border: none !important;
          width: 100% !important;
          font-family: inherit !important;
        }
        .react-calendar__navigation button {
          color: var(--text-primary) !important;
          font-size: 1.1rem;
          font-weight: bold;
        }
        .react-calendar__navigation button:enabled:hover,
        .react-calendar__navigation button:enabled:focus {
          background-color: rgba(139, 92, 246, 0.2) !important;
          border-radius: 8px;
        }
        .react-calendar__month-view__weekdays {
          color: var(--text-secondary) !important;
          font-weight: 600;
          text-transform: uppercase;
          font-size: 0.8rem;
        }
        .react-calendar__tile {
          color: var(--text-primary);
          padding: 10px 6px;
        }
        .react-calendar__tile:enabled:hover,
        .react-calendar__tile:enabled:focus {
          background-color: rgba(139, 92, 246, 0.2) !important;
          border-radius: 8px;
        }
        .react-calendar__tile--now {
          background: rgba(139, 92, 246, 0.4) !important;
          border-radius: 8px;
        }
        .react-calendar__tile--active {
          background: #7c3aed !important;
          color: white !important;
          border-radius: 8px;
        }
      `}</style>
    </div>
  );
};

export default CalendarWidget;
