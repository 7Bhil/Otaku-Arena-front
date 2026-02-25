export const ANIME_GENRE_MAP = {
  // Shonen / Action
  "One Piece": "Shonen",
  "Naruto": "Shonen",
  "Dragon Ball Z": "Shonen",
  "Bleach": "Shonen",
  "Jujutsu Kaisen": "Shonen",
  "Demon Slayer": "Shonen",
  "My Hero Academia": "Shonen",
  "Attack on Titan": "Shonen", // Can be Seinen too but often grouped in Shonen
  "Black Clover": "Shonen",
  "Fairy Tail": "Shonen",
  "Hunter x Hunter": "Shonen",

  // Seinen / Psychologique
  "Death Note": "Seinen",
  "Berserk": "Seinen",
  "Vinland Saga": "Seinen",
  "Tokyo Ghoul": "Seinen",
  "Monster": "Seinen",
  "Psycho-Pass": "Seinen",
  "Code Geass": "Seinen",
  "Steins;Gate": "Seinen",
  "Parasyte": "Seinen",

  // Aventure / Fantasy
  "Sword Art Online": "Aventure",
  "Fullmetal Alchemist": "Aventure",
  "Frieren": "Aventure",
  "Mushoku Tensei": "Aventure",
  "Made in Abyss": "Aventure",
  "Re:Zero": "Aventure",
  "The Rising of the Shield Hero": "Aventure",
  "Doctor Stone": "Aventure",

  // Vibe / Slice of Life / Comedy / Drama
  "Kaguya-sama": "Vibe",
  "Spy x Family": "Vibe",
  "Your Lie in April": "Vibe",
  "A Silent Voice": "Vibe",
  "Haikyuu!!": "Vibe", // Sports are Vibe/Shonen but let's put it here for variety
  "Blue Lock": "Vibe",
  "Oshi no Ko": "Vibe",
  "Mushishi": "Vibe",

  // Culte / Classiques
  "Neon Genesis Evangelion": "Culte",
  "Cowboy Bebop": "Culte",
  "Akira": "Culte",
  "Ghost in the Shell": "Culte",
  "Samurai Champloo": "Culte",
  "Mobile Suit Gundam": "Culte",
  "Sailor Moon": "Culte",
  "Dragon Ball": "Culte",
  "Yu Yu Hakusho": "Culte"
};

export const CATEGORIES = ["Shonen", "Seinen", "Aventure", "Vibe", "Culte"];

export function calculateExpertise(quizAttempts = [], votes = []) {
  const expertise = {
    Shonen: 0,
    Seinen: 0,
    Aventure: 0,
    Vibe: 0,
    Culte: 0
  };

  // Process Quiz Attempts
  quizAttempts.forEach(attempt => {
    // attempt might have quiz object with title or we use the quiz roadmap info
    // For now let's assume attempt.quiz.title
    const title = attempt.quiz?.title;
    if (title && ANIME_GENRE_MAP[title]) {
      expertise[ANIME_GENRE_MAP[title]] += attempt.score / 20; // Weight by score
    } else {
        // Default to Shonen if unknown for now or spread
        expertise.Shonen += 1;
    }
  });

  // Process Votes
  votes.forEach(vote => {
    const title = vote.anime?.title;
    if (title && ANIME_GENRE_MAP[title]) {
      expertise[ANIME_GENRE_MAP[title]] += 0.5; // Small boost per vote
    }
  });

  // Normalize (ensuring min and max)
  const max = Math.max(...Object.values(expertise), 10);
  return CATEGORIES.map(cat => ({
    label: cat,
    value: (expertise[cat] / max) * 100
  }));
}

export function getPrestigeTitle(level, xp, votesCount) {
  if (level >= 30) return "Légende Vivante";
  if (level >= 25) return "Hokage de l'Arène";
  if (level >= 20) return "Pilier Suprême";
  if (level >= 15) return "Chasseur de S-Rank";
  if (level >= 10) return "Otaku d'Elite";
  if (level >= 5) return "Vagabond des Mondes";
  if (votesCount > 100) return "Arbitre de l'Arène";
  return "Apprenti Otaku";
}
