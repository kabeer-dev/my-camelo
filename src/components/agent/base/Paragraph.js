import React from "react";

export default function Paragraph({ title, className }) {
  return <div className={`font-normal ${className}`}>{title}</div>;
}
