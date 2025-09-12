'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { GeneratedVideo } from '@/lib/types';

interface VideoPlayerProps {
  video: GeneratedVideo;
  autoPlay?: boolean;
  showControls?: boolean;
  onDownload?: () => void;
}

export function VideoPlayer({ 
  video, 
  autoPlay = false, 
  showControls = true,
  onDownload 
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    const handleLoadedMetadata = () => {
      setDuration(videoElement.duration);
      setIsLoading(false);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(videoElement.currentTime);
    };

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleError = () => {
      setError('Failed to load video. Please try again.');
      setIsLoading(false);
    };

    videoElement.addEventListener('loadedmetadata', handleLoadedMetadata);
    videoElement.addEventListener('timeupdate', handleTimeUpdate);
    videoElement.addEventListener('play', handlePlay);
    videoElement.addEventListener('pause', handlePause);
    videoElement.addEventListener('error', handleError);

    return () => {
      videoElement.removeEventListener('loadedmetadata', handleLoadedMetadata);
      videoElement.removeEventListener('timeupdate', handleTimeUpdate);
      videoElement.removeEventListener('play', handlePlay);
      videoElement.removeEventListener('pause', handlePause);
      videoElement.removeEventListener('error', handleError);
    };
  }, []);

  const togglePlay = () => {
    if (!videoRef.current) return;
    
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
  };

  const handleSeek = (value: number[]) => {
    if (!videoRef.current) return;
    const newTime = (value[0] / 100) * duration;
    videoRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleVolumeChange = (value: number[]) => {
    if (!videoRef.current) return;
    const newVolume = value[0] / 100;
    videoRef.current.volume = newVolume;
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    
    if (isMuted) {
      videoRef.current.volume = volume;
      setIsMuted(false);
    } else {
      videoRef.current.volume = 0;
      setIsMuted(true);
    }
  };

  const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleDownload = () => {
    if (onDownload) {
      onDownload();
    } else {
      // Fallback download method
      const link = document.createElement('a');
      link.href = video.videoUrl;
      link.download = `video-${video.id}.mp4`;
      link.click();
    }
  };

  return (
    <Card className="w-full overflow-hidden">
      <CardContent className="p-0">
        <div className="relative bg-black group">
          {/* Video Element */}
          <video
            ref={videoRef}
            src={video.videoUrl}
            autoPlay={autoPlay}
            loop
            muted={isMuted}
            className="w-full aspect-video object-contain"
            poster={video.thumbnailUrl}
          />

          {/* Loading State */}
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/80">
              <div className="text-center text-white">
                <div className="animate-spin w-8 h-8 border-2 border-white border-t-transparent rounded-full mx-auto mb-2"></div>
                <p className="text-sm">Loading video...</p>
              </div>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/80">
              <div className="text-center text-white p-4">
                <div className="text-4xl mb-2">⚠️</div>
                <p className="text-sm">{error}</p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-2 text-white border-white hover:bg-white hover:text-black"
                  onClick={() => {
                    setError(null);
                    setIsLoading(true);
                    if (videoRef.current) {
                      videoRef.current.load();
                    }
                  }}
                >
                  Retry
                </Button>
              </div>
            </div>
          )}

          {/* Play/Pause Overlay */}
          <div 
            className="absolute inset-0 flex items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={togglePlay}
          >
            <div className="bg-black/50 rounded-full p-4">
              {isPlaying ? (
                <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
                </svg>
              ) : (
                <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z"/>
                </svg>
              )}
            </div>
          </div>

          {/* Video Info Overlay */}
          <div className="absolute top-4 left-4 right-4 flex justify-between items-start opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="space-y-1">
              <Badge className="bg-black/80 text-white">
                {video.aspectRatio}
              </Badge>
              <Badge className="bg-black/80 text-white">
                {video.style}
              </Badge>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownload}
              className="bg-black/80 text-white border-white hover:bg-white hover:text-black"
            >
              Download
            </Button>
          </div>
        </div>

        {/* Controls */}
        {showControls && !error && (
          <div className="p-4 space-y-4">
            {/* Progress Bar */}
            <div className="space-y-1">
              <Slider
                value={[duration > 0 ? (currentTime / duration) * 100 : 0]}
                onValueChange={handleSeek}
                max={100}
                step={0.1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            {/* Control Buttons */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={togglePlay}
                >
                  {isPlaying ? 'Pause' : 'Play'}
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={toggleMute}
                >
                  {isMuted ? 'Unmute' : 'Mute'}
                </Button>

                {/* Volume Control */}
                <div className="flex items-center space-x-2 w-24">
                  <Slider
                    value={[isMuted ? 0 : volume * 100]}
                    onValueChange={handleVolumeChange}
                    max={100}
                    step={1}
                    className="flex-1"
                  />
                </div>
              </div>
            </div>

            {/* Video Metadata */}
            <div className="text-xs text-gray-500 pt-2 border-t">
              <p className="truncate mb-1">"{video.prompt}"</p>
              <div className="flex justify-between">
                <span>Duration: {video.duration}s</span>
                <span>Created: {new Date(video.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}