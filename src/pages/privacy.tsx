import React from 'react';
import Layout from '@/components/Layout';
import CinematicBackground from '@/components/cinema/CinematicBackground';

export default function PrivacyPolicy() {
  return (
    <Layout title="Privacy Policy | Universal AI University Sports">
      <CinematicBackground tone="ops" />
      <div className="relative z-10 w-full min-h-screen pt-28 sm:pt-32 pb-20 sm:pb-24 px-4 sm:px-5">
        <div className="max-w-3xl mx-auto bg-[#111]/80 backdrop-blur-md p-5 sm:p-8 md:p-12 rounded-2xl sm:rounded-3xl border border-white/10 prose prose-invert prose-p:text-white/70 prose-headings:text-white">
          <h1 className="font-display font-black uppercase tracking-widest text-[#D4AF37]">Privacy Policy</h1>
          <p>Last updated: August 2026</p>
          
          <p>At Universal AI University Sports Club, we are committed to protecting your privacy. This Privacy Policy explains how your personal information is collected, used, and disclosed by the SPOTY platform.</p>
          
          <h2>1. Information We Collect</h2>
          <p>We collect information you provide directly to us, such as when you submit contact forms, register for events, or interact with the platform. This includes names, emails, and student IDs.</p>

          <h2>2. How We Use Your Information</h2>
          <p>We use the information we collect primarily to provide, maintain, protect and improve our current platform and to develop new services, including leaderboards, sports directories, and live event broadcasts.</p>

          <h2>3. Cookies and Tracking</h2>
          <p>We use cookies to enhance your experience. These are standard tracking mechanisms to help us understand how you use the site so we can improve it.</p>

          <h2>4. Data Security</h2>
          <p>We take reasonable measures to help protect information about you from loss, theft, misuse and unauthorized access, disclosure, alteration and destruction.</p>

          <h2>5. Contact Us</h2>
          <p>If you have any questions about this Privacy Policy, please contact us at the address provided in our footer.</p>
        </div>
      </div>
    </Layout>
  );
}
