// XP por raridade
export const XP_BY_RARITY = {
  common: 10,
  rare: 25,
  legendary: 60,
};

// XP necessário por nível
export function getXpForNextLevel(level) {
  return Math.floor(100 * Math.pow(level, 1.4));
}

// Aplica XP e sobe níveis
export function applyXpProgress(gamification, earnedXp) {
  let { level, xp, totalXp } = gamification;

  xp += earnedXp;
  totalXp += earnedXp;

  let xpForNext = getXpForNextLevel(level);

  while (xp >= xpForNext) {
    xp -= xpForNext;
    level += 1;
    xpForNext = getXpForNextLevel(level);
  }

  return { level, xp, totalXp };
}
