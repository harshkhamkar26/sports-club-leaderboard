import Head from 'next/head';
import Layout from '@/components/Layout';
import SpotyPage from '@/components/spoty/SpotyPage';
import { getMaleRankings, getFemaleRankings } from '@/lib/rankings';

export async function getStaticProps() {
  try {
    const maleRankings = await getMaleRankings();
    const femaleRankings = await getFemaleRankings();
    
    const topAthlete = maleRankings[0] || null;
    const secondAthlete = femaleRankings[0] || null;
    
    return {
      props: JSON.parse(JSON.stringify({ topAthlete, secondAthlete })),
      revalidate: 60,
    };
  } catch (error) {
    console.error("Failed to fetch rankings for SPOTY:", error);
    return {
      props: { topAthlete: null, secondAthlete: null },
      revalidate: 60,
    };
  }
}

/**
 * SPOTY OS — Cinematic Award Experience
 *
 * The ranking → winner mapping below is demonstration logic (rank #1 →
 * sportsman, rank #2 → sportswoman). When the database later provides a
 * gender/category column on Student, resolve categories per-athlete in
 * `src/components/spoty/data.ts` instead. (See docs/FUTURE-GENDER-SUPPORT.md)
 */
export default function SportsPersonOfTheYear({
  topAthlete,
  secondAthlete,
}: {
  topAthlete: any;
  secondAthlete: any;
}) {
  return (
    <Layout title="Sports Person of the Year 2026–2027 — UAi">
      <Head>
        <meta name="theme-color" content="#0a0a0a" />
        <meta
          name="description"
          content="Universal AI University Sports Person of the Year — The Moment of Greatness. A cinematic digital award ceremony celebrating the 2026–2027 champions."
        />
        <meta property="og:title" content="SPOTY 2026–2027 — Universal AI University" />
        <meta property="og:type" content="website" />
      </Head>
      <SpotyPage topAthlete={topAthlete} secondAthlete={secondAthlete} />
    </Layout>
  );
}
