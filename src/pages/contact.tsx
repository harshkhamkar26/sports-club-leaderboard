import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import CinematicBackground from '@/components/cinema/CinematicBackground';
import Reveal from '@/components/cinema/Reveal';

export default function Contact() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState<{name?: string, email?: string, message?: string}>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: any = {};
    if (!name.trim()) newErrors.name = 'Name is required';
    if (!email.trim() || !/^\S+@\S+\.\S+$/.test(email)) newErrors.email = 'Valid email is required';
    if (!message.trim()) newErrors.message = 'Message is required';
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    // Success - redirect to thank you page
    router.push('/thank-you');
  };

  return (
    <Layout title="Contact Us | Universal AI University Sports">
      <CinematicBackground tone="ops" />
      <div className="relative z-10 w-full min-h-screen pt-28 sm:pt-32 pb-20 sm:pb-24 px-4 sm:px-5">
        <div className="max-w-2xl mx-auto bg-[#111]/80 backdrop-blur-md p-5 sm:p-8 md:p-12 rounded-2xl sm:rounded-3xl border border-white/10">
          <Reveal>
            <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-black uppercase text-white mb-2">Get in Touch</h1>
            <p className="font-sans text-white/50 mb-8">Have questions about the leaderboard or an upcoming event?</p>
            
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              <div>
                <label className="block font-sans text-sm uppercase tracking-widest text-white/50 mb-2">Full Name</label>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => {setName(e.target.value); setErrors({...errors, name: undefined});}}
                  className={`w-full bg-black/50 border ${errors.name ? 'border-red-500' : 'border-white/20'} rounded-lg p-4 text-white focus:outline-none focus:border-[#D4AF37] transition-colors`}
                  placeholder="Enter your name"
                />
                {errors.name && <p className="text-red-500 text-xs mt-2">{errors.name}</p>}
              </div>

              <div>
                <label className="block font-sans text-sm uppercase tracking-widest text-white/50 mb-2">Email Address</label>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => {setEmail(e.target.value); setErrors({...errors, email: undefined});}}
                  className={`w-full bg-black/50 border ${errors.email ? 'border-red-500' : 'border-white/20'} rounded-lg p-4 text-white focus:outline-none focus:border-[#D4AF37] transition-colors`}
                  placeholder="Enter your email"
                />
                {errors.email && <p className="text-red-500 text-xs mt-2">{errors.email}</p>}
              </div>

              <div>
                <label className="block font-sans text-sm uppercase tracking-widest text-white/50 mb-2">Message</label>
                <textarea 
                  value={message}
                  onChange={(e) => {setMessage(e.target.value); setErrors({...errors, message: undefined});}}
                  rows={4}
                  className={`w-full bg-black/50 border ${errors.message ? 'border-red-500' : 'border-white/20'} rounded-lg p-4 text-white focus:outline-none focus:border-[#D4AF37] transition-colors`}
                  placeholder="How can we help?"
                ></textarea>
                {errors.message && <p className="text-red-500 text-xs mt-2">{errors.message}</p>}
              </div>

              <button 
                type="submit"
                className="w-full bg-[#D4AF37] text-black font-bold uppercase tracking-widest py-4 rounded-lg hover:bg-white transition-colors mt-4"
              >
                Send Message
              </button>
            </form>
          </Reveal>
        </div>
      </div>
    </Layout>
  );
}
