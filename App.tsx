
import React, { useState, useEffect } from 'react';
import { GameState, QuizQuestion, QuizConfig, User, Language, DifficultyLevel } from './types';
import StartScreen from './components/StartScreen';
import RegistrationScreen from './components/RegistrationScreen';
import QuizScreen from './components/QuizScreen';
import ResultScreen from './components/ResultScreen';
import LeaderboardScreen from './components/LeaderboardScreen';
import SoundController from './components/SoundController';
import { generateQuizQuestions } from './services/geminiService';
import { saveScore } from './services/leaderboardService';
import { audioService } from './services/audioService';
import { Loader2, AlertCircle } from 'lucide-react';
import { getTranslation } from './translations';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>('start');
  const [language, setLanguage] = useState<Language>('en');
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('medium');
  const [user, setUser] = useState<User | null>(null);
  const [quizConfig, setQuizConfig] = useState<QuizConfig>({
    score: 0,
    currentQuestionIndex: 0,
    questions: [],
    history: []
  });
  const [errorMsg, setErrorMsg] = useState<string>("");

  const t = getTranslation(language);

  // Audio cleanup when leaving game states
  useEffect(() => {
    if (gameState !== 'playing') {
      audioService.stopAllMusic();
    }
  }, [gameState]);

  // Navigation handlers
  const handleStartClick = () => {
    setGameState('register');
  };

  const handleShowLeaderboard = () => {
    setGameState('leaderboard');
  };

  const handleBackToMenu = () => {
    setGameState('start');
  };

  // Step 2: Register -> Loading -> Playing
  const handleRegistrationSubmit = async (userData: User) => {
    setUser(userData);
    setGameState('loading');
    setErrorMsg("");
    
    try {
      const questions = await generateQuizQuestions(difficulty);
      setQuizConfig({
        score: 0,
        currentQuestionIndex: 0,
        questions,
        history: []
      });
      setGameState('playing');
    } catch (err) {
      console.error(err);
      setErrorMsg(t.error.msg);
      setGameState('error');
    }
  };

  const handleAnswer = (isCorrect: boolean) => {
    const points = isCorrect ? 10 : -5;
    
    setQuizConfig(prev => {
      const newScore = prev.score + points;
      const nextIndex = prev.currentQuestionIndex + 1;
      
      // Check if finished after update
      if (nextIndex >= prev.questions.length) {
        // Save score immediately when the game finishes
        if (user) {
          saveScore(user, newScore);
        }
        setTimeout(() => setGameState('finished'), 500); // Slight delay for smoother transition
      }

      return {
        ...prev,
        score: newScore,
        currentQuestionIndex: nextIndex,
        history: [...prev.history, isCorrect]
      };
    });
  };

  const restartGame = () => {
    // Keep user logged in, go back to loading new questions
    setGameState('loading');
    setQuizConfig({
        score: 0,
        currentQuestionIndex: 0,
        questions: [],
        history: []
    });
    
    // Re-fetch questions with current difficulty
    generateQuizQuestions(difficulty)
      .then(questions => {
         setQuizConfig({
            score: 0,
            currentQuestionIndex: 0,
            questions,
            history: []
         });
         setGameState('playing');
      })
      .catch(err => {
         console.error(err);
         setErrorMsg(t.error.msg);
         setGameState('error');
      });
  };

  const getTimerDuration = () => {
    switch (difficulty) {
      case 'easy': return 15;
      case 'medium': return 10;
      case 'hard': return 7;
      default: return 10;
    }
  }

  return (
    <div className="min-h-screen bg-black bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-black to-black text-white font-sans selection:bg-purple-500 selection:text-white">
      <SoundController />
      
      {gameState === 'start' && (
        <StartScreen 
          onStart={handleStartClick} 
          onShowLeaderboard={handleShowLeaderboard}
          language={language}
          onLanguageChange={setLanguage}
          difficulty={difficulty}
          onDifficultyChange={setDifficulty}
        />
      )}
      
      {gameState === 'leaderboard' && (
        <LeaderboardScreen 
          onBack={handleBackToMenu} 
          language={language}
        />
      )}
      
      {gameState === 'register' && (
        <RegistrationScreen 
          onSubmit={handleRegistrationSubmit} 
          language={language}
        />
      )}
      
      {gameState === 'loading' && (
        <div className="flex flex-col items-center justify-center min-h-screen">
          <Loader2 className="w-12 h-12 text-purple-500 animate-spin mb-4" />
          <p className="text-purple-300 animate-pulse">
             {user ? `${t.loading.preparing} ${user.firstName}...` : t.loading.archives}
          </p>
        </div>
      )}

      {gameState === 'error' && (
         <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center">
            <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
            <h2 className="text-2xl font-bold mb-2">{t.error.oops}</h2>
            <p className="text-gray-400 mb-6">{errorMsg}</p>
            <button 
              onClick={() => { audioService.playClick(); setGameState('start'); }}
              className="px-6 py-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
            >
              {t.error.retry}
            </button>
         </div>
      )}

      {gameState === 'playing' && quizConfig.questions.length > 0 && quizConfig.currentQuestionIndex < quizConfig.questions.length && (
        <QuizScreen 
          questions={quizConfig.questions}
          currentQuestionIndex={quizConfig.currentQuestionIndex}
          score={quizConfig.score}
          onAnswer={handleAnswer}
          language={language}
          initialTime={getTimerDuration()}
        />
      )}

      {gameState === 'finished' && (
        <ResultScreen 
          score={quizConfig.score} 
          totalQuestions={quizConfig.questions.length}
          onRestart={restartGame}
          onShowLeaderboard={handleShowLeaderboard}
          userName={user?.firstName}
          history={quizConfig.history}
          language={language}
        />
      )}
    </div>
  );
};

export default App;
