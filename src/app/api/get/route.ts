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

      // Return empty array when SUNO_COOKIE is invalid/missing
      return new NextResponse(JSON.stringify([]), {
        status: 200,
        headers: {
    try {
      const api = await sunoApi(cookie);
      const songs = await api.get(
        ids ? ids.split(',') : undefined,
        page
      );
      return NextResponse.json(songs);
    } catch (authError: any) {
      // Handle authentication errors gracefully
      if (authError.message?.includes('Failed to get session id') || 
          authError.message?.includes('SUNO_COOKIE')) {
        console.warn('Authentication failed, returning empty array:', authError.message);
        return NextResponse.json([]);
      }
      throw authError;
    }
  } else {
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
