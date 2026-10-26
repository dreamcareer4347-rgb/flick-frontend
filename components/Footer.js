export default function Footer() {
  return (
    <footer className="w-full bg-white border-t border-blue-100 py-6 px-8 text-slate-500 text-xs shadow-sm">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-2">
          <span className="text-blue-600 font-black text-sm">⚡ Flick</span>
          <span className="text-slate-300">|</span>
          <span className="text-slate-500">Seamless Presentation & Remote Controller</span>
        </div>
        
        <div className="flex space-x-6 text-slate-600 font-medium">
          <span className="hover:text-blue-600 transition-colors cursor-pointer">Privacy Policy</span>
          <span className="hover:text-blue-600 transition-colors cursor-pointer">Terms of Service</span>
          <span className="hover:text-blue-600 transition-colors cursor-pointer">Support</span>
        </div>

        <div className="text-slate-400 font-mono">
          © 2026 Flick. All rights reserved.
        </div>
      </div>
    </footer>
  );
}