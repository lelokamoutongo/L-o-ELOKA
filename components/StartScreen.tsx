import React from 'react';
import { Play, Music2, Trophy, Globe, Zap } from 'lucide-react';
import { audioService } from '../services/audioService';
import { Language, DifficultyLevel } from '../types';
import { getTranslation } from '../translations';

interface StartScreenProps {
  onStart: () => void;
  onShowLeaderboard: () => void;
  language: Language;
  onLanguageChange: (lang: Language) => void;
  difficulty: DifficultyLevel;
  onDifficultyChange: (diff: DifficultyLevel) => void;
}

const StartScreen: React.FC<StartScreenProps> = ({ 
  onStart, 
  onShowLeaderboard, 
  language, 
  onLanguageChange,
  difficulty,
  onDifficultyChange
}) => {
  const t = getTranslation(language).start;
  
  const handleStart = () => {
    audioService.playStart();
    onStart();
  };

  const handleLeaderboard = () => {
    audioService.playClick();
    onShowLeaderboard();
  };

  const toggleLanguage = () => {
    audioService.playClick();
    onLanguageChange(language === 'en' ? 'fr' : 'en');
  };

  const setDifficulty = (level: DifficultyLevel) => {
    audioService.playClick();
    onDifficultyChange(level);
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center animate-fade-in relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-600 rounded-full mix-blend-screen filter blur-[100px] opacity-30 animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600 rounded-full mix-blend-screen filter blur-[100px] opacity-30 animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-600 rounded-full mix-blend-screen filter blur-[100px] opacity-20"></div>
      </div>

      {/* Language Toggle */}
      <div className="absolute top-6 right-6 z-50">
        <button 
          onClick={toggleLanguage}
          className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-full backdrop-blur-md border border-white/10 transition-all active:scale-95"
        >
          <Globe size={16} className="text-purple-300" />
          <span className="text-sm font-bold uppercase text-white">{language}</span>
        </button>
      </div>

      <div className="relative z-10 max-w-2xl w-full glass-panel rounded-3xl p-12 border border-white/10 shadow-2xl">
        <div className="flex justify-center mb-8">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full blur-xl opacity-50"></div>
            <div className="relative bg-black p-4 rounded-full border border-white/20">
              <Music2 size={48} className="text-white" />
            </div>
          </div>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white via-purple-200 to-purple-400 tracking-tight">
          {t.title}
        </h1>
        
        <p className="text-lg md:text-xl text-gray-300 mb-8 font-light">
          {t.subtitle} <br />
          <span className="text-purple-400 font-semibold">{t.artists}</span> {t.more}
        </p>

        {/* Difficulty Selector */}
        <div className="mb-8">
           <h3 className="text-sm uppercase tracking-widest text-gray-400 mb-3">{t.difficulty}</h3>
           <div className="flex flex-wrap justify-center gap-2">
             <button 
               onClick={() => setDifficulty('easy')}
               className={`px-4 py-2 rounded-full border transition-all ${difficulty === 'easy' ? 'bg-green-500/20 border-green-500 text-green-300' : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'}`}
             >
               {t.easy}
             </button>
             <button 
               onClick={() => setDifficulty('medium')}
               className={`px-4 py-2 rounded-full border transition-all ${difficulty === 'medium' ? 'bg-yellow-500/20 border-yellow-500 text-yellow-300' : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'}`}
             >
               {t.medium}
             </button>
             <button 
               onClick={() => setDifficulty('hard')}
               className={`px-4 py-2 rounded-full border transition-all ${difficulty === 'hard' ? 'bg-red-500/20 border-red-500 text-red-300' : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'}`}
             >
               {t.hard}
             </button>
           </div>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm text-gray-400 mb-10 max-w-xs mx-auto">
          <div className="flex flex-col items-center p-3 rounded-xl bg-white/5 border border-white/10">
            <span className="text-green-400 font-bold text-lg">+10</span>
            <span>{t.correct}</span>
          </div>
          <div className="flex flex-col items-center p-3 rounded-xl bg-white/5 border border-white/10">
            <span className="text-red-400 font-bold text-lg">-5</span>
            <span>{t.incorrect}</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={handleStart}
            className="group relative inline-flex items-center justify-center px-8 py-4 font-bold text-white transition-all duration-200 bg-white/10 font-lg rounded-full hover:bg-white/20 hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-black w-full sm:w-auto"
          >
            <span className="mr-2">{t.startBtn}</span>
            <Play size={20} className="fill-current group-hover:translate-x-1 transition-transform" />
          </button>
          
          <button
            onClick={handleLeaderboard}
            className="group relative inline-flex items-center justify-center px-8 py-4 font-bold text-white transition-all duration-200 bg-transparent border border-white/10 font-lg rounded-full hover:bg-white/5 hover:border-white/30 focus:outline-none w-full sm:w-auto"
          >
            <span className="mr-2">{t.leaderboardBtn}</span>
            <Trophy size={20} className="text-yellow-500 group-hover:scale-110 transition-transform" />
          </button>
        </div>
      </div>

      <footer className="absolute bottom-6 text-white/20 text-xs z-10">
        {t.footer}
      </footer>
    </div>
  );
};

export default StartScreen;