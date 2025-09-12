import { VideoGenerationRequest, VideoGenerationResponse } from './types';

// Custom endpoint configuration for AI video generation
const API_ENDPOINT = 'https://oi-server.onrender.com/chat/completions';
const DEFAULT_MODEL = 'replicate/google/veo-3';

// Required headers for the custom endpoint
const API_HEADERS = {
  'customerId': 'cus_T2e5YUvjva1jn8',
  'Content-Type': 'application/json',
  'Authorization': 'Bearer xxx'
};

export class VideoGenerationError extends Error {
  constructor(message: string, public statusCode?: number) {
    super(message);
    this.name = 'VideoGenerationError';
  }
}

export interface VideoAPIResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: Array<{
    index: number;
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }>;
}

export async function generateVideo(request: VideoGenerationRequest): Promise<VideoGenerationResponse> {
  const startTime = Date.now();
  
  try {
    // Build the prompt with video parameters
    const enhancedPrompt = buildVideoPrompt(request);
    
    const requestBody = {
      model: request.model || DEFAULT_MODEL,
      messages: [
        {
          role: 'user',
          content: enhancedPrompt
        }
      ]
    };

    console.log('Sending video generation request:', { 
      model: requestBody.model, 
      prompt: enhancedPrompt.substring(0, 100) + '...' 
    });

    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: API_HEADERS,
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error Response:', errorText);
      throw new VideoGenerationError(
        `API request failed: ${response.status} ${response.statusText}`,
        response.status
      );
    }

    const data: VideoAPIResponse = await response.json();
    
    if (!data.choices || data.choices.length === 0) {
      throw new VideoGenerationError('No video generation result received');
    }

    const content = data.choices[0].message.content;
    
    // Parse the response to extract video URL
    const videoUrl = extractVideoUrl(content);
    
    if (!videoUrl) {
      throw new VideoGenerationError('No video URL found in response');
    }

    const generationResponse: VideoGenerationResponse = {
      id: generateId(),
      status: 'completed',
      videoUrl: videoUrl,
      prompt: request.prompt,
      duration: request.duration || 5,
      aspectRatio: request.aspectRatio || '16:9',
      style: request.style || 'realistic',
      createdAt: new Date().toISOString(),
      completedAt: new Date().toISOString(),
      estimatedTime: Math.round((Date.now() - startTime) / 1000)
    };

    console.log('Video generation completed:', { 
      id: generationResponse.id, 
      duration: generationResponse.estimatedTime + 's' 
    });

    return generationResponse;

  } catch (error) {
    console.error('Video generation error:', error);
    
    const errorResponse: VideoGenerationResponse = {
      id: generateId(),
      status: 'failed',
      prompt: request.prompt,
      duration: request.duration || 5,
      aspectRatio: request.aspectRatio || '16:9',
      style: request.style || 'realistic',
      createdAt: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Unknown error occurred',
      estimatedTime: Math.round((Date.now() - startTime) / 1000)
    };

    return errorResponse;
  }
}

function buildVideoPrompt(request: VideoGenerationRequest): string {
  let prompt = request.prompt;

  // Add style specifications
  if (request.style && request.style !== 'realistic') {
    prompt += ` in ${request.style} style`;
  }

  // Add duration specification
  if (request.duration) {
    prompt += `. Video duration: ${request.duration} seconds`;
  }

  // Add aspect ratio specification
  if (request.aspectRatio) {
    prompt += `. Aspect ratio: ${request.aspectRatio}`;
  }

  // Add quality enhancements
  prompt += '. High quality, smooth motion, professional cinematography';

  return prompt;
}

function extractVideoUrl(content: string): string | null {
  try {
    // Try to parse as JSON first (common API response format)
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      if (parsed.video_url || parsed.videoUrl || parsed.url) {
        return parsed.video_url || parsed.videoUrl || parsed.url;
      }
    }

    // Look for direct URL patterns
    const urlPatterns = [
      /https?:\/\/[^\s"'>]+\.mp4/gi,
      /https?:\/\/[^\s"'>]+\.mov/gi,
      /https?:\/\/[^\s"'>]+\.avi/gi,
      /https?:\/\/[^\s"'>]+\.webm/gi,
      /https?:\/\/replicate\.delivery\/[^\s"'>]+/gi,
      /https?:\/\/[^\s"'>]+\/video[^\s"'>]*/gi
    ];

    for (const pattern of urlPatterns) {
      const match = content.match(pattern);
      if (match) {
        return match[0];
      }
    }

    // If content looks like a direct URL
    if (content.trim().startsWith('http') && content.trim().includes('.')) {
      return content.trim();
    }

    return null;
  } catch (error) {
    console.error('Error extracting video URL:', error);
    return null;
  }
}

function generateId(): string {
  return 'video_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now().toString(36);
}

export async function checkVideoStatus(_videoId: string): Promise<VideoGenerationResponse | null> {
  // For this implementation, we'll simulate status checking
  // In a real-world scenario, you might need to poll a status endpoint
  return null;
}

export function validateVideoRequest(request: VideoGenerationRequest): string[] {
  const errors: string[] = [];

  if (!request.prompt || request.prompt.trim().length === 0) {
    errors.push('Prompt is required');
  }

  if (request.prompt && request.prompt.length > 1000) {
    errors.push('Prompt must be less than 1000 characters');
  }

  if (request.duration && (request.duration < 1 || request.duration > 30)) {
    errors.push('Duration must be between 1 and 30 seconds');
  }

  return errors;
}