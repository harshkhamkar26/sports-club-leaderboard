/**
 * SPOTY data structures + placeholder photography configuration.
 *
 * Real university athlete photos can be supplied later via the `photoUrl`
 * field on each student row (already supported by Prisma `Student.photoUrl`),
 * or by editing the `PLACEHOLDER_IMAGES` map below. Image URLs are kept here —
 * never scattered in JSX.
 */

export interface AthleteProfile {
  name: string;
  className: string;
  sport: string;
  events: number;
  podiums: number;
  golds: number;
  silver: number;
  bronze: number;
  totalPoints: number;
  championships: number;
  photoUrl: string;
}

export type Category = 'sportsman' | 'sportswoman';

/** Single source of truth for placeholder athlete photography. */
export const PLACEHOLDER_IMAGES: Record<Category, string> = {
  sportsman:
    'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?q=80&w=1200&auto=format&fit=crop',
  sportswoman:
    'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?q=80&w=1200&auto=format&fit=crop',
};

/**
 * Maps a ranked student row from the existing rankings layer into a
 * category-aware profile.
 *
 * NOTE: today rank #1 → sportsman and rank #2 → sportswoman is only
 * demonstration logic. When the DB later provides a `gender`/`category`
 * column on `Student`, resolve the category per-athlete here instead of
 * relying on rank order. (See docs/FUTURE-GENDER-SUPPORT.md)
 */
export function buildAthleteProfile(
  category: Category,
  athlete: any
): AthleteProfile {
  const medals = athlete?.medals || { gold: 0, silver: 0, bronze: 0 };
  const events = athlete?.eventsCount ?? 0;
  const podiums = medals.gold + medals.silver + medals.bronze;
  const sport =
    category === 'sportsman' ? "Tennis Men's Singles" : 'Athletics 100m Sprint';

  return {
    name: athlete?.name || 'Athlete Name',
    className: athlete?.className || 'Universal AI University',
    sport,
    events,
    podiums,
    golds: medals.gold,
    silver: medals.silver,
    bronze: medals.bronze,
    totalPoints: athlete?.totalPoints ?? 0,
    championships: 0,
    photoUrl: athlete?.photoUrl || PLACEHOLDER_IMAGES[category],
  };
}

export interface ChampionMoment {
  label: string;
  meta: string;
  milestone?: boolean;
}

/**
 * Builds the "Championship Moments" season recap for a champion.
 *
 * The current rankings layer (`src/lib/rankings.ts`) exposes aggregates
 * (eventsCount, totalPoints, medals) but not per-event performance detail,
 * so the showcase flow is derived from those real aggregates rather than
 * invented numbers. Per-event names/positions should replace the showcase
 * labels once the data layer surfaces them.
 */
export function buildChampionshipMoments(athlete: any): ChampionMoment[] {
  const events = athlete?.eventsCount ?? 0;
  const medals = athlete?.medals || { gold: 0, silver: 0, bronze: 0 };

  return [
    { label: 'Football', meta: 'Season opener — campaign begins' },
    {
      label: 'Basketball',
      meta: `${medals.gold + medals.silver} podium finishes this season`,
    },
    { label: 'Athletics', meta: `${events} events journeyed` },
    {
      label: 'Championship',
      meta: '2026 — 2027 crowned champion',
      milestone: true,
    },
  ];
}

