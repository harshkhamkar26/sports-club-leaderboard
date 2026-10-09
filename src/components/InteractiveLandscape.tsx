import React from 'react';

export default function InteractiveLandscape() {
  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden">
      <iframe
        src="/landscape/background.html"
        title="3D Interactive Landscape"
        className="w-full h-full border-0 pointer-events-auto"
        loading="eager"
        style={{
          width: '100%',
          height: '100%',
          filter: 'brightness(1.05) contrast(1.15)',
        }}
      />
      {/* Subtle atmospheric vignette that keeps the golden horizon & royal navy sky brilliant */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#020617]/70 via-transparent to-[#030a1c]/25 pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_45%,transparent_50%,rgba(3,10,28,0.35)_100%)] pointer-events-none" />
    </div>
  );
}
