const BASE_URL = "https://api.jikan.moe/v4";

/**
 * Common delay function to avoid rate limiting (Jikan has a 3 requests per second limit)
 */
const delay = (ms) => new Promise(res => setTimeout(res, ms));

export async function getTopAnime(limit = 10, page = 1) {
  try {
    const res = await fetch(`${BASE_URL}/top/anime?limit=${limit}&page=${page}`);
    const data = await res.json();
    return data.data || [];
  } catch (error) {
    console.error("Error fetching top anime:", error);
    return [];
  }
}

export async function getPopularAnimesBatch(page = 1) {
  // Jikan returns 25 items per page by default for top anime
  return getTopAnime(25, page);
}

export async function getRandomCharacter() {
  try {
    const res = await fetch(`${BASE_URL}/random/characters`);
    const data = await res.json();
    return data.data || null;
  } catch (error) {
    console.error("Error fetching random character:", error);
    return null;
  }
}

export async function getRandomAnime() {
  try {
    const res = await fetch(`${BASE_URL}/random/anime`);
    const data = await res.json();
    return data.data || null;
  } catch (error) {
    console.error("Error fetching random anime:", error);
    return null;
  }
}

export async function searchAnime(query, limit = 10) {
  try {
    const res = await fetch(`${BASE_URL}/anime?q=${query}&limit=${limit}`);
    const data = await res.json();
    return data.data || [];
  } catch (error) {
    console.error("Error searching anime:", error);
    return [];
  }
}

export async function getAnimeCharacters(animeId) {
  try {
    const res = await fetch(`${BASE_URL}/anime/${animeId}/characters`);
    const data = await res.json();
    return data.data || [];
  } catch (error) {
    console.error("Error fetching anime characters:", error);
    return [];
  }
}
