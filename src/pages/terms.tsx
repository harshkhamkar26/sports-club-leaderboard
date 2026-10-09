import React from 'react';
import Layout from '@/components/Layout';
import CinematicBackground from '@/components/cinema/CinematicBackground';

export default function TermsOfService() {
  return (
    <Layout title="Terms of Service | Universal AI University Sports">
      <CinematicBackground tone="ops" />
      <div className="relative z-10 w-full min-h-screen pt-28 sm:pt-32 pb-20 sm:pb-24 px-4 sm:px-5">
        <div className="max-w-3xl mx-auto bg-[#111]/80 backdrop-blur-md p-5 sm:p-8 md:p-12 rounded-2xl sm:rounded-3xl border border-white/10 prose prose-invert prose-p:text-white/70 prose-headings:text-white">
          <h1 className="font-display font-black uppercase tracking-widest text-[#D4AF37]">Terms of Service</h1>
          <p>Last updated: August 2026</p>
          
          <p>Welcome to the Universal AI University Sports Club platform (SPOTY). By accessing our website, you agree to be bound by these Terms of Service.</p>
          
          <h2>1. Acceptance of Terms</h2>
          <p>By accessing or using the platform, you agree to be bound by these Terms. If you disagree with any part of the terms, you may not access the service.</p>

          <h2>2. Use License</h2>
          <p>Permission is granted to temporarily view the materials on the website for personal, non-commercial transitory viewing only. You may not modify or copy the materials.</p>

          <h2>3. Disclaimer</h2>
          <p>The materials on the platform are provided on an 'as is' basis. We make no warranties, expressed or implied, and hereby disclaim all other warranties including without limitation, implied warranties or conditions of merchantability.</p>

          <h2>4. Accuracy of Leaderboards</h2>
          <p>While we strive to keep leaderboard and points data as accurate as possible, the official records are maintained by the Sports Committee. Disputes must be raised through official channels.</p>

          <h2>5. Modifications</h2>
          <p>We may revise these Terms of Service for our website at any time without notice. By using this website you are agreeing to be bound by the then current version of these terms.</p>
        </div>
      </div>
    </Layout>
  );
}
