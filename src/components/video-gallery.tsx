'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { VideoPlayer } from './video-player';
import { GeneratedVideo } from '@/lib/types';
import { StorageManager } from '@/lib/storage';

interface VideoGalleryProps {
  limit?: number;
  showSearch?: boolean;
  showFilters?: boolean;
}

export function VideoGallery({ 
  limit, 
  showSearch = true, 
  showFilters = true 
}: VideoGalleryProps) {
  const [videos, setVideos] = useState<GeneratedVideo[]>([]);
  const [filteredVideos, setFilteredVideos] = useState<GeneratedVideo[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'duration'>('newest');
  const [filterByStyle, setFilterByStyle] = useState<string>('all');
  const [selectedVideo, setSelectedVideo] = useState<GeneratedVideo | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadVideos();
  }, []);

  useEffect(() => {
    filterAndSortVideos();
  }, [videos, searchQuery, sortBy, filterByStyle, limit]);

  const loadVideos = () => {
    try {
      const storedVideos = StorageManager.getVideos();
      setVideos(storedVideos);
    } catch (error) {
      console.error('Failed to load videos:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterAndSortVideos = () => {
    let filtered = videos;

    // Search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(video =>
        video.prompt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        video.style.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Style filter
    if (filterByStyle !== 'all') {
      filtered = filtered.filter(video => video.style === filterByStyle);
    }

    // Sort
    filtered = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'duration':
          return b.duration - a.duration;
        default:
          return 0;
      }
    });

    // Apply limit
    if (limit) {
      filtered = filtered.slice(0, limit);
    }

    setFilteredVideos(filtered);
  };

  const handleDeleteVideo = (videoId: string) => {
    StorageManager.deleteVideo(videoId);
    setVideos(prev => prev.filter(v => v.id !== videoId));
  };

  const handleDownload = (video: GeneratedVideo) => {
    const link = document.createElement('a');
    link.href = video.videoUrl;
    link.download = `video-${video.id}.mp4`;
    link.click();
  };

  const getUniqueStyles = () => {
    const styles = [...new Set(videos.map(v => v.style))];
    return styles;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-2 border-purple-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your videos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters and Search */}
      {(showSearch || showFilters) && (
        <Card>
          <CardHeader>
            <CardTitle>Video Gallery</CardTitle>
            <CardDescription>
              {videos.length === 0 
                ? "No videos generated yet. Start creating your first video!" 
                : `${videos.length} video${videos.length === 1 ? '' : 's'} generated`
              }
            </CardDescription>
          </CardHeader>
          {videos.length > 0 && (
            <CardContent className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-4">
                {showSearch && (
                  <div className="flex-1">
                    <Input
                      placeholder="Search videos by prompt or style..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full"
                    />
                  </div>
                )}
                
                {showFilters && (
                  <div className="flex gap-2">
                    <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
                      <SelectTrigger className="w-36">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="newest">Newest First</SelectItem>
                        <SelectItem value="oldest">Oldest First</SelectItem>
                        <SelectItem value="duration">By Duration</SelectItem>
                      </SelectContent>
                    </Select>

                    <Select value={filterByStyle} onValueChange={setFilterByStyle}>
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Styles</SelectItem>
                        {getUniqueStyles().map((style: string) => (
                          <SelectItem key={style} value={style}>
                            {style.charAt(0).toUpperCase() + style.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>
            </CardContent>
          )}
        </Card>
      )}

      {/* Videos Grid */}
      {filteredVideos.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            {videos.length === 0 ? (
              <div>
                <div className="text-4xl mb-4">🎬</div>
                <h3 className="text-lg font-semibold mb-2">No Videos Yet</h3>
                <p className="text-gray-600 mb-4">Create your first AI-generated video to get started!</p>
                <Button asChild>
                  <a href="/generate">Generate Video</a>
                </Button>
              </div>
            ) : (
              <div>
                <div className="text-4xl mb-4">🔍</div>
                <h3 className="text-lg font-semibold mb-2">No Videos Found</h3>
                <p className="text-gray-600">Try adjusting your search or filters.</p>
              </div>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVideos.map((video) => (
            <Card key={video.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <CardContent className="p-0">
                {/* Video Thumbnail/Preview */}
                <div className="relative aspect-video bg-black group cursor-pointer">
                  <video
                    src={video.videoUrl}
                    poster={video.thumbnailUrl}
                    className="w-full h-full object-cover"
                    muted
                    onMouseEnter={(e) => e.currentTarget.play()}
                    onMouseLeave={(e) => {
                      e.currentTarget.pause();
                      e.currentTarget.currentTime = 0;
                    }}
                  />
                  
                  {/* Play Overlay */}
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="lg"
                          className="bg-white/20 backdrop-blur text-white border-white/30 hover:bg-white/30"
                          onClick={() => setSelectedVideo(video)}
                        >
                          <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z"/>
                          </svg>
                          Play
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl">
                        <DialogHeader>
                          <DialogTitle>Video Preview</DialogTitle>
                          <DialogDescription>
                            Generated on {formatDate(video.createdAt)}
                          </DialogDescription>
                        </DialogHeader>
                        {selectedVideo && (
                          <VideoPlayer 
                            video={selectedVideo} 
                            autoPlay={true}
                            onDownload={() => handleDownload(selectedVideo)}
                          />
                        )}
                      </DialogContent>
                    </Dialog>
                  </div>

                  {/* Duration Badge */}
                  <Badge className="absolute top-2 right-2 bg-black/80 text-white">
                    {video.duration}s
                  </Badge>
                </div>

                {/* Video Info */}
                <div className="p-4 space-y-3">
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {video.prompt}
                    </p>
                    
                    <div className="flex flex-wrap gap-1">
                      <Badge variant="secondary" className="text-xs">
                        {video.style}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {video.aspectRatio}
                      </Badge>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">
                      {formatDate(video.createdAt)}
                    </span>
                    
                    <div className="flex gap-1">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDownload(video)}
                      >
                        Download
                      </Button>
                      
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            Delete
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Video</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete this video? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDeleteVideo(video.id)}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}