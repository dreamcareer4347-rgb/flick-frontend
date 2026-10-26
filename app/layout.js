import './globals.css';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'Flick - Seamless Presentation & Remote Controller',
  description: 'Control your PDF and PPT presentations seamlessly via smartphone remote.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-slate-950 text-slate-100 flex flex-col min-h-screen selection:bg-blue-600 selection:text-white">
        <div className="flex-1 flex flex-col">
          {children}
        </div>
        <Footer />
      </body>
    </html>
  );
}