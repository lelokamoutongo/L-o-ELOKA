
import React, { useState, useEffect, useMemo } from 'react';
import { QuizQuestion, Language } from '../types';
import { Disc3, CheckCircle2, XCircle, ArrowRight, Mic2, Calendar, Disc, Music, Play, Pause } from 'lucide-react';
import { audioService } from '../services/audioService';
import { getTranslation } from '../translations';

interface QuizScreenProps {
  questions: QuizQuestion[];
  currentQuestionIndex: number;
  onAnswer: (isCorrect: boolean) => void;
  score: number;
  language: Language;
  initialTime: number;
}

const QuizScreen: React.FC<QuizScreenProps> = ({ 
  questions, 
  currentQuestionIndex, 
  onAnswer, 
  score, 
  language,
  initialTime 
}) => {
  const t = getTranslation(language).quiz;
  
  const question = questions[currentQuestionIndex];
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [answerCorrect, setAnswerCorrect] = useState(false);
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const [isPlaying, setIsPlaying] = useState(false);
  
  // Audio Management Effect
  useEffect(() => {
    // When question loads, determine what audio to play
    const handleAudioStart = async () => {
      // Stop any previous tracks first
      audioService.stopAllMusic();

      if (question.audioUrl) {
        // Play specific song preview
        await audioService.playSongPreview(question.audioUrl);
        setIsPlaying(true);
      } else {
        // Fallback to generic BGM if no preview available
        await audioService.startGenericBGM();
        setIsPlaying(false);
      }
    };

    handleAudioStart();

    // Cleanup when component unmounts or question changes (handled by next effect run)
    return () => {
       // We don't necessarily stop here to avoid gaps, 
       // but the next effect execution triggers stopAllMusic() immediately.
    };
  }, [currentQuestionIndex, question.audioUrl]);

  // Clean up audio on unmount
  useEffect(() => {
    return () => {
      audioService.stopAllMusic();
    };
  }, []);

  // Reset state when question changes
  useEffect(() => {
    setSelectedOption(null);
    setHasAnswered(false);
    setAnswerCorrect(false);
    setTimeLeft(initialTime);
  }, [currentQuestionIndex, initialTime]);

  // Timer logic
  useEffect(() => {
    if (hasAnswered) return;

    if (timeLeft === 0) {
      setHasAnswered(true);
      setAnswerCorrect(false);
      audioService.playIncorrect();
      // Auto-advance removed to allow reading lyrics
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, hasAnswered]);

  // Particle generation (Memoized to prevent re-render flickering)
  const particles = useMemo(() => {
    return [...Array(20)].map((_, i) => ({
      id: i,
      width: Math.random() * 4 + 2,
      height: Math.random() * 4 + 2,
      top: Math.random() * 100,
      left: Math.random() * 100,
      duration: Math.random() * 10 + 10,
      delay: Math.random() * 5
    }));
  }, []);

  // Dynamic Background Intensity Calculation
  const getBackgroundIntensity = () => {
    if (hasAnswered) {
      return { 
        blob1: answerCorrect ? 'bg-green-600' : 'bg-red-900', 
        blob2: answerCorrect ? 'bg-emerald-600' : 'bg-orange-900', 
        opacity: 'opacity-20'
      };
    }
    // Urgency based on time
    if (timeLeft <= 3) {
      return { blob1: 'bg-red-600', blob2: 'bg-orange-600', opacity: 'opacity-50' };
    }
    if (timeLeft <= initialTime * 0.5) {
      return { blob1: 'bg-purple-800', blob2: 'bg-pink-800', opacity: 'opacity-30' };
    }
    // Default calm state
    return { blob1: 'bg-indigo-600', blob2: 'bg-blue-600', opacity: 'opacity-30' };
  };

  const bgStyle = getBackgroundIntensity();

  const handleOptionClick = (year: number) => {
    if (hasAnswered) return;
    
    setSelectedOption(year);
    setHasAnswered(true);
    
    const isCorrect = year === question.correctYear;
    setAnswerCorrect(isCorrect);
    
    // Play Sound
    if (isCorrect) {
        audioService.playCorrect();
    } else {
        audioService.playIncorrect();
    }
  };

  const handleNextClick = () => {
    audioService.playClick();
    onAnswer(answerCorrect);
  };

  const togglePlayback = () => {
    if (!question.audioUrl) return;

    if (isPlaying) {
      audioService.pauseSongPreview();
      setIsPlaying(false);
    } else {
      audioService.resumeSongPreview();
      setIsPlaying(true);
    }
  };

  const progress = ((currentQuestionIndex) / questions.length) * 100;

  // Determine timer visual state
  const getTimerColor = () => {
    if (hasAnswered) return 'text-gray-500 border-gray-600 opacity-50';
    if (timeLeft <= 3) return 'text-red-500 border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.4)]';
    if (timeLeft <= initialTime * 0.6) return 'text-yellow-400 border-yellow-400';
    return 'text-green-400 border-green-400';
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full p-4 relative overflow-hidden transition-colors duration-1000">
       
       {/* DYNAMIC BACKGROUND */}
       <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-0 overflow-hidden">
          {/* Animated Blobs */}
          <div className={`absolute top-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full filter blur-[100px] animate-blob transition-colors duration-1000 ease-in-out ${bgStyle.blob1} ${bgStyle.opacity}`}></div>
          <div className={`absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full filter blur-[100px] animate-blob animation-delay-2000 transition-colors duration-1000 ease-in-out ${bgStyle.blob2} ${bgStyle.opacity}`}></div>
          <div className={`absolute top-[40%] left-[30%] w-[300px] h-[300px] rounded-full filter blur-[80px] animate-blob animation-delay-4000 transition-colors duration-1000 ease-in-out ${bgStyle.blob1} opacity-20`}></div>

          {/* Floating Particles */}
          <div className="absolute inset-0 w-full h-full">
            {particles.map((p) => (
               <div 
                 key={p.id}
                 className="absolute rounded-full bg-white/30 animate-float"
                 style={{
                   width: `${p.width}px`,
                   height: `${p.height}px`,
                   top: `${p.top}%`,
                   left: `${p.left}%`,
                   animationDuration: `${p.duration}s`,
                   animationDelay: `${p.delay}s`
                 }}
               />
            ))}
          </div>
       </div>

       {/* Progress Bar */}
       <div className="absolute top-0 w-full h-1 bg-gray-800 z-20">
          <div 
            className="h-full bg-gradient-to-r from-purple-500 to-blue-500 transition-all duration-500 ease-out" 
            style={{ width: `${progress}%` }}
          />
       </div>

      <div className="relative z-10 w-full max-w-3xl">
        {/* Header Status */}
        <div className="flex justify-between items-center mb-8 px-4 relative">
          <div className="flex items-center space-x-2 text-white/60">
            <span className="text-sm font-medium tracking-widest uppercase">{t.question}</span>
            <span className="text-xl font-bold text-white">{currentQuestionIndex + 1}<span className="text-white/40 text-base">/{questions.length}</span></span>
          </div>
          
          {/* Central Timer */}
          <div className={`absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center w-16 h-16 rounded-full border-4 bg-black/50 backdrop-blur-md transition-all duration-300 ${getTimerColor()} ${!hasAnswered && timeLeft <= 3 ? 'animate-pulse scale-110' : ''}`}>
             <div className="flex flex-col items-center">
                <span className="text-2xl font-black leading-none font-mono">{timeLeft}</span>
             </div>
          </div>
          
          <div className="glass-panel px-4 py-2 rounded-full border border-white/10 flex items-center space-x-2">
            <span className="text-xs text-purple-300 uppercase font-bold tracking-wider">{t.score}</span>
            <span className="text-xl font-bold text-white">{score}</span>
          </div>
        </div>

        {/* Card */}
        <div className="glass-panel p-8 md:p-12 rounded-3xl border border-white/10 shadow-2xl animate-fade-in mx-2 mt-4 backdrop-blur-xl bg-black/40">
          
          <div key={currentQuestionIndex} className="flex flex-col items-center text-center mb-10">
            {/* Visualizer / Disc Element (Clickable for Play/Pause) */}
            <button 
              onClick={togglePlayback}
              disabled={!question.audioUrl}
              className={`w-20 h-20 rounded-full bg-gradient-to-tr from-purple-600 to-blue-600 flex items-center justify-center mb-6 shadow-lg shadow-purple-500/20 transition-transform active:scale-95 group relative overflow-hidden ${!hasAnswered && isPlaying ? 'animate-[spin_4s_linear_infinite]' : ''}`}
            >
              <Disc3 className={`text-white relative z-10 transition-opacity ${isPlaying ? 'opacity-50' : 'opacity-100'}`} size={40} />
              
              {/* Play/Pause Overlay */}
              {question.audioUrl && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity z-20">
                  {isPlaying ? <Pause size={24} className="text-white fill-white" /> : <Play size={24} className="text-white fill-white ml-1" />}
                </div>
              )}

              {/* Audio playing indicator wave */}
              {!hasAnswered && isPlaying && question.audioUrl && (
                <div className="absolute inset-0 rounded-full border-2 border-purple-400 opacity-60 animate-ping pointer-events-none"></div>
              )}
            </button>
            
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-2 leading-tight animate-fade-in drop-shadow-md">
              {question.songTitle}
            </h2>
            <p className="text-xl text-purple-200 font-medium opacity-0 animate-fade-in" style={{ animationDelay: '200ms' }}>
              {t.by} {question.artist}
            </p>
            
            {/* Audio Indicator Badge */}
            {question.audioUrl && (
              <div 
                className={`mt-4 inline-flex items-center space-x-2 px-3 py-1 rounded-full border transition-all ${isPlaying ? 'bg-purple-500/20 border-purple-500/30' : 'bg-gray-500/20 border-gray-500/30'}`}
              >
                 <Music size={12} className={isPlaying ? "text-purple-300" : "text-gray-400"} />
                 <span className={`text-xs uppercase tracking-wider font-bold ${isPlaying ? "text-purple-200" : "text-gray-400"}`}>
                   {isPlaying ? "Playing Preview" : "Preview Paused"}
                 </span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {question.options.map((year, idx) => {
              let btnClass = "relative overflow-hidden group p-6 rounded-2xl border-2 text-xl font-bold transition-all duration-300 transform";
              
              if (hasAnswered) {
                if (year === question.correctYear) {
                  btnClass += " bg-green-500/20 border-green-500 text-green-100 shadow-[0_0_20px_rgba(34,197,94,0.3)]";
                } else if (year === selectedOption) {
                  btnClass += " bg-red-500/20 border-red-500 text-red-100";
                } else {
                  btnClass += " bg-white/5 border-transparent text-gray-500 opacity-30";
                }
              } else {
                btnClass += " bg-white/5 border-white/5 hover:bg-white/10 hover:border-purple-500/50 hover:shadow-[0_0_15px_rgba(168,85,247,0.2)] text-white active:scale-95";
              }

              return (
                <button
                  key={idx}
                  disabled={hasAnswered}
                  onClick={() => handleOptionClick(year)}
                  className={btnClass}
                  onMouseEnter={() => !hasAnswered && audioService.playClick()}
                >
                  <span className="relative z-10 flex items-center justify-center w-full">
                    {year}
                    {hasAnswered && year === question.correctYear && (
                      <CheckCircle2 className="ml-2 w-6 h-6 text-green-400 animate-bounce" />
                    )}
                    {hasAnswered && year === selectedOption && year !== question.correctYear && (
                       <XCircle className="ml-2 w-6 h-6 text-red-400" />
                    )}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Details Reveal Section */}
          {hasAnswered && (
             <div className="animate-fade-in flex flex-col items-center w-full mt-6 space-y-4">
                
                {/* Album and Date Info */}
                <div className="grid grid-cols-2 gap-4 w-full">
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col items-center text-center backdrop-blur-sm">
                     <Disc className="w-5 h-5 text-purple-400 mb-2" />
                     <span className="text-xs text-gray-400 uppercase tracking-wider mb-1">{t.album}</span>
                     <span className="font-bold text-white text-sm md:text-base">{question.album}</span>
                  </div>
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col items-center text-center backdrop-blur-sm">
                     <Calendar className="w-5 h-5 text-purple-400 mb-2" />
                     <span className="text-xs text-gray-400 uppercase tracking-wider mb-1">{t.releaseDate}</span>
                     <span className="font-bold text-white text-sm md:text-base">{question.releaseDate}</span>
                  </div>
                </div>

                {/* Lyrics Info */}
                <div className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 relative overflow-hidden">
                   <div className="absolute top-0 right-0 p-3 opacity-20">
                      <Mic2 size={48} />
                   </div>
                   <div className="relative z-10">
                      <div className="flex items-center space-x-2 text-purple-400 mb-2">
                        <Mic2 size={16} />
                        <span className="text-xs font-bold uppercase tracking-wider">{t.lyricsReveal}</span>
                      </div>
                      <p className="text-lg md:text-xl text-white font-serif italic leading-relaxed opacity-90">
                        "{question.lyricsSnippet}"
                      </p>
                   </div>
                </div>

                <button 
                  onClick={handleNextClick}
                  className="group flex items-center justify-center px-8 py-4 bg-white text-black font-bold rounded-full hover:bg-gray-200 hover:scale-105 transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)] w-full sm:w-auto"
                >
                  {currentQuestionIndex < questions.length - 1 ? t.nextQuestion : t.finishQuiz}
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
             </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizScreen;
