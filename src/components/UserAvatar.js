"use client";
import React from 'react';

const UserAvatar = ({ name, size = "md", className = "" }) => {
  const initials = (name || "?").substring(0, 2).toUpperCase();
  const colors = [
    'from-pink-500 to-rose-500',
    'from-purple-500 to-indigo-500',
    'from-blue-500 to-cyan-500',
    'from-emerald-500 to-teal-500',
    'from-orange-500 to-amber-500',
    'from-primary to-purple-600'
  ];
  
  // Générer une couleur stable basée sur le nom
  const colorIndex = name ? name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length : 0;
  const colorClass = colors[colorIndex];

  const sizeClasses = {
    xs: "size-8 text-[8px]",
    sm: "size-10 text-[10px]",
    md: "size-14 text-xs",
    lg: "size-32 md:size-40 text-3xl"
  };

  return (
    <div className={`${sizeClasses[size] || sizeClasses.md} rounded-[28%] bg-gradient-to-br ${colorClass} flex items-center justify-center text-white font-black italic border-2 border-white/20 shadow-xl shrink-0 ${className}`}>
      {initials}
    </div>
  );
};

export default UserAvatar;
