'use client';

import { useEffect, useState, useRef, Suspense } from 'react';
import { useParams } from 'next/navigation';
import { ChevronLeft, ChevronRight, RotateCcw, Wifi, WifiOff, Smartphone, Zap } from 'lucide-react';

function RemoteContent() {
  const params = useParams();
  const sessionId = params?.sessionId;

  const [wsStatus, setWsStatus] = useState('Connecting...');
  const [currentSlide, setCurrentSlide] = useState(1);
  const wsRef = useRef(null);

  useEffect(() => {
    if (!sessionId) return;

    const host = window.location.hostname;
    const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${wsProtocol}//${host}:8000/api/sessions/${sessionId}/ws?role=remote`;

    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onopen = () => setWsStatus('Connected');
    ws.onclose = () => setWsStatus('Disconnected');
    ws.onerror = () => setWsStatus('Error');

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'SYNC' && data.currentSlide) {
          setCurrentSlide(data.currentSlide);
        }
      } catch (e) {
        console.error('Remote message parse error', e);
      }
    };

    return () => {
      ws.close();
    };
  }, [sessionId]);

  const sendAction = (action) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type: 'NAVIGATE', action }));
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-between p-4 sm:p-6 selection:bg-blue-600 selection:text-white max-w-md mx-auto w-full">
      {/* Top Bar Status */}
      <header className="bg-white border border-blue-100 px-5 py-3.5 rounded-2xl flex items-center justify-between shadow-lg shadow-blue-500/5 mb-6">
        <div className="flex items-center space-x-2.5">
          {wsStatus === 'Connected' ? (
            <span className="flex h-3 w-3 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-600"></span>
            </span>
          ) : (
            <span className="h-3 w-3 rounded-full bg-rose-500 inline-block"></span>
          )}
          <span className="text-xs font-bold text-slate-700 tracking-wide">
            {wsStatus === 'Connected' ? 'Live Sync Connected' : wsStatus}
          </span>
        </div>

        <div className="bg-blue-50 border border-blue-200 text-blue-700 px-3 py-1 rounded-xl text-xs font-black shadow-inner">
          Slide {currentSlide}
        </div>
      </header>

      {/* Main Touch Controller Area */}
      <main className="flex-1 flex flex-col gap-5 justify-center">
        {/* Previous Slide Button */}
        <button
          onClick={() => sendAction('PREV')}
          className="w-full bg-white hover:bg-slate-50 active:scale-[0.98] border border-blue-100 rounded-3xl p-8 flex flex-col items-center justify-center space-y-3 shadow-xl shadow-blue-500/5 transition-all group"
        >
          <div className="w-16 h-16 bg-slate-100 text-slate-700 rounded-2xl flex items-center justify-center group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
            <ChevronLeft className="w-8 h-8" />
          </div>
          <span className="text-base font-black text-slate-800 tracking-wide uppercase">Previous Slide</span>
        </button>

        {/* Next Slide Button (Primary Hero Action) */}
        <button
          onClick={() => sendAction('NEXT')}
          className="w-full bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white rounded-3xl p-10 flex flex-col items-center justify-center space-y-3 shadow-2xl shadow-blue-600/30 transition-all group"
        >
          <div className="w-20 h-20 bg-white/15 text-white rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
            <ChevronRight className="w-10 h-10" />
          </div>
          <span className="text-xl font-black tracking-wider uppercase">Next Slide</span>
        </button>
      </main>

      {/* Bottom Quick Controls & Branding */}
      <footer className="mt-6 flex flex-col gap-4">
        <button
          onClick={() => sendAction('FIRST')}
          className="w-full py-3.5 bg-white hover:bg-slate-50 text-slate-600 font-bold text-sm rounded-2xl border border-slate-200 shadow-sm flex items-center justify-center space-x-2 transition-all"
        >
          <RotateCcw className="w-4 h-4 text-blue-600" />
          <span>Jump to First Slide</span>
        </button>

        <div className="text-center py-2 text-xs text-slate-400 font-mono">
          ⚡ Flick Wireless Remote • Secure Session
        </div>
      </footer>
    </div>
  );
}

export default function RemotePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50 flex items-center justify-center text-slate-600 font-bold">Loading Remote...</div>}>
      <RemoteContent />
    </Suspense>
  );
}