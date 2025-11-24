
import { GoogleGenAI, Type } from "@google/genai";
import { QuizQuestion, TARGET_ARTISTS, DifficultyLevel } from "../types";
import { fetchTrackPreview } from "./musicService";

export const generateQuizQuestions = async (difficulty: DifficultyLevel): Promise<QuizQuestion[]> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key is missing");
  }

  const ai = new GoogleGenAI({ apiKey });

  // Config based on difficulty tiers defined in types.ts
  let questionCount = 10;
  let artistSubset: string[] = [];

  // Helper to get random items from array
  const getRandomArtists = (arr: string[], count: number) => {
    // If we request more artists than available in the slice, just use the whole slice
    const safeCount = Math.min(count, arr.length);
    const shuffled = [...arr].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, safeCount);
  };

  switch (difficulty) {
    case 'easy':
      questionCount = 10;
      // Easy: Rank 0-20 (Top 20 Artists)
      artistSubset = getRandomArtists(TARGET_ARTISTS.slice(0, 20), 10); 
      break;
    case 'medium':
      questionCount = 15;
      // Medium: Rank 21-50 (Next 30 Artists)
      artistSubset = getRandomArtists(TARGET_ARTISTS.slice(20, 50), 15);
      break;
    case 'hard':
      questionCount = 25;
      // Hard: Rank 51-80+ (The rest of the list)
      // We take a larger slice to ensure we have enough diversity for 25 questions
      artistSubset = getRandomArtists(TARGET_ARTISTS.slice(50), 30);
      break;
  }

  const prompt = `Generate a trivia quiz with exactly ${questionCount} questions. 
  Each question must ask for the release year of a song based on the provided list of artists/series: ${artistSubset.join(', ')}.
  
  Rules:
  1. If the artist is a musician/band, choose a popular song by them.
  2. If the artist is a Manga or Anime series (e.g., Naruto, One Piece), choose a popular Opening (OP) or Ending (ED) theme song from that series. 
     - CRITICAL: The 'artist' field in the JSON output must be the name of the Anime/Manga Series (e.g. "Naruto"), NOT the singer.
     - The 'songTitle' should be the name of the track.
  3. Provide 4 numerical year options.
  4. Provide a lyrics snippet (in the original language of the song).
  5. Provide the Album name and exact Release Date (YYYY-MM-DD).
  6. Ensure the selection is diverse (mix of Genres, Countries, and Anime).

  The output must strictly follow the JSON schema provided.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              artist: { type: Type.STRING, description: "Artist Name or Anime Series Name" },
              songTitle: { type: Type.STRING },
              correctYear: { type: Type.INTEGER },
              options: {
                type: Type.ARRAY,
                items: { type: Type.INTEGER },
                description: "List of 4 unique years, including the correct one."
              },
              lyricsSnippet: { 
                type: Type.STRING,
                description: "A short memorable excerpt of lyrics."
              },
              album: { type: Type.STRING, description: "The album name or Single." },
              releaseDate: { type: Type.STRING, description: "Full release date YYYY-MM-DD" }
            },
            required: ["artist", "songTitle", "correctYear", "options", "lyricsSnippet", "album", "releaseDate"],
            propertyOrdering: ["artist", "songTitle", "correctYear", "options", "lyricsSnippet", "album", "releaseDate"]
          }
        }
      }
    });

    const text = response.text;
    if (!text) {
      throw new Error("No response from Gemini");
    }

    const data = JSON.parse(text) as QuizQuestion[];
    
    // Post-processing: Shuffle options AND fetch audio previews
    // We use Promise.all to fetch previews in parallel to minimize waiting time
    const enrichedData = await Promise.all(data.map(async (q) => {
      // Shuffle options
      const options = [...q.options];
      for (let i = options.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [options[i], options[j]] = [options[j], options[i]];
      }

      // Fetch Audio Preview
      const audioUrl = await fetchTrackPreview(q.artist, q.songTitle);

      return {
        ...q,
        options,
        audioUrl
      };
    }));

    return enrichedData;
  } catch (error) {
    console.error("Error generating quiz:", error);
    throw error;
  }
};
