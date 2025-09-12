'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { PromptTemplates } from './prompt-templates';
import { GenerationProgressComponent } from './generation-progress';
import { VideoPlayer } from './video-player';
import { VideoGenerationRequest, GeneratedVideo, VIDEO_ASPECT_RATIOS, VIDEO_STYLES, VIDEO_DURATIONS } from '@/lib/types';
import { StorageManager } from '@/lib/storage';

export function VideoGenerator() {
  const [prompt, setPrompt] = useState('');
  const [duration, setDuration] = useState<number>(5);
  const [aspectRatio, setAspectRatio] = useState<string>('16:9');
  const [style, setStyle] = useState<string>('realistic');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatingVideoId, setGeneratingVideoId] = useState<string | null>(null);
  const [generatedVideo, setGeneratedVideo] = useState<GeneratedVideo | null>(null);
  const [systemPrompt, setSystemPrompt] = useState('Create a high-quality video with smooth motion and professional cinematography.');

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error('Please enter a prompt for your video');
      return;
    }

    setIsGenerating(true);
    setGeneratedVideo(null);
    const videoId = `video_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    setGeneratingVideoId(videoId);

    try {
      const request: VideoGenerationRequest = {
        prompt: `${systemPrompt}\n\n${prompt}`,
        duration,
        aspectRatio,
        style,
        model: 'replicate/google/veo-3'
      };

      const response = await fetch('/api/generate-video', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate video');
      }

      if (data.status === 'completed' && data.videoUrl) {
        const video: GeneratedVideo = {
          id: data.id,
          prompt: request.prompt,
          videoUrl: data.videoUrl,
          thumbnailUrl: data.thumbnailUrl,
          duration: data.duration,
          aspectRatio: data.aspectRatio,
          style: data.style,
          createdAt: data.createdAt,
          fileSize: data.fileSize,
          model: 'replicate/google/veo-3'
        };

        setGeneratedVideo(video);
        StorageManager.saveVideo(video);
        StorageManager.saveRecentPrompt(prompt);
        
        toast.success('Video generated successfully!');
      } else {
        throw new Error(data.error || 'Video generation failed');
      }

    } catch (error) {
      console.error('Generation error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to generate video');
    } finally {
      setIsGenerating(false);
      setGeneratingVideoId(null);
    }
  };

  const handleTemplateSelect = (templatePrompt: string) => {
    setPrompt(templatePrompt);
    toast.success('Template applied!');
  };

  const handleCancel = () => {
    setIsGenerating(false);
    setGeneratingVideoId(null);
    toast.info('Video generation cancelled');
  };

  const handleDownload = () => {
    if (generatedVideo) {
      const link = document.createElement('a');
      link.href = generatedVideo.videoUrl;
      link.download = `video-${generatedVideo.id}.mp4`;
      link.click();
      toast.success('Download started!');
    }
  };

  const recentPrompts = StorageManager.getRecentPrompts();

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8">
      {/* Generation Progress */}
      {isGenerating && generatingVideoId && (
        <div className="flex justify-center">
          <GenerationProgressComponent
            videoId={generatingVideoId}
            prompt={prompt}
            onCancel={handleCancel}
          />
        </div>
      )}

      {/* Generated Video Result */}
      {generatedVideo && !isGenerating && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <span>🎉</span>
              <span>Your Video is Ready!</span>
            </CardTitle>
            <CardDescription>
              Video generated successfully. You can preview, download, or generate another one.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <VideoPlayer 
              video={generatedVideo} 
              onDownload={handleDownload}
            />
          </CardContent>
        </Card>
      )}

      {/* Main Generation Interface */}
      {!isGenerating && (
        <Tabs defaultValue="generate" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="generate">Generate Video</TabsTrigger>
            <TabsTrigger value="templates">Browse Templates</TabsTrigger>
          </TabsList>

          <TabsContent value="generate" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Create AI Video</CardTitle>
                <CardDescription>
                  Describe your video in detail. The more specific you are, the better the result will be.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* System Prompt */}
                <div className="space-y-2">
                  <Label htmlFor="system-prompt" className="text-sm font-medium">
                    System Prompt (Advanced)
                  </Label>
                  <Textarea
                    id="system-prompt"
                    placeholder="Instructions for the AI model..."
                    value={systemPrompt}
                    onChange={(e) => setSystemPrompt(e.target.value)}
                    className="min-h-[80px] text-sm"
                  />
                  <p className="text-xs text-gray-500">
                    This prompt guides the overall style and quality of your video generation.
                  </p>
                </div>

                {/* Main Prompt */}
                <div className="space-y-2">
                  <Label htmlFor="prompt" className="text-sm font-medium">
                    Video Description *
                  </Label>
                  <Textarea
                    id="prompt"
                    placeholder="Describe your video in detail. Example: 'A majestic eagle soaring over snow-capped mountains at sunrise, with dramatic lighting and cinematic camera movement...'"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    className="min-h-[120px]"
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Be specific and detailed for best results</span>
                    <span>{prompt.length}/1000</span>
                  </div>
                </div>

                {/* Recent Prompts */}
                {recentPrompts.length > 0 && (
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Recent Prompts</Label>
                    <div className="flex flex-wrap gap-2">
                      {recentPrompts.slice(0, 3).map((recentPrompt, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          size="sm"
                          className="text-xs h-auto py-1 px-2"
                          onClick={() => setPrompt(recentPrompt)}
                        >
                          {recentPrompt.length > 50 ? `${recentPrompt.substring(0, 50)}...` : recentPrompt}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Video Parameters */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="duration">Duration</Label>
                    <Select value={duration.toString()} onValueChange={(value) => setDuration(Number(value))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select duration" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(VIDEO_DURATIONS).map(([seconds, label]) => (
                          <SelectItem key={seconds} value={seconds}>
                            {label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="aspect-ratio">Aspect Ratio</Label>
                    <Select value={aspectRatio} onValueChange={setAspectRatio}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select ratio" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(VIDEO_ASPECT_RATIOS).map(([ratio, label]) => (
                          <SelectItem key={ratio} value={ratio}>
                            {label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="style">Style</Label>
                    <Select value={style} onValueChange={setStyle}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select style" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(VIDEO_STYLES).map(([styleKey, label]) => (
                          <SelectItem key={styleKey} value={styleKey}>
                            {label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Current Settings Preview */}
                <div className="flex flex-wrap gap-2 p-4 bg-gray-50 rounded-lg">
                  <Badge variant="outline">
                    {VIDEO_DURATIONS[duration as keyof typeof VIDEO_DURATIONS]}
                  </Badge>
                  <Badge variant="outline">
                    {VIDEO_ASPECT_RATIOS[aspectRatio as keyof typeof VIDEO_ASPECT_RATIOS]}
                  </Badge>
                  <Badge variant="outline">
                    {VIDEO_STYLES[style as keyof typeof VIDEO_STYLES]}
                  </Badge>
                  <Badge variant="outline">
                    Veo-3 Model
                  </Badge>
                </div>

                {/* Generate Button */}
                <Button
                  onClick={handleGenerate}
                  disabled={!prompt.trim() || isGenerating}
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 h-12"
                  size="lg"
                >
                  {isGenerating ? 'Generating Video...' : 'Generate Video'}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="templates" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Prompt Templates</CardTitle>
                <CardDescription>
                  Choose from professionally crafted prompts to get started quickly
                </CardDescription>
              </CardHeader>
              <CardContent>
                <PromptTemplates onSelectTemplate={handleTemplateSelect} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}