import { NextRequest, NextResponse } from 'next/server';
import { checkVideoStatus } from '@/lib/video-api';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const videoId = searchParams.get('id');

    if (!videoId) {
      return NextResponse.json(
        { 
          error: 'Missing video ID parameter' 
        },
        { status: 400 }
      );
    }

    const status = await checkVideoStatus(videoId);

    if (!status) {
      return NextResponse.json(
        { 
          error: 'Video not found or status unavailable' 
        },
        { status: 404 }
      );
    }

    return NextResponse.json(status, { status: 200 });

  } catch (error) {
    console.error('API Error in video-status:', error);

    const errorMessage = error instanceof Error ? error.message : String(error);
    
    return NextResponse.json(
      { 
        error: 'Failed to check video status',
        details: errorMessage
      },
      { status: 500 }
    );
  }
}

export async function POST() {
  return NextResponse.json(
    {
      error: 'Method not allowed. Use GET to check video status.',
      usage: 'GET /api/video-status?id=VIDEO_ID'
    },
    { status: 405 }
  );
}