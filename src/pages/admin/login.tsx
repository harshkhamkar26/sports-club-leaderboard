import React, { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";
import Head from "next/head";
import Link from "next/link";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (result?.error) {
      setError("Invalid email or password");
    } else {
      router.push("/admin/dashboard");
    }
  };

  return (
    <>
      <Head>
        <title>Admin Sign In | Universal AI University</title>
      </Head>
      
      <main className="flex flex-col lg:flex-row w-full min-h-screen bg-[#0F1219] font-body-md text-on-surface antialiased overflow-y-auto selection:bg-primary/30">
        {/* Left Side: Brand Panel */}
        <div className="hidden lg:flex w-[55%] relative flex-col justify-between p-8 border-r border-white/5 bg-[#0F1219]">
          {/* Subtle Grid Background */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
          
          {/* Top Badge */}
          <div className="relative z-10">
            <div className="inline-flex items-center gap-4 bg-white/5 border border-white/10 rounded-2xl p-2 pr-6 backdrop-blur-md">
              <div className="bg-[#0F1219] rounded-xl p-2 border border-white/5">
                <img src="/images/uaiu-logo.png" alt="UAI" className="w-8 h-8 object-contain" />
              </div>
              <div className="flex flex-col">
                <span className="font-headline-md text-sm font-bold tracking-widest text-white uppercase">Universal AI University</span>
                <span className="font-label-caps text-xs text-[#FFC107] font-medium tracking-wider">Sports Competition OS</span>
              </div>
            </div>
          </div>

          {/* Center Content */}
          <div className="relative z-10 flex flex-col items-center text-center -mt-20">
            <div className="bg-[#0F1219] p-8 rounded-[2rem] shadow-2xl border border-white/5 mb-8">
              <img src="/images/uaiu-logo.png" alt="Universal AI University" className="w-24 h-24 object-contain drop-shadow-xl" />
            </div>
            <h1 className="font-headline-xl text-5xl font-extrabold text-white tracking-tight mb-4 drop-shadow-sm">
              Universal AI University
            </h1>
            <div className="flex items-center gap-4 mb-10 text-white/40">
              <div className="h-px w-12 bg-white/20"></div>
              <span className="font-label-caps tracking-[0.2em] text-sm font-semibold">THE FUTURE IS HERE</span>
              <div className="h-px w-12 bg-white/20"></div>
            </div>
            <button className="bg-[#FFC107] text-[#0F1219] px-12 py-4 rounded-full font-headline-md text-lg font-black tracking-widest uppercase hover:bg-[#FFD54F] hover:scale-105 active:scale-95 transition-all shadow-[0_0_40px_rgba(255,193,7,0.2)]">
              Sports Club
            </button>
          </div>

          {/* Bottom Footer */}
          <div className="relative z-10 flex justify-between items-center text-white/40 text-xs font-label-caps tracking-wider border-t border-white/5 pt-6">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-sm text-[#FFC107]">security</span>
              <span>Protected Portal Session</span>
            </div>
            <span>© 2026 Universal AI University</span>
          </div>
        </div>

        {/* Right Side: Login Form */}
        <div className="w-full lg:w-[45%] flex flex-col items-center justify-center p-5 sm:p-8 md:p-12 bg-[#18191B] relative shadow-[-20px_0_40px_rgba(0,0,0,0.5)] my-auto min-h-screen lg:min-h-0">
          <div className="w-full max-w-[400px]">
            {/* Mobile Brand Header */}
            <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
              <img src="/images/uaiu-logo.png" alt="UAI" className="w-8 h-8 object-contain" />
              <div className="flex flex-col text-left">
                <span className="text-xs font-bold tracking-widest text-white uppercase">Universal AI University</span>
                <span className="text-[10px] text-[#FFC107] font-semibold tracking-wider">Admin Portal</span>
              </div>
            </div>
            
            {/* Form Header */}
            <div className="flex flex-col items-center text-center mb-8 sm:mb-10">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full border border-white/10 flex items-center justify-center mb-4 sm:mb-6 bg-white/[0.02]">
                <span className="material-symbols-outlined text-blue-400 text-2xl sm:text-3xl">lock</span>
              </div>
              <h2 className="font-headline-lg text-3xl sm:text-4xl font-extrabold text-white mb-2 sm:mb-3">Sign In</h2>
              <p className="text-white/50 text-xs sm:text-sm font-body-md">Enter your authorized admin credentials to continue</p>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-center">
                <p className="text-red-400 text-sm font-medium">{error}</p>
              </div>
            )}

            {/* Form */}
            <form className="space-y-5" onSubmit={handleLogin}>
              
              {/* Email Field */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-white/80" htmlFor="email">Email</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <span className="material-symbols-outlined text-slate-400 text-lg">mail</span>
                  </div>
                  <input 
                    className="block w-full pl-11 pr-4 py-3.5 bg-[#EDF2F7] border-0 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium transition-all" 
                    id="email" 
                    name="email" 
                    placeholder="admin@uaiu.edu" 
                    required 
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="block text-xs font-bold text-white/80" htmlFor="password">Password</label>
                  <a className="text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors" href="#">Forgot password?</a>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <span className="material-symbols-outlined text-slate-400 text-lg">lock</span>
                  </div>
                  <input 
                    className="block w-full pl-11 pr-4 py-3.5 bg-[#EDF2F7] border-0 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium transition-all" 
                    id="password" 
                    name="password" 
                    placeholder="••••••••" 
                    required 
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>

              {/* Remember Me */}
              <div className="flex items-center pt-2">
                <input 
                  id="remember" 
                  type="checkbox" 
                  className="w-4 h-4 rounded bg-white/10 border-white/20 text-blue-500 focus:ring-blue-500/50 focus:ring-offset-0 cursor-pointer"
                />
                <label htmlFor="remember" className="ml-3 text-sm font-medium text-white/70 cursor-pointer">
                  Remember me
                </label>
              </div>

              {/* Action Button */}
              <div className="pt-6">
                <button 
                  className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl font-bold text-white bg-[#3B82F6] hover:bg-[#2563EB] focus:outline-none focus:ring-4 focus:ring-blue-500/30 transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0 active:scale-95 shadow-lg shadow-blue-500/25" 
                  type="submit"
                >
                  <span className="material-symbols-outlined text-sm font-bold">arrow_forward</span>
                  Sign In
                </button>
              </div>
            </form>

            {/* Footer Links */}
            <div className="mt-12 pt-8 border-t border-white/5 flex flex-col items-center gap-4">
              <Link href="/" className="flex items-center gap-2 text-sm font-medium text-blue-400 hover:text-blue-300 transition-colors">
                <span className="material-symbols-outlined text-sm">arrow_back</span>
                Back to Public Leaderboard
              </Link>
              <p className="text-xs font-medium text-white/30">
                Universal AI University Sports Portal
              </p>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
