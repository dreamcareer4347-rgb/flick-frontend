'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Smartphone, Shield, QrCode, ArrowRight, Zap, Camera, X } from 'lucide-react';

export default function Home() {
  const router = useRouter();
  const [sessionIdInput, setSessionIdInput] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const videoRef = useRef(null);
  const [cameraError, setCameraError] = useState('');

  const handleJoinRemote = (e) => {
    e.preventDefault();
    if (sessionIdInput.trim()) {
      router.push(`/remote/${sessionIdInput.trim()}`);
    }
  };

  // Camera start karne ka function QR scan ke liye
  const startCamera = async () => {
    setIsScanning(true);
    setCameraError('');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error('Camera access error:', err);
      setCameraError('Camera access nahi mil paya. Kripya permission check karein ya Session ID enter karein.');
      setIsScanning(false);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach(track => track.stop());
    }
    setIsScanning(false);
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-between selection:bg-blue-600 selection:text-white">
      {/* Navigation Header */}
      <header className="w-full max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className="w-10 h-10 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-600/30">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-black tracking-tight text-slate-900">Flick</span>
        </div>
        
        <button
          onClick={() => router.push('/presenter/new')}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-2xl shadow-xl shadow-blue-600/20 transition-all flex items-center space-x-2 text-sm"
        >
          <span>Start Presenting</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </header>

      {/* Hero Section */}
      <main className="max-w-4xl mx-auto px-6 py-12 text-center flex-1 flex flex-col items-center justify-center">
        <div className="inline-flex items-center space-x-2 bg-blue-50 border border-blue-200/60 text-blue-700 px-4 py-1.5 rounded-full text-xs font-bold mb-8 shadow-sm">
          <span>100% Client-Side Privacy • Zero Server Upload Latency</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-slate-900 max-w-2xl mb-6 leading-tight">
          Turn your Smartphone into a <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Wireless Presentation Remote</span>
        </h1>

        <p className="text-lg text-slate-600 max-w-xl mb-10 leading-relaxed font-normal">
          Display your slides on your laptop and control them smoothly from your phone browser. Zero app installation, zero latency.
        </p>

        {/* Primary CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full max-w-md justify-center mb-12">
          <button
            onClick={() => router.push('/presenter/new')}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-extrabold px-8 py-4 rounded-2xl shadow-2xl shadow-blue-600/30 transition-all text-base flex items-center justify-center space-x-3 group"
          >
            <span>Launch Presenter Mode (Laptop)</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Mobile User Control Card: Scan QR or Enter Session ID */}
        <div className="w-full max-w-md bg-white border border-blue-100 p-6 rounded-3xl shadow-xl shadow-blue-500/5 text-left">
          <h3 className="text-sm font-black uppercase tracking-wider text-slate-700 mb-2 flex items-center space-x-2">
            <Smartphone className="w-4 h-4 text-blue-600" />
            <span>Join Presentation from Phone</span>
          </h3>
          <p className="text-xs text-slate-500 mb-5">
            Laptop par dikh rahe QR code ko scan karein ya direct Session ID enter karein:
          </p>

          {/* QR Scanner Toggle Button */}
          {!isScanning ? (
            <button
              onClick={startCamera}
              className="w-full mb-4 bg-blue-50 hover:bg-blue-100 text-blue-700 font-extrabold py-3.5 px-4 rounded-2xl border border-blue-200 flex items-center justify-center space-x-2 transition-all shadow-sm"
            >
              <Camera className="w-5 h-5 text-blue-600" />
              <span>Scan QR Code with Camera</span>
            </button>
          ) : (
            <div className="mb-4 relative bg-slate-900 rounded-2xl overflow-hidden p-2 text-center">
              <button
                onClick={stopCamera}
                className="absolute top-3 right-3 z-10 bg-white/80 hover:bg-white text-slate-900 p-1.5 rounded-full shadow"
              >
                <X className="w-4 h-4" />
              </button>
              <video ref={videoRef} autoPlay playsInline className="w-full h-48 object-cover rounded-xl" />
              <p className="text-xs text-white/80 mt-2">Laptop screen par QR code saamne rakhein...</p>
              {cameraError && <p className="text-xs text-rose-400 mt-1">{cameraError}</p>}
            </div>
          )}

          <div className="relative flex py-2 items-center">
            <div className="flex-grow border-t border-slate-200"></div>
            <span className="flex-shrink mx-4 text-xs text-slate-400 uppercase font-bold">Ya phir Session ID dalein</span>
            <div className="flex-grow border-t border-slate-200"></div>
          </div>

          <form onSubmit={handleJoinRemote} className="flex gap-2 mt-3">
            <input
              type="text"
              placeholder="Enter Session ID..."
              value={sessionIdInput}
              onChange={(e) => setSessionIdInput(e.target.value)}
              className="flex-1 bg-slate-50 border border-slate-200 px-4 py-3 rounded-xl text-sm font-medium focus:outline-none focus:border-blue-600 text-slate-900"
            />
            <button
              type="submit"
              className="bg-slate-900 hover:bg-blue-600 text-white font-bold px-5 py-3 rounded-xl text-sm transition-colors"
            >
              Open Remote
            </button>
          </form>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full mt-16 text-left">
          <div className="bg-white border border-blue-100 p-6 rounded-3xl shadow-xl shadow-blue-500/5">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-4">
              <Shield className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 mb-1">100% Private & Local</h3>
            <p className="text-xs text-slate-500 leading-relaxed">Your presentation stays securely inside your browser memory session.</p>
          </div>

          <div className="bg-white border border-blue-100 p-6 rounded-3xl shadow-xl shadow-blue-500/5">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-4">
              <QrCode className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 mb-1">Instant QR Pairing</h3>
            <p className="text-xs text-slate-500 leading-relaxed">Scan the laptop QR code with your phone camera to connect instantly.</p>
          </div>

          <div className="bg-white border border-blue-100 p-6 rounded-3xl shadow-xl shadow-blue-500/5">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-4">
              <Smartphone className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 mb-1">Touch Controller UI</h3>
            <p className="text-xs text-slate-500 leading-relaxed">Large tactile navigation buttons designed specifically for one-handed smartphone use.</p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full text-center py-6 border-t border-slate-100 text-xs text-slate-400">
        ⚡ Flick Wireless Presentation System • Built with Next.js & FastAPI
      </footer>
    </div>
  );
}