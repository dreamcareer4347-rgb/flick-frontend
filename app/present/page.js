'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FileUp, Loader2, Presentation, Shield, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

const API_URL = process.env.NEXT_PUBLIC_FLICK_API_URL || 'http://localhost:8000';

export default function PresentPage() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();

  const handleFileChange = (e) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      setError(null);
    } else {
      setError('Please select a valid presentation file.');
    }
  };

  const handleStartPresentation = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch(`${API_URL}/api/sessions`, {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) throw new Error('Failed to create session');
      const data = await res.json();

      const fileStreamUrl = `${API_URL}/api/sessions/${data.sessionId}/file`;
      sessionStorage.setItem(`flick_pdf_${data.sessionId}`, fileStreamUrl);
      sessionStorage.setItem(`flick_token_${data.sessionId}`, data.presenterToken);

      router.push(`/presenter/${data.sessionId}?token=${data.presenterToken}`);
    } catch (err) {
      setError('Backend se connect nahi ho paya. Check karein ki uvicorn server port 8000 par chal raha hai.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-between">
      <header className="bg-white border-b border-blue-100 px-6 py-4 flex items-center justify-between shadow-sm">
        <Link href="/" className="flex items-center space-x-2 text-slate-600 hover:text-blue-600 font-semibold text-sm">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>
        <span className="text-xl font-black text-blue-600">⚡ Flick</span>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-6 max-w-xl mx-auto w-full">
        <div className="w-full bg-white border border-blue-100 rounded-3xl p-8 shadow-xl shadow-blue-500/5 text-center">
          <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Presentation className="w-8 h-8" />
          </div>

          <h1 className="text-2xl font-black text-slate-900 mb-2">Select Your Presentation</h1>
          <p className="text-slate-500 text-sm mb-8">Upload any PDF, PPT, or PPTX. It will auto-convert and launch seamlessly!</p>

          <label className="flex flex-col items-center justify-center border-2 border-dashed border-blue-200 rounded-2xl p-8 cursor-pointer hover:border-blue-500 hover:bg-blue-50/50 transition-all bg-slate-50/50 mb-6">
            <FileUp className="w-10 h-10 text-blue-600 mb-3" />
            <span className="text-sm font-bold text-slate-800 mb-1">
              {file ? file.name : 'Click to browse presentation file'}
            </span>
            <span className="text-xs text-slate-400">PDF, PPT, PPTX automatically converted</span>
            <input 
              type="file" 
              accept=".pdf,.ppt,.pptx,application/pdf,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation" 
              onChange={handleFileChange} 
              className="hidden" 
            />
          </label>

          {error && <div className="text-rose-600 text-sm mb-4 font-semibold">{error}</div>}

          <button
            onClick={handleStartPresentation}
            disabled={!file || loading}
            className="w-full py-4 px-6 rounded-2xl bg-blue-600 text-white font-bold shadow-lg shadow-blue-600/30 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center justify-center space-x-2"
          >
            {loading && <Loader2 className="w-5 h-5 animate-spin" />}
            <span>{loading ? 'Converting & Launching...' : 'Launch Presentation Mode'}</span>
          </button>

          <div className="mt-6 flex items-center justify-center space-x-2 text-xs text-slate-400">
            <Shield className="w-4 h-4 text-blue-500" />
            <span>Automatic background conversion & secure single-session locking enabled.</span>
          </div>
        </div>
      </main>

      <footer className="text-center py-4 text-xs text-slate-400">
        Flick Presentation Selector
      </footer>
    </div>
  );
}