import { NextResponse, NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import { sunoApi } from '@/lib/SunoApi';
import { corsHeaders } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  if (req.method === 'GET') {
    try {
      const url = new URL(req.url);
      const songIds = url.searchParams.get('ids');
      const page = url.searchParams.get('page');
      const cookie = (await cookies()).toString();

      let audioInfo = [];
      if (songIds && songIds.length > 0) {
        const idsArray = songIds.split(',');
        audioInfo = await (await sunoApi(cookie)).get(idsArray, page);
      } else {
        audioInfo = await (await sunoApi(cookie)).get(undefined, page);
      }

      return new NextResponse(JSON.stringify(audioInfo), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      });
    } catch (error) {
      console.error('Error fetching audio:', error);

      // Handle specific authentication errors
      if (error instanceof Error && 
          (error.message.includes('Failed to get session id') || 
           error.message.includes('SUNO_COOKIE') ||
           error.message.includes('invalid or expired'))) {
        console.warn('Authentication failed, returning empty array:', error.message);
        return new NextResponse(JSON.stringify([]), {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders
          }
        });
      }
      
      // For other errors, still return empty array to prevent crashes
      return new NextResponse(JSON.stringify([]), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      });
    }
  } else {
    return new NextResponse(null, {
      headers: {
        Allow: 'GET',
        ...corsHeaders
      },
      status: 405
    });
  }
}

export async function OPTIONS(request: Request) {
  return new Response(null, {
    status: 200,
    headers: corsHeaders
  });
}
