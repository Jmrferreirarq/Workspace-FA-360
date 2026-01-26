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
  const [isActive, setIsActive] = useState(false);
  const [activeProject, setActiveProject] = useState<{ id: string, name: string } | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Load state from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const { activeProject, startTime, isRunning, savedElapsed } = JSON.parse(saved);
      setActiveProject(activeProject);
      
      if (isRunning) {
        const now = Date.now();
        const passedSinceStart = Math.floor((now - startTime) / 1000);
        setElapsedTime(savedElapsed + passedSinceStart);
        setIsActive(true);
      } else {
        setElapsedTime(savedElapsed);
        setIsActive(false);
      }
    }
  }, []);

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
