
export const fetchTrackPreview = async (artist: string, title: string): Promise<string | null> => {
  try {
    // Construct a search query
    // We strictly limit to music media type to get songs
    const query = `${artist} ${title}`;
    const encodedQuery = encodeURIComponent(query);
    
    // Using iTunes Search API (No key required, CORS enabled)
    const response = await fetch(`https://itunes.apple.com/search?term=${encodedQuery}&media=music&entity=song&limit=1`);
    
    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    
    if (data.resultCount > 0 && data.results[0].previewUrl) {
      return data.results[0].previewUrl;
    }
    
    return null;
  } catch (error) {
    console.warn(`Failed to fetch preview for ${artist} - ${title}`, error);
    return null;
  }
};
