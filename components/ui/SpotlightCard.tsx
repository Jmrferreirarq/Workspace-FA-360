import React from 'react';

interface SpotlightCardProps {
  children: React.ReactNode;
  className?: string;
}

const SpotlightCard: React.FC<SpotlightCardProps> = ({ children, className = '' }) => {
  return (
    <div className={`relative overflow-hidden glass ${className}`}>
      {/* Subtle radial gradient spotlight effect could be added here with absolute positioning if needed */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

export default SpotlightCard;
