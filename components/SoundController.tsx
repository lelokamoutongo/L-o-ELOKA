import React, { useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { audioService } from '../services/audioService';

const SoundController: React.FC = () => {
  const [isMuted, setIsMuted] = useState(audioService.getMuteState());

  const toggleMute = () => {
    const newState = audioService.toggleMute();
    setIsMuted(newState);
  };

  return (
    <button 
      onClick={toggleMute}
      className="fixed bottom-6 right-6 z-50 p-3 bg-black/40 backdrop-blur-md border border-white/10 rounded-full text-white hover:bg-white/10 transition-all hover:scale-110"
      aria-label="Toggle sound"
    >
      {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
    </button>
  );
};

export default SoundController;
