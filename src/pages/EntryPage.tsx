import React from 'react';

interface EntryPageProps {
  onSelectPublic: () => void;
  onSelectOperator: () => void;
}

export const EntryPage: React.FC<EntryPageProps> = ({ onSelectPublic, onSelectOperator }) => {
  return (
    <div className="min-h-screen relative flex items-center justify-center overflow-hidden">
      {/* Background Video */}
      <video
        className="absolute inset-0 w-full h-full object-cover"
        src="/image/bg_video.mp4"
        autoPlay
        muted
        loop
        playsInline
      />

      {/* Dark overlay for better contrast */}
      <div className="absolute inset-0 bg-black/45"></div>
      
      {/* Content */}
      <div className="relative z-10 text-center max-w-md px-6 animate-fade-in">
        {/* Logo */}
        <div className="mb-6 flex justify-center">
          <img 
            src="/image/CarbonHorizon.png" 
            alt="CarbonHorizon" 
            className="h-64 w-auto"
          />
        </div>
        
        {/* Subtitle */}
        <p className="text-xl text-white mb-12 font-normal">
          Select how you want to access the system.
        </p>
        
        {/* Buttons */}
        <div className="space-y-4">
          <button
            onClick={onSelectPublic}
            className="w-full py-4 px-6 text-lg font-bold text-white bg-white/15 backdrop-blur-sm rounded-xl border-2 border-white/30 hover:bg-white hover:text-[#174B7A] transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-white/50"
          >
            For Public
          </button>
          
          <button
            onClick={onSelectOperator}
            className="w-full py-4 px-6 text-lg font-bold text-white bg-white/15 backdrop-blur-sm rounded-xl border-2 border-white/30 hover:bg-white hover:text-[#174B7A] transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-white/50"
          >
            For Operator
          </button>
        </div>
        
        {/* Footer text */}
        <p className="mt-8 text-sm text-white/80">
          Louisiana Carbon Capture Transparency Portal
        </p>
      </div>
    </div>
  );
};

