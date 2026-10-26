'use client';

import Link from 'next/link';
import { Presentation, Smartphone, Shield, QrCode, Zap, ArrowRight } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-between selection:bg-blue-600 selection:text-white">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-blue-100 px-8 py-4 flex items-center justify-between sticky top-0 z-50 shadow-sm">
        <div className="flex items-center space-x-2">
          <span className="text-2xl font-black text-blue-600">⚡ Flick</span>
        </div>
        <Link 
          href="/present" 
          className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-5 py-2.5 rounded-xl transition-all shadow-lg shadow-blue-600/20 text-sm"
        >
          <span>Start Presenting</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-16 max-w-5xl mx-auto text-center">
        <div className="inline-flex items-center space-x-2 bg-blue-50 border border-blue-200 px-4 py-1.5 rounded-full text-blue-600 text-xs font-bold mb-8 shadow-sm">
          <Zap className="w-3.5 h-3.5" />
          <span>100% Client-Side Privacy • Zero Server Upload Latency</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-slate-900 mb-6 leading-tight">
          Turn your Smartphone into a <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600">
            Wireless Presentation Remote
          </span>
        </h1>

        <p className="text-slate-600 text-base sm:text-lg max-w-2xl mb-10 leading-relaxed font-normal">
          Display your slides on your laptop and control them smoothly from your phone browser. Zero app installation, zero latency.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-md mb-20">
          <Link 
            href="/present" 
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-xl shadow-blue-600/25 transition-all text-center flex items-center justify-center space-x-2"
          >
            <Presentation className="w-5 h-5" />
            <span>Launch Presenter Mode</span>
          </Link>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full text-left">
          <div className="bg-white border border-blue-100 p-6 rounded-3xl shadow-xl shadow-blue-500/5 hover:border-blue-300 transition-all group">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-4 border border-blue-100 group-hover:scale-110 transition-transform">
              <Shield className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">100% Private & Local</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Your presentation stays securely inside your browser memory session.
            </p>
          </div>

          <div className="bg-white border border-blue-100 p-6 rounded-3xl shadow-xl shadow-blue-500/5 hover:border-blue-300 transition-all group">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-4 border border-blue-100 group-hover:scale-110 transition-transform">
              <QrCode className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Instant QR Pairing</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Scan the laptop QR code with your phone camera to connect instantly.
            </p>
          </div>

          <div className="bg-white border border-blue-100 p-6 rounded-3xl shadow-xl shadow-blue-500/5 hover:border-blue-300 transition-all group">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-4 border border-blue-100 group-hover:scale-110 transition-transform">
              <Smartphone className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Touch Controller UI</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Large tactile navigation buttons designed specifically for one-handed smartphone use.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}