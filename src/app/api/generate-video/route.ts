import { NextRequest, NextResponse } from 'next/server';
import { generateVideo, validateVideoRequest, VideoGenerationError } from '@/lib/video-api';
import { VideoGenerationRequest } from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as VideoGenerationRequest;
    
    // Validate the request
    const validationErrors = validateVideoRequest(body);
    if (validationErrors.length > 0) {
      return NextResponse.json(
        { 
          error: 'Validation failed', 
          details: validationErrors 
        },
        { status: 400 }
      );
    }

    // Log the generation request
    console.log('Video generation requested:', {
      prompt: body.prompt.substring(0, 100) + '...',
      duration: body.duration,
      aspectRatio: body.aspectRatio,
      style: body.style
    });

    // Generate the video
    const result = await generateVideo(body);

    // Return appropriate response based on status
    if (result.status === 'failed') {
      return NextResponse.json(
        { 
          error: 'Video generation failed', 
          details: result.error,
          id: result.id 
        },
        { status: 500 }
      );
    }

    return NextResponse.json(result, { status: 200 });

  } catch (error) {
    console.error('API Error in generate-video:', error);

    if (error instanceof VideoGenerationError) {
      return NextResponse.json(
        { 
          error: 'Video generation failed', 
          details: error.message 
        },
        { status: error.statusCode || 500 }
      );
    }

    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { 
          error: 'Invalid JSON in request body' 
        },
        { status: 400 }
      );
    }

    const isDevelopment = typeof process !== 'undefined' && process.env?.NODE_ENV === 'development';
    const errorMessage = error instanceof Error ? error.message : String(error);
    
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: isDevelopment ? errorMessage : 'An unexpected error occurred'
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    {
      message: 'Video Generation API',
      version: '1.0.0',
      endpoints: {
        'POST /api/generate-video': 'Generate a new video from text prompt',
        'GET /api/video-status': 'Check video generation status'
      },
      supportedFormats: {
        aspectRatios: ['16:9', '9:16', '1:1', '4:3', '21:9'],
        styles: ['realistic', 'animated', 'cinematic', 'artistic', 'documentary', 'abstract'],
        durations: [3, 5, 10, 15, 30]
      }
    },
    { status: 200 }
  );
}