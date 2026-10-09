import React from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Layout from '../../components/Layout';

export default function EventDetail() {
  const router = useRouter();
  const { id } = router.query;

  return (
    <Layout title="Men's Basketball Finals - Event Details">
      <div className="flex-grow w-full max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-10 md:py-20 flex flex-col gap-12 lg:gap-20">
        
        {/* Header Section */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-outline-variant/30 pb-8">
          <div className="flex flex-col gap-4">
            <div className="flex flex-wrap items-center gap-3">
              <span className="px-3 py-1 bg-surface-container-highest rounded-full font-label-caps text-label-caps text-on-surface-variant flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px]">sports_basketball</span> Basketball
              </span>
              <span className="px-3 py-1 bg-surface-container-highest rounded-full font-label-caps text-label-caps text-on-surface-variant flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px]">groups</span> Team Event
              </span>
              <span className="px-3 py-1 bg-success/20 text-success rounded-full font-label-caps text-label-caps border border-success/30">
                COMPLETED
              </span>
            </div>
            <h1 className="font-headline-xl text-2xl sm:text-[36px] md:text-headline-xl text-on-surface max-w-3xl leading-tight">
              Men's Basketball Finals 2024
            </h1>
            <p className="font-body-lg text-sm sm:text-body-lg text-on-surface-variant flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-base sm:text-xl">calendar_month</span> October 24, 2024 • Main University Arena
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full md:w-auto">
            <button className="flex-1 md:flex-none px-4 sm:px-6 py-2.5 sm:py-3 bg-surface-container-highest border-2 border-outline-variant text-on-surface font-headline-md text-sm sm:text-[16px] rounded-lg hover:bg-surface-bright transition-colors">
              Watch Replay
            </button>
            <button className="flex-1 md:flex-none px-4 sm:px-6 py-2.5 sm:py-3 bg-primary text-on-primary font-headline-md text-sm sm:text-[16px] rounded-lg hover:bg-primary-fixed transition-colors flex items-center justify-center gap-2">
              <span className="material-symbols-outlined text-base sm:text-xl">share</span> Share
            </button>
          </div>
        </header>

        {/* Bento Grid Layout for Main Event Data */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
          {/* Hero Winner Card (Span 8) */}
          <div className="lg:col-span-8 rounded-xl overflow-hidden relative min-h-[360px] sm:min-h-[400px] flex flex-col justify-end group border border-outline-variant/30 hover:shadow-[0_4px_0_0_#4d8eff] hover:border-primary/50 transition-all duration-300">
            <img 
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
              alt="Basketball Championship Celebration" 
              src="https://images.unsplash.com/photo-1517649763962-0c623066013b?q=80&w=800&auto=format&fit=crop"
            />
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0A192F] via-[#0A192F]/80 to-transparent"></div>
            
            {/* Content */}
            <div className="relative z-10 p-5 sm:p-8 flex flex-col gap-4">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-rank-gold flex items-center justify-center border-4 border-surface shadow-[0_0_20px_rgba(212,175,55,0.5)] shrink-0">
                  <span className="material-symbols-outlined text-on-tertiary text-2xl sm:text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>trophy</span>
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="font-label-caps text-[10px] sm:text-label-caps text-rank-gold tracking-widest uppercase">2024 Champions</span>
                  <h2 className="font-headline-lg text-2xl sm:text-headline-lg text-on-surface shadow-rank-gold text-shadow-glow truncate">Engineering Eagles</h2>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-3 sm:gap-6 mt-1 sm:mt-2">
                <div className="bg-[#162A45]/40 backdrop-blur-md border border-primary/10 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg">
                  <span className="block font-label-caps text-[10px] sm:text-[12px] text-on-surface-variant">FINAL SCORE</span>
                  <span className="font-data-tabular text-xl sm:text-[24px] font-bold text-on-surface">98 - 92</span>
                </div>
                <div className="bg-[#162A45]/40 backdrop-blur-md border border-primary/10 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg">
                  <span className="block font-label-caps text-[10px] sm:text-[12px] text-on-surface-variant">AWARDED POINTS</span>
                  <span className="font-data-tabular text-xl sm:text-[24px] font-bold text-rank-gold">+500 PTS</span>
                </div>
              </div>
            </div>
          </div>

          {/* Standings Table (Span 4) */}
          <div className="lg:col-span-4 bg-surface-container rounded-xl border border-outline-variant/30 p-6 flex flex-col">
            <h3 className="font-headline-md text-[20px] text-on-surface mb-6 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">leaderboard</span> Podium Results
            </h3>
            
            <div className="flex flex-col gap-4 flex-grow justify-center">
              {/* 1st Place */}
              <div className="flex items-center gap-4 p-3 bg-surface-container-highest rounded-lg border-l-4 border-rank-gold hover:scale-[1.02] transition-transform">
                <div className="w-10 h-10 rounded-full bg-rank-gold text-on-tertiary font-data-tabular text-[16px] font-bold flex items-center justify-center">1</div>
                <div className="flex-grow">
                  <h4 className="font-headline-md text-[16px] text-on-surface m-0">Engineering Eagles</h4>
                  <span className="font-label-caps text-[12px] text-on-surface-variant">GOLD</span>
                </div>
                <div className="text-right font-data-tabular font-bold text-rank-gold">+500</div>
              </div>
              
              {/* 2nd Place */}
              <div className="flex items-center gap-4 p-3 bg-surface-container-highest rounded-lg border-l-4 border-rank-silver hover:scale-[1.02] transition-transform">
                <div className="w-10 h-10 rounded-full bg-rank-silver text-[#1a1a1a] font-data-tabular text-[16px] font-bold flex items-center justify-center">2</div>
                <div className="flex-grow">
                  <h4 className="font-headline-md text-[16px] text-on-surface m-0">Business Bulls</h4>
                  <span className="font-label-caps text-[12px] text-on-surface-variant">SILVER</span>
                </div>
                <div className="text-right font-data-tabular font-bold text-rank-silver">+300</div>
              </div>
              
              {/* 3rd Place */}
              <div className="flex items-center gap-4 p-3 bg-surface-container-highest rounded-lg border-l-4 border-rank-bronze hover:scale-[1.02] transition-transform">
                <div className="w-10 h-10 rounded-full bg-rank-bronze text-[#1a1a1a] font-data-tabular text-[16px] font-bold flex items-center justify-center">3</div>
                <div className="flex-grow">
                  <h4 className="font-headline-md text-[16px] text-on-surface m-0">Arts Falcons</h4>
                  <span className="font-label-caps text-[12px] text-on-surface-variant">BRONZE</span>
                </div>
                <div className="text-right font-data-tabular font-bold text-rank-bronze">+150</div>
              </div>
            </div>
            
            <button className="w-full mt-6 py-2 border border-primary/50 text-primary rounded-lg font-label-caps hover:bg-primary/10 transition-colors">
              FULL STANDINGS
            </button>
          </div>
        </section>

        {/* Secondary Content: Roster & History */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
          {/* Winning Roster */}
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between border-b border-outline-variant/30 pb-4">
              <h3 className="font-headline-md text-[24px] text-on-surface">Championship Roster</h3>
              <span className="font-label-caps text-rank-gold">Engineering Eagles</span>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Player 1 */}
              <div className="bg-[#162A45]/40 backdrop-blur-md border border-primary/10 p-4 rounded-lg flex items-center gap-4 hover:scale-[1.02] transition-transform">
                <div className="w-12 h-12 rounded-full bg-surface-bright overflow-hidden flex-shrink-0">
                  <img className="w-full h-full object-cover" src="https://images.unsplash.com/photo-1546519638-68e109498ffc?q=80&w=800&auto=format&fit=crop" alt="Marcus" />
                </div>
                <div>
                  <h5 className="font-headline-md text-[16px] text-on-surface">Marcus Vance</h5>
                  <div className="flex gap-2 font-data-tabular text-[12px] text-on-surface-variant mt-1">
                    <span className="bg-surface-container-highest px-2 py-0.5 rounded">PG</span>
                    <span>#10</span>
                  </div>
                </div>
              </div>
              
              {/* Player 2 */}
              <div className="bg-[#162A45]/40 backdrop-blur-md border border-primary/10 p-4 rounded-lg flex items-center gap-4 hover:scale-[1.02] transition-transform">
                <div className="w-12 h-12 rounded-full bg-surface-bright overflow-hidden flex-shrink-0">
                  <img className="w-full h-full object-cover" src="https://images.unsplash.com/photo-1519861531473-9200262188bf?q=80&w=800&auto=format&fit=crop" alt="Elijah" />
                </div>
                <div>
                  <h5 className="font-headline-md text-[16px] text-on-surface">Elijah Stone</h5>
                  <div className="flex gap-2 font-data-tabular text-[12px] text-on-surface-variant mt-1">
                    <span className="bg-surface-container-highest px-2 py-0.5 rounded">SG</span>
                    <span>#23</span>
                    <span className="text-rank-gold material-symbols-outlined text-[14px]">star</span>
                  </div>
                </div>
              </div>
              
              {/* Player 3 */}
              <div className="bg-[#162A45]/40 backdrop-blur-md border border-primary/10 p-4 rounded-lg flex items-center gap-4 hover:scale-[1.02] transition-transform">
                <div className="w-12 h-12 rounded-full bg-surface-bright overflow-hidden flex-shrink-0">
                  <span className="material-symbols-outlined w-full h-full flex items-center justify-center text-on-surface-variant text-[24px]">person</span>
                </div>
                <div>
                  <h5 className="font-headline-md text-[16px] text-on-surface">David Chen</h5>
                  <div className="flex gap-2 font-data-tabular text-[12px] text-on-surface-variant mt-1">
                    <span className="bg-surface-container-highest px-2 py-0.5 rounded">SF</span>
                    <span>#8</span>
                  </div>
                </div>
              </div>
              
              {/* View All */}
              <div className="bg-[#162A45]/40 backdrop-blur-md border border-primary/10 p-4 rounded-lg flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform cursor-pointer text-primary">
                <span className="font-label-caps">VIEW FULL SQUAD (12)</span>
                <span className="material-symbols-outlined">arrow_forward</span>
              </div>
            </div>
          </div>

          {/* Event History */}
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between border-b border-outline-variant/30 pb-4">
              <h3 className="font-headline-md text-[24px] text-on-surface">Event History</h3>
              <span className="font-label-caps text-on-surface-variant">Past Winners</span>
            </div>
            
            <div className="flex flex-col gap-0 border border-outline-variant/30 rounded-lg overflow-hidden">
              {[
                { year: '2023', team: 'Science Spartans', score: '88 - 85' },
                { year: '2022', team: 'Engineering Eagles', score: '102 - 94' },
                { year: '2021', team: 'Law Lions', score: '76 - 70' }
              ].map((history) => (
                <div key={history.year} className="flex items-center justify-between p-4 bg-surface-container border-b border-outline-variant/10 hover:bg-surface-container-highest transition-colors">
                  <div className="flex items-center gap-4">
                    <span className="font-data-tabular font-bold text-on-surface w-12">{history.year}</span>
                    <span className="font-headline-md text-[16px] text-on-surface">{history.team}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-data-tabular text-on-surface-variant text-[14px]">{history.score}</span>
                    <span className="material-symbols-outlined text-rank-gold">emoji_events</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

      </div>
    </Layout>
  );
}
