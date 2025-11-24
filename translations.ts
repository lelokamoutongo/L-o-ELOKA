import { Language } from './types';

export const translations = {
  en: {
    start: {
      title: "BeatTimeline",
      subtitle: "Can you guess the release year?",
      artists: "Damso, Ninho, Booba, Ariana, Cardi B",
      more: "and more.",
      startBtn: "Start Quiz",
      leaderboardBtn: "Leaderboard",
      correct: "Correct",
      incorrect: "Incorrect",
      footer: "Powered by Gemini 2.5 Flash",
      difficulty: "Difficulty",
      easy: "Easy",
      medium: "Medium",
      hard: "Hard"
    },
    register: {
      title: "Player Profile",
      subtitle: "Enter your details to enter the leaderboard",
      firstName: "First Name",
      lastName: "Surname",
      email: "Email Address",
      phone: "Phone Number",
      submit: "Start the Game"
    },
    quiz: {
      question: "Question",
      score: "Score",
      by: "by",
      lyricsReveal: "Lyrics Reveal",
      nextQuestion: "Next Question",
      finishQuiz: "Finish Quiz",
      album: "Album",
      releaseDate: "Release Date"
    },
    result: {
      legend: "Absolute Legend! 🎧",
      legendSub: "You are a certified music historian.",
      aficionado: "Music Aficionado! 🔥",
      aficionadoSub: "Impressive knowledge of the charts.",
      solid: "Solid Effort! 🎵",
      solidSub: "You know your bangers, mostly.",
      casual: "Casual Listener 📻",
      casualSub: "Maybe check your playlist history?",
      ouch: "Ouch... 📉",
      ouchSub: "Time to update your Spotify.",
      wellPlayed: "Well played",
      performance: "Performance Chart",
      correct: "Correct",
      incorrect: "Incorrect",
      playAgain: "Play Again",
      leaderboard: "Leaderboard"
    },
    leaderboard: {
      title: "Hall of Fame",
      back: "Back to Menu",
      empty: "No records yet. Be the first!",
      rank: "Rank",
      player: "Player",
      score: "Score",
      date: "Date"
    },
    loading: {
      preparing: "Preparing quiz for",
      archives: "Consulting the music archives..."
    },
    error: {
      oops: "Oops!",
      msg: "Failed to generate quiz. Please check your API Key and connection.",
      retry: "Try Again"
    }
  },
  fr: {
    start: {
      title: "BeatTimeline",
      subtitle: "Pouvez-vous deviner l'année ?",
      artists: "Damso, Ninho, Booba, Ariana, Cardi B",
      more: "et plus.",
      startBtn: "Commencer",
      leaderboardBtn: "Classement",
      correct: "Correct",
      incorrect: "Incorrect",
      footer: "Propulsé par Gemini 2.5 Flash",
      difficulty: "Difficulté",
      easy: "Facile",
      medium: "Moyen",
      hard: "Difficile"
    },
    register: {
      title: "Profil Joueur",
      subtitle: "Entrez vos détails pour rejoindre le classement",
      firstName: "Prénom",
      lastName: "Nom",
      email: "Adresse Email",
      phone: "Numéro de téléphone",
      submit: "Lancer le jeu"
    },
    quiz: {
      question: "Question",
      score: "Score",
      by: "de",
      lyricsReveal: "Paroles",
      nextQuestion: "Question Suivante",
      finishQuiz: "Terminer le Quiz",
      album: "Album",
      releaseDate: "Date de sortie"
    },
    result: {
      legend: "Légende Absolue ! 🎧",
      legendSub: "Vous êtes un historien certifié de la musique.",
      aficionado: "Expert Musical ! 🔥",
      aficionadoSub: "Connaissance impressionnante des charts.",
      solid: "Bel Effort ! 🎵",
      solidSub: "Vous connaissez vos classiques.",
      casual: "Auditeur Occasionnel 📻",
      casualSub: "Vérifiez peut-être votre historique ?",
      ouch: "Aïe... 📉",
      ouchSub: "Il est temps de mettre à jour votre playlist.",
      wellPlayed: "Bien joué",
      performance: "Graphique de Performance",
      correct: "Correct",
      incorrect: "Incorrect",
      playAgain: "Rejouer",
      leaderboard: "Classement"
    },
    leaderboard: {
      title: "Tableau d'Honneur",
      back: "Retour au Menu",
      empty: "Aucun record. Soyez le premier !",
      rank: "Rang",
      player: "Joueur",
      score: "Score",
      date: "Date"
    },
    loading: {
      preparing: "Préparation du quiz pour",
      archives: "Consultation des archives musicales..."
    },
    error: {
      oops: "Oups !",
      msg: "Échec de la génération du quiz. Vérifiez votre clé API et connexion.",
      retry: "Réessayer"
    }
  }
};

export const getTranslation = (lang: Language) => translations[lang];
