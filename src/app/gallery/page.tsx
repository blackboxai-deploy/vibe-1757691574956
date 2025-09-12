'use client';

import { VideoGallery } from '@/components/video-gallery';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

export default function GalleryPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
                Video Gallery
              </h1>
              <p className="text-xl text-gray-600">
                Browse, manage, and download your AI-generated videos
              </p>
            </div>
            <Button asChild className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
              <Link href="/generate">Create New Video</Link>
            </Button>
          </div>
        </div>

        <VideoGallery />

        {/* Stats and Management */}
        <div className="mt-12">
          <Card>
            <CardHeader>
              <CardTitle>Gallery Management</CardTitle>
              <CardDescription>
                Manage your video collection and storage
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600 mb-1">
                    {typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('videoai_generated_videos') || '[]').length : 0}
                  </div>
                  <div className="text-sm text-gray-600">Total Videos</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600 mb-1">
                    {typeof window !== 'undefined' ? 
                      Math.round((JSON.stringify(localStorage.getItem('videoai_generated_videos') || '[]').length / 1024)) : 0}KB
                  </div>
                  <div className="text-sm text-gray-600">Storage Used</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      if (typeof window !== 'undefined' && confirm('Are you sure you want to clear all videos? This cannot be undone.')) {
                        localStorage.removeItem('videoai_generated_videos');
                        window.location.reload();
                      }
                    }}
                    className="text-red-600 hover:text-red-700"
                  >
                    Clear All
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}