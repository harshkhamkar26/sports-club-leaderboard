import React from 'react';
import Link from 'next/link';
import Layout from '../../components/Layout';

export default function SportsDirectory() {
  const sports = [
    {
      id: 'basketball',
      name: 'Basketball',
      icon: 'sports_basketball',
      image: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?q=80&w=800&auto=format&fit=crop',
      athletes: 142,
      events: 12,
      topAthlete: {
        name: 'Marcus Vance',
        image: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?q=80&w=800&auto=format&fit=crop'
      }
    },
    {
      id: 'football',
      name: 'Football',
      icon: 'sports_soccer',
      image: 'https://images.unsplash.com/photo-1519861531473-9200262188bf?q=80&w=800&auto=format&fit=crop',
      athletes: 210,
      events: 18,
      topAthlete: {
        name: 'Elena Rostova',
        image: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?q=80&w=800&auto=format&fit=crop'
      }
    },
    {
      id: 'athletics',
      name: 'Athletics',
      icon: 'sprint',
      image: 'https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?q=80&w=800&auto=format&fit=crop',
      athletes: 85,
      events: 24,
      topAthlete: {
        name: 'David Chen',
        image: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?q=80&w=800&auto=format&fit=crop'
      }
    }
  ];

  return (
    <Layout title="Sports Directory - Universal AI University Athletics">
      <div className="w-full max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-10 sm:py-16 md:py-[80px]">
        {/* Header Section */}
        <header className="mb-10 sm:mb-16 md:mb-[80px]">
          <h1 className="font-headline-xl text-3xl sm:text-4xl md:text-headline-xl text-on-surface mb-base">Sports Directory</h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl">
            Explore the athletic disciplines at Universal AI University. Discover the current standings, top athletes, and upcoming events across all major sports.
          </p>
        </header>

        {/* Sports Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
          {sports.map((sport) => (
            <div key={sport.id} className="bg-[#162A45] rounded-lg border border-outline-variant/20 overflow-hidden flex flex-col sport-card-hover transition-all duration-300 group hover:scale-[1.02] hover:shadow-[4px_4px_0px_0px_#3B82F6] hover:border-[#3B82F6]">
              {/* Sport Imagery Header */}
              <div className="h-48 relative overflow-hidden">
                <div 
                  className="bg-cover bg-center w-full h-full transform group-hover:scale-105 transition-transform duration-500" 
                  style={{ backgroundImage: `url('${sport.image}')` }}
                ></div>
                <div className="absolute inset-0 bg-black/40"></div>
                <div className="absolute top-4 left-4 bg-surface-container-lowest/80 backdrop-blur-sm p-2 rounded-full text-primary border border-primary/30">
                  <span className="material-symbols-outlined block" style={{ fontVariationSettings: "'FILL' 1" }}>{sport.icon}</span>
                </div>
                <h2 className="absolute bottom-4 left-4 font-headline-md text-headline-md text-on-surface">{sport.name}</h2>
              </div>
              
              {/* Stats Area */}
              <div className="p-gutter flex-grow flex flex-col justify-between">
                <div className="flex gap-4 mb-6 border-b border-white/10 pb-4">
                  <div className="flex flex-col">
                    <span className="font-label-caps text-label-caps text-on-surface-variant uppercase">Athletes</span>
                    <span className="font-data-tabular text-data-tabular text-primary">{sport.athletes}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-label-caps text-label-caps text-on-surface-variant uppercase">Events</span>
                    <span className="font-data-tabular text-data-tabular text-primary">{sport.events}</span>
                  </div>
                </div>
                
                {/* Top Athlete Preview */}
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-rank-gold relative">
                    <img className="w-full h-full object-cover" src={sport.topAthlete.image} alt={sport.topAthlete.name} />
                    <div className="absolute bottom-0 right-0 bg-rank-gold w-4 h-4 rounded-full border border-surface flex items-center justify-center">
                      <span className="font-data-tabular text-[10px] font-bold text-black leading-none">1</span>
                    </div>
                  </div>
                  <div>
                    <span className="font-label-caps text-label-caps text-rank-gold block text-xs">Current Top Athlete</span>
                    <span className="font-body-md text-body-md font-semibold text-on-surface">{sport.topAthlete.name}</span>
                  </div>
                </div>
                
                {/* Action */}
                <Link href={`/sports/${sport.id}`} className="w-full bg-transparent border-2 border-[#3B82F6] text-on-surface font-headline-md text-[16px] py-2 rounded-lg hover:bg-[#3B82F6] transition-colors flex items-center justify-center gap-2 group-hover:bg-[#3B82F6]">
                  View Sport Leaderboard
                  <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
