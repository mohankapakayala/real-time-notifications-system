import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export default function Card({ children, className = '' }: CardProps) {
  return (
    <div 
      className={`bg-white rounded-lg shadow-sm border p-6 ${className}`}
      style={{ borderColor: '#D4D4D8' }}
    >
      {children}
    </div>
  );
}

