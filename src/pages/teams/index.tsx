import React from 'react';
import Head from 'next/head';
import Layout from '../../components/Layout';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function TeamsDirectory() {
  const teams = [
    {
      id: 'engineering-eagles',
      name: 'Engineering Eagles',
      sport: 'Robotics',
      icon: 'precision_manufacturing',
      image: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?q=80&w=800&auto=format&fit=crop',
      members: 24,
      points: '12,450',
      rank: 1,
      rankClass: 'bg-rank-gold text-black shadow-[0_0_15px_rgba(212,175,55,0.4)]',
      pointsClass: 'text-rank-gold'
    },
    {
      id: 'data-dragons',
      name: 'Data Dragons',
      sport: 'Data Science',
      icon: 'analytics',
      image: 'https://images.unsplash.com/photo-1526566762798-8fac9c07aa7c?q=80&w=800&auto=format&fit=crop',
      members: 18,
      points: '11,200',
      rank: 2,
      rankClass: 'bg-rank-silver text-black',
      pointsClass: 'text-rank-silver'
    },
    {
      id: 'cyber-spartans',
      name: 'Cyber Spartans',
      sport: 'Esports',
      icon: 'sports_esports',
      image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?q=80&w=800&auto=format&fit=crop',
      members: 12,
      points: '10,850',
      rank: 3,
      rankClass: 'bg-rank-bronze text-black',
      pointsClass: 'text-rank-bronze'
    },
    {
      id: 'business-bulls',
      name: 'Business Bulls',
      sport: 'Finance Tech',
      icon: 'trending_up',
      image: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?q=80&w=800&auto=format&fit=crop',
      members: 32,
      points: '9,420',
      rank: 4,
      rankClass: 'border-2 border-primary text-primary bg-background/50 backdrop-blur-sm',
      pointsClass: 'text-on-background'
    }
  ];

  return (
    <Layout title="Team Directory - Universal AI University">
      <div className="flex-grow w-full max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-12">
        
        {/* Header & Actions */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 sm:mb-12 gap-4 sm:gap-6">
          <div>
            <h1 className="font-headline-xl text-3xl sm:text-headline-xl text-on-background mb-2">Team Directory</h1>
            <p className="font-body-lg text-sm sm:text-body-lg text-on-surface-variant max-w-2xl">Browse the elite athletic and academic teams competing in the Universal AI University intramural ecosystem.</p>
          </div>
          <button className="w-full sm:w-auto bg-[#005ac2] text-white font-headline-md text-sm sm:text-headline-md py-2.5 sm:py-3 px-6 sm:px-8 rounded-lg hover:opacity-90 transition-all active:scale-95 flex items-center justify-center gap-2">
            <span className="material-symbols-outlined text-lg">add</span>
            Create Team
          </button>
        </div>

        {/* Filters */}
        <div className="bg-[#162A45] p-4 sm:p-6 rounded-lg mb-8 sm:mb-12 flex flex-col md:flex-row gap-4 sm:gap-6 items-center border border-[#3B82F6]/20">
          <div className="flex-1 w-full flex items-center bg-surface-container rounded-lg px-3 sm:px-4 border border-outline-variant focus-within:border-primary transition-colors">
            <span className="material-symbols-outlined text-outline mr-2 text-lg">search</span>
            <input 
              className="w-full bg-transparent border-none text-on-background font-body-md text-sm sm:text-body-md py-2.5 sm:py-3 focus:ring-0 placeholder:text-outline" 
              placeholder="Search teams..." 
              type="text"
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full md:w-auto">
            <select className="w-full sm:w-auto bg-surface-container border border-outline-variant text-on-background font-body-md text-sm sm:text-body-md py-2.5 sm:py-3 px-3 sm:px-4 rounded-lg focus:ring-primary focus:border-primary min-w-0 sm:min-w-[150px] appearance-none">
              <option>All Sports</option>
              <option>Esports</option>
              <option>Robotics</option>
              <option>Data Science</option>
            </select>
            <select className="w-full sm:w-auto bg-surface-container border border-outline-variant text-on-background font-body-md text-sm sm:text-body-md py-2.5 sm:py-3 px-3 sm:px-4 rounded-lg focus:ring-primary focus:border-primary min-w-0 sm:min-w-[150px] appearance-none">
              <option>All Schools</option>
              <option>Engineering</option>
              <option>Business</option>
              <option>Arts</option>
            </select>
          </div>
        </div>

        {/* Team Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
          {teams.map((team, idx) => (
            <motion.div
              key={team.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              viewport={{ once: true }}
            >
              <Link href={`/teams/${team.id}`} className="bg-[#162A45] border border-[#3B82F6]/20 rounded-lg overflow-hidden transition-all duration-300 group cursor-pointer flex flex-col hover:scale-[1.02] hover:shadow-[4px_4px_0px_0px_#3B82F6] hover:border-[#3B82F6]">
                <div className="h-48 relative bg-surface-variant overflow-hidden">
                  <img 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    src={team.image} 
                    alt={team.name} 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#162A45] to-transparent"></div>
                  <div className={`absolute top-4 right-4 font-label-caps text-label-caps px-3 py-1 rounded-full ${team.rankClass}`}>
                    Rank #{team.rank}
                  </div>
                </div>
                
                <div className="p-6 flex flex-col flex-grow relative">
                <div className="w-16 h-16 bg-background rounded-full absolute -top-8 border-4 border-[#162A45] flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary text-3xl">{team.icon}</span>
                </div>
                
                <div className="mt-4">
                  <span className="text-primary font-label-caps text-label-caps mb-1 block">{team.sport}</span>
                  <h3 className="font-headline-lg text-headline-lg text-on-background mb-4">{team.name}</h3>
                  
                  <div className="grid grid-cols-2 gap-4 mt-auto">
                    <div className="bg-surface-container p-3 rounded-lg border border-white/5">
                      <span className="font-label-caps text-label-caps text-on-surface-variant block mb-1">Members</span>
                      <span className="font-data-tabular text-data-tabular text-on-background">{team.members}</span>
                    </div>
                    <div className="bg-surface-container p-3 rounded-lg border border-white/5">
                      <span className="font-label-caps text-label-caps text-on-surface-variant block mb-1">Points</span>
                      <span className={`font-data-tabular text-data-tabular ${team.pointsClass}`}>{team.points}</span>
                    </div>
                  </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

      </div>
    </Layout>
  );
}
