'use client';

import { VideoGenerator } from '@/components/video-generator';

export default function GeneratePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            AI Video Generator
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Create stunning videos from text descriptions using advanced AI models. 
            Transform your ideas into professional videos in minutes.
          </p>
        </div>

        <VideoGenerator />
      </div>
    </div>
  );
}