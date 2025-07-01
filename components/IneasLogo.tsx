
import React from 'react';

export const IneasLogo: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M50 20C27.9086 20 10 37.9086 10 60H90C90 37.9086 72.0914 20 50 20Z"
      stroke="#1E40AF"
      strokeWidth="6"
    />
    <path d="M30 50V90" stroke="#1E40AF" strokeWidth="8" strokeLinecap="round" />
    <path d="M70 50V90" stroke="#1E40AF" strokeWidth="8" strokeLinecap="round" />
    <path d="M50 50V90" stroke="#EF4444" strokeWidth="8" strokeLinecap="round" />
  </svg>
);
