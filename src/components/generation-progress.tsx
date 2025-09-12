'use client';

import { useState, useEffect } from 'react';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { GenerationProgress } from '@/lib/types';

interface GenerationProgressProps {
  videoId: string;
  prompt: string;
  onComplete?: (videoUrl: string) => void;
  onCancel?: () => void;
}

export function GenerationProgressComponent({ 
  videoId, 
  prompt, 
  onComplete: _onComplete, 
  onCancel 
}: GenerationProgressProps) {
  const [progress, setProgress] = useState<GenerationProgress>({
    id: videoId,
    stage: 'initializing',
    progress: 0,
    message: 'Initializing video generation...',
    estimatedTimeRemaining: 60
  });

  const [elapsedTime, setElapsedTime] = useState(0);
  const [isCompleted, _setIsCompleted] = useState(false);
  const [isCancelled, setIsCancelled] = useState(false);

  useEffect(() => {
    if (isCompleted || isCancelled) return;

    const interval = setInterval(() => {
      setElapsedTime(prev => prev + 1);
      
      // Simulate progress updates
      setProgress(prev => {
        const newProgress = Math.min(prev.progress + Math.random() * 5, 95);
        let newStage = prev.stage;
        let newMessage = prev.message;
        let timeRemaining = Math.max(60 - elapsedTime, 5);

        if (newProgress < 25) {
          newStage = 'initializing';
          newMessage = 'Setting up AI models and processing your prompt...';
        } else if (newProgress < 50) {
          newStage = 'processing';
          newMessage = 'Generating video frames with AI...';
        } else if (newProgress < 80) {
          newStage = 'rendering';
          newMessage = 'Rendering video with smooth transitions...';
        } else if (newProgress < 95) {
          newStage = 'finalizing';
          newMessage = 'Finalizing video and preparing download...';
        }

        return {
          ...prev,
          progress: newProgress,
          stage: newStage,
          message: newMessage,
          estimatedTimeRemaining: timeRemaining
        };
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [elapsedTime, isCompleted, isCancelled]);

  const handleCancel = () => {
    setIsCancelled(true);
    onCancel?.();
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getStageColor = (stage: string) => {
    switch (stage) {
      case 'initializing': return 'bg-blue-500';
      case 'processing': return 'bg-purple-500';
      case 'rendering': return 'bg-orange-500';
      case 'finalizing': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getStageEmoji = (stage: string) => {
    switch (stage) {
      case 'initializing': return '🚀';
      case 'processing': return '🎬';
      case 'rendering': return '🎨';
      case 'finalizing': return '✨';
      default: return '⚙️';
    }
  };

  if (isCompleted) {
    return (
      <Card className="w-full max-w-md mx-auto border-green-200 bg-green-50">
        <CardContent className="p-6 text-center">
          <div className="text-4xl mb-4">🎉</div>
          <h3 className="text-lg font-semibold text-green-800 mb-2">
            Video Generated Successfully!
          </h3>
          <p className="text-green-600 text-sm">
            Your video is ready for download and preview.
          </p>
        </CardContent>
      </Card>
    );
  }

  if (isCancelled) {
    return (
      <Card className="w-full max-w-md mx-auto border-red-200 bg-red-50">
        <CardContent className="p-6 text-center">
          <div className="text-4xl mb-4">❌</div>
          <h3 className="text-lg font-semibold text-red-800 mb-2">
            Generation Cancelled
          </h3>
          <p className="text-red-600 text-sm">
            Video generation has been stopped.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardContent className="p-6">
        <div className="space-y-6">
          {/* Header */}
          <div className="text-center">
            <div className="text-3xl mb-2">{getStageEmoji(progress.stage)}</div>
            <h3 className="text-lg font-semibold text-gray-900">
              Generating Your Video
            </h3>
            <p className="text-sm text-gray-600 line-clamp-2 mt-1">
              "{prompt}"
            </p>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Badge 
                variant="secondary"
                className={`${getStageColor(progress.stage)} text-white`}
              >
                {progress.stage.charAt(0).toUpperCase() + progress.stage.slice(1)}
              </Badge>
              <span className="text-sm text-gray-500">
                {Math.round(progress.progress)}%
              </span>
            </div>
            <Progress 
              value={progress.progress} 
              className="w-full h-2"
            />
          </div>

          {/* Status Message */}
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-2">
              {progress.message}
            </p>
            <div className="flex justify-center space-x-4 text-xs text-gray-500">
              <span>Elapsed: {formatTime(elapsedTime)}</span>
              <span>•</span>
              <span>Est. remaining: {formatTime(progress.estimatedTimeRemaining || 0)}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-center pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCancel}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              Cancel Generation
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}