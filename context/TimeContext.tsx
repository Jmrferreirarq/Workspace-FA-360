import React, { createContext, useContext, useState, useEffect, useRef } from 'react';

interface TimeContextType {
  isActive: boolean;
  activeProject: { id: string, name: string } | null;
  elapsedTime: number; // seconds
  start: (project: { id: string, name: string }) => void;
  stop: () => void;
  reset: () => void;
}

const TimeContext = createContext<TimeContextType | undefined>(undefined);

const STORAGE_KEY = 'fa-active-timer';

export const TimeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize state lazily to avoid useEffect setState (no-use-in-effect)
  const [isActive, setIsActive] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return false;
    return JSON.parse(saved).isRunning;
  });

  const [activeProject, setActiveProject] = useState<{ id: string, name: string } | null>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return null;
    return JSON.parse(saved).activeProject;
  });

  const [elapsedTime, setElapsedTime] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return 0;
    const { startTime, isRunning, savedElapsed } = JSON.parse(saved);
    if (isRunning) {
      const now = Date.now();
      const passedSinceStart = Math.floor((now - startTime) / 1000);
      return savedElapsed + passedSinceStart;
    }
    return savedElapsed;
  });

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Save state to localStorage whenever it changes
  useEffect(() => {
    const state = {
      activeProject,
      startTime: isActive ? Date.now() - (elapsedTime * 1000) : null,
      isRunning: isActive,
      savedElapsed: elapsedTime
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [isActive, activeProject, elapsedTime]);

  // Timer loop
  useEffect(() => {
    if (isActive) {
      timerRef.current = setInterval(() => {
        setElapsedTime(prev => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive]);

  const start = (project: { id: string, name: string }) => {
    setActiveProject(project);
    setIsActive(true);
  };

  const stop = () => {
    setIsActive(false);
  };

  const reset = () => {
    setIsActive(false);
    setElapsedTime(0);
    setActiveProject(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <TimeContext.Provider value={{ isActive, activeProject, elapsedTime, start, stop, reset }}>
      {children}
    </TimeContext.Provider>
  );
};

export const useTimer = () => {
  const context = useContext(TimeContext);
  if (!context) throw new Error('useTimer must be used within a TimeProvider');
  return context;
};
