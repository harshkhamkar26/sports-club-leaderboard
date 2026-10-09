import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { motion, useReducedMotion } from 'framer-motion';

const NAV_LINKS = [
  { href: '/home', label: 'Home' },
  { href: '/leaderboard', label: 'Leaderboard' },
  { href: '/schools', label: 'Schools' },
  { href: '/broadcast', label: 'Broadcast' },
  { href: '/athletes', label: 'Athletes' },
];

/**
 * SPOTY OS shell — global navigation + "final frame" footer.
 * When on /spoty the header retreats to a minimal hairline so the award
 * ceremony owns the screen.
 */
interface LayoutProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  ogImage?: string;
}

export default function Layout({ 
  children, 
  title = 'Universal AI University Athletics | SPOTY', 
  description = 'The official home of Universal AI University Sports Club. Track live leaderboards, events, and find the true Sportsperson of the Year.',
  ogImage = '/images/og-default.jpg'
}: LayoutProps) {
  const router = useRouter();
  const reducedMotion = useReducedMotion();
  const onSpoty = router.pathname === '/';
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  React.useEffect(() => {
    const handleClose = () => setMobileMenuOpen(false);
    router.events.on('routeChangeStart', handleClose);
    return () => {
      router.events.off('routeChangeStart', handleClose);
    };
  }, [router]);

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="theme-color" content="#0a0a0a" />
        
        {/* Open Graph / Social Tags */}
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={ogImage} />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={ogImage} />

        {/* Favicons */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.webmanifest" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <div className="min-h-screen bg-[#050505] text-white selection:bg-[#D4AF37]/30 selection:text-white">
        {/* Header */}
        <header className="fixed top-0 z-50 w-full transition-all duration-500 bg-[#07152E]/90 backdrop-blur-xl border-b border-[#123D7A]/30 shadow-[0_4px_30px_rgba(7,21,46,0.8)]">
          <div className="absolute inset-x-0 bottom-0 h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37]/35 to-transparent pointer-events-none" />
          <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between px-4 sm:px-6 md:px-10">
            <Link href="/" className="flex items-center gap-3 shrink-0" onClick={() => setMobileMenuOpen(false)}>
              <div className="flex items-center gap-2">
                <img alt="Universal AI University Sports Club" className="h-9 sm:h-10 w-auto object-contain drop-shadow-lg" src="/images/sports-club-logo.png" />
                <motion.span
                  initial={reducedMotion ? undefined : { opacity: 0, letterSpacing: '0.5em' }}
                  animate={{ opacity: 1, letterSpacing: '0.12em' }}
                  transition={{ duration: 1 }}
                  className="hidden font-display text-sm font-semibold uppercase text-[#F7F8FC]/90 xl:block"
                >
                  Sports Club
                </motion.span>
              </div>
            </Link>

            <nav className="hidden items-center gap-6 md:flex" aria-label="Main">
              {NAV_LINKS.map((l) => {
                const active = router.pathname === l.href || (l.href === '/sports' && router.pathname.startsWith('/sports'));
                return (
                  <Link
                    key={l.href}
                    href={l.href}
                    className={`font-sans text-xs font-semibold uppercase tracking-[0.18em] transition-colors ${
                      active ? 'text-[#D4AF37]' : 'text-[#AAB6C8] hover:text-[#F7F8FC]'
                    }`}
                  >
                    {l.label}
                  </Link>
                );
              })}
              <Link href="/" className="font-sans text-xs font-semibold uppercase tracking-[0.18em] text-[#D4AF37] transition-colors hover:text-white">
                Person of the Year
              </Link>
            </nav>

            <div className="flex items-center gap-1 sm:gap-2">
              <Link href="/live" className="hidden items-center gap-2 rounded-full border border-[#E5484D]/40 bg-[#E5484D]/10 px-4 py-2 text-xs font-bold uppercase tracking-widest text-white transition-colors hover:bg-[#E5484D]/20 xl:flex">
                <span className="h-2 w-2 rounded-full bg-[#E5484D]">
                  <motion.span
                    className="block h-2 w-2 rounded-full bg-[#E5484D]"
                    animate={reducedMotion ? undefined : { opacity: [1, 0.2, 1] }}
                    transition={{ duration: 1.6, repeat: Infinity }}
                  />
                </span>
                Live
              </Link>
              <Link href="/search" className="flex h-10 w-10 sm:h-9 sm:w-9 items-center justify-center rounded-full text-white/70 transition-colors hover:bg-white/5 hover:text-white" aria-label="Search">
                <span className="material-symbols-outlined text-lg">search</span>
              </Link>
              <Link href="/admin/login" className="flex h-10 w-10 sm:h-9 sm:w-9 items-center justify-center rounded-full text-white/70 transition-colors hover:bg-white/5 hover:text-white" aria-label="Admin">
                <span className="material-symbols-outlined text-lg">account_circle</span>
              </Link>

              {/* Mobile Menu Toggle Button */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen((prev) => !prev)}
                className="flex h-11 w-11 items-center justify-center rounded-xl text-white/80 hover:bg-white/5 hover:text-white md:hidden transition-colors focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50"
                aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
                aria-expanded={mobileMenuOpen}
              >
                <span className="material-symbols-outlined text-2xl">
                  {mobileMenuOpen ? 'close' : 'menu'}
                </span>
              </button>
            </div>
          </div>

          {/* Mobile Navigation Drawer */}
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="border-b border-[#123D7A]/30 bg-[#07152E]/98 px-5 py-6 backdrop-blur-2xl md:hidden shadow-2xl max-h-[calc(100vh-64px)] overflow-y-auto"
            >
              <nav className="flex flex-col gap-2" aria-label="Mobile Navigation">
                {NAV_LINKS.map((l) => {
                  const active = router.pathname === l.href || (l.href === '/sports' && router.pathname.startsWith('/sports'));
                  return (
                    <Link
                      key={l.href}
                      href={l.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center justify-between rounded-xl px-4 py-3 font-sans text-xs font-bold uppercase tracking-[0.2em] transition-colors ${
                        active ? 'bg-[#D4AF37]/15 text-[#D4AF37]' : 'text-white/70 hover:bg-white/5 hover:text-white'
                      }`}
                    >
                      <span>{l.label}</span>
                      <span className="material-symbols-outlined text-sm opacity-40">chevron_right</span>
                    </Link>
                  );
                })}

                <Link
                  href="/"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between rounded-xl bg-gradient-to-r from-[#D4AF37]/15 to-transparent px-4 py-3 font-sans text-xs font-bold uppercase tracking-[0.2em] text-[#D4AF37] transition-colors hover:from-[#D4AF37]/25 mt-1"
                >
                  <span className="flex items-center gap-2">
                    <span>🏆</span>
                    <span>Person of the Year</span>
                  </span>
                  <span className="material-symbols-outlined text-sm opacity-60">chevron_right</span>
                </Link>

                <Link
                  href="/live"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between rounded-xl border border-[#ef4444]/30 bg-[#ef4444]/10 px-4 py-3 font-sans text-xs font-bold uppercase tracking-[0.2em] text-white transition-colors hover:bg-[#ef4444]/20 mt-1"
                >
                  <span className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-[#ef4444] animate-pulse" />
                    <span>Watch Live Broadcast</span>
                  </span>
                  <span className="text-[10px] uppercase font-bold text-[#ef4444] tracking-widest">LIVE</span>
                </Link>
              </nav>
            </motion.div>
          )}
        </header>

        {/* Content */}
        <main className="min-h-screen">{children}</main>

        {/* Footer The final frame */}
        <footer className="relative z-10 mt-24 overflow-hidden border-t border-white/[0.06] bg-[#050505]">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#D4AF37]/40 to-transparent" />
          <div className="mx-auto grid max-w-[1400px] gap-12 px-5 py-20 md:grid-cols-4 md:px-10">
            <div className="md:col-span-2 flex flex-col justify-between">
              <div>
                <img alt="UAI Sports Club" src="/images/sports-club-logo.png" className="h-16 w-auto object-contain mb-6 drop-shadow-xl opacity-90" />
                <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.4em] text-[#D4AF37]">Universal AI University</p>
                <h2 className="mt-2 font-display text-2xl md:text-3xl font-black uppercase leading-none text-white">Sports Club</h2>
                <p className="mt-4 max-w-sm font-sans text-sm font-light text-white/50 leading-relaxed">
                  The season continues. The legacy remains. Explore the true classification of the best athletes on campus.
                </p>
                
                {/* Contact Address */}
                <div className="mt-8 font-sans text-xs text-white/40 leading-relaxed max-w-xs">
                  <p className="font-bold text-white/70 mb-1">Universal AI University Campus</p>
                  <p>Kushivili, Vadap,</p>
                  <p>Karjat, Maharashtra 410201,</p>
                  <p>India</p>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col gap-4 pt-4">
              <h3 className="font-sans text-xs font-semibold uppercase tracking-[0.3em] text-white/70 mb-2">Platform</h3>
              <Link href="/leaderboard" className="font-sans text-sm text-white/50 hover:text-[#D4AF37] transition-colors">Global Leaderboard</Link>
              <Link href="/athletes" className="font-sans text-sm text-white/50 hover:text-[#D4AF37] transition-colors">Athlete Directory</Link>
              <Link href="/sports" className="font-sans text-sm text-white/50 hover:text-[#D4AF37] transition-colors">Sports Disciplines</Link>
              <Link href="/" className="font-sans text-sm text-white/50 hover:text-[#D4AF37] transition-colors">SPOTY Classification</Link>
              <Link href="/contact" className="font-sans text-sm text-white/50 hover:text-[#D4AF37] transition-colors mt-2">Contact Us</Link>
            </div>

            <div className="flex flex-col items-start md:items-end gap-6 pt-4">
              <h3 className="font-sans text-xs font-semibold uppercase tracking-[0.3em] text-white/70">Connect</h3>
              <a href="https://instagram.com/sportsclub_uai" target="_blank" rel="noopener noreferrer" className="group flex flex-col items-center gap-3">
                <div className="bg-white p-2 rounded-xl shadow-[0_0_15px_rgba(212,175,55,0.15)] group-hover:shadow-[0_0_25px_rgba(212,175,55,0.3)] transition-shadow">
                  <img src="/images/insta-qr.png" alt="Instagram QR" className="w-24 h-24 object-contain rounded-lg" />
                </div>
                <div className="flex items-center gap-2 text-white/60 group-hover:text-white transition-colors">
                  <span className="font-sans text-xs font-semibold tracking-wider">@SPORTSCLUB_UAI</span>
                  <span className="material-symbols-outlined text-sm">open_in_new</span>
                </div>
              </a>
            </div>
          </div>
          <div className="border-t border-white/[0.05] py-6 px-5 flex flex-col md:flex-row justify-between items-center gap-4 bg-black/40">
            <p className="font-sans text-[10px] uppercase tracking-[0.3em] text-white/30">
              © {new Date().getFullYear()} Universal AI University — Sports Club OS
            </p>
            <div className="flex items-center gap-6">
              <Link href="/privacy" className="font-sans text-[10px] uppercase tracking-[0.2em] text-white/30 hover:text-white/70 transition-colors">Privacy Policy</Link>
              <Link href="/terms" className="font-sans text-[10px] uppercase tracking-[0.2em] text-white/30 hover:text-white/70 transition-colors">Terms of Service</Link>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
