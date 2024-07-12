import React from 'react';

export default function Heading({ title, className }) {
  return (
    <>
      <div className={`font-bold ${className}`}>{title}</div>
    </>
  );
}
