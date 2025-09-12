// TypeScript types and interfaces for AI Video Generation App

export interface VideoGenerationRequest {
  prompt: string;
  duration?: number;
  aspectRatio?: string;
  style?: string;
  model?: string;
}

export interface VideoGenerationResponse {
  id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  videoUrl?: string;
  thumbnailUrl?: string;
  prompt: string;
  duration?: number;
  aspectRatio?: string;
  style?: string;
  createdAt: string;
  completedAt?: string;
  error?: string;
  estimatedTime?: number;
}

export interface GeneratedVideo {
  id: string;
  prompt: string;
  videoUrl: string;
  thumbnailUrl?: string;
  duration: number;
  aspectRatio: string;
  style: string;
  createdAt: string;
  fileSize?: string;
  model: string;
}

export interface VideoGenerationSettings {
  defaultDuration: number;
  defaultAspectRatio: string;
  defaultStyle: string;
  systemPrompt: string;
  maxConcurrentGenerations: number;
}

export interface PromptTemplate {
  id: string;
  name: string;
  prompt: string;
  category: string;
  preview?: string;
  tags: string[];
}

export interface GenerationProgress {
  id: string;
  stage: 'initializing' | 'processing' | 'rendering' | 'finalizing';
  progress: number; // 0-100
  message: string;
  estimatedTimeRemaining?: number;
}

export const VIDEO_ASPECT_RATIOS = {
  '16:9': 'Landscape (16:9)',
  '9:16': 'Portrait (9:16)',
  '1:1': 'Square (1:1)',
  '4:3': 'Classic (4:3)',
  '21:9': 'Cinematic (21:9)'
} as const;

export const VIDEO_STYLES = {
  'realistic': 'Realistic',
  'animated': 'Animated',
  'cinematic': 'Cinematic',
  'artistic': 'Artistic',
  'documentary': 'Documentary',
  'abstract': 'Abstract'
} as const;

export const VIDEO_DURATIONS = {
  3: '3 seconds',
  5: '5 seconds',
  10: '10 seconds',
  15: '15 seconds',
  30: '30 seconds'
} as const;

export type AspectRatio = keyof typeof VIDEO_ASPECT_RATIOS;
export type VideoStyle = keyof typeof VIDEO_STYLES;
export type VideoDuration = keyof typeof VIDEO_DURATIONS;