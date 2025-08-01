import { NextResponse, NextRequest } from "next/server";
import { cookies } from 'next/headers'
import { sunoApi } from "@/lib/SunoApi";
import { corsHeaders } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  if (req.method === 'GET') {
    try {
      const cookieString = (await cookies()).toString();
      const api = await sunoApi(cookieString);
      const limit = await api.get_credits();
      
      return new NextResponse(JSON.stringify(limit), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      });
    } catch (error) {
      console.error('Error fetching limit:', error instanceof Error ? error.message : error);
      
      // Handle specific authentication errors
      if (error instanceof Error && 
          (error.message.includes('Failed to get session id') || 
           error.message.includes('SUNO_COOKIE') ||
           error.message.includes('invalid or expired'))) {
        console.warn('Authentication failed, returning mock data:', error.message);
      }
      
      // Return mock data for any error to prevent crashes
      const mockLimit = {
        credits_left: 0,
        period: "day",
        monthly_limit: 50,
        monthly_usage: 0,
        error: "SUNO_COOKIE not configured properly"
      };
      
      return new NextResponse(JSON.stringify(mockLimit), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      });
    }
  } else {
    return new NextResponse('Method Not Allowed', {
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