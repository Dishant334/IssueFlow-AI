import React, { useState, useRef, useEffect } from 'react';

const Workspace = ({ workspaces }) => {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(null);
  const ref = useRef(null);
  

  // set first workspace once data arrives
  useEffect(() => {
    if (workspaces?.length > 0 && !active) {
      setActive(workspaces[0]);
    }
  }, [workspaces, active]);

  // close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  if (!workspaces || workspaces.length === 0) {
    return (
      <div className="text-gray-500 text-sm px-3 py-2">
        No workspaces yet
      </div>
    );
  }

  return (
    <div ref={ref} className="relative w-full text-sm">
      {/* Trigger */}
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full px-3 py-2 rounded-md bg-gray-100 hover:bg-gray-200 transition"
      >
        {active ? (
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-7 h-7 rounded bg-indigo-600 text-white flex items-center justify-center font-medium">
              {active.name[0]}
            </div>
            <span className="truncate font-medium text-gray-800">
              {active.name}
            </span>
          </div>
        ) : (
          <span className="text-gray-400">Select workspace</span>
        )}

        <svg
          className={`w-4 h-4 text-gray-500 transition-transform ${
            open ? 'rotate-180' : ''
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute z-30 mt-2 w-full rounded-md bg-white shadow-lg border">
          {workspaces.map((ws) => (
            <div
              key={ws.id}
              onClick={() => {
                setActive(ws);
                setOpen(false);
              }}
              className={`flex items-center gap-2 px-3 py-2 cursor-pointer transition
                ${
                  active && ws.id === active.id
                    ? 'bg-indigo-50 text-indigo-600'
                    : 'hover:bg-gray-100'
                }
              `}
            >
              <div className="w-7 h-7 rounded bg-indigo-600 text-white flex items-center justify-center font-medium">
                {ws.name[0]}
              </div>
              <span className="text-gray-400 truncate">{ws.name} ({ws.role[0].toUpperCase()}) </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Workspace;
