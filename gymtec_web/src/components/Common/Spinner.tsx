// src/components/Common/Spinner.tsx
import React from 'react';

interface SpinnerProps {
  size?: 'sm' | 'lg';
}

export default function Spinner({ size }: SpinnerProps) {
  const classSize = size === 'sm' ? 'spinner-border-sm' : '';
  return (
    <div className={`spinner-border ${classSize}`} role="status">
      <span className="visually-hidden">Cargando...</span>
    </div>
  );
}
