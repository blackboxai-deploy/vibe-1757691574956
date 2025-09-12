import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Navigation } from '@/components/navigation';
import { Toaster } from '@/components/ui/sonner';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'VideoAI - AI Video Generation Platform',
  description: 'Create stunning videos from text prompts using advanced AI models. Transform your ideas into professional videos in seconds.',
  keywords: 'AI video generation, text to video, video creation, artificial intelligence, video maker',
  authors: [{ name: 'VideoAI Team' }],
  openGraph: {
    title: 'VideoAI - AI Video Generation Platform',
    description: 'Create stunning videos from text prompts using advanced AI models.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'VideoAI - AI Video Generation Platform',
    description: 'Create stunning videos from text prompts using advanced AI models.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} antialiased bg-gray-50`}>
        <div className="min-h-screen flex flex-col">
          <Navigation />
          <main className="flex-1">
            {children}
          </main>
          <footer className="bg-white border-t border-gray-200 py-8 mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col md:flex-row justify-between items-center">
                <div className="flex items-center space-x-2 mb-4 md:mb-0">
                  <div className="w-6 h-6 bg-gradient-to-r from-purple-600 to-blue-600 rounded-md flex items-center justify-center">
                    <span className="text-white font-bold text-xs">V</span>
                  </div>
                  <span className="text-lg font-semibold text-gray-900">VideoAI</span>
                </div>
                <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6 text-sm text-gray-600">
                  <span>Powered by advanced AI models</span>
                  <span className="hidden md:block">•</span>
                  <span>© 2024 VideoAI. All rights reserved.</span>
                </div>
              </div>
            </div>
          </footer>
        </div>
        <Toaster 
          position="bottom-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#ffffff',
              color: '#374151',
              border: '1px solid #e5e7eb',
            },
          }}
        />
      </body>
    </html>
  );
}