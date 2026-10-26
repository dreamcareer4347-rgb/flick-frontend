'use client';

import { useEffect, useState, useRef, Suspense } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import { QRCodeCanvas } from 'qrcode.react';
import { ChevronLeft, ChevronRight, QrCode, Smartphone, Wifi, WifiOff, Maximize, Minimize, Presentation } from 'lucide-react';

function PresenterContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const sessionId = params?.sessionId;
  const token = searchParams?.get('token') || (typeof window !== 'undefined' ? sessionStorage.getItem(`flick_token_${sessionId}`) : '');
  
  const [currentSlide, setCurrentSlide] = useState(1);
  const [fileUrl, setFileUrl] = useState(null);
  const [connectedRemotes, setConnectedRemotes] = useState(0);
  const [wsStatus, setWsStatus] = useState('Connecting...');
  const [mounted, setMounted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  const wsRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    setMounted(true);
    if (!sessionId) return;
    
    const storedFileUrl = sessionStorage.getItem(`flick_pdf_${sessionId}`);
    if (!storedFileUrl) {
      router.push('/present');
      return;
    }
    setFileUrl(storedFileUrl);

    const host = window.location.hostname;
    const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${wsProtocol}//${host}:8000/ws/presenter/${sessionId}?token=${token}`;

    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onopen = () => setWsStatus('Connected');
    ws.onclose = () => setWsStatus('Disconnected');
    ws.onerror = () => setWsStatus('Error');

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'ERROR') {
          alert(data.message);
          router.push('/present');
          return;
        }
        if (data.type === 'NAVIGATE') {
          if (data.action === 'NEXT') {
            setCurrentSlide((prev) => prev + 1);
          } else if (data.action === 'PREV') {
            setCurrentSlide((prev) => Math.max(prev - 1, 1));
          } else if (data.action === 'FIRST') {
            setCurrentSlide(1);
          }
        } else if (data.type === 'STATUS') {
          setConnectedRemotes(data.remotesCount || 0);
        }
      } catch (e) {
        console.error('WS message parse error', e);
      }
    };

    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);

    return () => {
      ws.close();
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, [sessionId, token, router]);

  useEffect(() => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type: 'SYNC', currentSlide }));
    }
  }, [currentSlide]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen().catch((err) => {
        console.error('Error attempting to enable fullscreen:', err);
      });
    } else {
      document.exitFullscreen();
    }
  };

  const remoteUrl = mounted ? `${window.location.origin}/remote/${sessionId}` : '';

  return (
    <div ref={containerRef} className={`bg-slate-50 text-slate-900 flex flex-col justify-between selection:bg-blue-600 selection:text-white ${isFullscreen ? 'h-screen w-screen overflow-hidden p-0 m-0 bg-black' : 'min-h-screen'}`}>
      {!isFullscreen && (
        <header className="flex items-center justify-between px-6 py-4 border-b border-blue-100 bg-white/80 backdrop-blur-md shadow-sm">
          <div className="flex items-center space-x-3">
            <span className="text-2xl font-black text-blue-600">⚡ Flick Presenter</span>
            <span className="text-xs bg-blue-50 text-blue-700 px-3 py-1 rounded-full border border-blue-200 font-mono">
              Session: {sessionId?.slice(0, 8)}
            </span>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={toggleFullscreen}
              className="flex items-center space-x-2 text-sm text-white bg-blue-600 hover:bg-blue-700 px-4 py-1.5 rounded-xl transition-all shadow-md shadow-blue-600/20 font-bold"
            >
              <Maximize className="w-4 h-4" />
              <span>Full Screen</span>
            </button>

            <div className="flex items-center space-x-2 text-sm text-slate-600 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-sm">
              {wsStatus === 'Connected' ? <Wifi className="w-4 h-4 text-blue-600" /> : <WifiOff className="w-4 h-4 text-rose-500" />}
              <span>{wsStatus}</span>
            </div>

            <div className="flex items-center space-x-2 text-sm text-slate-600 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-sm">
              <Smartphone className="w-4 h-4 text-blue-600" />
              <span>Remotes: <strong className="text-slate-900">{connectedRemotes}</strong></span>
            </div>
          </div>
        </header>
      )}

      {isFullscreen && (
        <button
          onClick={toggleFullscreen}
          className="absolute top-4 right-4 z-50 flex items-center space-x-2 text-xs text-white bg-slate-900/80 hover:bg-slate-800 px-3 py-1.5 rounded-lg backdrop-blur-md border border-slate-700 shadow-xl"
        >
          <Minimize className="w-3.5 h-3.5" />
          <span>Exit Fullscreen</span>
        </button>
      )}

      <div className={`flex-1 grid p-6 gap-6 max-w-7xl mx-auto w-full items-center ${isFullscreen ? 'grid-cols-1 max-w-full !p-0 !m-0 h-full w-full' : 'grid-cols-1 lg:grid-cols-4'}`}>
        <div className={`${isFullscreen ? 'col-span-1 h-full w-full flex items-center justify-center bg-black' : 'lg:col-span-3'} flex flex-col items-center justify-center bg-white rounded-3xl border border-blue-100 p-4 shadow-xl shadow-blue-500/5 min-h-[620px] relative w-full h-full`}>
          {fileUrl ? (
            <div className="w-full h-full flex flex-col items-center justify-center">
              <object
                key={currentSlide}
                data={`${fileUrl}#page=${currentSlide}&toolbar=0&navpanes=0&scrollbar=0&view=FitH`}
                type="application/pdf"
                className={`w-full rounded-2xl border border-slate-200 bg-white overflow-hidden ${isFullscreen ? '!h-screen !w-screen !rounded-none !border-none' : 'h-[620px]'}`}
              >
                <iframe
                  src={`${fileUrl}#page=${currentSlide}&toolbar=0&navpanes=0&scrollbar=0`}
                  className={`w-full rounded-2xl border border-slate-200 bg-white ${isFullscreen ? '!h-screen !w-screen !rounded-none !border-none' : 'h-[620px]'}`}
                  title="Presentation Viewer"
                />
              </object>
              {!isFullscreen && (
                <div className="mt-4 text-sm text-slate-600 font-semibold">
                  Slide <span className="text-blue-600 font-extrabold">{currentSlide}</span>
                </div>
              )}
            </div>
          ) : (
            <div className="text-slate-400">Loading presentation file...</div>
          )}
        </div>

        {!isFullscreen && (
          <div className="flex flex-col space-y-6">
            <div className="bg-white rounded-3xl border border-blue-100 p-6 text-center shadow-xl shadow-blue-500/5">
              <div className="flex items-center justify-center space-x-2 mb-4 text-blue-600 font-bold text-sm">
                <QrCode className="w-5 h-5" />
                <span>Scan to Control via Phone</span>
              </div>
              
              <div className="bg-slate-50 p-4 rounded-2xl inline-block shadow-sm border border-slate-100 mb-4 min-h-[160px] min-w-[160px]">
                {mounted && remoteUrl ? (
                  <QRCodeCanvas value={remoteUrl} size={160} level="M" />
                ) : (
                  <div className="w-[160px] h-[160px] bg-slate-200 animate-pulse rounded-lg" />
                )}
              </div>

              <p className="text-xs text-slate-500 leading-relaxed">
                Open your smartphone camera and scan the QR code to pair your controller instantly.
              </p>
            </div>

            <div className="bg-white rounded-3xl border border-blue-100 p-6 flex flex-col space-y-3 shadow-xl shadow-blue-500/5">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Laptop Controls</span>
              <div className="flex gap-3">
                <button
                  onClick={() => setCurrentSlide((p) => Math.max(p - 1, 1))}
                  className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl flex items-center justify-center space-x-2 transition-all border border-slate-200"
                >
                  <ChevronLeft className="w-5 h-5" />
                  <span>Prev</span>
                </button>
                <button
                  onClick={() => setCurrentSlide((p) => p + 1)}
                  className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl flex items-center justify-center space-x-2 transition-all shadow-md shadow-blue-600/20"
                >
                  <span>Next</span>
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function PresenterScreen() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50 text-slate-900 flex items-center justify-center">Loading Presenter Session...</div>}>
      <PresenterContent />
    </Suspense>
  );
}