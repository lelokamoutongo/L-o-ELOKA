import React, { useEffect, useState } from 'react';
import { LeaderboardEntry, Language } from '../types';
import { getLeaderboard } from '../services/leaderboardService';
import { Trophy, ArrowLeft, Calendar, User as UserIcon, Medal } from 'lucide-react';
import { audioService } from '../services/audioService';
import { getTranslation } from '../translations';

interface LeaderboardScreenProps {
  onBack: () => void;
  language: Language;
}

const LeaderboardScreen: React.FC<LeaderboardScreenProps> = ({ onBack, language }) => {
  const t = getTranslation(language).leaderboard;
  const [scores, setScores] = useState<LeaderboardEntry[]>([]);

  useEffect(() => {
    setScores(getLeaderboard());
  }, []);

  const getRankIcon = (index: number) => {
    // Only Top 3 get a badge/medal
    if (index === 0) return <Medal className="w-6 h-6 text-yellow-400 fill-yellow-400/20" />;
    if (index === 1) return <Medal className="w-6 h-6 text-gray-300 fill-gray-300/20" />;
    if (index === 2) return <Medal className="w-6 h-6 text-amber-600 fill-amber-600/20" />;
    
    // Others get a simple number
    return <span className="text-gray-400 font-bold w-6 text-center">{index + 1}</span>;
  };

  const handleBack = () => {
    audioService.playClick();
    onBack();
  };

  return (
    <div className="flex flex-col items-center justify-start min-h-screen w-full p-6 relative overflow-hidden animate-fade-in">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-0">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-900 rounded-full mix-blend-screen filter blur-[100px] opacity-20"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-900 rounded-full mix-blend-screen filter blur-[100px] opacity-20"></div>
      </div>

      <div className="relative z-10 w-full max-w-4xl">
        <div className="flex items-center justify-between mb-8">
           <button 
             onClick={handleBack}
             className="flex items-center text-gray-400 hover:text-white transition-colors"
           >
             <ArrowLeft size={20} className="mr-2" />
             {t.back}
           </button>
           <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 flex items-center">
             <Trophy className="mr-3 text-yellow-500" />
             {t.title}
           </h1>
           <div className="w-24"></div> {/* Spacer for centering */}
        </div>

        <div className="glass-panel rounded-3xl overflow-hidden border border-white/10 shadow-2xl flex flex-col max-h-[70vh]">
          {scores.length === 0 ? (
            <div className="p-12 text-center text-gray-400">
              <Trophy size={64} className="mx-auto mb-4 opacity-20" />
              <p className="text-xl">{t.empty}</p>
            </div>
          ) : (
            <>
              {/* Header - Fixed */}
              <div className="bg-white/5 text-gray-300 uppercase text-xs tracking-wider z-10">
                <div className="flex w-full">
                   <div className="px-6 py-4 font-semibold text-center w-20 flex-shrink-0">{t.rank}</div>
                   <div className="px-6 py-4 font-semibold flex-grow">{t.player}</div>
                   <div className="px-6 py-4 font-semibold text-right w-24 flex-shrink-0">{t.score}</div>
                   <div className="px-6 py-4 font-semibold text-right w-32 flex-shrink-0 hidden sm:block">{t.date}</div>
                </div>
              </div>
              
              {/* Body - Scrollable */}
              <div className="overflow-y-auto custom-scrollbar">
                <table className="w-full text-left border-collapse">
                  <tbody className="divide-y divide-white/5">
                    {scores.map((entry, index) => (
                      <tr 
                        key={index} 
                        className={`hover:bg-white/5 transition-colors ${index < 3 ? 'bg-white/[0.02]' : ''} opacity-0 animate-slide-in-right`}
                        style={{ animationDelay: `${Math.min(index * 0.05, 1)}s` }} // Cap delay for long lists
                      >
                        <td className="px-6 py-4 w-20 flex-shrink-0">
                          <div className="flex justify-center items-center">
                            {getRankIcon(index)}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-500 to-blue-500 flex items-center justify-center mr-3 text-xs font-bold flex-shrink-0">
                              {entry.firstName[0]}{entry.lastName[0]}
                            </div>
                            <span className="font-medium text-white truncate">{entry.firstName} {entry.lastName}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right font-bold text-purple-300 w-24 flex-shrink-0">
                          {entry.score}
                        </td>
                        <td className="px-6 py-4 text-right text-gray-500 text-sm w-32 flex-shrink-0 hidden sm:table-cell">
                          {entry.date}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default LeaderboardScreen;