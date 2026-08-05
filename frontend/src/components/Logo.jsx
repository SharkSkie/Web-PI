import React from 'react';

export function GalleryLogo({ size = 32, className = "" }) {
  return (
    <div className={`flex items-center ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* The Outer Circle - Refined to have a slight double-line effect for an artsy feel */}
        <circle cx="50" cy="50" r="42" stroke="currentColor" strokeWidth="2.5" />
        <circle cx="50" cy="50" r="38" stroke="currentColor" strokeWidth="0.5" opacity="0.2" />

        {/* The 'A' Symbol - Sophisticated minimalist lines */}
        <path
          d="M50 15L82 82M50 15L18 82"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
        />

        {/* Horizontal bar with a gallery-rose color accent */}
        <path
          d="M28 65H72"
          stroke="#E0A8BB"
          strokeWidth="3.5"
          strokeLinecap="square"
        />

        {/* Subtle abstract marks to maintain the gallery identity */}
        <rect x="48" y="10" width="4" height="4" fill="currentColor" opacity="0.3" transform="rotate(45 50 12)" />
      </svg>
    </div>
  );
}

// Maintaining compatibility with other imports
export { GalleryLogo as SyndicalismLogo };
export default GalleryLogo;
