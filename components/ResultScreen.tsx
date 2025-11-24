import React, { useEffect, useMemo } from 'react';
import { RotateCcw, Trophy, Frown, Sparkles, List, TrendingUp } from 'lucide-react';
import { audioService } from '../services/audioService';
import { Language } from '../types';
import { getTranslation } from '../translations';

interface ResultScreenProps {
  score: number;
  totalQuestions: number;
  onRestart: () => void;
  onShowLeaderboard: () => void;
  userName?: string;
  history: boolean[];
  language: Language;
}

const ResultScreen: React.FC<ResultScreenProps> = ({ score, totalQuestions, onRestart, onShowLeaderboard, userName, history, language }) => {
  const t = getTranslation(language).result;
  const maxScore = totalQuestions * 10;
  
  useEffect(() => {
    if (score > 0) {
      audioService.playFanfare();
    } else {
      audioService.playIncorrect();
    }
  }, [score]);

  // Generate chart data
  const chartData = useMemo(() => {
    let currentScore = 0;
    const points = [{ index: 0, score: 0, isCorrect: true }]; // Start point

    history.forEach((isCorrect, i) => {
      currentScore += isCorrect ? 10 : -5;
      points.push({ index: i + 1, score: currentScore, isCorrect });
    });

    return points;
  }, [history]);

  // Chart Rendering Logic
  const renderChart = () => {
    if (chartData.length < 2) return null;

    const width = 100;
    const height = 50;
    const padding = 5;

    // Calculate min and max for scaling
    const scores = chartData.map(d => d.score);
    const minScore = Math.min(0, ...scores);
    const maxScore = Math.max(10, ...scores);
    const range = maxScore - minScore || 10; // Prevent divide by zero

    // Scale functions
    const scaleX = (index: number) => padding + (index / (chartData.length - 1)) * (width - 2 * padding);
    const scaleY = (score: number) => height - padding - ((score - minScore) / range) * (height - 2 * padding);

    // Generate Path
    const pathD = chartData.reduce((acc, point, i) => {
      const x = scaleX(i);
      const y = scaleY(point.score);
      return i === 0 ? `M ${x} ${y}` : `${acc} L ${x} ${y}`;
    }, "");

    // Generate Area (for gradient fill)
    const areaD = `${pathD} L ${scaleX(chartData.length - 1)} ${height} L ${scaleX(0)} ${height} Z`;

    return (
      <div className="w-full h-32 md:h-40 mb-6 relative">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible">
           <defs>
             <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
               <stop offset="0%" stopColor="rgba(168, 85, 247, 0.5)" />
               <stop offset="100%" stopColor="rgba(168, 85, 247, 0)" />
             </linearGradient>
           </defs>
           
           {/* Gradient Area under line */}
           <path d={areaD} fill="url(#chartGradient)" className="opacity-50" />
           
           {/* Line */}
           <path 
             d={pathD} 
             fill="none" 
             stroke="white" 
             strokeWidth="0.8" 
             strokeLinecap="round" 
             strokeLinejoin="round"
             className="drop-shadow-[0_0_4px_rgba(255,255,255,0.5)]"
           />

           {/* Points */}
           {chartData.map((point, i) => {
             // Determine color based on whether this step was a gain or loss
             // Start point (i=0) is neutral (white). i > 0 depends on history.
             let circleColor = "white";
             if (i > 0) {
               circleColor = point.isCorrect ? "#4ade80" : "#f87171"; // green-400 : red-400
             }

             return (
               <circle
                key={i}
                cx={scaleX(i)}
                cy={scaleY(point.score)}
                r="1.2"
                fill={circleColor}
                stroke="rgba(0,0,0,0.5)"
                strokeWidth="0.2"
                className="transition-all duration-300"
               />
             );
           })}
        </svg>
        
        {/* X-Axis Labels */}
        <div className="absolute bottom-[-1.5rem] left-0 w-full flex justify-between text-[10px] text-gray-500 font-mono px-1">
          <span>Start</span>
          <span>End</span>
        </div>
      </div>
    );
  };

  const getMessage = (score: number) => {
    if (score === maxScore) return { text: t.legend, sub: t.legendSub, color: "text-yellow-400" };
    if (score >= maxScore * 0.8) return { text: t.aficionado, sub: t.aficionadoSub, color: "text-purple-400" };
    if (score >= maxScore * 0.5) return { text: t.solid, sub: t.solidSub, color: "text-blue-400" };
    if (score > 0) return { text: t.casual, sub: t.casualSub, color: "text-gray-300" };
    return { text: t.ouch, sub: t.ouchSub, color: "text-red-400" };
  };

  const message = getMessage(score);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full p-4 relative animate-fade-in py-10">
       <div className="absolute inset-0 bg-gradient-to-b from-black via-purple-950/20 to-black pointer-events-none"></div>
      
      <div className="relative z-10 max-w-lg w-full text-center">
        
        <div className="mb-6 relative inline-block">
          <div className="absolute inset-0 bg-white/20 blur-3xl rounded-full"></div>
          {score > 0 ? (
             <Trophy size={64} className={`relative z-10 ${message.color} drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]`} />
          ) : (
             <Frown size={64} className="relative z-10 text-gray-400" />
          )}
        </div>

        {userName && (
          <p className="text-xl text-gray-400 mb-2 font-light">{t.wellPlayed}, <span className="text-white font-semibold">{userName}</span>!</p>
        )}

        <h2 className="text-6xl font-black text-white mb-2 tracking-tighter">
          {score}<span className="text-2xl text-white/40 ml-2 font-normal">pts</span>
        </h2>

        {/* Message Panel */}
        <div className="mb-8">
           <h3 className={`text-2xl font-bold mb-1 ${message.color}`}>{message.text}</h3>
           <p className="text-gray-400 text-sm">{message.sub}</p>
        </div>

        {/* Chart Panel */}
        <div className="glass-panel p-6 rounded-3xl border border-white/10 mb-8 backdrop-blur-xl">
           <div className="flex items-center space-x-2 text-purple-300 mb-2">
             <TrendingUp size={16} />
             <span className="text-xs font-bold uppercase tracking-wider">{t.performance}</span>
           </div>
           {renderChart()}
           <div className="flex justify-between text-xs text-gray-400 mt-2 px-2">
             <div className="flex items-center"><div className="w-2 h-2 rounded-full bg-green-400 mr-1"></div> {t.correct}</div>
             <div className="flex items-center"><div className="w-2 h-2 rounded-full bg-red-400 mr-1"></div> {t.incorrect}</div>
           </div>
        </div>

        <div className="flex flex-col gap-3 justify-center sm:flex-row">
          <button
            onClick={() => { audioService.playClick(); onRestart(); }}
            className="flex items-center justify-center px-8 py-4 bg-white text-black font-bold rounded-full hover:bg-gray-200 hover:scale-105 transition-all duration-200 shadow-xl shadow-white/10"
          >
            <RotateCcw className="mr-2" size={20} />
            {t.playAgain}
          </button>
          
          <button
            onClick={() => { audioService.playClick(); onShowLeaderboard(); }}
            className="flex items-center justify-center px-8 py-4 bg-white/10 text-white font-bold rounded-full hover:bg-white/20 hover:scale-105 transition-all duration-200 border border-white/10"
          >
            <List className="mr-2" size={20} />
            {t.leaderboard}
          </button>
        </div>
      </div>
      
      {/* Decorative particles */}
      {score > 50 && (
         <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(5)].map((_, i) => (
                <Sparkles 
                  key={i}
                  className="absolute text-yellow-200 animate-pulse opacity-50"
                  style={{
                    top: `${Math.random() * 100}%`,
                    left: `${Math.random() * 100}%`,
                    animationDelay: `${i * 0.5}s`,
                    transform: `scale(${0.5 + Math.random()})`
                  }} 
                />
            ))}
         </div>
      )}
    </div>
  );
};

export default ResultScreen;