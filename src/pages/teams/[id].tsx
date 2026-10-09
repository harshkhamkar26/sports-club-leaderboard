import React from 'react';
import Head from 'next/head';
import Layout from '../../components/Layout';
import { useRouter } from 'next/router';
import { getRankings } from '@/lib/rankings';
import Avatar from '@/components/Avatar';
import { motion } from 'framer-motion';
import AnimatedCounter from '@/components/AnimatedCounter';
import Link from 'next/link';

export async function getServerSideProps(context: any) {
  const teamId = context.params?.id as string;
  // Fetch all students to mock team roster
  const allRankings = await getRankings({});
  
  // Since we don't have a real Team model, let's just use the first 5 students as a mock team roster.
  const teamRoster = allRankings.slice(0, 5);
  const teamPoints = teamRoster.reduce((sum, s) => sum + s.totalPoints, 0);

  return { 
    props: { 
      teamId,
      teamRoster,
      teamPoints
    } 
  };
}

export default function TeamDetail({ teamId, teamRoster, teamPoints }: { teamId: string, teamRoster: any[], teamPoints: number }) {
  const teamName = teamId.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

  return (
    <Layout title={`${teamName} - Team Details | Universal AI University`}>
      <div className="flex flex-col flex-grow w-full max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-12">
        {/* Header */}
        <section className="relative w-full min-h-[260px] h-auto md:h-[300px] flex items-end py-6 sm:py-8 md:pb-12 md:pt-0 mb-8 sm:mb-12 bg-surface-container rounded-xl overflow-hidden border border-outline-variant/30">
          <div className="absolute inset-0 bg-gradient-to-t from-[#162A45] to-transparent z-10"></div>
          <div className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-luminosity" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1579952363873-27f3bade9f55?q=80&w=800&auto=format&fit=crop')" }}></div>
          
          <div className="relative z-20 w-full px-4 sm:px-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <div className="flex items-center gap-4 sm:gap-6 min-w-0">
              <div className="w-16 h-16 sm:w-24 sm:h-24 bg-surface-container-high rounded-full border-4 border-primary flex items-center justify-center shadow-lg shrink-0">
                <span className="material-symbols-outlined text-2xl sm:text-4xl text-primary">groups</span>
              </div>
              <div className="min-w-0">
                <h1 className="font-headline-xl text-2xl sm:text-3xl md:text-headline-xl text-on-surface text-shadow-glow mb-1 truncate">{teamName}</h1>
                <p className="font-body-lg text-sm sm:text-base text-primary">Varsity Squad</p>
              </div>
            </div>
            
            <div className="flex gap-3 sm:gap-4 w-full sm:w-auto">
              <div className="flex-1 sm:flex-none bg-surface-container-lowest/80 backdrop-blur-md rounded-lg p-3 sm:p-4 border border-outline-variant/30 min-w-0 sm:min-w-[120px] text-center">
                <div className="font-headline-lg text-xl sm:text-2xl text-primary"><AnimatedCounter value={teamPoints} /></div>
                <div className="font-label-caps text-on-surface-variant uppercase text-[10px] sm:text-xs mt-1">Total Points</div>
              </div>
              <div className="flex-1 sm:flex-none bg-surface-container-lowest/80 backdrop-blur-md rounded-lg p-3 sm:p-4 border border-outline-variant/30 min-w-0 sm:min-w-[120px] text-center">
                <div className="font-headline-lg text-xl sm:text-2xl text-on-surface">{teamRoster.length}</div>
                <div className="font-label-caps text-on-surface-variant uppercase text-[10px] sm:text-xs mt-1">Athletes</div>
              </div>
            </div>
          </div>
        </section>

        {/* Roster & Breakdown */}
        <section className="grid grid-cols-1 gap-12">
          <div>
            <h2 className="font-headline-lg text-on-surface mb-6 border-b border-outline-variant/20 pb-4">Team Roster & Point Breakdown</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {teamRoster.map((athlete, idx) => (
                <motion.div 
                  key={athlete.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: idx * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Link href={`/athlete/${athlete.id}`} className="bg-[#162A45] rounded-xl border border-outline-variant/30 p-5 flex items-center gap-4 hover:border-primary/50 hover:shadow-[0_4px_20px_rgba(100,255,218,0.1)] transition-all cursor-pointer group">
                    <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-outline-variant/30 group-hover:border-primary transition-colors">
                      <Avatar photoUrl={athlete.photoUrl} name={athlete.name} className="w-full h-full object-cover text-xl" />
                    </div>
                    <div className="flex-grow">
                      <h3 className="font-headline-md text-on-surface group-hover:text-primary transition-colors">{athlete.name}</h3>
                      <p className="font-body-md text-on-surface-variant text-sm">{athlete.className}</p>
                    </div>
                    <div className="text-right">
                      <div className="font-data-tabular text-primary font-bold text-xl">{athlete.totalPoints}</div>
                      <div className="font-label-caps text-on-surface-variant text-[10px] uppercase">PTS</div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}
