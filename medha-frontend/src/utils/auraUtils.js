/**
 * Aura is earned when others download your public notes (+3 per unique download).
 * Tiers are based on auraPoints, not note count.
 */
export function getAuraTier(points = 0) {
  const p = Number(points) || 0;

  // RADIANCE
  if (p >= 2100) return { tier: "RADIANCE", rank: "Beacon", emoji: "🟣" };
  if (p >= 1200) return { tier: "RADIANCE", rank: "Luminary", emoji: "🟣" };
  if (p >= 750) return { tier: "RADIANCE", rank: "Scholar", emoji: "🟣" };
  if (p >= 450) return { tier: "RADIANCE", rank: "Mentor", emoji: "🟣" };

  // GLOW
  if (p >= 300) return { tier: "GLOW", rank: "Anchor", emoji: "🔵" };
  if (p >= 180) return { tier: "GLOW", rank: "Guide", emoji: "🔵" };
  if (p >= 105) return { tier: "GLOW", rank: "Solver", emoji: "🔵" };
  if (p >= 60) return { tier: "GLOW", rank: "Thinker", emoji: "🔵" };

  // SPARK
  if (p >= 30) return { tier: "SPARK", rank: "Builder", emoji: "🌱" };
  if (p >= 15) return { tier: "SPARK", rank: "Initiate", emoji: "🌱" };
  if (p >= 6) return { tier: "SPARK", rank: "Seeker", emoji: "🌱" };
  if (p >= 3) return { tier: "SPARK", rank: "Flicker", emoji: "🌱" };

  return { tier: "SPARK", rank: "New", emoji: "✨" };
}
