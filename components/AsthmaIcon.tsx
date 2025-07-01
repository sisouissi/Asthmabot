import React from 'react';

export const AsthmaIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M6 21C4.34315 21 3 19.6569 3 18V13C3 11.3431 4.34315 10 6 10H7.5C9.15685 10 10.5 8.65685 10.5 7V4C10.5 3.44772 10.9477 3 11.5 3H12.5C13.0523 3 13.5 3.44772 13.5 4V7C13.5 8.65685 14.8431 10 16.5 10H18C19.6569 10 21 11.3431 21 13V18C21 19.6569 19.6569 21 18 21H6Z" />
  </svg>
);
