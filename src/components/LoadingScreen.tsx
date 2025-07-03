import React from 'react';
import { Zap } from 'lucide-react';

interface LoadingScreenProps {
  isLoading: boolean;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ isLoading }) => {
  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black">
      <div className="relative">
        <div className="animate-spin-slow">
          <Zap className="w-16 h-16 text-cyan-400" />
        </div>
        <div className="absolute inset-0 animate-ping">
          <Zap className="w-16 h-16 text-cyan-400 opacity-20" />
        </div>
        <div className="absolute inset-0 animate-pulse">
          <div className="w-20 h-20 -m-2 border-2 border-cyan-400 rounded-full opacity-30"></div>
        </div>
      </div>
      <div className="absolute bottom-10 text-center">
        <div className="text-cyan-400 font-orbitron text-xl font-bold mb-2">FUTURESTICK</div>
        <div className="text-cyan-300 font-space text-sm">Loading Future...</div>
      </div>
    </div>
  );
};

export default LoadingScreen;