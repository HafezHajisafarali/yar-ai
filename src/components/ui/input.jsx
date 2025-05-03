import React from 'react';

export function Input({ value, onChange, placeholder, className = '' }) {
  return (
    <input
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`border rounded p-2 w-full ${className}`}
    />
  );
}