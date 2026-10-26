'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Camera, Smartphone, ArrowRight, X } from 'lucide-react';
import { Html5QrcodeScanner } from 'html5-qrcode';

export default function RemoteLandingPage() {
  const router = useRouter();
  const [inputCode, setInputCode] = useState('');
  const [scanning, setScanning] = useState(false);

  useEffect(() => {
    let scanner = null;
    if (scanning) {
      scanner = new Html5QrcodeScanner(
        'qr-reader',
        { fps: 10, qrbox: { width: 220, height: 220 } },
        false
      );

      scanner.render(
        (decodedText) => {
          scanner.clear().catch(() => {});
          setScanning(false);

          if (decodedText.includes('/remote/')) {
            const parts = decodedText.split('/remote/');
            const extractedId = parts[parts.length - 1];
            router.push(`/remote/${extractedId}`);
          } else {
            router.push(`/remote/${decodedText.trim()}`);
          }
        },
        () => {}
      );
    }

    return () => {
      if (scanner) {
        scanner.clear().catch(() => {});
      }
    };
  }, [scanning, router]);

  const handleManualJoin = (e) => {
    e.preventDefault();
    if (inputCode.trim()) {
      router.push(`/remote/${inputCode.trim().toLowerCase()}`);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col justify-between p-6">
      <header className="flex items-center justify-between border-b border-slate-800 pb-4">
        <span className="text-xl font-black text-blue-500">⚡ Flick Remote</span>
      </header>

      <main className="flex-1 flex flex-col justify-center items-center max-w-sm mx-auto w-full text-center py-8">
        <div className="w-16 h-16 bg-blue-600/20 border border-blue-500/30 text-blue-400 rounded-3xl flex items-center justify-center mb-6">
          <Smartphone className="w-8 h-8" />
        </div>

        <h2 className="text-2xl font-bold mb-2">Connect to Presentation</h2>
        <p className="text-slate-400 text-sm mb-8 leading-relaxed">
          Scan the laptop screen QR code via camera or enter the session code manually.
        </p>

        {scanning ? (
          <div className="w-full bg-slate-900 border border-slate-800 rounded-3xl p-4 mb-6 relative">
            <button 
              onClick={() => setScanning(false)}
              className="absolute top-3 right-3 text-slate-400 hover:text-white bg-slate-800 p-2 rounded-full z-10"
            >
              <X className="w-4 h-4" />
            </button>
            <h3 className="text-sm font-semibold text-white mb-3">Point Camera at Laptop QR Code</h3>
            <div id="qr-reader" className="w-full overflow-hidden rounded-2xl bg-slate-950 border border-slate-800"></div>
          </div>
        ) : (
          <button
            onClick={() => setScanning(true)}
            className="w-full py-4 px-6 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-2xl shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center space-x-3 mb-6"
          >
            <Camera className="w-5 h-5" />
            <span>Scan QR Code via Camera</span>
          </button>
        )}

        <div className="text-xs text-slate-500 uppercase tracking-widest font-bold my-2">OR ENTER SESSION CODE</div>

        <form onSubmit={handleManualJoin} className="w-full flex flex-col space-y-3">
          <input 
            type="text"
            placeholder="e.g. a1b2c3d4"
            value={inputCode}
            onChange={(e) => setInputCode(e.target.value)}
            className="w-full py-4 px-4 bg-slate-900 border border-slate-800 rounded-xl text-center font-mono text-xl text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 uppercase tracking-widest"
            maxLength={8}
          />
          <button
            type="submit"
            disabled={!inputCode.trim()}
            className="w-full py-4 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-white font-bold rounded-xl transition-all flex items-center justify-center space-x-2 border border-slate-700"
          >
            <span>Join Controller</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </main>

      <footer className="text-center text-xs text-slate-600">
        Flick Mobile Remote UI
      </footer>
    </div>
  );
}