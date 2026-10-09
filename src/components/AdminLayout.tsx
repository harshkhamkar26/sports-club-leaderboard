import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { signOut } from 'next-auth/react';
import CinematicBackground from '@/components/cinema/CinematicBackground';

export default function AdminLayout({ children, title = "Sports Operations Center" }: { children: React.ReactNode, title?: string }) {
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  React.useEffect(() => {
    const handleClose = () => setMobileOpen(false);
    router.events.on('routeChangeStart', handleClose);
    return () => {
      router.events.off('routeChangeStart', handleClose);
    };
  }, [router]);

  const NAV = [
    { href: '/admin/dashboard', icon: 'analytics', label: 'Command Center' },
    { href: '/admin/students', icon: 'group', label: 'Athletes' },
    { href: '/admin/events', icon: 'event', label: 'Events' },
    { href: '/admin/broadcasts', icon: 'live_tv', label: 'Broadcasts' },
    { href: '/admin/results', icon: 'emoji_events', label: 'Results' },
    { href: '/admin/rules', icon: 'rule', label: 'Point Rules' },
    { href: '/admin/audit', icon: 'history', label: 'Audit Logs' },
    { href: '/admin/roles', icon: 'admin_panel_settings', label: 'Access Control' },
  ];

  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <div className="flex h-screen overflow-hidden bg-[#060606] text-white font-sans antialiased">
        <CinematicBackground tone="ops" />
        
        {/* SIDEBAR */}
        <nav className="relative z-20 hidden md:flex flex-col h-full w-72 bg-[#0a0a0a]/80 backdrop-blur-xl border-r border-white/5 shrink-0">
          <div className="p-8">
            <Link href="/" className="flex items-center gap-4 mb-2">
              <img src="/images/sports-club-logo.png" alt="UAI Sports Club" className="h-10 w-auto object-contain opacity-80" />
              <div className="flex flex-col">
                <span className="font-sans text-[9px] font-bold uppercase tracking-[0.3em] text-[#D4AF37]">Universal AI</span>
                <span className="font-display text-lg font-black uppercase text-white tracking-wide">Sports Club</span>
              </div>
            </Link>
          </div>
          
          <div className="px-6 pb-6 border-b border-white/5">
            <h2 className="font-sans text-xs font-semibold uppercase tracking-[0.3em] text-white/40 mb-1">
              Operations Center
            </h2>
            <div className="flex items-center gap-2 mt-2">
               <span className="flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
               </span>
               <span className="font-sans text-[10px] uppercase tracking-widest text-emerald-500 font-bold">System Online</span>
            </div>
          </div>
          
          <div className="flex flex-col flex-1 overflow-y-auto px-4 py-6 gap-2 hide-scrollbar">
            {NAV.map(l => {
              const active = router.pathname.startsWith(l.href);
              return (
                <Link 
                  key={l.href} 
                  href={l.href} 
                  className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 ${
                    active 
                      ? 'bg-gradient-to-r from-[#D4AF37]/10 to-transparent border-l-2 border-[#D4AF37] text-white' 
                      : 'border-l-2 border-transparent text-white/50 hover:bg-white/5 hover:text-white hover:border-white/20'
                  }`}
                >
                  <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: active ? "'FILL' 1" : "'FILL' 0" }}>
                    {l.icon}
                  </span>
                  <span className="font-sans text-xs font-bold uppercase tracking-widest">{l.label}</span>
                </Link>
              );
            })}
          </div>
          
          <div className="p-4 border-t border-white/5 bg-[#0a0a0a]">
            <button 
              onClick={() => signOut({ callbackUrl: '/admin/login' })} 
              className="flex items-center justify-between w-full px-4 py-3 text-[#ef4444]/70 hover:bg-[#ef4444]/10 hover:text-[#ef4444] rounded-xl transition-all"
            >
              <span className="font-sans text-xs font-bold uppercase tracking-widest">Terminate Session</span>
              <span className="material-symbols-outlined text-sm">power_settings_new</span>
            </button>
          </div>
        </nav>

        {/* MOBILE HEADER */}
        <nav className="md:hidden relative z-30 flex items-center justify-between px-4 py-3 bg-[#0a0a0a]/95 backdrop-blur-md border-b border-white/10 fixed w-full top-0">
          <Link href="/admin/dashboard" className="flex items-center gap-3">
             <img src="/images/sports-club-logo.png" alt="UAI Sports Club" className="h-8 w-auto object-contain opacity-80" />
             <h1 className="font-sans text-[10px] font-bold uppercase tracking-[0.2em] text-white">Operations Center</h1>
          </Link>
          <button 
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="flex h-11 w-11 items-center justify-center rounded-xl text-white/70 hover:bg-white/5 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50"
            aria-label={mobileOpen ? "Close admin menu" : "Open admin menu"}
            aria-expanded={mobileOpen}
          >
            <span className="material-symbols-outlined text-2xl">
              {mobileOpen ? 'close' : 'menu'}
            </span>
          </button>
        </nav>

        {/* MOBILE DRAWER */}
        {mobileOpen && (
          <div className="md:hidden fixed inset-x-0 top-14 bottom-0 z-20 bg-[#0a0a0a]/98 backdrop-blur-2xl flex flex-col justify-between p-5 overflow-y-auto border-b border-white/10">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 mb-3 pb-3 border-b border-white/10">
                 <span className="flex h-2 w-2 relative">
                    <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                 </span>
                 <span className="font-sans text-[10px] uppercase tracking-widest text-emerald-500 font-bold">System Online</span>
              </div>
              {NAV.map(l => {
                const active = router.pathname.startsWith(l.href);
                return (
                  <Link 
                    key={l.href} 
                    href={l.href} 
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-colors ${
                      active 
                        ? 'bg-gradient-to-r from-[#D4AF37]/15 to-transparent border-l-2 border-[#D4AF37] text-white font-bold' 
                        : 'text-white/60 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      {l.icon}
                    </span>
                    <span className="font-sans text-xs font-bold uppercase tracking-widest">{l.label}</span>
                  </Link>
                );
              })}
            </div>
            <div className="pt-4 border-t border-white/10 mt-6">
              <button 
                onClick={() => signOut({ callbackUrl: '/admin/login' })} 
                className="flex items-center justify-between w-full px-4 py-3 text-[#ef4444] bg-[#ef4444]/10 rounded-xl transition-all font-sans text-xs font-bold uppercase tracking-widest"
              >
                <span>Terminate Session</span>
                <span className="material-symbols-outlined text-sm">power_settings_new</span>
              </button>
            </div>
          </div>
        )}

        {/* CONTENT */}
        <main className="relative z-10 flex-1 flex flex-col h-full overflow-y-auto bg-transparent pt-[64px] md:pt-0">
          <div className="flex-1 w-full max-w-[1600px] mx-auto p-6 md:p-12">
            {children}
          </div>
        </main>
      </div>
    </>
  );
}
